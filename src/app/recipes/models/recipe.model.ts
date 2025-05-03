import { Ingredient } from "../../shared/models/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public imageUrl: string;
  public ingredients: Ingredient[];
  public id: string;

  constructor(config: {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    ingredients: Ingredient[],
  }) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.imageUrl = config.imageUrl;
    this.ingredients = config.ingredients;
  }
}
