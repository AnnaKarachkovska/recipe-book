import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Ingredient } from 'app/shared/ingredient.model';
import { MealDbService } from 'app/shared/meal-db.service';
import { map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit {
  ingredientControl = new FormControl('');
  ingredients: Observable<Ingredient[]>;
  filteredResult: Observable<Ingredient[]>;

  constructor (private mealDbService: MealDbService) {
    this.filteredResult = this.ingredientControl.valueChanges.pipe(
      startWith(null),
      switchMap((ingredient: string | null) => (
        ingredient ? 
        this._filter(ingredient) : 
        this.ingredients
      )),
    );
  }

  ngOnInit() {
    this.ingredients = this.mealDbService.getIngredients();
  }

  private _filter(value: string): Observable<Ingredient[]> {
    const filterValue = value.toLowerCase();

    return this.ingredients.pipe(
      map(ingredients => 
        ingredients.filter(ingredient => 
          ingredient.name.toLowerCase().includes(filterValue)))
    );
  }
}