import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  providers: [],
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  recipeId: string;

  constructor(private recipeService: RecipeService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      )
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.dialog.open(RecipeEditComponent);
  };

  getRecipeId(event) {
    this.recipeId = event;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
