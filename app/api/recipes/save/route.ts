import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const docClient = await dbConnect();
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

    // ✅ Validation
    if (!email || !title || !ingredients || !instructions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Ensure user exists
    const userResult = await docClient.send(
      new GetCommand({
        TableName: process.env.DYNAMO_USER_TABLE!,
        Key: { email },
      })
    );

    const user = userResult.Item;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Create recipe item
    const newRecipe = {
      id: uuidv4(),
      userEmail: email,
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
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    // ✅ Save recipe to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMO_RECIPES_TABLE!,
        Item: newRecipe,
      })
    );

    return NextResponse.json(
      {
        message: "Recipe saved successfully",
        recipe: newRecipe,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error saving recipe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
