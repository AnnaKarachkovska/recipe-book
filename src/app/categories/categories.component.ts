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
  categoryImageUrls: string[] = [];

  ngOnInit() {
    this.mealDbService.getCategories().subscribe(res => {
      this.categories = res;
      for (let i = 0; i< this.categories.length; i++) {
        this.categoryImageUrls.push('https://www.themealdb.com/images/category/' + this.categories[i] + '.png');
      };      
    })
  }
}