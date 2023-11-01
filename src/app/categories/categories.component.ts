import { Component, OnInit } from "@angular/core";

import { MealDbService } from "app/shared/services/meal-db.service";

// TODO: make standalone, get rid of unnecessary module
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
