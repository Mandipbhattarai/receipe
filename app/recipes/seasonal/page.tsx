"use client"

import { motion } from "framer-motion"
import RecipeGrid from "@/components/recipe-grid"
import { mockRecipes } from "@/lib/mock-data"

export default function SeasonalRecipes() {
  const seasonalRecipes = mockRecipes.filter((recipe) => recipe.isSeasonal)

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold mb-8">Seasonal Recipes</h1>
        <RecipeGrid recipes={seasonalRecipes} emptyMessage="No seasonal recipes found." />
      </motion.div>
    </div>
  )
}

