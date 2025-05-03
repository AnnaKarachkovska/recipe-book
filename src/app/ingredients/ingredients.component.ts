import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, Observable, startWith, switchMap } from "rxjs";

import { Ingredient } from "app/shared/models/ingredient.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-ingredients",
  templateUrl: "./ingredients.component.html",
  styleUrls: ["./ingredients.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit, AfterViewInit {
  @ViewChild("ingredientInfo")
  private ingredientInfo!: RouterOutlet;

  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);

  private mealDbService = inject(MealDbService);

  public ingredientControl = new FormControl("");
  public filteredIngredients: Observable<Ingredient[]>;
  public isIngredientInfoVisible: boolean;

  ngOnInit() {
    this.filteredIngredients = this.ingredientControl.valueChanges
    .pipe(
      startWith(""),
      switchMap(value => {
        const searchValue = (value ?? "").toLowerCase();
        return this.mealDbService.getIngredients()
          .pipe(
            map(ingredients => ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchValue))),
            takeUntilDestroyed(this.destroyRef),
          )
      }),
    );
  }

  ngAfterViewInit() {
    this.isIngredientInfoVisible = this.ingredientInfo.isActivated;

    this.ingredientInfo.activateEvents
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isIngredientInfoVisible = true;
      });

    this.ingredientInfo.deactivateEvents
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isIngredientInfoVisible = false;
        this.changeDetectorRef.markForCheck();
      });
  }
}
