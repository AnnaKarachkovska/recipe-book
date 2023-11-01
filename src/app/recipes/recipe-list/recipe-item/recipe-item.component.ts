import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Meal } from "app/shared/models/meal.model";

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
    this.router.navigate([this.meal.id], { relativeTo: this.route });
  }
}
