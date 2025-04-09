"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { saveRecipe, unsaveRecipe, isSaved } from "@/lib/local-storage";
import RecipeModal from "./recipe-modal";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [saved, setSaved] = useState(recipe.isFavorite ?? false); // <-- shared state

  const toggleSave = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSaving) return;

    setIsSaving(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!recipe._id || !user?.email) {
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/recipes/favorite", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: recipe._id }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to toggle favorite");
      }

      const updated = !saved;
      setSaved(updated);
      recipe.isFavorite = updated;

      updated ? saveRecipe(recipe) : unsaveRecipe(recipe._id);
    } catch (err) {
      console.error("Toggle favorite failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative h-48">
            <Image
              src={recipe.image || "/placeholder.svg?height=300&width=400"}
              alt={recipe.title}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={toggleSave}
            >
              <Heart
                className={`h-5 w-5 ${
                  saved ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="sr-only">Save recipe</span>
            </Button>
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold line-clamp-2">
                {recipe.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span>
                {recipe.prepTime} + {recipe.cookTime}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{recipe.category}</Badge>
              <Badge variant="outline">{recipe.cuisine}</Badge>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="default" className="w-full">
              View Recipe
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <RecipeModal
        recipe={recipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toggleSave={toggleSave}
      />
    </>
  );
}
