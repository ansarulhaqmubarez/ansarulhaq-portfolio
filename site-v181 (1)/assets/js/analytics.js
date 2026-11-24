/* Admin analytics (staff only). Reads rpc/admin_analytics. Charts are hand-built SVG/HTML (no libraries).
   Real data only: zero shows as zero. Permissions are enforced by Supabase, not here. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { h: "آمار و تحلیل بازدید", today: "امروز", d7: "۷ روز", d30: "۳۰ روز", d90: "۹۰ روز", custom: "بازهٔ دلخواه", from: "از", to: "تا", apply: "نمایش",
      views: "بازدید صفحه", visitors: "بازدیدکنندهٔ یکتا", registers: "ثبت‌نام تازه", enrollments: "ثبت‌نام در دوره", certificates: "گواهی صادرشده", messages: "پیام تماس", leads: "درخواست کار",
      trend: "روند بازدید", pages: "پربازدیدترین صفحه‌ها", courses: "پربازدیدترین دوره‌ها", devices: "دستگاه‌ها", browsers: "مرورگرها", sources: "منبع ورود", direct: "مستقیم",
      success: "موفقیت دانشجویان", attempts: "آزمون ثبت‌شده", passed: "قبول", rate: "درصد قبولی", pending: "در انتظار بررسی", gender: "جنسیت", male: "مرد", female: "زن", unknown: "نامشخص",
      latest: "آخرین ثبت‌نام‌ها", none: "داده‌ای در این بازه نیست.", err: "آمار بارگذاری نشد. آیا فایل cms-1.sql را در Supabase اجرا کرده‌اید؟", load: "در حال بارگذاری…",
      mobile: "موبایل", tablet: "تبلت", desktop: "دسکتاپ", data: "جدول داده", day: "روز", noname: "بدون نام", note: "فقط عددهای واقعی؛ بدون نام و اطلاعات شخصی بازدیدکننده." },
    en: { h: "Visit analytics", today: "Today", d7: "7 days", d30: "30 days", d90: "90 days", custom: "Custom range", from: "From", to: "To", apply: "Show",
      views: "Page views", visitors: "Unique visitors", registers: "New sign-ups", enrollments: "Course enrolments", certificates: "Certificates issued", messages: "Contact messages", leads: "Work requests",
      trend: "Visit trend", pages: "Top pages", courses: "Top courses", devices: "Devices", browsers: "Browsers", sources: "Traffic sources", direct: "Direct",
      success: "Student success", attempts: "Exams taken", passed: "Passed", rate: "Pass rate", pending: "Waiting for review", gender: "Gender", male: "Male", female: "Female", unknown: "Unknown",
      latest: "Latest sign-ups", none: "No data in this range.", err: "Could not load analytics. Did you run cms-1.sql in Supabase?", load: "Loading…",
      mobile: "Mobile", tablet: "Tablet", desktop: "Desktop", data: "Data table", day: "Day", noname: "No name", note: "Real numbers only; no visitor names or personal data." }
  };
  var COL = ["#0B6DB8", "#1F9AD6", "#39A9E8", "#F2A93B", "#2BB673", "#E4572E"];
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }

  window.__adAnalytics = { mount: function (box, o) {
    var SB = o.SB, lang = o.lang === "fa" ? "fa" : "en", L = T[lang], S = o.S || {};
    var nf = function (n) { try { return new Intl.NumberFormat(lang === "fa" ? "fa-AF" : "en").format(n); } catch (e) { return String(n); } };
    var courseName = function (id) { var cs = S.courses || []; for (var i = 0; i < cs.length; i++) if (cs[i].id === id) { var t = cs[i].title; return (t && (t[lang] || t.en || t.fa)) || id; } return id; };
    var label = function (k) { return L[k] || k; };
    var cur = "d7", from = iso(addDays(new Date(), -6)), to = iso(new Date());

    box.innerHTML = '<div class="an"><p class="muted an-note">' + esc(L.note) + '</p>' +
      '<div class="an-bar" role="group" aria-label="' + esc(L.h) + '">' +
      ["today", "d7", "d30", "d90", "custom"].map(function (k) { return '<button type="button" class="an-b" data-r="' + k + '" aria-pressed="' + (k === cur) + '">' + esc(L[k]) + '</button>'; }).join("") +
      '</div><form class="an-cu" hidden><label>' + esc(L.from) + ' <input type="date" name="f" dir="ltr"></label><label>' + esc(L.to) + ' <input type="date" name="t" dir="ltr"></label><button class="btn go" type="submit">' + esc(L.apply) + '</button></form>' +
      '<div class="an-out" aria-live="polite"><p class="muted">' + esc(L.load) + '</p></div></div>';
    var out = box.querySelector(".an-out"), cu = box.querySelector(".an-cu");

    function range(k) {
      var t = new Date();
      if (k === "today") return [iso(t), iso(t)];
      if (k === "d7") return [iso(addDays(t, -6)), iso(t)];
      if (k === "d30") return [iso(addDays(t, -29)), iso(t)];
      if (k === "d90") return [iso(addDays(t, -89)), iso(t)];
      return [from, to];
    }
    function card(k, v) { return '<li class="an-c"><b class="an-n">' + nf(v || 0) + '</b><span>' + esc(L[k]) + '</span></li>'; }

    function line(daily) {
      var W = 640, H = 220, pl = 40, pr = 12, pt = 14, pb = 28, n = daily.length;
      if (!n) return "";
      var max = 1; daily.forEach(function (d) { max = Math.max(max, d.views, d.visitors); });
      var step = Math.pow(10, Math.floor(Math.log(max) / Math.LN10)), top = Math.ceil(max / step) * step; if (top < 4) top = 4;
      var X = function (i) { return pl + (n === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (n - 1)); }, Y = function (v) { return pt + (H - pt - pb) * (1 - v / top); };
      var path = function (key) { return daily.map(function (d, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(d[key]).toFixed(1); }).join(""); };
      var area = function (key) { return path(key) + "L" + X(n - 1).toFixed(1) + " " + Y(0) + "L" + X(0).toFixed(1) + " " + Y(0) + "Z"; };
      var grid = [0, .5, 1].map(function (f) { var v = Math.round(top * f), y = Y(v); return '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '" class="an-gl"/><text x="' + (pl - 6) + '" y="' + (y + 4) + '" text-anchor="end" class="an-tx">' + nf(v) + '</text>'; }).join("");
      var ticks = [0, Math.floor((n - 1) / 2), n - 1].filter(function (v, i, a) { return a.indexOf(v) === i; }).map(function (i) { return '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle" class="an-tx">' + esc(daily[i].d.slice(5)) + '</text>'; }).join("");
      var dots = n <= 31 ? daily.map(function (d, i) { return '<circle cx="' + X(i) + '" cy="' + Y(d.views) + '" r="3" fill="' + COL[0] + '"><title>' + esc(d.d) + ": " + nf(d.views) + "</title></circle>"; }).join("") : "";
      var svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="an-svg" role="img" aria-label="' + esc(L.trend) + '" dir="ltr">' + grid +
        '<path d="' + area("views") + '" fill="' + COL[0] + '" opacity=".14"/><path d="' + path("views") + '" fill="none" stroke="' + COL[0] + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="' + path("visitors") + '" fill="none" stroke="' + COL[1] + '" stroke-width="2.4" stroke-dasharray="5 4" stroke-linejoin="round"/>' + dots + ticks + "</svg>";
      var legend = '<p class="an-lg"><i style="background:' + COL[0] + '"></i>' + esc(L.views) + ' <i class="d" style="border-color:' + COL[1] + '"></i>' + esc(L.visitors) + "</p>";
      var tbl = '<details class="an-dt"><summary>' + esc(L.data) + '</summary><div class="an-tw"><table><thead><tr><th>' + esc(L.day) + "</th><th>" + esc(L.views) + "</th><th>" + esc(L.visitors) + "</th></tr></thead><tbody>" +
        daily.map(function (d) { return "<tr><td dir=\"ltr\">" + esc(d.d) + "</td><td>" + nf(d.views) + "</td><td>" + nf(d.visitors) + "</td></tr>"; }).join("") + "</tbody></table></div></details>";
      return svg + legend + tbl;
    }
    function bars(list, fmt) {
      if (!list || !list.length) return '<p class="muted">' + esc(L.none) + "</p>";
      var max = 1; list.forEach(function (x) { max = Math.max(max, x.n); });
      return '<ul class="an-hb">' + list.map(function (x) { var k = fmt ? fmt(x) : x.k; return '<li><span class="an-bl" dir="auto">' + esc(k) + '</span><span class="an-bt"><i style="width:' + Math.max(2, Math.round(x.n / max * 100)) + '%"></i></span><b>' + nf(x.n) + "</b></li>"; }).join("") + "</ul>";
    }
    function donut(list, fmt) {
      var tot = 0; (list || []).forEach(function (x) { tot += x.n; });
      if (!tot) return '<p class="muted">' + esc(L.none) + "</p>";
      var R = 42, C = 2 * Math.PI * R, off = 0;
      var segs = list.map(function (x, i) { var len = x.n / tot * C, s = '<circle cx="60" cy="60" r="' + R + '" fill="none" stroke="' + COL[i % COL.length] + '" stroke-width="20" stroke-dasharray="' + len.toFixed(2) + " " + (C - len).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 60 60)"><title>' + esc(fmt(x)) + ": " + nf(x.n) + "</title></circle>"; off += len; return s; }).join("");
      return '<div class="an-do"><svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="' + esc(fmt(list[0])) + '">' + segs + '</svg><ul class="an-lgd">' +
        list.map(function (x, i) { return '<li><i style="background:' + COL[i % COL.length] + '"></i><span>' + esc(fmt(x)) + "</span><b>" + nf(x.n) + " (" + Math.round(x.n / tot * 100) + "%)</b></li>"; }).join("") + "</ul></div>";
    }

    function render(d) {
      var t = d.totals || {}, st = d.students || {}, rate = st.attempts ? Math.round(st.passed / st.attempts * 100) : 0;
      var g = []; Object.keys(st.gender || {}).forEach(function (k) { g.push({ k: k, n: st.gender[k] }); });
      out.innerHTML = '<ul class="an-cards">' + ["views", "visitors", "registers", "enrollments", "certificates", "messages", "leads"].map(function (k) { return card(k, t[k]); }).join("") + "</ul>" +
        '<div class="an-pn"><h3>' + esc(L.trend) + "</h3>" + line(d.daily || []) + "</div>" +
        '<div class="an-gr"><div class="an-pn"><h3>' + esc(L.pages) + "</h3>" + bars(d.top_pages, function (x) { return x.path; }) + "</div>" +
        '<div class="an-pn"><h3>' + esc(L.courses) + "</h3>" + bars(d.top_courses, function (x) { return courseName(x.course); }) + "</div>" +
        '<div class="an-pn"><h3>' + esc(L.devices) + "</h3>" + donut(d.devices, function (x) { return label(x.k); }) + "</div>" +
        '<div class="an-pn"><h3>' + esc(L.browsers) + "</h3>" + donut(d.browsers, function (x) { return x.k; }) + "</div>" +
        '<div class="an-pn"><h3>' + esc(L.sources) + "</h3>" + bars(d.sources, function (x) { return x.k === "direct" ? L.direct : x.k; }) + "</div></div>" +
        '<h3 class="an-h2">' + esc(L.success) + '</h3><ul class="an-cards">' + card("attempts", st.attempts) + card("passed", st.passed) +
        '<li class="an-c"><b class="an-n">' + nf(rate) + '%</b><span>' + esc(L.rate) + "</span></li>" + card("pending", st.pending_review) + "</ul>" +
        '<div class="an-gr"><div class="an-pn"><h3>' + esc(L.gender) + "</h3>" + donut(g, function (x) { return label(x.k); }) + "</div>" +
        '<div class="an-pn"><h3>' + esc(L.latest) + '</h3><ul class="an-lt">' + ((st.latest || []).length ? st.latest.map(function (x) { return "<li><span dir=\"auto\">" + esc(x.name || L.noname) + '</span><time dir="ltr">' + esc(String(x.at).slice(0, 10)) + "</time></li>"; }).join("") : '<li class="muted">' + esc(L.none) + "</li>") + "</ul></div></div>";
    }
    function load(r) {
      var rg = range(r); out.innerHTML = '<p class="muted">' + esc(L.load) + "</p>";
      SB.send("POST", "rpc/admin_analytics", { p_from: rg[0], p_to: rg[1] }).then(render).catch(function () { out.innerHTML = '<p class="fstatus err" role="alert">' + esc(L.err) + "</p>"; });
    }
    [].forEach.call(box.querySelectorAll(".an-b"), function (b) {
      b.onclick = function () { cur = b.dataset.r; [].forEach.call(box.querySelectorAll(".an-b"), function (x) { x.setAttribute("aria-pressed", String(x === b)); }); cu.hidden = cur !== "custom"; if (cur !== "custom") load(cur); };
    });
    cu.elements.f.value = from; cu.elements.t.value = to;
    cu.addEventListener("submit", function (e) { e.preventDefault(); if (cu.elements.f.value && cu.elements.t.value) { from = cu.elements.f.value; to = cu.elements.t.value; load("custom"); } });
    load(cur);
  } };
})();
