import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AreasComponent } from "./areas.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AreasComponent },
    ])
  ],
  exports: [RouterModule]
})
export class AreasRoutingModule {};