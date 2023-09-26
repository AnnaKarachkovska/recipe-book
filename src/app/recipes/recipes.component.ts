import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MealDbService } from 'app/shared/meal-db.service';
import { Meal } from 'app/shared/meal.model';
import { unionBy } from 'lodash-es';

export enum FilterType {
  Area, Category, Ingredient
};

export type Filter = {
  value: string;
  type: FilterType;
};

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

  // allTagsObject: { categories: string[], areas: string[], ingredients: string[] } = {
  //   categories: [], areas: [], ingredients: []
  // };

  meals: Meal[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private mealDbService: MealDbService) {
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
      // this.allTagsObject.categories = categories;
      // this.allTagsObject.areas = areas;
    });
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    for (const tag of this.allTags) {
      if(tag.value === value) {
        this.tags.push(tag);
        this.getMeals(this.tags);
      }
    }

    // if (this.allTags.find(tag => tag.value === value) 
    //   && !this.allTags.find(tag => tag.value === value)) {
    //     this.tags.push()
    // }

    // if (this.allTags.includes(value) && !this.tags.includes(value)) {
    //   this.tags.push(value);
    //   this.getMeals(value);
    // }

    event.chipInput!.clear();

    this.tagControl.setValue(null);
  }

  remove(tag: Filter) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.meals = [];

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    for (const tag of this.allTags) {
      if(tag.value === event.option.viewValue) {
        this.tags.push(tag);
        this.getMeals(this.tags);
      }
    }
    // if (!this.tags.includes(event.option.viewValue)) {
    //   this.tags.push(event.option.viewValue);
    //   this.getMeals(event.option.viewValue);
    // }

    this.tagInput.nativeElement.value = '';
    this.tagControl.setValue(null);
  }

  getMeals(tags: Filter[]) {
    // forkJoin requests
    // todo: 
    // 1. recieve list of tags
    // 2. query all tags with forkJoin
    // 3. unionBy lodash

    // todo: move to mealDbService

    // const categoryTag = tags.filter(tag => tag.type === FilterType.Category)[0]?.value;
    // const areaTag = tags.filter(tag => tag.type === FilterType.Area)[0]?.value;

    // forkJoin({
    //   mealsByCategory: this.mealDbService.getMealsByCategory(categoryTag),
    //   mealsByArea: this.mealDbService.getMealsByArea(areaTag)
    // })
    // .subscribe(console.log)

    // for (const tag of tags) {
    //   forkJoin({
    //     mealsByCategory: this.mealDbService.getMealsByCategory(tag.value),
    //     mealsByArea: this.mealDbService.getMealsByArea(tag.value)
    //   })
    //   .subscribe(console.log)
    // }

    // let mealsByCategory;
    // let mealsByArea;

    // for (const tag of tags) {
    //   if (tag.type === FilterType.Category) {
    //     this.mealDbService.getMealsByCategory(tag.value)
    //       .subscribe(meals => mealsByCategory = meals)
    //   } else if (tag.type === FilterType.Area) {
    //     this.mealDbService.getMealsByArea(tag.value)
    //       .subscribe(meals => mealsByArea = meals)          
    //   }
    // }

    // unionBy(mealsByArea, mealsByCategory, 'strMeal');

    // forkJoin({
    //   mealsByCategory: this.mealDbService.getMealsByCategory(tag.value),
    //   mealsByArea: this.mealDbService.getMealsByArea(tag.value)
    // })
    // .subscribe(meals => console.log(meals))

    // if (this.tags.indexOf(tag) === 0 && this.allTagsObject.categories.includes(tag)) {
    //   this.mealDbService.getMealsByCategory(tag).subscribe(res => this.meals.push(...res));
    // } else if (this.tags.indexOf(tag) === 0 && this.allTagsObject.areas.includes(tag)) {
    //   this.mealDbService.getMealsByArea(tag).subscribe(res => this.meals.push(...res))
    // }
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
