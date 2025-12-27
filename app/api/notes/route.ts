// app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await getSupabaseServer();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") ?? "";
    const tagId = searchParams.get("tag");

    let query = supabase
      .from("notes")
      .select(
        `
        id,
        user_id,
        title,
        content,
        created_at,
        updated_at
      `
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    // (Optional) if you later add a note_tags join table, you can filter by tagId here

    const { data, error } = await query;

    if (error) {
      console.error("GET /api/notes error:", error);
      return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/notes unexpected error:", err);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tagIds } = await request.json();

    const supabase = await getSupabaseServer();

    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title: title ?? "Untitled Note",
        content: content ?? "",
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/notes error:", error);
      return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }

    // If you have a note_tags table, you can insert tagIds here

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/notes unexpected error:", err);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
