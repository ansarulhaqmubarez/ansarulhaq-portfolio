-- cms-12: fix "column course_id of relation notifications does not exist" on enrollment.
-- Safe: only ADDS missing columns. Deletes nothing. Run once in Supabase -> SQL Editor.
alter table public.notifications add column if not exists course_id uuid;
alter table public.notifications add column if not exists link text;
alter table public.notifications add column if not exists kind text;
alter table public.notifications add column if not exists read_at timestamptz;
-- Show the real type of courses.id (if it is text, not uuid, run the 2 lines below instead):
select data_type from information_schema.columns where table_schema='public' and table_name='courses' and column_name='id';
-- alter table public.notifications drop column course_id;   -- only if courses.id is text
-- alter table public.notifications add column course_id text;
