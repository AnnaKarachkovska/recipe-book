import { AfterContentInit, Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";

import { Meal } from "app/shared/models/meal.model";
import { MealDbService } from "app/shared/services";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent implements AfterContentInit {
  @Input() meal: Meal;

  mealName: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private mealDbService: MealDbService,
  ) {
  }

  ngAfterContentInit() {
    const store = localStorage.getItem('meal.' + this.meal?.name);
    if (store !== null) {
      this.translocoService.langChanges$.subscribe(lang => {
        this.mealName = JSON.parse(store)[lang];
      })
    } else {
      this.mealDbService.translate(this.meal.name).subscribe(name => {
        this.mealName = name;
      })
    }
  }

  toRecipe() {
    this.router.navigate([this.meal.id], { relativeTo: this.route });
  }
}
