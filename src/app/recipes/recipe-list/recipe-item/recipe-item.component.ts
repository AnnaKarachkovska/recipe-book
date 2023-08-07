import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent {
  @Input() recipe: Recipe;
  @Output() recipeId = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {};

  toRecipe() {
    this.router.navigate([this.recipe.id], {relativeTo: this.route});
    this.recipeId.emit(this.recipe.id);
  }
}
