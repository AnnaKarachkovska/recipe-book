import {
  Component, Input, OnChanges, 
  SimpleChanges, ViewChild,
} from "@angular/core";
import { getIngredientControl } from "app/shared/ingredient-form-template";
import { Subscription } from "rxjs";

import { Ingredient } from "src/app/shared/ingredient.model";

import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  providers: [],
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnChanges {

  startedEditingSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  @Input()
  public ingredient?: Ingredient;

  @ViewChild('form') formRef: { resetForm: () => void; };

  ingredientForm = getIngredientControl();

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ingredient.currentValue) {
      const item = this.shoppingListService.getIngredient(changes.ingredient.currentValue.name);
      if (item !== undefined) {
        this.editMode = true;
        this.editedItem = item;
        this.ingredientForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    } else {
      this.editMode = false;
      this.clear();
    }
  }

  submit() {
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
      this.shoppingListService.updateIngredient(
        this.editedItem.name, newIngredient);
      this.editMode = false;
    }
    else {
      this.shoppingListService.addIngredient(newIngredient);
    }

    this.clear();
  }

  deleteItem() {
    this.shoppingListService.deleteIngredient(this.editedItem.name);
    this.clear();
    this.editMode = false;
  }

  clear() {
    this.formRef?.resetForm();
  }
}
