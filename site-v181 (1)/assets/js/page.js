/* Custom pages built in the admin panel (design.pages in site_settings). Public page: page.html#slug
   Blocks: h (heading), p (paragraph), img, btn, cards, vid (link to YouTube), hr. All text is set with textContent; links and images are checked against an allowlist. */
(function () {
  "use strict";
  if (document.body.dataset.page !== "page") return;
  var root = document.getElementById("pagebox"); if (!root) return;
  var S = window.SITE || {}, lang = "fa";
  try { lang = localStorage.getItem("am-lang") === "en" ? "en" : "fa"; } catch (e) {}
  var fa = lang === "fa";
  var mk = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  var tx = function (o) { return o && typeof o === "object" ? (o[lang] || o.en || o.fa || "") : String(o || ""); };
  var okLink = function (u) { return /^(https:\/\/[^\s"'<>]+|[\w\-]+\.html(#[\w\-]*)?|#[\w\-]+)$/i.test(u || ""); };
  var okImg = function (u) { return /^assets\/[\w\-\/.]+\.(webp|png|jpe?g|svg)$/i.test(u || "") || (S.supabaseUrl && String(u || "").indexOf(S.supabaseUrl + "/storage/v1/object/public/") === 0 && !/[\s"'<>]/.test(u)); };
  var slug = (location.hash || "").replace(/^#/, "") || new URLSearchParams(location.search).get("s") || "";
  var link = function (u, label, cls) { var a = mk("a", cls || "btn go", label); a.href = u; if (/^https:/i.test(u)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } return a; };
  function miss() { root.innerHTML = ""; root.appendChild(mk("h1", "ph1", fa ? "صفحه پیدا نشد" : "Page not found")); var p = mk("p", "muted", fa ? "این صفحه وجود ندارد یا مخفی شده است." : "This page does not exist or is hidden."); root.appendChild(p); root.appendChild(link("index.html", fa ? "رفتن به خانه" : "Go home")); }
  function render(pages) {
    var pg = (Array.isArray(pages) ? pages : []).filter(function (p) { return p && p.slug === slug && !p.hide; })[0];
    if (!pg) { miss(); return; }
    var title = tx(pg.t); document.title = title + " | " + tx(S.name);
    root.innerHTML = ""; root.appendChild(mk("h1", "ph1", title));
    (pg.b || []).slice(0, 80).forEach(function (b) {
      var k = b && b.k, t = tx(b && b.x), el = null;
      if (k === "h") el = mk("h2", "ph2", t);
      else if (k === "p") { el = mk("div", "pg-p"); t.split(/\n{2,}/).forEach(function (para) { if (para.trim()) el.appendChild(mk("p", "", para.trim())); }); }
      else if (k === "img" && okImg(b.u)) { el = mk("figure", "pg-f"); var im = mk("img"); im.src = b.u; im.alt = t; im.loading = "lazy"; im.width = 960; im.height = 540; el.appendChild(im); if (t) el.appendChild(mk("figcaption", "muted", t)); }
      else if (k === "btn" && okLink(b.u) && t) { el = mk("p", "pg-b"); el.appendChild(link(b.u, t)); }
      else if (k === "vid" && /^[\w-]{11}$/.test(b.u || "")) { el = mk("p", "pg-b"); el.appendChild(link("https://www.youtube.com/watch?v=" + b.u, (t || (fa ? "دیدن ویدیو در یوتیوب" : "Watch on YouTube")), "btn")); }
      else if (k === "hr") el = mk("hr", "pg-hr");
      else if (k === "cards" && Array.isArray(b.c)) {
        el = mk("div", "pg-cards"); b.c.slice(0, 12).forEach(function (c) { var ct = tx(c.t); if (!ct) return; var card = mk(c.u && okLink(c.u) ? "a" : "div", "pg-card"); if (c.u && okLink(c.u)) { card.href = c.u; if (/^https:/i.test(c.u)) { card.target = "_blank"; card.rel = "noopener noreferrer"; } } card.appendChild(mk("b", "", ct)); var d = tx(c.d); if (d) card.appendChild(mk("small", "", d)); el.appendChild(card); });
      }
      if (el) root.appendChild(el);
    });
  }
  function load() {
    var SB = window.__SB, cached = null;
    try { cached = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).pages; } catch (e) {}
    if (Array.isArray(cached)) render(cached); else root.appendChild(mk("p", "muted", fa ? "در حال بارگذاری…" : "Loading…"));
    if (SB && S.supabaseUrl) SB.rest("site_settings?select=value&key=eq.design.pages").then(function (r) { var v = r && r[0] && r[0].value; if (Array.isArray(v)) render(v); else if (!Array.isArray(cached)) miss(); }).catch(function () { if (!Array.isArray(cached)) miss(); });
    else if (!Array.isArray(cached)) miss();
  }
  window.addEventListener("hashchange", function () { slug = (location.hash || "").replace(/^#/, ""); load(); });
  load();
})();
