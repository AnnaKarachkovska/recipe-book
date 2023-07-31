import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      '1',
      'First meal',
      'First meal description',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
      [
        new Ingredient('Ingredient 1', 2),
        new Ingredient('Ingredient 2', 5),
      ]),
    new Recipe(
      '2',
      'Second meal',
      'Second meal description',
      'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      [
        new Ingredient('Ingredient 1', 1),
        new Ingredient('Ingredient 2', 3),
      ])
  ];

  constructor(private shoppingListService: ShoppingListService) { };

  getRecipes() {
    return this.recipes.slice();
  };

  getRecipeById(id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  };

  addIngredients(ingredients: Ingredient[]) {    
    this.shoppingListService.addIngredients(ingredients);
  };

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id: string, newRecipe: Recipe) {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(id: string) {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}