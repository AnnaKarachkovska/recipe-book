import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared.module";
import { BestIngredientsComponent } from "./best-ingredients/best-ingredients.component";
import { IngredientsRoutingModule } from "./ingredients-routing";

@NgModule({
  declarations: [
    BestIngredientsComponent,
  ],
  imports: [
    SharedModule,
    IngredientsRoutingModule,
  ]
})
export class IngredientsModule {};