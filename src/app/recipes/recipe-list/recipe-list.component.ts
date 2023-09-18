import { Component, Input} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Meal } from "app/shared/meal.model";

import { RecipeEditComponent } from "../recipe-edit/recipe-edit.component";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent {
  @Input() meals: Meal[] = [];

  constructor(
    public dialog: MatDialog,
  ) {}

  onNewRecipe() {
    this.dialog.open(RecipeEditComponent);
  };

}
