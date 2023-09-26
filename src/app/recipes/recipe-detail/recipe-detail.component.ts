import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  providers: [],
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  meal: Meal | null;
  mealImageUrl: string = '';

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private mealDbService: MealDbService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.mealDbService.getMealById(params['id'])
          .subscribe(res => {
            this.meal = res;
            this.mealImageUrl = res.strMealThumb + '/preview';
          }
        );
        // let recipe = this.recipeService.getRecipeById(params['id']);
        // if(!recipe) {
        //   this._snackBar.open(
        //     `Sorry, there is no recipe with id: ${params['id']}.`, '',
        //     {
        //       verticalPosition: 'top',
        //       horizontalPosition: 'end',
        //       duration: 1500,
        //       panelClass: ['snackbar']
        //     });
        //   this.router.navigate(['/recipes']);
        // } else {
        //   this.recipe = recipe;
        //   this.id = params['id'];
        // }
      }
    )
  }

  // onEditRecipe() {
  //   this.dialog.open(RecipeEditComponent, {
  //     data: {
  //       id: this.id,
  //     }
  //   });
  // }

  // onAddToShoppingList() {
  //   this.recipeService.addIngredients(this.recipe.ingredients);
  //   if(this.recipe.ingredients.length > 0) {
  //     this._snackBar.open(
  //       'Ingrediens have been added to the shopping list.', '',
  //       {
  //         verticalPosition: 'top',
  //         horizontalPosition: 'end',
  //         duration: 1500
  //       });
  //   }
  // }

  // onDeleteRecipe() {
  //   const dialogRef = this.dialog.open(
  //     DialogWindowComponent, 
  //     { data: { name: this.recipe.name } }
  //   );
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.recipeService.deleteRecipe(this.id);
  //       this.router.navigate(['/recipes']);
  //     }
  //   });
  // }
}
