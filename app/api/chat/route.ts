import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return Response.json({
        error: "Body must be JSON",
      });
    }

    if (!body?.message) {
      return Response.json({
        error: "Missing message",
      });
    }

    const message = body?.message;

    if (!message) {
      return NextResponse.json({
        error: "Missing message",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json({
      error: err.message,
    });
  }
}
