import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    // Extract base64 data and mime type from data URL
    const match = imageUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const prompt = "You are an expert copywriter for a premium press-on nail brand. Your task is to write a short, catchy 2-3 word name for a nail set AND a single, perfectly crafted 1-2 sentence description based on an image. The name should be elegant (e.g., 'Velvet Bloom', 'Glossy Dawn'). The description should mention the base color, the prominent nail art/3D elements, and the aesthetic. Output JSON format with two keys: 'name' and 'description'.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini API Error:", errData);
      const errorMessage = errData.error?.message || "Failed to generate description with Gemini";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text.trim();
    const resultJson = JSON.parse(resultText);

    return NextResponse.json({ 
      name: resultJson.name, 
      description: resultJson.description 
    });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
