-- cms-7: newsletter subscribers. Public can only ADD an email; only super_admin can read or delete. (safe to run twice)
-- Needs cms-1.sql first (is_super_admin).
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  lang text not null default 'fa' check (lang in ('fa','en')),
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "news add" on public.newsletter_subscribers;
create policy "news add" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "news read" on public.newsletter_subscribers;
create policy "news read" on public.newsletter_subscribers for select to authenticated using (public.is_super_admin());
drop policy if exists "news delete" on public.newsletter_subscribers;
create policy "news delete" on public.newsletter_subscribers for delete to authenticated using (public.is_super_admin());
revoke all on public.newsletter_subscribers from anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, delete on public.newsletter_subscribers to authenticated;
