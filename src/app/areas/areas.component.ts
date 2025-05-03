import { MediaMatcher } from "@angular/cdk/layout";
import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { TranslocoService, translate } from "@ngneat/transloco";

import { CountryNames } from "app/shared/models/country-names";
import { MealDbService } from "app/shared/services/meal-db.service";
import { SharedModule } from "app/shared/shared.module";

@Component({
  selector: "app-areas",
  templateUrl: "./areas.component.html",
  styleUrls: ["./areas.component.scss"],
  standalone: true,
  imports: [ SharedModule, RouterModule ],
})
export class AreasComponent implements OnInit {
  private mediaMather = inject(MediaMatcher);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);

  private mealDbService = inject(MealDbService);

  // TODO: rewrite to signal
  public mediaChange: boolean = false;
  public areas: { en: string, uk: string, code: string }[] = [];
  public activeLanguage: string = "en";

  ngOnInit() {
    this.translocoService.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => this.activeLanguage = lang);

    this.mealDbService.getAreas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: areas => {
          this.areas = areas.map(area => {
            const countryCode = Object.entries(CountryNames)
              .find(([, name]) => name === area.en)?.[0] ?? "JE";

            return { ...area, code: countryCode };
          });
        },
        error: () => this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" }),
      })

    this.listenToWindowSizeChange();
  }

  private listenToWindowSizeChange() {
    const mediaQuery = this.mediaMather.matchMedia("(max-width: 767px)");
    mediaQuery.addEventListener("change", mediaQueryEvent => this.mediaChange = mediaQueryEvent.matches);

    this.mediaChange = mediaQuery.matches;
  };
}
