import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent {
  constructor(private _snackBar: MatSnackBar) {}
  feedbackForm: FormGroup = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'comment': new FormControl('', Validators.required)
  })

  submit() {
    this._snackBar.open(
      'Your feedback has been sent successfully.', 'OK',
      { panelClass: 'success' }
    );
  }
}