"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"
import { Plus, Trash2, Upload } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Category, Cuisine, MealType, type Recipe } from "@/types/recipe"
import { mockRecipes } from "@/lib/mock-data"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  image: z.string().default("/placeholder.svg?height=300&width=400"),
  ingredients: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, { message: "Ingredient name is required" }),
        quantity: z.string(),
        unit: z.string(),
      }),
    )
    .min(1, { message: "At least one ingredient is required" }),
  instructions: z
    .array(
      z.object({
        id: z.string(),
        step: z.number(),
        description: z.string().min(1, { message: "Instruction is required" }),
      }),
    )
    .min(1, { message: "At least one instruction is required" }),
  cuisine: z.nativeEnum(Cuisine),
  prepTime: z.number().min(1),
  cookTime: z.number().min(0),
  mealType: z.nativeEnum(MealType),
  dietary: z.array(z.string()),
  category: z.nativeEnum(Category),
  servings: z.number().min(1),
})

export default function CreateRecipe() {
  const router = useRouter()
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "/placeholder.svg?height=300&width=400",
      ingredients: [{ id: uuidv4(), name: "", quantity: "", unit: "" }],
      instructions: [{ id: uuidv4(), step: 1, description: "" }],
      cuisine: Cuisine.AMERICAN,
      prepTime: 15,
      cookTime: 15,
      mealType: MealType.NONE,
      dietary: [],
      category: Category.DINNER,
      servings: 4,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newRecipe: Recipe = {
      ...values,
      id: uuidv4(),
      createdAt: new Date(),
      isFavorite: false,
      isPopular: false,
      isSeasonal: false,
    }

    // In a real app, this would be an API call
    // For now, we'll just add it to our mock data
    mockRecipes.push(newRecipe)

    router.push("/recipes/all")
  }

  const addIngredient = () => {
    const currentIngredients = form.getValues("ingredients")
    form.setValue("ingredients", [...currentIngredients, { id: uuidv4(), name: "", quantity: "", unit: "" }])
  }

  const removeIngredient = (id: string) => {
    const currentIngredients = form.getValues("ingredients")
    if (currentIngredients.length > 1) {
      form.setValue(
        "ingredients",
        currentIngredients.filter((ingredient) => ingredient.id !== id),
      )
    }
  }

  const addInstruction = () => {
    const currentInstructions = form.getValues("instructions")
    form.setValue("instructions", [
      ...currentInstructions,
      {
        id: uuidv4(),
        step: currentInstructions.length + 1,
        description: "",
      },
    ])
  }

  const removeInstruction = (id: string) => {
    const currentInstructions = form.getValues("instructions")
    if (currentInstructions.length > 1) {
      const filteredInstructions = currentInstructions
        .filter((instruction) => instruction.id !== id)
        .map((instruction, index) => ({
          ...instruction,
          step: index + 1,
        }))
      form.setValue("instructions", filteredInstructions)
    }
  }

  const toggleDietary = (value: string) => {
    const current = [...dietaryOptions]
    const index = current.indexOf(value)

    if (index === -1) {
      current.push(value)
    } else {
      current.splice(index, 1)
    }

    setDietaryOptions(current)
    form.setValue("dietary", current)
  }

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipe title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Ingredients</FormLabel>
                  {form.watch("ingredients").map((ingredient, index) => (
                    <div key={ingredient.id} className="flex gap-2 items-start">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <FormField
                          control={form.control}
                          name={`ingredients.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="col-span-3 sm:col-span-1">
                              <FormControl>
                                <Input placeholder="Ingredient" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`ingredients.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Amount" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`ingredients.${index}.unit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Unit" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient.id)}
                        disabled={form.watch("ingredients").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                  </Button>
                </div>

                <div className="space-y-4">
                  <FormLabel>Instructions</FormLabel>
                  {form.watch("instructions").map((instruction, index) => (
                    <div key={instruction.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`instructions.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                                  {instruction.step}
                                </div>
                                <FormLabel className="text-sm font-medium">Step {instruction.step}</FormLabel>
                              </div>
                              <FormControl>
                                <Textarea placeholder={`Describe step ${instruction.step}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInstruction(instruction.id)}
                        disabled={form.watch("instructions").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addInstruction} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Step
                  </Button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="border rounded-lg p-4 space-y-4">
                  <FormLabel>Recipe Image</FormLabel>
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                    </div>
                  </div>
                  <FormDescription>Recommended size: 1200 x 800 pixels</FormDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(Category).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisine</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cuisine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(Cuisine).map((cuisine) => (
                              <SelectItem key={cuisine} value={cuisine}>
                                {cuisine}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cookTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cook Time (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Slider
                            min={1}
                            max={20}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{field.value}</span>
                        </div>
                      </FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(MealType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dietary"
                  render={() => (
                    <FormItem>
                      <FormLabel>Dietary Preferences</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Keto"].map((option) => (
                          <Button
                            key={option}
                            type="button"
                            variant={dietaryOptions.includes(option) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleDietary(option)}
                            className="rounded-full"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button type="submit">Create Recipe</Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  )
}

