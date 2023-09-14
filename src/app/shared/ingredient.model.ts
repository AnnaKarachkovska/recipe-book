export class Ingredient {
  public strIngredient: string;
  public description: string | null | undefined;
  public type: string | null | undefined;
  public idIngredient: string;
  public amount?: string | null | undefined | number;
  
  public name: string;

  constructor(config: {
    id: string,
    name: string,
    description?: string,
    type?: string,
    amount?: string,
  }) {
    this.idIngredient = config.id;
    this.strIngredient = config.name;
    this.description = config.description;
    this.type = config.type;
    this.amount = config.amount;
  }
}