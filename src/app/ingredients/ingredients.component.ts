import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Ingredient } from 'app/shared/ingredient.model';
import { MealDbService } from 'app/shared/meal-db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit {
  ingredients: Observable<Ingredient[]>;

  constructor (private mealDbService: MealDbService) {}

  ngOnInit() {
    this.ingredients = this.mealDbService.getIngredients();
  }
}