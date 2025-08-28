import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const imageModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: ["image", "text"],
  responseMimeType: "text/plain",
};

const formSchema = z.object({
  prompt: z.string().min(3),
  ingredients: z.string().optional(),
  cuisine: z.string().optional(),
  dietary: z.string().optional(),
  mealType: z.string().optional(),
});

async function uploadToS3(buffer: Buffer, fileName: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `recipes/${fileName}`,
    Body: buffer,
    ContentType: "image/png",
  });

  await s3Client.send(command);

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/recipes/${fileName}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = formSchema.parse(body);

    const prompt = `Generate a recipe based on this prompt: "${input.prompt}"
Ingredients: ${input.ingredients || "Any"}
Cuisine: ${input.cuisine || "Any"}
Dietary: ${input.dietary || "None"}
Meal Type: ${input.mealType || "Any"}

Return the result in strict JSON format:
{
  "title": "string",
  "ingredients": ["string"],
  "instructions": ["string"],
  "category": "Quick & Easy" | "Breakfast Favorites" | "Healthy Salads" | "Comfort Food" | "Meat Lovers" | "Vegetarian" | "Grilling Recipes" | "International Cuisine",
  "cuisine": "string",
  "mealType": "string",
  "dietary": "string",
  "prepTime": "string",
  "cookTime": "string",
  "servings": number
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json|```/g, "").trim();
    const recipe = JSON.parse(responseText);

    // Generate image
    const imagePrompt = `
Generate a high-quality, photorealistic image of the dish "${recipe.title}".
Cuisine: ${recipe.cuisine}.
Key ingredients: ${JSON.stringify(recipe.ingredients)}.
Present the dish attractively in a well-lit, natural setting.
Use a clean background and realistic textures.
Camera angle: top-down or 45-degree preferred.
Do not include text or watermarks.
`;

    const chatSession = imageModel.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: imagePrompt }],
        },
      ],
    });

    const imageResult = await chatSession.sendMessage("Generate the image now");
    const candidates = imageResult.response.candidates;

    let base64Image = null;
    for (const candidate of candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("Image generation failed");
    }

    const buffer = Buffer.from(base64Image, "base64");
    const fileName = `${recipe.title.replace(/\s+/g, "_")}_${Date.now()}.png`;
    const imageUrl = await uploadToS3(buffer, fileName);

    recipe.image = imageUrl;

    return NextResponse.json({ recipe });
  } catch (error: any) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate recipe." },
      { status: 400 }
    );
  }
}
