import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions,
} from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AreasModule } from "./areas/areas.module";
import { CategoriesModule } from "./categories/categories.module";
import {
  FeedbackFormComponent,
} from "./footer/feedback-form/feedback-form.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SearchBarComponent } from "./header/search-bar/search-bar.component";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { LandingPageModule } from "./landing-page/landing-page.module";
import { RecipesModule } from "./recipes/recipes.module";
import {
  YesNoDialogComponent,
} from "./shared/components/yes-no-dialog/yes-no-dialog.component";
import { SharedModule } from "./shared/shared.module";
import { ShoppingListModule } from "./shopping-list/shopping-list.module";

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 100,
  touchendHideDelay: 0,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    YesNoDialogComponent,
    SearchBarComponent,
    FooterComponent,
    FeedbackFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    RecipesModule,
    ShoppingListModule,
    AreasModule,
    CategoriesModule,
    IngredientsModule,
    LandingPageModule
  ],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}],
  bootstrap: [AppComponent]
})
export class AppModule { }
