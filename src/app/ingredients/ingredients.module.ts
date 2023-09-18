import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared.module";
import { BestIngredientsComponent } from "./best-ingredients/best-ingredients.component";
import { IngredientsRoutingModule } from "./ingredients-routing";
import { IngredientsComponent } from "./ingredients.component";

@NgModule({
  declarations: [
    IngredientsComponent,
    BestIngredientsComponent,
  ],
  imports: [
    SharedModule,
    IngredientsRoutingModule,
  ]
})
export class IngredientsModule {};