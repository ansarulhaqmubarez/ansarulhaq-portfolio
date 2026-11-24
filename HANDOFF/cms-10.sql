-- cms-10: newsletter subscribers (footer form). Safe to run twice.
-- Anyone may INSERT one email; only super_admin may read or delete. No personal data beyond the email.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  lang text,
  created_at timestamptz not null default now(),
  constraint nl_email_chk check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create unique index if not exists nl_email_uq on public.newsletter_subscribers (lower(email));
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "nl insert" on public.newsletter_subscribers;
create policy "nl insert" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "nl admin read" on public.newsletter_subscribers;
create policy "nl admin read" on public.newsletter_subscribers for select to authenticated using (public.is_super_admin());
drop policy if exists "nl admin delete" on public.newsletter_subscribers;
create policy "nl admin delete" on public.newsletter_subscribers for delete to authenticated using (public.is_super_admin());
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, delete on public.newsletter_subscribers to authenticated;
