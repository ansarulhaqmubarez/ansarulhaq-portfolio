/* Gamification from REAL data only: XP, level, streak, badges. Zero stays zero.
   Streak uses the distinct dates of each lesson's last report (the database keeps one date per lesson). */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { h: "پیشرفت و نشان‌ها", xp: "امتیاز", lvl: "سطح", next: "تا سطح بعد", streak: "روز پشت‌سرهم", best: "بهترین رشته", days: "روز", earned: "گرفته شد", locked: "قفل",
      how: "امتیاز: هر درس ۱۰، هر آزمون پایانی قبول‌شده ۵۰، هر گواهی ۱۰۰.",
      b: { first: ["اولین درس", "یک درس را کامل کن"], five: ["۵ درس", "۵ درس را کامل کن"], t25: ["۲۵ درس", "۲۵ درس را کامل کن"], exam: ["قبولی آزمون", "یک آزمون پایانی را قبول شو"], cert: ["اولین گواهی", "یک گواهی بگیر"], s3: ["۳ روز پشت‌سرهم", "۳ روز پشت‌سرهم یاد بگیر"], s7: ["۷ روز پشت‌سرهم", "۷ روز پشت‌سرهم یاد بگیر"] } },
    en: { h: "Progress and badges", xp: "XP", lvl: "Level", next: "to next level", streak: "day streak", best: "Best streak", days: "days", earned: "Earned", locked: "Locked",
      how: "XP: 10 per lesson, 50 per passed final exam, 100 per certificate.",
      b: { first: ["First lesson", "Complete one lesson"], five: ["5 lessons", "Complete 5 lessons"], t25: ["25 lessons", "Complete 25 lessons"], exam: ["Exam passed", "Pass a final exam"], cert: ["First certificate", "Earn a certificate"], s3: ["3-day streak", "Learn 3 days in a row"], s7: ["7-day streak", "Learn 7 days in a row"] } }
  };
  var day = function (iso) { return String(iso).slice(0, 10); };
  function streaks(dates, today) {
    var set = {}; dates.forEach(function (d) { if (d) set[day(d)] = 1; });
    var ds = Object.keys(set).sort(), best = 0, run = 0, prev = null;
    ds.forEach(function (d) { var t = Date.parse(d + "T00:00:00Z"); run = prev !== null && t - prev === 864e5 ? run + 1 : 1; prev = t; if (run > best) best = run; });
    var cur = 0, t0 = Date.parse(day(today) + "T00:00:00Z"), t = set[day(today)] ? t0 : t0 - 864e5;
    while (set[new Date(t).toISOString().slice(0, 10)]) { cur++; t -= 864e5; }
    return { cur: cur, best: best };
  }
  /* o: {lang, prg:[{completed,last_report_at}], att:[{kind,passed}], cer:[{revoked}], now:ISO} */
  function calc(o) {
    var lessons = o.prg.filter(function (p) { return p.completed; }).length;
    var exams = o.att.filter(function (a) { return a.kind !== "quiz" && a.passed; }).length;
    var certs = o.cer.filter(function (c) { return !c.revoked; }).length;
    var xp = lessons * 10 + exams * 50 + certs * 100;
    var lvl = Math.floor(Math.sqrt(xp / 50)) + 1, base = 50 * (lvl - 1) * (lvl - 1), top = 50 * lvl * lvl;
    var st = streaks(o.prg.map(function (p) { return p.last_report_at; }), o.now || new Date().toISOString());
    var got = { first: lessons >= 1, five: lessons >= 5, t25: lessons >= 25, exam: exams >= 1, cert: certs >= 1, s3: st.best >= 3, s7: st.best >= 7 };
    return { xp: xp, lvl: lvl, base: base, top: top, st: st, got: got, lessons: lessons };
  }
  function html(o) {
    var L = T[o.lang === "fa" ? "fa" : "en"], c = calc(o), pc = Math.round((c.xp - c.base) * 100 / (c.top - c.base));
    var keys = ["first", "five", "t25", "exam", "cert", "s3", "s7"];
    return '<section class="ac-sec gm" aria-label="' + esc(L.h) + '"><h2>' + esc(L.h) + '</h2>' +
      '<div class="gm-top"><div class="gm-lv"><b>' + c.lvl + '</b><span>' + esc(L.lvl) + '</span></div>' +
      '<div class="gm-xp"><p><b>' + c.xp + '</b> ' + esc(L.xp) + ' · ' + (c.top - c.xp) + ' ' + esc(L.xp) + ' ' + esc(L.next) + '</p>' +
      '<div class="gm-bar" role="progressbar" aria-valuenow="' + pc + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(L.xp) + '"><i style="width:' + pc + '%"></i></div></div>' +
      '<div class="gm-st"><b>' + c.st.cur + '</b><span>' + esc(L.streak) + '</span><small>' + esc(L.best) + ': ' + c.st.best + ' ' + esc(L.days) + '</small></div></div>' +
      '<ul class="gm-b">' + keys.map(function (k) { var g = c.got[k]; return '<li class="' + (g ? "on" : "off") + '"><b>' + esc(L.b[k][0]) + '</b><span>' + esc(L.b[k][1]) + '</span><em>' + esc(g ? L.earned : L.locked) + '</em></li>'; }).join("") + '</ul>' +
      '<p class="muted gm-how">' + esc(L.how) + '</p></section>';
  }
  window.__gamify = { html: html, calc: calc };
})();
