-- CineCode Academy: CMS stage 3 (projects studio + media bucket). Safe to run more than once. ASCII only.
-- Needs cms-1.sql and cms-2.sql first.

create table if not exists public.site_projects (
  id text primary key check (id ~ '^[a-z0-9_-]{1,40}$'),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) <= 30000),
  position int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_projects enable row level security;
drop policy if exists projects_read on public.site_projects;
create policy projects_read on public.site_projects for select to anon, authenticated using (true);
drop policy if exists projects_write on public.site_projects;
create policy projects_write on public.site_projects for all to authenticated using (public.is_staff()) with check (public.is_staff());
revoke all on public.site_projects from anon, authenticated;
grant select on public.site_projects to anon, authenticated;
grant insert, update, delete on public.site_projects to authenticated;

create or replace function public.projects_touch() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'project_delete', 'site_projects', left(old.id, 80));
    return old;
  end if;
  new.updated_at := now();
  new.updated_by := auth.uid();
  insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'project_save', 'site_projects', left(new.id, 80));
  return new;
end $$;

drop trigger if exists projects_touch_w on public.site_projects;
create trigger projects_touch_w before insert or update on public.site_projects for each row execute function public.projects_touch();
drop trigger if exists projects_touch_d on public.site_projects;
create trigger projects_touch_d before delete on public.site_projects for each row execute function public.projects_touch();

-- public media bucket (images only; staff upload). Videos stay on YouTube.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists media_read on storage.objects;
create policy media_read on storage.objects for select to anon, authenticated using (bucket_id = 'media');
drop policy if exists media_insert on storage.objects;
create policy media_insert on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff());
drop policy if exists media_update on storage.objects;
create policy media_update on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff()) with check (bucket_id = 'media' and public.is_staff());
drop policy if exists media_delete on storage.objects;
create policy media_delete on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff());
