"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RecipeGrid from "@/components/recipe-grid";
import type { Recipe } from "@/types/recipe";

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/recipes/all");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch recipes.");
        }

        // ✅ Filter recipes that are marked as favorite
        const favoritesOnly = data.recipes.filter(
          (recipe: Recipe) => recipe.isFavorite === true
        );

        setSavedRecipes(favoritesOnly);
      } catch (err: any) {
        console.error("Error fetching saved recipes:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-8">Saved Recipes</h1>

        {loading && (
          <p className="text-muted-foreground">Loading saved recipes...</p>
        )}

        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && (
          <RecipeGrid
            recipes={savedRecipes}
            emptyMessage="You haven't saved any recipes yet. Browse recipes and click the heart icon to save them for later."
          />
        )}
      </motion.div>
    </div>
  );
}
