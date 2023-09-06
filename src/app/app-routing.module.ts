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
        loadChildren: () => import("./landing-page/landing-page.module")
          .then(module => module.LandingPageModule), 
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
        loadChildren: () => import("./areas/areas.module")
          .then(module => module.AreasModule)
      },
      { 
        path: 'categories', 
        loadChildren: () => import("./categories/categories.module")
          .then(module => module.CategoriesModule)
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