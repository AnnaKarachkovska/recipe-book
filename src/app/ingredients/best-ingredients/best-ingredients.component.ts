import { Component, OnInit } from '@angular/core';
import { Ingredient } from 'app/shared/ingredient.model';
import { MealDbService } from 'app/shared/meal-db.service';

@Component({
  selector: 'app-best-ingredients',
  templateUrl: './best-ingredients.component.html',
  styleUrls: ['./best-ingredients.component.scss']
})
export class BestIngredientsComponent implements OnInit {
  bestIngredients: Ingredient[] = [];
  bestIngredientImageUrls: string[] = [];

  constructor(private mealDbService: MealDbService) {}

  ngOnInit() {
    this.mealDbService.getIngredients().subscribe(res => {
      for (let i=0; i<10; i++) {
        this.bestIngredients.push(res[Math.round(Math.random() * (574 - 1) + 1)]);
        this.bestIngredientImageUrls.push(
          'https://www.themealdb.com/images/ingredients/' + this.bestIngredients[i].strIngredient + '-Small.png');
      }
    })
  }
}