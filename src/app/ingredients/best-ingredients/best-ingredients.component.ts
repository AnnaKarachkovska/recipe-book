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
    // TODO: get a random selection of ingredients only if it's not already stored in local storage
    this.mealDbService.getIngredients().subscribe({
      next: ingredients => {
        let ingredientsArray = [];
        for (let i = 0; i < 10; i++) {
          // TODO: 574 is a magic number. Why 574?
          ingredientsArray.push(ingredients[Math.round(Math.random() * (574 - 1) + 1)]);
        }

        const store = localStorage.getItem("bestIngredients");

        if (store !== null) {
          this.bestIngredients = JSON.parse(store);
        } else {
          this.bestIngredients = ingredientsArray;
          localStorage.setItem("bestIngredients", JSON.stringify(ingredientsArray));
        }
      },
      error: (error) => {
        this.snackBar.open(`Sorry, there is an error: ${error}. Try again later.`, 'OK', { panelClass: 'error' });
      }
    })
  }
}
