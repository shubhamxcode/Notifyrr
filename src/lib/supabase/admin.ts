import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { publicEnvironment } from "@/config/env";
import { serverEnvironment } from "@/config/server-env";

/**
 * Supabase client that bypasses row level security.
 *
 * Reserved for trusted server code such as webhook handlers and scheduled
 * checks, where there is no Clerk session for the RLS policies to read.
 * Everything that runs on behalf of a signed-in user belongs in `server.ts`.
 */
export function createAdminClient() {
  return createSupabaseClient(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    serverEnvironment.SUPABASE_SECRET_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
