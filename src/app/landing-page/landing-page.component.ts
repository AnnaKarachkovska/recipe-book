import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { forkJoin, map } from 'rxjs';
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
  categories: string[];
  country: string = "Unknown";

  ngOnInit() {
    forkJoin({
      randomMeal: this.mealDbService.getRandomMeal(),
      categories: this.mealDbService.getCategories(),
      areas: this.mealDbService.getAreas(),
      country: this.http.get<{ country: string }>(
        "https://ipinfo.io/json",
        { params: { token: environment.ipInfoAccessToken } }
      )
        .pipe(map(info => info.country))
    })
      .subscribe({
        next: ({ randomMeal, categories, areas, country }) => {
          this.randomMeal = randomMeal;
          this.categories = categories;

          const countryName = Object.keys(CountryNames)
            .find(countryName => countryName === country) || '';

          if (areas.includes(CountryNames[countryName])) {
            this.country = CountryNames[countryName];
          } else {
            this.country = "Unknown";
          }
        },
        error: (error) => {
          this._snackBar.open(
            `Sorry, there is an error: ${error}. Try again later.`, 'OK',
            { panelClass: 'error' }
          );
        }
      })
  };
}