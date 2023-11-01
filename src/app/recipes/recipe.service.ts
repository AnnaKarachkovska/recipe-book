import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      {
        id: '1',
        name: 'First meal',
        description: 'First meal description',
        imageUrl: 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
        ingredients: [
          // new Ingredient('Ingredient 1', 2),
          // new Ingredient('Ingredient 2', 5),
        ],
      }),
    new Recipe(
      {
        id: '2',
        name: 'Second meal',
        description: 'Second meal description',
        imageUrl: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
        ingredients: [
          // new Ingredient('Ingredient 3', 1),
          // new Ingredient('Ingredient 4', 3),
        ],
      }),
  ];

  constructor(private shoppingListService: ShoppingListService) { };

  getRecipes() {
    return this.recipes.slice();
  };

  getRecipeById(id: string) {
    const recipe = this.recipes.find(recipe => recipe.id === id);
    if (recipe === undefined) {
      throw new Error('There is no recipe.');
    }
    return recipe;
  };

  // addIngredients(ingredients: Ingredient[]) {
  //   this.shoppingListService.addIngredients(ingredients);
  // };

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next([...this.recipes]);
  }

  updateRecipe(id: string, newRecipe: Recipe) {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    this.recipes[index] = newRecipe;
    this.recipesChanged.next([...this.recipes]);
  }

  deleteRecipe(id: string) {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    this.recipes.splice(index, 1);
    this.recipesChanged.next([...this.recipes]);
  }
}
