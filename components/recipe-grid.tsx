import RecipeCard from "@/components/recipe-card";
import type { Recipe } from "@/types/recipe";

interface RecipeGridProps {
  recipes: Recipe[];
  emptyMessage?: string;
}

export default function RecipeGrid({
  recipes,
  emptyMessage = "No recipes found",
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard key={recipe._id || index} recipe={recipe} />
      ))}
    </div>
  );
}
