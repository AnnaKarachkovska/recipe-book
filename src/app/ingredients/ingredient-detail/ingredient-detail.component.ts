import {
  animate, state, style, transition, trigger,
} from "@angular/animations";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params } from "@angular/router";
import { switchMap } from "rxjs";

import { Ingredient } from "app/shared/models/ingredient.model";
import { MealDbService } from "app/shared/services/meal-db.service";

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss'],
  animations: [
    trigger('insertRemove', [
      state('open', style({})),
      state('closed', style({
        left: "500px",
        opacity: 0,
      })),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class IngredientDetailComponent implements OnInit {
  ingredient: Ingredient | undefined;

  constructor(private route: ActivatedRoute,
    private mealDbService: MealDbService,
    private changeDetector: ChangeDetectorRef,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.mealDbService.getIngredientById(params['id'])),
      )
      .subscribe({
        next: ingredient => {
          this.ingredient = ingredient;
          this.changeDetector.markForCheck();
        },
        error: (error) => {
          this._snackBar.open(
            `Sorry, there is an error: ${error}. Try again later.`, 'OK',
            { panelClass: 'error' }
          );
        }
      });
  }
}
