import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { nanoid } from 'nanoid';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

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

  constructor(private recipeService: RecipeService,
              @Inject(MAT_DIALOG_DATA) public data) {};

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
    this.initForm();
  }

  onSubmit() {
    const formValue = this.recipeForm.value;
    const recipeId = this.id || nanoid();
    const newRecipe = new Recipe(
      recipeId,
      formValue['name'],
      formValue['desc'],
      formValue['imgPath'],
      formValue['ingredients'],
    )
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, [Validators.required, this.duplicateIngredientValidator()]),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    if (this.editMode) {
      this.recipe = this.recipeService.getRecipeById(this.id);      
      recipeName = this.recipe.name;
      recipeImgPath = this.recipe.imagePath;
      recipeDesc = this.recipe.description;

      if (this.recipe['ingredients']) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imgPath': new FormControl(recipeImgPath, Validators.pattern(urlRegex)),
      'desc': new FormControl(recipeDesc),
      'ingredients': recipeIngredients,
    })
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  duplicateIngredientValidator(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      if (!value) {
        return null;
      }
      const ingredientsNamesArr = [];
      this.recipeForm.value.ingredients?.map(ingredient => {
        ingredientsNamesArr.push(ingredient.name?.toLowerCase());
      })

      let ingredientValid;
      if(ingredientsNamesArr.indexOf(value) !== -1) {
        ingredientValid = false;
      } else {
        ingredientValid = true;
      }
    
      return !ingredientValid ? {uniqueIngredient:true} : null;
    }
  } 
}
