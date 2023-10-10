import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category-meals',
  templateUrl: './category-meals.component.html',
  styleUrls: ['./category-meals.component.scss']
})
export class CategoryMealsComponent implements OnInit{
  constructor (private mealDbService: MealDbService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar) {};

  category: string;
  meals: Meal[];

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.category = params['category']; 
          return this.mealDbService.getMealsByCategory(params['category']);
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