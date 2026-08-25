import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert copywriter for a premium press-on nail brand. Your task is to write a short, catchy 2-3 word name for a nail set AND a single, perfectly crafted 1-2 sentence description based on an image. The name should be elegant (e.g., 'Velvet Bloom', 'Glossy Dawn'). The description should mention the base color, the prominent nail art/3D elements, and the aesthetic. Output JSON format with two keys: 'name' and 'description'."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please provide a JSON with a 'name' and 'description' for this nail set." },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "low" // 'low' saves money and is sufficient for a basic description
                }
              }
            ]
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
        response_format: { type: "json_object" },
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("OpenAI API Error:", errData);
      return NextResponse.json({ error: "Failed to generate description with AI" }, { status: 500 });
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content.trim();
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
