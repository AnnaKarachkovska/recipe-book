import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
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
  constructor(
    private mealDbService: MealDbService,
    private snackBar: MatSnackBar,
  ) {
  }

  categories: string[];

  ngOnInit() {
    this.mealDbService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: () => {
        this.snackBar.open('Oops, something bad happend. Please, try again later.', 'OK', { panelClass: 'error' });
      }
    })
  }
}