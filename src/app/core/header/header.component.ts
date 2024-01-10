import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input()
  public sidebar?: MatSidenav;

  @Input()
  public showSidebar: boolean;

  availableLanguages: {label: string, id: string}[];

  private subscription: Subscription | null;

  constructor(
    private translocoService: TranslocoService,
  ) {
  }

  ngOnInit() {
    this.availableLanguages = this.translocoService.getAvailableLangs() as LangDefinition[];
  }

  changeLanguage(language: string) {
    this.subscription?.unsubscribe();
    this.subscription = this.translocoService
      .load(language)
      .pipe(take(1))
      .subscribe(() => {
        this.translocoService.setActiveLang(language);
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }
}
