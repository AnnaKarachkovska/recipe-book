import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CategoriesComponent } from "./categories.component";
import { CategoryMealsComponent } from "./category-meals/category-meals.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: CategoriesComponent },
      { path: ':category', component: CategoryMealsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {};