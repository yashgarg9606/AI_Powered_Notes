// app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

// Helper: grab note id from URL
function getNoteIdFromRequest(request: NextRequest) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean); // e.g. ["api","notes","<id>"]
  return segments[segments.length - 1];
}

// UPDATE NOTE
export async function PUT(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer();
    const id = getNoteIdFromRequest(request);

    const { title, content, tagIds } = await request.json();

    const { data, error } = await supabase
      .from("notes")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT /api/notes/[id] DB error:", error);
      return NextResponse.json(
        { error: error.message ?? "Failed to update note" },
        { status: 500 }
      );
    }

    // Optional tag handling – only if you have a note_tags table
    if (Array.isArray(tagIds)) {
      await supabase.from("note_tags").delete().eq("note_id", id);
      if (tagIds.length > 0) {
        await supabase
          .from("note_tags")
          .insert(tagIds.map((tagId: string) => ({ note_id: id, tag_id: tagId })));
      }
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PUT /api/notes/[id] unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE NOTE
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer();
    const id = getNoteIdFromRequest(request);

    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/notes/[id] error:", error);
      return NextResponse.json(
        { error: error.message ?? "Failed to delete note" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/notes/[id] unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to delete note" },
      { status: 500 }
    );
  }
}
