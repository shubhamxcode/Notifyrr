# Notifyr notification system

Notifyr will use **Courier** as the central notification orchestrator. When a monitor changes from `false` to `true`, Notifyr sends one event to Courier. Courier formats and routes that event to the channels selected by the user.

```text
Vercel Cron → Monitor check → Trigger event → Courier
                                           ├── Email
                                           ├── In-app Inbox
                                           ├── Discord
                                           └── WhatsApp
```

## Responsibilities

- **Notifyr:** detects the condition transition and prevents duplicate alerts.
- **Supabase:** stores channel preferences, trigger events and delivery records.
- **Courier:** manages templates, routing, retries and delivery logs.
- **Resend:** sends production email through Courier.
- **Discord bot:** posts alerts to an authorized Discord channel.
- **Twilio WhatsApp:** delivers approved WhatsApp message templates.

## Channels

### Email

Courier sends email through Resend to the email verified by Clerk. Gmail is not a separate channel; it is an email destination. We must verify our sending domain in Resend.

### In-app

The dashboard will include Courier Inbox. A protected Notifyr API route verifies the Clerk session and generates a short-lived Courier JWT. The Courier API key must remain server-side.

### Discord

Users connect Discord, invite the Notifyr bot and choose a server channel. We store the authorized Discord `channel_id`, then Courier delivers alerts through the bot.

### WhatsApp

Users add and verify a phone number and explicitly opt in. Courier sends through Twilio using an approved WhatsApp template. This requires a WhatsApp-enabled Twilio number, Meta approval and E.164 phone numbers such as `+919876543210`.

## User preferences

Users can enable one or more channels globally and override them per monitor. Notifyr will initially manage these settings in Supabase.

```text
[x] Email    [x] In-app    [ ] Discord    [ ] WhatsApp
Delivery: send to every selected channel
```

Suggested tables:

- `notification_channels`: user, type, destination, verified/enabled state and metadata.
- `monitor_channels`: connects monitors to selected notification channels.
- `notification_events`: one record for each `false → true` monitor transition.
- `notification_deliveries`: Courier request ID, channel, status, timestamps and error.

Add a unique database constraint for `event + channel` so the same transition cannot notify twice.

## Sending flow

1. Vercel Cron checks a monitor.
2. Notifyr detects a `false → true` condition transition.
3. Supabase atomically creates one notification event.
4. Notifyr loads the user's enabled channels.
5. Notifyr sends one event to Courier with the subject, value, condition and source URL.
6. Courier renders the template and sends to all selected channels.
7. Courier delivery webhooks update delivery records in Supabase.

## Security rules

- Keep Courier, Resend, Twilio and Discord secrets server-side.
- Verify Clerk authentication on preference and Courier-JWT endpoints.
- Verify Courier webhook signatures before updating delivery records.
- Store WhatsApp consent and verification timestamps.
- Never expose provider credentials to the browser.

## Implementation order

1. Email with Courier + Resend
2. Courier in-app Inbox
3. Discord bot and channel connection
4. WhatsApp through Twilio

The database will support every channel from the beginning, while delivery channels are released incrementally.

## Official documentation

- [Courier integrations](https://www.courier.com/docs/external-integrations/integrations-overview)
- [Email providers](https://www.courier.com/docs/external-integrations/email/intro-to-email)
- [Discord and chat providers](https://www.courier.com/docs/external-integrations/direct-message/intro-to-direct-message)
- [WhatsApp](https://www.courier.com/docs/external-integrations/direct-message/whatsapp)
- [Courier Inbox](https://www.courier.com/docs/platform/inbox/inbox-overview)
- [Inbox authentication](https://www.courier.com/docs/platform/inbox/authentication)
- [Multi-channel routing](https://www.courier.com/docs/tutorials/sending/how-to-configure-multi-channel-routing)
