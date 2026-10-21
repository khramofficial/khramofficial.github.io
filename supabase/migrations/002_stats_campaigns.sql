-- Khram: add utm_source campaigns to admin_stats().
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
        group by 1 order by 2 desc limit 12) x),
    'campaigns', (
      select coalesce(jsonb_agg(x order by x.visitors desc), '[]'::jsonb) from (
        select utm_source as campaign, count(distinct visitor) as visitors
        from public.page_events where kind = 'view' and created_at >= since and coalesce(utm_source, '') <> ''
        group by 1 order by 2 desc limit 12) x)
  );
end $$;
revoke all on function public.admin_stats(int) from public;
grant execute on function public.admin_stats(int) to authenticated;
