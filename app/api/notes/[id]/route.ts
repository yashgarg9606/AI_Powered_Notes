import { getCurrentUser } from "@/lib/auth-utils"
import { getSupabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
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
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/notes/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, content, tagIds } = await request.json()

    const supabase = await getSupabaseServer()

    // Verify note ownership
    const { data: note, error: fetchError } = await supabase.from("notes").select("user_id").eq("id", id).single()

    if (fetchError || !note || note.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update note
    const { data: updated, error: updateError } = await supabase
      .from("notes")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) throw updateError

    // Update tags
    if (tagIds !== undefined) {
      await supabase.from("note_tags").delete().eq("note_id", id)

      if (tagIds.length > 0) {
        const noteTagData = tagIds.map((tagId: string) => ({
          note_id: id,
          tag_id: tagId,
        }))

        const { error: tagsError } = await supabase.from("note_tags").insert(noteTagData)

        if (tagsError) throw tagsError
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/notes/[id] error:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = await getSupabaseServer()

    // Verify note ownership
    const { data: note, error: fetchError } = await supabase.from("notes").select("user_id").eq("id", id).single()

    if (fetchError || !note || note.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error: deleteError } = await supabase.from("notes").delete().eq("id", id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}
