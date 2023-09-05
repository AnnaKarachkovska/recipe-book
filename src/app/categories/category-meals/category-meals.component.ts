import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';

@Component({
  selector: 'app-category-meals',
  templateUrl: './category-meals.component.html',
  styleUrls: ['./category-meals.component.scss']
})
export class CategoryMealsComponent implements OnInit{
  constructor (private mealDbService: MealDbService,
              private route: ActivatedRoute) {};

  category: string;
  meals: Meal[];

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.category = params['category'];        
      }
    )
    this.mealDbService.getMealsByCategory(this.category).subscribe(res => {
      this.meals = res;
    })
  }
}