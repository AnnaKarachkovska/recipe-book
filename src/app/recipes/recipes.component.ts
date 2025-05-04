import { LiveAnnouncer } from "@angular/cdk/a11y";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component, DestroyRef, ElementRef, inject, OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { first, intersectionBy } from "lodash-es";
import { forkJoin, map, Observable, of, startWith, Subscription } from "rxjs";

import { Filter, FilterType } from "app/shared/models/data-types";
import { Meal } from "app/shared/models/meal.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { TranslocoService, translate } from "@ngneat/transloco";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.scss"],
})
export class RecipesComponent implements OnInit {
  @ViewChild("tagInput") tagInput: ElementRef<HTMLInputElement>;

  private announcer = inject(LiveAnnouncer);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translocoService = inject(TranslocoService);

  private mealDbService = inject(MealDbService);

  private allTags: Filter[] = [];
  private params: { category?: string, area?: string };
  private activeLanguage: string;

  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public tagControl = new FormControl("");
  public filteredTags: Observable<string[]>;
  public tags: Filter[] = [];
  public meals: Meal[] = [];

  public FilterType = FilterType;

  ngOnInit() {
    this.activeLanguage = this.translocoService.getActiveLang();

    this.filteredTags = this.tagControl.valueChanges.pipe(
      startWith(""),
      map(value => (value
        ? this.filter(value)
        : this.allTags
            .filter(tag => tag.type !== first(this.tags)?.type)
            .map(tag => tag.label)
      )),
    );

    this.route.queryParams.subscribe(params => {
      this.params = params;
      this.tags = [];

      if (Object.entries(params).length === 0) {
        this.mealDbService.getAllMeals().subscribe({
          next: (meals) => {
            this.meals = meals;
          },
          error: () => {
            this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" });
          }
        })
      } else {
        Object.entries(params).map(element => {
          this.translocoService.langChanges$.subscribe(() => {
            this.translateTag(element);
          })
        })
      }
    })

    forkJoin({
      categories: this.mealDbService.getCategories(),
      areas: this.mealDbService.getAreas(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ categories, areas }) => {
          this.allTags.push(
            ...categories.map(category => (
              {
                value: category.en,
                type: FilterType.Category,
                label: this.activeLanguage === "uk" ? category.uk : category.en,
              } as Filter)),
            ...areas.map(area => (
              {
                value: area.en,
                type: FilterType.Area,
                label: this.activeLanguage === "uk" ? area.uk : area.en,
              } as Filter))
          );
        },
        error: () => {
          this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" });
        }
      });
  }

  public add(event: MatChipInputEvent) {
    this.addTag((event.value || "").trim());
    this.tagInput.nativeElement.value = "";
  }

  public selected(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
  }

  public remove(tag: Filter) {
    const index = this.tags.indexOf(tag);

    let newParams = Object.assign({}, this.params);

    if (tag.type === FilterType.Area) {
      delete newParams.area;
    } else {
      delete newParams.category;
    }

    this.router.navigate(
      ["meals"],
      { queryParams: newParams }
    )

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagControl.enable();

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  private getMeals(tags: Filter[]) {
    if (tags.length === 0) {
      this.meals = [];
    }

    this.mealDbService.getMealsForSearch(tags).subscribe({
      next: (meals) => {
        if (meals.length > 1) {
          this.meals = intersectionBy(meals[0], meals[1], "id");
        } else {
          this.meals = meals[0];
        }
      },
      error: () => {
        this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" });
      }
    })
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags
      .filter(tag => tag.type !== first(this.tags)?.type && tag.label.toLowerCase().includes(filterValue))
      .map(tag => tag.label);
  }

  private translateTag(param: string[]) {
    this.mealDbService.translate(param[1]).subscribe(label => {
      const tagRepeatIndex = this.tags.findIndex(el => el.value === param[1]);

      if (tagRepeatIndex === -1) {
        this.tags.push({
          value: param[1],
          type: param[0] === "area" ? FilterType.Area : FilterType.Category,
          label: label,
        });
      } else {
        this.tags[tagRepeatIndex].label = label;
      }

      this.getMeals(this.tags);
    })
  }

  private addTag(value: string) {
    if (value === "") {
      return;
    }

    const tag = this.allTags.find(tag => tag.label.toLowerCase() === value.toLowerCase())
    if (tag !== undefined) {
      this.router.navigate(
        ["/meals"],
        {
          queryParams: tag.type === FilterType.Area ? { area: tag.value } : { category: tag.value },
          queryParamsHandling: "merge"
        },
      )
    } else {
      this.snackBar.open(
        translate("meals.noTagWithName", {value: value}), "OK",
      );
    }

    if (this.tags.length === 1) {
      this.tagControl.disable();
    }
  }
}
