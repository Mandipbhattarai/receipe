"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecipeGrid from "@/components/recipe-grid"
import { mockRecipes } from "@/lib/mock-data"
import { Category } from "@/types/recipe"

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all")

  const getRecipesByCategory = (category: Category | "all") => {
    if (category === "all") {
      return mockRecipes
    }
    return mockRecipes.filter((recipe) => recipe.category === category)
  }

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold mb-8">Recipe Categories</h1>

        <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value as Category | "all")}>
          <TabsList className="mb-8 flex flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.values(Category).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            <RecipeGrid
              recipes={getRecipesByCategory(activeCategory)}
              emptyMessage={`No recipes found in ${activeCategory} category.`}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

