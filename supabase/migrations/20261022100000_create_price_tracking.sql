-- Price tracking: a shared product catalog, per-platform listings, an
-- append-only price history and per-user price alerts.
--
-- Catalog tables (products, product_listings, price_points) are shared by all
-- users: one product is scraped once no matter how many people track it.
-- Signed-in users can read them; only trusted server code (secret key) writes.

create table public.products (
  id bigint generated always as identity primary key,
  title text not null,
  brand text,
  model_number text,
  gtin text,
  category text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_title_not_empty check (length(trim(title)) > 0)
);

create table public.product_listings (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  platform text not null,
  external_id text not null,
  url text not null,
  title text not null,
  seller text,
  currency text not null default 'INR',
  current_price numeric(12, 2),
  current_mrp numeric(12, 2),
  in_stock boolean,
  match_confidence numeric(5, 4) not null default 1,
  scrape_status text not null default 'pending',
  failure_count integer not null default 0,
  last_scraped_at timestamptz,
  next_scrape_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_listings_platform_external_unique unique (platform, external_id),
  constraint product_listings_platform_valid check (
    platform in ('amazon', 'flipkart', 'myntra')
  ),
  constraint product_listings_external_id_not_empty check (length(trim(external_id)) > 0),
  constraint product_listings_url_https check (url ~* '^https://'),
  constraint product_listings_currency_valid check (currency ~ '^[A-Z]{3}$'),
  constraint product_listings_price_positive check (current_price is null or current_price > 0),
  constraint product_listings_mrp_positive check (current_mrp is null or current_mrp > 0),
  constraint product_listings_match_confidence_range check (match_confidence between 0 and 1),
  constraint product_listings_scrape_status_valid check (
    scrape_status in ('pending', 'success', 'blocked', 'not_found', 'parse_failed', 'failed')
  ),
  constraint product_listings_failure_count_valid check (failure_count >= 0)
);

create table public.price_points (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.product_listings(id) on delete cascade,
  price numeric(12, 2) not null,
  mrp numeric(12, 2),
  in_stock boolean not null,
  seller text,
  scraped_at timestamptz not null default now(),
  constraint price_points_price_positive check (price > 0),
  constraint price_points_mrp_positive check (mrp is null or mrp > 0)
);

create table public.price_alerts (
  id bigint generated always as identity primary key,
  user_id text not null default (auth.jwt()->>'sub')
    references public.users(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  target_price numeric(12, 2),
  is_active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint price_alerts_user_product_unique unique (user_id, product_id),
  constraint price_alerts_target_positive check (target_price is null or target_price > 0)
);

-- Indexes for the scraper queue, price history charts and dashboards.
create index product_listings_product_id_idx
  on public.product_listings (product_id);
create index product_listings_due_idx
  on public.product_listings (next_scrape_at, id);
create index price_points_listing_scraped_idx
  on public.price_points (listing_id, scraped_at desc);
create index price_alerts_user_created_idx
  on public.price_alerts (user_id, created_at desc);
create index price_alerts_product_active_idx
  on public.price_alerts (product_id)
  where is_active;

alter table public.products enable row level security;
alter table public.product_listings enable row level security;
alter table public.price_points enable row level security;
alter table public.price_alerts enable row level security;

-- Catalog data is not personal: any signed-in user may read it.
create policy products_select_authenticated
  on public.products for select to authenticated
  using (true);
create policy product_listings_select_authenticated
  on public.product_listings for select to authenticated
  using (true);
create policy price_points_select_authenticated
  on public.price_points for select to authenticated
  using (true);

create policy price_alerts_select_own
  on public.price_alerts for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);
create policy price_alerts_insert_own
  on public.price_alerts for insert to authenticated
  with check ((select auth.jwt()->>'sub') = user_id);
create policy price_alerts_update_own
  on public.price_alerts for update to authenticated
  using ((select auth.jwt()->>'sub') = user_id)
  with check ((select auth.jwt()->>'sub') = user_id);
create policy price_alerts_delete_own
  on public.price_alerts for delete to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

revoke all on
  public.products,
  public.product_listings,
  public.price_points,
  public.price_alerts
from anon, authenticated;

grant select on public.products to authenticated;
grant select on public.product_listings to authenticated;
grant select on public.price_points to authenticated;
grant select, insert, update, delete on public.price_alerts to authenticated;
grant usage, select on sequence public.price_alerts_id_seq to authenticated;

comment on table public.products is 'Shared product catalog; one row per real-world product.';
comment on table public.product_listings is 'A product on one platform (Amazon, Flipkart, Myntra) with its latest scraped state.';
comment on table public.price_points is 'Append-only price history, one row per successful scrape.';
comment on table public.price_alerts is 'A user tracking a product, with an optional target price.';
