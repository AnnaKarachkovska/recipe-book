import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { 
        path: '', component: RecipesComponent, 
        // children: [
        //   { path: '', component: RecipeStartComponent },
        //   { path: ':id', component: RecipeDetailComponent }
        // ],
      },
      { path: ':id', component: RecipeDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RecipesRoutingModule {
}

//       { path: 'recipes', component: RecipesComponent },
// , children: [
//   { path: '', component: RecipeStartComponent },
//   { path: ':id', component: RecipeDetailComponent },
// ]