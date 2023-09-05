import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared.module";
import { LandingPageRoutingModule } from "./landing-page-routing.module";
import { LandingPageComponent } from "./landing-page.component";

@NgModule({
  declarations: [
    LandingPageComponent,
  ],
  imports: [
    SharedModule,
    LandingPageRoutingModule,
  ]
})
export class LandingPageModule {};