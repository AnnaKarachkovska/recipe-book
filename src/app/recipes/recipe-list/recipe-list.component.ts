import { Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { startWith } from "rxjs";

import { RecipeEditComponent } from "../recipe-edit/recipe-edit.component";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[];
  recipeId: string;

  constructor(
    private recipeService: RecipeService,
    public dialog: MatDialog,
  ) {
    this.recipeService.recipesChanged
      .pipe(
        startWith(this.recipeService.getRecipes()),
        takeUntilDestroyed())
      .subscribe((recipes: Recipe[]) => this.recipes = recipes);
  }

  ngOnInit() {
  }

  onNewRecipe() {
    this.dialog.open(RecipeEditComponent);
  };

  getRecipeId(event: string) {
    this.recipeId = event;
  }
}
