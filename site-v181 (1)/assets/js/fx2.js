/* fx2.js: motion layer 2 (own code, no libraries).
   1. kinetic slogans: type, hold, dissolve, next   2. 3D tilt + glare on cards   3. magnetic buttons
   4. hero particle constellation (mouse reactive)   5. staggered reveal of card grids
   Everything stops for prefers-reduced-motion and for the "lite" switch. Touch devices skip tilt, magnet and particles. */
(function () {
  "use strict";
  var R = document.documentElement, S = window.SITE || {}, PAGE = document.body.dataset.page || "home";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var moving = function () { return !still && !R.classList.contains("lite"); };
  if (PAGE === "admin") return;
  /* admin switches (site_settings design.*): cached in localStorage so the page never waits for the network */
  var D = {}; try { D = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; } catch (e) {}
  var on = function (k) { return D[k] !== false; };
  if (D.motion === "off") R.classList.add("lite");
  function refreshD() {
    var SB = window.__SB; if (!SB || !S.supabaseUrl) return;
    SB.rest("site_settings?select=key,value&key=like.design.*").then(function (rows) {
      var o = {}; (rows || []).forEach(function (r) { o[r.key.replace("design.", "")] = r.value; });
      try { localStorage.setItem("am-design", JSON.stringify(o)); } catch (e) {}
    }).catch(function () {});
  }
  setTimeout(refreshD, 900);

  /* ---------- 1. kinetic slogans ---------- */
  var kT = 0, kKey = "";
  function kinetic() {
    var sl = $("#ccSl"), C = S.cc; if (!sl || !C || !C.slogans || !C.slogans.length) return;
    var lang = R.lang === "fa" ? "fa" : "en", list = C.slogans.map(function (x) { return x[lang] || x.en || ""; }).filter(Boolean);
    var key = lang + list.join("|"); if (key === kKey && $("#ccKin")) return; kKey = key; clearTimeout(kT);
    var p = $("#ccKin");
    if (!p) { p = document.createElement("p"); p.id = "ccKin"; p.className = "cc-kin run"; p.setAttribute("aria-hidden", "true"); p.innerHTML = '<span class="kt"></span><i class="kc"></i>'; sl.parentNode.insertBefore(p, sl); }
    var out = $(".kt", p), cur = $(".kc", p), i = 0, n = 0;
    out.textContent = list.join(" · "); cur.hidden = true; return; /* v145: static, no typing loop (it blinked) */
    if (!moving()) { out.textContent = list[0]; cur.hidden = true; return; }
    cur.hidden = false;
    (function type() {
      var w = list[i]; p.classList.remove("out"); n++; out.textContent = w.slice(0, n);
      if (n < w.length) { kT = setTimeout(type, 38); return; }
      kT = setTimeout(function () { p.classList.add("out"); kT = setTimeout(function () { i = (i + 1) % list.length; n = 0; out.textContent = ""; type(); }, 900); }, 2200);
    })();
  }

  /* ---------- 2. 3D tilt + glare ---------- */
  var TILT = ".card,.ac-card,.cc-p,.cc-misb,.pc,.dcard,.pcards a,.gal a,.cert-card,.fx-t";
  var tiltOn = false;
  function tilt() {
    if (tiltOn || !fine) return; tiltOn = true;
    var cur = null, raf = 0, ev = null;
    function frame() {
      raf = 0; if (!cur || !ev) return;
      var r = cur.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      var max = r.width > 520 ? 2.2 : 6;
      cur.style.setProperty("--gx", (x * 100).toFixed(1) + "%"); cur.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      cur.style.transform = "perspective(900px) rotateX(" + ((.5 - y) * max).toFixed(2) + "deg) rotateY(" + ((x - .5) * max * 1.4).toFixed(2) + "deg) translateY(-3px)";
    }
    function leave() { if (!cur) return; cur.classList.remove("fx-hot"); cur.style.transform = ""; cur = null; }
    document.addEventListener("pointermove", function (e) {
      if (!moving() || e.pointerType !== "mouse") return;
      var c = e.target.closest && e.target.closest(TILT);
      if (c !== cur) { leave(); if (c && !c.closest(".exm,#lplay,form,.cm-r")) { cur = c; cur.classList.add("fx-tilt", "fx-hot"); } }
      ev = e; if (cur && !raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    document.addEventListener("pointerleave", leave); window.addEventListener("blur", leave);
  }

  /* ---------- 2b. framed work slider (graphics, plaque style) ---------- */
  window.__gsInit = function () {
    var g = $("#gal.gs"); if (!g) return; var wrap = g.parentNode; if (wrap.querySelector(".gs-n")) return;
    var nav = document.createElement("div"); nav.className = "gs-n";
    nav.innerHTML = '<button type="button" class="btn" data-d="-1" aria-label="' + (R.lang === "fa" ? "قبلی" : "Previous") + '">‹</button><button type="button" class="btn" data-d="1" aria-label="' + (R.lang === "fa" ? "بعدی" : "Next") + '">›</button>';
    wrap.insertBefore(nav, g.nextSibling);
    var step = function (d) { var w = g.firstElementChild ? g.firstElementChild.getBoundingClientRect().width + 20 : 300; g.scrollBy({ left: d * w * (R.dir === "rtl" ? -1 : 1) * 1, behavior: still ? "auto" : "smooth" }); };
    nav.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) step(+b.dataset.d); });
    var paused = false, t = setInterval(function () { if (paused || !on("gsauto") || !moving() || document.hidden) return; var max = g.scrollWidth - g.clientWidth, x = Math.abs(g.scrollLeft); if (x >= max - 4) g.scrollTo({ left: 0, behavior: "smooth" }); else step(1); }, 4200);
    ["pointerenter", "focusin", "touchstart"].forEach(function (ev) { g.addEventListener(ev, function () { paused = true; }, { passive: true }); });
    ["pointerleave", "focusout"].forEach(function (ev) { g.addEventListener(ev, function () { paused = false; }); });
  };
  if (window.__gsInit) setTimeout(window.__gsInit, 0);

  /* ---------- 3. magnetic buttons ---------- */
  var magOn = false;
  function magnet() {
    if (magOn || !fine) return; magOn = true;
    var cur = null;
    document.addEventListener("pointermove", function (e) {
      if (!moving() || e.pointerType !== "mouse") return;
      var b = e.target.closest && e.target.closest(".btn.go,.cc-cta .btn,.hcta .btn");
      if (cur && cur !== b) { cur.style.translate = ""; cur = null; }
      if (!b) return; cur = b; var r = b.getBoundingClientRect();
      b.style.translate = (((e.clientX - r.left) / r.width - .5) * 10).toFixed(1) + "px " + (((e.clientY - r.top) / r.height - .5) * 8).toFixed(1) + "px";
    }, { passive: true });
  }

  /* ---------- 4. hero particles ---------- */
  var pOn = false;
  function particles() {
    var host = $(".cc-hero,#cc,.hero"); if (pOn || !host || !fine || innerWidth < 760 || !moving()) return; pOn = true;
    var cv = document.createElement("canvas"); cv.className = "fx-pc"; cv.setAttribute("aria-hidden", "true"); host.insertBefore(cv, host.firstChild);
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), pts = [], mx = -999, my = -999, run = true, col = "59,31,153";
    function colour() { var c = getComputedStyle(R).getPropertyValue("--accent").trim(); var m = /^#([0-9a-f]{6})$/i.exec(c); if (m) { var v = parseInt(m[1], 16); col = (v >> 16) + "," + ((v >> 8) & 255) + "," + (v & 255); } }
    function size() { var r = host.getBoundingClientRect(); W = cv.width = Math.max(1, Math.round(r.width * dpr)); H = cv.height = Math.max(1, Math.round(r.height * dpr)); cv.style.width = r.width + "px"; cv.style.height = r.height + "px"; var n = Math.min(70, Math.round(r.width * r.height / 22000)); pts = []; for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25 * dpr, vy: (Math.random() - .5) * .25 * dpr, r: (Math.random() * 1.3 + .6) * dpr }); colour(); }
    size(); addEventListener("resize", size);
    host.addEventListener("pointermove", function (e) { var r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) * dpr; my = (e.clientY - r.top) * dpr; }, { passive: true });
    host.addEventListener("pointerleave", function () { mx = my = -999; });
    new MutationObserver(colour).observe(R, { attributes: true, attributeFilter: ["data-theme"] });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { run = es[0].isIntersecting; if (run) loop(); }).observe(host);
    var link = 130 * dpr;
    function loop() {
      if (!run || document.hidden || !moving()) { if (run && moving()) requestAnimationFrame(loop); return; }
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i]; a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
        var dx = mx - a.x, dy = my - a.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160 * dpr && d > 1) { a.x -= dx / d * .6 * dpr; a.y -= dy / d * .6 * dpr; }
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fillStyle = "rgba(" + col + ",.55)"; ctx.fill();
        for (var j = i + 1; j < pts.length; j++) { var b = pts[j], ex = a.x - b.x, ey = a.y - b.y, l = ex * ex + ey * ey; if (l < link * link) { ctx.strokeStyle = "rgba(" + col + "," + (.22 * (1 - Math.sqrt(l) / link)).toFixed(3) + ")"; ctx.lineWidth = dpr * .8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------- 5. staggered reveal of card grids ---------- */
  var sio;
  function stagger() {
    if (!moving() || !("IntersectionObserver" in window)) return;
    R.classList.add("fx-ready");
    sio = sio || new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("fx-in"); sio.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px" });
    $$(".cc-grid,.ac-grid,.pgrid,.tiles,.pcards,.grid").forEach(function (g) {
      if (g.dataset.fxs || g.closest(".exm,#lplay")) return; var kids = g.children; if (!kids.length || kids.length > 40) return; g.dataset.fxs = "1";
      for (var i = 0; i < kids.length; i++) { kids[i].classList.add("fx-st"); kids[i].style.setProperty("--fd", Math.min(i, 8) * 70 + "ms"); sio.observe(kids[i]); }
    });
  }

  /* ---------- 6. headings rise word by word when scrolled into view ---------- */
  var wio;
  function words() {
    if (!moving() || !("IntersectionObserver" in window)) return;
    wio = wio || new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("fx-wi"); wio.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    $$(".cc-h,.sh h2,.ac-sec>h2,.csec>h2,.pcs-h h2,main h1.ph1,main .ph2").forEach(function (h) {
      if (h.closest(".sr,[hidden]") || h.children.length) return; var t = h.textContent.trim(); if (!t || t.length > 90) return;
      h.innerHTML = t.split(/\s+/).map(function (w, i) { return '<span class="fx-w" style="--wi:' + Math.min(i, 12) + '"><span>' + w.replace(/[&<>]/g, "") + '</span></span>'; }).join(" ");
      h.classList.add("fx-wh"); wio.observe(h);
    });
  }

  /* ---------- 7. hero parallax: glow and mark drift with scroll ---------- */
  var plOn = false;
  function parallax() {
    if (plOn || !fine) return; var hero = $(".cc-hero,#cc"); if (!hero) return; plOn = true; var tk = false;
    addEventListener("scroll", function () { if (tk || !moving()) return; tk = true; requestAnimationFrame(function () { tk = false; var y = Math.min(600, Math.max(0, scrollY)); R.style.setProperty("--py", (y * .12).toFixed(1) + "px"); R.style.setProperty("--po", String(Math.max(.35, 1 - y / 900))); }); }, { passive: true });
  }

  /* ---------- 9. cursor light + animated gradient headline ---------- */
  var gOn = false;
  function glow() {
    if (gOn || !moving()) return; gOn = true; R.classList.add("fx-grad");
    if (!fine) return; var c = document.createElement("div"); c.className = "fx-cur"; c.setAttribute("aria-hidden", "true"); document.body.appendChild(c);
    var x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
    function loop() { x += (tx - x) * .14; y += (ty - y) * .14; c.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)"; raf = (Math.abs(tx - x) + Math.abs(ty - y) > .5) ? requestAnimationFrame(loop) : 0; }
    addEventListener("pointermove", function (e) { if (e.pointerType !== "mouse") return; tx = e.clientX; ty = e.clientY; R.classList.add("fx-cur-on"); if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    document.addEventListener("pointerleave", function () { R.classList.remove("fx-cur-on"); });
  }

  /* ---------- 8. home layout from admin (design.home_hide / design.home_order) ---------- */
  /* default structure (short story; details live on About / CV pages and can be shown again in admin). Keep in sync with addesign.js */
  var DEF_ORDER = ["cc", "doors", "mq", "what", "numbers", "work", "courses", "vtile", "lib", "process", "about", "contact"];
  var DEF_HIDE = ["ccPil", "ccMis", "certShow", "design", "home", "vids", "exp", "edu", "skills", "lang", "certs", "links", "press-teaser", "liveStats", "paths", "featured", "profile", "ccFl", "seq", "laurels"];
  function layout() {
    if (PAGE !== "home") return; var hide = Array.isArray(D.home_hide) ? D.home_hide : DEF_HIDE, ord = Array.isArray(D.home_order) ? D.home_order : DEF_ORDER;
        var st = document.getElementById("lyCss"); if (!st) { st = document.createElement("style"); st.id = "lyCss"; document.head.appendChild(st); }
    R.classList.toggle("ly-nocerts", hide.indexOf("certs") >= 0);
    var css = hide.filter(function (i) { return /^[A-Za-z0-9_-]{1,40}$/.test(i); }).map(function (i) { return "#" + i + "{display:none!important}a[href$=\"#" + i + "\"]{display:none!important}"; }).join(""); if (st.textContent !== css) st.textContent = css;
    var els = ord.map(function (i) { return /^[A-Za-z0-9_-]{1,40}$/.test(i) ? document.getElementById(i) : null; }).filter(function (e) { return e && e.parentNode && e.parentNode.tagName === "MAIN"; });
    var inOrder = els.every(function (e, i) { return i === 0 || (els[i - 1].compareDocumentPosition(e) & 4); });
    if (els.length > 1 && !inOrder) {
      var marks = els.map(function (e) { var m = document.createComment("ly"); e.parentNode.insertBefore(m, e); return m; });
      var slots = els.map(function (e, i) { return marks[i]; }).sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
      els.forEach(function (e) { e.remove(); });
      els.forEach(function (e, i) { slots[i].parentNode.insertBefore(e, slots[i]); }); marks.forEach(function (m) { m.remove(); });
    }
  }

  function aboutLinks() {
    var a = document.querySelector("#about>div:not(.sh)"); if (!a || a.querySelector(".cta-row")) return; var fa = R.lang === "fa";
    var p = document.createElement("p"); p.className = "cta-row";
    [["cv.html", fa ? "رزومهٔ کامل" : "Full résumé", 1], ["about.html", fa ? "تحصیلات و سوابق" : "Education & experience", 0], ["works.html", fa ? "همهٔ نمونه‌کارها" : "All work", 0]].forEach(function (x) { var l = document.createElement("a"); l.className = "btn" + (x[2] ? " go" : ""); l.href = x[0]; l.textContent = x[1]; p.appendChild(l); });
    a.appendChild(p);
  }

  function workMore() {
    var g = document.getElementById("workGrid"); if (!g || !g.parentNode || g.parentNode.querySelector(".work-more")) return; var fa = R.lang === "fa";
    var d = document.createElement("p"); d.className = "work-more"; var a = document.createElement("a"); a.className = "btn go"; a.href = "works.html"; a.textContent = fa ? "دیدن همهٔ نمونه‌کارها" : "See all work"; d.appendChild(a); g.parentNode.insertBefore(d, g.nextSibling);
  }

  /* ---------- 10. trust strip under the hero + admin-defined footer links ---------- */
  var SVGS = { free: '<path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z"/>', qr: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v3M14 20h3M20 20v1"/>', globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>', lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>' };
  function trust() {
    var h = document.getElementById("cc"); if (!h || h.querySelector(".cc-trust")) return; var fa = R.lang === "fa";
    var it = fa ? [["free", "کاملاً رایگان"], ["qr", "گواهی قابل تأیید با QR"], ["globe", "فارسی و English"], ["lock", "بدون ردیابی و تبلیغ"]] : [["free", "Completely free"], ["qr", "QR-verifiable certificates"], ["globe", "Persian & English"], ["lock", "No tracking, no ads"]];
    var u = document.createElement("ul"); u.className = "cc-trust"; u.setAttribute("aria-label", fa ? "ویژگی‌ها" : "Highlights");
    u.innerHTML = it.map(function (x) { return '<li><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVGS[x[0]] + '</svg><span>' + x[1] + '</span></li>'; }).join("");
    var after = h.querySelector(".cc-cta") || document.getElementById("ccBody"); if (after && after.parentNode) after.parentNode.insertBefore(u, after.nextSibling);
  }
  function footerLinks() {
    var L = Array.isArray(D.footer_links) ? D.footer_links : []; var ul = document.querySelector("#site-footer .ft-c ul"); if (!ul) return;
    var sig = JSON.stringify([L, R.lang]); if (ul.dataset.fl === sig) return; ul.dataset.fl = sig;
    [].forEach.call(ul.querySelectorAll("li[data-fl]"), function (n) { n.remove(); });
    L.slice(0, 12).forEach(function (x) {
      var t = x && x[R.lang === "fa" ? "fa" : "en"] || (x && (x.en || x.fa)); if (!t || !/^(https:\/\/[^\s"'<>]+|[\w\-]+\.html(#[\w\-]*)?|#[\w\-]+)$/i.test(x.url || "")) return;
      var li = document.createElement("li"); li.setAttribute("data-fl", "1"); var a = document.createElement("a"); a.href = x.url; if (/^https:/i.test(x.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } var sp = document.createElement("span"); sp.textContent = t; a.appendChild(sp); li.appendChild(a); ul.appendChild(li);
    });
  }

  /* ---------- 11. two-column hero (copy + portrait with floating chips) and alternating section bands ---------- */
  function heroTwo() {
    var h = document.getElementById("cc"); if (!h) return; var fa = R.lang === "fa";
    if (!h.querySelector(".cc-copy")) {
      var copy = document.createElement("div"); copy.className = "cc-copy";
      [].slice.call(h.children).forEach(function (c) { if (c.tagName !== "CANVAS" && !c.classList.contains("fx-pc")) copy.appendChild(c); });
      h.appendChild(copy); h.classList.add("cc-two");
    }
    var key = fa ? "fa" : "en", v = h.querySelector(".cc-vis"); if (v && v.dataset.k === key) return; if (v) v.remove();
    var T = fa ? ["فیلم‌ساز", "برنامه‌نویس", "طراح", "رایگان و فارسی", "گواهی با QR"] : ["Filmmaker", "Developer", "Designer", "Free & bilingual", "QR certificates"];
    v = document.createElement("div"); v.className = "cc-vis"; v.dataset.k = key; v.setAttribute("aria-hidden", "true");
    v.innerHTML = '<span class="cv-ring"></span><span class="cv-ring r2"></span><div class="cv-arch"><img src="assets/img/me.webp" width="480" height="482" alt="" decoding="async"></div>' +
      '<span class="cv-card k1"><b>✓</b> ' + T[3] + '</span><span class="cv-card k2"><b>QR</b> ' + T[4] + '</span>';
    h.appendChild(v);
  }
  function bands() {
    if (PAGE !== "home") return; var n = 0;
    $$("main>section.sec").forEach(function (s) { var shown = s.offsetParent !== null; s.classList.toggle("band", shown && (n++ % 2 === 1)); });
  }

  /* ---------- 12. top menu from admin: hide / rename / reorder / extra links (design.nav) ---------- */
  var SAFEU = /^(https:\/\/[^\s"'<>]+|[\w\-]+\.html(#[\w\-]*)?|#[\w\-]+)$/i;
  function navEdit() {
    var nav = document.querySelector("#site-header .hnav"), N = D.nav; if (!nav || !N || typeof N !== "object") return;
    var fa = R.lang === "fa", norm = function (h) { return String(h || "").replace(/^index\.html(?=#)/, "").replace(/^index\.html$/, "index.html"); };
    var sig = JSON.stringify([N, fa, nav.children.length]); if (nav.dataset.ne === sig) return;
    [].forEach.call(nav.querySelectorAll("a[data-ne]"), function (a) { a.remove(); });
    var hide = Array.isArray(N.hide) ? N.hide : [], lab = N.labels && typeof N.labels === "object" ? N.labels : {}, ord = Array.isArray(N.order) ? N.order : [];
    (Array.isArray(N.extra) ? N.extra : []).slice(0, 6).forEach(function (x) {
      var t = x && (fa ? x.fa : x.en) || (x && (x.en || x.fa)); if (!t || !SAFEU.test(x.url || "")) return;
      var a = document.createElement("a"); a.href = x.url; a.textContent = t; a.setAttribute("data-ne", "1"); if (/^https:/i.test(x.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } nav.appendChild(a);
    });
    var links = [].slice.call(nav.querySelectorAll("a"));
    links.forEach(function (a) {
      var k = norm(a.getAttribute("href")); a.hidden = hide.indexOf(k) >= 0;
      var l = lab[k]; if (!a.dataset.ne && l && typeof l === "object") { var t = fa ? l.fa : l.en; if (t && a.textContent !== t) { a.removeAttribute("data-k"); a.textContent = t; } }
    });
    if (ord.length) { links.sort(function (a, b) { var ia = ord.indexOf(norm(a.getAttribute("href"))), ib = ord.indexOf(norm(b.getAttribute("href"))); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); }).forEach(function (a) { nav.appendChild(a); }); }
    nav.dataset.ne = JSON.stringify([N, fa, nav.children.length]);
  }

  /* ---------- 13. page curtain: panels close on a link click and open on the next page ---------- */
  function curtain() {
    if (!on("curtain") || !moving() || R.dataset.ct) return; R.dataset.ct = "1";
    var c = document.createElement("div"); c.className = "ct"; c.setAttribute("aria-hidden", "true"); c.innerHTML = "<i></i><i></i>"; document.body.appendChild(c);
    var came = false; try { came = sessionStorage.getItem("am-ct") === "1"; sessionStorage.removeItem("am-ct"); } catch (e) {}
    if (came) { c.className = "ct ct-shut"; requestAnimationFrame(function () { requestAnimationFrame(function () { c.className = "ct ct-open"; }); }); setTimeout(function () { c.className = "ct"; }, 800); }
    window.addEventListener("pageshow", function (e) { if (e.persisted) c.className = "ct"; });
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]"); if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute("download")) return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.origin !== location.origin || !/\.html$|\/$/.test(u.pathname) || (u.pathname === location.pathname && u.search === location.search)) return;
      e.preventDefault(); try { sessionStorage.setItem("am-ct", "1"); } catch (x) {}
      c.className = "ct ct-close"; setTimeout(function () { location.href = u.href; }, 340);
    });
  }
  /* ---------- 14. menu text scramble on hover ---------- */
  function scramble() {
    if (!on("scramble") || !moving() || !fine || R.dataset.sc) return; R.dataset.sc = "1";
    var G = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&";
    document.addEventListener("mouseover", function (e) {
      var a = e.target.closest && e.target.closest(".hnav a"); if (!a || a.dataset.scr || R.lang === "fa" || a.children.length) return;
      var fin = a.textContent, n = 0; if (!fin) return; a.dataset.scr = "1";
      var iv = setInterval(function () { n++; var out = ""; for (var i = 0; i < fin.length; i++) out += (fin[i] === " " || i < n / 1.5) ? fin[i] : G[Math.floor(Math.random() * G.length)];
        a.textContent = out; if (n > fin.length * 1.5) { clearInterval(iv); a.textContent = fin; delete a.dataset.scr; } }, 30);
    });
  }
  /* ---------- 15. FAQ from admin (design.faq) on the academy page ---------- */
  function faq() {
    var F = D.faq; if (PAGE !== "academy" || !Array.isArray(F)) return; var fa = R.lang === "fa", main = $("main"); if (!main) return;
    var items = F.slice(0, 15).filter(function (x) { return x && (fa ? x.qf : x.qe) && (fa ? x.af : x.ae); }), sig = JSON.stringify([items, fa]), old = $("#faq");
    if (old && old.dataset.sg === sig) return; if (old) old.remove(); if (!items.length) return;
    var s = document.createElement("section"); s.className = "sec faq"; s.id = "faq"; s.dataset.sg = sig; s.setAttribute("aria-label", fa ? "پرسش‌های پرتکرار" : "FAQ");
    var h = document.createElement("div"); h.className = "sh"; var h2 = document.createElement("h2"); h2.textContent = fa ? "پرسش‌های پرتکرار" : "Frequently asked questions"; h.appendChild(h2); s.appendChild(h);
    var l = document.createElement("div"); l.className = "faq-l";
    items.forEach(function (x) { var d = document.createElement("details"), m = document.createElement("summary"), b = document.createElement("div"); m.textContent = fa ? x.qf : x.qe; b.className = "faq-a";
      (fa ? x.af : x.ae).split(/\n+/).forEach(function (t) { if (t.trim()) { var p = document.createElement("p"); p.textContent = t; b.appendChild(p); } }); d.appendChild(m); d.appendChild(b); l.appendChild(d); });
    s.appendChild(l); main.appendChild(s);
  }

  /* ---------- 16. testimonials, partners, announcement banner (design.testi / partners / banner) ---------- */
  function mk(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var HU = /^(https:\/\/[^\s"'<>]+|[\w\-]+\.html(#[\w\-]*)?)$/i;
  function after(sec) { var m = $("main"); if (!m) return; var ref = $("#about", m) || $("#contact", m); if (ref && ref.parentNode === m) m.insertBefore(sec, ref); else m.appendChild(sec); }
  function testi() {
    var T = D.testi, fa = R.lang === "fa", old = $("#testi"); if (PAGE !== "home" || !Array.isArray(T)) return;
    var items = T.slice(0, 12).filter(function (x) { return x && x.n && (fa ? x.tf : x.te) || (x && x.n && (x.tf || x.te)); }), sig = JSON.stringify([items, fa]);
    if (old && old.dataset.sg === sig) return; if (old) old.remove(); if (!items.length) return;
    var s = mk("section", "sec tst", ""); s.id = "testi"; s.dataset.sg = sig; s.setAttribute("aria-label", fa ? "نظر دانشجویان" : "Student reviews");
    var h = mk("div", "sh"); h.appendChild(mk("h2", "", fa ? "دانشجویان چه می‌گویند" : "What students say")); s.appendChild(h);
    var l = mk("div", "tst-l");
    items.forEach(function (x) { var q = mk("figure", "tst-c"), st = Math.max(0, Math.min(5, parseInt(x.s, 10) || 0));
      if (st) { var r = mk("div", "tst-s", "★★★★★".slice(0, st) + "☆☆☆☆☆".slice(0, 5 - st)); r.setAttribute("role", "img"); r.setAttribute("aria-label", st + "/5"); q.appendChild(r); }
      q.appendChild(mk("blockquote", "", fa ? (x.tf || x.te) : (x.te || x.tf)));
      var c = mk("figcaption", ""); c.appendChild(mk("b", "", String(x.n).charAt(0))); var w = mk("span", ""); w.appendChild(mk("strong", "", x.n)); if (x.r) w.appendChild(mk("small", "", x.r)); c.appendChild(w); q.appendChild(c); l.appendChild(q); });
    s.appendChild(l); after(s);
  }
  /* newsletter signup (design.news === "on"): only the email is stored */
  function news() {
    var m = $("main"), fa = R.lang === "fa", old = $("#news"); if ((PAGE !== "home" && PAGE !== "academy") || !m || D.news !== "on" || !S.supabaseUrl || !S.supabaseAnonKey) { if (old) old.remove(); return; }
    if (old && old.dataset.sg === (fa ? "fa" : "en")) return; if (old) old.remove();
    var s = mk("section", "sec nws", ""); s.id = "news"; s.dataset.sg = fa ? "fa" : "en"; s.setAttribute("aria-label", fa ? "خبرنامه" : "Newsletter");
    var h = mk("div", "sh"); h.appendChild(mk("h2", "", fa ? "از دوره‌ها و کارهای تازه باخبر شو" : "Get news about new courses and work")); s.appendChild(h);
    var f = mk("form", "nws-f"); f.noValidate = true;
    var lb = mk("label", "sr-only", fa ? "ایمیل" : "Email"); lb.htmlFor = "nwE"; var em = mk("input", ""); em.id = "nwE"; em.type = "email"; em.maxLength = 254; em.required = true; em.autocomplete = "email"; em.dir = "ltr"; em.placeholder = "name@example.com";
    var hp = mk("input", "nws-hp"); hp.type = "text"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
    var bt = mk("button", "btn go", fa ? "عضویت" : "Subscribe"); bt.type = "submit"; var st = mk("p", "nws-s"); st.setAttribute("role", "status"); st.setAttribute("aria-live", "polite");
    f.appendChild(lb); f.appendChild(em); f.appendChild(hp); f.appendChild(bt); s.appendChild(f); s.appendChild(st);
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var v = em.value.trim(); if (hp.value) return;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || v.length > 254) { st.textContent = fa ? "ایمیل درست نیست." : "That email does not look right."; return; }
      bt.disabled = true; st.textContent = "…";
      fetch(S.supabaseUrl.replace(/\/$/, "") + "/rest/v1/newsletter_subscribers", { method: "POST", headers: { "Content-Type": "application/json", apikey: S.supabaseAnonKey, Authorization: "Bearer " + S.supabaseAnonKey, Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ email: v, lang: fa ? "fa" : "en" }) })
        .then(function (r) { if (!r.ok) throw 0; st.textContent = fa ? "ممنون! ایمیلت ثبت شد." : "Thanks! You are subscribed."; em.value = ""; })
        .catch(function () { bt.disabled = false; st.textContent = fa ? "ثبت نشد. کمی بعد دوباره امتحان کن." : "Could not subscribe. Please try again later."; });
    });
    var ref = $("#contact", m); if (ref && ref.parentNode === m) m.insertBefore(s, ref); else m.appendChild(s);
  }
  /* ---------- academy: learning path, course comparison; works: live search; blog page ---------- */
  var tt = function (o) { return o && typeof o === "object" ? (R.lang === "fa" ? (o.fa || o.en) : (o.en || o.fa)) || "" : String(o || ""); };
  function lpath() {
    var cs = S.courses || [], old = $("#lpath"), sec = $("#courses"), fa = R.lang === "fa"; if (PAGE !== "academy" || !sec || !cs.length) return;
    var sig = fa + "|" + cs.length; if (old && old.dataset.sg === sig) return; if (old) old.remove();
    var L = [[/begin|مبتد/i, fa ? "مبتدی" : "Beginner"], [/inter|متوسط/i, fa ? "متوسط" : "Intermediate"], [/adv|پیشرفته|pro/i, fa ? "پیشرفته" : "Advanced"]];
    var s2 = mk("section", "ac-sec lp", ""); s2.id = "lpath"; s2.dataset.sg = sig; s2.setAttribute("aria-label", fa ? "مسیر یادگیری" : "Learning path");
    s2.appendChild(mk("h2", "", fa ? "مسیر یادگیری" : "Learning path")); s2.appendChild(mk("p", "muted", fa ? "از اولین قدم تا حرفه‌ای شدن، مرحله‌به‌مرحله." : "From your first step to professional, one stage at a time."));
    var ol = mk("ol", "lp-l");
    L.forEach(function (lv, i) { var li = mk("li", "lp-n"), list = cs.filter(function (c) { return lv[0].test(tt(c.level)) || lv[0].test((c.level && c.level.en) || ""); });
      li.appendChild(mk("span", "lp-i", String(i + 1))); li.appendChild(mk("h3", "", lv[1]));
      if (list.length) { var u = mk("ul", ""); list.slice(0, 4).forEach(function (c) { var x = mk("li", ""), a = mk("a", "", tt(c.title)); a.href = "course.html#" + encodeURIComponent(c.id); x.appendChild(a); u.appendChild(x); }); li.appendChild(u); }
      else { li.classList.add("lp-soon"); li.appendChild(mk("p", "muted", fa ? "به‌زودی" : "Coming soon")); }
      ol.appendChild(li); });
    s2.appendChild(ol); sec.parentNode.insertBefore(s2, sec);
  }
  function compare() {
    var cs = S.courses || [], old = $("#cmp"), sec = $("#courses"), fa = R.lang === "fa"; if (PAGE !== "academy" || !sec || cs.length < 2) return;
    var sig = fa + "|" + cs.length; if (old && old.dataset.sg === sig) return; if (old) old.remove();
    var s2 = mk("section", "ac-sec cp2", ""); s2.id = "cmp"; s2.dataset.sg = sig; s2.setAttribute("aria-label", fa ? "مقایسهٔ دوره‌ها" : "Compare courses");
    s2.appendChild(mk("h2", "", fa ? "مقایسهٔ دوره‌ها" : "Compare courses"));
    var bar = mk("div", "cp2-b"), sels = [0, 1].map(function (k) { var lb = mk("label", "ac-q", ""), sp = mk("span", "lbl", fa ? "دورهٔ " + (k ? "دوم" : "اول") : "Course " + (k ? "B" : "A")), se = mk("select", ""); lb.appendChild(sp); cs.forEach(function (c, i) { var o = mk("option", "", tt(c.title)); o.value = i; se.appendChild(o); }); se.value = String(Math.min(k, cs.length - 1)); lb.appendChild(se); bar.appendChild(lb); return se; });
    s2.appendChild(bar); var wrap = mk("div", "cp2-w"); wrap.tabIndex = 0; wrap.setAttribute("role", "region"); wrap.setAttribute("aria-label", fa ? "جدول مقایسه" : "Comparison table"); s2.appendChild(wrap);
    var rows = [[fa ? "سطح" : "Level", function (c) { return tt(c.level); }], [fa ? "حوزه" : "Category", function (c) { return tt(c.cat); }], [fa ? "تعداد درس" : "Lessons", function (c) { return String((c.lessons || []).length); }], [fa ? "وضعیت" : "Status", function (c) { return c.status === "soon" ? (fa ? "به‌زودی" : "Coming soon") : (fa ? "باز" : "Open"); }], [fa ? "سرفصل‌ها" : "Topics", function (c) { return (c.lessons || []).map(tt).join(" · "); }]];
    function draw() { var a = cs[+sels[0].value], b = cs[+sels[1].value], t = mk("table", "cp2-t"), cap = mk("caption", "sr-only", fa ? "مقایسهٔ دو دوره" : "Two-course comparison"), th = mk("thead", ""), tr = mk("tr", "");
      t.appendChild(cap); [fa ? "ویژگی" : "Feature", tt(a.title), tt(b.title)].forEach(function (x) { var c = mk("th", "", x); c.scope = "col"; tr.appendChild(c); }); th.appendChild(tr); t.appendChild(th);
      var tb = mk("tbody", ""); rows.forEach(function (r) { var q = mk("tr", ""), h = mk("th", "", r[0]); h.scope = "row"; q.appendChild(h); q.appendChild(mk("td", "", r[1](a))); q.appendChild(mk("td", "", r[1](b))); tb.appendChild(q); }); t.appendChild(tb); wrap.textContent = ""; wrap.appendChild(t); }
    sels.forEach(function (x) { x.addEventListener("change", draw); }); draw();
    sec.parentNode.insertBefore(s2, sec.nextSibling);
  }
  function worksQ() {
    var g = $("#wkGrid"), fa = R.lang === "fa"; if (PAGE !== "works" || !g || $("#wkQ")) return;
    var lb = mk("label", "ac-q", ""), sp = mk("span", "lbl", fa ? "جستجوی نمونه‌کار" : "Search works"), i = mk("input", ""); i.type = "search"; i.id = "wkQ"; i.maxLength = 60; i.autocomplete = "off"; lb.appendChild(sp); lb.appendChild(i);
    var st = mk("p", "muted"); st.setAttribute("role", "status"); st.setAttribute("aria-live", "polite"); g.parentNode.insertBefore(lb, g); g.parentNode.insertBefore(st, g);
    function ap() { var q = i.value.trim().toLowerCase(), n = 0; [].forEach.call(g.children, function (c) { var h = !!q && c.textContent.toLowerCase().indexOf(q) < 0; c.hidden = h; if (!h) n++; }); st.textContent = q ? (fa ? n + " نتیجه" : n + " results") : ""; }
    i.addEventListener("input", ap); new MutationObserver(ap).observe(g, { childList: true });
  }
  function blog() {
    var box = $("#blog"), fa = R.lang === "fa"; if (PAGE !== "blog" || !box) return; var P = Array.isArray(D.posts) ? D.posts : [], sig = JSON.stringify([P, fa]); if (box.dataset.sg === sig) return; box.dataset.sg = sig; box.textContent = "";
    document.title = (fa ? "وبلاگ" : "Blog") + " | " + (S.name ? tt(S.name) : "CineCode");
    var cr = mk("nav", "crumb"); cr.setAttribute("aria-label", "Breadcrumb"); var ha = mk("a", "", fa ? "خانه" : "Home"); ha.href = "index.html"; cr.appendChild(ha); cr.appendChild(document.createTextNode(" / ")); var cu = mk("span", "", fa ? "وبلاگ" : "Blog"); cu.setAttribute("aria-current", "page"); cr.appendChild(cu); box.appendChild(cr);
    box.appendChild(mk("h1", "ph1", fa ? "وبلاگ" : "Blog"));
    var items = P.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return o.x && (o.x.t || o.x.te); }).sort(function (a, b) { return String(b.x.d || "") < String(a.x.d || "") ? -1 : 1; });
    if (!items.length) { box.appendChild(mk("p", "muted", fa ? "هنوز مطلبی نوشته نشده." : "No posts yet.")); return; }
    var l = mk("div", "bg-l"); items.forEach(function (o) { var x = o.x, a = mk("article", "bg-a"); a.id = "p" + o.i;
      if (x.d && /^\d{4}-\d{2}-\d{2}/.test(x.d)) { var tm = mk("time", "pst-d", x.d.slice(0, 10)); tm.dateTime = x.d.slice(0, 10); tm.setAttribute("dir", "ltr"); a.appendChild(tm); }
      a.appendChild(mk("h2", "", fa ? (x.t || x.te) : (x.te || x.t)));
      var body = fa ? (x.bf || x.x || x.be || x.xe) : (x.be || x.xe || x.bf || x.x) || ""; String(body).split(/\n+/).forEach(function (t) { if (t.trim()) a.appendChild(mk("p", "", t)); });
      l.appendChild(a); }); box.appendChild(l);
    if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el && el.scrollIntoView) setTimeout(function () { el.scrollIntoView(); }, 50); }
  }
  /* ---------- opt-in leaderboard (design.board === "on", needs cms-8.sql) ---------- */
  function board() {
    var sec = $("#courses"), fa = R.lang === "fa", old = $("#board"); if (PAGE !== "academy" || !sec || D.board !== "on" || !S.supabaseUrl || !S.supabaseAnonKey) { if (old) old.remove(); return; }
    if (old && old.dataset.sg === (fa ? "fa" : "en")) return; if (old) old.remove();
    var s2 = mk("section", "ac-sec bd", ""); s2.id = "board"; s2.dataset.sg = fa ? "fa" : "en"; s2.setAttribute("aria-label", fa ? "برترین‌ها" : "Top learners");
    s2.appendChild(mk("h2", "", fa ? "برترین دانشجوها" : "Top learners")); s2.appendChild(mk("p", "muted", fa ? "فقط دانشجوهایی که خودشان در «حساب من» قبول کرده‌اند. امتیاز: هر درس ۱۰، هر گواهی ۱۰۰." : "Only learners who opted in from “My account”. Points: 10 per lesson, 100 per certificate."));
    var ol = mk("ol", "bd-l"); s2.appendChild(ol); sec.parentNode.insertBefore(s2, sec.nextSibling);
    fetch(S.supabaseUrl.replace(/\/$/, "") + "/rest/v1/rpc/public_leaderboard", { method: "POST", headers: { "Content-Type": "application/json", apikey: S.supabaseAnonKey, Authorization: "Bearer " + S.supabaseAnonKey }, body: "{}" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (rows) { if (!Array.isArray(rows) || !rows.length) { ol.appendChild(mk("li", "muted", fa ? "هنوز کسی ثبت نشده." : "Nobody yet.")); return; }
        rows.slice(0, 20).forEach(function (x) { var li = mk("li", ""); li.appendChild(mk("span", "bd-n", String(x.display_name || "").slice(0, 30))); li.appendChild(mk("b", "bd-x", (+x.xp || 0) + (fa ? " امتیاز" : " pts"))); ol.appendChild(li); }); })
      .catch(function () { s2.remove(); });
  }
  /* account page: choose to appear on the leaderboard (own row only) */
  function optin() {
    var m = $("main"), fa = R.lang === "fa", old = $("#bdOpt"), SB = window.__SB; if (PAGE !== "account" || !m || D.board !== "on" || !SB || !SB.get || !SB.get()) { if (old) old.remove(); return; }
    if (old && old.dataset.sg === (fa ? "fa" : "en")) return; if (old) old.remove();
    var uid = SB.get().id, w = mk("section", "sec bd-o", ""); w.id = "bdOpt"; w.dataset.sg = fa ? "fa" : "en";
    w.appendChild(mk("h2", "", fa ? "جدول برترین‌ها" : "Leaderboard"));
    var lb = mk("label", "ac-q", ""), sp = mk("span", "lbl", fa ? "نامی که نمایش داده شود (۲ تا ۳۰ حرف، نام واقعی لازم نیست)" : "Name to show (2-30 characters, a nickname is fine)"), inp = mk("input", ""); inp.type = "text"; inp.maxLength = 30; inp.autocomplete = "off"; lb.appendChild(sp); lb.appendChild(inp);
    var row = mk("div", "bd-b"), on = mk("button", "btn go", fa ? "نمایش من" : "Show me"), off = mk("button", "btn", fa ? "حذف من از جدول" : "Remove me"); on.type = off.type = "button"; row.appendChild(on); row.appendChild(off);
    var st = mk("p", "muted"); st.setAttribute("role", "status"); st.setAttribute("aria-live", "polite"); w.appendChild(lb); w.appendChild(row); w.appendChild(st); m.appendChild(w);
    SB.rest("leaderboard_optin?select=display_name&user_id=eq." + encodeURIComponent(uid)).then(function (r) { if (r && r[0]) { inp.value = r[0].display_name; st.textContent = fa ? "الان در جدول نمایش داده می‌شوی." : "You are on the leaderboard."; } }).catch(function () {});
    on.onclick = function () { var v = inp.value.trim(); if (v.length < 2 || v.length > 30) { st.textContent = fa ? "نام باید ۲ تا ۳۰ حرف باشد." : "Name must be 2-30 characters."; return; }
      SB.send("POST", "leaderboard_optin?on_conflict=user_id", { user_id: uid, display_name: v }, "resolution=merge-duplicates,return=minimal").then(function () { st.textContent = fa ? "ثبت شد." : "Saved."; }).catch(function () { st.textContent = fa ? "ثبت نشد." : "Could not save."; }); };
    off.onclick = function () { SB.send("DELETE", "leaderboard_optin?user_id=eq." + encodeURIComponent(uid), null, "return=minimal").then(function () { inp.value = ""; st.textContent = fa ? "حذف شدی." : "Removed."; }).catch(function () { st.textContent = fa ? "انجام نشد." : "Could not remove."; }); };
  }
  /* the "samples are not real" notice moves from the very top to the end of the footer */
  function tidyNote() { var n = $("#note"), f = $("#site-footer"); if (!n || !f || n.parentNode === f) return; var q = document.createElement("p"); q.id = "note"; q.className = n.className; q.hidden = n.hidden; q.innerHTML = n.innerHTML; n.remove(); f.appendChild(q); }
  /* ---------- header and footer parts: show / hide from admin (design.chrome.hide) ---------- */
  var CH = [["h_lang", function () { var b = $("#langBtn"); return b && b.closest(".dkg"); }], ["h_theme", function () { return $("#modeBtn"); }], ["h_search", function () { return $("#srchBtn"); }], ["h_lite", function () { return $("#liteBtn"); }],
    ["f_slogan", function () { return $("#site-footer .ft-sl"); }], ["f_mission", function () { return $("#site-footer .ft-ms"); }], ["f_ql", function () { return $$("#site-footer .ft-c")[0]; }], ["f_contact", function () { return $$("#site-footer .ft-c")[1]; }],
    ["f_cols", function () { return $$("#site-footer .fcol"); }], ["f_dots", function () { return $("#site-footer .fdots"); }], ["f_soc", function () { return $("#fsoc"); }], ["f_copy", function () { return $("#site-footer .fcopy"); }]];
  function chrome() {
    var C = D.chrome, hide = C && Array.isArray(C.hide) ? C.hide : ["h_lite"];
    CH.forEach(function (x) { var e = x[1](); if (!e) return; (e.length != null && !e.nodeType ? e : [e]).forEach(function (n) { if (n && n.classList) n.classList.toggle("fx-h", hide.indexOf(x[0]) >= 0); }); });
  }
  /* ---------- 17. wow layer: aurora + floating shapes, card spotlight, button ripple + spark burst, 3D card entrance, scroll cue, hero tilt, shimmer titles ---------- */
  var WOW = ".tst-c,.pst-c,.tm-c,.lp-n,.ccv,.bd-l li,.faq-l details,.tm-c,.card";
  function wow() {
    if (R.dataset.wow) { wowDom(); return; } R.dataset.wow = "1";
    R.classList.toggle("fx-shim", on("shimmer") && moving());
    if (!moving()) return;
    if (fine && on("spot")) document.addEventListener("pointermove", function (e) { var c = e.target.closest && e.target.closest(WOW); if (!c) return; var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); c.classList.add("fx-sp"); }, { passive: true });
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".btn"); if (!b) return; var r = b.getBoundingClientRect();
      if (on("ripple")) { if (getComputedStyle(b).position === "static") b.style.position = "relative"; b.style.overflow = "hidden"; var d = Math.max(r.width, r.height) * 2, p = mk("span", "fx-rip"); p.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px"; b.appendChild(p); setTimeout(function () { p.remove(); }, 650); }
      if (on("burst") && b.classList.contains("go")) { for (var i = 0; i < 10; i++) { var s2 = mk("i", "fx-bst"), a = i / 10 * 6.283, dist = 34 + Math.random() * 26; s2.style.cssText = "left:" + e.clientX + "px;top:" + e.clientY + "px;--dx:" + Math.cos(a) * dist + "px;--dy:" + Math.sin(a) * dist + "px;background:hsl(" + (200 + i * 14) + ",90%,62%)"; document.body.appendChild(s2); (function (n) { setTimeout(function () { n.remove(); }, 800); })(s2); } }
    });
    if (fine && on("hero3d")) document.addEventListener("pointermove", function (e) { var v = $(".cc-vis"); if (!v) return; var r = v.getBoundingClientRect(); if (r.width < 50) return; var x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight; v.style.setProperty("--ry", (x * 14).toFixed(2) + "deg"); v.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg"); v.classList.add("fx-t3"); }, { passive: true });
    wowDom();
  }
  function wowDom() {
    var hero = $("#cc");
    if (hero && on("aurora") && !$(":scope>.fx-aur", hero)) { var wr = $(".cc-copy .fx-aur", hero); if (wr) wr.remove(); var a = mk("div", "fx-aur"); a.setAttribute("aria-hidden", "true"); a.innerHTML = "<i></i><i></i><i></i><b></b><b></b><b></b><b></b>"; hero.insertBefore(a, hero.firstChild); if (getComputedStyle(hero).position === "static") hero.style.position = "relative"; }
    if (hero && on("cue") && !$(".fx-cue", hero)) { var c = mk("a", "fx-cue"); c.href = "#"; c.setAttribute("aria-label", R.lang === "fa" ? "پایین‌تر برو" : "Scroll down"); c.innerHTML = "<span></span>"; c.addEventListener("click", function (e) { e.preventDefault(); var n = hero.nextElementSibling; if (n) n.scrollIntoView({ behavior: still ? "auto" : "smooth" }); }); hero.appendChild(c); addEventListener("scroll", function () { c.classList.toggle("fx-off", scrollY > 80); }, { passive: true }); }
    if (on("flip") && "IntersectionObserver" in window) { var io = window.__fxIO || (window.__fxIO = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("fx-in"); io.unobserve(x.target); } }); }, { threshold: .12 }));
      $$(WOW).forEach(function (c) { if (c.dataset.fl) return; c.dataset.fl = "1"; var r = c.getBoundingClientRect(); if (r.top < innerHeight * .9) return; c.classList.add("fx-pre"); io.observe(c); }); }
  }
  /* ---------- home extras: real numbers strip + 4-step "how it works" (ids: numbers, process) ---------- */
  function homeExtras() {
    var m = $("main"), fa = R.lang === "fa"; if (PAGE !== "home" || !m) return;
    var cs = (S.courses || []).filter(function (c) { return !c.sample; }), ls = cs.reduce(function (n, c) { return n + (c.lessons || []).length; }, 0), ps = (S.projects || []).filter(function (x) { return !x.sample; }).length;
    var gx = (S.gallery || []).filter(function (g) { return g && !g.hidden; }).length, ce = (S.certs || []).filter(function (c) { return c && c.img; }).length;
    var nf = function (n) { try { return new Intl.NumberFormat(fa ? "fa-AF" : "en").format(n); } catch (e) { return String(n); } };
    var tiles = [[cs.length, fa ? "دورهٔ آموزشی" : "Courses"], [ls, fa ? "درس ویدیویی" : "Video lessons"], [ps, fa ? "نمونه‌کار" : "Projects"], [gx, fa ? "طرح گرافیک" : "Graphic designs"], [ce, fa ? "گواهی" : "Certificates"], [2, fa ? "زبان: فارسی و English" : "Languages: Persian and English"], ["100%", fa ? "رایگان" : "Free"]].filter(function (t) { return t[0] !== 0; });
    var sig = fa + JSON.stringify(tiles), o = $("#numbers");
    if (!o || o.dataset.sg !== sig) { if (o) o.remove();
      var s1 = mk("section", "sec num", ""); s1.id = "numbers"; s1.dataset.sg = sig; s1.setAttribute("aria-label", fa ? "اعداد و ارقام" : "Numbers");
      var g = mk("ul", "num-g"); tiles.forEach(function (t) { var li = mk("li", ""), b = mk("b", "num-n", typeof t[0] === "number" ? nf(t[0]) : (fa ? "۱۰۰٪" : "100%")); if (typeof t[0] === "number") b.dataset.to = t[0]; li.appendChild(b); li.appendChild(mk("span", "", t[1])); g.appendChild(li); });
      s1.appendChild(g); var ref = $("#about", m) || $("#contact", m); if (ref && ref.parentNode === m) m.insertBefore(s1, ref); else m.appendChild(s1);
      /* v124: numbers are static (no count-up) so they never flicker */
    }
    var pr = $("#process"); if (pr && pr.dataset.sg === (fa ? "fa" : "en")) return; if (pr) pr.remove();
    var S2 = mk("section", "sec prc", ""); S2.id = "process"; S2.dataset.sg = fa ? "fa" : "en"; S2.setAttribute("aria-label", fa ? "مسیر یادگیری" : "How it works");
    var h = mk("div", "sh"); h.appendChild(mk("h2", "", fa ? "از اولین قدم تا گواهی" : "From first step to certificate")); S2.appendChild(h);
    var steps = fa ? [["ثبت‌نام رایگان", "با ایمیل در چند ثانیه حساب بساز."], ["یادگیری با ویدیو", "درس‌ها را مرحله‌به‌مرحله ببین."], ["آزمون پایانی", "آنچه یاد گرفتی را بسنج."], ["گواهی با QR", "گواهی قابل تأیید بگیر و منتشر کن."]] : [["Free sign-up", "Create an account in seconds."], ["Learn by video", "Watch the lessons step by step."], ["Final exam", "Check what you learned."], ["QR certificate", "Get a verifiable certificate and share it."]];
    var ol = mk("ol", "prc-l"); steps.forEach(function (x, i) { var li = mk("li", ""); li.appendChild(mk("span", "prc-i", String(i + 1))); li.appendChild(mk("h3", "", x[0])); li.appendChild(mk("p", "", x[1])); ol.appendChild(li); });
    S2.appendChild(ol); var ref2 = $("#about", m) || $("#contact", m); if (ref2 && ref2.parentNode === m) m.insertBefore(S2, ref2); else m.appendChild(S2);
  }

  /* ---------- home: library / articles / tools (id: lib) ---------- */
  function homeLib() {
    var m = $("main"), fa = R.lang === "fa"; if (PAGE !== "home" || !m) return; var old = $("#lib"); if (old && old.dataset.sg === (fa ? "fa" : "en")) return; if (old) old.remove();
    var T = [[1, fa ? "هوش مصنوعی" : "AI tools", 77, "cpu"], [2, fa ? "دوره‌ها و پلتفرم‌ها" : "Courses and platforms", 139, "book"], [5, fa ? "کتاب و کتابخانه" : "Books and libraries", 50, "doc"], [6, fa ? "برنامه‌نویسی و وب" : "Programming and web", 66, "code"], [7, fa ? "هنر، سینما و صدا" : "Art, film and sound", 131, "film"], [8, fa ? "آموزش نرم‌افزارها" : "Software tutorials", 45, "spark"], [9, fa ? "دانلود نرم‌افزار" : "Software downloads", 105, "down"], [14, fa ? "کار و فریلنسری" : "Jobs and freelancing", 24, "brief"]];
    var P = { cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>', book: '<path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11.5V16c2 2 8 2 10 0v-4.5"/>', doc: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5"/>', code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>', film: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 4v16M16 4v16"/>', spark: '<path d="M4 20l1-4L16 5l3 3L8 19z"/>', down: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>', brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>' };
    var s = mk("section", "sec lib", ""); s.id = "lib"; s.dataset.sg = fa ? "fa" : "en"; s.setAttribute("aria-label", fa ? "کتابخانه و منابع" : "Library and resources");
    var h = mk("div", "sh"); h.appendChild(mk("h2", "", fa ? "کتابخانه، مقاله‌ها و ابزارها" : "Library, articles and tools")); h.appendChild(mk("p", "muted", fa ? "بیش از ۸۵۰ سایت و منبع دسته‌بندی‌شده برای یادگیری و کار، رایگان." : "850+ sorted sites and resources for learning and work, free to use.")); s.appendChild(h);
    var g = mk("ul", "lib-g");
    T.forEach(function (t) { var li = mk("li", ""), a = mk("a", "lib-t"); a.href = "resources.html#c" + t[0]; var ic = mk("span", "lib-i"); ic.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + P[t[3]] + "</svg>"; ic.style.setProperty("--h", String(t[0] * 47 % 360)); a.appendChild(ic); var b = mk("b", "", t[1]); a.appendChild(b); var sm = mk("small", "", (fa ? t[2].toLocaleString("fa-AF") : String(t[2])) + (fa ? " منبع" : " resources")); a.appendChild(sm); li.appendChild(a); g.appendChild(li); });
    s.appendChild(g);
    var row = mk("p", "lib-r"); [["library.html", fa ? "کتابخانهٔ آموزشی" : "Study library"], ["blog.html", fa ? "مقاله‌ها و وبلاگ" : "Articles and blog"], ["resources.html", fa ? "همهٔ منابع" : "All resources"]].forEach(function (x) { var a = mk("a", "btn", x[1]); a.href = x[0]; row.appendChild(a); }); s.appendChild(row);
    var ref = $("#process", m) || $("#about", m) || $("#contact", m); if (ref && ref.parentNode === m) m.insertBefore(s, ref); else m.appendChild(s);
  }
  /* ---------- "What is this site" bento (id: what) ---------- */
  var IC = { film: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 4v16M16 4v16M3 9h5M3 15h5M16 9h5M16 15h5"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>', award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.500-8"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>', grid: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>' };
  function what() {
    var m = $("main"), fa = R.lang === "fa", old = $("#what"); if (PAGE !== "home" || !m) return; if (old && old.dataset.sg === (fa ? "fa" : "en")) return; if (old) old.remove();
    var T = fa ? [["film", "پورتفولیوی من", "فیلم‌سازی، تدوین، گرافیک و برنامه‌نویسی؛ نمونه‌کارها در یک جا.", "works.html", "big"], ["book", "آکادمی رایگان", "دوره‌های ویدیویی با آزمون و گواهی.", "academy.html"], ["award", "گواهی با QR", "هر گواهی کد یکتا دارد و برای همه قابل تأیید است.", "verify.html"], ["grid", "کتابخانهٔ منابع", "لینک‌های بررسی‌شدهٔ یادگیری.", "library.html"], ["mail", "همکاری با من", "پروژه، تدوین یا مشاوره؟ بنویس.", "#contact"]]
      : [["film", "My portfolio", "Filmmaking, editing, graphic design and code; my work in one place.", "works.html", "big"], ["book", "Free academy", "Video courses with exams and certificates.", "academy.html"], ["award", "QR certificates", "Every certificate has a unique code anyone can verify.", "verify.html"], ["grid", "Resource library", "Checked links for learning.", "library.html"], ["mail", "Work with me", "A project, editing or advice? Write to me.", "#contact"]];
    var s2 = mk("section", "sec wh", ""); s2.id = "what"; s2.dataset.sg = fa ? "fa" : "en"; s2.setAttribute("aria-label", fa ? "این سایت چیست" : "What this site is");
    var h = mk("div", "sh"); h.appendChild(mk("h2", "", fa ? "این سایت چیست؟" : "What is this site?")); s2.appendChild(h);
    var g = mk("div", "wh-g"); T.forEach(function (t, i) { var a = mk("a", "wh-c" + (t[4] ? " wh-big" : "")); a.href = t[3]; a.style.setProperty("--i", i);
      var ic = document.createElementNS("http://www.w3.org/2000/svg", "svg"); ic.setAttribute("viewBox", "0 0 24 24"); ic.setAttribute("aria-hidden", "true"); ic.setAttribute("class", "wh-i"); ic.innerHTML = IC[t[0]]; a.appendChild(ic);
      a.appendChild(mk("h3", "", t[1])); a.appendChild(mk("p", "", t[2])); a.appendChild(mk("span", "wh-a", fa ? "←" : "→")); g.appendChild(a); });
    s2.appendChild(g); var ref = $("#numbers", m) || $("#work", m) || $("#about", m); if (ref && ref.parentNode === m) m.insertBefore(s2, ref); else m.appendChild(s2);
  }
  /* latest news cards on the home page (design.posts) */
  function posts() {
    var P = D.posts, fa = R.lang === "fa", old = $("#posts"); if (PAGE !== "home" || !Array.isArray(P)) return;
    var items = P.map(function (x, i) { if (x) x._i = i; return x; }).slice(0, 12).filter(function (x) { return x && (x.t || x.te); }).sort(function (a, b) { return String(b.d || "") < String(a.d || "") ? -1 : 1; }).slice(0, 6), sig = JSON.stringify([items, fa]);
    if (old && old.dataset.sg === sig) return; if (old) old.remove(); if (!items.length) return;
    var s = mk("section", "sec pst", ""); s.id = "posts"; s.dataset.sg = sig; s.setAttribute("aria-label", fa ? "تازه‌ها" : "Latest news");
    var h = mk("div", "sh"); h.appendChild(mk("h2", "", fa ? "تازه‌ها" : "Latest news")); s.appendChild(h);
    var l = mk("div", "pst-l");
    items.forEach(function (x) { var c = mk("article", "pst-c"), t = fa ? (x.t || x.te) : (x.te || x.t), b = fa ? (x.x || x.xe) : (x.xe || x.x);
      if (x.d && /^\d{4}-\d{2}-\d{2}/.test(x.d)) { var tm = mk("time", "pst-d", x.d.slice(0, 10)); tm.dateTime = x.d.slice(0, 10); tm.setAttribute("dir", "ltr"); c.appendChild(tm); }
      var hasBody = !!(x.bf || x.be), h3 = mk("h3", ""); if (!x.u && hasBody) { var ab = mk("a", "", t); ab.href = "blog.html#p" + x._i; h3.appendChild(ab); } else if (x.u && HU.test(x.u)) { var a = mk("a", "", t); a.href = x.u; if (/^https:/i.test(x.u)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } h3.appendChild(a); } else h3.textContent = t;
      c.appendChild(h3); if (b) c.appendChild(mk("p", "", b)); l.appendChild(c); });
    s.appendChild(l); after(s);
  }
  /* team / instructors on the academy page (design.team) */
  function team() {
    var T = D.team, fa = R.lang === "fa", old = $("#team"), m = $("main"); if (PAGE !== "academy" || !Array.isArray(T) || !m) return;
    var items = T.slice(0, 12).filter(function (x) { return x && x.n; }), sig = JSON.stringify([items, fa]);
    if (old && old.dataset.sg === sig) return; if (old) old.remove(); if (!items.length) return;
    var s = mk("section", "sec tm", ""); s.id = "team"; s.dataset.sg = sig; s.setAttribute("aria-label", fa ? "مدرس‌ها و تیم" : "Instructors and team");
    var h = mk("div", "sh"); h.appendChild(mk("h2", "", fa ? "مدرس‌ها و تیم" : "Instructors & team")); s.appendChild(h);
    var l = mk("div", "tm-l");
    items.forEach(function (x, i) { var c = mk("article", "tm-c"), a = mk("div", "tm-a tm-a" + (i % 4), String(x.n).trim().charAt(0)); a.setAttribute("aria-hidden", "true"); c.appendChild(a);
      c.appendChild(mk("h3", "", x.n)); var r = fa ? (x.rf || x.re) : (x.re || x.rf); if (r) c.appendChild(mk("p", "tm-r", r)); var b = fa ? (x.bf || x.be) : (x.be || x.bf); if (b) c.appendChild(mk("p", "tm-b", b)); l.appendChild(c); });
    s.appendChild(l); var f = $("#faq", m); if (f && f.parentNode === m) m.insertBefore(s, f); else m.appendChild(s);
  }
  function partners() {
    var P = D.partners, fa = R.lang === "fa", old = $("#partners"); if (PAGE !== "home" || !Array.isArray(P)) return;
    var items = P.slice(0, 16).filter(function (x) { return x && x.n; }), sig = JSON.stringify([items, fa]); if (old && old.dataset.sg === sig) return; if (old) old.remove(); if (!items.length) return;
    var s = mk("section", "sec prt"); s.id = "partners"; s.dataset.sg = sig; s.setAttribute("aria-label", fa ? "همکاران و شریک‌ها" : "Partners");
    s.appendChild(mk("p", "prt-h", fa ? "همکاران و شریک‌های ما" : "Our partners")); var l = mk("ul", "prt-l");
    items.forEach(function (x) { var li = mk("li"), a; if (x.u && HU.test(x.u)) { a = mk("a", "", x.n); a.href = x.u; if (/^https:/i.test(x.u)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } } else a = mk("span", "", x.n); li.appendChild(a); l.appendChild(li); });
    s.appendChild(l); after(s);
  }
  function banner() {
    var B = D.banner, fa = R.lang === "fa", old = $("#annc"), x = Array.isArray(B) && B[0], t = x && (fa ? x.f : x.e) || (x && (x.f || x.e));
    if (!t) { if (old) old.remove(); return; } var key = "am-an" + t.length + t.charCodeAt(0), shut = false; try { shut = sessionStorage.getItem(key) === "1"; } catch (e) {}
    if (shut || (old && old.dataset.sg === t + fa)) return; if (old) { clearInterval(old._iv); old.remove(); }
    var b = mk("div", "annc"); b.id = "annc"; b.dataset.sg = t + fa; b.setAttribute("role", "region"); b.setAttribute("aria-label", fa ? "اعلان" : "Announcement");
    var tm = null, when = x.d ? new Date(x.d).getTime() : NaN;
    if (!isNaN(when) && when > Date.now()) {
      tm = mk("b", "annc-t"); tm.setAttribute("aria-hidden", "true"); b.dataset.sg += x.d;
      var tick = function () { var ms = when - Date.now(); if (ms <= 0 || !document.body.contains(b)) { clearInterval(b._iv); if (ms <= 0) tm.remove(); return; }
        var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), sc = Math.floor(ms % 6e4 / 1e3), z = function (n) { return n < 10 ? "0" + n : "" + n; };
        tm.textContent = (d ? d + (fa ? " روز " : "d ") : "") + z(h) + ":" + z(m) + ":" + z(sc); };
      tick(); b._iv = setInterval(tick, 1000);
    }
    var i = x.u && HU.test(x.u) ? mk("a", "", t) : mk("span", "", t); if (i.tagName === "A") { i.href = x.u; if (/^https:/i.test(x.u)) { i.target = "_blank"; i.rel = "noopener noreferrer"; } } b.appendChild(i); if (tm) b.appendChild(tm);
    var c = mk("button", "annc-x", "×"); c.type = "button"; c.setAttribute("aria-label", fa ? "بستن" : "Close"); c.onclick = function () { clearInterval(b._iv); b.remove(); try { sessionStorage.setItem(key, "1"); } catch (e) {} }; b.appendChild(c);
    document.body.insertBefore(b, document.body.firstChild);
  }

  /* ---------- 16. colour theme preset from admin (design.accent) ---------- */
  var ACC = { violet: ["#1F7EC2", "#8CC8F2"], teal: ["#0B6DB8", "#4FE3CF"], crimson: ["#C0233E", "#FF7A90"], orange: ["#B54708", "#FFB066"], indigo: ["#2F6FA8", "#9FB0FF"], magenta: ["#0B4F8A", "#BFE3FA"] };
  function theme() {
    var a = ACC[D.accent], st = document.getElementById("fxTheme"); if (!a) { if (st) st.remove(); return; }
    var css = ':root:not([data-theme="dark"]){--accent:' + a[0] + '}:root[data-theme="dark"]{--accent:' + a[1] + ';--sky:' + a[1] + '}';
    if (!st) { st = document.createElement("style"); st.id = "fxTheme"; document.head.appendChild(st); } if (st.textContent !== css) st.textContent = css;
  }
  theme();


  /* about page: link cards to the other pages, so the page ends with a clear next step */
  function aboutCta() {
    if (PAGE !== "about") return; var a = document.getElementById("about"); if (!a || document.getElementById("abCta")) return; var fa = R.lang === "fa";
    var L = [["graphics.html", fa ? "نمونه‌کار گرافیک" : "Graphic design", fa ? "۸۴ طرح پوستر، برند و چاپ" : "84 poster, brand and print designs"], ["certificates.html", fa ? "گواهی‌ها" : "Certificates", fa ? "گواهی‌های گذراندن دوره" : "Course completion certificates"], ["resources.html", fa ? "آرشیو منابع" : "Resource archive", fa ? "۸۵۰+ سایت و ابزار مفید" : "850+ useful sites and tools"], ["academy.html", fa ? "آکادمی سینه‌کد" : "CineCode Academy", fa ? "دوره‌های رایگان با گواهی" : "Free courses with certificates"]];
    var s = mk("section", "ac-sec ab-cta"); s.id = "abCta"; var h = mk("h2", "", fa ? "ادامهٔ مسیر" : "Keep exploring"); s.appendChild(h); var g = mk("div", "ab-cg");
    L.forEach(function (x) { var c = mk("a", "ab-c"); c.href = x[0]; c.appendChild(mk("b", "", x[1])); c.appendChild(mk("small", "", x[2])); g.appendChild(c); });
    s.appendChild(g); a.appendChild(s);
  }
  /* three entry doors under the hero: learn / see work / hire (two audiences, one page) */

  /* v99: hero trust bar (real counts) + mega-menu descriptions in the header */
  function trustBar() {
    var cta = $("#cc .cc-cta"), fa = R.lang === "fa"; if (PAGE !== "home" || !cta) return;
    var key = (fa ? "fa" : "en") + (S.gallery || []).length + (S.certs || []).length, o = $("#ccTr");
    if (o && o.dataset.k === key) return; if (o) o.remove();
    var cs = (S.courses || []).filter(function (c) { return !c.sample; }).length, gx = (S.gallery || []).filter(function (g) { return g && !g.hidden; }).length, ce = (S.certs || []).filter(function (c) { return c && c.img; }).length;
    var nf = function (n) { try { return new Intl.NumberFormat(fa ? "fa-AF" : "en").format(n); } catch (e) { return String(n); } };
    var T = [[gx, fa ? "طرح گرافیک" : "Designs"], [ce, fa ? "گواهی" : "Certificates"], [cs, fa ? "دورهٔ رایگان" : "Free courses"], ["QR", fa ? "گواهی قابل تأیید" : "Verifiable certs"]].filter(function (t) { return t[0] !== 0; });
    var u = mk("ul", "cc-tr"); u.id = "ccTr"; u.dataset.k = key;
    T.forEach(function (t) { var li = mk("li", ""), b = mk("b", "", typeof t[0] === "number" ? nf(t[0]) : t[0]); if (typeof t[0] === "number") b.dataset.to = t[0]; li.appendChild(b); li.appendChild(mk("span", "", t[1])); u.appendChild(li); });
    cta.parentNode.insertBefore(u, cta.nextSibling);
    var cc = $("#cc"); if (cc && !$(".cc-av", cc)) { var im = mk("img", "cc-av"); im.src = "assets/img/me-sq.webp"; im.width = 84; im.height = 84; im.alt = ""; cc.insertBefore(im, cc.firstChild); }
  }
  var MD = { abT: ["پروفایل کامل", "Full profile"], nAbout: ["من کی هستم", "Who I am"], nEdu: ["تحصیل و آموزش", "Education"], nExp: ["تجربهٔ کاری", "Experience"], nSkills: ["مهارت‌ها و ابزارها", "Skills and tools"], nLang: ["زبان‌ها", "Languages"],
    nWork: ["پروژه‌های برگزیده", "Featured projects"], nDesign: ["طراحی و برندینگ", "Design and branding"], nWorks: ["همهٔ نمونه‌کارها", "All works"], nGfx: ["گالری گرافیک", "Graphic gallery"], nVid: ["ویدیو و شوریل", "Video and showreel"],
    nCerts: ["تأیید با کد یا QR", "Verify by code or QR"], nCertP: ["گواهی‌های ثبت‌شده", "Issued certificates"], nCourses: ["دوره‌های آموزشی", "Training courses"], nAcademy: ["یادگیری، آزمون، گواهی", "Learn, test, certify"], libPT: ["منابع بررسی‌شده", "Curated resources"], nBlog: ["مقاله و یادداشت", "Articles and notes"],
    nLinks: ["همهٔ لینک‌های من", "All my links"], cvT: ["رزومه، چاپ و PDF", "Resume, print, PDF"], privacy: ["حریم خصوصی", "Privacy"] };
  function megaDesc() {
    var fa = R.lang === "fa";
    $$(".hm:not(.hs) a[role=menuitem]").forEach(function (a) {
      var sp = a.querySelector("span[data-k]"), d = sp && MD[sp.getAttribute("data-k")]; if (!d) return;
      var t = a.querySelector("em.md"); if (!t) { t = mk("em", "md"); a.appendChild(t); } var dv = d[fa ? 0 : 1]; if (t.textContent !== dv) t.textContent = dv;
      if (!a.classList.contains("mg")) a.classList.add("mg");
    });
    $$(".hm:not(.hs)").forEach(function (m) { if (!m.classList.contains("mega")) m.classList.add("mega"); });
  }
  function doors() {
    var m = $("main"), cc = document.getElementById("cc"), fa = R.lang === "fa"; if (PAGE !== "home" || !m || !cc || cc.parentNode !== m) return;
    var key = fa ? "fa" : "en", o = document.getElementById("doors"); if (o && o.dataset.k === key) return; if (o) o.remove();
    var D = fa ? [["می‌خواهم یاد بگیرم", "دوره‌های رایگان با آزمون و گواهی", "academy.html", "#39A9E8"], ["می‌خواهم کارها را ببینم", "نمونه‌کار، گرافیک و ریلز", "works.html", "#39A9E8"], ["پروژه دارم", "همکاری با من", "#contact", "#FFC857"]] : [["I want to learn", "Free courses with exams and certificates", "academy.html", "#39A9E8"], ["I want to see the work", "Projects, graphics and reels", "works.html", "#39A9E8"], ["I have a project", "Work with me", "#contact", "#FFC857"]];
    var sec = mk("section", "sec doors", ""); sec.id = "doors"; sec.dataset.k = key; sec.setAttribute("aria-label", fa ? "از کجا شروع کنم؟" : "Where do I start?");
    var g = mk("ul", "dr-g"); D.forEach(function (d, i) { var li = mk("li", ""), a = mk("a", "dr-c"); a.href = d[2]; a.style.setProperty("--c", d[3]); a.appendChild(mk("span", "dr-n", "0" + (i + 1))); var t = mk("span", "dr-t"); t.appendChild(mk("b", "", d[0])); t.appendChild(mk("small", "", d[1])); a.appendChild(t); a.appendChild(mk("span", "dr-a", fa ? "←" : "→")); li.appendChild(a); g.appendChild(li); });
    sec.appendChild(g); m.insertBefore(sec, cc.nextSibling);
  }
  /* certificate-verification tile (trust signal): every certificate has a code and a QR anyone can check */
  function vtile() {
    var m = $("main"), fa = R.lang === "fa"; if (PAGE !== "home" || !m) return;
    var key = fa ? "fa" : "en", o = document.getElementById("vtile"); if (o && o.dataset.k === key) return; if (o) o.remove();
    var sec = mk("section", "sec vt", ""); sec.id = "vtile"; sec.dataset.k = key; sec.setAttribute("aria-label", fa ? "تأیید گواهی" : "Certificate verification");
    var box = mk("div", "vt-b"), tx = mk("div", "vt-t");
    tx.appendChild(mk("span", "vt-k", fa ? "گواهی قابل تأیید" : "Verifiable certificates"));
    tx.appendChild(mk("h2", "", fa ? "هر گواهی یک کد و یک QR دارد. هر کسی می‌تواند تأییدش کند." : "Every certificate has a code and a QR. Anyone can verify it."));
    var row = mk("p", "vt-r"), a1 = mk("a", "btn go", fa ? "تأیید گواهی" : "Verify a certificate"), a2 = mk("a", "btn", fa ? "دیدن گواهی‌ها" : "See certificates"); a1.href = "verify.html"; a2.href = "certificates.html"; row.appendChild(a1); row.appendChild(a2); tx.appendChild(row);
    var q = mk("div", "vt-q"); q.setAttribute("aria-hidden", "true"); q.appendChild(mk("span", "vt-qr", "")); q.appendChild(mk("small", "", fa ? "نمونهٔ QR" : "QR sample"));
    box.appendChild(tx); box.appendChild(q); sec.appendChild(box);
    var ref = $("#lib", m) || $("#about", m) || $("#contact", m); if (ref && ref.parentNode === m) m.insertBefore(sec, ref); else m.appendChild(sec);
  }
  /* home "work": while every project is still a sample, show a mosaic of the real graphic designs instead of empty placeholders */
  function workMosaic() {
    var sec = document.getElementById("work"); if (PAGE !== "home" || !sec) return;
    var fa = R.lang === "fa", real = (S.projects || []).some(function (p) { return p && !p.sample; }), key = fa ? "fa" : "en", o = document.getElementById("wm");
    var gal = (S.gallery || []).filter(function (g) { return g && /^[\w-]+$/.test(g.id || "") && !g.hidden; });
    sec.classList.toggle("wm-on", !real && gal.length >= 6);
    if (real || gal.length < 6) { if (o) o.remove(); return; }
    if (o && o.dataset.k === key) return; if (o) o.remove();
    var pick = [], seen = {}; gal.forEach(function (g) { if (!seen[g.cat] && pick.length < 8) { seen[g.cat] = 1; pick.push(g); } }); gal.forEach(function (g) { if (pick.length < 8 && pick.indexOf(g) < 0) pick.push(g); });
    var CN = fa ? { poster: "پوستر", academy: "آموزشی", banner: "بنر", brand: "برند", print: "چاپی" } : { poster: "Poster", academy: "Academy", banner: "Banner", brand: "Brand", print: "Print" };
    var w = mk("div", ""); w.id = "wm"; w.dataset.k = key; var g2 = mk("div", "wm-g");
    pick.forEach(function (g, i) { var a = mk("a", "wm-c" + (i === 0 ? " wm-big" : "")); a.href = "graphics.html"; a.setAttribute("aria-label", CN[g.cat] || ""); var im = mk("img"); im.src = "assets/work/" + g.id + "-t.webp"; im.alt = ""; im.loading = "lazy"; im.decoding = "async"; im.width = 480; im.height = 480; a.appendChild(im); a.appendChild(mk("span", "wm-k", CN[g.cat] || "")); g2.appendChild(a); });
    w.appendChild(g2); var p = mk("p", "wm-m"), b = mk("a", "btn go", fa ? "دیدن همهٔ ۸۴ طرح" : "See all " + gal.length + " designs"); if (fa) b.textContent = "دیدن همهٔ " + gal.length.toLocaleString("fa-AF") + " طرح"; b.href = "graphics.html"; p.appendChild(b); w.appendChild(p);
    var host = sec.querySelector(":scope > div:not(.sh)"); (host || sec).appendChild(w);
  }
  /* home "about": portrait card with real facts beside the text (the section was text only) */
  function aboutPic() {
    var sec = document.getElementById("about"); if (PAGE !== "home" || !sec) return;
    var fa = R.lang === "fa", key = fa ? "fa" : "en", o = sec.querySelector(".ab-pic"); if (o && o.dataset.k === key) return; if (o) o.remove();
    var F = fa ? ["کابل، افغانستان", "هنر سمعی و بصری (سینما)، دانشگاه کابل", "علوم کامپیوتر، دانشگاه سلام"] : ["Kabul, Afghanistan", "Audio-visual arts (cinema), Kabul University", "Computer science, Salaam University"];
    var f = mk("figure", "ab-pic"); f.dataset.k = key; f.setAttribute("aria-hidden", "true");
    var im = mk("img"); im.src = "assets/img/me.webp"; im.alt = ""; im.width = 480; im.height = 482; im.loading = "lazy"; im.decoding = "async"; f.appendChild(im);
    F.forEach(function (t, i) { f.appendChild(mk("span", "ab-ch c" + (i + 1), t)); });
    sec.classList.add("ab-two"); sec.appendChild(f);
  }
  function all() { try { tidyNote(); trustBar(); megaDesc(); doors(); vtile(); workMosaic(); aboutPic(); homeExtras(); homeLib(); what(); layout(); navEdit(); faq(); team(); news(); posts(); lpath(); compare(); board(); optin(); chrome(); worksQ(); blog(); testi(); partners(); banner(); curtain(); scramble(); heroTwo(); bands(); footerLinks(); aboutLinks(); aboutCta(); workMore(); wow(); if (on("glow")) glow(); if (on("kinetic")) kinetic(); if (on("tilt")) tilt(); if (on("magnet")) magnet(); if (on("particles")) particles(); if (on("stagger")) stagger(); if (on("words")) words(); if (on("parallax")) parallax(); } catch (e) { if (window.console) console.warn("fx2", e); } }
  all();
  /* pages render after this script runs and again on language change: look again when the DOM changes */
  var t = 0; new MutationObserver(function (recs) {
    /* the typing animation changes the DOM every few ms: ignore it, or the debounce never fires */
    var real = recs.some(function (r) { var n = r.target; return !(n.nodeType === 1 ? n : n.parentNode) || !(n.nodeType === 1 ? n : n.parentNode).closest || !(n.nodeType === 1 ? n : n.parentNode).closest(".cc-kin,.fx-cur,.fx-pc,#ccTyped"); });
    if (!real) return; clearTimeout(t); t = setTimeout(all, 120);
  }).observe(document.body, { childList: true, subtree: true });
})();
