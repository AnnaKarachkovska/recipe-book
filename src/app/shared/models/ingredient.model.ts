export class Ingredient {
  public name: string;
  public description: string | null | undefined;
  public id: string;
  public amount?: string | null | number | undefined;
  public imageUrl?: string | null;
  public imageUrlSmall?: string | null;

  constructor(config: {
    id: string,
    name: string,
    description?: string,
    amount?: string,
    imageUrl?: string,
    imageUrlSmall?: string,
  }) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.amount = config.amount;
    this.imageUrl = config.imageUrl;
    this.imageUrlSmall = config.imageUrlSmall;
  }
}