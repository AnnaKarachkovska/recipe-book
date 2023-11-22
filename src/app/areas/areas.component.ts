import { MediaMatcher } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";

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
export class AreasComponent implements OnInit{
  mediaChange: boolean = false;
  areas: {country: string, code: string}[] = [];

  constructor (
    private mealDbService: MealDbService,
    private snackBar: MatSnackBar,
    private mediaMather: MediaMatcher,
  ) {
  }

  ngOnInit() {
    this.mealDbService.getAreas().subscribe({
      next: areas => {
        for (let area of areas) {
          const countryName = Object.entries(CountryNames)
            .filter(countryName => countryName[1] === area)
            .map(countryName => countryName[0]);
  
          if (countryName[0] !== undefined) {
            this.areas.push({country: area, code: countryName[0]});
          } else {
            this.areas.push({country: area, code: "JE"});
          }
        }
      }, 
      error: () => {
        this.snackBar.open('Oops, something bad happend. Please, try again later.', 'OK', { panelClass: 'error' });
      }
    })

    this.listenToWindowSizeChange();
  }

  private listenToWindowSizeChange() {
    let mediaQuery = this.mediaMather.matchMedia("(max-width: 767px)");
    mediaQuery.addEventListener("change", mediaQueryEvent =>  this.mediaChange = mediaQueryEvent.matches);

    this.mediaChange = mediaQuery.matches;
  };
}
