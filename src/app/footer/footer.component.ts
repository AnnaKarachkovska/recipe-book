import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(public dialog: MatDialog) {};

  openFeedbackForm() {
    this.dialog.open(FeedbackFormComponent);
  }
}