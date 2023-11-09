import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions,
} from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AreasComponent } from "./areas/areas.component";
import { CategoriesComponent } from "./categories/categories.component";
import {
  FeedbackFormComponent,
} from "./core/footer/feedback-form/feedback-form.component";
import { FooterComponent } from "./core/footer/footer.component";
import { HeaderComponent } from "./core/header/header.component";
import { SearchBarComponent } from "./core/header/search-bar/search-bar.component";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { RecipesModule } from "./recipes/recipes.module";
import {
  YesNoDialogComponent,
} from "./shared/components/yes-no-dialog/yes-no-dialog.component";
import { SharedModule } from "./shared/shared.module";
import { ShoppingListModule } from "./shopping-list/shopping-list.module";
import { LandingPageComponent } from "./core/landing-page/landing-page.component";

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
    LandingPageComponent,
    AreasComponent,
    CategoriesComponent,
    IngredientsModule,
  ],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}],
  bootstrap: [AppComponent]
})
export class AppModule { }
