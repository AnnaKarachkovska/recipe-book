export class Meal {
  public idMeal: string;
  public strMeal: string;
  public strInstructions: string;
  public strMealThumb: string;
  public strCategory: string;
  public strArea: string;

  constructor(config: {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    category: string,
    area: string,
  }) {
    this.idMeal = config.id;
    this.strMeal = config.name;
    this.strInstructions = config.description;
    this.strMealThumb = config.imageUrl;
    this.strCategory = config.category;
    this.strArea = config.area;
  }
}