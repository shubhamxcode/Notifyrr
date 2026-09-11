import { verifyWebhook, type WebhookEvent } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type UserPayload = Extract<
  WebhookEvent,
  { type: "user.created" | "user.updated" }
>["data"];

function primaryEmailAddress(user: UserPayload) {
  const primary = user.email_addresses.find(
    (address) => address.id === user.primary_email_address_id,
  );

  return primary?.email_address ?? user.email_addresses[0]?.email_address ?? null;
}

export async function POST(request: NextRequest) {
  let event: WebhookEvent;

  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("[clerk-webhook] signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "user.created" || event.type === "user.updated") {
    const email = primaryEmailAddress(event.data);

    if (!email) {
      // A retry cannot conjure an email address, so acknowledge and stop.
      console.warn(`[clerk-webhook] ${event.type} ${event.data.id} has no email`);
      return new Response("Skipped: no email address", { status: 200 });
    }

    // `id` is set explicitly: the column default reads auth.jwt(), which is
    // null here because a webhook carries no Clerk session.
    const { error } = await supabase.from("users").upsert(
      {
        id: event.data.id,
        email,
        first_name: event.data.first_name,
        last_name: event.data.last_name,
        image_url: event.data.image_url,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error(
        `[clerk-webhook] upsert failed: ${error.message} (${error.code}) ${error.details ?? ""} ${error.hint ?? ""}`,
      );
      return new Response("Database error", { status: 500 });
    }

    console.log(`[clerk-webhook] ${event.type} synced ${event.data.id}`);
  }

  if (event.type === "user.deleted") {
    const { id } = event.data;

    if (!id) {
      console.warn("[clerk-webhook] user.deleted arrived without an id");
      return new Response("Skipped: no user id", { status: 200 });
    }

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error(
        `[clerk-webhook] delete failed: ${error.message} (${error.code}) ${error.details ?? ""} ${error.hint ?? ""}`,
      );
      return new Response("Database error", { status: 500 });
    }

    console.log(`[clerk-webhook] user.deleted removed ${id}`);
  }

  return new Response("OK", { status: 200 });
}
