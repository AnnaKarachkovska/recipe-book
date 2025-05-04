import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params } from "@angular/router";
import { switchMap } from "rxjs";

import { Meal } from "app/shared/models/meal.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { ShoppingListService } from "app/shared/services/shopping-list.service";
import { translate } from "@ngneat/transloco";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.scss"],
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  private mealDbService = inject(MealDbService);
  private shoppingListService = inject(ShoppingListService);

  public meal: Meal | null;

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.mealDbService.getMealById(params["id"])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (meal) => {
          this.meal = meal;
        },
        error: () => {
          this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" });
        }
      })
  }

  public addToShoppingList() {
    if (!this.meal?.ingredients) return;

    this.shoppingListService.addIngredients(this.meal.ingredients);
    this.snackBar.open(
      translate("notifications.addManyToShoppingList"), "OK",
    );
  }
}
