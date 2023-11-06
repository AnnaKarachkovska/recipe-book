import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl, FormArray, FormControl, FormGroup,
  ValidationErrors, ValidatorFn, Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { uniqueId } from "lodash";

import {
  getIngredientControl,
} from "app/shared/models/ingredient-form-template";

import { Recipe } from "../models/recipe.model";
import { RecipeService } from "../services/recipe.service";

export type IngredientForm = FormGroup<{
  name: FormControl<string | null>;
  amount: FormControl<number | null>;
}>;

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  recipe: Recipe;
  id: string;
  recipeForm: FormGroup;
  public ingredientControls: IngredientForm[];

  constructor(private recipeService: RecipeService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }) { };

  ngOnInit() {
    this.id = this.data?.id;
    this.initialize();
  }

  submit() {
    const newRecipe = new Recipe({
      id: this.id || uniqueId() + 2,
      name: this.recipeForm.value['name'],
      description: this.recipeForm.value['description'],
      imageUrl: this.recipeForm.value['imageUrl'],
      ingredients: this.recipeForm.value['ingredients'],
    });

    if (this.id) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    }
    else {
      this.recipeService.addRecipe(newRecipe);
    }
  }

  addIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      getIngredientControl(undefined, this.duplicateIngredientValidator())
    )
  }

  deleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initialize() {
    let recipeName = '';
    let recipeImageUrl = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<IngredientForm>([]);

    if (this.id) {
      this.recipe = this.recipeService.getRecipeById(this.id);
      recipeName = this.recipe.name;
      recipeImageUrl = this.recipe.imageUrl;
      recipeDescription = this.recipe.description;

      // if (this.recipe.ingredients) {
      //   this.recipe.ingredients
      //     .forEach(ingredient => recipeIngredients.push(getIngredientControl(ingredient)));
      // }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imageUrl': new FormControl(
        recipeImageUrl,
        Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)),
      'description': new FormControl(recipeDescription),
      'ingredients': recipeIngredients,
    });

    this.ingredientControls = recipeIngredients.controls;
  }

  duplicateIngredientValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value?.toLowerCase();
      if (!value) {
        return null;
      }
      const ingredientsNamesArr: string[] = [];
      this.recipeForm?.value.ingredients.map((ingredient: { name: string; }) => {
        ingredientsNamesArr.push(ingredient?.name?.toLowerCase());
      })

      let ingredientValid;
      if (ingredientsNamesArr.indexOf(value) !== -1) {
        ingredientValid = false;
      } else {
        ingredientValid = true;
      }

      return !ingredientValid ? { uniqueIngredient: true } : null;
    }
  }
}
