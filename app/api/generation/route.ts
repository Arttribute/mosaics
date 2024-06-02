import { NextResponse } from "next/server";

const API_KEY = process.env.ASTRIA_API_KEY;

export const revalidate = 0;
export async function POST(request: Request) {
  const { textToImageObject, modelId } = await request.json();

  try {
    const generationRes = await fetch(
      `https://api.astria.ai/tunes/${modelId}/prompts`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textToImageObject),
      }
    );

    const generationData = await generationRes.json();

    return new NextResponse(JSON.stringify(generationData), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
