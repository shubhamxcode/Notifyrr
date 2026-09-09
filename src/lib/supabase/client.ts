"use client";

import { useSession } from "@clerk/nextjs";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { publicEnvironment } from "@/config/env";

export function useSupabase() {
  const { session } = useSession();

  return useMemo(
    () =>
      createSupabaseClient(
        publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
        publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
          accessToken: () => session?.getToken() ?? Promise.resolve(null),
        },
      ),
    [session],
  );
}
