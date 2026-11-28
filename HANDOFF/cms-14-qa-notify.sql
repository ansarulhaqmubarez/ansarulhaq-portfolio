-- cms-14: notify the student (bell) when the admin answers a course question. Run cms-13 first. Safe to run twice.
-- If notifications has different columns, the insert is skipped silently and answering still works.
create or replace function public.cq_notify() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.answer is not null and old.answer is distinct from new.answer then
    begin
      insert into public.notifications (user_id, kind, link) values (new.user_id, 'question_answered', 'course.html#' || new.course_id);
    exception when others then null;
    end;
  end if;
  return new;
end $$;
drop trigger if exists cq_notify on public.course_questions;
create trigger cq_notify after update on public.course_questions for each row execute function public.cq_notify();
