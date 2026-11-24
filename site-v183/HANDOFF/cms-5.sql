-- CineCode Academy: CMS stage 5 (resume architect: education + work experience). Safe to run more than once. ASCII only.
-- Needs cms-1.sql first (is_staff, audit_log).

create table if not exists public.site_resume (
  id text primary key check (id ~ '^[a-z0-9_-]{1,40}$'),
  kind text not null check (kind in ('education','experience')),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) <= 8000),
  position int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_resume enable row level security;
drop policy if exists resume_read on public.site_resume;
create policy resume_read on public.site_resume for select to anon, authenticated using (true);
drop policy if exists resume_write on public.site_resume;
create policy resume_write on public.site_resume for all to authenticated using (public.is_staff()) with check (public.is_staff());
revoke all on public.site_resume from anon, authenticated;
grant select on public.site_resume to anon, authenticated;
grant insert, update, delete on public.site_resume to authenticated;

create or replace function public.resume_touch() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'resume_delete', 'site_resume', left(old.id, 80));
    return old;
  end if;
  new.updated_at := now();
  new.updated_by := auth.uid();
  insert into public.audit_log(actor, action, entity, entity_id) values (auth.uid(), 'resume_save', 'site_resume', left(new.id, 80));
  return new;
end $$;

drop trigger if exists resume_touch_w on public.site_resume;
create trigger resume_touch_w before insert or update on public.site_resume for each row execute function public.resume_touch();
drop trigger if exists resume_touch_d on public.site_resume;
create trigger resume_touch_d before delete on public.site_resume for each row execute function public.resume_touch();
