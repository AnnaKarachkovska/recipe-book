import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslocoService, getBrowserLang } from '@ngneat/transloco';
import { HeaderComponent } from './core/header/header.component';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  @ViewChild(MatSidenav, { static: true })
  public sidebar: MatSidenav;

  public showSidebar: boolean = false;

  constructor(
    private mediaMather: MediaMatcher,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit() {
    this.listenToWindowSizeChange();

    this.translocoService.setActiveLang(getBrowserLang() || 'en');
  }

  private listenToWindowSizeChange() {
    let mediaQuery = this.mediaMather.matchMedia("(max-width: 991px)");
    mediaQuery.addEventListener("change", mediaQueryEvent => this.updateSidebar(mediaQueryEvent.matches));

    this.updateSidebar(mediaQuery.matches);
  }

  private updateSidebar(showSidebar: boolean) {
    this.showSidebar = showSidebar;

    if (this.sidebar?.opened && !this.showSidebar) {
      this.sidebar.opened = false;
    }
  }
}
