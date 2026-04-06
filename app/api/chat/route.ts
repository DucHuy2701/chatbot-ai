import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    console.log("MESSAGE:", message);
    console.log("API KEY:", process.env.OPENAI_API_KEY);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    if (!response.ok) {
      return NextResponse.json({
        error: data,
      });
    }

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content,
    });

  } catch (err: any) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json({
      error: err.message,
    });
  }
}