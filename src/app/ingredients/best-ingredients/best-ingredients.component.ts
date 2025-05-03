import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSnackBar } from "@angular/material/snack-bar";
import { translate } from "@ngneat/transloco";

import { Ingredient } from "app/shared/models/ingredient.model";
import { MealDbService } from "app/shared/services/meal-db.service";

@Component({
  selector: "app-best-ingredients",
  templateUrl: "./best-ingredients.component.html",
  styleUrls: ["./best-ingredients.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestIngredientsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  private mealDbService = inject(MealDbService);

  public bestIngredients: Ingredient[] = [];

  ngOnInit() {
    const store = sessionStorage.getItem("bestIngredients");

    if (store !== null) {
      this.bestIngredients = JSON.parse(store);
    } else {
      this.mealDbService.getRandomIngredients(12)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: ingredients => {
            this.bestIngredients = ingredients;
            sessionStorage.setItem("bestIngredients", JSON.stringify(ingredients));
          },
          error: () => this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" }),
        });
    }
  }
}
