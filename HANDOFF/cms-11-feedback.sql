-- Public feedback wall. Visitors can send feedback and (only if they tick the box) it is saved here as NOT approved.
-- Only rows you set approved = true are visible on the site. Safe to run more than once.
create table if not exists public.feedback_public (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  kind text not null default 'other' check (char_length(kind) <= 40),
  message text not null check (char_length(message) between 10 and 600),
  lang text not null default 'fa',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.feedback_public enable row level security;
drop policy if exists feedback_public_read on public.feedback_public;
create policy feedback_public_read on public.feedback_public for select to anon, authenticated using (approved = true);
revoke all on public.feedback_public from anon, authenticated;
grant select on public.feedback_public to anon, authenticated;

create or replace function public.submit_public_feedback(p_name text, p_kind text, p_message text, p_lang text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if char_length(trim(coalesce(p_name,''))) < 2 or char_length(trim(coalesce(p_message,''))) < 10 then
    return jsonb_build_object('ok', false);
  end if;
  insert into public.feedback_public(name, kind, message, lang)
  values (left(trim(p_name),60), left(coalesce(p_kind,'other'),40), left(trim(p_message),600), case when p_lang = 'en' then 'en' else 'fa' end);
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.submit_public_feedback(text,text,text,text) from public;
grant execute on function public.submit_public_feedback(text,text,text,text) to anon, authenticated;
-- To publish a message: Supabase > Table Editor > feedback_public > set approved = true on that row.

-- Admin moderation from the admin panel (super_admin only): read all, approve/unapprove, delete.
drop policy if exists feedback_admin_read on public.feedback_public;
create policy feedback_admin_read on public.feedback_public for select to authenticated using (public.is_super_admin());
drop policy if exists feedback_admin_update on public.feedback_public;
create policy feedback_admin_update on public.feedback_public for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
drop policy if exists feedback_admin_delete on public.feedback_public;
create policy feedback_admin_delete on public.feedback_public for delete to authenticated using (public.is_super_admin());
grant update, delete on public.feedback_public to authenticated;
