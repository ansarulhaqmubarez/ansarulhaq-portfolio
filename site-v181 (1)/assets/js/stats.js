/* Live, honest numbers on the home page. Reads public_stats() (no personal data).
   Zero shows as zero. If the backend is unreachable the section stays hidden. */
(function () {
  "use strict";
  var S = window.SITE || {}, root = document.getElementById("liveStats");
  if (!root || !S.supabaseUrl || !S.supabaseAnonKey) return;
  var lang = "fa"; try { lang = localStorage.getItem("am-lang") || document.documentElement.lang || "fa"; } catch (e) { lang = document.documentElement.lang || "fa"; }
  if (lang !== "en") lang = "fa";
  var T = {
    fa: { h: "آکادمی در یک نگاه", sub: "عددهای واقعی، بدون ساختگی", students: "دانشجو", courses: "دوره", graduates: "فارغ‌التحصیل", certificates: "گواهی صادرشده", visits: "بازدید",
      recent: "فعالیت اخیر", cert: "یک گواهی صادر شد", enrolled: "یک ثبت‌نام تازه در دوره", ago: "پیش", m: "دقیقه", h2: "ساعت", d: "روز", now: "همین حالا", none: "هنوز فعالیتی ثبت نشده است." },
    en: { h: "The academy at a glance", sub: "Real numbers, nothing made up", students: "Students", courses: "Courses", graduates: "Graduates", certificates: "Certificates issued", visits: "Visits",
      recent: "Recent activity", cert: "A certificate was issued", enrolled: "A new enrolment in", ago: "ago", m: "min", h2: "h", d: "d", now: "just now", none: "No activity recorded yet." }
  }[lang];
  var nf = function (n) { try { return new Intl.NumberFormat(lang === "fa" ? "fa-AF" : "en").format(n); } catch (e) { return String(n); } };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ago(iso) { var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return T.now; var m = s / 60; if (m < 60) return nf(Math.floor(m)) + " " + T.m + " " + T.ago;
    var h = m / 60; if (h < 24) return nf(Math.floor(h)) + " " + T.h2 + " " + T.ago; return nf(Math.floor(h / 24)) + " " + T.d + " " + T.ago; }
  function cname(id) { var cs = S.courses || []; for (var i = 0; i < cs.length; i++) if (cs[i].id === id) { var t = cs[i].title; return t && (t[lang] || t.en || t.fa) || id; } return id; }
  fetch(S.supabaseUrl.replace(/\/$/, "") + "/rest/v1/rpc/public_stats", { method: "POST",
    headers: { "Content-Type": "application/json", apikey: S.supabaseAnonKey, Authorization: "Bearer " + S.supabaseAnonKey }, body: "{}" })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (d) {
      if (!d || typeof d !== "object") return;
      var items = [["students", d.students], ["courses", d.courses], ["graduates", d.graduates], ["certificates", d.certificates], ["visits", d.visits]];
      var rec = (d.recent || []).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; }).slice(0, 4);
      root.innerHTML = '<div class="ls-in"><h2 class="ls-h">' + esc(T.h) + '</h2><p class="ls-sub">' + esc(T.sub) + '</p>' +
        '<ul class="ls-grid">' + items.map(function (x) { return '<li class="ls-c"><b class="ls-n" data-n="' + (+x[1] || 0) + '">0</b><span>' + esc(T[x[0]]) + '</span></li>'; }).join("") + '</ul>' +
        '<h3 class="ls-rh">' + esc(T.recent) + '</h3><ul class="ls-rec" aria-live="polite">' +
        (rec.length ? rec.map(function (r) { return '<li><i class="ls-dot" aria-hidden="true"></i><span>' + esc(r.kind === "certificate" ? T.cert : T.enrolled) + (r.kind === "certificate" ? "" : ": " + esc(cname(r.course))) + '</span><time>' + esc(ago(r.at)) + '</time></li>'; }).join("") : '<li class="ls-none">' + esc(T.none) + '</li>') + '</ul></div>';
      root.hidden = false;
      var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      [].forEach.call(root.querySelectorAll(".ls-n"), function (el) {
        var to = +el.getAttribute("data-n") || 0;
        if (reduce || to === 0) { el.textContent = nf(to); return; }
        var t0 = null, dur = 1100;
        function step(t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur); el.textContent = nf(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); }
        if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); requestAnimationFrame(step); } }); io.observe(el); } else el.textContent = nf(to);
      });
    }).catch(function () {});
})();
