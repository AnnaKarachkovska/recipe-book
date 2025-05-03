import { Component, DestroyRef, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSidenav } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LangDefinition, translate, TranslocoService } from "@ngneat/transloco";
import { take } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Input()
  public sidebar?: MatSidenav;

  @Input()
  public showSidebar: boolean;

  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);

  public availableLanguages: LangDefinition[];

  ngOnInit() {
    this.availableLanguages = this.translocoService.getAvailableLangs() as LangDefinition[];
  }

  changeLanguage(language: string) {
    this.translocoService
      .load(language)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.translocoService.setActiveLang(language),
        error: () => this.snackBar.open(translate("errors.commonError"), "OK", { panelClass: "error" }),
      });
  }
}
