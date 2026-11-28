/* Home page: shows up to 3 upcoming events (design.events) just above the contact section. Does nothing when there is no upcoming event. */
(function () {
  "use strict";
  var S = window.SITE || {}, list = [];
  var lang = function () { try { return localStorage.getItem("am-lang") === "en" ? "en" : "fa"; } catch (e) { return "fa"; } };
  var mk = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var tx = function (o, l) { return o && typeof o === "object" ? (o[l] || o.en || o.fa || "") : ""; };
  function when(e, l) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.date || ""); if (!m) return "";
    var d; try { d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)).toLocaleDateString(l === "fa" ? "fa-AF-u-ca-persian" : "en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }); } catch (x) { d = e.date; }
    return d + (e.time ? " · " + e.time + (l === "fa" ? " (وقت کابل)" : " (Kabul)") : "");
  }
  function draw() {
    var old = document.getElementById("events"); if (old) old.remove();
    var n = new Date(), today = n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate()), l = lang();
    var up = list.filter(function (e) { return e && !e.hide && (e.date || "") >= today && tx(e.title, l); }).sort(function (a, b) { return (a.date + (a.time || "")) < (b.date + (b.time || "")) ? -1 : 1; }).slice(0, 3);
    var anchor = document.getElementById("contact"); if (!up.length || !anchor) return;
    var sec = mk("section", "sec"); sec.id = "events"; var w = mk("div", "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"); sec.appendChild(w);
    w.appendChild(mk("h2", "text-xl lg:text-2xl font-extrabold", l === "fa" ? "رویدادها و وبینار پیش رو" : "Upcoming events and webinars"));
    var g = mk("div"); g.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:16px;margin-top:24px"; w.appendChild(g);
    up.forEach(function (e) {
      var c = mk("a", "card p-5"); c.href = "events.html"; c.style.cssText = "display:block;text-decoration:none;color:inherit";
      c.appendChild(mk("b", "", tx(e.title, l))); c.appendChild(mk("p", "text-sm text-mut", when(e, l)));
      if (tx(e.desc, l)) c.appendChild(mk("p", "text-sm", tx(e.desc, l).slice(0, 140)));
      g.appendChild(c);
    });
    var more = mk("a", "btn btn-p", l === "fa" ? "همهٔ رویدادها و ثبت‌نام" : "All events and registration"); more.href = "events.html"; more.style.marginTop = "20px"; more.style.display = "inline-flex"; w.appendChild(more);
    anchor.parentNode.insertBefore(sec, anchor);
  }
  function boot() {
    try { list = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).events || []; } catch (e) {} if (!Array.isArray(list)) list = [];
    draw();
    if (/^https:\/\/[\w.-]+\.supabase\.co\/?$/.test(S.supabaseUrl || "") && S.supabaseAnonKey) fetch(S.supabaseUrl.replace(/\/$/, "") + "/rest/v1/site_settings?select=value&key=eq.design.events", { headers: { apikey: S.supabaseAnonKey, Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : []; }).then(function (r) { var v = r && r[0] && r[0].value; if (Array.isArray(v)) { list = v; try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.events = v; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {} draw(); } }).catch(function () {});
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    var lb = document.getElementById("langBtn"); if (lb) lb.addEventListener("click", function () { setTimeout(draw, 60); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
