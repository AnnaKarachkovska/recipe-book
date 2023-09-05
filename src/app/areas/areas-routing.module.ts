import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AreaMealsComponent } from "./area-meals/area-meals.component";
import { AreasComponent } from "./areas.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AreasComponent },
      { path: ':area', component: AreaMealsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class AreasRoutingModule {};