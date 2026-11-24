/* Notification bell for signed-in users (students and staff). Reads public.notifications (RLS: own rows; staff also see broadcast rows).
   No text is stored in the database: this file turns "kind" into fa / en messages. */
(function () {
  "use strict";
  var S = window.SITE || {};
  function boot() {
    var SB = window.__SB, tools = document.querySelector("#site-header .tools");
    if (!SB || !tools || !S.supabaseUrl || !SB.get || !SB.get() || document.getElementById("bellBtn")) return;
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
    var lang = function () { try { var l = localStorage.getItem("am-lang"); if (l === "en" || l === "fa") return l; } catch (e) {} return document.documentElement.lang === "fa" ? "fa" : "en"; };
    var TX = {
      fa: { b: "اعلان‌ها", none: "اعلانی نیست.", all: "همه را خوانده‌شده کن", ago: "پیش", now: "همین حالا", m: "دقیقه", h: "ساعت", d: "روز",
        certificate_issued: "گواهی شما صادر شد", enrolled: "ثبت‌نام شما در دوره انجام شد", staff_new_enrollment: "ثبت‌نام تازه در دوره", staff_new_message: "پیام تماس تازه", staff_new_lead: "درخواست کار تازه" },
      en: { b: "Notifications", none: "No notifications.", all: "Mark all as read", ago: "ago", now: "just now", m: "min", h: "h", d: "d",
        certificate_issued: "Your certificate was issued", enrolled: "You are enrolled in the course", staff_new_enrollment: "New course enrolment", staff_new_message: "New contact message", staff_new_lead: "New work request" }
    };
    var cname = function (id, l) { var cs = S.courses || []; for (var i = 0; i < cs.length; i++) if (cs[i].id === id) { var t = cs[i].title; return (t && (t[l] || t.en || t.fa)) || id; } return id; };
    var ago = function (iso, X) { var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000); if (s < 60) return X.now; var m = s / 60; if (m < 60) return Math.floor(m) + " " + X.m + " " + X.ago; var h = m / 60; if (h < 24) return Math.floor(h) + " " + X.h + " " + X.ago; return Math.floor(h / 24) + " " + X.d + " " + X.ago; };
    var safeLink = function (u) { return /^[A-Za-z0-9_./#?=&%-]{1,200}$/.test(u || "") && !/^(https?:|javascript:|\/\/)/i.test(u) ? u : ""; };

    var wrap = document.createElement("div"); wrap.className = "dkg nt-w";
    wrap.innerHTML = '<button type="button" class="gt nt-b" id="bellBtn" aria-haspopup="true" aria-expanded="false" aria-controls="ntP"><svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0112 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10 20a2 2 0 004 0"/></svg><span class="nt-n" id="ntN" hidden aria-hidden="true"></span><span class="sr-only" id="ntL"></span></button>' +
      '<div class="nt-p" id="ntP" hidden role="region"><ul class="nt-l" id="ntU"></ul><button type="button" class="btn nt-all" id="ntAll"></button></div>';
    tools.insertBefore(wrap, tools.firstChild);
    var btn = wrap.querySelector("#bellBtn"), pan = wrap.querySelector("#ntP"), ul = wrap.querySelector("#ntU"), cntEl = wrap.querySelector("#ntN"), lab = wrap.querySelector("#ntL"), all = wrap.querySelector("#ntAll"), rows = [];
    function paint() {
      var l = lang(), X = TX[l], unread = rows.filter(function (r) { return !r.read_at; }).length;
      all.textContent = X.all; lab.textContent = X.b + (unread ? " (" + unread + ")" : "");
      cntEl.hidden = !unread; cntEl.textContent = unread > 9 ? "9+" : String(unread);
      ul.innerHTML = rows.length ? rows.map(function (r) {
        var link = safeLink(r.link), t = X[r.kind] || r.kind, c = r.course_id ? " · " + esc(cname(r.course_id, l)) : "";
        var inner = '<span>' + esc(t) + c + '</span><time>' + esc(ago(r.created_at, X)) + "</time>";
        return '<li class="' + (r.read_at ? "" : "un") + '">' + (link ? '<a href="' + esc(link) + '">' + inner + "</a>" : inner) + "</li>";
      }).join("") : '<li class="nt-none">' + esc(X.none) + "</li>";
    }
    function load() { SB.rest("notifications?select=id,created_at,kind,course_id,link,read_at&order=created_at.desc&limit=20").then(function (d) { rows = d || []; paint(); }).catch(function () {}); }
    btn.onclick = function (e) { e.stopPropagation(); var open = pan.hidden; pan.hidden = !open; btn.setAttribute("aria-expanded", String(open)); if (open) { paint(); load(); } };
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) { pan.hidden = true; btn.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !pan.hidden) { pan.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); } });
    all.onclick = function () { SB.send("PATCH", "notifications?read_at=is.null", { read_at: new Date().toISOString() }, "return=minimal").then(function () { rows.forEach(function (r) { r.read_at = r.read_at || new Date().toISOString(); }); paint(); }).catch(function () {}); };
    load(); setInterval(function () { if (!document.hidden) load(); }, 60000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) load(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 0); }); else setTimeout(boot, 0);
})();
