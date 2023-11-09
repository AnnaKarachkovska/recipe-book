import { Component, Input } from "@angular/core";

import { Meal } from "app/shared/models/meal.model";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent {
  @Input() meals: Meal[] = [];
}
