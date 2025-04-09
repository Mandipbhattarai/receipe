import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Recipe from "@/models/Recipe";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      email,
      title,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      cuisine,
      dietary,
      mealType,
      category,
      image,
      servings,
    } = await req.json();

    if (!email || !title || !ingredients || !instructions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newRecipe = await Recipe.create({
      user: user._id,
      title,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      category,
      image,
      servings,
      cuisine,
      dietary,
      mealType,
    });

    return NextResponse.json(
      { message: "Recipe saved successfully", recipe: newRecipe },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
