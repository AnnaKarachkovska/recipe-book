import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { ShoppingListService } from 'app/shopping-list/shopping-list.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  providers: [],
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  meal: Meal | null;
  mealImageUrl: string = '';

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private mealDbService: MealDbService, 
    private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.mealDbService.getMealById(params['id'])) 
      )
      .subscribe({
        next: (meal) => {
          this.meal = meal;
          this.mealImageUrl = meal?.imageUrl + '/preview';
        }, 
        error: (error) => {
          this._snackBar.open(
            `Sorry, there is an error: ${error}. Try again later.`, '',
            {
              verticalPosition: 'top',
              horizontalPosition: 'end',
              duration: 1500,
              panelClass: ['snackbar']
            });
        }
      })
  }

  // onEditRecipe() {
  //   this.dialog.open(RecipeEditComponent, {
  //     data: {
  //       id: this.id,
  //     }
  //   });
  // }

  onAddToShoppingList() {
    if (this.meal?.ingredients) {
      this.shoppingListService.addIngredients(this.meal.ingredients);
      this._snackBar.open(
        'Ingrediens have been added to the shopping list.', '',
        {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 1500
        });
    }
  }

  // onDeleteRecipe() {
  //   const dialogRef = this.dialog.open(
  //     DialogWindowComponent, 
  //     { data: { name: this.recipe.name } }
  //   );
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.recipeService.deleteRecipe(this.id);
  //       this.router.navigate(['/recipes']);
  //     }
  //   });
  // }
}
