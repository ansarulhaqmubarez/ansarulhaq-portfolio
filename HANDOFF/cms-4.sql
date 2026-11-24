-- CineCode Academy: CMS stage 4 (gallery manager). Safe to run more than once. ASCII only.
-- Needs cms-1.sql, cms-2.sql and cms-3.sql first (media bucket lives in cms-3.sql).

create table if not exists public.site_gallery (
  id text primary key check (id ~ '^[a-z0-9_-]{1,40}$'),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) <= 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_gallery enable row level security;
drop policy if exists gallery_read on public.site_gallery;
create policy gallery_read on public.site_gallery for select to anon, authenticated using (true);
drop policy if exists gallery_write on public.site_gallery;
create policy gallery_write on public.site_gallery for all to authenticated using (public.is_staff()) with check (public.is_staff());
revoke all on public.site_gallery from anon, authenticated;
grant select on public.site_gallery to anon, authenticated;
grant insert, update, delete on public.site_gallery to authenticated;

create or replace function public.gallery_touch() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'gallery_delete', 'site_gallery', left(old.id, 80));
    return old;
  end if;
  new.updated_at := now();
  new.updated_by := auth.uid();
  insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'gallery_save', 'site_gallery', left(new.id, 80));
  return new;
end $$;

drop trigger if exists gallery_touch_w on public.site_gallery;
create trigger gallery_touch_w before insert or update on public.site_gallery for each row execute function public.gallery_touch();
drop trigger if exists gallery_touch_d on public.site_gallery;
create trigger gallery_touch_d before delete on public.site_gallery for each row execute function public.gallery_touch();
