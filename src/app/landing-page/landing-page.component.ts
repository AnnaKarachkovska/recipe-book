import { Component, OnInit } from '@angular/core';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit{
  constructor (private mealDbService: MealDbService) {};

  randomMeal: Meal | null;
  randomMealImageUrl: string;
  categories: string[];
  categoryImageUrls: string[] = [];
  
  ngOnInit() {
    this.mealDbService.getRandomMeal().subscribe(res => {
      this.randomMeal = res;
      this.randomMealImageUrl = res.strMealThumb + '/preview';
    });    
    this.mealDbService.getCategories().subscribe(res => {
      this.categories = res;
      for (let i = 0; i< this.categories.length; i++) {
        this.categoryImageUrls.push('https://www.themealdb.com/images/category/' + this.categories[i] + '.png');
      };      
    })
    // this.mealDbService.getIngredients().subscribe(res => {})
  };


}