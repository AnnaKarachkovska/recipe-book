import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { forkJoin, map } from "rxjs";

import { CountryNames } from "app/shared/models/country-names";
import { Meal } from "app/shared/models/meal.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { environment } from "environments/environment";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  
  constructor(
    private mealDbService: MealDbService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { 
  }

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
        error: () => {
          this.snackBar.open('Oops, something bad happend. Please, try again later.', 'OK', { panelClass: 'error' });
        }
      })
  };
}
