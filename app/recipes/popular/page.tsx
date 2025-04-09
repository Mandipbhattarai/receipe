"use client"

import { motion } from "framer-motion"
import RecipeGrid from "@/components/recipe-grid"
import { mockRecipes } from "@/lib/mock-data"

export default function PopularRecipes() {
  const popularRecipes = mockRecipes.filter((recipe) => recipe.isPopular)

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold mb-8">Popular Recipes</h1>
        <RecipeGrid recipes={popularRecipes} emptyMessage="No popular recipes found." />
      </motion.div>
    </div>
  )
}

