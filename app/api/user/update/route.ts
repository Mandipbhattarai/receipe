import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export async function PATCH(req: NextRequest) {
  try {
    const docClient = await dbConnect();
    const body = await req.json();
    const { email, name, username, bio, avatarUrl } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const TABLE_NAME = process.env.DYNAMO_USER_TABLE!;

    // Ensure user exists before updating
    const existingUser = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { email },
      })
    );

    if (!existingUser.Item) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields dynamically
    const updateExpressionParts = [];
    const expressionAttributeValues: Record<string, any> = {};

    if (name) {
      updateExpressionParts.push("name = :name");
      expressionAttributeValues[":name"] = name;
    }
    if (username) {
      updateExpressionParts.push("username = :username");
      expressionAttributeValues[":username"] = username;
    }
    if (bio) {
      updateExpressionParts.push("bio = :bio");
      expressionAttributeValues[":bio"] = bio;
    }
    if (avatarUrl) {
      updateExpressionParts.push("avatarUrl = :avatarUrl");
      expressionAttributeValues[":avatarUrl"] = avatarUrl;
    }

    if (updateExpressionParts.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updateExpression = "SET " + updateExpressionParts.join(", ");

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { email },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );

    return NextResponse.json({
      message: "User updated successfully",
      user: result.Attributes,
    });
  } catch (err: any) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
