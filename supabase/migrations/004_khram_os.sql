-- Khram OS: one admin-only place to run the brand (tasks, content pipeline, sales channels,
-- weekly numbers, accounts register for handover). Run once in the Supabase SQL editor of
-- project hobwlswwwvmfqawdgjip (account khram.official@gmail.com). Safe to re-run.
-- Never store passwords, card or bank numbers here: the accounts register keeps only
-- which service, which login email, who owns it and where recovery lives.

create table if not exists public.os_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('task', 'content', 'listing', 'metric', 'account', 'note')),
  title text not null default '',
  status text not null default '',
  due date,
  data jsonb not null default '{}'::jsonb,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists os_items_kind_status_idx on public.os_items (kind, status, sort);

drop trigger if exists set_updated_at on public.os_items;
create trigger set_updated_at before update on public.os_items
  for each row execute function public.set_updated_at();

alter table public.os_items enable row level security;
revoke all on public.os_items from anon;

drop policy if exists "admins read os" on public.os_items;
create policy "admins read os" on public.os_items for select to authenticated using ((select public.is_admin()));
drop policy if exists "admins insert os" on public.os_items;
create policy "admins insert os" on public.os_items for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "admins update os" on public.os_items;
create policy "admins update os" on public.os_items for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admins delete os" on public.os_items;
create policy "admins delete os" on public.os_items for delete to authenticated using ((select public.is_admin()));

-- ---------- who can open the back office (for handing Khram over) ----------
create or replace function public.admin_list() returns setof text
language sql stable security definer set search_path = '' as $$
  select a.email from public.admins a where public.is_admin() order by a.email;
$$;

create or replace function public.admin_add(p_email text) returns void
language plpgsql security definer set search_path = '' as $$
declare e text := lower(trim(p_email));
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'invalid email'; end if;
  insert into public.admins (email) values (e) on conflict do nothing;
end $$;

create or replace function public.admin_remove(p_email text) returns void
language plpgsql security definer set search_path = '' as $$
declare e text := lower(trim(p_email));
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if e = lower(coalesce(auth.jwt() ->> 'email', '')) then raise exception 'cannot remove yourself'; end if;
  if (select count(*) from public.admins) <= 1 then raise exception 'keep at least one admin'; end if;
  delete from public.admins where email = e;
end $$;

revoke all on function public.admin_list() from public;
revoke all on function public.admin_add(text) from public;
revoke all on function public.admin_remove(text) from public;
grant execute on function public.admin_list() to authenticated;
grant execute on function public.admin_add(text) to authenticated;
grant execute on function public.admin_remove(text) to authenticated;
