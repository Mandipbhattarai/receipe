import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const docClient = await dbConnect();
    const TABLE_NAME = process.env.DYNAMO_RECIPES_TABLE!;

    // 🔍 Scan all recipes and filter in memory
    // (you can later optimize this with a GSI if needed)
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "userEmail = :email AND isFavorite = :fav",
        ExpressionAttributeValues: {
          ":email": email,
          ":fav": true,
        },
      })
    );

    const recipes = result.Items || [];

    return NextResponse.json({ recipes }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching favorites:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
