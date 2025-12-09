import { getCurrentUser } from "@/lib/auth-utils"
import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("tags").select("*").eq("user_id", user.id).order("name")

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/tags error:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, color } = await request.json()

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from("tags")
      .insert({
        user_id: user.id,
        name,
        color: color || "#3b82f6",
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("POST /api/tags error:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}
