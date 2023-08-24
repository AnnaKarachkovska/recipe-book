import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  providers: [],
  styleUrls: ['./dialog-window.component.scss']
})
export class DialogWindowComponent {
  no = false;
  yes = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {name: string},
  ) {}
}