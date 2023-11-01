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
import { ActivatedRoute, Router } from '@angular/router';

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
  params: {category?: string, area?: string};
  meals: Meal[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private mealDbService: MealDbService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) {
    this.filteredResult = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (
        tag ? 
        this._filter(tag) : 
        this.allTags
          .filter(tag => tag.type !== this.tags[0]?.type)
          .map(tag => tag.value)
      )),
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {  
      this.params = params;
      this.tags = [];

      Object.entries(params).map(element => {
        if (element[0] === 'area') {
          this.tags.push({value: element[1], type: FilterType.Area});
          this.getMeals(this.tags);
        } else {
          this.tags.push({value: element[1], type: FilterType.Category});
          this.getMeals(this.tags);
        }
      })

      if (Object.entries(params).length === 0) {
        this.tags = [];
        this.getMeals(this.tags);
      }
    })

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

    this.mealDbService.getAllMeals().subscribe({
      next: (meals) => {
        if (this.tags.length === 0) {
          this.meals = meals;
        }
      }, 
      error: (error) => {
        this._snackBar.open(
          `Sorry, there is an error: ${error}. Try again later.`, 'OK',
          { panelClass: 'error' }
        );
      }})
  }

  add(event: MatChipInputEvent) {
    this.addTag((event.value || '').trim());
    event.chipInput!.clear();
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
  }

  addTag(value: string) {
    if (value === '') {
      return;
    }
    
    const tag = this.allTags.find(tag => tag.value.toLowerCase() === value.toLowerCase())
    if (tag !== undefined) {
      this.router.navigate(
        ['/meals'], 
        {queryParams: tag.type === FilterType.Area ? {area: tag.value} : {category: tag.value}, 
        queryParamsHandling: 'merge'},
      )
    } else {
      this._snackBar.open(
        `There is no area or category with the name "${value}". Please choose the option from the list.`, 'OK',
      );
    }

    if (this.tags.length === 1) {
      this.tagControl.disable();
    }
  }

  remove(tag: Filter) {
    const index = this.tags.indexOf(tag);

    let newParams = Object.assign({}, this.params);

    if (tag.type === FilterType.Area) {
      delete newParams.area;
    } else {
      delete newParams.category;
    }

    this.router.navigate(
      ['meals'],
      {queryParams: newParams}
    )

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagControl.enable();

      this.announcer.announce(`Removed ${tag}`);
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
          `Sorry, there is an error: ${error}. Try again later.`, 'OK',
          { panelClass: 'error' }
        );
      }})
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filterArray = [];

    for (const tag of this.allTags
      .filter(tag => tag.type !== this.tags[0]?.type)
      .filter(tag => tag.value.toLowerCase().includes(filterValue))) {
        filterArray.push(tag.value);
    }
    
    return filterArray;
  }
}
