import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { groupBy } from "lodash-es";
import { forkJoin, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Filter, FilterType, Ingredient, Meal } from "../models";

export type MealFromAPI = {
  idMeal: string,
  strMeal: string,
  strInstructions: string,
  strMealThumb: string,
  strCategory: string,
  strArea: string,
};

export type IngredientFromAPI = {
  strIngredient: string;
  strDescription: string | null | undefined;
  idIngredient: string;
}

@Injectable({
  providedIn: 'root',
})
export class MealDbService {
  constructor(private http: HttpClient) { }

  url: string = 'https://www.themealdb.com/api/json/v1/1/';

  getRandomMeal() {
    return this.http
      .get<{ meals: [MealFromAPI] | null }>(this.url + 'random.php')
      .pipe(
        catchError(this.handleError),
        map(response => response.meals?.[0]),
        map(rawMeal => {
          if (rawMeal == null) {
            return null;
          }

          let meal: Meal = {
            id: rawMeal.idMeal,
            name: rawMeal.strMeal,
            instructions: rawMeal.strInstructions,
            imageUrl: rawMeal.strMealThumb,
            category: rawMeal.strCategory,
            area: rawMeal.strArea,
            ingredients: [{ ingredient: '', amount: '' }],
          };

          return meal;
        }))
  }

  getMealById(id: string) {
    return this.http
      .get<{ meals: MealFromAPI[] | null }>(this.url + 'lookup.php?i=' + id)
      .pipe(
        catchError(this.handleError),
        map(response => response.meals?.[0]),
        map(rawMeal => {

          if (rawMeal == null) {
            return null;
          }

          const ingredients = Object.entries(rawMeal)
            .filter(property =>
              property[0].startsWith('strIngredient') || property[0].startsWith('strMeasure'));
          const ingredientsGroup = groupBy(
            ingredients,
            (property) => property[0].length === 15 || property[0].length === 12
              ? property[0].slice(property[0].length - 2, property[0].length)
              : property[0][property[0].length - 1]
          );

          let ingredientsArray = [];
          for (let key in ingredientsGroup) {
            if (ingredientsGroup[key][0][1] === '') {
              break;
            } else {
              ingredientsArray.push({
                ingredient: ingredientsGroup[key][0][1],
                amount: ingredientsGroup[key][1][1],
              })
            }
          }

          let meal: Meal = {
            id: rawMeal.idMeal,
            name: rawMeal.strMeal,
            instructions: rawMeal.strInstructions,
            imageUrl: rawMeal.strMealThumb,
            category: rawMeal.strCategory,
            area: rawMeal.strArea,
            ingredients: ingredientsArray,
          };

          return meal;
        }))
  }

  getAllMeals() {
    return this.http
      .get<{ meals: MealFromAPI[] }>(this.url + 'search.php?s=')
      .pipe(
        catchError(this.handleError),
        map(({ meals }) => {
          let mealNames: Meal[] = [];
          meals.map(meal => {
            mealNames.push({
              id: meal.idMeal,
              name: meal.strMeal,
              area: meal.strArea,
              category: meal.strCategory,
              imageUrl: meal.strMealThumb,
              instructions: meal.strInstructions,
              ingredients: [{ ingredient: '', amount: '' }]
            })
          })
          return mealNames;
        }))
  }

  getMealsByFirstLetter(letter: string) {
    return this.http
      .get<{ meals: MealFromAPI[] }>(this.url + 'search.php?f=' + letter)
      .pipe(
        catchError(this.handleError),
        map(({ meals }) => {
          const mealNames: { name: string, id: string }[] = [];
          for (let i = 0; i < meals?.length; i++) {
            mealNames.push({ name: meals[i].strMeal, id: meals[i].idMeal });
          }
          return mealNames;
        }))
  }

  getCategories() {
    return this.http
      .get<{ meals: [{ strCategory: string }] }>(this.url + 'list.php?c=list')
      .pipe(
        catchError(this.handleError),
        map(({ meals }) => {
          const categoriesArray: string[] = [];
          for (let i = 0; i < meals?.length; i++) {
            categoriesArray.push(meals[i].strCategory);
          }
          return categoriesArray;
        }))
  }

  getAreas() {
    return this.http
      .get<{ meals: [{ strArea: string }] }>(this.url + 'list.php?a=list')
      .pipe(
        catchError(this.handleError),
        map(({ meals }) => {
          const areasArray: string[] = [];
          for (let i = 0; i < meals?.length; i++) {
            areasArray.push(meals[i].strArea);
          }
          return areasArray;
        }))
  }

  getIngredients() {
    return this.http
      .get<{ meals: IngredientFromAPI[] }>(this.url + 'list.php?i=list')
      .pipe(
        catchError(this.handleError),
        map(({ meals }) => {
          const ingredientsArray: Ingredient[] = [];
          for (let i = 0; i < meals?.length; i++) {
            ingredientsArray.push({
              name: meals[i].strIngredient,
              description: meals[i].strDescription,
              id: meals[i].idIngredient,
              imageUrl: 'https://www.themealdb.com/images/ingredients/' + meals[i].strIngredient + '.png',
              imageUrlSmall: 'https://www.themealdb.com/images/ingredients/' + meals[i].strIngredient + '-Small.png',
            })
          }
          return ingredientsArray;
        }))
  }

  getIngredientById(id: string) {
    return this.getIngredients()
      .pipe(
        map(res => res.find(ingredient => ingredient.id === id))
      );
  }

  getMealsByCategory(category: string) {
    return this.http
      .get<{ meals: MealFromAPI[] }>(this.url + 'filter.php?c=' + category)
      .pipe(
        catchError(this.handleError),
        map(response => {
          let meals: Meal[] = [];
          response.meals.map(meal => {
            meals.push({
              id: meal.idMeal,
              name: meal.strMeal,
              area: meal.strArea,
              category: meal.strCategory,
              imageUrl: meal.strMealThumb,
              instructions: meal.strInstructions,
              ingredients: [{ ingredient: '', amount: '' }]
            })
          })
          return meals;
        }),
      )
  }

  getMealsByArea(area: string) {
    return this.http
      .get<{ meals: MealFromAPI[] }>(this.url + 'filter.php?a=' + area)
      .pipe(
        catchError(this.handleError),
        map(response => {
          let meals: Meal[] = [];
          response.meals.map(meal => {
            meals.push({
              id: meal.idMeal,
              name: meal.strMeal,
              area: meal.strArea,
              category: meal.strCategory,
              imageUrl: meal.strMealThumb,
              instructions: meal.strInstructions,
              ingredients: [{ ingredient: '', amount: '' }]
            })
          })
          return meals;
        }),
      )
  }

  getMealsByIngredient(ingredient: string) {
    return this.http
      .get<{ meals: MealFromAPI[] }>(this.url + 'filter.php?i=' + ingredient)
      .pipe(
        catchError(this.handleError),
        map(response => {
          let meals: Meal[] = [];
          response.meals.map(meal => {
            meals.push({
              id: meal.idMeal,
              name: meal.strMeal,
              area: meal.strArea,
              category: meal.strCategory,
              imageUrl: meal.strMealThumb,
              instructions: meal.strInstructions,
              ingredients: [{ ingredient: '', amount: '' }]
            })
          })
          return meals;
        }),
      )
  }

  getMealsForSearch(tags: Filter[]) {
    // multiple search
    // const categoryTags = tags
    //   .filter(tag => tag.type === FilterType.Category)
    //   .map(tag => tag.value);

    const categoryTag = tags.filter(tag => tag.type === FilterType.Category)[0]?.value;
    const areaTag = tags.filter(tag => tag.type === FilterType.Area)[0]?.value;

    let mealsRequests = [];

    if (categoryTag !== undefined) {
      mealsRequests.push(this.getMealsByCategory(categoryTag))
    }

    if (areaTag !== undefined) {
      mealsRequests.push(this.getMealsByArea(areaTag))
    }

    return forkJoin(mealsRequests);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
};