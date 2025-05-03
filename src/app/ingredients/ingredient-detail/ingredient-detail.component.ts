import {
  animate, state, style, transition, trigger,
} from "@angular/animations";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params } from "@angular/router";
import { switchMap } from "rxjs";

import { Ingredient } from "app/shared/models/ingredient.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { translate } from "@ngneat/transloco";
import { ShoppingListService } from "app/shared/services";

@Component({
  selector: "app-ingredient-detail",
  templateUrl: "./ingredient-detail.component.html",
  styleUrls: ["./ingredient-detail.component.scss"],
  animations: [
    trigger("insertRemove", [
      state("open", style({})),
      state("closed", style({
        left: "500px",
        opacity: 0,
      })),
      transition("closed => open", [
        animate("0.5s")
      ]),
    ]),
  ],
})
export class IngredientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private changeDetector = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  private mealDbService = inject(MealDbService);
  private shoppingListService = inject(ShoppingListService);

  public ingredient: Ingredient | undefined;

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.mealDbService.getIngredientById(params["id"])),
      )
      .subscribe({
        next: ingredient => {
          this.ingredient = ingredient;
          this.changeDetector.markForCheck();
        },
        error: () => {
          this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" });
        }
      });
  }

  public addToShoppingList() {
    if (!this.ingredient) return;

    const duplicatedIngredient = this.shoppingListService.getIngredients()
      .find(ingredient => ingredient.id === this.ingredient?.id);

    if (duplicatedIngredient) {
      this.snackBar.open(
        translate("notifications.addDuplicateToShoppingList"), "OK",
      );
      return;
    }

    this.shoppingListService.addIngredient({...this.ingredient, amount: 1});

    this.snackBar.open(
      translate("notifications.addOneToShoppingList"), "OK",
      { panelClass: "success" },
    );
  }
}
