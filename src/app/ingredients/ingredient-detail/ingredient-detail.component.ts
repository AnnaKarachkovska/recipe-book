import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Ingredient } from 'app/shared/ingredient.model';
import { MealDbService } from 'app/shared/meal-db.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss']
})
export class IngredientDetailComponent implements OnInit {
  ingredient: Ingredient | undefined;

  constructor(private route: ActivatedRoute,
    private mealDbService: MealDbService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.mealDbService.getIngredientById(params['id'])),
      )
      .subscribe(res => {
        this.ingredient = res;
        this.changeDetector.markForCheck();
      });
  }
}