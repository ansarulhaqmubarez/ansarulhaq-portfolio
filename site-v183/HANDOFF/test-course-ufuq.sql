-- CineCode Academy — TEST course "ufuq-test" (3 lessons + quiz + final exam).
-- Safe to run more than once: nothing is deleted or overwritten (course uses ON CONFLICT DO NOTHING; other rows only if missing).
-- Questions are about the lesson TITLES only (they are for testing the system, not real teaching content).
-- Run in Supabase > SQL Editor. Then open the course page, enroll, watch, take the exam, get the certificate.

insert into public.courses (id, title, summary, category, level, status, pass_percent, max_attempts, exam_minutes)
values ('ufuq-test',
  '{"fa":"دورهٔ تستی اُفُق","en":"UFUQ test course"}'::jsonb,
  '{"fa":"دورهٔ آزمایشی برای تست ثبت‌نام، پخش درس‌ها، امتحان و گواهی. محتوای تستی است.","en":"A trial course to test enrollment, lessons, exam and certificate. Test content."}'::jsonb,
  'Test', 'beginner', 'published', 60, 5, 10)
on conflict (id) do nothing;

insert into public.lessons (course_id, position, title, youtube_id, duration_sec)
select v.cid, v.pos, v.t::jsonb, v.yt, v.dur
from (values
 ('ufuq-test',1,'{"fa":"محبت حقیقی چگونه است؟","en":"What is true love like?"}','wEoHfksVRTI',0),
 ('ufuq-test',2,'{"fa":"راز آرامشی که هیچ‌کس بهت نگفته!","en":"The secret of calm nobody told you"}','coPuBjIW4JE',99),
 ('ufuq-test',3,'{"fa":"برگ‌هایی از آسمان؛ رازهای صبر و گنج‌های نهفته در رنج","en":"Leaves from the sky: patience and hidden treasures in hardship"}','_HnGMNr4e38',113)
) as v(cid,pos,t,yt,dur)
where not exists (select 1 from public.lessons l where l.course_id = v.cid and l.youtube_id = v.yt);

-- questions + options (only when the course has no questions yet)
do $$
declare qid uuid;
begin
  if exists (select 1 from public.questions where course_id = 'ufuq-test') then return; end if;

  insert into public.questions (course_id, kind, after_lesson, qtype, prompt)
  values ('ufuq-test','quiz',2,'mcq','{"fa":"(کوییز تستی) درس دوم دربارهٔ چیست؟","en":"(Test quiz) What is lesson 2 about?"}') returning id into qid;
  insert into public.options (question_id,label,is_correct) values
   (qid,'{"fa":"آرامشی که کسی نگفته","en":"The calm nobody told you about"}',true),
   (qid,'{"fa":"آموزش فتوشاپ","en":"Photoshop"}',false),
   (qid,'{"fa":"آشپزی","en":"Cooking"}',false);

  insert into public.questions (course_id, kind, after_lesson, qtype, prompt)
  values ('ufuq-test','final',null,'mcq','{"fa":"این دوره چند درس دارد؟","en":"How many lessons does this course have?"}') returning id into qid;
  insert into public.options (question_id,label,is_correct) values
   (qid,'{"fa":"۳","en":"3"}',true),(qid,'{"fa":"۱۰","en":"10"}',false),(qid,'{"fa":"۱","en":"1"}',false);

  insert into public.questions (course_id, kind, after_lesson, qtype, prompt)
  values ('ufuq-test','final',null,'mcq','{"fa":"کدام درس دربارهٔ «صبر و گنج‌های نهفته در رنج» است؟","en":"Which lesson is about patience and hidden treasures in hardship?"}') returning id into qid;
  insert into public.options (question_id,label,is_correct) values
   (qid,'{"fa":"درس سوم","en":"Lesson 3"}',true),(qid,'{"fa":"درس اول","en":"Lesson 1"}',false),(qid,'{"fa":"درس دوم","en":"Lesson 2"}',false);

  insert into public.questions (course_id, kind, after_lesson, qtype, prompt)
  values ('ufuq-test','final',null,'mcq','{"fa":"عنوان درس اول چیست؟","en":"What is the title of lesson 1?"}') returning id into qid;
  insert into public.options (question_id,label,is_correct) values
   (qid,'{"fa":"محبت حقیقی چگونه است؟","en":"What is true love like?"}',true),
   (qid,'{"fa":"مبانی تدوین","en":"Editing basics"}',false),
   (qid,'{"fa":"پایتون","en":"Python"}',false);

  insert into public.questions (course_id, kind, after_lesson, qtype, prompt)
  values ('ufuq-test','final',null,'mcq','{"fa":"این دوره برای چه ساخته شده است؟","en":"What is this course for?"}') returning id into qid;
  insert into public.options (question_id,label,is_correct) values
   (qid,'{"fa":"آزمایش ثبت‌نام، امتحان و گواهی","en":"Testing enrollment, exam and certificate"}',true),
   (qid,'{"fa":"فروش محصول","en":"Selling a product"}',false),
   (qid,'{"fa":"هیچ‌کدام","en":"None of these"}',false);
end $$;
