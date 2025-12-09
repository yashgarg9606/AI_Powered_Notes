import { getSupabaseServer } from "./supabase-server";

export async function getCurrentUser() {
  const supabase = await getSupabaseServer();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      if ((error as any).name === "AuthSessionMissingError") {
        return null; // no session yet
      }
      console.error("Error in getCurrentUser:", error);
      return null;
    }

    return data.user ?? null;
  } catch (err: any) {
    if (err?.name === "AuthSessionMissingError") return null;
    console.error("Unexpected error in getCurrentUser:", err);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  const supabase = await getSupabaseServer();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}
