"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockRecipes } from "@/lib/mock-data";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
  recipes: string[];
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRecipeCount = (recipeIds: string[]) => {
    return recipeIds.length;
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim() === "") {
      alert("Collection name cannot be empty");
      return;
    }
    const newCollection = {
      id: Date.now().toString(),
      name: newCollectionName,
      recipes: [],
    };
    setCollections((prev) => [...prev, newCollection]);
    setNewCollectionName("");
    setIsDialogOpen(false);
  };

  const getCollectionImage = (recipeIds: string[]) => {
    if (recipeIds.length > 0) {
      const recipe = mockRecipes.find((r) => r._id === recipeIds[0]);
      return recipe?.image || "/placeholder.svg?height=100&width=100";
    }
    return "/placeholder.svg?height=100&width=100";
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Collections</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                  Give your collection a name to help organize your recipes.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCollection}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No collections yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first collection to organize your favorite recipes.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <div
                      className="w-full h-full bg-center bg-cover"
                      style={{
                        backgroundImage: `url(${getCollectionImage(
                          collection.recipes
                        )})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {getRecipeCount(collection.recipes)} recipes
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{collection.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
