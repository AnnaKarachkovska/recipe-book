export class Ingredient {
  public strIngredient: string;
  public strDescription: string | null | undefined;
  public type: string | null | undefined;
  public idIngredient: string;
  public amount?: string | null | undefined | number;
  public imageUrl?: string | null | undefined;
  public imageUrlSmall?: string | null | undefined;

  public name: string;

  constructor(config: {
    id: string,
    name: string,
    description?: string,
    type?: string,
    amount?: string,
    imageUrl?: string,
    imageUrlSmall?: string,
  }) {
    this.idIngredient = config.id;
    this.strIngredient = config.name;
    this.strDescription = config.description;
    this.type = config.type;
    this.amount = config.amount;
    this.imageUrl = config.imageUrl;
    this.imageUrlSmall = config.imageUrlSmall;
  }
}