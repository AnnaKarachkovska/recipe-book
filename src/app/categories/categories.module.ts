import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared.module";
import { CategoriesRoutingModule } from "./categories-routing.module";
import { CategoriesComponent } from "./categories.component";
import { CategoryMealsComponent } from "./category-meals/category-meals.component";

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryMealsComponent,
  ],
  imports: [
    SharedModule,
    CategoriesRoutingModule,
  ]
})
export class CategoriesModule {};