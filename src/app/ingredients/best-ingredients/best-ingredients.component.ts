import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Ingredient } from "app/shared/models/ingredient.model";
import { MealDbService } from "app/shared/services/meal-db.service";

@Component({
  selector: 'app-best-ingredients',
  templateUrl: './best-ingredients.component.html',
  styleUrls: ['./best-ingredients.component.scss']
})
export class BestIngredientsComponent implements OnInit {
  bestIngredients: Ingredient[] = [];

  constructor(
    private mealDbService: MealDbService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.mealDbService.getRandomIngredients(12).subscribe({
      next: ingredients => {
        const store = sessionStorage.getItem("bestIngredients");

        if (store !== null) {
          this.bestIngredients = JSON.parse(store);
        } else {
          this.bestIngredients = ingredients;
          sessionStorage.setItem("bestIngredients", JSON.stringify(ingredients));
        }
      },
      error: () => {
        this.snackBar.open('Oops, something bad happend. Please, try again later.', 'OK', { panelClass: 'error' });
      }
    })
  }
}
