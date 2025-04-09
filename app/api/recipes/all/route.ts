import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Recipe from "@/models/Recipe";

export async function GET() {
  try {
    await dbConnect();

    const recipes = await Recipe.find().sort({ createdAt: -1 });

    return NextResponse.json({ recipes }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
