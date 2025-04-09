import mongoose, { Schema, model, models } from "mongoose";

const RecipeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    image: { type: String, default: "/placeholder.svg?height=300&width=400" },
    ingredients: [{ type: String }],
    instructions: [{ type: String }],
    cuisine: String,
    prepTime: String,
    cookTime: String,
    mealType: String,
    dietary: String,
    category: String,
    servings: Number,
    isFavorite: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isSeasonal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Recipe = models.Recipe || model("Recipe", RecipeSchema);

export default Recipe;
