import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';

@Component({
  selector: 'app-area-meals',
  templateUrl: './area-meals.component.html',
  styleUrls: ['./area-meals.component.scss']
})
export class AreaMealsComponent implements OnInit{
  constructor (private mealDbService: MealDbService,
              private route: ActivatedRoute) {};

  area: string;
  meals: Meal[];

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.area = params['area'];        
      }
    )
    this.mealDbService.getMealsByArea(this.area).subscribe(res => {
      this.meals = res;
    })
  }
}