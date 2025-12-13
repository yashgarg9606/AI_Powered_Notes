export const runtime = "nodejs";
export const dynamic = "force-dynamic";


import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {

  console.log("Groq key present:", !!process.env.GROQ_API_KEY);
  console.log("Groq endpoint:", "https://api.groq.com/openai/v1/chat/completions");


  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, type } = await req.json();

    if (!content || !type) {
      return NextResponse.json(
        { error: "Missing content or type" },
        { status: 400 }
      );
    }

    let prompt = "";
    switch (type) {
      case "improve":
        prompt = `Improve the clarity, grammar, and tone of this note:\n\n${content}`;
        break;
      case "summarize":
        prompt = `Summarize this note in 2–3 sentences:\n\n${content}`;
        break;
      case "expand":
        prompt = `Expand this note with more details and structure:\n\n${content}`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid enhancement type" },
          { status: 400 }
        );
    }

const controller = new AbortController();
setTimeout(() => controller.abort(), 12_000);

const response = await fetch(GROQ_API_URL, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  }),
  signal: controller.signal,
});


    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        { error: "AI request failed", details: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      text: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI enhance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
