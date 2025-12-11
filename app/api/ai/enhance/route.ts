import { getCurrentUser } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, type } = await request.json();
    if (!content || !type) return NextResponse.json({ error: "Missing content or type" }, { status: 400 });

    let prompt = "";
    switch (type) {
      case "improve":
        prompt = `Improve the clarity, grammar, and tone of this note while keeping the core message:\n\n${content}\n\nReturn only the improved text, nothing else.`;
        break;
      case "summarize":
        prompt = `Summarize this note in 2-3 sentences:\n\n${content}\n\nReturn only the summary, nothing else.`;
        break;
      case "expand":
        prompt = `Expand on this note with more details and structure:\n\n${content}\n\nReturn the expanded version, nothing else.`;
        break;
      default:
        return NextResponse.json({ error: "Invalid enhancement type" }, { status: 400 });
    }

    // Build Ollama request body
    const body = {
      model: process.env.OLLAMA_MODEL || "llama2:latest", // change if you use another model/tag
      prompt,
      stream: false // single JSON response
      // options: { temperature: 0.7 } // optional
    };

    const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Read response body ONCE
    const text = await resp.text();

    if (!resp.ok) {
      // log server status + body for debugging
      console.error("Ollama error:", resp.status, text);
      // return the text as details (already read)
      return NextResponse.json({ error: "LLM request failed", details: text }, { status: 502 });
    }

    // Ollama returns streaming parts when stream=true; with stream=false final object contains `response`
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // if it's not JSON (unlikely with stream:false) return raw text
      return NextResponse.json({ text }, { status: 200 });
    }

    // If Ollama returns "response" (string) or "response" in last item:
    // for non-streaming the field is "response"
    const resultText = parsed?.response ?? parsed?.response_text ?? JSON.stringify(parsed);

    return NextResponse.json({ text: resultText });
  } catch (err) {
    console.error("AI enhance error:", err);
    return NextResponse.json({ error: "Failed to enhance note" }, { status: 500 });
  }
}
