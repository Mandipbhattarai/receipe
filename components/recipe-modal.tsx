"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Share2, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Recipe } from "@/types/recipe";

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  toggleSave: () => void;
  onClose: () => void;
}

export default function RecipeModal({
  recipe,
  isOpen,
  onClose,
  toggleSave,
}: RecipeModalProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSaved(recipe.isFavorite ?? false);
    }
  }, [isOpen, recipe.isFavorite]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: recipe.title,
          text: `Check out this recipe for ${recipe.title}!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      const shareUrl = `${window.location.origin}/recipes/${recipe._id}`;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert("Recipe link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            {recipe.title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <Image
                src={recipe.image || "/placeholder.svg?height=300&width=400"}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{recipe.category}</Badge>
              <Badge variant="outline">{recipe.cuisine}</Badge>
              {recipe.dietary !== "None" && (
                <Badge variant="outline">{recipe.dietary}</Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center p-3 bg-secondary rounded-lg">
                <Clock className="h-5 w-5 mb-1 text-primary" />
                <span className="text-xs text-muted-foreground">Prep Time</span>
                <span className="font-medium">{recipe.prepTime}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-secondary rounded-lg">
                <Clock className="h-5 w-5 mb-1 text-primary" />
                <span className="text-xs text-muted-foreground">Cook Time</span>
                <span className="font-medium">{recipe.cookTime}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-secondary rounded-lg">
                <Users className="h-5 w-5 mb-1 text-primary" />
                <span className="text-xs text-muted-foreground">Servings</span>
                <span className="font-medium">{recipe.servings}</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button
                onClick={toggleSave}
                variant={saved ? "default" : "outline"}
                className="flex-1"
              >
                {saved ? "Saved" : "Save Recipe"}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>

          <div>
            <Tabs defaultValue="ingredients">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="ingredients" className="flex-1">
                  Ingredients
                </TabsTrigger>
                <TabsTrigger value="instructions" className="flex-1">
                  Instructions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="space-y-4">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="instructions" className="space-y-4">
                <h3 className="text-lg font-semibold">Instructions</h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium text-sm mr-3">
                        {index + 1}
                      </span>
                      <span className="flex-1">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
