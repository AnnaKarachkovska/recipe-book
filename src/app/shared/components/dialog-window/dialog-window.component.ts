import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss']
})
// TODO: rename to match the exact function of this component
export class DialogWindowComponent {
  no = false;
  yes = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
  ) {
  }
}
