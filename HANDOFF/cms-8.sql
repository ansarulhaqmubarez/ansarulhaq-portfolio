-- cms-8: opt-in leaderboard. Only students who tick the box appear, with a name THEY choose. (safe to run twice)
-- Needs the base tables: lesson_progress(user_id, completed), certificates(user_id, revoked).
create table if not exists public.leaderboard_optin (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(display_name) between 2 and 30),
  created_at timestamptz not null default now()
);
alter table public.leaderboard_optin enable row level security;
drop policy if exists "lb own read" on public.leaderboard_optin;
create policy "lb own read" on public.leaderboard_optin for select to authenticated using (user_id = auth.uid());
drop policy if exists "lb own insert" on public.leaderboard_optin;
create policy "lb own insert" on public.leaderboard_optin for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "lb own update" on public.leaderboard_optin;
create policy "lb own update" on public.leaderboard_optin for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "lb own delete" on public.leaderboard_optin;
create policy "lb own delete" on public.leaderboard_optin for delete to authenticated using (user_id = auth.uid());
revoke all on public.leaderboard_optin from anon, authenticated;
grant select, insert, update, delete on public.leaderboard_optin to authenticated;

-- public top 20: name chosen by the student + points (10 per completed lesson, 100 per valid certificate). No ids, no emails.
create or replace function public.public_leaderboard()
returns table(display_name text, xp bigint)
language sql security definer set search_path = public stable as $$
  select o.display_name,
         (coalesce((select count(*) from public.lesson_progress p where p.user_id = o.user_id and p.completed), 0) * 10
        + coalesce((select count(*) from public.certificates c where c.user_id = o.user_id and not c.revoked), 0) * 100)::bigint as xp
  from public.leaderboard_optin o
  order by xp desc, o.created_at asc
  limit 20;
$$;
revoke all on function public.public_leaderboard() from public;
grant execute on function public.public_leaderboard() to anon, authenticated;
