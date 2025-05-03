import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
})
export class YesNoDialogComponent {
  no = false;
  yes = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      action: string,
      name: string, 
    },
  ) {
  }
}
