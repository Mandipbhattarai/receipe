import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { name, username, email, bio, password, confirmPassword } =
    await req.json();

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  try {
    const docClient = await dbConnect();
    const TABLE_NAME = process.env.DYNAMO_USER_TABLE!;

    // Check if user already exists
    const existingUser = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { email },
      })
    );

    if (existingUser.Item) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      username,
      email,
      bio: bio || "",
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newUser,
      })
    );

    return NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
