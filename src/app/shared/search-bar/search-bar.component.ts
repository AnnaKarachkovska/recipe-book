import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MealDbService } from '../meal-db.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  filteredOptions: Observable<string[]>;

  meals: { name: string, id: string }[] = [];
  options: string[] = [];

  constructor(private mealsDbService: MealDbService,
    private router: Router) { };

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value || '')),
    )
  }

  submit() {
    for (let meal of this.meals) {
      if (meal.name === this.searchControl.value) {
        this.router.navigate([`/meals/${meal.id}`])
        this.searchControl.setValue('');
        this.meals = [];
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (value.length !== 0 && value.length < 2) {
      this.mealsDbService.getMealsByFirstLetter(value.slice(0, 1))
        .subscribe(res => {
          this.meals = res;
        });
    }

    this.options = this.meals.map(meal => meal.name);

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}