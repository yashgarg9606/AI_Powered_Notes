import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getSupabaseServer() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a287ccb4-01e7-4adb-9c11-d7710bdb0d65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:7',message:'getSupabaseServer called - checking env vars',data:{supabaseUrlDefined:typeof process.env.NEXT_PUBLIC_SUPABASE_URL!=='undefined',supabaseUrlLength:process.env.NEXT_PUBLIC_SUPABASE_URL?.length||0,supabaseKeyDefined:typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!=='undefined',supabaseKeyLength:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length||0,supabaseUrlValue:process.env.NEXT_PUBLIC_SUPABASE_URL||'UNDEFINED',supabaseKeyValue:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'UNDEFINED'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a287ccb4-01e7-4adb-9c11-d7710bdb0d65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:12',message:'Before createServerClient call - validation check',data:{hasUrl:!!supabaseUrl,hasKey:!!supabaseKey,urlIsPlaceholder:supabaseUrl?.includes('your-project-url')||false,keyIsPlaceholder:supabaseKey?.includes('your-anon-key')||false},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-project-url-here' || supabaseKey === 'your-anon-key-here') {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a287ccb4-01e7-4adb-9c11-d7710bdb0d65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:17',message:'Validation failed - throwing error',data:{supabaseUrl:!!supabaseUrl,supabaseKey:!!supabaseKey},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    throw new Error(
      'Missing or invalid Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local. Get these values from https://supabase.com/dashboard/project/_/settings/api'
    )
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a287ccb4-01e7-4adb-9c11-d7710bdb0d65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:25',message:'Validation passed - calling createServerClient',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const client = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set({ name, value, ...options }))
        } catch {
          // The `set` method was called from a Server Component.
        }
      },
    },
  })
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a287ccb4-01e7-4adb-9c11-d7710bdb0d65',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase-server.ts:41',message:'createServerClient succeeded - returning client',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  return client
}
