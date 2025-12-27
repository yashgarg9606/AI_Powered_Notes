import { getSupabaseServer } from "./supabase-server"

export async function getCurrentUser() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a287ccb4-01e7-4adb-9c11-d7710bdb0d65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth-utils.ts:4',message:'getCurrentUser called - calling getSupabaseServer',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await getSupabaseServer()
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}
