import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
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
      .pipe(map(res => {
        let meal: Meal = {
          idMeal: "",
          strMeal: "",
          strInstructions: "",
          strMealThumb: "",
          strCategory: "",
          strArea: ""
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
    .get<{[key: string]: [Meal]}>(this.url + 'lookup.php?i=' + id)
    .pipe(map(res => {
      let meal: Meal = {
        idMeal: "",
        strMeal: "",
        strInstructions: "",
        strMealThumb: "",
        strCategory: "",
        strArea: ""
      };
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          meal = res[key][0];            
        }
      }
      return meal;
    }))
  }

  getMealsByFirstLetter(letter: string) {
    return this.http
    .get<{[key: string]: [Meal]}>(this.url + 'search.php?f=' + letter)
    .pipe(map(res => {
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
    .pipe(map(res => {
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
    .pipe(map(res => {
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
    .pipe(map(res => {
      let ingredients;
      const ingredientsArray: Ingredient[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          ingredients = res[key];
          
          for( let i=0; i<ingredients?.length; i++) {
            ingredientsArray.push(ingredients[i]);
          } 
        }        
      }      
      return ingredientsArray;
    }))
  }

  getMealsByCategory(category: string) {
    return this.http
    .get<{[key: string]: [Meal]}>(this.url + 'filter.php?c=' + category)
    .pipe(map(res => {
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
    .pipe(map(res => {
      let meals: Meal[] = [];
      for (const key in res) {
        if(res.hasOwnProperty(key)) {
          meals.push(...res[key]);            
        }
      }      
      return meals;
    }))
  }
};
