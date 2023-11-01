import {
  FormControl, FormGroup, ValidatorFn, Validators,
} from "@angular/forms";

import { Ingredient } from "./ingredient.model";

export function getIngredientControl(ingredient?: Ingredient, validator?: ValidatorFn) {
  return new FormGroup({
    'name': new FormControl(
      ingredient?.name || null,
      validator ? [Validators.required, validator] : Validators.required),
    'amount': new FormControl(ingredient?.amount || null || undefined, [
      Validators.required,
      Validators.min(1),
      Validators.max(1000),
    ])
  })
}
