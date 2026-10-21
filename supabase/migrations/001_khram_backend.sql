-- Khram website backend (Supabase project hobwlswwwvmfqawdgjip, account khram.official@gmail.com)
-- Catalog (collections, products, site settings), admin allowlist, anonymous analytics, media storage.
-- Public visitors: read published catalog + send anonymous page events through track().
-- Admins (emails in public.admins): full write access + stats through admin_stats().

-- ---------- helpers ----------
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create table if not exists public.admins (
  email text primary key check (email = lower(email))
);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
insert into public.admins (email) values ('khram.official@gmail.com') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- catalog ----------
create table if not exists public.collections (
  slug text primary key check (slug ~ '^[a-z0-9-]{2,40}$'),
  name text not null,
  dye_thai text not null default '',
  dye_english text not null default '',
  dye_note text not null default '',
  theme text not null default '',
  summary text not null default '',
  description text[] not null default '{}',
  art text not null default '',
  accent_base text not null default '#80B2DB' check (accent_base ~ '^#[0-9A-Fa-f]{6}$'),
  accent_text text not null default '#80B2DB' check (accent_text ~ '^#[0-9A-Fa-f]{6}$'),
  status text not null default 'planned' check (status in ('available', 'in-progress', 'planned')),
  status_note text not null default '',
  swatch jsonb not null default '{}',
  motif text check (motif in ('butterfly-moon', 'thread-moon', 'dawn-ripples', 'new-moon-flower')),
  i18n jsonb not null default '{}',
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  slug text primary key check (slug ~ '^[a-z0-9-]{2,60}$'),
  collection text not null references public.collections (slug) on update cascade,
  name text not null,
  format text not null default '',
  subtitle text not null default '',
  status text not null default 'available' check (status in ('available', 'free', 'coming-soon', 'in-progress')),
  price numeric(10, 2) check (price is null or price >= 0),
  price_label text not null default '',
  store text check (store in ('Gumroad', 'Amazon', 'Etsy', 'Lulu', 'Other')),
  url text check (url is null or url ~ '^https://'),
  cta_label text not null default '',
  notes text[] not null default '{}',
  summary text not null default '',
  description text[] not null default '{}',
  included text[] not null default '{}',
  included_heading text,
  specs jsonb not null default '[]',
  how_it_works text[],
  outline jsonb,
  sample_prompts text[],
  faq jsonb,
  cover jsonb not null default '{}',
  gallery jsonb not null default '[]',
  og_image text,
  i18n jsonb not null default '{}',
  published boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_collection_idx on public.products (collection);

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

drop trigger if exists collections_updated_at on public.collections;
create trigger collections_updated_at before update on public.collections
  for each row execute function public.set_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

grant select on public.collections, public.products, public.site_settings to anon, authenticated;
grant insert, update, delete on public.collections, public.products, public.site_settings to authenticated;

drop policy if exists "read collections" on public.collections;
create policy "read collections" on public.collections for select to anon, authenticated using (true);
drop policy if exists "admins insert collections" on public.collections;
create policy "admins insert collections" on public.collections for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admins update collections" on public.collections;
create policy "admins update collections" on public.collections for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admins delete collections" on public.collections;
create policy "admins delete collections" on public.collections for delete to authenticated using ((select public.is_admin()));

drop policy if exists "read published products" on public.products;
create policy "read published products" on public.products for select to anon, authenticated using (published or (select public.is_admin()));
drop policy if exists "admins insert products" on public.products;
create policy "admins insert products" on public.products for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admins update products" on public.products;
create policy "admins update products" on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admins delete products" on public.products;
create policy "admins delete products" on public.products for delete to authenticated using ((select public.is_admin()));

drop policy if exists "read settings" on public.site_settings;
create policy "read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admins insert settings" on public.site_settings;
create policy "admins insert settings" on public.site_settings for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admins update settings" on public.site_settings;
create policy "admins update settings" on public.site_settings for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------- anonymous analytics ----------
-- No cookies, no IP stored. `visitor` is a random id the browser makes fresh each day.
create table if not exists public.page_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('view', 'click')),
  path text not null,
  label text,
  referrer text,
  visitor text not null,
  session text,
  device text,
  lang text,
  tz text,
  utm_source text
);
create index if not exists page_events_created_idx on public.page_events (created_at);
create index if not exists page_events_visitor_idx on public.page_events (visitor, created_at);
alter table public.page_events enable row level security;
revoke all on public.page_events from anon, authenticated;

create or replace function public.track(
  p_kind text,
  p_path text,
  p_visitor text,
  p_label text default null,
  p_referrer text default null,
  p_session text default null,
  p_device text default null,
  p_lang text default null,
  p_tz text default null,
  p_utm text default null
) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_kind not in ('view', 'click') then return; end if;
  if p_visitor is null or length(p_visitor) < 8 or length(p_visitor) > 64 then return; end if;
  if p_path is null or left(p_path, 1) <> '/' or p_path like '/admin%' then return; end if;
  -- simple flood guard: at most 40 events per visitor per minute
  if (select count(*) from public.page_events e
      where e.visitor = p_visitor and e.created_at > now() - interval '1 minute') >= 40 then
    return;
  end if;
  insert into public.page_events (kind, path, label, referrer, visitor, session, device, lang, tz, utm_source)
  values (p_kind, left(p_path, 200), left(p_label, 120), left(p_referrer, 120), p_visitor,
          left(p_session, 64), left(p_device, 16), left(p_lang, 16), left(p_tz, 64), left(p_utm, 60));
end $$;
revoke all on function public.track(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.track(text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

create or replace function public.admin_stats(p_days int default 30) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  zone constant text := 'Asia/Bangkok';
  days int := least(greatest(coalesce(p_days, 30), 1), 365);
  first_day date := (now() at time zone zone)::date - (days - 1);
  since timestamptz := (first_day::timestamp) at time zone zone;
begin
  if not public.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'since', since,
    'days', days,
    'totals', (
      select jsonb_build_object(
        'views', count(*) filter (where kind = 'view'),
        'visitors', count(distinct visitor) filter (where kind = 'view'),
        'sessions', count(distinct session) filter (where kind = 'view'),
        'clicks', count(*) filter (where kind = 'click'))
      from public.page_events where created_at >= since),
    'live', (select count(distinct visitor) from public.page_events where created_at > now() - interval '30 minutes'),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d.day, 'views', coalesce(v.views, 0),
               'visitors', coalesce(v.visitors, 0), 'clicks', coalesce(v.clicks, 0)) order by d.day), '[]'::jsonb)
      from (select gs::date as day from generate_series(first_day, (now() at time zone zone)::date, interval '1 day') gs) d
      left join (
        select (created_at at time zone zone)::date as day,
               count(*) filter (where kind = 'view') as views,
               count(distinct visitor) filter (where kind = 'view') as visitors,
               count(*) filter (where kind = 'click') as clicks
        from public.page_events where created_at >= since group by 1) v on v.day = d.day),
    'pages', (
      select coalesce(jsonb_agg(x order by x.views desc), '[]'::jsonb) from (
        select path, count(*) as views, count(distinct visitor) as visitors
        from public.page_events where kind = 'view' and created_at >= since
        group by path order by count(*) desc limit 20) x),
    'referrers', (
      select coalesce(jsonb_agg(x order by x.visits desc), '[]'::jsonb) from (
        select coalesce(nullif(referrer, ''), '(direct)') as source, count(distinct visitor) as visits
        from public.page_events where kind = 'view' and created_at >= since
        group by 1 order by 2 desc limit 12) x),
    'clicks', (
      select coalesce(jsonb_agg(x order by x.clicks desc), '[]'::jsonb) from (
        select coalesce(label, path) as label, count(*) as clicks
        from public.page_events where kind = 'click' and created_at >= since
        group by 1 order by 2 desc limit 20) x),
    'devices', (
      select coalesce(jsonb_agg(x order by x.visitors desc), '[]'::jsonb) from (
        select coalesce(device, 'unknown') as device, count(distinct visitor) as visitors
        from public.page_events where kind = 'view' and created_at >= since group by 1) x),
    'languages', (
      select coalesce(jsonb_agg(x order by x.views desc), '[]'::jsonb) from (
        select case when path like '/th/%' or path = '/th' then 'th' else 'en' end as site_lang, count(*) as views
        from public.page_events where kind = 'view' and created_at >= since group by 1) x),
    'timezones', (
      select coalesce(jsonb_agg(x order by x.visitors desc), '[]'::jsonb) from (
        select coalesce(tz, 'unknown') as tz, count(distinct visitor) as visitors
        from public.page_events where kind = 'view' and created_at >= since
        group by 1 order by 2 desc limit 12) x)
  );
end $$;
revoke all on function public.admin_stats(int) from public;
grant execute on function public.admin_stats(int) to authenticated;

-- ---------- media storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do nothing;

drop policy if exists "admins read media" on storage.objects;
create policy "admins read media" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
