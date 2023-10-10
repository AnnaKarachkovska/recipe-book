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

  getIngredient(id: string) {
    return this.ingredients.find(el => el.idIngredient === id)
  }

  addIngredient(ingredient: Ingredient) {
    let ingredientsClone = cloneDeep(this.ingredients);
    let ingredientRepeat = ingredientsClone.find(
      el => el.idIngredient === ingredient.idIngredient);
    
    if (ingredientRepeat) {
      this._snackBar.open(
        `Ingredient with name "${ingredientRepeat.strIngredient}" has already been added.`, '',
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
      ingredients.find(newEl => oldEl.idIngredient === newEl.idIngredient));

    if (ingredientRepeat.length > 0) {
      for (let i = 0; i < ingredientRepeat.length; i++) {
        const foundIngredient = ingredients.find(el => 
          el.idIngredient === ingredientRepeat[i].idIngredient);

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

  updateIngredient(id: string, newIngredient: Ingredient) {
    const index = this.ingredients.findIndex(el => el.idIngredient === id);
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next([...this.ingredients]);
  }

  deleteIngredient(id: string) {
    const index = this.ingredients.findIndex(el => el.idIngredient === id);
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next([...this.ingredients]);
  }
}
