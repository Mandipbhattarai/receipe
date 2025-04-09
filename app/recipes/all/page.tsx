"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import RecipeGrid from "@/components/recipe-grid"
import { mockRecipes } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function AllRecipes() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRecipes = mockRecipes.filter((recipe) => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">All Recipes</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <RecipeGrid recipes={filteredRecipes} emptyMessage="No recipes found. Try a different search term." />
      </motion.div>
    </div>
  )
}

