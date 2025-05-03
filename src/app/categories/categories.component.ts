import { MediaMatcher } from "@angular/cdk/layout";
import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { TranslocoService, translate } from "@ngneat/transloco";

import { MealDbService } from "app/shared/services/meal-db.service";
import { SharedModule } from "app/shared/shared.module";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  standalone: true,
  imports: [ SharedModule, RouterModule ],
})
export class CategoriesComponent implements OnInit {
  private mediaMather = inject(MediaMatcher);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);

  private mealDbService = inject(MealDbService);

  // TODO: rewrite to signal; take to shared and reuse
  public mediaChange: boolean = false;
  public categories: { en: string, uk: string }[] = [];
  public activeLanguage: string = "en";

  ngOnInit() {
    this.translocoService.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => this.activeLanguage = lang);

    this.mealDbService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: categories => this.categories = categories,
        error: () => this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" }),
      })

    this.listenToWindowSizeChange();
  }

  // TODO: reuse
  private listenToWindowSizeChange() {
    let mediaQuery = this.mediaMather.matchMedia("(max-width: 767px)");
    mediaQuery.addEventListener("change", mediaQueryEvent => this.mediaChange = mediaQueryEvent.matches);

    this.mediaChange = mediaQuery.matches;
  };
}
