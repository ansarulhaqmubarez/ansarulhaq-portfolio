-- cms-9.sql  Certificate number (CCA-YYYY-FR-NNNN) + SHA-256 fingerprint. ASCII only, safe to run twice.
-- What it does:
--  1) adds columns cert_no and sha256 to public.certificates
--  2) fills them automatically for every NEW certificate (trigger) and for all OLD ones (backfill below)
--  3) adds public function certificate_proof(code) that returns only number, fingerprint, status (no personal data)
-- The text "FR" in the number is the constant v_tag inside certs_before_insert(). Change it there if you want another text.
-- The SHA-256 is a fingerprint of: code, user id, course id, issue date, name. It is stored when the certificate is issued,
-- so a later edit of those fields in the database can be detected (admin can recompute). It is not a digital signature.

alter table public.certificates add column if not exists cert_no text;
alter table public.certificates add column if not exists sha256 text;

create table if not exists public.cert_counters (year int primary key, n int not null default 0);
alter table public.cert_counters enable row level security;
-- no policies on purpose: only the trigger (security definer) touches it

create or replace function public.cert_fingerprint(p_code text, p_user uuid, p_course text, p_at timestamptz, p_name text)
returns text language sql immutable as $$
  select encode(sha256(convert_to(coalesce(p_code,'') || '|' || coalesce(p_user::text,'') || '|' || coalesce(p_course,'') || '|' || coalesce(to_char(p_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS'),'') || '|' || coalesce(p_name,''), 'UTF8')), 'hex');
$$;

create or replace function public.next_cert_no(p_year int)
returns text language plpgsql security definer set search_path = public as $$
declare v_tag constant text := 'FR'; v_n int;
begin
  insert into public.cert_counters(year, n) values (p_year, 1)
  on conflict (year) do update set n = public.cert_counters.n + 1
  returning n into v_n;
  return 'CCA-' || p_year::text || '-' || v_tag || '-' || lpad(v_n::text, 4, '0');
end $$;

create or replace function public.certs_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.issued_at is null then new.issued_at := now(); end if;
  if new.cert_no is null then new.cert_no := public.next_cert_no(extract(year from new.issued_at at time zone 'UTC')::int); end if;
  new.sha256 := public.cert_fingerprint(new.code, new.user_id, new.course_id::text, new.issued_at, new.full_name);
  return new;
end $$;

drop trigger if exists trg_certs_before_insert on public.certificates;
create trigger trg_certs_before_insert before insert on public.certificates
for each row execute function public.certs_before_insert();

-- backfill old certificates (oldest first so numbers follow the issue order)
do $$
declare r record;
begin
  for r in select ctid, * from public.certificates where cert_no is null order by issued_at, code loop
    update public.certificates c
       set cert_no = public.next_cert_no(extract(year from r.issued_at at time zone 'UTC')::int),
           sha256 = public.cert_fingerprint(r.code, r.user_id, r.course_id::text, r.issued_at, r.full_name)
     where c.code = r.code;
  end loop;
end $$;

create unique index if not exists certificates_cert_no_key on public.certificates(cert_no);

create or replace function public.certificate_proof(p_code text)
returns table(cert_no text, sha256 text, status text)
language sql stable security definer set search_path = public as $$
  select c.cert_no, c.sha256, case when c.revoked then 'revoked' else 'valid' end
  from public.certificates c where c.code = upper(trim(p_code)) limit 1;
$$;
revoke all on function public.certificate_proof(text) from public;
grant execute on function public.certificate_proof(text) to anon, authenticated;
