import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Ingredient } from 'app/shared/ingredient.model';
import { MealDbService } from 'app/shared/meal-db.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit {
  ingredients: Ingredient[] = [];

  constructor (private mealDbService: MealDbService) {}

  ngOnInit() {
    this.mealDbService.getIngredients().subscribe(res => {
      this.ingredients.push(...res);
      // console.log(this.ingredients);
      
      // for(let i=0; i <this.ingredients.length; i++) {
      //   if(this.ingredients[i].strIngredient) {         
      //     this.ingredients[i].strIngredient = 'Unknown';
      //   }
      // }
    })
  }
}