import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Recipe from "@/models/Recipe";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const recipes = await Recipe.find({ isFavorite: true })
      .populate("user", "email")
      .lean();

    const userFavorites = recipes.filter((r: any) => r.user?.email === email);

    return NextResponse.json({ recipes: userFavorites }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
