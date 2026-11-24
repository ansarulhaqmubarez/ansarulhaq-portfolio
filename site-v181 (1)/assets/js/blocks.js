/* Home page: custom sections built in the admin ("Section builder"), stored in site_settings design.blocks.
   Everything is inserted with textContent / validated URLs (no HTML from the database). */
(function () {
  "use strict";
  if ((document.body.dataset.page || "") !== "home") return;
  var R = document.documentElement, S = window.SITE || {};
  var lang = function () { return R.lang === "fa" ? "fa" : "en"; };
  var safe = function (u) { return /^(https:\/\/[^\s"'<>]+|assets\/[\w\/.\-]+|[\w\-]+\.html(#[\w\-]*)?|#[\w\-]+)$/i.test(u || ""); };
  var pick = function (o) { return o && typeof o === "object" ? (o[lang()] || o.en || o.fa || "") : ""; };
  var blocks = [];
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt) e.textContent = txt; return e; }
  function build(b) {
    var s = el("section", "blk blk-" + (/^(card|banner|quote|split|plain)$/.test(b.style) ? b.style : "card") + " rv"); s.dataset.blk = b.id;
    var tx = el("div", "blk-t");
    var ti = pick(b.title), te = pick(b.text), bt = pick(b.btn);
    if (ti) { var h = el("h2", "blk-h", ti); tx.appendChild(h); }
    if (te) te.split(/\n{2,}/).forEach(function (p) { tx.appendChild(el("p", "blk-p", p.trim())); });
    if (bt && safe(b.url)) { var a = el("a", "btn go", bt); a.href = b.url; if (/^https:/i.test(b.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } tx.appendChild(a); }
    if (b.img && safe(b.img)) { var im = el("img", "blk-i"); im.src = b.img; im.alt = ""; im.loading = "lazy"; im.decoding = "async"; s.appendChild(im); }
    s.appendChild(tx); return s;
  }
  function draw() {
    [].forEach.call(document.querySelectorAll("section[data-blk]"), function (n) { n.remove(); });
    var main = document.querySelector("main"); if (!main) return;
    blocks.slice(0, 12).forEach(function (b) {
      if (!b || !b.id || b.hidden) return; var s = build(b), at = b.at === "top" ? document.getElementById("ccPil") : (b.at === "middle" ? document.getElementById("about") : document.getElementById("contact"));
      if (at && at.parentNode === main) main.insertBefore(s, at); else main.appendChild(s);
    });
  }
  function load() { try { var d = JSON.parse(localStorage.getItem("am-design") || "{}"); if (Array.isArray(d.blocks)) blocks = d.blocks; } catch (e) {} draw(); }
  load();
  function fresh() {
    var SB = window.__SB; if (!SB || !S.supabaseUrl) return setTimeout(fresh, 500);
    SB.rest("site_settings?select=key,value&key=eq.design.blocks").then(function (rows) {
      var v = rows && rows[0] && rows[0].value; if (!Array.isArray(v)) return; blocks = v;
      try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.blocks = v; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
      draw();
    }).catch(function () {});
  }
  setTimeout(fresh, 300);
  var t1 = 0, t2 = 0;
  new MutationObserver(function () { clearTimeout(t1); t1 = setTimeout(draw, 150); }).observe(R, { attributes: true, attributeFilter: ["lang"] });
  new MutationObserver(function () { clearTimeout(t2); t2 = setTimeout(function () { if (blocks.length && !document.querySelector("section[data-blk]")) draw(); }, 200); }).observe(document.querySelector("main"), { childList: true });
})();
