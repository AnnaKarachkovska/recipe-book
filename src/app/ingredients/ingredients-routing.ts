import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BestIngredientsComponent } from "./best-ingredients/best-ingredients.component";
import { IngredientsComponent } from "./ingredients.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: IngredientsComponent },
      { path: 'best', component: BestIngredientsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class IngredientsRoutingModule {};