import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared.module";
import { IngredientsRoutingModule } from "./ingredients-routing";

@NgModule({
  imports: [
    SharedModule,
    IngredientsRoutingModule,
  ]
})
export class IngredientsModule {};