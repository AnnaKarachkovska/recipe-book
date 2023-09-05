import { Component, OnInit } from '@angular/core';
import { MealDbService } from 'app/shared/meal-db.service';

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
      for (let i = 0; i< this.areas.length; i++) {
        this.areaImageUrls.push('https://www.themealdb.com/images/area/' + this.areas[i] + '.png');
      };
    })
  }
}