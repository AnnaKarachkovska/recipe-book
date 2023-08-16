import { Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { filter, map } from "rxjs";

import {
  DialogWindowComponent,
} from "src/app/shared/dialog-window/dialog-window.component";

import { RecipeEditComponent } from "../recipe-edit/recipe-edit.component";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {

  // TODO: remove unused property
  id: string;
  recipe: Recipe;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    this.route.params
      .pipe(
        map((params: Params) => params.id),
        takeUntilDestroyed())
      .subscribe(recipeId => {
        let recipe = this.recipeService.getRecipeById(recipeId);

        if (!recipe) {
          this._snackBar.open(
            `Sorry, there is no recipe with id: ${recipeId}.`, '',
            {
              verticalPosition: 'top',
              horizontalPosition: 'end',
              duration: 1500,
              panelClass: ['snackbar']
            });

          this.router.navigate(['/recipes']);
        }
        else {
          this.recipe = recipe;
          this.id = recipeId;
        }
      });

    this.recipeService.recipesChanged
      .pipe(takeUntilDestroyed())
      .subscribe(recipes => {
        const recipe = recipes.find(recipe => recipe.id === this.id);
        if (recipe !== undefined) {
          this.recipe = recipe;
        }
      });
  }

  ngOnInit() {

  }

  onEditRecipe() {
    this.dialog.open(RecipeEditComponent, {
      data: {
        id: this.id,
        editMode: true,
      }
    });
  }

  // TODO: remove on* method prefix
  onAddToShoppingList() {
    if (this.recipe.ingredients.length > 0) {
      this.recipeService.addIngredients(this.recipe.ingredients);

      this._snackBar.open(
        'Ingredients have been added to the shopping list.', '',
        {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 1500
        });
    }
  }

  onDeleteRecipe() {
    this.dialog
      .open(DialogWindowComponent, { data: { name: this.recipe.name } })
      .afterClosed()
      .pipe(filter((result: boolean) => result))
      .subscribe(() => {
        this.recipeService.deleteRecipe(this.id);
        this.router.navigate(['..']);
      });
  }

}
