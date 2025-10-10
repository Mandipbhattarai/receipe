import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI, Modality } from "@google/genai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

    // Generate recipe text using new SDK
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    if (!result.text) {
      throw new Error("Failed to generate recipe text");
    }

    let responseText = result.text;
    responseText = responseText.replace(/```json|```/g, "").trim();
    const recipe = JSON.parse(responseText);

    const imagePrompt = `Generate a high-quality, photorealistic image of the dish "${
      recipe.title
    }". 
Cuisine: ${recipe.cuisine}. 
Key ingredients: ${recipe.ingredients.slice(0, 5).join(", ")}. 
Present the dish attractively plated in a well-lit, natural setting with a clean background and realistic textures. 
Camera angle: 45-degree view preferred. 
Do not include any text or watermarks.`;

    const imageResult = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: imagePrompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Extract image from response
    let base64Image: string | null = null;

    if (imageResult.candidates && imageResult.candidates.length > 0) {
      for (const part of imageResult.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("Image generation failed - no image data returned");
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
