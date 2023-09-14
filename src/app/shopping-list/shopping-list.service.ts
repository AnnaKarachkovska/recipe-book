import { Injectable } from "@angular/core";
import { cloneDeep } from "lodash-es";
import { Subject } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';

import { Ingredient } from "../shared/ingredient.model";

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<string>();

  private ingredients: Ingredient[] = [];

  constructor(private _snackBar: MatSnackBar) {}

  getIngredients() {
    return [...this.ingredients];
  }

  getIngredient(name: string) {
    return this.ingredients.find(el => el.name === name)
  }

  addIngredient(ingredient: Ingredient) {
    let ingredientsClone = cloneDeep(this.ingredients);
    let ingredientRepeat = ingredientsClone.find((el: { name: string; }) => el.name.toLowerCase() === ingredient.name.toLowerCase());
    
    if (ingredientRepeat) {
      this._snackBar.open(
        `Ingredient with name "${ingredientRepeat.name}" has already been added.`, '',
        {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000
        });
    } else {
      this.ingredients.push(ingredient);
    }

    this.ingredientsChanged.next([...this.ingredients]);
  }

  addIngredients(ingredients: Ingredient[]) {
    let ingredientsClone = cloneDeep(this.ingredients);
    let ingredientRepeat = ingredientsClone.filter(oldEl =>
      ingredients.find(newEl => oldEl.name.toLowerCase() === newEl.name.toLowerCase()));

    if (ingredientRepeat.length > 0) {
      for (let i = 0; i < ingredientRepeat.length; i++) {
        const foundIngredient = ingredients.find(el =>el.name.toLowerCase() === ingredientRepeat[i].name.toLowerCase());

        // if (foundIngredient !== undefined) {
        //   ingredientRepeat[i].amount += foundIngredient.amount;
        // }
      }
    } 
    else {
      this.ingredients.push(...ingredients);
    }
    
    this.ingredientsChanged.next([...this.ingredients]);
  }

  updateIngredient(name: string, newIngredient: Ingredient) {
    const index = this.ingredients.findIndex(el => el.name === name);
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next([...this.ingredients]);
  }

  deleteIngredient(name: string) {
    const index = this.ingredients.findIndex(el => el.name === name);
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next([...this.ingredients]);
  }
}
