import { Ingredient } from "../shared/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public id: string;

  constructor(config: {
    id: string,
    name: string,
    desc: string,
    imagePath: string,
    ingredients: Ingredient[],
  }) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.desc;
    this.imagePath = config.imagePath;
    this.ingredients = config.ingredients;
  }
}