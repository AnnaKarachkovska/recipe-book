import { Component, DestroyRef, inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { catchError, debounceTime, filter, map, Observable, of, startWith, switchMap } from "rxjs";

import { MealDbService } from "../../../shared/services/meal-db.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { translate } from "@ngneat/transloco";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MealSearch } from "app/shared/models";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  private mealsDbService = inject(MealDbService);

  public searchControl = new FormControl("");
  public filteredOptions: Observable<MealSearch[]>;
  public meals: MealSearch[] = [];

  public placeholder = translate("header.searchBar.placeholder");

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(""),
        debounceTime(300),
        switchMap(value => {
          const searchValue = (value ?? "").toLowerCase();
          return this.mealsDbService.getMealsByFirstLetter(searchValue.slice(0, 1))
            .pipe(
              map(meals => meals.filter(meal => meal.name?.toLowerCase().includes(searchValue))),
              takeUntilDestroyed(this.destroyRef),
            );
        }),
        catchError(() => {
          this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" });
          return of([]);
        }),
      );
  }

  public selectMeal(mealId: string) {
    this.router.navigate([`/meals/${mealId}`]);
    this.searchControl.setValue("");
    this.meals = [];
  }
}
