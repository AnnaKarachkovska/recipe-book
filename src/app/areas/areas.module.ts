import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared.module";
import { AreaMealsComponent } from "./area-meals/area-meals.component";
import { AreasRoutingModule } from "./areas-routing.module";
import { AreasComponent } from "./areas.component";

@NgModule({
  declarations: [
    AreasComponent,
    AreaMealsComponent,
  ],
  imports: [
    SharedModule,
    AreasRoutingModule,
  ]
})
export class AreasModule {};