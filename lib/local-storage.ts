import { Recipe } from "@/types/recipe";

export const saveRecipe = (recipe: Recipe): void => {
  if (typeof window !== "undefined") {
    const savedRecipeIds = getSavedRecipeIds();
    if (recipe._id && !savedRecipeIds.includes(recipe._id)) {
      const updatedIds = [...savedRecipeIds, recipe._id];
      localStorage.setItem("savedRecipeIds", JSON.stringify(updatedIds));
    }
  }
};

export const unsaveRecipe = (recipeId: string): void => {
  if (typeof window !== "undefined") {
    const savedRecipeIds = getSavedRecipeIds();
    const updatedIds = savedRecipeIds.filter((id) => id !== recipeId);
    localStorage.setItem("savedRecipeIds", JSON.stringify(updatedIds));
  }
};

export const getSavedRecipeIds = (): string[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("savedRecipeIds");
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

export const isSaved = (recipeId: string): boolean => {
  return getSavedRecipeIds().includes(recipeId);
};
