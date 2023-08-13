import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  providers: [],
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  startedEditingSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  @Output() isOnEditMode = new EventEmitter<boolean>();
  @ViewChild('form') formRef: { resetForm: () => void; };

  ingredientForm = new FormGroup({
    'name': new FormControl('', Validators.required),
    'amount': new FormControl(
      0, 
      [
        Validators.required, 
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
  });

  constructor(private shoppingListService: ShoppingListService) { };

  ngOnInit() {
    this.startedEditingSubscription = this.shoppingListService.startedEditing
      .subscribe(
        (index: number) => {
          if (index === null) {
            this.isOnEditMode.emit(false);
            this.editMode = false;
            this.onClear();
          } else {
            this.isOnEditMode.emit(true);
            this.editMode = true;
            this.editedItemIndex = index;
            this.editedItem = this.shoppingListService.getIngredient(index);
            this.ingredientForm.setValue({
              name: this.editedItem.name,
              amount: this.editedItem.amount
            })
          }
        }
      );
  }

  onSubmit() {
    if (this.ingredientForm.invalid || 
      (this.ingredientForm.value['name'] == null || 
      this.ingredientForm.value['amount'] == null)) {
      return;
    } 

      const newIngredient = new Ingredient(
        this.ingredientForm.value['name'], 
        this.ingredientForm.value['amount']
      );
      if (this.editMode) {
        this.shoppingListService.updateIngredient(
          this.editedItemIndex, newIngredient);
        this.isOnEditMode.emit(false);
        this.editMode = false;
      } else {
        this.shoppingListService.addIngredient(newIngredient);
      }

    this.formRef.resetForm();
  }

  onDeleteItem() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
    this.isOnEditMode.emit(false);
    this.editMode = false;
  }

  onClear() {
    this.formRef.resetForm();
  }

  ngOnDestroy() {
    this.startedEditingSubscription.unsubscribe();
  }
}
