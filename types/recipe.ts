export enum RecipeCategory {
  "Quick & Easy" = "Quick & Easy",
  "Breakfast Favorites" = "Breakfast Favorites",
  "Healthy Salads" = "Healthy Salads",
  "Comfort Food" = "Comfort Food",
  "Meat Lovers" = "Meat Lovers",
  Vegetarian = "Vegetarian",
  "Grilling Recipes" = "Grilling Recipes",
  "International Cuisine" = "International Cuisine",
}

export interface Recipe {
  _id?: string;
  image?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  prepTime: string;
  cookTime: string;
  mealType: string;
  dietary?: string;
  category: RecipeCategory;
  servings: number;
  createdAt?: Date;
  isFavorite?: boolean;
  isPopular?: boolean;
  isSeasonal?: boolean;
}

// These enums are kept for backward compatibility with existing components
export enum Category {
  BREAKFAST = "Breakfast",
  LUNCH = "Lunch",
  DINNER = "Dinner",
  APPETIZER = "Appetizer",
  DESSERT = "Dessert",
  SNACK = "Snack",
}

export enum Cuisine {
  AMERICAN = "American",
  ITALIAN = "Italian",
  MEXICAN = "Mexican",
  ASIAN = "Asian",
  FRENCH = "French",
  INDIAN = "Indian",
  GREEK = "Greek",
  SPANISH = "Spanish",
}

export enum MealType {
  NONE = "None",
  BREAKFAST = "Breakfast",
  LUNCH = "Lunch",
  DINNER = "Dinner",
  APPETIZER = "Appetizer",
  DESSERT = "Dessert",
  SNACK = "Snack",
}
