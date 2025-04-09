import RecipeHeader from "@/components/RecipeHeader";
import RecipeGenerator from "@/components/RecipeGenerator";

export default function GenerateRecipe() {
  return (
    <div className="min-h-screen flex flex-col">
      <RecipeHeader />

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-muted to-background py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Generate Your Perfect Recipe
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Use our AI-powered recipe generator to create delicious meals from
              ingredients you have or cuisines you love.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <RecipeGenerator />
          </div>
        </section>
      </main>
    </div>
  );
}
