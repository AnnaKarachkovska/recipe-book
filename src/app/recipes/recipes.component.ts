import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl = new FormControl('');
  filteredResult: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];

  allTagsObject: { categories: string[], areas: string[], ingredients: string[] } = {
    categories: [], areas: [], ingredients: []
  };

  meals: Meal[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private mealDbService: MealDbService) {
    this.filteredResult = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  ngOnInit() {
    this.mealDbService.getCategories().subscribe(
      res => {
        this.allTags.push(...res);
        this.allTagsObject.categories = res;
      }
    );
    this.mealDbService.getAreas().subscribe(
      res => {
        this.allTags.push(...res);
        this.allTagsObject.areas = res;
      }
    )
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (this.allTags.includes(value) && !this.tags.includes(value)) {
      this.tags.push(value);
      this.getMeals(value);
    }

    event.chipInput!.clear();

    this.tagControl.setValue(null);
  }

  remove(tag: string) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.meals = [];

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    if (!this.tags.includes(event.option.viewValue)) {
      this.tags.push(event.option.viewValue);
      this.getMeals(event.option.viewValue);
    }

    this.tagInput.nativeElement.value = '';
    this.tagControl.setValue(null);
  }

  getMeals(tag: string) {
    if (this.tags.indexOf(tag) === 0 && this.allTagsObject.categories.includes(tag)) {
      this.mealDbService.getMealsByCategory(tag).subscribe(res => this.meals.push(...res));
    } else if (this.tags.indexOf(tag) === 0 && this.allTagsObject.areas.includes(tag)) {
      this.mealDbService.getMealsByArea(tag).subscribe(res => this.meals.push(...res))
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
}
