-- Khram 003: keep bots out of the visit stats.
-- Search engines (Google's URL Inspection / Rich Results Test render pages with JavaScript),
-- link scanners and headless browsers were being counted as visitors.

alter table public.page_events add column if not exists bot boolean not null default false;

create or replace function public.is_bot_ua(ua text) returns boolean
language sql immutable set search_path = '' as $$
  -- null = header not available (unknown, allowed); empty = no user agent at all (not a browser)
  select ua = ''
      or (ua ~* '(bot|crawl|spider|slurp|google-inspectiontool|googleother|google-extended|chrome-lighthouse|lighthouse|pagespeed|headlesschrome|phantomjs|puppeteer|playwright|facebookexternalhit|meta-externalagent|bingpreview|ahrefs|semrush|petalbot|yandex|baidu|ia_archiver|python-requests|curl/|wget|go-http-client|okhttp|uptime|gtmetrix)'
          and ua !~* 'cubot');
$$;

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
declare
  ua text := (nullif(current_setting('request.headers', true), '')::json ->> 'user-agent');
begin
  if p_kind not in ('view', 'click') then return; end if;
  if p_visitor is null or length(p_visitor) < 8 or length(p_visitor) > 64 then return; end if;
  if p_path is null or left(p_path, 1) <> '/' or p_path like '/admin%' then return; end if;
  -- bots and headless browsers are not stored at all
  if public.is_bot_ua(ua) or coalesce(p_lang, '') like '%@posix%' then return; end if;
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

-- Stats read only human rows.
create or replace view public.page_events_human as
  select * from public.page_events where not bot;
revoke all on public.page_events_human from anon, authenticated;

-- Rows recorded before this filter existed, identified by hand on 21 Oct 2026 (flagged, not deleted; set bot = false to undo):
update public.page_events set bot = true
where created_at < '2026-10-21 21:30+07' and (
     (tz = 'America/Los_Angeles' and created_at >= '2026-10-21 20:40+07')                 -- Search Console live tests (phone + desktop pairs)
  or (tz = 'America/Los_Angeles' and device = 'desktop' and referrer = 'facebook.com')   -- Facebook link scanners
  or (created_at between '2026-10-21 18:44+07' and '2026-10-21 18:49+07'
      and tz in ('Europe/Vienna', 'Europe/Amsterdam', 'Pacific/Honolulu', 'America/Los_Angeles')) -- scanners right after launch
  or coalesce(lang, '') like '%@posix%'
  or tz = 'UTC'
);

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
      from public.page_events_human where created_at >= since),
    'live', (select count(distinct visitor) from public.page_events_human where created_at > now() - interval '30 minutes'),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d.day, 'views', coalesce(v.views, 0),
               'visitors', coalesce(v.visitors, 0), 'clicks', coalesce(v.clicks, 0)) order by d.day), '[]'::jsonb)
      from (select gs::date as day from generate_series(first_day, (now() at time zone zone)::date, interval '1 day') gs) d
      left join (
        select (created_at at time zone zone)::date as day,
               count(*) filter (where kind = 'view') as views,
               count(distinct visitor) filter (where kind = 'view') as visitors,
               count(*) filter (where kind = 'click') as clicks
        from public.page_events_human where created_at >= since group by 1) v on v.day = d.day),
    'pages', (
      select coalesce(jsonb_agg(x order by x.views desc), '[]'::jsonb) from (
        select path, count(*) as views, count(distinct visitor) as visitors
        from public.page_events_human where kind = 'view' and created_at >= since
        group by path order by count(*) desc limit 20) x),
    'referrers', (
      select coalesce(jsonb_agg(x order by x.visits desc), '[]'::jsonb) from (
        select coalesce(nullif(referrer, ''), '(direct)') as source, count(distinct visitor) as visits
        from public.page_events_human where kind = 'view' and created_at >= since
        group by 1 order by 2 desc limit 12) x),
    'clicks', (
      select coalesce(jsonb_agg(x order by x.clicks desc), '[]'::jsonb) from (
        select coalesce(label, path) as label, count(*) as clicks
        from public.page_events_human where kind = 'click' and created_at >= since
        group by 1 order by 2 desc limit 20) x),
    'devices', (
      select coalesce(jsonb_agg(x order by x.visitors desc), '[]'::jsonb) from (
        select coalesce(device, 'unknown') as device, count(distinct visitor) as visitors
        from public.page_events_human where kind = 'view' and created_at >= since group by 1) x),
    'languages', (
      select coalesce(jsonb_agg(x order by x.views desc), '[]'::jsonb) from (
        select case when path like '/th/%' or path = '/th' then 'th' else 'en' end as site_lang, count(*) as views
        from public.page_events_human where kind = 'view' and created_at >= since group by 1) x),
    'timezones', (
      select coalesce(jsonb_agg(x order by x.visitors desc), '[]'::jsonb) from (
        select coalesce(tz, 'unknown') as tz, count(distinct visitor) as visitors
        from public.page_events_human where kind = 'view' and created_at >= since
        group by 1 order by 2 desc limit 12) x),
    'campaigns', (
      select coalesce(jsonb_agg(x order by x.visitors desc), '[]'::jsonb) from (
        select utm_source as campaign, count(distinct visitor) as visitors
        from public.page_events_human where kind = 'view' and created_at >= since and coalesce(utm_source, '') <> ''
        group by 1 order by 2 desc limit 12) x)
  );
end $$;
revoke all on function public.admin_stats(int) from public;
grant execute on function public.admin_stats(int) to authenticated;
