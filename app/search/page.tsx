"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import RecipeGrid from "@/components/recipe-grid"
import { mockRecipes } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(query)
  const [filteredRecipes, setFilteredRecipes] = useState(mockRecipes)

  useEffect(() => {
    setSearchTerm(query)

    if (query) {
      const results = mockRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query.toLowerCase())) ||
          recipe.cuisine.toLowerCase().includes(query.toLowerCase()) ||
          recipe.category.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredRecipes(results)
    } else {
      setFilteredRecipes(mockRecipes)
    }
  }, [query])

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">{query ? `Search Results for "${query}"` : "All Recipes"}</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Refine search..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
                }
              }}
            />
          </div>
        </div>

        <RecipeGrid
          recipes={filteredRecipes}
          emptyMessage={query ? `No recipes found for "${query}". Try a different search term.` : "No recipes found."}
        />
      </motion.div>
    </div>
  )
}

