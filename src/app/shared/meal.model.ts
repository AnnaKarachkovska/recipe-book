export class Meal {
  public id: string;
  public name: string;
  public instructions: string;
  public imageUrl: string;
  public category: string;
  public area: string;
  public ingredients: {ingredient: string, measure: string}[];

  constructor(config: {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    category: string,
    area: string,
    ingredients: {ingredient: string, measure: string}[],
  }) {
    this.id = config.id;
    this.name = config.name;
    this.instructions = config.description;
    this.imageUrl = config.imageUrl;
    this.category = config.category;
    this.area = config.area;
    this.ingredients = config.ingredients;
  }
}