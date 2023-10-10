import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-area-meals',
  templateUrl: './area-meals.component.html',
  styleUrls: ['./area-meals.component.scss']
})
export class AreaMealsComponent implements OnInit {
  area: string;
  meals: Meal[];

  constructor(private mealDbService: MealDbService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { };

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.area = params['area'];
          return this.mealDbService.getMealsByArea(params['area']);
        })
      )
      .subscribe({
        next: (meals) => {
          this.meals = meals;
        }, 
        error: (error) => {
          this._snackBar.open(
            `Sorry, there is an error: ${error}. Try again later.`, '',
            {
              verticalPosition: 'top',
              horizontalPosition: 'end',
              duration: 1500,
              panelClass: ['snackbar']
            });
        }
      })
  }
}