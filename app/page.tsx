"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RecipeGrid from "@/components/recipe-grid";
import type { Recipe } from "@/types/recipe";

export default function Home() {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes/all");
        const data = await response.json();

        if (response.ok && data.recipes) {
          const sorted = data.recipes
            .sort(
              (a: Recipe, b: Recipe) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime()
            )
            .slice(0, 4);
          setPopularRecipes(sorted);
        } else {
          console.error("Failed to fetch recipes:", data.error);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container py-8">
      <section className="py-12 md:py-16">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Discover & Create{" "}
            <span className="text-primary">Delicious Recipes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find inspiration for your next meal or share your culinary creations
            with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg">
              <Link href="/recipes">Explore Recipes</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/generate">Generate Recipe</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Recipes</h2>
          <Button asChild variant="ghost">
            <Link href="/recipes">View All</Link>
          </Button>
        </div>
        {loading ? (
          <p className="text-muted-foreground text-center">
            Loading recipes...
          </p>
        ) : (
          <RecipeGrid recipes={popularRecipes} />
        )}
      </section>

      <section className="py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-secondary rounded-xl p-8 flex flex-col justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">Seasonal Recipes</h3>
            <p className="text-muted-foreground mb-6">
              Discover recipes that use fresh, in-season ingredients for maximum
              flavor.
            </p>
            <Button asChild className="self-start">
              <Link href="/recipes">Explore Seasonal</Link>
            </Button>
          </motion.div>
          <motion.div
            className="bg-secondary rounded-xl p-8 flex flex-col justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">Recipe Categories</h3>
            <p className="text-muted-foreground mb-6">
              Browse recipes by category to find exactly what you're looking
              for.
            </p>
            <Button asChild className="self-start">
              <Link href="/recipes">Browse Categories</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
