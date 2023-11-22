import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { forkJoin, map } from "rxjs";

import { CountryNames } from "app/shared/models/country-names";
import { Meal } from "app/shared/models/meal.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { environment } from "environments/environment";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { MediaMatcher } from "@angular/cdk/layout";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
  ]
})
export class LandingPageComponent implements OnInit {
  randomMeal: Meal | null;
  categories: string[];
  country: string = "Unknown";
  mediaChange: boolean = false;
  
  constructor(
    private mealDbService: MealDbService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private mediaMather: MediaMatcher,
  ) { 
  }

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

      this.listenToWindowSizeChange();
  };

  private listenToWindowSizeChange() {
    let mediaQuery = this.mediaMather.matchMedia("(max-width: 767px)");
    mediaQuery.addEventListener("change", mediaQueryEvent =>  this.mediaChange = mediaQueryEvent.matches);

    this.mediaChange = mediaQuery.matches;
  };
}
