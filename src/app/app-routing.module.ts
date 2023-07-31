import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', redirectTo: '/recipes', pathMatch: 'full'},
      {path: 'recipes', component: RecipesComponent, children: [
        {path: '', component: RecipeStartComponent}, 
        {path: ':id', component: RecipeDetailComponent},
      ]},
      {path: 'shopping-list', component: ShoppingListComponent}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}