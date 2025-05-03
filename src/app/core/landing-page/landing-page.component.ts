import { HttpClient } from "@angular/common/http";
import { Component, DestroyRef, inject, OnInit} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { forkJoin, map } from "rxjs";

import { CountryNames } from "app/shared/models/country-names";
import { Meal } from "app/shared/models/meal.model";
import { MealDbService } from "app/shared/services/meal-db.service";
import { environment } from "environments/environment";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { MediaMatcher } from "@angular/cdk/layout";
import { TranslocoService, translate } from "@ngneat/transloco";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
  standalone: true,
  imports: [ SharedModule, RouterModule ],
})
export class LandingPageComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private mediaMather = inject(MediaMatcher);
  private translocoService = inject(TranslocoService);

  private mealDbService = inject(MealDbService);

  public randomMeal: Meal | null;
  public categories: { en: string, uk: string }[] = [];
  public country: string = "Unknown";
  public mediaChange: boolean = false;
  public activeLanguage: string = "en";

  ngOnInit() {
    this.translocoService.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => this.activeLanguage = lang);

    forkJoin({
      randomMeal: this.mealDbService.getRandomMeal(),
      categories: this.mealDbService.getCategories(),
      areas: this.mealDbService.getAreas(),
      country: this.http.get<{ country: string }>(
        environment.ipInfoUrl,
        { params: { token: environment.ipInfoAccessToken } }
      )
        .pipe(map(info => info.country))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ randomMeal, categories, areas, country }) => {
          this.randomMeal = randomMeal;

          this.categories = categories;

          const enArea = areas
            .map(area => area.en)
            .find(area => area === CountryNames[country.toUpperCase()]);

          this.country = enArea ?? "Unknown";
        },
        error: () => this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" }),
      })

    this.listenToWindowSizeChange();
  };

  private listenToWindowSizeChange() {
    let mediaQuery = this.mediaMather.matchMedia("(max-width: 767px)");
    mediaQuery.addEventListener("change", mediaQueryEvent => this.mediaChange = mediaQueryEvent.matches);

    this.mediaChange = mediaQuery.matches;
  };
}
