-- Clerk is the source of truth for profile data. Signed-in users may read only
-- their own mirrored profile; the verified Clerk webhook writes via the
-- server-side Supabase secret key, which bypasses RLS.
drop policy if exists users_insert_own on public.users;
drop policy if exists users_update_own on public.users;

revoke insert, update on table public.users from authenticated;
