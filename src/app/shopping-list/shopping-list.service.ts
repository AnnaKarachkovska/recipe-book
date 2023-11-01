import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cloneDeep } from "lodash-es";
import { Subject } from "rxjs";

import { MealDbService } from "app/shared/services/meal-db.service";

import { Ingredient } from "../shared/models/ingredient.model";

// TODO: move to shared module - reason: service used in two different modules, not necessary for whole project
@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<string>();

  private ingredients: Ingredient[] = [];

  constructor(private _snackBar: MatSnackBar,
    private mealDbService: MealDbService) { }

  getIngredients() {
    return [...this.ingredients];
  }

  getIngredient(id: string) {
    return this.ingredients.find(el => el.id === id)
  }

  addIngredient(ingredient: Ingredient) {
    let ingredientsClone = cloneDeep(this.ingredients);
    let ingredientRepeat = ingredientsClone.find(
      el => el.id === ingredient.id);

    if (ingredientRepeat) {
      this._snackBar.open(
        `Ingredient with name "${ingredientRepeat.name}" has already been added.`, 'OK'
      );
    } else {
      this.ingredients.push(ingredient);
    }

    this.ingredientsChanged.next([...this.ingredients]);
  }

  addIngredients(ingredients: { ingredient: string, amount: string }[]) {
    this.mealDbService.getIngredients().subscribe(allIngredients => {
      ingredients.forEach(element => {
        const ingredient = allIngredients
          .find(ingredient => ingredient.name.toLowerCase() === element.ingredient.toLowerCase());
        const ingredientRepeatIndex = this.ingredients
          .findIndex(element => element.id === ingredient?.id);

        if (ingredient !== undefined && ingredientRepeatIndex === -1) {
          this.ingredients.push({
            ...ingredient,
            amount: Number.parseInt(element.amount) || 1
          });
        }
      })
    })

    this.ingredientsChanged.next([...this.ingredients]);
  }

  updateIngredient(id: string, newIngredient: Ingredient) {
    const index = this.ingredients.findIndex(el => el.id === id);

    this.deleteIngredient(id);

    let ingredientsClone = cloneDeep(this.ingredients);
    let ingredientRepeat = ingredientsClone.find(
      el => el.id === newIngredient.id);

    if (ingredientRepeat) {
      this._snackBar.open(
        `Ingredient with name "${ingredientRepeat.name}" has already been added.`, 'OK'
      );
    } else {
      this.ingredients.splice(index, 0, newIngredient);
    }

    this.ingredientsChanged.next([...this.ingredients]);
  }

  deleteIngredient(id: string) {
    const index = this.ingredients.findIndex(el => el.id === id);
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next([...this.ingredients]);
  }
}
