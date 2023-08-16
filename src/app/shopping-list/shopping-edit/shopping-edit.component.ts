import {
  Component, EventEmitter, Input, OnChanges,
  OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { Ingredient } from "src/app/shared/ingredient.model";

import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  providers: [],
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnChanges, OnDestroy {
  startedEditingSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  @Input()
  public ingredient?: Ingredient;

  @Output() isOnEditMode = new EventEmitter<boolean>();
  @ViewChild('form') formRef: { resetForm: () => void; };

  // TODO: reuse ingredient formGroup initializer as in recipe-edit 
  // getIngredientForm({
  //   assertUnique: boolean = false
  // }){
  //   assertUnique ? [Validators.required, Validators.unquie] : Validators.required
  // }

  ingredientForm = new FormGroup({
    'name': new FormControl('', Validators.required),
    'amount': new FormControl(
      0,
      [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
  });

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ingredient.currentValue) {
      // TODO: clear form on currentValue == null
      // TODO: init form on currentValue != null
    }
  }

  ngOnInit() {
    // TODO: remove in favor of ngOnChanges listener
    this.startedEditingSubscription = this.shoppingListService.startedEditing
      .subscribe(
        (index: number) => {
          if (index === null) {
            this.isOnEditMode.emit(false);
            this.editMode = false;
            this.clear();
          }
          else {
            this.editMode = true;
            this.editedItemIndex = index;
            this.editedItem = this.shoppingListService.getIngredient(index);
            this.ingredientForm.setValue({
              name: this.editedItem.name,
              amount: this.editedItem.amount
            });

            this.isOnEditMode.emit(true);
          }
        }
      );
  }

  onSubmit() {
    if (this.ingredientForm.invalid ||
      this.ingredientForm.value['name'] == null ||
      this.ingredientForm.value['amount'] == null) {
      return;
    }

    const newIngredient = new Ingredient(
      this.ingredientForm.value['name'],
      this.ingredientForm.value['amount']
    );

    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
      this.isOnEditMode.emit(false);
      this.editMode = false;
    }
    else {
      this.shoppingListService.addIngredient(newIngredient);
    }

    this.clear();
  }

  onDeleteItem() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.clear();
    this.isOnEditMode.emit(false);
    this.editMode = false;
  }

  clear() {
    this.formRef.resetForm();
  }

  ngOnDestroy() {
    this.startedEditingSubscription.unsubscribe();
  }
}
