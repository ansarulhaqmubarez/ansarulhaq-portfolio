/* Student dashboard: 4 stat cards, "My programs" table, course overview with filters, search, sort, grid/list.
   Self-contained (no libraries). Receives real data from app.js; nothing here is made up.
   Starred / removed courses live only in this browser (localStorage), they never leave the device. */
(function () {
  "use strict";
  var ST = {
    fa: { dash: "داشبورد", enr: "دوره‌های ثبت‌نام‌شده", cmp: "دوره‌های تمام‌شده", rem: "درس‌های باقی‌مانده", crt: "گواهی‌ها",
      prog: "برنامه‌های من", c1: "دوره", c2: "تاریخ شروع", c3: "پیشرفت", c4: "وضعیت", cat: "فهرست دوره‌ها",
      ov: "نمای کلی دوره‌ها", all: "همه", inp: "در جریان", fut: "شروع‌نشده", past: "تمام‌شده", star: "ستاره‌دار", hid: "حذف‌شده از نمایش",
      q: "جستجو", sort: "مرتب‌سازی", sn: "نام دوره", sl: "آخرین ثبت‌نام", sp: "پیشرفت", grid: "نمای شبکه", list: "نمای فهرست", view: "دیدن دوره",
      inst: "مدرس", sOpen: "فعال", sDone: "تمام‌شده", sNew: "شروع‌نشده", none: "موردی پیدا نشد.", empty: "هنوز در دوره‌ای ثبت‌نام نکرده‌ای.", browse: "دیدن دوره‌های آکادمی",
      starA: "ستاره‌دار کردن", unstarA: "برداشتن ستاره", hideA: "حذف از نمایش", showA: "برگرداندن به نمایش", lesn: "درس" },
    en: { dash: "Dashboard", enr: "Courses enrolled", cmp: "Courses completed", rem: "Lessons remaining", crt: "Certificates",
      prog: "My programs", c1: "Course", c2: "Started", c3: "Progress", c4: "Status", cat: "Course catalogue",
      ov: "Course overview", all: "All", inp: "In progress", fut: "Not started", past: "Completed", star: "Starred", hid: "Removed from view",
      q: "Search", sort: "Sort by", sn: "Course name", sl: "Last enrolled", sp: "Progress", grid: "Grid view", list: "List view", view: "View course",
      inst: "Instructor", sOpen: "Active", sDone: "Completed", sNew: "Not started", none: "Nothing found.", empty: "You have not enrolled in a course yet.", browse: "Browse academy courses",
      starA: "Star this course", unstarA: "Remove star", hideA: "Remove from view", showA: "Restore to view", lesn: "lessons" }
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var IC = {
    book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.7 13.5L7.5 21l4.5-2.5 4.5 2.5-1.2-7.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 5.7A9.6 9.6 0 0112 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 01-3 3.7M6.6 6.9C4 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.5 0 2.8-.4 4-1M9.9 9.9a3 3 0 004.2 4.2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0115 0"/>'
  };
  var ic = function (k, f) { return '<svg class="pi" viewBox="0 0 24 24" width="20" height="20" fill="' + (f ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + IC[k] + "</svg>"; };
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rnd(seed) { var a = seed; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  /* abstract geometric art, deterministic per course id, drawn with theme colours */
  function art(id) {
    var h = hash(id), r = rnd(h), v = h % 4, o = "";
    o += '<rect width="320" height="150" class="ga-bg"/>';
    if (v === 0) { for (var i = 0; i < 6; i++) o += '<circle cx="' + Math.round(40 + r() * 240) + '" cy="' + Math.round(20 + r() * 110) + '" r="' + Math.round(18 + r() * 46) + '" class="ga-s" fill="none"/>'; o += '<circle cx="' + Math.round(60 + r() * 200) + '" cy="' + Math.round(40 + r() * 70) + '" r="' + Math.round(10 + r() * 16) + '" class="ga-f"/>'; }
    else if (v === 1) { for (var j = 0; j < 7; j++) { var x = Math.round(r() * 300), y = Math.round(r() * 120), s = Math.round(30 + r() * 60); o += '<path d="M' + x + " " + (y + s) + " L" + (x + s / 2) + " " + y + " L" + (x + s) + " " + (y + s) + 'z" class="' + (j % 3 ? "ga-s" : "ga-f") + '" fill="' + (j % 3 ? "none" : "") + '"/>'; } }
    else if (v === 2) { for (var k = 0; k < 9; k++) o += '<path d="M' + Math.round(-20 + k * 42) + ' 160 L' + Math.round(60 + k * 42) + ' -10" class="ga-s" fill="none"/>'; o += '<rect x="' + Math.round(100 + r() * 80) + '" y="' + Math.round(30 + r() * 40) + '" width="64" height="64" rx="10" class="ga-f"/>'; }
    else { for (var a = 0; a < 5; a++) for (var b = 0; b < 12; b++) if (r() > .35) o += '<circle cx="' + (24 + b * 24) + '" cy="' + (20 + a * 28) + '" r="' + (r() > .8 ? 5 : 2.4) + '" class="ga-f"/>'; o += '<path d="M0 130 C80 90 160 150 320 100" class="ga-s" fill="none"/>'; }
    return '<svg class="gart" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' + o + "</svg>";
  }
  function code(id) { var p = String(id).split(/[-_\s]+/).filter(Boolean), c = p.map(function (w) { return w.charAt(0); }).join("").toUpperCase().slice(0, 4) || "CC"; return c + "-" + (p.length ? String(id).length * 7 % 90 + 10 : 10); }
  function load(k) { try { var a = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function save(k, a) { try { localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }
  function fmtDate(s, lang) { try { return new Date(s).toLocaleDateString(lang === "fa" ? "fa-AF-u-ca-persian" : "en-GB", { year: "numeric", month: "short", day: "numeric" }); } catch (e) { return String(s || "").slice(0, 10); } }

  function catOf(id) { try { var c = ((window.SITE && window.SITE.courses) || []).find(function (x) { return x.id === id; }); var l = document.documentElement.lang === "en" ? "en" : "fa"; return (c && c.cat && (c.cat[l] || c.cat.fa || c.cat.en)) || ""; } catch (e) { return ""; } }
  function mount(o) {
    var L = ST[o.lang] || ST.en, root = o.root, uid = o.uid || "u";
    var kS = "am-star-" + uid, kH = "am-hide-" + uid, kV = "am-view";
    var star = load(kS), hide = load(kH), view = "grid", flt = "all", q = "", sort = "name";
    try { view = localStorage.getItem(kV) === "list" ? "list" : "grid"; } catch (e) {}
    var items = o.enr.map(function (e) {
      var ls = o.les.filter(function (l) { return l.course_id === e.course_id; }), d = ls.filter(function (l) { return o.done.has(l.id); }).length,
        pc = ls.length ? Math.round(d * 100 / ls.length) : 0, hasC = o.cer.some(function (c) { return c.course_id === e.course_id && !c.revoked; });
      var st = (pc >= 100 || hasC) ? "done" : (pc > 0 ? "open" : "new");
      return { id: e.course_id, title: o.ttl(e.courses) || e.course_id, pc: pc, d: d, n: ls.length, st: st, at: e.created_at, code: code(e.course_id), cat: catOf(e.course_id), href: "course.html#" + encodeURIComponent(e.course_id) };
    });
    var cmp = items.filter(function (x) { return x.st === "done"; }).length, remL = items.reduce(function (n, x) { return n + (x.n - x.d); }, 0), certN = o.cer.filter(function (c) { return !c.revoked; }).length;
    var stat = function (ik, n, lab) { return '<div class="pst"><span class="pst-i">' + ic(ik) + '</span><div><b>' + n + "</b><span>" + esc(lab) + "</span></div></div>"; };
    var badge = function (s) { return '<span class="pbd pbd-' + s + '">' + esc(s === "done" ? L.sDone : s === "open" ? L.sOpen : L.sNew) + "</span>"; };
    var bar = function (p, lab) { return '<div class="xbar" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(lab) + '"><i style="width:' + p + '%"></i></div>'; };
    var table = items.length ? '<div class="ptable-w"><table class="ptable"><thead><tr><th scope="col">' + esc(L.c1) + '</th><th scope="col">' + esc(L.c2) + '</th><th scope="col">' + esc(L.c3) + '</th><th scope="col">' + esc(L.c4) + "</th></tr></thead><tbody>" +
      items.map(function (x) { return '<tr><th scope="row"><a href="' + esc(x.href) + '">' + esc(x.title) + '</a></th><td dir="ltr">' + esc(fmtDate(x.at, o.lang)) + "</td><td>" + bar(x.pc, x.title) + '<span class="pp">' + x.pc + "%</span></td><td>" + badge(x.st) + "</td></tr>"; }).join("") + "</tbody></table></div>" : "";
    root.innerHTML = (items.length ? '<section class="ps" id="pov"><h2 class="ph2">' + esc(L.ov) + '</h2><div class="pflt" role="tablist" aria-label="' + esc(L.ov) + '" id="pfl"></div>' +
        '<div class="ptool"><label class="pq"><span class="pqi">' + ic("search") + '</span><span class="sr">' + esc(L.q) + '</span><input type="search" id="pq" placeholder="' + esc(L.q) + '" autocomplete="off"></label>' +
        '<label class="psel"><span>' + esc(L.sort) + '</span><select id="psort"><option value="name">' + esc(L.sn) + '</option><option value="last">' + esc(L.sl) + '</option><option value="prog">' + esc(L.sp) + '</option></select></label>' +
        '<div class="pview" role="group"><button type="button" id="pvg" aria-label="' + esc(L.grid) + '" title="' + esc(L.grid) + '">' + ic("grid") + '</button><button type="button" id="pvl" aria-label="' + esc(L.list) + '" title="' + esc(L.list) + '">' + ic("list") + '</button></div></div>' +
        '<p class="sr" id="pcnt" role="status" aria-live="polite"></p><div id="pgrid"></div></section>' : "") +
      (items.length ? "" : '<section class="ps"><p class="muted">' + esc(L.empty) + '</p><p><a class="btn go" href="academy.html">' + esc(L.browse) + "</a></p></section>");
    if (!items.length) return;
    var tabs = [["all", L.all], ["open", L.inp], ["new", L.fut], ["done", L.past], ["star", L.star], ["hide", L.hid]];
    var pick = function (x) {
      var isH = hide.indexOf(x.id) > -1, isS = star.indexOf(x.id) > -1;
      if (flt === "hide") return isH; if (isH) return false;
      if (flt === "star") return isS; if (flt === "all") return true; return x.st === flt;
    };
    var draw = function () {
      var nq = q.trim().toLowerCase();
      var list = items.filter(function (x) { return pick(x) && (!nq || (x.title + " " + x.code).toLowerCase().indexOf(nq) > -1); });
      list.sort(function (a, b) { return sort === "last" ? (String(b.at).localeCompare(String(a.at))) : sort === "prog" ? (b.pc - a.pc) : a.title.localeCompare(b.title, o.lang); });
      $("#pfl").innerHTML = tabs.map(function (t) { var n = items.filter(function (x) { var s = flt; flt = t[0]; var r = pick(x); flt = s; return r; }).length; return '<button type="button" role="tab" aria-selected="' + (t[0] === flt) + '" data-f="' + t[0] + '">' + esc(t[1]) + ' <span class="xn">' + n + "</span></button>"; }).join("");
      $("#pcnt").textContent = list.length + " / " + items.length;
      $("#pvg").setAttribute("aria-pressed", view === "grid"); $("#pvl").setAttribute("aria-pressed", view === "list");
      $("#pgrid").className = "xcards " + view;
      $("#pgrid").innerHTML = list.length ? list.map(function (x) {
        var isS = star.indexOf(x.id) > -1, isH = hide.indexOf(x.id) > -1;
        return '<article class="xc"><div class="xc-art">' + art(x.id) + '<span class="xc-code" dir="ltr">' + esc(x.code) + '</span><div class="xc-act"><button type="button" data-s="' + esc(x.id) + '" aria-pressed="' + isS + '" aria-label="' + esc(isS ? L.unstarA : L.starA) + '" title="' + esc(isS ? L.unstarA : L.starA) + '">' + ic("star", isS) + '</button><button type="button" data-h="' + esc(x.id) + '" aria-label="' + esc(isH ? L.showA : L.hideA) + '" title="' + esc(isH ? L.showA : L.hideA) + '">' + ic(isH ? "eye" : "eyeoff") + "</button></div>" + bar(x.pc, x.title) + "</div>" +
          '<div class="xc-b">' + (x.cat ? '<p class="xc-cat">' + esc(x.cat) + "</p>" : "") + '<h3><a href="' + esc(x.href) + '">' + esc(x.title) + '</a></h3><p class="xc-m">' + badge(x.st) + '<span>' + x.pc + "% · " + x.d + "/" + x.n + " " + esc(L.lesn) + '</span></p><div class="xc-f"><span class="xc-i">' + ic("user") + esc(o.instructor) + '</span><a class="xc-go" href="' + esc(x.href) + '">' + esc(L.view) + "</a></div></div></article>";
      }).join("") : '<p class="muted">' + esc(L.none) + "</p>";
    };
    var $ = function (s) { return root.querySelector(s); };
    root.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t || !root.contains(t)) return;
      if (t.dataset.f) { flt = t.dataset.f; draw(); return; }
      if (t.dataset.s) { var i = star.indexOf(t.dataset.s); if (i > -1) star.splice(i, 1); else star.push(t.dataset.s); save(kS, star); draw(); return; }
      if (t.dataset.h) { var j = hide.indexOf(t.dataset.h); if (j > -1) hide.splice(j, 1); else hide.push(t.dataset.h); save(kH, hide); draw(); return; }
      if (t.id === "pvg" || t.id === "pvl") { view = t.id === "pvl" ? "list" : "grid"; try { localStorage.setItem(kV, view); } catch (er) {} draw(); }
    });
    $("#pq").oninput = function (e) { q = e.target.value; draw(); };
    $("#psort").onchange = function (e) { sort = e.target.value; draw(); };
    draw();
  }

  /* student home: welcome, enrollment steps, to-do checklist, work to do, clock, calendar, courses table */
  var HS = {
    fa: { wel: "به آکادمی سینه‌کد خوش آمدی", wsub: "هر هفته وارد شو و درس‌ها و تکلیف‌هایت را به‌موقع انجام بده. موفق باشی!", ann: "اعلان‌ها", steps: "مراحل شروع", stepsD: "برای شروع کامل یادگیری این مراحل را انجام بده.",
      done: "انجام شد", on: "تاریخ انجام", next: "گام بعدی", chk: "فهرست کارها", chkD: "فهرست کارهای تو.", cur: "جاری", cmp: "انجام‌شده", none: "کار باقی‌مانده‌ای نیست. آفرین!",
      wtd: "کارهای پیش رو", wtdN: "همهٔ درس‌ها را دیده‌ای.", time: "ساعت کابل", yc: "درس‌های من", ycD: "همهٔ درس‌هایت در یک جا.", cName: "نام دوره", cSt: "وضعیت", cCur: "در جریان", cPast: "تمام‌شده",
      cal: "تقویم", lib: "کتابخانه", libD: "بیش از ۸۰۰ دوره و سایت یادگیری، دسته‌بندی‌شده.", libB: "باز کردن کتابخانه", sup: "پشتیبانی", supD: "سؤال داری؟ پیام بده.", email: "ایمیل", wa: "واتساپ",
      t1: "حساب ساخته شد", t2: "تکمیل مشخصات کاربر", t3: "ثبت‌نام در اولین دوره", t4: "دیدن اولین درس", t5: "قبولی در آزمون پایانی", t6: "گرفتن گواهی",
      a2: "تکمیل مشخصات", a3: "دیدن دوره‌ها", a4: "ادامهٔ درس", a5: "رفتن به آزمون", a6: "دیدن گواهی", lesson: "درس", wd: ["ش","ی","د","س","چ","پ","ج"] },
    en: { wel: "Welcome to CineCode Academy", wsub: "Log in every week and finish your lessons and tasks on time. Good luck!", ann: "Announcements", steps: "Getting started", stepsD: "Complete these steps to start learning fully.",
      done: "Completed", on: "Completed on", next: "Next step", chk: "Checklist", chkD: "A to-do list for you.", cur: "Current", cmp: "Completed", none: "Nothing left to do. Well done!",
      wtd: "Work to do", wtdN: "You have seen every lesson.", time: "Kabul time", yc: "Your courses", ycD: "Keep track of all your courses in one spot.", cName: "Course name", cSt: "Status", cCur: "Current", cPast: "Completed",
      cal: "Calendar", lib: "Library", libD: "800+ learning courses and sites, organised by category.", libB: "Open library", sup: "Support", supD: "Questions? Send us a message.", email: "Email", wa: "WhatsApp",
      t1: "Account created", t2: "Complete your user details", t3: "Enroll in your first course", t4: "Watch your first lesson", t5: "Pass a final exam", t6: "Earn a certificate",
      a2: "Complete details", a3: "Browse courses", a4: "Continue lesson", a5: "Go to exam", a6: "View certificate", lesson: "Lesson", wd: ["S","M","T","W","T","F","S"] }
  };
  function home(o) {
    var H = HS[o.lang] || HS.en, root = o.root, p = o.prof || {}, kC = "am-chk-" + (o.uid || "u");
    var firstEnr = o.enr.slice().sort(function (a, b) { return String(a.created_at).localeCompare(String(b.created_at)); })[0];
    var cert = o.cer.filter(function (c) { return !c.revoked; })[0], anyDone = o.done.size > 0, passed = (o.att || []).some(function (a) { return a.passed && a.kind !== "quiz"; });
    var prof2 = !!(p.full_name && p.country && p.phone && p.education);
    var firstCourse = o.enr[0] && o.enr[0].course_id, nxL = null, nxC = null;
    o.enr.forEach(function (e) { if (nxL) return; var ls = o.les.filter(function (l) { return l.course_id === e.course_id; }), n = ls.find(function (l) { return !o.done.has(l.id); }); if (n) { nxL = { n: ls.indexOf(n) + 1, c: e }; } });
    var T = [
      { k: "t1", ok: true, at: o.since, act: null },
      { k: "t2", ok: prof2, at: null, act: ["#profile", H.a2] },
      { k: "t3", ok: o.enr.length > 0, at: firstEnr && firstEnr.created_at, act: ["academy.html", H.a3] },
      { k: "t4", ok: anyDone, at: null, act: nxL ? ["course.html#" + encodeURIComponent(nxL.c.course_id), H.a4] : ["academy.html", H.a3] },
      { k: "t5", ok: passed, at: null, act: firstCourse ? ["course.html#" + encodeURIComponent(firstCourse), H.a5] : ["academy.html", H.a3] },
      { k: "t6", ok: !!cert, at: cert && cert.issued_at, act: ["#certs", H.a6] }
    ];
    var firstOpen = T.findIndex(function (t) { return !t.ok; });
    var stepsH = '<ol class="hs-steps">' + T.map(function (t, i) { var cls = t.ok ? "ok" : (i === firstOpen ? "now" : "");
      return '<li class="' + cls + '"><span class="hs-n" aria-hidden="true">' + (t.ok ? ic("check") : (i + 1)) + '</span><div><b>' + esc(H[t.k]) + '</b><span class="hs-s">' + (t.ok ? esc(H.done) + (t.at ? " · " + esc(H.on) + " " + esc(fmtDate(t.at, o.lang)) : "") : (i === firstOpen ? esc(H.next) : "")) + "</span></div></li>"; }).join("") + "</ol>";
    var tabs = '<div class="pflt" role="group" aria-label="' + esc(H.chk) + '"><button type="button" data-ck="cur" aria-pressed="true">' + esc(H.cur) + ' <span class="xn" id="hck1"></span></button><button type="button" data-ck="cmp" aria-pressed="false">' + esc(H.cmp) + ' <span class="xn" id="hck2"></span></button></div>';
    var cur = items2(o), pend = cur.pend, fin = cur.fin;
    function items2(o) {
      var rows = [];
      T.forEach(function (t, i) { rows.push({ t: H[t.k], ok: t.ok, act: t.act }); });
      var o1 = { pend: rows.filter(function (r) { return !r.ok; }), fin: rows.filter(function (r) { return r.ok; }) }; return o1;
    }
    var wt = []; o.enr.forEach(function (e) { var ls = o.les.filter(function (l) { return l.course_id === e.course_id; }); var n = ls.find(function (l) { return !o.done.has(l.id); }); if (n) wt.push({ c: o.ttl(e.courses) || e.course_id, n: ls.indexOf(n) + 1, left: ls.length - ls.filter(function (l) { return o.done.has(l.id); }).length, href: "course.html#" + encodeURIComponent(e.course_id) }); });
    var wtdH = wt.length ? '<ul class="hs-wl">' + wt.map(function (w) { return '<li><a href="' + esc(w.href) + '"><b>' + esc(w.c) + '</b><span>' + esc(H.lesson) + " " + w.n + " · " + w.left + " " + esc(o.lang === "fa" ? "مانده" : "left") + "</span></a></li>"; }).join("") + "</ul>" : '<p class="muted">' + esc(H.wtdN) + "</p>";
    var tbl = o.enr.length ? '<div class="ptable-w"><table class="ptable"><thead><tr><th scope="col">' + esc(H.cName) + '</th><th scope="col">' + esc(H.cSt) + "</th></tr></thead><tbody>" + o.enr.map(function (e) {
      var ls = o.les.filter(function (l) { return l.course_id === e.course_id; }), d = ls.filter(function (l) { return o.done.has(l.id); }).length, fn = ls.length && d === ls.length;
      return '<tr><th scope="row"><a href="course.html#' + encodeURIComponent(e.course_id) + '">' + esc(o.ttl(e.courses) || e.course_id) + '</a></th><td><span class="pbd pbd-' + (fn ? "done" : "open") + '">' + esc(fn ? H.cPast : H.cCur) + "</span></td></tr>"; }).join("") + "</tbody></table></div>" : "";
    var S0 = window.SITE || {}, mail = S0.contactEmail || "", ph = ((S0.phones || []).filter(function (x) { return x.wa; })[0] || {}).n || "";
    root.innerHTML = '<div class="ph-g"><div class="ph-m">' +
      '<section class="ps hs-wel"><div class="hs-ban" aria-hidden="true">' + art("welcome-" + (o.uid || "u")) + '</div><p class="hs-k">' + esc(H.ann) + '</p><h2 class="hs-h">' + esc(H.wel) + "، " + esc(o.name) + '!</h2><p class="muted">' + esc(H.wsub) + '</p><p><a href="blog.html">' + esc(o.lang === "fa" ? "دیدن همهٔ اعلان‌ها و مطالب ←" : "Show all announcements →") + "</a></p></section>" +
      '<section class="ps"><h2 class="ph2">' + esc(H.steps) + '</h2><p class="muted">' + esc(H.stepsD) + "</p>" + stepsH + "</section>" +
      '<section class="ps"><h2 class="ph2">' + esc(H.chk) + '</h2><p class="muted">' + esc(H.chkD) + "</p>" + tabs + '<ul class="hs-ck" id="hsck"></ul></section>' +
      (tbl ? '<section class="ps"><h2 class="ph2">' + esc(H.yc) + '</h2><p class="muted">' + esc(H.ycD) + "</p>" + tbl + "</section>" : "") +
      '</div><aside class="ph-a" aria-label="' + esc(H.wtd) + '">' +
      '<section class="ps hs-clk"><h2 class="ph2">' + esc(H.time) + '</h2><p class="hs-t" id="hsT" dir="ltr"></p><p class="muted" id="hsD"></p></section>' +
      '<section class="ps"><h2 class="ph2">' + esc(H.wtd) + "</h2>" + wtdH + "</section>" +
      '<section class="ps"><h2 class="ph2">' + esc(H.cal) + '</h2><div id="hsCal"></div></section>' +
      '<section class="ps"><h2 class="ph2">' + esc(H.lib) + '</h2><p class="muted">' + esc(H.libD) + '</p><p class="hs-sp"><a class="btn go" href="resources.html">' + esc(H.libB) + "</a></p></section>" +
      '<section class="ps"><h2 class="ph2">' + esc(H.sup) + '</h2><p class="muted">' + esc(H.supD) + '</p><p class="hs-sp">' + (mail ? '<a class="btn" dir="ltr" href="mailto:' + esc(mail) + '">' + esc(H.email) + "</a>" : "") + (ph ? '<a class="btn" href="https://wa.me/' + esc(String(ph).replace(/\D/g, "")) + '" target="_blank" rel="noopener noreferrer">' + esc(H.wa) + "</a>" : "") + "</p></section></aside></div>";
    var q = function (x) { return root.querySelector(x); }, mode = "cur";
    var li = function (r) { return '<li class="' + (r.ok ? "ok" : "") + '"><span class="hs-ci" aria-hidden="true">' + (r.ok ? ic("check") : "") + "</span><span>" + esc(r.t) + "</span>" + (!r.ok && r.act ? '<a class="xc-go" href="' + esc(r.act[0]) + '"' + (r.act[0].charAt(0) === "#" ? ' data-tab="' + esc(r.act[0].slice(1)) + '"' : "") + ">" + esc(r.act[1]) + "</a>" : "") + "</li>"; };
    var drawCk = function () { var L = mode === "cur" ? pend : fin; q("#hsck").innerHTML = L.length ? L.map(li).join("") : '<li class="hs-none">' + esc(H.none) + "</li>"; q("#hck1").textContent = pend.length; q("#hck2").textContent = fin.length;
      [].forEach.call(root.querySelectorAll("[data-ck]"), function (b) { b.setAttribute("aria-pressed", b.dataset.ck === mode); }); };
    root.addEventListener("click", function (e) { var b = e.target.closest("[data-ck]"); if (b) { mode = b.dataset.ck; drawCk(); return; }
      var a = e.target.closest("a[data-tab]"); if (a) { e.preventDefault(); var t = document.getElementById("pt-" + a.dataset.tab); if (t) { t.click(); t.scrollIntoView({ block: "start" }); } } });
    drawCk();
    var tick = function () { if (!document.body.contains(root)) return; var d = new Date(), z = { timeZone: "Asia/Kabul" };
      try { q("#hsT").textContent = d.toLocaleTimeString("en-GB", { timeZone: "Asia/Kabul" }); q("#hsD").textContent = d.toLocaleDateString(o.lang === "fa" ? "fa-AF-u-ca-persian" : "en-GB", { timeZone: "Asia/Kabul", weekday: "long", year: "numeric", month: "long", day: "numeric" }); } catch (e) {} };
    tick(); setInterval(tick, 1000);
    (function () { var d = new Date(), y = d.getFullYear(), m = d.getMonth(), first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate(), c = '<div class="hs-cal" role="grid" aria-label="' + esc(H.cal) + '">';
      var wk = H.wd; var order = o.lang === "fa" ? [6, 0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6];
      c += '<p class="hs-cm">' + esc(d.toLocaleDateString(o.lang === "fa" ? "fa-AF-u-ca-persian" : "en-GB", { month: "long", year: "numeric" })) + "</p>";
      c += order.map(function (i) { return '<span class="hs-wd">' + esc(o.lang === "fa" ? ["ی", "د", "س", "چ", "پ", "ج", "ش"][i] : wk[i]) + "</span>"; }).join("");
      var off = order.indexOf(first); for (var i = 0; i < off; i++) c += "<span></span>";
      for (var k = 1; k <= days; k++) c += '<span class="hs-d' + (k === d.getDate() ? " now" : "") + '"' + (k === d.getDate() ? ' aria-current="date"' : "") + ">" + k + "</span>"; q("#hsCal").innerHTML = c + "</div>"; })();
  }

  /* ---------- classroom area (course home like a school LMS): banner, announcements, modules, work to do, grades ---------- */
  var CL = {
    fa: { ph: "دوره", home: "خانه", cont: "محتوا", grd: "نمره‌ها", ann: "اعلان‌ها", wel: "به این دوره خوش آمدی", welT: "هر درس را ببین، علامت تمام‌شده بزن و در پایان آزمون بده. موفق باشی!", mod: "درس‌های دوره", wtd: "کارهای من", none: "کار باقی‌مانده‌ای نیست.", open: "باز کردن درس", exam: "آزمون پایانی را بده", prog: "پیشرفت", noL: "هنوز درسی اضافه نشده.", noG: "هنوز نمره‌ای ندارد.", gT: "نوع", gS: "نمره", gD: "تاریخ", gQ: "آزمون درس", gF: "آزمون پایانی", pass: "قبول", fail: "ناموفق", min: "دقیقه", empty: "هنوز در دوره‌ای ثبت‌نام نکرده‌ای.", browse: "دیدن دوره‌ها", cert: "گواهی داری — دیدنش", certA: "رفتن به گواهی‌ها", all: "همه" },
    en: { ph: "Course", home: "Home", cont: "Content", grd: "Grades", ann: "Announcements", wel: "Welcome to this course", welT: "Watch each lesson, mark it complete, and take the final exam at the end. Good luck!", mod: "Course modules", wtd: "Work to do", none: "Nothing left to do.", open: "Open lesson", exam: "Take the final exam", prog: "Progress", noL: "No lessons added yet.", noG: "No grades yet.", gT: "Type", gS: "Score", gD: "Date", gQ: "Lesson quiz", gF: "Final exam", pass: "Passed", fail: "Not passed", min: "min", empty: "You have not enrolled in a course yet.", browse: "Browse courses", cert: "You have a certificate — view it", certA: "Go to certificates", all: "All" }
  };
  function classroom(o) {
    var L = CL[o.lang] || CL.en, root = o.root; if (!root) return;
    if (!o.enr.length) { root.innerHTML = '<p class="muted">' + esc(L.empty) + '</p><p><a class="btn go" href="academy.html">' + esc(L.browse) + "</a></p>"; return; }
    var cur = o.enr[0].course_id, sub = "home";
    var tl = function (t) { return t && typeof t === "object" ? (t[o.lang] || t.en || t.fa || "") : String(t || ""); };
    var draw = function () {
      var e = o.enr.find(function (x) { return x.course_id === cur; }) || o.enr[0], title = o.ttl(e.courses) || e.course_id, href = "course.html#" + encodeURIComponent(e.course_id);
      var ls = o.les.filter(function (l) { return l.course_id === e.course_id; }).sort(function (a, b) { return (a.position || 0) - (b.position || 0); });
      var d = ls.filter(function (l) { return o.done.has(l.id); }).length, pc = ls.length ? Math.round(d * 100 / ls.length) : 0, nx = ls.find(function (l) { return !o.done.has(l.id); });
      var hasC = o.cer.some(function (c) { return c.course_id === e.course_id && !c.revoked; });
      var mods = ls.length ? '<ol class="cl-mod">' + ls.map(function (l, i) { var ok = o.done.has(l.id); return '<li class="' + (ok ? "ok" : "") + '"><span class="cl-n" aria-hidden="true">' + (ok ? "✓" : i + 1) + '</span><a href="' + esc(href) + '">' + esc(tl(l.title) || (L.ph + " " + (i + 1))) + '</a>' + (l.duration_sec ? '<small>' + Math.max(1, Math.round(l.duration_sec / 60)) + " " + esc(L.min) + "</small>" : "") + "</li>"; }).join("") + "</ol>" : '<p class="muted">' + esc(L.noL) + "</p>";
      var todo = []; if (nx) todo.push('<a href="' + esc(href) + '">' + esc(L.open) + ": " + esc(tl(nx.title) || "") + "</a>"); else if (ls.length && !hasC) todo.push('<a href="' + esc(href) + '">' + esc(L.exam) + "</a>"); if (hasC) todo.push('<a href="#" data-go="certs">' + esc(L.cert) + "</a>");
      var gr = o.att.filter(function (a) { return a.course_id === e.course_id; });
      var gtab = gr.length ? '<div class="ptable-w"><table class="ptable"><thead><tr><th scope="col">' + esc(L.gT) + '</th><th scope="col">' + esc(L.gS) + '</th><th scope="col">' + esc(L.gD) + "</th></tr></thead><tbody>" + gr.map(function (a) { return "<tr><td>" + esc(a.kind === "quiz" ? L.gQ + " " + (a.after_lesson || "") : L.gF) + "</td><td>" + esc(a.score_percent) + "% · " + esc(a.passed ? L.pass : L.fail) + '</td><td dir="ltr">' + esc(fmtDate(a.submitted_at, o.lang)) + "</td></tr>"; }).join("") + "</tbody></table></div>" : '<p class="muted">' + esc(L.noG) + "</p>";
      var pick = o.enr.length > 1 ? '<label class="cl-pick"><span class="sr">' + esc(L.ph) + '</span><select id="clSel">' + o.enr.map(function (x) { return '<option value="' + esc(x.course_id) + '"' + (x.course_id === cur ? " selected" : "") + ">" + esc(o.ttl(x.courses) || x.course_id) + "</option>"; }).join("") + "</select></label>" : "";
      var body = sub === "cont" ? '<section class="ps"><h2 class="ph2">' + esc(L.mod) + "</h2>" + mods + "</section>" : sub === "grd" ? '<section class="ps"><h2 class="ph2">' + esc(L.grd) + "</h2>" + gtab + "</section>" :
        '<div class="ph-g"><div class="ph-m"><section class="ps"><h2 class="ph2">' + esc(L.ann) + '</h2><p class="hs-h">' + esc(L.wel) + "</p><p class=\"muted\">" + esc(L.welT) + '</p></section><section class="ps"><h2 class="ph2">' + esc(L.mod) + "</h2>" + mods + '</section></div><aside class="ph-a"><section class="ps"><h2 class="ph2">' + esc(L.prog) + '</h2><div class="xbar" role="progressbar" aria-valuenow="' + pc + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(title) + '"><i style="width:' + pc + '%"></i></div><p class="muted">' + pc + "% · " + d + "/" + ls.length + '</p></section><section class="ps"><h2 class="ph2">' + esc(L.wtd) + "</h2>" + (todo.length ? '<ul class="cl-todo">' + todo.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>") + "</section></aside></div>";
      root.innerHTML = '<section class="cl-ban"><div class="cl-art" aria-hidden="true">' + art(e.course_id) + '</div><div class="cl-bt"><p class="hs-k">' + esc(catOf(e.course_id) || L.ph) + "</p><h2>" + esc(title) + "</h2>" + pick + "</div></section>" +
        '<nav class="cl-nav" role="tablist" aria-label="' + esc(title) + '">' + [["home", L.home], ["cont", L.cont], ["grd", L.grd]].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (t[0] === sub) + '" data-sub="' + t[0] + '">' + esc(t[1]) + "</button>"; }).join("") + "</nav>" + body;
    };
    root.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-sub],[data-go]"); if (!b || !root.contains(b)) return;
      if (b.dataset.sub) { sub = b.dataset.sub; draw(); } else { ev.preventDefault(); var tb = document.getElementById("pt-" + b.dataset.go); if (tb) tb.click(); }
    });
    root.addEventListener("change", function (ev) { if (ev.target.id === "clSel") { cur = ev.target.value; draw(); } });
    draw();
  }
  window.__portal = { mount: mount, home: home, classroom: classroom };
})();
