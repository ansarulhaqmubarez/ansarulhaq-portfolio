# صف کارهای بعدی (به ترتیب) — ثبت‌شده 2026-11-11

## الف) خرابی‌ها (اول)
1. [نیمه‌انجام v72: شرط پروفایل کامل در کد هست؛ پیام حالا فیلدهای ناقص را نام می‌برد. منتظر پیام خطای واقعی کاربر] ثبت‌نام در دوره کار نمی‌کند.
2. [انجام v72: نوار متحرک mq از DEF_HIDE برداشته شد و بعد از هیرو آمد] حرکت (motion) متن‌های بنر [v79: عنوان صفحه‌ها (ph1/ph2) هم کلمه‌به‌کلمه ظاهر می‌شود] «ادیت، موشن، طراحی گرافیک، برند، علوم کامپیوتر» و متن‌های دیگر برگردد.
3. [انجام v71: dock پایین‌وسط با عکس] شکل (shape) وسط-پایین صفحهٔ اول گم شده، برگردد.
4. [انجام v71] آیکن‌ها و دسته‌بندی‌های بالای هدر برگردند.
5. [باز: نمی‌دانم کدام بخش؛ بپرسیم: عکس موبایل] موبایل: لوگو/بخش‌ها به هم می‌چسبند، درست شود.

## ب) ایمیل/حساب
6. [راهنما نوشته شد: EMAIL_SETUP_FA.md — مالک انجام می‌دهد] «Error sending confirmation email»: SMTP در Supabase (مالک انجام می‌دهد؛ قدم‌ها نوشته شود).
7. یک ایمیل = یک حساب (Confirm email در Supabase + پیام درست در سایت).
8. [انجام: ۳ قالب Supabase قبلاً + ۲ قالب رویداد جدید در HANDOFF/emails؛ راهنمای EMAIL_SETUP_FA.md؛ ارسال خودکار رویداد هنوز نشده] قالب ایمیل با لوگو + اطلاعات دوره.

## ج) داشبورد — باید «دقیقاً مثل» فایل‌های مرجع ساخته شود، نه تغییر کوچک
9. داشبورد AOU (Dashboard___AOU.html، Moodle): کارت دوره‌ها + فیلتر + جستجو.
10. پورتال UoPeople (431847a4-….html): بالای صفحه، شمارش معکوس، مراحل ثبت‌نام، چک‌لیست، جدول دوره‌ها (FUTURE/PAST).
11. [انجام v74: تب «فضای درسی» — بنر، اعلان، درس‌ها، کارهای من، نمره‌ها؛ هنوز منوی کاربر ✓ v70] Brightspace (9c182c00-….html): بنر، اعلان‌ها، ماژول‌های دوره، Work To Do، تقویم، منوی کاربر (Profile/Notifications/Settings/Progress/Log out).
12. توضیح مالک: دو فایل = دو سیستم جدا. فایل اول «پورتال» (UoPeople، ورود با یک ایمیل)، فایل دوم بخش «کارخانگی/درسی» (Brightspace، ورود جدا). پیام مالک نیمه‌کاره قطع شد (…«جدا و د»)؛ ادامه‌اش را بپرسیم: در سایت ما هر دو بخش با یک حساب یا دو ورود جدا؟
13. فوتر مثل فایل UoPeople: انجام شد v68 (لینک‌ها هنوز از ادمین قابل ویرایش نیستند).
- مالک گفت بعد از v70 «هیچ‌چیز مثل مرجع نشد» → از او عکس داشبورد واقعی گرفته شود.

## د) ساختار صفحه‌ها
14. [انجام v75: graphics.html، ۸۴ طرح، فیلتر، لایت‌باکس] نمونه‌کارهای گرافیک: صفحهٔ جدا با قالب و افکت خودش.
15. [انجام v75: certificates.html، ۴۴ گواهی، کارت 3D، لایت‌باکس] گواهی‌ها: صفحهٔ جدا با قالب و افکت.
16. [انجام v76: دو ستون تحصیلات/سوابق، کارت‌های «ادامهٔ مسیر»؛ متن دربارهٔ من هنوز باید با مالک نهایی شود] دربارهٔ من: صفحهٔ جدا، متن منظم.
17. [انجام v77: بخش lib در هوم با ۸ دسته؛ مالک باید «بازنشانی چیدمان» در ادمین بزند] هوم: کتابخانه، مقاله‌ها، برنامه‌های کاربردی، انواع سایت‌ها با آیکن و دسته‌بندی.
18. [انجام: صفحهٔ resources.html با ۸۵۳ مورد، جستجو، ۱۷ دسته و دستهٔ هشدار؛ هنوز: وصل به داشبورد درسی/هوم] [فایل دریافت شد و به JSON تبدیل شد: HANDOFF/library_links.json — ۱۷ دسته، ۸۵۳ مورد، ۶ مورد بدون لینک، ۱۹ مورد دستهٔ ۱۷ «غیرمعتبر/نیازمند احتیاط» → با برچسب هشدار و جدا، نه در لیست اصلی] هزاران لینک مالک (فایل Word بیش از ۱۰۰۰ دوره/سایت — مالک دوباره می‌فرستد) → دسته‌بندی با لوگو/آیکن در کتابخانه، داشبورد درسی و صفحه‌ها.

## پیشرفت v80
- [انجام v80] ساخت صفحهٔ دلخواه از ادمین: بخش «ساخت صفحهٔ دلخواه» (adpages.js) + page.html#نشانی (page.js). ذخیره در site_settings کلید design.pages (نیاز: سوپرادمین + cms-6.sql). بلوک‌ها: عنوان، متن، عکس، دکمه، کارت‌ها، لینک یوتیوب، خط. تست با دادهٔ نمونه.
- v81: mobile header made ~opaque + blur (A5). Waiting for owner's phone screenshot if issue persists.
- v82: صفحه‌های ساخته‌شده در ادمین (غیرمخفی) خودکار در ستون «درباره» فوتر می‌آیند (از کش am-design).
- v83: کارت «کتابخانه» در داشبورد پورتال (لینک به resources.html).
- v84: ادمین «لینک‌های فوتر» (adfooter.js، کلید design.footer_links، حداکثر ۸، فقط https/صفحه داخلی) و نمایش در ستون آکادمی فوتر.
- v85: آرشیو منابع: نشان حرف‌اول (مثل لوگو) روی هر کارت + ستارهٔ ذخیره (localStorage am-rs-fav) + فیلتر «ذخیره‌شده». لوگوی واقعی سایت‌ها نیاز به اجازهٔ CSP/تصویر بیرونی دارد؛ فعلاً نشان حرف‌اول.
- v86: میان‌بر PWA (manifest shortcuts) + کش آفلاین کتابخانه.
- v87: نوار اعداد صفحهٔ اول: طرح گرافیک و گواهی هم اضافه شد (از داده‌ها شمرده می‌شود).
- v88: هیرو در صفحه‌های کوتاه کامپیوتر فشرده شد تا جملهٔ آخر زیر dock نرود.
- v89: ریلز (reels.html + ادمین adreels.js، design.reels)، لینک مطالعه/دانلود هر درس (adlinks.js، design.lesson_links)، پلیر: زیرنویس، کلیدهای J/K/M/C/F/Space (ادامه از جای قبلی از قبل بود). باگ ادمین: چیدمان خانه با «mq/laurels» کرش می‌کرد → درست شد.
- v90: cms-9.sql (cert_no CCA-YYYY-FR-NNNN + sha256 + certificate_proof) — روی PG16 محلی تست شد؛ صفحهٔ تأیید شمارهٔ گواهی و SHA-256 را نشان می‌دهد. pdf.js: دانلود PDF گواهی و رزومه (نوشتن‌گر PDF خودمان، تصویر صفحه؛ متن قابل انتخاب نیست).
- v91: پشتو (ps): منوی زبان، ۱۳۰ متن پرکاربرد؛ بقیه به فارسی برمی‌گردد. ترجمه باید توسط فردی که پشتو را خوب می‌داند بازبینی شود.
- v92: سه در ورودی زیر هیرو (یاد بگیرم / کارها / پروژه دارم) مطابق طرح «د». طرح‌های پیشنهادی صفحهٔ اول در بوم Design (الف، ب، ج، د). منتظر انتخاب مالک برای بقیهٔ بخش‌ها.
- v93: کاشی «تأیید گواهی» در خانه (vtile) + «doors» در مدیر چیدمان ادمین؛ برای دیدن، «بازنشانی چیدمان پیش‌فرض» لازم است.
- v94: ثبت‌نام دوره: پیام خطا حالا علت دقیق را می‌گوید (نشست تمام‌شده، FK 23503، RLS 42501، کد/متن Supabase). علت اصلی هنوز نامعلوم؛ منتظر متن خطای مالک.
- v95: بخش «نمونه‌کارها» در خانه تا وقتی پروژه‌ها نمونه‌اند، موزاییکی از ۸ طرح واقعی گالری نشان می‌دهد (لینک به graphics.html).

## v96–v97
- v96: کارت درباره (عکس + ۳ چیپ) در صفحهٔ اول (aboutPic در fx2.js)
- v97: نوار «پروژه‌ای در ذهن داری؟» بالای فوتر (app.js + fx2.css). تست با mock.
- v98: لایهٔ زندهٔ طراحی fx3.js/fx3.css: نوار پیشرفت اسکرول، پس‌زمینهٔ aurora، نور دنبال‌کنندهٔ ماوس، شکل‌های شناور با پارالاکس، ظاهر شدن کلمه‌به‌کلمهٔ عنوان‌ها، درخشش و ریپل دکمه‌ها، زیرخط منو. با «کاهش حرکت» یا حالت lite خاموش می‌شود.
- v99: منوی بزرگ (mega) با توضیح زیر هر مورد، نوار اعتماد در هیرو (۸۴ طرح/۴۴ گواهی/…)، عکس گرد در هیروی موبایل، دکمهٔ چت بالاتر از داک، دکمهٔ تماس داک موبایل دیده می‌شود.
- v100: روبان‌های متحرک، متن غول‌پیکر با اسکرول، View Transition بین صفحه‌ها، ظاهر شدن عنوان با اسکرول (fx3).
- v101: هیدر (خط رنگی/سایه)، فوتر (موج + CINECODE بزرگ)، چیپ‌های شناور هیرو، دکمه با فلش، افکت هاور پورتفولیو، مکان‌نمای حلقه‌ای.
- v102: بخش ترمینال تایپ‌شونده + کلاکت متحرک + ساعت زندهٔ کابل (id=term)، حلقهٔ پیشرفت اسکرول روی دکمهٔ بالا.
- v103: الگوهای پس‌زمینهٔ ۴ نوع در بخش‌ها، آیکن متحرک کنار هر عنوان، نوار فیلم کنار صفحه (دسکتاپ)، بلاب متحرک پشت عکس، حاشیهٔ چرخان کارت‌ها.
- v104: بخش stk کارت‌های چسبندهٔ روی‌هم (۴ دستهٔ گرافیک)، هیرو با اسکرول جابه‌جا و محو می‌شود، افشای clip-path تصاویر موزاییک. (بر پایهٔ تحقیق: sticky stacking، pinned hero، clip-mask reveal.)
- v105: بخش story (id=story): سه کلمهٔ غول‌پیکر فیلم/گرافیک/کد با اسکرول پین‌شده (تحقیق: oversized type + scroll-driven storytelling).
- v106: فوتر حرفه‌ای (ستون‌های شیشه‌ای + آیکن متحرک برای هر لینک + شبکه‌های اجتماعی با حرکت)، آیکن‌های متحرک سراسری، چیپ‌های شناور هیروی آکادمی.
- v107: کاور رنگی متحرک با آیکن موضوع برای کارت دوره‌ها (covers در fx3)، دکمه‌های اصلی گرادیانی با درخشش، دکمهٔ ثانویه با حلقهٔ هاور.
- v108: ریتم صفحه: بخش‌های تیره تمام‌عرض (numbers/process/story/term)، فاصله‌های منظم، شمارنده‌های بزرگ‌تر، story کوتاه‌تر (240vh). بر پایهٔ اسکرین‌شات کل صفحهٔ زندهٔ مالک.
- v109: مالک «ریتم روشن/تیره» را انتخاب کرد (گزینهٔ ۲). ترتیب: story بعد از stk تا دو بخش تیره کنار هم نباشند.
- v110: جهت سینمایی تیره (از تصویر مرجع مالک): تم تیره پیش‌فرض، پالت #080D20/#805CFF/#12C8C0، بخش uni «سه جهان. یک دیدگاه.» (فناوری/فیلم/طراحی)، عنوان‌های شماره‌دار eyb، doors مخفی. نکته: آمار تصویر مرجع (50+ پروژه، 10K+ دانشجو، 20 کشور، 98٪) ساختگی است و استفاده نشد. showreel خالی است (data/content.js showreel) پس دکمهٔ Watch Showreel نیامد. خبرنامه/Terms صفحه‌ای ندارند، ساخته نشد.

## v111–v116: بازسازی بر اساس تصویر مرجع و پرامپت مالک (CineCode Academy & Creative Studio)
- cine.js/cine.css (فقط index.html): hero2، uni، proj، acad، proc2، founder، cta2، فوتر (برند + خبرنامه). بخش‌های قدیمی صفحهٔ اول با CSS پنهان شدند (حذف نشدند). برای برگرداندن: در cine.css اولین بلوک display:none را پاک کن.
- هدر جدید: Home، Academy▾، Creative Studio▾، Portfolio، About، Journal، Contact + Student Portal (app.js buildChrome). dock دسکتاپ مخفی.
- تم تیره پیش‌فرض با پالت مرجع.
- خبرنامه: HANDOFF/cms-10.sql را در Supabase اجرا کن (جدول newsletter_subscribers، فقط insert برای عموم، خواندن فقط super_admin).
- عمداً نیامد: آمار تصویر مرجع (50+/10K+/20/98٪) و نظر/عکس دانشجوی ساختگی؛ Terms of Service (صفحه ندارد)؛ GSAP/Three.js (CSP)؛ دکمهٔ Watch Showreel تا وقتی showreel در data/content.js پر نشده به reels.html می‌رود.
- v117/v118: چیدمان بنیان‌گذار (عکس | نام و متن)، جای شعار در RTL، ستون‌های فوتر بدون شکست خط.
- v119: صفحهٔ terms.html (پیش‌نویس، باید مالک/حقوق‌دان بخواند)، لینک فوتر، JSON-LD EducationalOrganization، هدر صفحه‌های داخلی به سبک مرجع.
- v120: round favicon (svg+png), promo images assets/promo/, og.png, mobile dock icons/CTA fixes
- v121: mobile calm mode (no blur/parallax/endless anim), --sp no longer on root, footer regrouped + compact contact
- v122: removed spinning dashed rings + drifting shapes (flicker)
- v123: no scroll-triggered hiding, solid header, no page-transition fade
- v124: numbers strip static (no count-up)
- v125: removed pulsing buttons, bouncing heading icons, floating svgs (laptop flicker)
- v126: Motion Bio video section on home (assets/video/bio.mp4), digital card page card.html (vCard + QR via qr.js), footer link
- v127: heading words always visible (fx-w), counters off (no zero flash), dark academy/course blocks
- v128: project brief wizard (brief.js, WhatsApp/email/copy), captions for bio video (bio-fa.vtt), install-app button
- v129: cinema mode + shortcuts (cinema.js), kiosk.html exhibition loop (video+works+QR)
- v130: 3D gallery ring on home (ring.js); a11y axe 0 violations on index/academy/card
- v131: English motion bio (bio-en.mp4 + vtt), language switch in player, videos 720p, kiosk uses lang video

- v132: CineCode Lab (lab.html, lab.js, lab.css): colour grade, poster studio, colour search of works, learning-path card. Client-side only. Needs real-device test.
- v133: Lab tab 5 Reel maker (canvas video + synthesized music, WebM via MediaRecorder).
- v134: Lab tabs 6-7 Composition coach (pixel maths) and Kinetic type (WebM).
- v135: home teaser section #labt linking to Lab tools.
- v136: Lab tabs 8-10 (vision/contrast, subtitles, storyboard) + .cube LUT export in grade; teaser has 10 cards.
- v137: logo ratio fix (mobile), light theme white header/footer, scroll-driven .rv/.sh animations + infinite decorative animations removed, header contact QR (#hqBtn), certs.js: per-network share texts + share image PNG + official verification statement (attest), course page cert info block, share on own certificates dialog.
- v138: header QR dialog has site share buttons; search index includes Lab tools and extra pages.
- v139: accessibility panel (a11y.js, footer button, Alt+0): text size, contrast, spacing, underline, stop motion, grayscale, plain font.
- v140: WCAG AA contrast fixes (axe clean on lab, course, index, verify in both themes).
- v141: works lightbox: per-work deep link (works.html?w=ID), copy link, WhatsApp/Telegram share, download, swipe, neighbour preload.
- v142: cert share panel shows for samples too, brand-badge pro buttons, native image share (Web Share files), readable textarea.
- v143: reels page shows the two motion-bio videos with captions + follows site language. Audit: blog.html is empty (no posts), reels YouTube list empty, project/notes/activity thin: need real content from owner.
- v144: bigger logo (desktop 52px/mobile ~138px, header container wider), Lab tabs 11-12 (lower thirds WebM, case study sheet), private study.html planner (noindex, localStorage, not in nav/sitemap) from owner docx guide; no personal data from docx published.
- v145: FOUND flicker root cause: cine.js reorder() vs fx2 layout() fought over #numbers, re-rendering main ~3x/s. Removed. Also static hero slogan/REC timecode, observers de-churned.
- v146: Lab tabs 13-14 (film calculators: timecode/size/resize/shutter; motion easing designer with cubic-bezier copy). Teaser + search updated (14 tools).
- v147: Lab tabs 15-16 (quote sheet PNG, brand starter kit card). 16 tools.
- v148: Lab tabs 17-18 (social safe-zone templates, shot list PNG/CSV). 18 tools.
- v149: Lab tabs 19-20 (proposal writer, 30-day content calendar); mobile tab strip scrolls horizontally. 20 tools.
- v150: services.html expanded (servicesx.js: what you get x6, what I need, delivery, FAQ, brief wizard button). No prices/timelines invented.
- v151: social.html (all socials + QR), social.js follow blocks (home/blog/services/works) + share bar under blog posts, Lab tabs 21-23 (caption maker, social image sizes, email signature). 23 tools.
- v152: reels page lists real YouTube playlists + follow block (social.js).
- v153: polish layer (hover lift, selection, focus ring, text-wrap balance); Lab teaser shows 8 + see-all card.
- v154: press kit short bio now real (owner's own about text, 54 words). Full bio still needs owner.
- v155: Lower thirds tool: 3 new styles (news bar, corner bug, centre title card).
- v156: stat tiles with zero are hidden (toolkit/timeline/directory).
- v157: empty notes/activity/blog pages show 'while you wait' links + follow block; removed developer-facing text (data/content.js) from public notes page.
- v158: 24 generated promo images (6 themes x fa/en x post/story) in assets/promo; also sent as promo-images.zip.
- v159: designx.js on services.html: 7 graphic-design service cards, filterable gallery from SITE.gallery (+lightbox), quick order form (WhatsApp/email/copy). No business-card category exists in gallery data.
- v160: designx.js now 4 tabs x 4 = 16 graphic/print/digital/cinema+AI services; 'View samples' jumps to gallery filter, 'Order' preselects optgroup select in quick order form.
- v161: home teaser #gsvc (graphic design and advertising, 4 groups) linking to services.html#dx.
- v162: JSON-LD ItemList of 16 services in services.html.
- v163: Lab tab 24 print size/DPI/bleed calculator (24 tools); lab promo images updated to 24.
- v164: REBRAND to the docx brand palette (Primary Navy #102B55, Deep Navy #07172D, Blue #39A9E8, Silver #D8E1EA): all purple/teal/pink replaced across css/js/html via rebrand.py; axe contrast clean (12 pages x dark/light); no horizontal overflow at 320/375/430/768 on 22 pages. Backup of purple v163 kept by owner zip.


## v165 (redesign phase 1)
- Header: Home | Academy▾ | Courses | Works▾ | About | Contact; Sign in + Start learning (auth.html#register); mobile = logo + theme + search + hamburger; full-screen drawer in assets/js/nav2.js (Escape, focus trap, scroll lock, closes on link). Dock hidden below 1000px.
- Footer: brand (cine.js) | Academy | Explore | Get in touch + newsletter; legal bar has Privacy, Terms, FAQ, Feedback.
- New pages: contact.html, faq.html, feedback.html (form logic = setupForm(), Web3Forms public key + Supabase RPC, honeypot, busy guard).
- Fixed: slider prev button id "sp" clashed with progress bar id.
- Known: INP not measured; cold-load desktop home CLS ~0.10 once (main shifts 128px early); example.com placeholders remain; Pashto copy for new strings unreviewed.

## v166
- Domain: example.com replaced with https://delicate-frost-e2d6.cinecode.workers.dev everywhere (canonical, OG, sitemap, robots). Change later: bash tools/set-domain.sh https://new-domain
- CLS fix: the top "Preview/sample" note was shown then moved to the footer (fx2 tidyNote) and the home hero was laid out in two passes. Now body>#note is hidden and home #top stays invisible until html.fx-ready (fallback 2.5 s). Cold-load CLS 0.104 -> 0.006.
- Works page: first 24 images + "Show more", 2 columns on phones, follow-me block no longer duplicated.
- Footer: brand + Academy + Explore + Get in touch (classes ft-aca/ft-exp/ft-con), works on every page.
- Hero decoration chips (.hchip3, .dec) only on the home page. Course ticker now static.
- _headers: js/css/data no-cache (were immutable for a year); fonts immutable; img 1 day.
- Not in this repo: Brevo / Cloudflare Worker (contact form uses Web3Forms public key + Supabase RPC).

## v184
- ورود با Google و GitHub: دکمه‌ها در auth.html (authorize با implicit flow؛ همان کنترل‌کنندهٔ #access_token). پیام بارگذاری/لغو/خطا، حالت bfcache. باید توسط مالک در Supabase/Google/GitHub تنظیم شود: HANDOFF/OAUTH_SETUP_FA.md. تست با mock (مسیر authorize رهگیری شد)، ورود واقعی تست نشده.
- ایمیل: amobariz383 اصلی، ansarulhaq.af دوم (هر دو مال مالک)؛ JSON-LD در classic.html یک‌دست شد.

## v185
- ادمین «پورتفولیو: پروژه، پست و مقاله» (adportfolio.js، کلید design.portfolio). پروژه‌ها وضعیت «در حال انجام» دارند و در portfolio.html زیر عنوان جدا می‌آیند. مخفی/ترتیب/ویرایش/حذف. به data/portfolio.js اضافه می‌شود، جایگزین نمی‌شود. نیاز: cms-6.sql.
- رویدادها و وبینار: events.html + events.js، ادمین adevents.js (design.events). ثبت‌نام با واتساپ/ایمیل، لینک ورود، افزودن به تقویم (.ics، وقت کابل). در sitemap و لینک «آکادمی» فوتر.
- عمداً نشد: 2FA مدیر (بدون اجرای سمت سرور فقط ظاهری است و خطر قفل‌شدن مالک دارد؛ در عوض 2FA را روی خود حساب Gmail/GitHub روشن کن). Turnstile: منتظر کلید عمومی.
- همه با بررسی نحو (node --check) و بدون آزمایش مرورگر؛ مالک خودش امتحان می‌کند.

## v186
- پرسش و پاسخ در صفحهٔ دوره (qa.js): دانشجوی ثبت‌نام‌شده سؤال می‌پرسد (کل دوره یا یک درس)، پاسخ مدیر دیده می‌شود، حذف سؤال خود. مدیر در ادمین «پرسش و پاسخ دوره‌ها» (adqa.js) پاسخ می‌دهد/مخفی/حذف می‌کند. نیاز: HANDOFF/cms-13-qa.sql در Supabase. آزمایش مرورگر و دیتابیس واقعی نشده.
- هنوز نشده: اعلان به دانشجو هنگام پاسخ (ستون‌های notifications معلوم نیست)، انجمن عمومی بین دوره‌ها.

## v187
- اعلان زنگ برای دانشجو وقتی سؤالش پاسخ داده شد: HANDOFF/cms-14-qa-notify.sql (تریگر؛ اگر ستون‌های notifications فرق داشته باشد بی‌صدا رد می‌شود) + متن در notify.js. رویدادها در جستجوی سایت.
