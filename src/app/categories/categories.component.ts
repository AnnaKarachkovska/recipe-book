import { Component, OnInit } from '@angular/core';
import { MealDbService } from 'app/shared/meal-db.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit{
  constructor (private mealDbService: MealDbService) {};

  categories: string[];

  ngOnInit() {
    this.mealDbService.getCategories().subscribe(categories => {
      this.categories = categories;   
    })
  }
}