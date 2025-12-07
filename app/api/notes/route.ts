import { getCurrentUser } from "@/lib/auth-utils"
import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getSupabaseServer()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const tagId = searchParams.get("tag")

    let query = supabase
      .from("notes")
      .select(`
        id,
        title,
        content,
        created_at,
        updated_at,
        note_tags(tag_id),
        tags:tags(id, name, color)
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (tagId) {
      query = query.eq("note_tags.tag_id", tagId)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/notes error:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, tagIds } = await request.json()

    const supabase = getSupabaseServer()
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title: title || "Untitled Note",
        content: content || "",
      })
      .select()
      .single()

    if (noteError) throw noteError

    if (tagIds && tagIds.length > 0) {
      const noteTagData = tagIds.map((tagId: string) => ({
        note_id: note.id,
        tag_id: tagId,
      }))

      const { error: tagsError } = await supabase.from("note_tags").insert(noteTagData)

      if (tagsError) throw tagsError
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("POST /api/notes error:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
