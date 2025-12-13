// app/api/ai/enhance/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, type } = await req.json()

    if (!content || !type) {
      return NextResponse.json(
        { error: "Missing content or type" },
        { status: 400 }
      )
    }

    let prompt = ""
    switch (type) {
      case "improve":
        prompt = `Improve the clarity, grammar, and tone of this note:\n\n${content}\n\nReturn only the improved text.`
        break
      case "summarize":
        prompt = `Summarize this note in 2-3 sentences:\n\n${content}`
        break
      case "expand":
        prompt = `Expand on this note with more details:\n\n${content}`
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`)
    }

    const data = await response.json()
    const text = data.response

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("AI enhance error:", error)
    return NextResponse.json(
      { error: "Failed to enhance note" },
      { status: 500 }
    )
  }
}