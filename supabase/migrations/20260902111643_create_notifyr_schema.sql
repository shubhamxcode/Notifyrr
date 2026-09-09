-- Notifyr initial schema.
-- Clerk is the identity provider; auth.jwt()->>'sub' is the Clerk user ID.

create table public.users (
  id text primary key default (auth.jwt()->>'sub'),
  
  email text not null,
  first_name text,
  last_name text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_id_not_empty check (length(trim(id)) > 0),
  constraint users_email_not_empty check (length(trim(email)) > 0)
);

create table public.monitors (
  id bigint generated always as identity primary key,
  user_id text not null default (auth.jwt()->>'sub')
    references public.users(id) on delete cascade,
  url text not null,
  request text not null,
  subject text,
  current_value jsonb,
  condition jsonb,
  confidence numeric(5, 4),
  status text not null default 'draft',
  last_condition_met boolean,
  check_interval_minutes integer not null default 60,
  next_check_at timestamptz,
  last_checked_at timestamptz,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monitors_owner_unique unique (id, user_id),
  constraint monitors_public_url check (url ~* '^https?://'),
  constraint monitors_request_not_empty check (length(trim(request)) > 0),
  constraint monitors_condition_object check (
    condition is null or jsonb_typeof(condition) = 'object'
  ),
  constraint monitors_current_value_valid check (
    current_value is null or jsonb_typeof(current_value) in ('object', 'array', 'string', 'number', 'boolean')
  ),
  constraint monitors_confidence_range check (
    confidence is null or confidence between 0 and 1
  ),
  constraint monitors_status_valid check (
    status in ('draft', 'active', 'paused', 'error', 'archived')
  ),
  constraint monitors_check_interval_valid check (
    check_interval_minutes between 5 and 10080
  )
);

create table public.extraction_rules (
  id bigint generated always as identity primary key,
  monitor_id bigint not null,
  user_id text not null,
  rule_type text not null,
  selector text,
  attribute text,
  configuration jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  is_active boolean not null default true,
  failure_count integer not null default 0,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint extraction_rules_monitor_version_unique unique (monitor_id, version),
  constraint extraction_rules_owner_fk
    foreign key (monitor_id, user_id)
    references public.monitors(id, user_id)
    on delete cascade,
  constraint extraction_rules_type_valid check (
    rule_type in ('css', 'text', 'json_ld', 'regex', 'ai')
  ),
  constraint extraction_rules_configuration_object check (
    jsonb_typeof(configuration) = 'object'
  ),
  constraint extraction_rules_version_valid check (version > 0),
  constraint extraction_rules_failure_count_valid check (failure_count >= 0)
);

create table public.monitor_checks (
  id bigint generated always as identity primary key,
  monitor_id bigint not null,
  user_id text not null,
  status text not null,
  extracted_value jsonb,
  condition_met boolean,
  confidence numeric(5, 4),
  content_hash text,
  extraction_method text,
  error_code text,
  error_message text,
  duration_ms integer,
  checked_at timestamptz not null default now(),
  constraint monitor_checks_owner_unique unique (id, user_id),
  constraint monitor_checks_owner_fk
    foreign key (monitor_id, user_id)
    references public.monitors(id, user_id)
    on delete cascade,
  constraint monitor_checks_status_valid check (
    status in ('success', 'unclear', 'page_changed', 'blocked', 'failed')
  ),
  constraint monitor_checks_extracted_value_valid check (
    extracted_value is null or jsonb_typeof(extracted_value) in ('object', 'array', 'string', 'number', 'boolean')
  ),
  constraint monitor_checks_confidence_range check (
    confidence is null or confidence between 0 and 1
  ),
  constraint monitor_checks_duration_valid check (
    duration_ms is null or duration_ms >= 0
  )
);

create table public.notification_channels (
  id bigint generated always as identity primary key,
  user_id text not null default (auth.jwt()->>'sub')
    references public.users(id) on delete cascade,
  type text not null,
  destination text not null,
  is_verified boolean not null default false,
  is_enabled boolean not null default true,
  consented_at timestamptz,
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_channels_owner_unique unique (id, user_id),
  constraint notification_channels_destination_unique unique (user_id, type, destination),
  constraint notification_channels_type_valid check (
    type in ('email', 'in_app', 'discord', 'whatsapp')
  ),
  constraint notification_channels_destination_not_empty check (
    length(trim(destination)) > 0
  ),
  constraint notification_channels_metadata_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create table public.monitor_channels (
  monitor_id bigint not null,
  notification_channel_id bigint not null,
  user_id text not null default (auth.jwt()->>'sub'),
  created_at timestamptz not null default now(),
  primary key (monitor_id, notification_channel_id),
  constraint monitor_channels_monitor_owner_fk
    foreign key (monitor_id, user_id)
    references public.monitors(id, user_id)
    on delete cascade,
  constraint monitor_channels_channel_owner_fk
    foreign key (notification_channel_id, user_id)
    references public.notification_channels(id, user_id)
    on delete cascade
);

create table public.notification_events (
  id bigint generated always as identity primary key,
  monitor_id bigint not null,
  user_id text not null,
  source_check_id bigint not null,
  event_type text not null default 'condition_met',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint notification_events_owner_unique unique (id, user_id),
  constraint notification_events_monitor_owner_fk
    foreign key (monitor_id, user_id)
    references public.monitors(id, user_id)
    on delete cascade,
  constraint notification_events_check_owner_fk
    foreign key (source_check_id, user_id)
    references public.monitor_checks(id, user_id)
    on delete cascade,
  constraint notification_events_transition_unique unique (monitor_id, source_check_id, event_type),
  constraint notification_events_type_valid check (
    event_type in ('condition_met')
  ),
  constraint notification_events_payload_object check (
    jsonb_typeof(payload) = 'object'
  )
);

create table public.notification_deliveries (
  id bigint generated always as identity primary key,
  event_id bigint not null,
  notification_channel_id bigint not null,
  user_id text not null,
  provider text not null default 'courier',
  provider_request_id text,
  status text not null default 'pending',
  attempt_count integer not null default 0,
  error_code text,
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_deliveries_event_channel_unique
    unique (event_id, notification_channel_id),
  constraint notification_deliveries_event_owner_fk
    foreign key (event_id, user_id)
    references public.notification_events(id, user_id)
    on delete cascade,
  constraint notification_deliveries_channel_owner_fk
    foreign key (notification_channel_id, user_id)
    references public.notification_channels(id, user_id)
    on delete cascade,
  constraint notification_deliveries_status_valid check (
    status in ('pending', 'accepted', 'sent', 'delivered', 'failed', 'undeliverable')
  ),
  constraint notification_deliveries_attempt_count_valid check (attempt_count >= 0)
);

-- Foreign-key, ownership, scheduling and history indexes.
create index monitors_user_created_idx
  on public.monitors (user_id, created_at desc);
create index monitors_due_idx
  on public.monitors (next_check_at, id)
  where status = 'active';
create index extraction_rules_user_id_idx
  on public.extraction_rules (user_id);
create unique index extraction_rules_one_active_idx
  on public.extraction_rules (monitor_id)
  where is_active;
create index monitor_checks_monitor_checked_idx
  on public.monitor_checks (monitor_id, checked_at desc);
create index monitor_checks_user_checked_idx
  on public.monitor_checks (user_id, checked_at desc);
create index notification_channels_user_enabled_idx
  on public.notification_channels (user_id, is_enabled);
create index monitor_channels_user_id_idx
  on public.monitor_channels (user_id);
create index monitor_channels_channel_id_idx
  on public.monitor_channels (notification_channel_id);
create index notification_events_user_created_idx
  on public.notification_events (user_id, created_at desc);
create index notification_events_source_check_id_idx
  on public.notification_events (source_check_id);
create index notification_deliveries_event_id_idx
  on public.notification_deliveries (event_id);
create index notification_deliveries_channel_id_idx
  on public.notification_deliveries (notification_channel_id);
create index notification_deliveries_user_created_idx
  on public.notification_deliveries (user_id, created_at desc);
create index notification_deliveries_pending_idx
  on public.notification_deliveries (created_at, id)
  where status in ('pending', 'accepted', 'sent');

-- Every public table is protected by RLS.
alter table public.users enable row level security;
alter table public.monitors enable row level security;
alter table public.extraction_rules enable row level security;
alter table public.monitor_checks enable row level security;
alter table public.notification_channels enable row level security;
alter table public.monitor_channels enable row level security;
alter table public.notification_events enable row level security;
alter table public.notification_deliveries enable row level security;

create policy users_select_own
  on public.users for select to authenticated
  using ((select auth.jwt()->>'sub') = id);
create policy users_insert_own
  on public.users for insert to authenticated
  with check ((select auth.jwt()->>'sub') = id);
create policy users_update_own
  on public.users for update to authenticated
  using ((select auth.jwt()->>'sub') = id)
  with check ((select auth.jwt()->>'sub') = id);

create policy monitors_select_own
  on public.monitors for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);
create policy monitors_insert_own
  on public.monitors for insert to authenticated
  with check ((select auth.jwt()->>'sub') = user_id);
create policy monitors_update_own
  on public.monitors for update to authenticated
  using ((select auth.jwt()->>'sub') = user_id)
  with check ((select auth.jwt()->>'sub') = user_id);
create policy monitors_delete_own
  on public.monitors for delete to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy extraction_rules_select_own
  on public.extraction_rules for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy monitor_checks_select_own
  on public.monitor_checks for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy notification_channels_select_own
  on public.notification_channels for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);
create policy notification_channels_insert_own
  on public.notification_channels for insert to authenticated
  with check ((select auth.jwt()->>'sub') = user_id);
create policy notification_channels_update_own
  on public.notification_channels for update to authenticated
  using ((select auth.jwt()->>'sub') = user_id)
  with check ((select auth.jwt()->>'sub') = user_id);
create policy notification_channels_delete_own
  on public.notification_channels for delete to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy monitor_channels_select_own
  on public.monitor_channels for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);
create policy monitor_channels_insert_own
  on public.monitor_channels for insert to authenticated
  with check ((select auth.jwt()->>'sub') = user_id);
create policy monitor_channels_delete_own
  on public.monitor_channels for delete to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy notification_events_select_own
  on public.notification_events for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy notification_deliveries_select_own
  on public.notification_deliveries for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

-- Least-privilege Data API grants. Trusted server jobs use the secret key.
revoke all on
  public.users,
  public.monitors,
  public.extraction_rules,
  public.monitor_checks,
  public.notification_channels,
  public.monitor_channels,
  public.notification_events,
  public.notification_deliveries
from anon, authenticated;

grant select, insert, update on public.users to authenticated;
grant select, insert, update, delete on public.monitors to authenticated;
grant select on public.extraction_rules to authenticated;
grant select on public.monitor_checks to authenticated;
grant select, insert, update, delete on public.notification_channels to authenticated;
grant select, insert, delete on public.monitor_channels to authenticated;
grant select on public.notification_events to authenticated;
grant select on public.notification_deliveries to authenticated;

grant usage, select on sequence public.monitors_id_seq to authenticated;
grant usage, select on sequence public.notification_channels_id_seq to authenticated;

comment on table public.users is 'Notifyr profile mapped one-to-one to a Clerk user.';
comment on table public.monitors is 'Exact public URLs and natural-language conditions monitored by Notifyr.';
comment on table public.extraction_rules is 'Stable extraction instructions reused by scheduled monitor checks.';
comment on table public.monitor_checks is 'Immutable history of page checks and extracted values.';
comment on table public.notification_channels is 'User-owned email, in-app, Discord and WhatsApp destinations.';
comment on table public.notification_events is 'Deduplicated false-to-true monitor transition events.';
comment on table public.notification_deliveries is 'Per-channel Courier delivery attempts and outcomes.';
