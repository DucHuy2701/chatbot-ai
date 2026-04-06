import { NextResponse } from "next/server";

const blogContext = `
This is a personal blog by Huy.

Topics:
- React, Vite, Tailwind
- Frontend development
- AI basics

Purpose:
- Share knowledge
- Help developers learn
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an AI assistant for a personal blog.

Blog context:
${blogContext}

Rules:
- If user asks about blog → use context
- Otherwise → answer normally
- Keep answers short
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    return new NextResponse(
      JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No response",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" });
  }
}