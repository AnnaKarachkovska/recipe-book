import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
  NotFoundPageComponent,
} from "./not-found-page/not-found-page.component";
import {
  RecipeDetailComponent,
} from "./recipes/recipe-detail/recipe-detail.component";
import {
  RecipeStartComponent,
} from "./recipes/recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/recipes', pathMatch: 'full' },
      { path: 'recipes', children: [
        {
          path: '', loadChildren: () => import("./recipes/recipes.module").then(module => module.RecipesModule),
        }
      ] },
      { path: 'shopping-list', component: ShoppingListComponent },
      { path: '**', pathMatch: 'full', component: NotFoundPageComponent },
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
//       { path: 'recipes', component: RecipesComponent },
// , children: [
//   { path: '', component: RecipeStartComponent },
//   { path: ':id', component: RecipeDetailComponent },
// ]