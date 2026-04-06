import { NextResponse } from "next/server";

// ✅ Handle preflight (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return new NextResponse(
        JSON.stringify({ error: "Invalid JSON" }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const message = body?.message;

    if (!message) {
      return new NextResponse(
        JSON.stringify({ error: "Missing message" }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
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

    return new NextResponse(
      JSON.stringify({
        reply: data.choices?.[0]?.message?.content ||
          data.output?.[0]?.content?.[0]?.text ||
          "No response",
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    console.log("FULL OPENAI RESPONSE:", JSON.stringify(data, null, 2));

  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ error: err.message }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}