import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Ingredient } from 'app/shared/ingredient.model';
import { MealDbService } from 'app/shared/meal-db.service';

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss']
})
export class IngredientDetailComponent implements OnInit {
  id: string;
  ingredient: Ingredient | undefined;

  constructor(private route: ActivatedRoute,
    private mealDbService: MealDbService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];  

      this.mealDbService.getIngredientById(params['id']).subscribe(res => {
        this.ingredient = res;        
      })
    })
  }
}