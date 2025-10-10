import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json(); // use "id" instead of "_id" for DynamoDB
    if (!id) {
      return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
    }

    const docClient = await dbConnect();
    const TABLE_NAME = process.env.DYNAMO_RECIPES_TABLE!;

    // Fetch the recipe first
    const { Item: recipe } = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Toggle isFavorite
    const newFavoriteStatus = !recipe.isFavorite;

    // Update the item in DynamoDB
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "SET isFavorite = :fav",
        ExpressionAttributeValues: {
          ":fav": newFavoriteStatus,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return NextResponse.json({
      recipe: result.Attributes,
      message: `Recipe marked as ${
        newFavoriteStatus ? "favorite" : "not favorite"
      }`,
    });
  } catch (err: any) {
    console.error("Error toggling favorite:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
