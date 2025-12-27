import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { getCurrentUser } from "@/lib/auth-utils"
import { type NextRequest, NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY environment variable is not set" },
        { status: 500 }
      )
    }

    const { content, type } = await request.json()

    if (!content || !type) {
      return NextResponse.json({ error: "Missing content or type" }, { status: 400 })
    }

    let prompt = ""
    switch (type) {
      case "improve":
        prompt = `Improve the clarity, grammar, and tone of this note while keeping the core message:

${content}

Return only the improved text, nothing else.`
        break
      case "summarize":
        prompt = `Summarize this note in 2-3 sentences:

${content}

Return only the summary, nothing else.`
        break
      case "expand":
        prompt = `Expand on this note with more details and structure:

${content}

Return the expanded version, nothing else.`
        break
      default:
        return NextResponse.json({ error: "Invalid enhancement type" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("AI enhance error:", error)
    return NextResponse.json({ error: "Failed to enhance note" }, { status: 500 })
  }
}
