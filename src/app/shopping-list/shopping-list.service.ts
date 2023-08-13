import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as _ from 'lodash';

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
    let ingredientsClone = _.cloneDeep(this.ingredients);
    let ingredientRepeat = ingredientsClone.find(el => el.name.toLowerCase() === ingredient.name.toLowerCase());
    if (ingredientRepeat) {
      ingredientRepeat.amount += ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    let ingredientsClone = _.cloneDeep(this.ingredients);
    let ingredientRepeat = ingredientsClone.filter(oldEl => 
      ingredients.find(newEl => oldEl.name.toLowerCase() === newEl.name.toLowerCase()));

    if (ingredientRepeat.length > 0) {
      for (let i=0; i<ingredientRepeat.length; i++) {
        const foundIngredient = ingredients.find(el =>
          el.name.toLowerCase() === ingredientRepeat[i].name.toLowerCase()
        );
        if (foundIngredient !== undefined) {
          ingredientRepeat[i].amount += foundIngredient.amount;
        }
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
