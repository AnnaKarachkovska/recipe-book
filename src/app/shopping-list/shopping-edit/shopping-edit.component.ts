import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSnackBar } from "@angular/material/snack-bar";
import { map, Observable, startWith, Subscription } from "rxjs";

import {
  getIngredientControl,
} from "app/shared/models/ingredient-form-template";
import { Ingredient } from "app/shared/models/ingredient.model";
import { MealDbService } from "app/shared/services/meal-db.service";

import { ShoppingListService } from "../../shared/services/shopping-list.service";
import { MatDialog } from "@angular/material/dialog";
import { YesNoDialogComponent } from "app/shared/components";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  providers: [],
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnChanges, OnInit {
  filteredResult: Observable<string[]>;
  allIngredients: Ingredient[] = [];
  selectedIngredient: Ingredient | undefined;
  startedEditingSubscription: Subscription;

  @Input() public editedIngredient?: Ingredient;

  @ViewChild('form') formRef: { resetForm: () => void; };
  ingredientForm = getIngredientControl();

  constructor(
    private shoppingListService: ShoppingListService,
    private mealDbService: MealDbService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.filteredResult = this.ingredientForm.controls['name'].valueChanges.pipe(
      startWith(null),
      map((ingredient: string | null) => (
        ingredient ?
          this._filter(ingredient) :
          this.allIngredients
            .map(ingredient => ingredient.name)
      )),
    );
  }

  ngOnInit() {
    this.mealDbService.getIngredients().subscribe({
      next: ingredients => this.allIngredients = ingredients,
      error: () => {
        this.snackBar.open('Oops, something bad happend. Please, try again later.', 'OK', { panelClass: 'error' });
      }
    });
  }

  ngOnChanges() {
    if (this.editedIngredient) {
        this.ingredientForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
    } else {
      this.clear();
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.ingredientForm.value['name'] = event.option.viewValue;
    this.selectedIngredient = this.allIngredients
      .find(ingredient => ingredient.name === event.option.viewValue);
  }

  submit() {
    if (this.ingredientForm.invalid ||
      this.ingredientForm.value['name'] == null ||
      this.ingredientForm.value['amount'] == null) {
      return;
    }

    const ingredient = this.allIngredients
      .find(ingredient => 
        ingredient.name.toLowerCase() === this.ingredientForm.value['name']?.toLowerCase()
      );

    if (ingredient !== undefined) {
      if (this.editedIngredient !== undefined) {
        this.shoppingListService.updateIngredient(this.editedIngredient.id, {
          ...ingredient,
          amount: this.ingredientForm.value['amount']
        });
      } else {
        this.shoppingListService.addIngredient({
          ...ingredient,
          amount: this.ingredientForm.value['amount']
        });
      }
    } else {
      this.snackBar.open(
        `Ingredient with name "${this.ingredientForm.value['name']}" is not found.`, 'OK',
      );
    }

    this.clear();
  }

  deleteItem() {
    if (this.editedIngredient !== undefined) {
      const dialogRef = this.dialog.open(
        YesNoDialogComponent,
        { data: { action: 'delete', name: this.editedIngredient.name} }
      );
      dialogRef.afterClosed().subscribe(result => {
        if (result && this.editedIngredient !== undefined) {
          this.shoppingListService.deleteIngredient(this.editedIngredient.id);
          this.clear();
        }
      });
    }
  }

  clear() {
    this.formRef?.resetForm();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filterArray = [];

    for (const ingredient of this.allIngredients
      .filter(ingredient => ingredient.name.toLowerCase().includes(filterValue))) {
      filterArray.push(ingredient.name);
    }

    return filterArray;
  }
}
