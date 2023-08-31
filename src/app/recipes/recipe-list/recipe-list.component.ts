import { Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params } from "@angular/router";
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
    public route: ActivatedRoute,
  ) {
    this.recipeService.recipesChanged
      .pipe(
        startWith(this.recipeService.getRecipes()),
        takeUntilDestroyed())
      .subscribe((recipes: Recipe[]) => this.recipes = recipes);
      this.route.firstChild?.params
        .pipe(takeUntilDestroyed())
        .subscribe(
         (params: Params) => {
            this.recipeId = params.id;   
         }
        )
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
