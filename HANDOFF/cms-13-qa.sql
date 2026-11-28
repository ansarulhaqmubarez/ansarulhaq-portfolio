-- cms-13: course questions and answers (students ask, super admin answers). Safe to run twice.
create table if not exists public.course_questions (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  lesson_id text,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text,
  body text not null check (char_length(body) between 5 and 1000),
  answer text check (answer is null or char_length(answer) <= 2000),
  answered_at timestamptz,
  status text not null default 'open' check (status in ('open','answered','hidden')),
  created_at timestamptz not null default now()
);
create index if not exists course_questions_course_idx on public.course_questions (course_id, created_at desc);
alter table public.course_questions enable row level security;

drop policy if exists "cq read" on public.course_questions;
create policy "cq read" on public.course_questions for select to authenticated using (
  public.is_super_admin() or user_id = auth.uid() or (status <> 'hidden' and exists (
    select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id::text = course_questions.course_id))
);
drop policy if exists "cq insert" on public.course_questions;
create policy "cq insert" on public.course_questions for insert to authenticated with check (
  user_id = auth.uid() and status = 'open' and answer is null and exists (
    select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id::text = course_questions.course_id)
);
drop policy if exists "cq admin update" on public.course_questions;
create policy "cq admin update" on public.course_questions for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
drop policy if exists "cq delete" on public.course_questions;
create policy "cq delete" on public.course_questions for delete to authenticated using (public.is_super_admin() or user_id = auth.uid());
