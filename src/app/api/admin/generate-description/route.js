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
            content: "You are an expert copywriter for a premium press-on nail brand. Your task is to write a single, perfectly crafted 1-2 sentence description of a nail set based on an image. The tone should be engaging, elegant, and descriptive. Mention the base color, the prominent nail art/3D elements/patterns, and the aesthetic. Do not mention the shape unless it is very obvious, and do not include quotes."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please describe this nail set in 1-2 elegant sentences." },
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
        max_tokens: 100,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("OpenAI API Error:", errData);
      return NextResponse.json({ error: "Failed to generate description with AI" }, { status: 500 });
    }

    const data = await response.json();
    const description = data.choices[0].message.content.trim();

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
