import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  try {
    // connect to DynamoDB
    const docClient = await dbConnect();
    const TABLE_NAME = process.env.DYNAMO_RECIPES_TABLE!;

    // fetch all items from the Recipes table
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    // DynamoDB doesn’t sort automatically — we do it manually by createdAt
    const recipes = (result.Items || []).sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ recipes }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching recipes:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
