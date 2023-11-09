import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params } from "@angular/router";
import { switchMap } from "rxjs";

import { Meal } from "app/shared/models/meal.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { ShoppingListService } from "app/shared/services/shopping-list.service";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  meal: Meal | null;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private mealDbService: MealDbService,
    private shoppingListService: ShoppingListService
  ) { 
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.mealDbService.getMealById(params['id']))
      )
      .subscribe({
        next: (meal) => {
          this.meal = meal;
        },
        error: () => {
          this.snackBar.open('Oops, something bad happend. Please, try again later.', 'OK', { panelClass: 'error' });
        }
      })
  }

  onAddToShoppingList() {
    if (this.meal?.ingredients) {      
      this.shoppingListService.addIngredients(this.meal.ingredients);
      this.snackBar.open(
        'Ingrediens have been added to the shopping list.', 'OK',
      );
    }
  }
}
