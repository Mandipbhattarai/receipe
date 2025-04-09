"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RecipeCategory } from "@/types/recipe";

const formSchema = z.object({
  prompt: z.string().min(3, {
    message: "Please describe what you'd like to cook.",
  }),
  ingredients: z.string().optional(),
  cuisine: z.string().optional(),
  dietary: z.string().optional(),
  mealType: z.string().optional(),
});

export default function RecipeGenerator() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      ingredients: "",
      cuisine: "",
      dietary: "",
      mealType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedRecipe(null);

    try {
      const res = await axios.post("/api/recipes/generate", values);
      setGeneratedRecipe(res.data.recipe);
      toast({
        title: "Success",
        description: "Your recipe was generated!",
      });
    } catch (err: any) {
      toast({
        title: "Generation failed",
        description:
          err?.response?.data?.error || err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const saveRecipe = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      await axios.post("/api/recipes/save", {
        ...generatedRecipe,
        email: user.email,
      });
      console.log(generatedRecipe);
      console.log("Recipe saved successfully");
      toast({ title: "Success", description: "Recipe saved successfully!" });
      router.push("/recipes");
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err?.response?.data?.error || "Failed to save recipe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt">Recipe Prompt</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-6"
          >
            <TabsContent value="prompt">
              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your recipe</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you'd like to cook. For example: 'A healthy vegetarian pasta dish with seasonal vegetables'"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be as specific as possible for better results.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingredients</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List ingredients you have or want to use, separated by commas"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: List ingredients you have or want to use
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="cuisine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuisine</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cuisine" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="mexican">Mexican</SelectItem>
                              <SelectItem value="indian">Indian</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                              <SelectItem value="japanese">Japanese</SelectItem>
                              <SelectItem value="thai">Thai</SelectItem>
                              <SelectItem value="mediterranean">
                                Mediterranean
                              </SelectItem>
                              <SelectItem value="american">American</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dietary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dietary Restrictions</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select dietary" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vegetarian">
                                Vegetarian
                              </SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="gluten-free">
                                Gluten-Free
                              </SelectItem>
                              <SelectItem value="dairy-free">
                                Dairy-Free
                              </SelectItem>
                              <SelectItem value="keto">Keto</SelectItem>
                              <SelectItem value="paleo">Paleo</SelectItem>
                              <SelectItem value="low-carb">Low-Carb</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mealType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meal Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select meal type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="breakfast">
                                Breakfast
                              </SelectItem>
                              <SelectItem value="lunch">Lunch</SelectItem>
                              <SelectItem value="dinner">Dinner</SelectItem>
                              <SelectItem value="appetizer">
                                Appetizer
                              </SelectItem>
                              <SelectItem value="dessert">Dessert</SelectItem>
                              <SelectItem value="snack">Snack</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={isGenerating}
                className="px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Recipe
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>

      {generatedRecipe && (
        <div className="mt-12 border rounded-lg p-6 bg-card shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{generatedRecipe.title}</h2>
            <Button onClick={saveRecipe}>Save Recipe</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video bg-muted rounded-lg mb-4">
                <img
                  src={generatedRecipe.image || "/placeholder.svg"}
                  alt={generatedRecipe.title}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Prep Time:</span>{" "}
                    {generatedRecipe.prepTime}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Cook Time:</span>{" "}
                    {generatedRecipe.cookTime}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Cuisine:</span>{" "}
                    {generatedRecipe.cuisine}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Servings:</span>{" "}
                    {generatedRecipe.servings}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Meal Type:</span>{" "}
                    {generatedRecipe.mealType}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Dietary:</span>{" "}
                    {generatedRecipe.dietary}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {generatedRecipe.ingredients.map(
                    (ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal pl-5 space-y-3">
                {generatedRecipe.instructions.map(
                  (instruction: string, index: number) => (
                    <li key={index} className="pl-1">
                      {instruction}
                    </li>
                  )
                )}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
