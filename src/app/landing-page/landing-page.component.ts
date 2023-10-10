import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'environments/environment';
import { CountryNames } from 'environments/country-names';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  constructor(private mealDbService: MealDbService,
    private http: HttpClient,
    private _snackBar: MatSnackBar) { };

  randomMeal: Meal | null;
  randomMealImageUrl: string;
  categories: string[];
  categoryImageUrls: string[] = [];
  areas: string[];
  country: string = "Unknown";

  ngOnInit() {
    this.mealDbService.getRandomMeal().subscribe(res => {
      this.randomMeal = res;
      this.randomMealImageUrl = res?.imageUrl + '/preview';
    });
    this.mealDbService.getCategories().subscribe(res => {
      this.categories = res;
      for (let i = 0; i < this.categories.length; i++) {
        this.categoryImageUrls.push(
          'https://www.themealdb.com/images/category/' + 
          this.categories[i] + 
          '.png');
      };
    })
    this.mealDbService.getAreas().subscribe(areas => this.areas = areas);

    this.http.get<{ country: string }>(
      "https://ipinfo.io/json", 
      { params: { token: environment.ipInfoAccessToken } }
      )
        .pipe(map(info => info.country))
        .subscribe({
          next: (country) => {
            const countryName = Object.keys(CountryNames).filter(countryName => countryName === country)[0];
            
            // if (this.areas.includes(CountryNames[countryName])) {
            //   this.country = CountryNames[countryName];
            // } else {
            //   this.country = "Unknown";
            // }

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
  };
}