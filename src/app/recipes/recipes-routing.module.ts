import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipesComponent } from "./recipes.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: RecipesComponent },
      { path: ':id', component: RecipeDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RecipesRoutingModule {
}