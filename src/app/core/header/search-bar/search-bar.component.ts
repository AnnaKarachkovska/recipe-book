import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, map, Observable, startWith } from "rxjs";

import { MealDbService } from "../../../shared/services/meal-db.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { translate } from "@ngneat/transloco";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  filteredOptions: Observable<{ name: string, id: string }[]>;
  meals: { name: string, id: string }[] = [];

  placeholder = translate('header.searchBar.placeholder');

  constructor(
    private mealsDbService: MealDbService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value || '')),
    )
  }

  submit(value: string) {
    for (let meal of this.meals) {
      if (meal.name === value) {
        this.router.navigate([`/meals/${meal.id}`])
        this.searchControl.setValue('');
        this.meals = [];
      }
    }
  }

  private _filter(value: string): { name: string, id: string }[] {
    const filterValue = value.toLowerCase();

    if (value.length !== 0) {
      this.mealsDbService.getMealsByFirstLetter(value.slice(0, 1))
        .subscribe({
          next: meals => this.meals = meals,
          error: () => {
            this.snackBar.open(translate('errors.commonError'), 'OK', { panelClass: 'error' });
          }
        });
    }

    return this.meals
      .filter(meal => meal.name.toLowerCase().includes(filterValue));
  }
}
