/* Admin: student manager (read-only). Search, sort, see each learner's courses and certificates, export CSV.
   Permissions are enforced by Supabase (staff only); nothing here changes data. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "فهرست دانشجویان ثبت‌نام‌شده. فقط خواندنی است؛ ابطال گواهی از بخش گواهی‌ها انجام می‌شود.", q: "جستجوی نام، کشور یا تحصیلات", sort: "مرتب‌سازی", s_new: "تازه‌ترین", s_name: "نام", s_cert: "بیشترین گواهی", s_enr: "بیشترین دوره", n: "نام", c: "کشور", e: "تحصیلات", d: "تاریخ عضویت", k: "دوره‌ها", g: "گواهی‌ها", total: "دانشجو", csv: "دریافت CSV", none: "دانشجویی پیدا نشد.", err: "خواندن ناموفق بود (فقط کارکنان).", det: "جزئیات", noEn: "در هیچ دوره‌ای ثبت‌نام نکرده.", noCe: "گواهی ندارد.", rv: "باطل‌شده", close: "بستن", more: "نمایش بیشتر" },
    en: { p: "Registered learners. Read-only; revoke certificates in the Certificates section.", q: "Search name, country or education", sort: "Sort", s_new: "Newest", s_name: "Name", s_cert: "Most certificates", s_enr: "Most courses", n: "Name", c: "Country", e: "Education", d: "Joined", k: "Courses", g: "Certificates", total: "learners", csv: "Download CSV", none: "No learners found.", err: "Could not read (staff only).", det: "Details", noEn: "Not enrolled in any course.", noCe: "No certificates.", rv: "revoked", close: "Close", more: "Show more" }
  };
  var csvCell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
  window.__adStudents = { mount: function (box, o) {
    var SB = o.SB, lang = o.lang === "fa" ? "fa" : "en", L = T[lang], rows = [], shown = 50;
    box.innerHTML = '<p class="muted">' + esc(L.p) + '</p><div class="stu-t"><label class="adc">' + esc(L.q) + '<input type="search" id="suQ" maxlength="80"></label><label class="adc">' + esc(L.sort) + ' <select id="suS"><option value="new">' + esc(L.s_new) + '</option><option value="name">' + esc(L.s_name) + '</option><option value="cert">' + esc(L.s_cert) + '</option><option value="enr">' + esc(L.s_enr) + '</option></select></label><button type="button" class="btn" id="suCsv">' + esc(L.csv) + '</button><span class="muted" id="suN"></span></div><div id="suL"></div><div id="suD" role="region" aria-live="polite"></div>';
    var list = box.querySelector("#suL"), det = box.querySelector("#suD");
    var ttl = function (t) { return t && typeof t === "object" ? (t[lang] || t.en || t.fa || "") : String(t || ""); };
    Promise.all([
      SB.rest("profiles?select=id,full_name,role,country,education,created_at&order=created_at.desc&limit=2000"),
      SB.rest("enrollments?select=user_id,course_id&limit=10000").catch(function () { return []; }),
      SB.rest("certificates?select=code,user_id,course_id,issued_at,revoked&limit=5000").catch(function () { return []; }),
      SB.rest("courses?select=id,title&limit=500").catch(function () { return []; })
    ]).then(function (r) {
      var en = {}, ce = {}, cn = {}; r[3].forEach(function (c) { cn[c.id] = ttl(c.title) || c.id; });
      r[1].forEach(function (e) { (en[e.user_id] = en[e.user_id] || []).push(e.course_id); });
      r[2].forEach(function (c) { (ce[c.user_id] = ce[c.user_id] || []).push(c); });
      rows = r[0].map(function (p) { return { id: p.id, name: p.full_name || "—", role: p.role, country: p.country || "", edu: p.education || "", at: (p.created_at || "").slice(0, 10), en: en[p.id] || [], ce: ce[p.id] || [], cn: cn }; });
      draw(); chart();
    }).catch(function () { list.innerHTML = '<p class="fstatus err">' + esc(L.err) + '</p>'; });
    /* new sign-ups per week, last 12 weeks (from profiles.created_at) */
    function chart() {
      var W = 12, wk = 6048e5, now = Date.now(), bins = []; for (var i = 0; i < W; i++) bins.push(0);
      rows.forEach(function (r) { var t = Date.parse(r.at); if (isNaN(t)) return; var k = Math.floor((now - t) / wk); if (k >= 0 && k < W) bins[W - 1 - k]++; });
      var mx = Math.max.apply(null, bins.concat([1])), tot = bins.reduce(function (a, b) { return a + b; }, 0), fa = lang === "fa", bw = 22, gap = 8, h = 90;
      var bars = bins.map(function (n, i) { var bh = Math.round(n / mx * (h - 14)); return '<rect x="' + (i * (bw + gap)) + '" y="' + (h - bh) + '" width="' + bw + '" height="' + bh + '" rx="4" fill="currentColor" opacity=".75"><title>' + n + '</title></rect>' + (n ? '<text x="' + (i * (bw + gap) + bw / 2) + '" y="' + (h - bh - 3) + '" text-anchor="middle" font-size="10" fill="currentColor">' + n + '</text>' : ''); }).join("");
      var old = box.querySelector("#suCh"); if (old) old.remove();
      box.insertAdjacentHTML("afterbegin", '<figure class="su-ch" id="suCh" style="margin:0 0 16px"><figcaption><b>' + esc(fa ? "ثبت‌نام‌های تازه در ۱۲ هفتهٔ اخیر" : "New sign-ups, last 12 weeks") + '</b> <small>(' + tot + ')</small></figcaption><svg viewBox="0 0 ' + (W * (bw + gap)) + ' ' + h + '" width="100%" height="110" role="img" aria-label="' + esc((fa ? "نمودار ثبت‌نام هفتگی، مجموع " : "Weekly sign-ups chart, total ") + tot) + '" style="color:var(--accent,#0B6DB8);max-width:560px;display:block">' + bars + '</svg></figure>');
    }
    function view() {
      var q = box.querySelector("#suQ").value.trim().toLowerCase(), s = box.querySelector("#suS").value;
      var v = rows.filter(function (x) { return !q || (x.name + " " + x.country + " " + x.edu).toLowerCase().indexOf(q) >= 0; });
      v.sort(function (a, b) { return s === "name" ? a.name.localeCompare(b.name) : s === "cert" ? b.ce.length - a.ce.length : s === "enr" ? b.en.length - a.en.length : (b.at > a.at ? 1 : b.at < a.at ? -1 : 0); });
      return v;
    }
    function draw() {
      var v = view(); box.querySelector("#suN").textContent = v.length + " " + L.total;
      list.innerHTML = v.length ? '<table class="adt"><thead><tr><th>' + esc(L.n) + '</th><th>' + esc(L.c) + '</th><th>' + esc(L.e) + '</th><th>' + esc(L.d) + '</th><th>' + esc(L.k) + '</th><th>' + esc(L.g) + '</th><th><span class="sr-only">' + esc(L.det) + '</span></th></tr></thead><tbody>' + v.slice(0, shown).map(function (x) { return '<tr><td>' + esc(x.name) + (/admin/.test(x.role || "") ? ' <b class="cm-e">' + esc(x.role) + '</b>' : "") + '</td><td>' + esc(x.country) + '</td><td>' + esc(x.edu) + '</td><td dir="ltr">' + esc(x.at) + '</td><td>' + x.en.length + '</td><td>' + x.ce.length + '</td><td><button type="button" class="btn" data-id="' + esc(x.id) + '">' + esc(L.det) + '</button></td></tr>'; }).join("") + '</tbody></table>' + (v.length > shown ? '<p><button type="button" class="btn" id="suMore">' + esc(L.more) + '</button></p>' : "") : '<p class="muted">' + esc(L.none) + '</p>';
    }
    box.addEventListener("input", function (e) { if (e.target.id === "suQ") { shown = 50; draw(); } });
    box.addEventListener("change", function (e) { if (e.target.id === "suS") { shown = 50; draw(); } });
    box.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button"); if (!b) return;
      if (b.id === "suMore") { shown += 50; draw(); return; }
      if (b.id === "suCsv") {
        var head = [L.n, L.c, L.e, L.d, L.k, L.g].map(csvCell).join(","), body = view().map(function (x) { return [x.name, x.country, x.edu, x.at, x.en.length, x.ce.length].map(csvCell).join(","); });
        var blob = new Blob(["﻿" + [head].concat(body).join("\r\n")], { type: "text/csv;charset=utf-8" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "students.csv"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); return;
      }
      if (b.id === "suX") { det.innerHTML = ""; return; }
      if (b.dataset.id) {
        var x = rows.filter(function (r) { return r.id === b.dataset.id; })[0]; if (!x) return;
        det.innerHTML = '<div class="stu-d"><h3>' + esc(x.name) + '</h3><h4>' + esc(L.k) + '</h4>' + (x.en.length ? '<ul class="chips">' + x.en.map(function (c) { return '<li>' + esc(x.cn[c] || c) + '</li>'; }).join("") + '</ul>' : '<p class="muted">' + esc(L.noEn) + '</p>') + '<h4>' + esc(L.g) + '</h4>' + (x.ce.length ? '<ul class="chips">' + x.ce.map(function (c) { return '<li dir="ltr"><a href="verify.html?code=' + encodeURIComponent(c.code) + '" target="_blank" rel="noopener noreferrer">' + esc(c.code) + '</a>' + (c.revoked ? ' (' + esc(L.rv) + ')' : "") + '</li>'; }).join("") + '</ul>' : '<p class="muted">' + esc(L.noCe) + '</p>') + '<p><button type="button" class="btn" id="suX">' + esc(L.close) + '</button></p></div>';
        det.scrollIntoView({ block: "nearest" });
      }
    });
  } };
})();
