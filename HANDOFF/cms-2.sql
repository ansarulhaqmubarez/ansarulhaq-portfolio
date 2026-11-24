-- CineCode Academy: CMS stage 2 (editable site texts). Safe to run more than once. ASCII only.
-- Needs cms-1.sql to be run first (is_staff, is_super_admin, audit_log).

create table if not exists public.site_content (
  key text primary key check (key ~ '^[A-Za-z0-9_.]{1,120}$'),
  value jsonb not null check (pg_column_size(value) <= 8000),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_content enable row level security;
drop policy if exists content_read on public.site_content;
create policy content_read on public.site_content for select to anon, authenticated using (true);
drop policy if exists content_write on public.site_content;
create policy content_write on public.site_content for all to authenticated using (public.is_staff()) with check (public.is_staff());
revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

create or replace function public.content_touch() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'content_reset', 'site_content', left(old.key, 80));
    return old;
  end if;
  new.updated_at := now();
  new.updated_by := auth.uid();
  insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'content_save', 'site_content', left(new.key, 80));
  return new;
end $$;

drop trigger if exists content_touch_ins on public.site_content;
create trigger content_touch_ins before insert or update on public.site_content for each row execute function public.content_touch();
drop trigger if exists content_touch_del on public.site_content;
create trigger content_touch_del before delete on public.site_content for each row execute function public.content_touch();
