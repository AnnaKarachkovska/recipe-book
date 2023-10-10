import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { intersectionBy } from 'lodash-es';
import { FilterType, Filter } from 'app/shared/data-types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl = new FormControl('');
  filteredResult: Observable<string[]>;
  tags: Filter[] = [];
  allTags: Filter[] = [];

  meals: Meal[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private mealDbService: MealDbService,
    private _snackBar: MatSnackBar) {
    this.filteredResult = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (
        tag ? this._filter(tag) : this.allTags.map(tag => tag.value)
      )),
    );
  }

  ngOnInit() {
    forkJoin({
      categories: this.mealDbService.getCategories(), 
      areas: this.mealDbService.getAreas()})
    .subscribe(({ categories, areas }) => {
      this.allTags.push(
        ...categories.map(category => (
        {
          value: category, 
          type: FilterType.Category
        } as Filter)), 
        ...areas.map(area => (
          {
            value: area, 
            type: FilterType.Area
          } as Filter))
      );
    });
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    for (const tag of this.allTags) {
      if(tag.value === value) {
        this.allTags.splice(this.allTags.indexOf(tag), 1);
        this.tags.push(tag);
        this.getMeals(this.tags);
      }
    }

    event.chipInput!.clear();
    this.tagControl.setValue(null);
    if(this.tags.length === 2) {
      this.tagControl.disable();
    }
  }

  remove(tag: Filter) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.allTags.push(tag);
      this.tags.splice(index, 1);
      this.getMeals(this.tags);
      this.tagControl.enable();

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    for (const tag of this.allTags) {
      if(tag.value === event.option.viewValue) {
        this.allTags.splice(this.allTags.indexOf(tag), 1);
        this.tags.push(tag);
        this.getMeals(this.tags);
      }
    }

    this.tagInput.nativeElement.value = '';
    this.tagControl.setValue(null);
    if(this.tags.length === 2) {
      this.tagControl.disable();
    }
  }

  getMeals(tags: Filter[]) {    
    if (tags.length === 0) {
      this.meals = [];
    }
    
    this.mealDbService.getMealsForSearch(tags).subscribe({
      next: (meals) => {
        if (meals.length > 1) {
          this.meals = intersectionBy(meals[0], meals[1], 'id');
        } else {
          this.meals = meals[0];
        }
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
      }})
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filterArray = [];

    for (const tag of this.allTags.filter(tag => tag.value.toLowerCase().includes(filterValue))) {
      filterArray.push(tag.value);
    }
    
    return filterArray;
  }
}
