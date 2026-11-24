/* Premium course certificates: 5 templates, 3 kinds, QR + Code128 barcode, signature, Coursera-style share text,
   and a public showcase slider. Used by verify.html (real), course.html (SAMPLE), academy/home (showcase).
   A completion certificate, not a university degree. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { cert: "گواهی پایان دوره", k_done: "گواهی‌نامهٔ پایان دوره", k_exc: "گواهی تقدیر و برتری", k_part: "گواهی شرکت در دوره",
      given: "با افتخار تقدیم می‌گردد به", done: "برای گذراندن موفق دورهٔ", d_exc: "برای کسب موفقیت درخشان در دورهٔ", d_part: "برای شرکت فعال در دورهٔ", a_done: "که با پشتکار و کنجکاوی، مسیر یادگیری این دوره را تا پایان پیمود و مهارت‌های آن را به‌کار گرفت.", a_exc: "که با تلاش و پشتکاری ستودنی در این دوره درخشید و شایستهٔ تقدیر است.", a_part: "که با حضور فعال و همراهی صمیمانه در این دوره، سهمی ارزشمند داشت.", on: "تاریخ صدور", code: "کد گواهی", st: "وضعیت", valid: "معتبر", revoked: "باطل شده", scan: "برای تأیید، QR را بخوان", bar: "شناسهٔ بارکد",
      note: "این گواهی پایان دوره آموزشی آکادمی سینه‌کد است و مدرک دانشگاهی نیست.", sign: "بنیان‌گذار و مدرس", sample: "نمونه · این گواهی واقعی نیست", print: "چاپ", pdf: "دانلود فایل PDF", pdfw: "در حال ساخت PDF…", pdfe: "ساخت PDF نشد. از دکمهٔ چاپ استفاده کن.",
      share: "اشتراک‌گذاری", copy: "کپی لینک", copied: "کپی شد", li: "لینکدین (افزودن به پروفایل)", lif: "لینکدین (پست)", fb: "فیسبوک", x: "ایکس (X)", wa: "واتس‌اپ", tg: "تلگرام", em: "ایمیل", more: "بیشتر…",
      tpl: "طرح گواهی", t1: "کلاسیک", t2: "مدرن", t3: "سینمایی", t4: "سلطنتی", t5: "تکنو", t6: "آکادمیک", t7: "استودیو", t8: "مینیمال", seal: "تأیید‌شده",
      stxt: "پیام آمادهٔ اشتراک (می‌توانی ویرایش کنی)", mk: "من دورهٔ «%c» را در آکادمی سینه‌کد با موفقیت به پایان رساندم! 🎓\nشناسهٔ گواهی: %id\nتأیید گواهی: %u\n#سینه‌کد #آموزش #برنامه‌نویسی #سینما #طراحی",
      sc_t: "نمونهٔ گواهی‌ها", sc_h: "گواهی‌هایی که می‌گیری", sc_p: "هر گواهی کد یکتا، QR، بارکد و امضای رسمی دارد و با یک کلیک در لینکدین و شبکه‌های دیگر به اشتراک گذاشته می‌شود. همهٔ نمونه‌ها «نمونه» هستند و واقعی نیستند.",
      prev: "قبلی", next: "بعدی", d1: "عاج و طلا؛ رسمی و کلاسیک", d2: "سفید و بنفش؛ تمیز و امروزی", d3: "تیره و فیروزه‌ای؛ سینمایی", d4: "سرمه‌ای و طلایی؛ باشکوه", d5: "شبکهٔ کد؛ مخصوص برنامه‌نویسی", d6: "سبز زمردی؛ دانشگاهی و رسمی", d7: "رنگ‌های گرم و پوستری؛ برای هنر و طراحی", d8: "سفید و خطی؛ ساده و تمیز", nm: "نام دانشجو (نمونه)", cn: "نام دوره (نمونه)", dt: "۱۴۰۵/۰۸/۱۷" },
    en: { cert: "Course completion certificate", k_done: "Certificate of Completion", k_exc: "Certificate of Excellence", k_part: "Certificate of Participation",
      given: "This certificate is proudly presented to", done: "in recognition of successfully completing the course", d_exc: "in recognition of outstanding achievement in the course", d_part: "in recognition of active participation in the course", a_done: "who followed the course through to the end with dedication and curiosity, and put its skills to work.", a_exc: "whose effort and perseverance in this course were truly commendable.", a_part: "whose active presence and engagement made a real contribution to this course.", on: "Issued", code: "Certificate code", st: "Status", valid: "Valid", revoked: "Revoked", scan: "Scan the QR to verify", bar: "Barcode ID",
      note: "This is a course completion certificate from CineCode Academy. It is not a university degree.", sign: "Founder & Instructor", sample: "SAMPLE · not a real certificate", print: "Print", pdf: "Download PDF file", pdfw: "Building PDF…", pdfe: "Could not build the PDF. Use the Print button.",
      share: "Share", copy: "Copy link", copied: "Copied", li: "LinkedIn (add to profile)", lif: "LinkedIn (post)", fb: "Facebook", x: "X", wa: "WhatsApp", tg: "Telegram", em: "Email", more: "More…",
      tpl: "Certificate style", t1: "Classic", t2: "Modern", t3: "Cinematic", t4: "Royal", t5: "Tech", t6: "Scholar", t7: "Studio", t8: "Minimal", seal: "Verified",
      stxt: "Ready-made post (you can edit it)", mk: "I just completed “%c” at CineCode Academy! 🎓\nCertificate ID: %id\nVerify it here: %u\n#CineCode #Learning #Coding #Cinema #Design",
      sc_t: "Certificate samples", sc_h: "The certificates you earn", sc_p: "Every certificate has a unique code, a QR, a barcode and an official signature, and can be shared to LinkedIn and other networks in one click. All samples are marked SAMPLE and are not real.",
      prev: "Previous", next: "Next", d1: "Ivory & gold; formal and classic", d2: "White & purple; clean and modern", d3: "Dark & cyan; cinematic", d4: "Navy & gold; grand", d5: "Code grid; made for developers", d6: "Emerald green; academic and formal", d7: "Warm poster colours; for art and design", d8: "White and linear; simple and clean", nm: "Student Name (sample)", cn: "Course name (sample)", dt: "17 Nov 2026" }
  };
  var TPL = ["classic", "modern", "cinema", "royal", "tech", "scholar", "studio", "minimal"], KIND = ["done", "exc", "part"];
  /* v179: each course gets its own default design (stable hash of the course name); a student's explicit choice is remembered per course */
  function hsh(x) { var h = 0, i; x = String(x || ""); for (i = 0; i < x.length; i++) h = (h * 31 + x.charCodeAt(i)) >>> 0; return h; }
  function pick(o) { try { var m = JSON.parse(localStorage.getItem("am-ctpl2") || "{}") || {}, k = o && o.course ? String(o.course) : ""; if (k && TPL.indexOf(m[k]) >= 0) return m[k]; if (k) return TPL[hsh(k) % TPL.length]; var d = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).cert_tpl; return TPL.indexOf(d) >= 0 ? d : "classic"; } catch (e) { return "classic"; } }
  function tpl(o) { return pick(o); }
  function setTpl(t, o) { try { var m = JSON.parse(localStorage.getItem("am-ctpl2") || "{}") || {}, k = o && o.course ? String(o.course) : "_"; m[k] = t; localStorage.setItem("am-ctpl2", JSON.stringify(m)); } catch (e) {} }

  /* ---------- Code128-B barcode (SVG) ---------- */
  var C128 = "11011001100,11001101100,11001100110,10010011000,10010001100,10001001100,10011001000,10011000100,10001100100,11001001000,11001000100,11000100100,10110011100,10011011100,10011001110,10111001100,10011101100,10011100110,11001110010,11001011100,11001001110,11011100100,11001110100,11101101110,11101001100,11100101100,11100100110,11101100100,11100110100,11100110010,11011011000,11011000110,11000110110,10100011000,10001011000,10001000110,10110001000,10001101000,10001100010,11010001000,11000101000,11000100010,10110111000,10110001110,10001101110,10111011000,10111000110,10001110110,11101110110,11010001110,11000101110,11011101000,11011100010,11011101110,11101011000,11101000110,11100010110,11101101000,11101100010,11100011010,11101111010,11001000010,11110001010,10100110000,10100001100,10010110000,10010000110,10000101100,10000100110,10110010000,10110000100,10011010000,10011000010,10000110100,10000110010,11000010010,11001010000,11110111010,11000010100,10001111010,10100111100,10010111100,10010011110,10111100100,10011110100,10011110010,11110100100,11110010100,11110010010,11011011110,11011110110,11110110110,10101111000,10100011110,10001011110,10111101000,10111100010,11110101000,11110100010,10111011110,10111101110,11101011110,11110101110,11010000100,11010010000,11010011100".split(",");
  function barcode(txt) {
    var s = String(txt || "").replace(/[^\x20-\x7E]/g, "").slice(0, 28) || "CCA", v = [104], sum = 104, i;
    for (i = 0; i < s.length; i++) { var c = s.charCodeAt(i) - 32; v.push(c); sum += c * (i + 1); }
    v.push(sum % 103); var bits = v.map(function (k) { return C128[k]; }).join("") + "1100011101011", x = 0, rects = "";
    while (x < bits.length) { if (bits[x] === "1") { var w = 1; while (bits[x + w] === "1") w++; rects += '<rect x="' + x + '" y="0" width="' + w + '" height="40"/>'; x += w; } else x++; }
    return '<svg viewBox="0 0 ' + bits.length + ' 40" preserveAspectRatio="none" fill="currentColor" role="img" aria-label="barcode ' + esc(s) + '">' + rects + '</svg>';
  }

  /* ---------- hand-drawn style signature (SVG strokes) ---------- */
  var SIG = '<svg class="pc-sgs" viewBox="0 0 220 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2.6" d="M8 44c10-26 20-34 26-30 7 5-12 36-6 38 8 2 20-26 30-26 7 0 0 18 6 18 8 0 12-12 20-12 6 0 2 10 8 10 9 0 14-10 24-10 8 0 2 12 10 12 10 0 14-14 26-14"/><path stroke-width="1.6" d="M16 54c40-6 120-8 196-2"/><path stroke-width="1.4" d="M150 18c10-8 22-10 34-6"/></svg>';
  var SEAL = '<svg viewBox="0 0 100 100" width="84" height="84"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/><path d="M50 22l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="currentColor"/><path d="M34 74h32" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* v182: every template has its own icon + seal (Lucide, stroke 1.75) */
  var TI = {
    classic: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    modern: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
    cinema: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    royal: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5.5 21h13"/>',
    tech: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    scholar: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    studio: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',
    minimal: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>'
  };
  var KI = { done: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>', exc: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>', part: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' };
  function ico(path, n) { return '<svg viewBox="0 0 24 24" width="' + n + '" height="' + n + '" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + path + '</svg>'; }
  function sealFor(t) { return '<svg viewBox="0 0 100 100" width="84" height="84" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/><g transform="translate(30 30) scale(1.67)" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (TI[t] || TI.classic) + '</g></svg>'; }
  var ORN = '<i class="pc-o a"></i><i class="pc-o b"></i><i class="pc-o c"></i><i class="pc-o d"></i>';

  /* brand icons for share buttons (Lucide strokes; X mark filled) */
  var BR = {
    li: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    wa: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9 9.5c.4 1.6 2 3.6 4.5 4.5l1.2-1.2 1.8.6v1.6c-3.4.8-8-3.4-7.5-7z"/>',
    tg: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    em: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>'
  };
  BR.lif = BR.li;
  function brand(k) {
    if (k === "x") return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
    return BR[k] ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + BR[k] + '</svg>' : "";
  }

  function ds() { try { return JSON.parse(localStorage.getItem("am-design") || "{}") || {}; } catch (e) { return {}; } }
  function sigImg(u) { var b = (window.SITE && window.SITE.supabaseUrl || "").replace(/\/$/, ""); return b && typeof u === "string" && u.indexOf(b + "/storage/v1/object/public/media/") === 0 ? u : ""; }

  function html(o) {
    var D = ds(), lg = o.lang === "fa" ? "fa" : "en";
    var L = T[o.lang === "fa" ? "fa" : "en"], t = TPL.indexOf(o.tpl) >= 0 ? o.tpl : "classic", ok = o.ok !== false, kd = KIND.indexOf(o.kind) >= 0 ? o.kind : "done";
    return '<article class="pc pc-' + t + (ok ? "" : " bad") + (o.sample ? " is-sample" : "") + '" dir="' + (o.lang === "fa" ? "rtl" : "ltr") + '" lang="' + (o.lang === "fa" ? "fa" : "en") + '">' +
      '<div class="pc-frame"><div class="pc-in">' + ORN +
      (o.sample ? '<p class="pc-wm" aria-hidden="true">' + esc(L.sample.split(" · ")[0]) + '</p>' : "") +
      '<img class="pc-logo" src="assets/img/logo-full.png" width="260" height="67" alt="CineCode Academy">' +
      '<p class="pc-ic" aria-hidden="true"><span class="pc-ib">' + ico(TI[t] || TI.classic, 26) + '</span></p><p class="pc-k"><span class="pc-ki" aria-hidden="true">' + ico(KI[kd], 15) + '</span>' + esc(L["k_" + kd]) + '</p>' +
      '<p class="pc-g">' + esc(L.given) + '</p><h2 class="pc-n" dir="auto">' + esc(o.name) + '</h2>' +
      '<p class="pc-g">' + esc(kd === "exc" ? L.d_exc : kd === "part" ? L.d_part : L.done) + '</p><h3 class="pc-c" dir="auto">' + esc(o.course) + '</h3><p class="pc-g pc-aw">' + esc(L["a_" + kd]) + '</p>' +
      '<div class="pc-row"><div class="pc-sig">' + (sigImg(D.cert_sig) ? '<img class="pc-sgi" src="' + esc(sigImg(D.cert_sig)) + '" alt="" width="170" height="60">' : SIG) + '<span class="pc-sg" dir="ltr">' + esc(D.cert_signer || "Ansarulhaq Mubarez") + '</span><span class="pc-sl">' + esc((D.cert_signer ? D.cert_signer + " · " : "") + (D["cert_title_" + lg] || L.sign)) + '</span></div>' +
      '<div class="pc-seal" aria-hidden="true">' + sealFor(t) + '<span>' + esc(L.seal) + '</span></div>' +
      '<div class="pc-qr"><div class="pc-qrb" role="img" aria-label="QR" dir="ltr" data-url="' + esc(o.url || "") + '"></div><span>' + esc(L.scan) + '</span></div></div>' +
      '<dl class="pc-m"><div><dt>' + esc(L.on) + '</dt><dd>' + esc(o.date) + '</dd></div><div><dt>' + esc(L.code) + '</dt><dd dir="ltr">' + esc(o.code) + '</dd></div><div><dt>' + esc(L.st) + '</dt><dd><b class="pc-st">' + esc(ok ? L.valid : L.revoked) + '</b></dd></div></dl>' +
      '<div class="pc-bc" dir="ltr">' + barcode(o.code) + '<span>' + esc(o.code) + '</span></div>' +
      '<p class="pc-note">' + esc(D["cert_note_" + lg] || L.note) + '</p>' +
      (o.sample ? '<p class="pc-sample">' + esc(L.sample) + '</p>' : "") +
      '</div></div></article>';
  }

  /* ---------- share: Coursera-style ready text + links ---------- */
  function shareText(o) { var L = T[o.lang === "fa" ? "fa" : "en"]; return L.mk.replace("%c", o.course || "").replace("%id", o.code || "").replace("%u", o.url || ""); }
  function links(o, txt) {
    var u = encodeURIComponent(o.url || ""), t = encodeURIComponent(txt), tp = function (k) { return encodeURIComponent((o._t && o._t[k]) || ptxt(o, k)); }, d = new Date(o.iso || o.date), ok = !isNaN(d.getTime()), L = T[o.lang === "fa" ? "fa" : "en"];
    var li = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=" + encodeURIComponent(o.course || "") + "&organizationName=" + encodeURIComponent("CineCode Academy") + (ok ? "&issueYear=" + d.getFullYear() + "&issueMonth=" + (d.getMonth() + 1) : "") + "&certUrl=" + u + "&certId=" + encodeURIComponent(o.code || "");
    return [["li", L.li, li], ["lif", L.lif, "https://www.linkedin.com/sharing/share-offsite/?url=" + u],
      ["fb", L.fb, "https://www.facebook.com/sharer/sharer.php?u=" + u + "&quote=" + tp("fb")], ["x", L.x, "https://twitter.com/intent/tweet?text=" + tp("x")],
      ["wa", L.wa, "https://wa.me/?text=" + tp("wa")], ["tg", L.tg, "https://t.me/share/url?url=" + u + "&text=" + tp("tg")], ["em", L.em, "mailto:?subject=" + encodeURIComponent(o.course || "") + "&body=" + tp("em")]];
  }

  /* ---------- v137: platform-specific share texts, share image, verification statement ---------- */
  var PL = ["li", "x", "wa", "tg", "fb", "ig", "em"];
  var PN = { fa: { li: "لینکدین", x: "ایکس (X)", wa: "واتساپ", tg: "تلگرام", fb: "فیسبوک", ig: "اینستاگرام", em: "ایمیل" }, en: { li: "LinkedIn", x: "X", wa: "WhatsApp", tg: "Telegram", fb: "Facebook", ig: "Instagram", em: "Email" } };
  function ptxt(o, k) {
    var fa = o.lang === "fa", c = o.course || "", id = o.code || "", u = o.url || "", n = o.name || "";
    var F = { li: "با افتخار اعلام می‌کنم که دورهٔ «" + c + "» را در آکادمی سینه‌کد با موفقیت به پایان رساندم.\nشناسهٔ گواهی: " + id + "\nتأیید اعتبار: " + u + "\n\nممنون از آموزگار و تیم آکادمی. به‌زودی با پروژه‌های بیشتر برمی‌گردم.\n#CineCode #یادگیری #مهارت",
      x: "دورهٔ «" + c + "» را در آکادمی سینه‌کد تمام کردم 🎓\nشناسه: " + id + "\n" + u + "\n#CineCode",
      wa: "سلام 👋 دورهٔ «" + c + "» را در آکادمی سینه‌کد تمام کردم و گواهی‌ام را گرفتم 🎓\nکد گواهی: " + id + "\nمی‌توانی خودت درستی‌اش را ببینی:\n" + u,
      tg: "🎓 گواهی پایان دورهٔ «" + c + "»\n🔖 کد: " + id + "\n✅ تأیید آنلاین: " + u + "\n🏫 آکادمی سینه‌کد",
      fb: "یک قدم دیگر در مسیر یادگیری! 🎬💻 دورهٔ «" + c + "» را در آکادمی سینه‌کد به پایان رساندم.\nکد گواهی: " + id + "\nدرستی گواهی را اینجا ببین: " + u,
      ig: "🎓 دورهٔ «" + c + "» تمام شد!\nکد گواهی: " + id + "\nلینک تأیید در بیو یا کامنت اول.\n.\n#سینه‌کد #CineCode #آموزش #فیلم #برنامه‌نویسی #طراحی #افغانستان",
      em: "سلام،\n\nمی‌خواهم خبر بدهم که دورهٔ «" + c + "» را در آکادمی سینه‌کد با موفقیت به پایان رساندم. کد گواهی من " + id + " است و از این نشانی قابل تأیید است:\n" + u + "\n\nبا احترام،\n" + n };
    var E = { li: "I'm proud to share that I completed “" + c + "” at CineCode Academy.\nCertificate ID: " + id + "\nVerify it here: " + u + "\n\nThank you to the instructor and the academy team. More projects coming soon.\n#CineCode #Learning #Skills",
      x: "Just finished “" + c + "” at CineCode Academy 🎓\nID: " + id + "\n" + u + "\n#CineCode",
      wa: "Hey 👋 I finished “" + c + "” at CineCode Academy and got my certificate 🎓\nCertificate ID: " + id + "\nYou can check it is real here:\n" + u,
      tg: "🎓 Certificate of completion: “" + c + "”\n🔖 ID: " + id + "\n✅ Verify online: " + u + "\n🏫 CineCode Academy",
      fb: "One more step on my learning path! 🎬💻 I completed “" + c + "” at CineCode Academy.\nCertificate ID: " + id + "\nSee that it is real: " + u,
      ig: "🎓 “" + c + "” complete!\nCertificate ID: " + id + "\nVerification link in bio / first comment.\n.\n#CineCode #Learning #Film #Coding #Design #Afghanistan",
      em: "Hello,\n\nI am happy to share that I completed “" + c + "” at CineCode Academy. My certificate ID is " + id + " and it can be verified here:\n" + u + "\n\nBest regards,\n" + n };
    return (fa ? F : E)[k] || "";
  }
  function dates(o) {
    var now = new Date(), fa = o.lang === "fa", out = { wd: "", sol: "", gre: "", time: "" };
    try { out.wd = new Intl.DateTimeFormat(fa ? "fa-AF" : "en-GB", { weekday: "long" }).format(now); } catch (e) {}
    try { out.sol = new Intl.DateTimeFormat(fa ? "fa-AF-u-ca-persian" : "en-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(now); } catch (e) {}
    try { out.gre = new Intl.DateTimeFormat(fa ? "fa-AF-u-ca-gregory" : "en-GB", { year: "numeric", month: "long", day: "numeric" }).format(now); } catch (e) {}
    try { out.time = new Intl.DateTimeFormat(fa ? "fa-AF" : "en-GB", { hour: "2-digit", minute: "2-digit" }).format(now); } catch (e) {}
    return out;
  }
  function attest(o) {
    var fa = o.lang === "fa", D = dates(o), t = TPL.indexOf(o.tpl) >= 0 ? o.tpl : "classic", ymd = new Date().toISOString().slice(0, 10).replace(/-/g, ""), ref = "VS-" + String(o.code || "SAMPLE").replace(/[^\w-]/g, "") + "-" + ymd;
    var X = fa ? { h: "تصدیق‌نامهٔ اعتبار گواهی", sub: "آکادمی سینه‌کد · سامانهٔ تأیید گواهی", ref: "شمارهٔ تصدیق", body: "آکادمی سینه‌کد تصدیق می‌کند که گواهی پایان دوره با کد <b dir=\"ltr\">%code</b> به نام <b>%name</b> برای دورهٔ «<b>%course</b>» در تاریخ <b>%date</b> صادر شده است و در روز <b>%wd</b> مورخ <b>%sol</b> (%gre) ساعت %time در سامانهٔ رسمی تأیید، <b>معتبر و فعال</b> بود.", f1: "نام دارندهٔ گواهی", f2: "نام دوره", f3: "کد گواهی", f4: "تاریخ صدور", f5: "زمان بررسی", f6: "وضعیت", valid: "معتبر", note: "این تصدیق‌نامه فقط وضعیت گواهی را در لحظهٔ بررسی تأیید می‌کند و مدرک دانشگاهی نیست. برای اطمینان دوباره، QR را اسکن کن.", sign: "بنیان‌گذار و مدرس", seal: "مهر آکادمی", sample: "نمونه · واقعی نیست", url: "نشانی تأیید" }
      : { h: "Certificate Verification Statement", sub: "CineCode Academy · Certificate verification service", ref: "Statement no.", body: "CineCode Academy confirms that the course completion certificate with code <b dir=\"ltr\">%code</b>, issued to <b>%name</b> for the course “<b>%course</b>” on <b>%date</b>, was found <b>valid and active</b> in the official verification service on <b>%wd</b>, %gre (Solar Hijri %sol) at %time.", f1: "Certificate holder", f2: "Course", f3: "Certificate code", f4: "Issue date", f5: "Checked at", f6: "Status", valid: "Valid", note: "This statement only confirms the status of the certificate at the moment it was checked. It is not a university degree. Scan the QR to check again.", sign: "Founder & Instructor", seal: "Academy seal", sample: "SAMPLE · not real", url: "Verify URL" };
    var body = X.body.replace("%code", esc(o.code)).replace("%name", esc(o.name)).replace("%course", esc(o.course)).replace("%date", esc(o.date)).replace("%wd", esc(D.wd)).replace("%sol", esc(D.sol)).replace("%gre", esc(D.gre)).replace("%time", esc(D.time));
    var Dd = ds();
    return '<article class="pc-at pc-at-' + t + (o.sample ? " is-sample" : "") + '" dir="' + (fa ? "rtl" : "ltr") + '" lang="' + (fa ? "fa" : "en") + '"><div class="pc-at-in">' +
      (o.sample ? '<p class="pc-wm" aria-hidden="true">' + esc(X.sample.split(" · ")[0]) + '</p>' : "") +
      '<header><img class="pc-logo" src="assets/img/logo-full.png" width="260" height="67" alt="CineCode Academy"><div><h2>' + esc(X.h) + '</h2><p>' + esc(X.sub) + '</p></div></header>' +
      '<p class="pc-at-ref"><span>' + esc(X.ref) + '</span> <b dir="ltr">' + esc(ref) + '</b></p><p class="pc-at-b">' + body + '</p>' +
      '<dl class="pc-at-m"><div><dt>' + esc(X.f1) + '</dt><dd dir="auto">' + esc(o.name) + '</dd></div><div><dt>' + esc(X.f2) + '</dt><dd dir="auto">' + esc(o.course) + '</dd></div><div><dt>' + esc(X.f3) + '</dt><dd dir="ltr">' + esc(o.code) + '</dd></div><div><dt>' + esc(X.f4) + '</dt><dd>' + esc(o.date) + '</dd></div><div><dt>' + esc(X.f5) + '</dt><dd>' + esc(D.wd + "، " + D.sol + " · " + D.time) + '</dd></div><div><dt>' + esc(X.f6) + '</dt><dd><b class="pc-st">' + esc(X.valid) + '</b></dd></div></dl>' +
      '<div class="pc-row"><div class="pc-sig">' + (sigImg(Dd.cert_sig) ? '<img class="pc-sgi" src="' + esc(sigImg(Dd.cert_sig)) + '" alt="" width="170" height="60">' : SIG) + '<span class="pc-sg" dir="ltr">' + esc(Dd.cert_signer || "Ansarulhaq Mubarez") + '</span><small>' + esc(X.sign) + '</small></div><div class="pc-seal" aria-hidden="true">' + SEAL + '<span>' + esc(X.seal) + '</span></div><div class="pc-qr"><div class="pc-qrb" role="img" aria-label="QR" dir="ltr" data-url="' + esc(o.url || "") + '"></div><span dir="ltr">' + esc(o.code || "") + '</span></div></div>' +
      '<div class="pc-bc" dir="ltr">' + barcode(ref) + '</div><p class="pc-at-n">' + esc(X.note) + '</p></div></article>';
  }
  function shareImage(o) {
    var fa = o.lang === "fa", W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H; var x = c.getContext("2d"), ff = fa ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"';
    var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#07172D"); g.addColorStop(1, "#102b55"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    var rg = x.createRadialGradient(W * .85, H * .1, 0, W * .85, H * .1, W * .8); rg.addColorStop(0, "rgba(124,203,243,.4)"); rg.addColorStop(1, "rgba(8,13,32,0)"); x.fillStyle = rg; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(244,243,248,.35)"; x.lineWidth = 3; x.strokeRect(40, 40, W - 80, H - 80);
    x.direction = fa ? "rtl" : "ltr"; x.textAlign = "center"; x.fillStyle = "#7CCBF3"; x.font = "700 38px " + ff; x.fillText(fa ? "گواهی پایان دوره · آکادمی سینه‌کد" : "COURSE COMPLETION · CINECODE ACADEMY", W / 2, 150);
    x.fillStyle = "#CBD7E6"; x.font = "500 40px " + ff; x.fillText(fa ? "این گواهی به" : "Awarded to", W / 2, 290);
    function wrap(t, size, w) { x.font = "900 " + size + "px " + ff; var ws = String(t).split(/\s+/), L = [], cur = ""; ws.forEach(function (q) { var tt = cur ? cur + " " + q : q; if (x.measureText(tt).width > w && cur) { L.push(cur); cur = q; } else cur = tt; }); L.push(cur); return L; }
    x.fillStyle = "#fff"; var nl = wrap(o.name || "", 110, W - 180); nl.slice(0, 2).forEach(function (l, i) { x.fillText(l, W / 2, 420 + i * 120); }); var y = 420 + Math.min(2, nl.length) * 120 + 20;
    x.fillStyle = "#CBD7E6"; x.font = "500 40px " + ff; x.fillText(fa ? "برای گذراندن موفق دوره" : "for successfully completing", W / 2, y + 30);
    x.fillStyle = "#39A9E8"; var cl = wrap(o.course || "", 76, W - 180); x.fillStyle = "#B7A2FF"; cl.slice(0, 3).forEach(function (l, i) { x.fillText(l, W / 2, y + 130 + i * 90); });
    var qy = H - 530, qs = 300; x.fillStyle = "#fff"; x.fillRect(W / 2 - qs / 2 - 14, qy - 14, qs + 28, qs + 28);
    try { var q = window.qrcode(0, "M"); q.addData(o.url || ""); q.make(); var n = q.getModuleCount(), cs = qs / n; x.fillStyle = "#07172D"; for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect(W / 2 - qs / 2 + k * cs, qy + r * cs, Math.ceil(cs), Math.ceil(cs)); } catch (e) {}
    x.fillStyle = "#F4F7FB"; x.font = "700 46px " + ff; x.direction = "ltr"; x.fillText("Code: " + (o.code || ""), W / 2, H - 95); x.direction = fa ? "rtl" : "ltr"; x.fillStyle = "#A9BAD0"; x.font = "500 32px " + ff; x.fillText(fa ? "برای تأیید اعتبار QR را اسکن کن" : "Scan the QR to verify", W / 2, H - 155);
    return c;
  }

  function tools(o, nosw) {
    var L = T[o.lang === "fa" ? "fa" : "en"], cur = tpl(o);
    var sw = nosw ? "" : '<div class="pc-sw" role="group" aria-label="' + esc(L.tpl) + '">' + TPL.map(function (k, i) { return '<button type="button" class="btn" data-tpl="' + k + '" aria-pressed="' + (k === cur) + '">' + esc(L["t" + (i + 1)]) + '</button>'; }).join("") + '</div>';
    var sh = "", fa = o.lang === "fa", NM = PN[fa ? "fa" : "en"];
    if (o.ok !== false && o.url) {
      var cur0 = "li", txt = (o._t && o._t[cur0]) || ptxt(o, cur0);
      sh = '<div class="pc-sh2"><span class="pc-shl">' + esc(L.share) + '</span>' +
        '<div class="pc-pl" role="group" aria-label="' + esc(fa ? "انتخاب شبکه" : "Choose network") + '">' + PL.map(function (k) { return '<button type="button" class="btn" data-pl="' + k + '" aria-pressed="' + (k === cur0) + '">' + esc(NM[k]) + '</button>'; }).join("") + '</div>' +
        '<label class="pc-stl" for="pcTxt">' + esc(L.stxt) + '</label><textarea id="pcTxt" class="pc-stx" rows="6">' + esc(txt) + '</textarea>' +
        '<div class="pc-sh" data-links>' + links(o, txt).map(function (a) { return '<a class="btn pc-n pc-n-' + a[0] + '" data-k="' + a[0] + '" href="' + esc(a[2]) + '" target="_blank" rel="noopener noreferrer"><i aria-hidden="true">' + brand(a[0]) + '</i>' + esc(a[1]) + '</a>'; }).join("") +
        (navigator.share ? '<button type="button" class="btn" data-native>' + esc(L.more) + '</button>' : "") +
        '<button type="button" class="btn" data-copy>' + esc(fa ? "کپی متن" : "Copy text") + '</button><button type="button" class="btn" data-copyl>' + esc(L.copy) + '</button><button type="button" class="btn" data-img>' + esc(fa ? "دانلود تصویر اشتراک" : "Download share image") + '</button><span class="fstatus ok" role="status" aria-live="polite"></span></div>' +
        '<p class="pc-note muted">' + esc(fa ? "اینستاگرام لینک مستقیم نمی‌پذیرد: متن را کپی کن و تصویر را در پست بگذار." : "Instagram has no share link: copy the text and attach the image to your post.") + '</p>' + (o.sample ? '<p class="pc-note muted">' + esc(fa ? "این یک نمونه است؛ گواهی واقعی با کد واقعی ساخته می‌شود." : "This is a sample; a real certificate gets a real code.") + '</p>' : "") + '</div>';
    }
    if (o.ok !== false) sh += '<div class="pc-at-box"><button type="button" class="btn go" data-at>' + esc(fa ? "تصدیق‌نامهٔ رسمی" : "Official verification statement") + '</button><div class="pc-at-wrap" hidden></div></div>';
    return '<div class="pc-tools">' + sw + '<p class="vact"><button type="button" class="btn go" data-print>' + esc(L.print) + '</button> <button type="button" class="btn" data-pdf>' + esc(L.pdf) + '</button></p>' + sh + '</div>';
  }
  function drawQR(root) {
    var go = function () {
      [].forEach.call(root.querySelectorAll(".pc-qrb"), function (b) {
        var u = b.getAttribute("data-url"); if (!u) return;
        try { var q = window.qrcode(0, "M"); q.addData(u); q.make(); b.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } catch (e) {}
      });
    };
    if (window.qrcode) go(); else { var s = document.createElement("script"); s.src = "assets/js/qr.js"; s.onload = go; document.head.appendChild(s); }
  }

  function mount(box, o) {
    var L = T[o.lang === "fa" ? "fa" : "en"];
    function paint() {
      o.tpl = tpl(o);
      box.innerHTML = '<div class="pc-wrap">' + html(o) + '</div>' + tools(o);
      drawQR(box);
      [].forEach.call(box.querySelectorAll("[data-tpl]"), function (b) { b.onclick = function () { setTpl(b.getAttribute("data-tpl"), o); paint(); var n = box.querySelector('[data-tpl="' + tpl(o) + '"]'); if (n) n.focus(); }; });
      var pr = box.querySelector("[data-print]"); if (pr) pr.onclick = function () { document.body.classList.add("pc-printing"); box.classList.add("pc-print-me"); window.print(); setTimeout(function () { document.body.classList.remove("pc-printing"); box.classList.remove("pc-print-me"); }, 500); };
      var pd = box.querySelector("[data-pdf]"); if (pd) pd.onclick = function () {
        var el = box.querySelector(".pc"), lab = pd.textContent; if (!el) return; pd.disabled = true; pd.textContent = L.pdfw;
        var run = function () { window.__pdf.fromElement(el, "certificate-" + String(o.code || "cca").replace(/[^\w-]/g, "") + ".pdf", { fit: true }).catch(function () { alert(L.pdfe); }).then(function () { pd.disabled = false; pd.textContent = lab; }); };
        if (window.__pdf) run(); else { var sc = document.createElement("script"); sc.src = "assets/js/pdf.js"; sc.onload = run; sc.onerror = function () { pd.disabled = false; pd.textContent = lab; alert(L.pdfe); }; document.head.appendChild(sc); }
      };
      var ta = box.querySelector(".pc-stx"), st = box.querySelector(".pc-sh .fstatus"), curP = "li";
      if (ta) {
        o._t = o._t || {};
        function relink() { links(o, ta.value).forEach(function (a) { var e = box.querySelector('[data-k="' + a[0] + '"]'); if (e) e.href = a[2]; }); }
        ta.oninput = function () { o._t[curP] = ta.value; relink(); };
        [].forEach.call(box.querySelectorAll("[data-pl]"), function (b) { b.onclick = function () { curP = b.getAttribute("data-pl"); [].forEach.call(box.querySelectorAll("[data-pl]"), function (z) { z.setAttribute("aria-pressed", z === b); }); ta.value = o._t[curP] || ptxt(o, curP); }; });
        var done = function (m) { if (st) st.textContent = m || L.copied; };
        var cp = box.querySelector("[data-copy]"); cp.onclick = function () { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value + "").then(function () { done(); }, function () { done(); }); else { ta.select(); try { document.execCommand("copy"); } catch (e) {} done(); } };
        var cl = box.querySelector("[data-copyl]"); if (cl) cl.onclick = function () { if (navigator.clipboard) navigator.clipboard.writeText(o.url || "").then(function () { done(); }, function () {}); };
        var si = box.querySelector("[data-shimg]"); if (si) si.onclick = function () { var run = function () { shareImage(o).toBlob(function (bl) { if (!bl) return; var fl = new File([bl], "certificate.png", { type: "image/png" }); if (navigator.canShare && navigator.canShare({ files: [fl] })) navigator.share({ files: [fl], title: o.course, text: ptxt(o, "ig") }).catch(function () {}); else done(fa ? "این دستگاه اشتراک تصویر را پشتیبانی نمی‌کند" : "This device cannot share images"); }, "image/png"); }; if (window.qrcode) run(); else { var q2 = document.createElement("script"); q2.src = "assets/js/qr.js"; q2.onload = run; document.head.appendChild(q2); } };
        var nv = box.querySelector("[data-native]"); if (nv) nv.onclick = function () { navigator.share({ title: o.course, text: ta.value, url: o.url }).catch(function () {}); };
        var im = box.querySelector("[data-img]"); if (im) im.onclick = function () { var run = function () { var go = function () { var cv = shareImage(o); cv.toBlob(function (bl) { if (!bl) return; var u = URL.createObjectURL(bl), a = document.createElement("a"); a.href = u; a.download = "certificate-" + String(o.code || "cca").replace(/[^\w-]/g, "") + ".png"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); }, "image/png"); }; if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).then(go, go); else go(); }; if (window.qrcode) run(); else { var q = document.createElement("script"); q.src = "assets/js/qr.js"; q.onload = run; document.head.appendChild(q); } };
      }
      var ab = box.querySelector("[data-at]"); if (ab) ab.onclick = function () {
        var w = box.querySelector(".pc-at-wrap"), fa2 = o.lang === "fa"; if (!w.hidden) { w.hidden = true; w.innerHTML = ""; return; }
        o.tpl = tpl(o); w.hidden = false; w.innerHTML = attest(o) + '<p class="vact"><button type="button" class="btn go" data-aprint>' + esc(L.print) + '</button> <button type="button" class="btn" data-apdf>' + esc(L.pdf) + '</button></p>'; drawQR(w);
        w.querySelector("[data-aprint]").onclick = function () { document.body.classList.add("pc-printing"); w.classList.add("pc-print-me"); window.print(); setTimeout(function () { document.body.classList.remove("pc-printing"); w.classList.remove("pc-print-me"); }, 500); };
        var pb = w.querySelector("[data-apdf]"); pb.onclick = function () { var el = w.querySelector(".pc-at"), lab = pb.textContent; pb.disabled = true; pb.textContent = L.pdfw; var run = function () { window.__pdf.fromElement(el, "verification-" + String(o.code || "cca").replace(/[^\w-]/g, "") + ".pdf", { fit: true }).catch(function () { alert(L.pdfe); }).then(function () { pb.disabled = false; pb.textContent = lab; }); }; if (window.__pdf) run(); else { var sc = document.createElement("script"); sc.src = "assets/js/pdf.js"; sc.onload = run; sc.onerror = function () { pb.disabled = false; pb.textContent = lab; alert(L.pdfe); }; document.head.appendChild(sc); } };
        w.scrollIntoView({ block: "nearest" });
      };
    }
    paint();
    if (!o.sample && o.ok !== false && o.code) confetti(box, o.code);
  }

  /* ---------- public showcase slider: all styles, all kinds, labelled SAMPLE ---------- */
  function showcase(box, lang) {
    lang = lang === "fa" ? "fa" : "en"; var L = T[lang], n = 0;
    var pairs = [["classic", "done"], ["modern", "exc"], ["cinema", "done"], ["royal", "exc"], ["tech", "part"], ["scholar", "done"], ["studio", "exc"], ["minimal", "part"]];
    var slides = pairs.map(function (p, i) {
      return '<li class="pcs-s" id="pcs' + i + '"><div class="pc-wrap">' + html({ lang: lang, tpl: p[0], kind: p[1], sample: true, name: L.nm, course: L.cn, date: L.dt, code: "CCA-2026-SAMPLE-000" + (i + 1), url: "https://example.org/verify", ok: true }) + '</div><p class="pcs-c"><b>' + esc(L["t" + (i + 1)]) + '</b> · ' + esc(L["k_" + p[1]]) + '<br><span>' + esc(L["d" + (i + 1)]) + '</span></p></li>';
    }).join("");
    box.innerHTML = '<div class="pcs" role="region" aria-roledescription="carousel" aria-label="' + esc(L.sc_t) + '"><div class="pcs-h"><h2>' + esc(L.sc_h) + '</h2><p>' + esc(L.sc_p) + '</p></div>' +
      '<ul class="pcs-t" tabindex="0">' + slides + '</ul><div class="pcs-n"><button type="button" class="btn" data-d="-1">' + esc(L.prev) + '</button><span class="pcs-dots">' + pairs.map(function (p, i) { return '<button type="button" aria-label="' + (i + 1) + '" data-i="' + i + '"></button>'; }).join("") + '</span><button type="button" class="btn" data-d="1">' + esc(L.next) + '</button></div></div>';
    drawQR(box); var tr = box.querySelector(".pcs-t"), dots = [].slice.call(box.querySelectorAll(".pcs-dots button"));
    function go(i) { n = Math.max(0, Math.min(pairs.length - 1, i)); tr.children[n].scrollIntoView({ inline: "center", block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
    function mark() { var best = 0, bd = 1e9, r = tr.getBoundingClientRect(), mid = r.left + r.width / 2; [].forEach.call(tr.children, function (s, i) { var q = s.getBoundingClientRect(), d = Math.abs(q.left + q.width / 2 - mid); if (d < bd) { bd = d; best = i; } }); n = best; dots.forEach(function (d, i) { d.setAttribute("aria-current", i === best ? "true" : "false"); }); }
    box.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.d) go(n + (+b.dataset.d)); else if (b.dataset.i) go(+b.dataset.i); });
    tr.addEventListener("scroll", function () { clearTimeout(tr._t); tr._t = setTimeout(mark, 60); }, { passive: true }); mark();
  }
  /* one short confetti burst the first time a valid real certificate is shown in this browser session */
  function confetti(root, key) {
    try { if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("lite")) return; if (sessionStorage.getItem("am-cf-" + key)) return; sessionStorage.setItem("am-cf-" + key, "1"); } catch (e) { return; }
    var c = document.createElement("canvas"); c.setAttribute("aria-hidden", "true"); c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:80"; document.body.appendChild(c);
    var W = c.width = innerWidth, H = c.height = innerHeight, x = c.getContext("2d"), cols = ["#0B4F8A", "#F2CF6B", "#1F9AD6", "#E0482B", "#1B7F4A"], P = [];
    for (var i = 0; i < 110; i++) P.push({ x: W / 2 + (Math.random() - .5) * 120, y: H * .35, vx: (Math.random() - .5) * 13, vy: -Math.random() * 12 - 3, r: Math.random() * 6 + 3, a: Math.random() * 6, va: (Math.random() - .5) * .4, c: cols[i % cols.length] });
    var t0 = performance.now();
    (function f(t) { var el = t - t0; x.clearRect(0, 0, W, H); P.forEach(function (p) { p.vy += .32; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.globalAlpha = Math.max(0, 1 - el / 2200); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); x.restore(); }); if (el < 2300) requestAnimationFrame(f); else c.remove(); })(t0);
  }
  window.__cert = { ptxt: ptxt, attest: attest, shareImage: shareImage, confetti: confetti, html: html, mount: mount, showcase: showcase, T: T, barcode: barcode, shareText: shareText };
})();
