import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  providers: [],
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: string;
  recipesChangedSubscription: Subscription;

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {    
    this.route.params.subscribe(
      (params: Params) => {
        this.recipe = this.recipeService.getRecipeById(params['id']);
        this.id = params['id'];
      }
    )
    this.recipesChangedSubscription = this.recipeService.recipesChanged
    .subscribe((
      recipes: Recipe[]) => {
        this.recipe = recipes.find(recipe => recipe.id === this.id);
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
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

  ngOnDestroy() {
    this.recipesChangedSubscription.unsubscribe();
  }
}
