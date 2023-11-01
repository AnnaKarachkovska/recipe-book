import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { DialogWindowComponent } from './shared/dialog-window/dialog-window.component';

import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions
} from '@angular/material/tooltip';

import { RecipesModule } from './recipes/recipes.module';
import { SharedModule } from './shared.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { AreasModule } from './areas/areas.module';
import { CategoriesModule } from './categories/categories.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { HttpClientModule } from '@angular/common/http';
import { SearchBarComponent } from './header/search-bar/search-bar.component';
import { FooterComponent } from './footer/footer.component';
import { FeedbackFormComponent } from './footer/feedback-form/feedback-form.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 100,
  touchendHideDelay: 0,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DialogWindowComponent,
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
