import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { map } from 'rxjs';

import { environment } from 'environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit{
  constructor (private mealDbService: MealDbService,
    private http: HttpClient) {};

  randomMeal: Meal | null;
  randomMealImageUrl: string;
  categories: string[];
  categoryImageUrls: string[] = [];
  country: string;
  
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

    this.http.get<{ country: string }>("https://ipinfo.io/json", {params: { token: environment.ipInfoAccessToken }})
    .pipe(map(info => info.country))
    .subscribe(res => this.country = res)
  };
}