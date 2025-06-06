import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import {
  BestIngredientsComponent,
} from "./best-ingredients/best-ingredients.component";
import {
  IngredientDetailComponent,
} from "./ingredient-detail/ingredient-detail.component";
import { IngredientsRoutingModule } from "./ingredients-routing.module";
import { IngredientsComponent } from "./ingredients.component";

@NgModule({
  declarations: [
    IngredientsComponent,
    BestIngredientsComponent,
    IngredientDetailComponent,
  ],
  imports: [
    SharedModule,
    IngredientsRoutingModule,
  ]
})
export class IngredientsModule {};
