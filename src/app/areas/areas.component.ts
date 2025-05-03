import { MediaMatcher } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { TranslocoService, translate } from "@ngneat/transloco";

import { CountryNames } from "app/shared/models/country-names";
import { MealDbService } from "app/shared/services/meal-db.service";
import { SharedModule } from "app/shared/shared.module";

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
  ]
})
export class AreasComponent implements OnInit {
  mediaChange: boolean = false;
  areas: { en: string, uk: string, code: string }[] = [];
  activeLanguage: string = 'en';

  constructor(
    private mealDbService: MealDbService,
    private snackBar: MatSnackBar,
    private mediaMather: MediaMatcher,
    private translocoService: TranslocoService,
  ) {
    this.translocoService.langChanges$
      .pipe(takeUntilDestroyed())
      .subscribe(lang => {
        this.activeLanguage = lang;
      })
  }

  ngOnInit() {
    this.mealDbService.getAreas().subscribe({
      next: areas => {
        for (let area of areas) {
          const countryName = Object.entries(CountryNames)
            .filter(countryName => countryName[1] === area.en)
            .map(countryName => countryName[0]);

          if (countryName[0] !== undefined) {
            this.areas.push({ ...area, code: countryName[0] });
          } else {
            this.areas.push({ ...area, code: "JE" });
          }
        }
      },
      error: () => {
        this.snackBar.open(translate('errors.commonError'), 'OK', { panelClass: 'error' });
      }
    })

    this.listenToWindowSizeChange();
  }

  private listenToWindowSizeChange() {
    let mediaQuery = this.mediaMather.matchMedia("(max-width: 767px)");
    mediaQuery.addEventListener("change", mediaQueryEvent => this.mediaChange = mediaQueryEvent.matches);

    this.mediaChange = mediaQuery.matches;
  };
}