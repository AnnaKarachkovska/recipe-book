import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Ingredient } from "./ingredient.model";
import { Meal } from "./meal.model";

@Injectable({
  providedIn: 'root',
})
export class MealDbService {
  constructor (private http: HttpClient) {}

  url: string = 'https://www.themealdb.com/api/json/v1/1/';

  getRandomMeal() {
    return this.http
      .get<{[key: string]: [Meal]}>(this.url + 'random.php')
      .pipe(
        catchError(this.handleError),
        map(res => {
        let meal: Meal = {
          idMeal: "",
          strMeal: "",
          strInstructions: "",
          strMealThumb: "",
          strCategory: "",
          strArea: "",
          ingredients: [{ingredient: '', measure: ''}],
        };
        for (const key in res) {
          if(res.hasOwnProperty(key)) {
            meal = res[key][0];
          }
        }
        return meal;
      }))
  }

  getMealById(id: string) {
    return this.http
    .get<{[key: string]: [{
      idMeal: string,
      strMeal: string,
      strInstructions: string,
      strMealThumb: string,
      strCategory: string,
      strArea: string,
      strIngredient1: string,
      strIngredient2: string,
      strIngredient3: string,
      strIngredient4: string,
      strIngredient5: string,
      strIngredient6: string,
      strIngredient7: string,
      strIngredient8: string,
      strIngredient9: string,
      strIngredient10: string,
      strMeasure1: string,
      strMeasure2: string,
      strMeasure3: string,
      strMeasure4: string,
      strMeasure5: string,
      strMeasure6: string,
      strMeasure7: string,
      strMeasure8: string,
      strMeasure9: string,
      strMeasure10: string,
    }]}>(this.url + 'lookup.php?i=' + id)
    .pipe(
      catchError(this.handleError),
      map(res => {
      let meal: Meal = {
        idMeal: "",
        strMeal: "",
        strInstructions: "",
        strMealThumb: "",
        strCategory: "",
        strArea: "",
        ingredients: [{ingredient: '', measure: ''}],
      };
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          meal.idMeal = res[key][0].idMeal;
          meal.strMeal = res[key][0].strMeal;
          meal.strInstructions = res[key][0].strInstructions;
          meal.strMealThumb = res[key][0].strMealThumb;
          meal.strCategory = res[key][0].strCategory;
          meal.strArea = res[key][0].strArea;
          meal.ingredients[0] = {ingredient: res[key][0].strIngredient1, measure: res[key][0].strMeasure1};
          meal.ingredients.push(
            {ingredient: res[key][0].strIngredient2, measure: res[key][0].strMeasure2},
            {ingredient: res[key][0].strIngredient3, measure: res[key][0].strMeasure3},
            {ingredient: res[key][0].strIngredient4, measure: res[key][0].strMeasure4},
            {ingredient: res[key][0].strIngredient5, measure: res[key][0].strMeasure5},
            {ingredient: res[key][0].strIngredient6, measure: res[key][0].strMeasure6},
            {ingredient: res[key][0].strIngredient7, measure: res[key][0].strMeasure7},
            {ingredient: res[key][0].strIngredient8, measure: res[key][0].strMeasure8},
            {ingredient: res[key][0].strIngredient9, measure: res[key][0].strMeasure9},
            {ingredient: res[key][0].strIngredient10, measure: res[key][0].strMeasure10},
          ); 
        }
      }
      return meal;
    }))
  }

  getMealsByFirstLetter(letter: string) {
    return this.http
    .get<{[key: string]: [Meal]}>(this.url + 'search.php?f=' + letter)
    .pipe(
      catchError(this.handleError),
      map(res => {
      let meals: Meal[] = [];
      const mealNames: {name:string, id:string}[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          meals.push(...res[key]);      
          for (let i=0; i<meals?.length; i++) {
            mealNames.push({name: meals[i].strMeal, id: meals[i].idMeal});
          }
        }
      }      
      return mealNames;
    }))
  }

  getCategories() {
    return this.http
    .get<{[key: string]: [{strCategory: string}]}>(this.url + 'list.php?c=list')
    .pipe(
      catchError(this.handleError),
      map(res => {
      let categories;
      const categoriesArray: string[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          categories = res[key];
          for (let i=0; i<categories?.length; i++) {
            categoriesArray.push(categories[i].strCategory);
          } 
        }
      }
      return categoriesArray;
    }))
  }

  getAreas() {
    return this.http
    .get<{[key: string]: [{strArea: string}]}>(this.url + 'list.php?a=list')
    .pipe(
      catchError(this.handleError),
      map(res => {
      let areas;
      const areasArray: string[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          areas = res[key];          
          for( let i=0; i<areas?.length; i++) {
            areasArray.push(areas[i].strArea);
          } 
        }        
      }
      return areasArray;
    }))
  }

  getIngredients() {
    return this.http
    .get<{[key: string]: Ingredient[]}>(this.url + 'list.php?i=list')
    .pipe(
      catchError(this.handleError),
      map(res => {
      let ingredients;
      const ingredientsArray: Ingredient[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          ingredients = res[key];
          
          for(let i=0; i<ingredients?.length; i++) {
            ingredientsArray.push({
              ...ingredients[i], 
              imageUrl: 'https://www.themealdb.com/images/ingredients/' + ingredients[i].strIngredient + '.png',
              imageUrlSmall: 'https://www.themealdb.com/images/ingredients/' + ingredients[i].strIngredient + '-Small.png',
            })
          } 
        }        
      }      
      return ingredientsArray;
    }))
  }

  getIngredientById(id: string) {
    return this.getIngredients()
      .pipe(
        map(res => res.find(ingredient => ingredient.idIngredient === id))
      );
  }

  getMealsByCategory(category: string) {
    return this.http
    .get<{[key: string]: [Meal]}>(this.url + 'filter.php?c=' + category)
    .pipe(
      catchError(this.handleError),
      map(res => {
      let meals: Meal[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          meals.push(...res[key]);            
        }
      }      
      return meals;
    }))
  }

  getMealsByArea(area: string) {
    return this.http
    .get<{[key: string]: [Meal]}>(this.url + 'filter.php?a=' + area)
    .pipe(
      catchError(this.handleError),
      map(res => {
      let meals: Meal[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          meals.push(...res[key]);            
        }
      }       
      return meals;
    }))
  }

  getMealsByIngredient(ingredient: string) {
    return this.http
    .get<{[key: string]: [Meal]}>(this.url + 'filter.php?i=' + ingredient)
    .pipe(
      catchError(this.handleError),
      map(res => {
      let meals: Meal[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          meals.push(...res[key]);            
        }
      }      
      return meals;
    }))
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
