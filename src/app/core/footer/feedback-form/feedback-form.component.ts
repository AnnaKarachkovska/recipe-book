import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { translate } from "@ngneat/transloco";

@Component({
  selector: "app-feedback-form",
  templateUrl: "./feedback-form.component.html",
  styleUrls: ["./feedback-form.component.scss"]
})
export class FeedbackFormComponent {
  private snackBar = inject(MatSnackBar);

  public feedbackForm: FormGroup = new FormGroup({
    "email": new FormControl("", [Validators.required, Validators.email]),
    "comment": new FormControl("", Validators.required)
  });

  public submit() {
    this.snackBar.open(
      translate("footer.form.sentSuccess"), "OK",
      { panelClass: "success" }
    );
  }
}
