import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogWindowComponent } from 'src/app/shared/dialog-window/dialog-window.component';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  providers: [],
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: string;
  recipesChangedSubscription: Subscription;

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        let recipe = this.recipeService.getRecipeById(params['id']);
        if(!recipe) {
          this._snackBar.open(
            `Sorry, there is no recipe with id: ${params['id']}.`, '',
            {
              verticalPosition: 'top',
              horizontalPosition: 'end',
              duration: 1500
            });
          this.router.navigate(['/recipes']);
        } else {
          this.recipe = recipe;
          this.id = params['id'];
        }
      }
    )
    this.recipesChangedSubscription = this.recipeService.recipesChanged
      .subscribe((
        recipes: Recipe[]) => {
        this.recipe = recipes.find(recipe => 
          recipe.id === this.id);
      }
      );
  }

  onEditRecipe() {
    this.dialog.open(RecipeEditComponent, {
      data: {
        id: this.id,
        editMode: true,
      }
    });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredients(this.recipe.ingredients);
    this._snackBar.open(
      'Ingrediens have been added to the shopping list.', '',
      {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 1500
      });
  }

  onDeleteRecipe() {
    const dialogRef = this.dialog.open(
      DialogWindowComponent, 
      { data: { name: this.recipe.name } }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.deleteRecipe(this.id);
        this.router.navigate(['/recipes']);
      }
    });
  }

  ngOnDestroy() {
    this.recipesChangedSubscription.unsubscribe();
  }
}
