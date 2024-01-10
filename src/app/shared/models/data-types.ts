export enum FilterType {
  Area, Category, Ingredient
};

export type Filter = {
  value: string;
  type: FilterType;
  label: string;
};