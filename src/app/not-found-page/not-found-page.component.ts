import { Component } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";

@Component({
  selector: "app-not-found-page",
  templateUrl: "./not-found-page.component.html",
  styleUrls: ["./not-found-page.component.scss"],
  standalone: true,
  imports: [ SharedModule ],
})
export class NotFoundPageComponent {
}
