import "server-only";

import { auth } from "@clerk/nextjs/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { publicEnvironment } from "@/config/env";

export async function createClient() {
  const { getToken } = await auth();

  return createSupabaseClient(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      accessToken: () => getToken(),
    },
  );
}
