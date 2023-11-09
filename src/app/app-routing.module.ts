import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
  NotFoundPageComponent,
} from "./not-found-page/not-found-page.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { 
        path: '',  
        loadComponent: () => import("./core/landing-page/landing-page.component")
          .then(module => module.LandingPageComponent), 
        pathMatch: 'full' 
      },
      { 
        path: 'meals', 
        loadChildren: () => import("./recipes/recipes.module")
          .then(module => module.RecipesModule)
      },
      { 
        path: 'shopping-list', 
        loadChildren: () => import("./shopping-list/shopping-list.module")
          .then(module => module.ShoppingListModule) 
      },
      { 
        path: 'areas', 
        loadComponent: () => import("./areas/areas.component")
          .then(module => module.AreasComponent)
      },
      { 
        path: 'categories', 
        loadComponent: () => import("./categories/categories.component")
          .then(module => module.CategoriesComponent)
      },
      { 
        path: 'ingredients', 
        loadChildren: () => import("./ingredients/ingredients.module")
          .then(module => module.IngredientsModule)
      },
      { path: '**', pathMatch: 'full', component: NotFoundPageComponent },
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}