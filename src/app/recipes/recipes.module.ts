import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";

import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import {
  RecipeItemComponent,
} from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipesRoutingModule } from "./recipes-routing.module";
import { RecipesComponent } from "./recipes.component";

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
  ],
  imports:[
    RecipesRoutingModule,
    SharedModule,
  ],
})
export class RecipesModule {};
