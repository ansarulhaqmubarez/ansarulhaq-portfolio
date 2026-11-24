# MASTER PROMPT — CineCode Academy (handoff to any AI / new session)

You are continuing a project for the owner, **Ansarulhaq Mubarez (انصارالحق مبارز)**, Kabul. He speaks Persian/Dari, is not a developer (his messages are often garbled — interpret generously), and is a filmmaker / editor / designer / CS student.
**Attach with this prompt:** `site.zip` (latest) and `ALL-NEW.sql`. Inspect them before changing anything. Preserve all existing data and working features.

## 1. Product
Bilingual (fa RTL / en LTR; Pashto to be added) personal portfolio + free online academy, branded **CineCode Academy** (purple shield logo). His name is the only manager/instructor/site author.
- Hosting: Cloudflare Workers project `mubarez` (https://mubarez.amobariz383.workers.dev), static files uploaded manually via "New deployment". No build step.
- Backend: Supabase project https://ttmkhuitmqfdfmtfiekv.supabase.co; he pastes SQL into the SQL Editor. Never ask for secret keys.
- Owner email: amobariz383@gmail.com (NOT 393). He is `super_admin`, already logged in.

## 2. Technical facts
- Static vanilla HTML/CSS/JS. Cloudflare `_headers` CSP has `script-src 'self'`: external libraries (Tailwind, GSAP, Three, Lottie, html2pdf CDNs) are blocked; vendor locally or write own code.
- `window.SITE` in `data/content.js` (projects 6, gallery 84, certs 44, library 81, courses 3). `assets/js/app.js` is one IIFE switching on `document.body.dataset.page`; separate scripts: exam.js, admin.js, extras.js, qr.js, portal.js.
- Supabase REST via `SB.rest` / `SB.send(method,path,body,prefer)`, RLS, SECURITY DEFINER RPCs. Staff = role `admin`/`super_admin` (`public.is_staff()`). Session in localStorage `am-sb`; other keys am-lang, am-mode, am-lite.
- Existing tables: courses(id text, title jsonb, summary jsonb, category, level, status, pass_percent, max_attempts, exam_minutes), profiles(id, full_name, role app_role, gender, birth_year, country, phone, education, …), enrollments, lessons, lesson_progress, attempts, certificates(code, user_id, course_id, full_name, issued_at, revoked), questions, options, written_answers, integrity_events. **No** tables projects / contacts_messages / leads exist.
- SQL rules: ASCII-only (Persian via \u escapes in JSON), idempotent, escape apostrophes.
- Service worker cache name must be bumped each release (now `mub-v17`).
- Test with Playwright (mock `**/*.supabase.co/**`), axe-core, local Postgres 16 (needs a mock `auth.users`, `auth.uid()`).
- External sites can't be opened from the sandbox; say so instead of claiming links work.

## 3. Decisions already made
- Two modes only (light/dark, sun toggle). Dark: navy #0A0E17, cards #161F30, cyan #00F0FF. (The CMS brief mentions #0A0A0C + amber/neon green — owner must confirm; default = keep the approved navy/cyan.)
- Typewriter effect only on the hero title. Copy protection only on course text (never block F12). YouTube lesson video must auto-play (muted fallback + Sound button).
- Certificates are **completion certificates**, not degrees. No fake data or stats: demo content labelled "Sample"; zero shows as zero.
- Bio facts are correct (b.2007; 6th semester cinema Kabul University; 3rd semester Salaam University; Islamic Azad; University of the People; certificates listed 44).

## 4. Working style (important)
- Reply in **short, simple Persian**, with numbered click-by-click steps for anything he must do.
- Be honest about testing: say what was and was not tested. **Never mark a feature done because its UI exists** — only after it works and a test passed.
- He fears usage limits: work in stages, deliver a zip + SQL after each stage, and tell him to write "ادامه" to continue.
- Never invent: domain names, degrees, jobs, certificates, fonts, or what "FR" means.

## 5. Already done (in site.zip, tested with mocks)
Logo/branding, two-mode theme, Moodle-style student portal (stats, filters, search, sort, grid/list), 3-column footer, new home page (slogans, mission, 3 pillars), hover/spotlight effects, course-text copy protection, YouTube autoplay, exam system + question bank, completion certificates with code + QR, auth + profiles + roles + admin panel, lesson progress + anti-skip, CSP/HSTS/RLS, privacy page, offline service worker, accessibility fixes (axe), mobile overflow fix, honeypot in forms. `ALL-NEW.sql` was run by the owner successfully.
**Not yet really tested (owner must try after upload):** real YouTube playback, avatar upload, email verification links, full exam→certificate flow, external links.

## 6. TODO — 10 stages (nothing below is done yet)
**Stage 1 – DB foundation (`cms-1.sql`):** `site_events` (no PII/fingerprint), `contact_messages`, `leads`, `site_settings` (contact info, socials, anti-copy switches), `notifications`, `audit_log`; RPCs `track_event` (validated, rate-limited), `public_stats` (anon: visits, unique visitors, students, enrolled, active 30d, graduates, certificates not revoked, published courses, anonymous recent activity), `admin_analytics(from,to)` (staff only), `submit_contact`; RLS; notification triggers.
**Stage 2 – Analytics:** tracker (respect Do Not Track; sessionStorage sid), home counters + live activity (reduced-motion safe; zero if backend off), admin analytics with date filters (Today/7/30/90/custom) and hand-built SVG charts, student success + LMS metrics (requests, pass rate, gender, certificates issued, pending reviews, latest registrations), privacy text update, bump cache, re-test, zip.
**Stage 3 – Inbox & notifications:** admin inbox for messages+leads (name, email, request type, time, message; status, notes, assignee); "Reply via Gmail" and "Open in WhatsApp" prefilled links; notification bell for admin and student.
**Stage 4 – Auth & email:** magic link, password recovery, fix email verification, **real Google + GitHub login via Supabase Auth** (no duplicate accounts for same verified email; loading/cancel/error messages; step-by-step OAuth docs; never claim active until configured and really tested); **SMTP email system** (trilingual responsive HTML templates: verify, reset, welcome, enrollment, completion, certificate, security, admin; SPF/DKIM/DMARC guidance; secrets only in env; logging + retry); onboarding for new students.
**Stage 5 – Certificates & credentials:** 3 templates, preview, PDF, QR, SHA-256 hash, IDs like CCA-2026-FR-0001, public verification page. **Credentials hub FR 01–FR 08** (code, title, issuer e.g. HubSpot Academy/Saylor/UniAthena/atingi UNESCO, date, description, image/PDF, verification URL, featured, visible, order). Do NOT invent what FR means and do not call items accredited unless evidence supports it — ASK the owner.
**Stage 6 – LMS & player:** resume position, keyboard shortcuts, captions, speed, course progress, badges/points; admin switches for right-click block and text-selection block; dynamic canvas watermark with the student's email over video.
**Stage 7 – Full CMS (super_admin CRUD on everything):** courses/lessons builder + study links, menu/footer manager, media library, page builder, live text editing; side-by-side fa/ps (RTL) + en (LTR) editor for hero titles, mission, About; contact-metadata controller (Kabul timezone, coordinates, phone, emails, YouTube/GitHub/Behance/LinkedIn/Threads/Snapchat); Portfolio Studio bound to a `projects` table (migrate existing 6 projects + 84 gallery without loss; fields: title, timecode like 00:01:03:02, category [Filmmaking, Editing, Motion, Graphic Design, Branding, Computer Science, Web], YouTube ID / Behance link, drag-and-drop upload to Supabase Storage → public thumbnail URL); Resume architect (education + work experience with task lists, e.g. Kabul University, Salaam University, University of the People, AlifBa Educational Center, Academy Baitul Hamd); font manager (own WOFF2/WOFF files, family/weight/style, preview, fallbacks, **verify license for web + PDF embedding; never download unlicensed fonts**).
**Stage 8 – Media/blog/search:** vertical Reels section + admin (feature/publish/unpublish/delete), project detail pages, galleries, category filter, featured; blog with categories; unified search; course recommendations.
**Stage 9 – Language/domain/resume/SEO:** full Pashto (RTL, suitable font, translation manager in admin, fallback; owner supplies translations); real production domain on Cloudflare (HTTPS, DNS, Supabase/OAuth/email URLs, canonical, sitemap, robots — **never invent or change the domain**); 3-language PDF resume from DB data + online resume page + download; SEO; backup; final security pass.
**Stage 10 – Motion & final QA:** cinematic animations with own CSS/JS; design polish; integrated test (Google/GitHub login, real SMTP, production domain/HTTPS, 3 languages, Reels/projects, resume PDF, fonts, FR 01–08) and a final three-part report: *fully implemented* / *needs owner credentials* / *needs owner confirmation*.
Honest caveats: don't promise Lighthouse 100; keep vanilla JS (no React/Vue) because of CSP.

## 7. Owner must provide (do not fake)
Google/GitHub OAuth setup · SMTP service + sender on real domain · real domain · Supabase Site URL / Confirm email / custom SMTP · Pashto translations · licensed fonts · meaning and data of FR 01–08 · real showreel/projects, resume PDF, booking link · Photoshop lesson key points · Turnstile site key · answers to the 4 open questions: (1) colors navy/cyan vs black/amber? (2) only email 383? (3) show phone 0777100489 in footer? (4) migrate projects+gallery into a `projects` table?

## 8. First action
Begin at **Stage 1** (write `cms-1.sql`, test on local Postgres 16, then Stage 2 code), deliver `site.zip` + `cms-1.sql` with short numbered Persian steps (Supabase → SQL Editor → New query → paste → Run).

---
# 9. UPDATE (2026-11-06) — OWNER ANSWERS + NEW REQUIREMENTS (these override Section 7 questions)

## Answers to the 4 questions
1. Colors: use whatever is best for the brand → keep navy #0A0E17 / cyan #00F0FF with the purple logo.
2. Emails: show/keep ALL: amobariz383@gmail.com and amobariz393@gmail.com (owner now wants both; make both editable in admin).
3. Phones (editable in admin, show in footer/contact):
   - 0777100489 — call + WhatsApp + Telegram (add wa.me and t.me links)
   - 0749261410 — Salaam, call only
   - 0789189866 — Etisalat, call only
4. Yes: migrate 6 projects + 84 gallery items into separate tables with per-item features, templates, effects, advanced transitions and refined motion.

## New requirements (items 5–14) — add to the stages
5. **Layout/typography/motion polish:** several pages are messy → tidy them. Text has no motion; motion is under-used. Fix icon sizes and font sizes (smaller, modern type scale), centered animated text + logo, new modern styles, animated text everywhere appropriate (own CSS/JS, CSP-safe).
6. **Certificates (premium):** very impressive templates + logo + digital-signature-style design (be honest: visual signature vs cryptographic; hash/QR verification is real). One-click share to LinkedIn, Facebook, Twitter/X and other networks (share URLs + Open Graph/Twitter Card meta on the public verification page with a generated preview image). **Sample certificates shown under every course and on pages**, visible to every visitor/registrant. Label samples as "Sample".
7. **Student dashboard:** many features, advanced modern styles, live/animated text and counters. Progress per lesson/course with motion/gamification.
8. **Email verification bug:** user clicks the confirmation link and is NOT signed in / sent into the site. Fix (Supabase Site URL + Redirect URLs + handling the `#access_token`/code on return in app.js, show "verified" success then sign in). Also: do not send only a single email — send nice, designed emails (welcome, enrollment, progress, completion, certificate, etc.). Needs a real mail sender (Resend/Brevo/SMTP via Supabase custom SMTP + Edge Function for event emails). Built-in Supabase mail is heavily rate-limited — say so honestly.
9. **Notifications:** notification center (messages, course events, progress, certificates) with motion; progress algorithms (how far the student has advanced in lessons) used in dashboard and other sections.
10. **Icons:** up-to-date consistent icon set (own inline SVG sprite, CSP-safe) used everywhere text/UI needs icons.
11. **RESPONSIVE — highest priority:** on his phone the page breaks/gets jumbled. Make everything fully responsive for phone, tablet, laptop, large screens (test 320/360/390/414/768/1024/1280/1920, both dir=rtl/ltr, light/dark; no horizontal scroll; tap targets ≥44px). Ask the owner for a screenshot/page name if a specific page is still wrong.
12. **Copyright + advanced footer:** proper copyright line (© year CineCode Academy — Ansarulhaq Mubarez), advanced footer with many useful features (links, contact with the 3 phones, socials, newsletter signup via real backend, language switch, back-to-top, legal pages).
13. **Automatic emails for every user event** (register, verify, enroll, progress milestones, completion, certificate, password reset, security).
14. **Admin = full control, 0→100:** owner must be able to change anything on any section of the site from the admin panel (texts in all languages, images, videos, links, contact data, footer, menus, courses, lessons, projects, gallery, certificates, templates, fonts, effects, settings). Build as a real advanced CMS (Section 6, Stage 7), no hard-coded content left that the owner cannot edit.

## Revised order (do in this order; deliver zip + SQL after each)
1 DB foundation → 2 Analytics → **R Responsive + typography + icons + layout cleanup + footer/copyright (highest priority; do right after 2, or even first if owner is blocked on mobile)** → **E Email verification fix + redirect config + notifications center** → 3 Inbox/leads → 4 Auth (magic link, Google/GitHub) + SMTP emails → 5 Certificates (premium + social share + samples) → 6 LMS/player/gamification → 7 Full CMS (everything editable) → 8 Reels/projects/gallery tables, blog, search → 9 Pashto, domain, resume PDF, SEO, backup → 10 Cinematic motion + final QA and honest report.

## Quick fix the owner can do now for item 8 (give him these steps)
Supabase → Authentication → URL Configuration: Site URL = https://mubarez.amobariz383.workers.dev ; Redirect URLs add https://mubarez.amobariz383.workers.dev/** → Save. Then register a NEW test account and click the link. (If it still fails, inspect how app.js handles the return URL.)

## CORRECTION (2026-11-06, latest — overrides everything above about emails)
The owner's ONLY two emails are: **ansarulhaq.af@gmail.com** and **amobariz383@gmail.com**. Do NOT use amobariz393@gmail.com anywhere (remove it if found). Keep both editable in the admin panel.

---
# 10. HOW TO START (read this first) + CURRENT STATE
**You receive:** this file + `site.zip` (the live site source, already contains this file as `HANDOFF/MASTER_PROMPT_CINECODE.md`) + `ALL-NEW.sql` (already run by the owner). Unzip site.zip in a NEW folder, read `README.md`, `data/content.js`, `assets/js/app.js`, `assets/js/admin.js`, `assets/css/style.css`, `_headers`, `sw.js`. Reply to the owner in short simple Persian.

**Where we stopped (in order):**
1. DONE & tested earlier: stages A, B, C (Section 5).
2. DONE but NOT yet tested (only `node --check` syntax passed): email-verification fix in `assets/js/app.js` — signup and recover now call `signup?redirect_to=<origin>/auth.html` and `recover?redirect_to=<origin>/auth.html`; the `#access_token` handler (~line 994) signs the user in and redirects to account.html; new branch handles `#error_code=otp_expired` by storing `am-autherr` in sessionStorage and showing a Persian/English message on auth.html. `sw.js` cache bumped to `mub-v18`. **First task: test this with Playwright (mock Supabase `/auth/v1/user`, open `auth.html#access_token=AT&refresh_token=RT&expires_in=3600&type=signup` → expect redirect to account.html and `am-sb` set; open `index.html#error=access_denied&error_code=otp_expired` → expect auth.html with the message).**
3. TO DO next, in this order: (a) branded email templates for Supabase Auth (Confirm signup, Reset password, Magic link) in HTML with the CineCode Academy logo from `https://mubarez.amobariz383.workers.dev/assets/img/cc-full.png`, fa+en text, big button, using Supabase variables `{{ .ConfirmationURL }}`; owner pastes them in Supabase → Authentication → Email Templates. (b) Stage 1 `cms-1.sql` + Stage 2 analytics. (c) Stage R responsive/typography/icons/footer/copyright (HIGH priority: phone layout breaks). (d) Stage E notifications. (e) Stages 3–10 as in Section 9 order.
4. Owner must do in Supabase (steps already given): Authentication → URL Configuration → Site URL `https://mubarez.amobariz383.workers.dev`, Redirect URLs add `https://mubarez.amobariz383.workers.dev/**`, Save. (He said this is understood; confirm whether he did it.)

**Rules for delivery:** after each stage, bump `sw.js` cache, run Playwright + axe, rebuild `site.zip` (include this file under `HANDOFF/`), give `*.sql` files with numbered Persian run-steps, and say honestly what was/was not tested. Mark a feature "done" only after a real test passed. Owner replies "ادامه" to continue.

## STATUS UPDATE (11:30): auth auto-login fix TESTED with Playwright mocks (verify link signs in and lands on account.html#profile; expired link shows message on auth.html). Branded email templates written (`HANDOFF/emails/*.html` + `.subject.txt`: confirm signup, reset password, magic link; fa+en, logo, button). Owner pastes them in Supabase → Authentication → Email Templates (not yet confirmed pasted). NEXT: Stage 1 `cms-1.sql`, then Stage 2.

## STATUS UPDATE (2026-11-07 03:15): Stages 1 and 2 are DONE and tested with mocks / local Postgres.
- `cms-1.sql` (tested on local Postgres: RLS, rate limit, triggers, RPCs). Owner must run it in Supabase SQL Editor (NOT yet confirmed run).
- Site: `assets/js/tracker.js` (DNT-respecting, no PII), `assets/js/stats.js` + `assets/css/stats.css` (home counters, hidden when backend is down), `assets/js/analytics.js` (admin analytics panel: Today/7/30/90/custom, hand-built SVG line chart, bars, donuts, student success). Wired in `admin.html`/`admin.js`. sw cache `mub-v20`. axe: 0 violations (fa/en, light/dark).
- Owner state: custom SMTP via Gmail still failing (535 BadCredentials) -> "Confirm email" turned OFF in Supabase as a workaround. Real fix = real domain + proper SMTP. Owner's account was re-created: he must run `update public.profiles set role='super_admin' where id=(select id from auth.users where email='amobariz383@gmail.com');`.
- Live site URL seen in logs: https://delicate-frost-e2d6.cinecode.workers.dev (Supabase Site URL/Redirects must match it).
- Another AI (designer) may be restyling the site in parallel: merge, do not overwrite.
- NEXT: Stage R (responsive/typography/icons/footer/copyright, birth-year calendar picker), Stage 3 inbox/leads UI in admin + notification bell (tables already in cms-1.sql), then Stage 4+.

## STATUS UPDATE (2026-11-07): Stage R part 1 DONE (tested). `assets/css/responsive.css` (linked in all 20 pages; header one tidy row on phones, cookie note clear of dock, cv h1 no overflow, tap targets); audit of 20 pages x 6 widths (320..1440) x fa/en = 0 horizontal overflow; axe clean on index/cv/auth (academy shows transient contrast only while cards fade in). Footer now shows both emails, 3 phones (tel:, WhatsApp, Telegram for 0777100489) and copyright (`ui.fCopy`, auto year). `data/content.js`: `contactEmail2`, `phones[]`. Birth-year select shows Gregorian + Solar Hijri range. sw cache `mub-v22`.
STILL TO DO in Stage R: typography scale/icons polish, section tidy-up and motion (the designer AI may be doing this: merge, don't overwrite), animated headings. Then Stage 3 (inbox/leads UI + notification bell).

## STATUS UPDATE - Stage 3 done (sw mub-v25)
- Admin inbox (assets/js/inbox.js): contact messages + work requests, status/notes, delete, Gmail reply, WhatsApp link. Needs cms-1.sql in Supabase.
- Notification bell (assets/js/notify.js) for logged-in users; reads `notifications`, marks all read.
- Contact form saves via rpc/submit_contact AND web3forms. tracker.js skips admin/account pages.
- Header a11y: icon-only buttons have sr-only names; bell uses content name (no aria-label). axe clean 320-1400 fa/en; layout audit 20 pages 0 problems.
- NEXT: stage E/4 (domain + SMTP, magic link, OAuth), stage 5 (premium certificates), then 6-10. Ask owner for screenshot of "broken" page.

## STATUS UPDATE - Stage 5 (part 1) done (sw mub-v26)
- assets/js/certs.js + assets/css/certs.css: premium certificate, 3 templates (classic/modern/cinema, choice saved in localStorage am-ctpl), QR, seal, typed signature (NO real signature image yet - add via CMS later), print/PDF, share (LinkedIn, Facebook, X, WhatsApp, copy link). verify.html uses it for real certificates.
- course.html shows a clearly labelled SAMPLE certificate under every course (no share buttons, watermark "SAMPLE").
- Tested with mocks: no overflow 360/1100, axe clean, fa/en. NOT done yet: SHA-256 hash, Open Graph preview per certificate (static host => needs Edge Function), PDF file download (print only), FR 01-08 hub (ask owner what FR means), certificate IDs CCA-2026-FR-0001 format (needs SQL).

## STATUS UPDATE - Stage 6 (part 1) done (sw mub-v27)
- gamify.js/gamify.css: XP (10/lesson, 50/passed final, 100/cert), level = floor(sqrt(xp/50))+1, streak (from distinct lesson last_report_at dates - DB keeps only one date per lesson, so streak is approximate), 7 badges. Real data only; shown in account.html overview.
- adsec.js (admin): 3 switches -> site_settings security.block_right_click / block_text_selection / video_watermark (POST on_conflict=key; RLS: super_admin only).
- lms-extras.js (course.html): reads those flags; applies right-click block (#lplay, .exm), text-selection block, moving watermark (email + short ID) over the YouTube iframe. Deterrent only.
- Tested with mocks: numbers verified by hand (210 XP, level 3, streak 3, 5/7 badges), axe clean, no overflow, switch save POST verified, watermark + contextmenu verified on a synthetic iframe. NOT tested: real YouTube playback with watermark, real Supabase writes.
- Player already had: anti-skip, speed limit, attention checks, quizzes, final exam, integrity log (exam.js). NEXT: stage 7 full CMS (texts, contact metadata editor, projects studio + Storage upload, resume architect, fonts, menus/footer, media library).

## STATUS UPDATE - Stage 7 part 1: text + contact editor (sw mub-v28)
- NEW SQL: cms-2.sql (table site_content key/value jsonb; RLS read all, write is_staff; audit_log trigger). Tested on local Postgres twice (idempotent), bad key rejected.
- app.js: after first render, fetches site_content and applies overrides onto window.SITE, then buildChrome()+renderAll(). Only localized {fa,en} leaves (fa/en/ps) and allowlisted plain fields (contactEmail, contactEmail2, phone, phones.N.n/.show) can be overridden; supabase*/formKey/formEndpoint/domain never. Email/phone validated. window.__SITE0 = pristine copy (admin page only).
- adcms.js (admin): auto-lists all 390 localized texts by section (details, search), edit fa/en/ps, Save (POST on_conflict=key) / Reset (DELETE), contact editor (2 emails + phones). ps stored but the site has no Pashto UI yet.
- Also fixed global .fstatus.ok contrast (responsive.css).
- Tested with mocks (public apply + admin save + validation, axe light/dark, no overflow). NOT tested on real Supabase.
- NEXT in stage 7: projects studio (+Storage upload), resume architect, fonts manager, menus/footer, media library, page builder.

## STATUS UPDATE - Stage 7 part 2: Projects studio + Gallery manager (sw mub-v29)
- NEW SQL: cms-3.sql (site_projects + public storage bucket `media`, images only, staff upload), cms-4.sql (site_gallery). Both in HANDOFF/. Owner already ran cms-1..cms-4 in Supabase (gallery table was empty = 0 rows; site_projects had 6 rows).
- assets/js/adstudio.js (admin): import built-in 6 projects / 84 gallery into the tables (re-import safe), add/edit/hide/delete/reorder, YouTube ID validation, Behance/links, cover + gallery upload to bucket `media`, category change. app.js reads the tables on public pages (empty table = built-in list), works/project pages show covers, Behance links.
- Tested with mocks: import 6/84, edit, reorder (p1,p3,p2..), hide, upload (webp + thumb), YouTube validation, public pages reflect changes, axe light/dark clean, no overflow at 360, no JS errors. NOT tested on real Supabase (owner must press Import once and try an upload).
- NEXT in stage 7: resume architect, courses/lessons manager, menus/footer, media library, fonts manager, page builder. Then stage R part 2 (typography/icons/motion), 5/6 completion, 4 (SMTP/OAuth), 8, 9, 10. Known open issue: signup 504 (Gmail SMTP timeout) - suggest port 587 or Brevo.

## STATUS UPDATE - Stage 7 part 3: Resume architect (sw mub-v30)
- NEW SQL: HANDOFF/cms-5.sql (table site_resume: kind education|experience, data jsonb, position, hidden; RLS read all / write is_staff; audit trigger). Owner must run it in Supabase.
- assets/js/adresume.js (admin): import built-in education (4) / experience (2), add, edit, hide, delete, reorder; experience has a task list per language (fa/en, one task per line). app.js reads site_resume (empty = built-in lists) and shows tasks on index (#expList), cv.html and about.html (taskList helper).
- Tested with mocks: import (idempotent), edit tasks, add, validation, reorder, hide, delete, public pages (index, cv, about) reflect changes, axe light/dark clean, no overflow at 360, no JS errors. Also fixed .fstatus.err contrast in light mode. NOT tested on real Supabase.
- NEXT in stage 7: courses/lessons manager, menus/footer, media library, fonts manager, page builder. Then stage R part 2, 5/6 completion, 4 (SMTP/OAuth; signup 504 still open), 8, 9, 10.

## STATUS UPDATE - Stage 7 part 4: Courses and lessons manager (sw mub-v31)
- assets/js/adcourses.js (admin): list all courses (draft + published), create (validated id), edit (title/summary fa+en, category, level, status, pass %, attempts, exam minutes), publish/unpublish, delete (cascade, confirm), lessons per course (add/edit/delete, YouTube id or link -> id, minutes -> duration_sec, reorder that respects unique(course_id, position) by moving to 1000+i first). NO new SQL: staff already write courses/lessons by RLS. Study/download links per lesson NOT done (needs a column or table: ask owner).
- Tested with mocks incl. a unique-position constraint; axe light/dark clean; no overflow at 360; no JS errors. NOT tested on real Supabase. Note for tests: with sync Playwright use page.wait_for_timeout, not time.sleep, or route handlers do not run.
- Added list styles (.st-list, .st-t, .cr-l) to gamify.css.
- NEXT in stage 7: menus/footer manager, media library, fonts manager, page builder (+ study links). Then stage R part 2 (visual/motion), 5/6 completion, 4 (SMTP/OAuth; signup 504 open), 8, 9, 10.

## Status update — Visual layer 1 (mub-v32)
- NEW assets/js/fx2.js + assets/css/fx2.css: kinetic slogan (typed then dissolves), 3D card tilt + glare, magnetic buttons, hero particles, staggered grid reveals. Off for admin, reduced-motion, html.lite, touch. Mock-tested (axe clean light/dark, no overflow, no JS errors). Not yet tested on the real site.
- Next: premium certificate templates + QR + share text, login redesign, graphics slider (letter style), CV layout, home motion.

## Status update — v33
- certs.js rewritten: 5 templates (classic, modern, cinema, royal, tech), 3 kinds (completion/excellence/participation), QR + Code128 barcode (verified with zxing decoder), signature SVG, corner ornaments, Coursera-style editable share text + LinkedIn add-to-profile/post, X, Facebook, WhatsApp, Telegram, email, native share.
- certshow.js: public showcase slider (all styles, SAMPLE-labelled) appended to home, academy, course pages.
- auth.html (renderAuth): split card with benefits panel, segmented tabs, password strength meter.
- Home graphics section: framed "plaque" slider with autoplay (fx2.js __gsInit, fx2.css).
- sw.js mub-v33. Mock-tested only (axe clean, no overflow, no JS errors).
- Still to do: CV page layout, dashboard (account.html) polish, admin "edit everything" (menus/footer/home sections/effects switches), home advanced motion, real-site tests.

## Status update — v34
- CV (renderCV in app.js): 3 selectable styles (modern two-column, classic, compact), print-friendly; default from design.cv_tpl.
- Admin "Look & effects" (assets/js/addesign.js, #adDesign): switches kinetic/tilt/magnet/particles/stagger/gsauto/showcase + defaults motion, cert_tpl, cv_tpl, stored as site_settings design.*; public pages cache in localStorage am-design (fx2.js refreshD). Requires HANDOFF/cms-6.sql (tested on local PG: anon reads only design.*, only super_admin writes design.*).
- sw.js mub-v34.
- Still to do: dashboard (account.html) polish, admin editors for menus/footer/home sections, home advanced motion, real-site tests.

## Status update — v35
- account.html certificates tab: earned certificates rendered with the new cert engine (tabs per cert, QR/barcode, editable share text + share links). Mock-tested.
- fx2.js: words() (headings rise word by word), parallax() (hero); both switchable in admin Look & effects (design.words / design.parallax).
- Still to do: admin editors for menus/footer/home sections, real-site verification.

## Status update — v36
- Admin "Look & effects" now has Home layout: show/hide + move up/down of 21 home sections (design.home_hide / design.home_order). fx2.js layout() applies hide (CSS + matching nav links) and DOM reorder; first visit after a change may show the old layout once (cached in localStorage am-design).
- sw.js mub-v36. Mock-tested (ly_test.py). Needs cms-6.sql.
- Texts: every {fa,en} text (incl. footer/menus labels) is already editable via the Texts editor (adcms.js).
- Still to do: ask owner what "FR 01-08" means; real-site verification; Pashto; auto event emails; Google/GitHub login (owner setup).

## Status update — v37
- Admin Look & effects: Certificate details (signer name/title, signature image upload to media/signature, footer line; certs.js reads design.cert_* from localStorage am-design) and Section builder (design.blocks, max 12: card/banner/quote/split/plain, placement top/middle/end, button+link, image upload). Public renderer assets/js/blocks.js (textContent only, URL allowlist).
- fx2.js glow(): cursor light + card border glow + animated headline gradient (switch design.glow).
- sw.js mub-v37. All mock-tested (blk_test.py, sweep.py: 17 pages clean).

## Status update — v38 (Home v2, senior-consultant restructure)
- ROOT CAUSE FIXED: class `.sr` was used for both scroll-reveal (app.js) and screen-reader-only (CSS), which hid every `.sh` section heading and collapsed the 2-column `.sec` grid. Reveal class renamed to `.rvl` (app.js + style.css).
- home2.css: single-column sections with visible headings, even vertical rhythm, labelled primary sign-in pill in header, only 3 projects on home (+ "See all work").
- Default home layout (fx2.js DEF_ORDER/DEF_HIDE, mirrored in addesign.js): hero > pillars > courses > certificate samples > work > graphics slider > founder card > about (+ CV/About/Works buttons) > contact. Hidden by default (re-enable in admin Home layout): mission, videos, experience, education, skills, languages, own certs, links, press, etc. Page height 11.9k px -> 8.6k px desktop.
- sw.js mub-v38.

## Status update — v39
- Home course cards (app.js #courseList): generated gradient covers with icon, level chip, "View" action, hover lift. "Certificates I earned" card hides when the own-certs section is hidden (html.ly-nocerts). sw.js mub-v39.

## Status update — v41
- Hero trust strip (fx2.js trust()), admin-defined extra footer links (design.footer_links, URL allowlist; admin editor in addesign.js), one-time confetti when a valid real certificate is shown (certs.js confetti, session-flagged, respects reduced-motion/lite), compact corner cookie notice (responsive.css .ck). Ctrl+K search already existed. sw.js mub-v41. Sweep: 17 pages clean.

## Status update — v42
- Admin "Students" (assets/js/adstudents.js, #adStu): read-only list of profiles with enrolment/certificate counts, search, sort, details panel, CSV export (formula-injection guarded). Staff-only via RLS. Mock-tested with 121 learners. sw.js mub-v42.

## Status update — v43
- Admin "Backup & restore" (assets/js/adbackup.js, #adBk): JSON export of site_content, design.* settings, projects, gallery, résumé; restore validates each row (key/id regex, size, kind allowlist, security.* keys refused) and writes via the normal API (RLS decides). Mock-tested. sw.js mub-v43.

## Status update — v44
- Removed the (old, style.css) cross-document @view-transition because Chromium logged "ViewTransition opt-in disabled" errors on the second navigation. Not shipped. Works page (84 real posters) and academy page reviewed visually: fine. sw.js mub-v44.

## Status update — v45 (home hero finished)
- fx2.js heroTwo(): two-column hero (copy + portrait arch with orbit rings and floating chips/cards, desktop >=980px; mobile stays single column), bands(): alternating tinted full-bleed section bands. home2.css. sw.js mub-v45. Home page design considered complete for this round; remaining polish needs real data (projects import).

## Status update — v46
- Admin "Pre-launch check" (assets/js/adcheck.js, #adCk): 12 checks (Supabase, https, real host, super_admin, site_content, projects/gallery/résumé tables+data, published courses+lessons, design save works via harmless key design._ping, contact email) with fix hints. Mock-tested (all-ok and empty scenarios). sw.js mub-v46.

## v47 — Top menu editor
Admin > Look & effects > "منوی بالا": show/hide, rename (fa/en), reorder, up to 6 extra links (https/page.html only). Stored in design.nav; applied by fx2.js navEdit(). Mock-tested only (nav_test.py).

## v48 — Page curtain, menu scramble, FAQ builder
fx2.js curtain() (switch design.curtain), scramble() (design.scramble, English menu hover), faq() (design.faq, academy page; admin editor in addesign.js, up to 15). Mock-tested: saved, rendered with textContent (HTML not executed), axe clean, curtain close/open works, sweep 17 pages 0 problems.

## v49 — Countdown on announcement banner, accent colour presets
banner field `d` (ISO local date) → live countdown in fx2 banner(); design.accent (violet/teal/crimson/orange/indigo/magenta) via theme() with separate light/dark values (AA checked on light). Mock-tested, axe clean, sweep 0 problems. NOTE: testimonials/partners/banner editors + renderers already existed before v48.

## v50 — Team/instructors section
design.team (admin list editor) rendered on academy page by fx2 team() with textContent only; mock-tested, axe clean, sweep 0.

## v51 — Newsletter
HANDOFF/cms-7.sql (table newsletter_subscribers: anon insert only, super_admin read/delete; tested on local PG16: dup ignored, bad email rejected, anon cannot read/delete). Public form fx2 news() when design.news=="on" (default off); admin list/search/delete/CSV in adnews.js. Mock-tested, axe clean, sweep 0.

## v52 — Live preview in admin
addesign.js: same-origin iframe preview (home/academy/works/cv, phone width toggle), reloads after each successful save. _headers: X-Frame-Options SAMEORIGIN and frame-src now includes self (needed for the preview). Mock-tested.

## v53 — Pre-launch check now 13 points (adds newsletter table / cms-7). Mock-tested (full: 11/13 on localhost, the 2 misses are https+host as expected; empty: 3/13).

## v54 — Latest news cards (design.posts) on home, newest first, max 6; textContent only, link allowlist. Mock-tested.

(See HANDOFF/OWNER_GUIDE_FA.md for the owner step-by-step guide.)

## v56 — Performance: logo PNGs downscaled to display size x2 (logo-full 146->53KB, light 141->49KB, mark 51->20KB, mark-light 50->17KB). Originals not kept in zip. Home image weight drops ~270KB.

## v57 — Hidden theme logo variants are lazy (only the visible one downloads). Tested light/dark.

## v58 — Learning path, course compare, works search, blog page, change history, signup chart
fx2.js: lpath() + compare() on academy; worksQ() on works; blog() on new blog.html (data-page="blog", reads design.posts; posts gained long fields bf/be; home cards link to blog.html#pN). addesign.js: change history (last 30, localStorage am-dh, Restore). adstudents.js: 12-week sign-up chart. Class names cp2-* (old .cmp-* belong to the before/after slider). Mock-tested, axe clean, sweep 0.
Checked and already existing before this batch: showreel (extras.js), leads/contact inbox (inbox.js), notifications (notify.js), browser PDF print of certificate, academy search/sort/filters.
NOT built: leaderboard (needs public exposure of other students' progress = privacy decision + DB view), OG preview image per certificate (needs a server function).

## v59 — Opt-in leaderboard
HANDOFF/cms-8.sql (leaderboard_optin own-row RLS + security-definer public_leaderboard(): top 20 by 10/lesson + 100/valid certificate; tested on local PG with stub tables: cannot opt in others, anon cannot read table, revoked cert not counted, opt-out removes). UI: academy #board and account #bdOpt, switch design.board=="on" (default off). XP formula excludes exam points (exam table schema not in HANDOFF). Mock-tested.

## v60 — Wow layer (admin switches, all default ON): aurora + floating shapes (hero), card spotlight, button ripple, spark burst on .btn.go, 3D card entrance, scroll cue, hero 3D tilt, shimmering page titles. Checked: syntax, one home screenshot (fixed grid-item bug where aurora pushed the portrait away), sweep 17 pages 0 problems. Header/footer show-hide editor (design.chrome) is in the code but was NOT tested.

## v61 — Tidy menus: removed directory, timeline, notes, activity, toolkit, press kit, services from header dropdowns and footer columns (pages still exist by direct URL). Added Blog to dropdown, footer columns and quick links (i18n key nBlog). Kept: home, about, academy, library, works, certificates, CV, contact, account, privacy.

## v62 — Simple home (default): hero, works, courses, about, contact. Hidden by default (re-enable in admin > Look & effects > Home layout): three pillars, mission, certificate samples, graphics, founder block, videos, experience, education, skills, languages, certs, links, etc. addesign.js DEF_ORDER/DEF_HIDE now mirror fx2.js (they differed before). Note: an admin-saved design.home_order/home_hide overrides these defaults; press "Reset to default layout" in admin to apply the new simple home. Sections below the hero appear on scroll (reveal), full-page screenshots show them blank.

## v63 — Home gets two new sections (ids numbers, process): real-count number strip (only non-sample courses/lessons/projects >0, plus Languages 2 and Free 100%) and a 4-step path (sign-up, video lessons, final exam, QR certificate). Default order: cc, numbers, work, courses, process, about, contact. Admin layout list has both. Press "Reset to default layout" to apply.

## v64 — Per owner list: (1) certificate showcase no longer on home/academy (certshow.js only runs if design.showcase===true); per-course sample stays on course page, real certs in account. (2) works category chips hidden on home (still on works.html). (3) SIM operator names (Salaam/Etisalat) removed from phones in content.js and footer. (4) New home section "what" = icon bento (portfolio, academy, QR certificates, library, work with me). Default order: cc, what, numbers, work, courses, process, about, contact. Graphics section stays hidden by default.

## v65 — Clean first page: removed top "sample" notice (moved to footer end as a <p>), removed the 4-badge trust strip and the 3 role chips around the hero portrait (kept 2 cards), header lite-mode button hidden by default (design.chrome absent => hides h_lite; admin Header/footer list can re-enable). sweep 17 pages 0.

## v66 — Consistent content-page button size (46px min; header/admin tool buttons unchanged), login/forgot buttons full width, academy hero compact (portrait 300px, stray dot removed). Reviewed visually: academy, works, cv, auth.
