import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient (ingredient: Ingredient) {
    let ingredientRepeat = this.ingredients.find(el => el.name === ingredient.name);
    if (ingredientRepeat) {
      ingredientRepeat.amount += ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    let ingredientRepeat = this.ingredients.filter(oldEl => 
      ingredients.find(newEl => oldEl.name === newEl.name));

    if (ingredientRepeat.length > 0) {
      for (let i=0; i<ingredientRepeat.length; i++) {
        ingredientRepeat[i].amount += ingredients.find(el => el.name === ingredientRepeat[i].name).amount;
      }
    } else {
      this.ingredients.push(...ingredients);
    }
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient (index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
