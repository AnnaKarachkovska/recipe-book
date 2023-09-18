import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Meal } from "app/shared/meal.model";

import { Recipe } from "../../recipe.model";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent {
  @Input() meal: Meal;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  toRecipe() {
    this.router.navigate([this.meal.idMeal], { relativeTo: this.route });
  }
}
