import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";

import { AreasRoutingModule } from "./areas-routing.module";
import { AreasComponent } from "./areas.component";

@NgModule({
  declarations: [
    AreasComponent,
  ],
  imports: [
    SharedModule,
    AreasRoutingModule,
  ]
})
export class AreasModule {};
