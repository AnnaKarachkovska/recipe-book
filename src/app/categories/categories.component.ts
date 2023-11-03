import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MealDbService } from "app/shared/services/meal-db.service";
import { SharedModule } from "app/shared/shared.module";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
  ]
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
