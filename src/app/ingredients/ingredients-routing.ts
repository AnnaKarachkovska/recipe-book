import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
  BestIngredientsComponent,
} from "./best-ingredients/best-ingredients.component";
import {
  IngredientDetailComponent,
} from "./ingredient-detail/ingredient-detail.component";
import { IngredientsComponent } from "./ingredients.component";

// TODO: rename file to match module class defined inside
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'best',
        component: BestIngredientsComponent,
        children: [
          {
            path: ':id',
            component: IngredientDetailComponent,
          }
        ]
      },
      {
        path: '',
        component: IngredientsComponent,
        children: [
          {
            path: ':id',
            component: IngredientDetailComponent,
          }
        ]
      },
    ])
  ],
  exports: [RouterModule]
})
export class IngredientsRoutingModule { };
