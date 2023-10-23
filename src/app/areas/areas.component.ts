import { Component, OnInit } from '@angular/core';
import { MealDbService } from 'app/shared/meal-db.service';
import { CountryNames } from 'environments/country-names';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit{
  constructor (private mealDbService: MealDbService) {};

  areas: string[];
  areaImageUrls: string[] = [];

  ngOnInit() {
    this.mealDbService.getAreas().subscribe(res => {      
      this.areas = res;
      
      for (let area of this.areas) {
        const countryName = Object.entries(CountryNames)
          .filter(countryName => countryName[1] === area)
          .map(countryName => countryName[0]);

        if (countryName[0] !== undefined) {
          this.areaImageUrls.push("https://flagsapi.com/" + countryName[0] + "/shiny/64.png");
        } else {
          this.areaImageUrls.push("https://upload.wikimedia.org/wikipedia/commons/2/2f/Missing_flag.png");
        }
      }
    })
  }
}