/* Events and webinars (design.events, managed in admin). Upcoming first, past below. Registration by WhatsApp or e-mail; .ics download in Kabul time. */
(function () {
  "use strict";
  if (document.body.dataset.page !== "events") return;
  var root = document.getElementById("evbox"); if (!root) return;
  var S = window.SITE || {}, lang = "fa", LAST = [];
  try { lang = localStorage.getItem("am-lang") === "en" ? "en" : "fa"; } catch (e) {}
  var mk = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  var tx = function (o) { return o && typeof o === "object" ? (o[lang] || o.en || o.fa || "") : String(o || ""); };
  var safe = function (u) { return /^https:\/\/[^\s"'<>]+$/i.test(u || "") ? u : ""; };
  var KIND = { webinar: ["وبینار", "Webinar"], workshop: ["کارگاه", "Workshop"], screening: ["نمایش فیلم", "Screening"], live: ["پخش زنده", "Live session"], other: ["رویداد", "Event"] };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var today = function () { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  function fmtDate(e) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.date || ""); if (!m) return "";
    try { return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)).toLocaleDateString(lang === "fa" ? "fa-AF-u-ca-persian" : "en-GB", { year: "numeric", month: "long", day: "numeric", weekday: "long", timeZone: "UTC" }); } catch (x) { return e.date; }
  }
  function ics(e) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.date || ""), t = /^(\d{2}):(\d{2})$/.exec(e.time || "10:00") || [0, "10", "00"]; if (!m) return null;
    var s = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +t[1], +t[2]) - 270 * 60000), en = new Date(s.getTime() + 60 * 60000);
    var f = function (d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z"; };
    var cl = function (x) { return String(x || "").replace(/[\r\n]+/g, " ").replace(/([,;\\])/g, "\\$1"); };
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CineCode Academy//Events//EN", "BEGIN:VEVENT", "UID:" + e.id + "@cinecode", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(s), "DTEND:" + f(en),
      "SUMMARY:" + cl(tx(e.title)), "DESCRIPTION:" + cl(tx(e.desc)), "LOCATION:" + cl(e.place || safe(e.url)), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }
  function card(e, past) {
    var fa = lang === "fa", c = mk("article", "pf-card ev-c" + (past ? " ev-past" : "")), k = KIND[e.kind] || KIND.other;
    c.appendChild(mk("span", "pill", k[fa ? 0 : 1]));
    c.appendChild(mk("h2", "rl-t", tx(e.title)));
    var meta = [fmtDate(e), e.time ? e.time + (fa ? " (وقت کابل)" : " (Kabul time)") : "", e.place || ""].filter(Boolean).join(" · ");
    if (meta) c.appendChild(mk("p", "muted", meta));
    if (tx(e.desc)) c.appendChild(mk("p", "", tx(e.desc)));
    var row = mk("p", "ev-act");
    if (!past) {
      var msg = (fa ? "سلام، می‌خواهم در این رویداد ثبت‌نام کنم: " : "Hello, I would like to register for: ") + tx(e.title) + " (" + (e.date || "") + ")";
      var ph = ((S.phones && S.phones[0] && S.phones[0].n) || S.phone || "").replace(/[^\d]/g, "");
      if (ph) { var w = mk("a", "btn go", fa ? "ثبت‌نام با واتساپ" : "Register on WhatsApp"); w.href = "https://wa.me/" + ph + "?text=" + encodeURIComponent(msg); w.target = "_blank"; w.rel = "noopener noreferrer"; row.appendChild(w); row.appendChild(document.createTextNode(" ")); }
      if (S.contactEmail) { var m = mk("a", "btn", fa ? "ثبت‌نام با ایمیل" : "Register by email"); m.href = "mailto:" + S.contactEmail + "?subject=" + encodeURIComponent(tx(e.title)) + "&body=" + encodeURIComponent(msg); row.appendChild(m); row.appendChild(document.createTextNode(" ")); }
      if (safe(e.url)) { var j = mk("a", "btn", fa ? "لینک ورود" : "Join link"); j.href = safe(e.url); j.target = "_blank"; j.rel = "noopener noreferrer"; row.appendChild(j); row.appendChild(document.createTextNode(" ")); }
      var ic = ics(e);
      if (ic) { var b = mk("button", "btn", fa ? "افزودن به تقویم" : "Add to calendar"); b.type = "button"; b.onclick = function () { var u = URL.createObjectURL(new Blob([ic], { type: "text/calendar" })), a = mk("a"); a.href = u; a.download = "event.ics"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 2000); }; row.appendChild(b); }
    } else if (safe(e.url)) { var r = mk("a", "btn", fa ? "دیدن ضبط / لینک" : "Watch recording / link"); r.href = safe(e.url); r.target = "_blank"; r.rel = "noopener noreferrer"; row.appendChild(r); }
    if (row.childNodes.length) c.appendChild(row);
    return c;
  }
  function render(list) {
    lang = document.documentElement.lang === "en" ? "en" : "fa"; var fa = lang === "fa"; LAST = list; root.innerHTML = "";
    document.title = (fa ? "رویدادها و وبینار" : "Events and Webinars") + " | CineCode Academy";
    var nav = mk("nav", "crumb"); nav.setAttribute("aria-label", "Breadcrumb"); var a0 = mk("a", "", fa ? "خانه" : "Home"); a0.href = "index.html"; nav.appendChild(a0); nav.appendChild(document.createTextNode(" / ")); nav.appendChild(mk("span", "", fa ? "رویدادها" : "Events")); root.appendChild(nav);
    root.appendChild(mk("h1", "ph1", fa ? "رویدادها و وبینار" : "Events and Webinars"));
    root.appendChild(mk("p", "muted", fa ? "ثبت‌نام رایگان است. زمان‌ها به وقت کابل نوشته شده‌اند." : "Registration is free. Times are in Kabul time."));
    var all = (Array.isArray(list) ? list : []).filter(function (e) { return e && !e.hide && (e.title && (e.title.fa || e.title.en)); }), t = today();
    var up = all.filter(function (e) { return (e.date || "9999") >= t; }).sort(function (a, b) { return (a.date + (a.time || "")) < (b.date + (b.time || "")) ? -1 : 1; });
    var pa = all.filter(function (e) { return (e.date || "9999") < t; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    root.appendChild(mk("h2", "pf-sub", fa ? "رویدادهای پیش رو" : "Upcoming"));
    if (up.length) { var g = mk("div", "pf-cards"); up.forEach(function (e) { g.appendChild(card(e, false)); }); root.appendChild(g); }
    else { root.appendChild(mk("p", "muted", fa ? "فعلاً رویداد برنامه‌ریزی‌شده‌ای نداریم. خبر بعدی را از شبکه‌ها یا خبرنامه ببین." : "No event is scheduled right now. Watch the social channels or the newsletter.")); }
    if (pa.length) { root.appendChild(mk("h2", "pf-sub", fa ? "رویدادهای گذشته" : "Past events")); var g2 = mk("div", "pf-cards"); pa.slice(0, 30).forEach(function (e) { g2.appendChild(card(e, true)); }); root.appendChild(g2); }
  }
  var cached = null; try { cached = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).events; } catch (e) {}
  render(Array.isArray(cached) ? cached : []);
  new MutationObserver(function () { var l = document.documentElement.lang === "en" ? "en" : "fa"; if (l !== lang) render(LAST); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  var SB = window.__SB;
  if (SB && SB.on && SB.on()) SB.rest("site_settings?select=value&key=eq.design.events").then(function (r) {
    var v = r && r[0] && r[0].value; if (!Array.isArray(v)) return;
    try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.events = v; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
    render(v);
  }).catch(function () {});
})();
