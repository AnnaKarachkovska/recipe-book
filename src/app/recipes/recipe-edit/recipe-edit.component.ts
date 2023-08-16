import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl, FormArray, FormControl, FormGroup,
  ValidationErrors, ValidatorFn, Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { uniqueId } from "lodash";

import { Ingredient } from "app/shared/ingredient.model";

import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

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
  editMode: boolean;
  recipeForm: FormGroup;
  public ingredientControls: IngredientForm[];

  constructor(private recipeService: RecipeService,
    // TODO: use id existence instead of explicit editMode
    @Inject(MAT_DIALOG_DATA) public data: { id: string, editMode: boolean }) { };

  ngOnInit() {
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.id = params['id'];
    //     this.editMode = params['id'] != null;
    //     this.initForm();
    //   }
    // )

    this.id = this.data?.id;
    this.editMode = this.data?.editMode;
    this.initialize();
  }

  submit() {
    const newRecipe = new Recipe({
      id: this.id || uniqueId(),
      name: this.recipeForm.value['name'],
      desc: this.recipeForm.value['desc'],
      imagePath: this.recipeForm.value['imgPath'],
      ingredients: this.recipeForm.value['ingredients'],
    });

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    }
    else {
      this.recipeService.addRecipe(newRecipe);
    }
  }

  addIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      // TODO: use DRY principle - have a single ingredient formGroup provider
      this.getIngredientControl(),
    )
  }

  private getIngredientControl(ingredient?: Ingredient) {
    return new FormGroup({
      'name': new FormControl(ingredient?.name || null, [Validators.required, this.duplicateIngredientValidator()]),
      'amount': new FormControl(ingredient?.amount || null, [
        Validators.required,
        // TODO: check if mat-errors correctly display for these validators
        Validators.min(0),
        Validators.max(1000),
        // TODO: check if this validator is still necessary
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    })
  }

  deleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initialize() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<IngredientForm>([]);

    if (this.editMode) {
      this.recipe = this.recipeService.getRecipeById(this.id);
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDescription = this.recipe.description;

      if (this.recipe.ingredients) {
        this.recipe.ingredients
          .forEach(ingredient => recipeIngredients.push(this.getIngredientControl(ingredient)));
      }
    }

    // TODO: rename control names to full names: imageUrl, description
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imgPath': new FormControl(
        recipeImagePath,
        Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)),
      'desc': new FormControl(recipeDescription),
      'ingredients': recipeIngredients,
    });
    
    this.ingredientControls = recipeIngredients.controls;
  }

  duplicateIngredientValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      if (!value) {
        return null;
      }
      const ingredientsNamesArr: string[] = [];
      this.recipeForm.value.ingredients?.map((ingredient: { name: string; }) => {
        ingredientsNamesArr.push(ingredient.name?.toLowerCase());
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
