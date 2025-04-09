import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Recipe from "@/models/Recipe";

export async function PATCH(req: NextRequest) {
  await dbConnect();

  const { _id } = await req.json();
  if (!_id) {
    return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
  }

  const recipe = await Recipe.findById(_id);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  recipe.isFavorite = !recipe.isFavorite;
  await recipe.save();

  return NextResponse.json({
    recipe,
    message: `Recipe marked as ${
      recipe.isFavorite ? "favorite" : "not favorite"
    }`,
  });
}
