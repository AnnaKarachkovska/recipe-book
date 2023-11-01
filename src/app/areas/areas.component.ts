import { Component, OnInit } from "@angular/core";

import { CountryNames } from "app/shared/models/country-names";
import { MealDbService } from "app/shared/services/meal-db.service";

// TODO: make standalone, get rid of unnecessary module
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit{
  constructor (private mealDbService: MealDbService) {};

  areas: {country: string, code: string}[] = [];

  ngOnInit() {
    this.mealDbService.getAreas().subscribe(areas => {
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
    })
  }
}
