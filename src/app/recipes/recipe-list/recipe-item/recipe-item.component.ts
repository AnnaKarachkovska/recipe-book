import { Component, Input, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent {
  @Input() recipe: Recipe;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {};

  toRecipe() {
    this.router.navigate([this.recipe.id], {relativeTo: this.route});
  }
}
