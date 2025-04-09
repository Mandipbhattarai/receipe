import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RecipeHeader() {
  return (
    <div className="bg-secondary py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Recipe Generator</h2>
            <p className="text-muted-foreground">Create your perfect meal with AI assistance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/recipes">Browse Recipes</Link>
            </Button>
            <Button asChild>
              <Link href="/collections">My Collections</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

