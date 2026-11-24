/* extras.js: polish layer (cursor, word reveal, parallax, showreel, before/after, share, PDF/booking buttons, lightbox arrows).
   Everything here is optional: if a data field is empty, the matching piece simply does not appear. */
(function () {
  "use strict";
  var S = window.SITE || {}, R = document.documentElement, PAGE = document.body.dataset.page || "home";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fa = function () { return R.lang === "fa"; };
  var tr = function (a, b) { return fa() ? a : b; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var okPath = function (p) { return typeof p === "string" && /^[\w./-]+$/.test(p) && p.indexOf("..") < 0; };
  var okUrl = function (u) { return typeof u === "string" && /^https:\/\//i.test(u); };
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var moving = function () { return !still && !R.classList.contains("lite"); };

  /* 1. custom cursor ring (fine pointers only; the real cursor stays) */
  function cursor() {
    if (still || !matchMedia("(hover:hover) and (pointer:fine)").matches || $(".cur")) return;
    var c = document.createElement("div"); c.className = "cur"; c.setAttribute("aria-hidden", "true"); document.body.appendChild(c);
    var x = -100, y = -100, cx = x, cy = y, on = false;
    addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; if (!on) { on = true; c.classList.add("on"); cx = x; cy = y; } }, { passive: true });
    document.addEventListener("mouseleave", function () { c.classList.remove("on"); on = false; });
    document.addEventListener("mouseover", function (e) { c.classList.toggle("big", !!e.target.closest("a,button,.gi,.cth,summary,[role=button],input[type=range],select")); c.classList.toggle("img", !!e.target.closest(".hph,.pcv,.gi")); });
    (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.transform = "translate(" + cx + "px," + cy + "px)"; requestAnimationFrame(loop); })();
  }

  /* 2. word-by-word reveal for the name and headings */
  function split(el) {
    if (!el || el.querySelector(".w")) return 0;
    var n = 0, walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var parts = ch.nodeValue.split(/(\s+)/), f = document.createDocumentFragment();
          parts.forEach(function (w) { if (!w) return; if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(" ")); return; } var o = document.createElement("span"); o.className = "w"; var i = document.createElement("span"); i.style.setProperty("--i", n++); i.textContent = w; o.appendChild(i); f.appendChild(o); });
          node.replaceChild(f, ch);
        } else if (ch.nodeType === 1 && !ch.matches("svg,img,input,button")) walk(ch);
      });
    };
    walk(el); return n;
  }
  var io;
  function reveal() {
    if (!moving()) return;
    $$("#name,.ph1").forEach(function (h) { if (split(h)) h.classList.add("wrev", "in"); });
    if (!("IntersectionObserver" in window)) return;
    io = io || new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
    $$("main h2.h2s,.sh h2,.ac-sec h2").forEach(function (h) { if (split(h)) { h.classList.add("wrev"); io.observe(h); } });
  }

  /* 5. parallax on hero photo and gallery pictures */
  var px = [];
  function parallax() {
    px = $$(".hph img,.gi img").map(function (i) { return { el: i, k: i.closest(".hph") ? .06 : .035 }; });
    if (!moving() || !px.length || window.__pxOn) return; window.__pxOn = true;
    var tick = 0, run = function () { tick = 0; if (!moving()) return; var vh = innerHeight;
      px.forEach(function (o) { var r = o.el.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) return; var d = (r.top + r.height / 2 - vh / 2) * o.k; o.el.style.transform = "translate3d(0," + d.toFixed(1) + "px,0) scale(1.1)"; }); };
    addEventListener("scroll", function () { if (!tick) tick = requestAnimationFrame(run); }, { passive: true }); run();
  }

  /* 6. showreel (home): S.showreel = { src:"assets/video/reel.mp4", poster:"assets/video/reel.webp", yt:"" } */
  function showreel() {
    if (PAGE !== "home" || $("#showreel")) return;
    var r = S.showreel || {}, hasV = okPath(r.src), hasY = /^[\w-]{6,20}$/.test(r.yt || "");
    if (!hasV && !hasY) return;
    var host = $("#work"); if (!host) return;
    var s = document.createElement("section"); s.id = "showreel"; s.className = "sec rv"; s.setAttribute("aria-label", "Showreel");
    var title = tr("ریل نمایشی", "Showreel");
    s.innerHTML = '<div class="sh"><h2>' + esc(title) + '</h2></div><div>' + (hasV
      ? '<div class="reel"><video muted loop playsinline preload="none"' + (okPath(r.poster) ? ' poster="' + esc(r.poster) + '"' : "") + ' src="' + esc(r.src) + '" aria-label="' + esc(title) + '"></video><button type="button" class="btn reel-snd" aria-pressed="false">' + esc(tr("پخش با صدا", "Play with sound")) + '</button></div>'
      : '<div class="reel"><button type="button" class="vid" data-ryt="' + esc(r.yt) + '"><span class="play" aria-hidden="true"></span><span class="lbl">' + esc(tr("پخش ریل", "Play showreel")) + '</span></button></div>') + '</div>';
    host.parentNode.insertBefore(s, host);
    var v = $("video", s);
    if (v) {
      if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { v.preload = "auto"; if (!still) v.play().catch(function () {}); } else v.pause(); }); }, { threshold: .4 }).observe(v);
      $(".reel-snd", s).onclick = function () { v.muted = !v.muted; this.setAttribute("aria-pressed", String(!v.muted)); if (!v.muted) { v.currentTime = 0; v.play().catch(function () {}); } this.textContent = v.muted ? tr("پخش با صدا", "Play with sound") : tr("بی‌صدا", "Mute"); };
    }
    var b = $("[data-ryt]", s);
    if (b) b.onclick = function () { b.outerHTML = '<iframe class="reel-yt" src="https://www.youtube-nocookie.com/embed/' + esc(r.yt) + '?autoplay=1&rel=0" title="' + esc(title) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; };
  }

  /* 7. before / after (home): S.compare = [{ title:{fa,en}, before:"assets/work/a.webp", after:"assets/work/b.webp" }] */
  function compare() {
    if (PAGE !== "home" || $("#compare")) return;
    var list = (S.compare || []).filter(function (c) { return okPath(c.before) && okPath(c.after); });
    if (!list.length) return;
    var host = $("#design"); if (!host) return;
    var s = document.createElement("section"); s.id = "compare"; s.className = "sec rv";
    var L = function (o) { return o && typeof o === "object" ? (o[R.lang] || o.en || "") : (o || ""); };
    s.innerHTML = '<div class="sh"><h2>' + esc(tr("قبل و بعد", "Before and after")) + '</h2></div><div class="cmps">' + list.map(function (c) {
      return '<figure class="cmp" style="--pos:50%"><img src="' + esc(c.after) + '" alt="' + esc(tr("بعد", "After")) + '" loading="lazy"><div class="cmp-b"><img src="' + esc(c.before) + '" alt="' + esc(tr("قبل", "Before")) + '" loading="lazy"></div>' +
        '<span class="cmp-l cmp-lb">' + esc(tr("قبل", "Before")) + '</span><span class="cmp-l cmp-la">' + esc(tr("بعد", "After")) + '</span><input type="range" min="0" max="100" value="50" aria-label="' + esc(tr("لغزنده مقایسه", "Comparison slider")) + '"><figcaption>' + esc(L(c.title)) + '</figcaption></figure>'; }).join("") + '</div>';
    host.parentNode.insertBefore(s, host.nextSibling);
    $$(".cmp input", s).forEach(function (i) { i.oninput = function () { i.parentNode.style.setProperty("--pos", i.value + "%"); }; });
  }

  /* 11 + 12. CV PDF button, booking button */
  function buttons() {
    if (PAGE === "cv" && okPath(S.cvPdf) && !$("#cvPdf")) { var bar = $(".cv-bar"); if (bar) { var a = document.createElement("a"); a.id = "cvPdf"; a.className = "btn"; a.href = S.cvPdf; a.download = ""; a.textContent = tr("دانلود رزومه PDF", "Download CV (PDF)"); bar.appendChild(a); } }
    if (PAGE === "home" && okUrl(S.booking) && !$("#bookBtn")) { var f = $("#form"); if (f) { var b = document.createElement("a"); b.id = "bookBtn"; b.className = "btn"; b.href = S.booking; b.target = "_blank"; b.rel = "noopener noreferrer"; b.style.marginBottom = "16px"; b.style.display = "inline-flex"; b.textContent = tr("رزرو وقت جلسه", "Book a call"); f.parentNode.insertBefore(b, f); } }
  }

  /* 13. share button on a project page */
  function share() {
    if (PAGE !== "project") return;
    var root = $("#project"); if (!root) return;
    var add = function () {
      var t = $(".ptitle", root); if (!t || $("#shareBtn", root)) return;
      var b = document.createElement("button"); b.type = "button"; b.id = "shareBtn"; b.className = "btn"; b.textContent = tr("اشتراک‌گذاری", "Share"); t.appendChild(b);
      b.onclick = function () { var d = { title: document.title, url: location.href }; if (navigator.share) navigator.share(d).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { b.textContent = tr("لینک کپی شد", "Link copied"); setTimeout(function () { b.textContent = tr("اشتراک‌گذاری", "Share"); }, 2000); }); };
    };
    new MutationObserver(add).observe(root, { childList: true }); add();
  }

  /* 9. lightbox: arrow keys and buttons move between graphic designs */
  function lightbox() {
    var d = $("#cdlg"); if (!d || d.dataset.nav || !(S.gallery || []).length) return; d.dataset.nav = "1";
    var ids = S.gallery.map(function (g) { return g.id; }), img = $("#cdimg");
    var cur = function () { var m = /assets\/work\/([^/]+)\.webp/.exec(img.getAttribute("src") || ""); return m ? ids.indexOf(m[1]) : -1; };
    var go = function (n) { var i = cur(); if (i < 0) return; i = (i + n + ids.length) % ids.length; img.src = "assets/work/" + ids[i] + ".webp"; };
    var mk = function (cls, txt, n) { var b = document.createElement("button"); b.type = "button"; b.className = "btn lb-n " + cls; b.textContent = txt; b.setAttribute("aria-label", n > 0 ? tr("بعدی", "Next") : tr("قبلی", "Previous")); b.onclick = function () { go(n); }; d.appendChild(b); };
    mk("lb-p", "‹", -1); mk("lb-x", "›", 1);
    d.addEventListener("keydown", function (e) { if (cur() < 0) return; var rtl = fa(); if (e.key === "ArrowRight") { go(rtl ? -1 : 1); e.preventDefault(); } if (e.key === "ArrowLeft") { go(rtl ? 1 : -1); e.preventDefault(); } });
    d.addEventListener("close", function () { $$(".lb-n", d).forEach(function () {}); });
    new MutationObserver(function () { var on = cur() >= 0; $$(".lb-n", d).forEach(function (b) { b.hidden = !on; }); }).observe(img, { attributes: true, attributeFilter: ["src"] });
  }


  /* hero: typewriter roles + viewfinder frame with running timecode */
  var twT = 0, twK = "";
  function hero() {
    if (PAGE !== "home") return;
    var nm = $("#name"); if (!nm || !nm.parentNode) return;
    var r = S.roles, txt = r && typeof r === "object" ? (r[R.lang] || r.en || "") : (r || "");
    var words = String(txt).split(/\s*[·•|،,]\s*/).filter(Boolean); if (!words.length) return;
    var tw = $("#tw");
    if (!tw) { tw = document.createElement("p"); tw.id = "tw"; tw.className = "tw"; tw.innerHTML = '<span class="sr">' + esc(words.join(", ")) + '</span><span class="tww" aria-hidden="true"></span><i class="twc" aria-hidden="true"></i>'; nm.parentNode.insertBefore(tw, nm.nextSibling); }
    var key = R.lang + words.join("|"); if (key === twK) return; twK = key; clearTimeout(twT);
    var out = $(".tww", tw), i = 0, j = 0, del = false;
    out.textContent = words.join(" · "); var twc = $(".twc", tw); if (twc) twc.hidden = true;   /* the only typewriter on the site is the hero title */
    if (false) (function step() { var w = words[i]; if (!del) { j++; out.textContent = w.slice(0, j); if (j >= w.length) { del = true; twT = setTimeout(step, 1500); return; } twT = setTimeout(step, 85); }
      else { j--; out.textContent = w.slice(0, j); if (j <= 0) { del = false; i = (i + 1) % words.length; twT = setTimeout(step, 350); return; } twT = setTimeout(step, 40); } })();
    var ph = $(".hph"); if (ph && !$(".vf", ph)) { var v = document.createElement("span"); v.className = "vf"; v.setAttribute("aria-hidden", "true"); v.innerHTML = '<b><i></i>REC</b><span class="tc">00:00:00:00</span>'; ph.appendChild(v);
      var t0 = performance.now(), tc = $(".tc", v), pad = function (n) { return (n < 10 ? "0" : "") + n; };
      var up = function () { if (!document.hidden && moving()) { var f = Math.floor((performance.now() - t0) / 1000 * 24), sec = Math.floor(f / 24); tc.textContent = pad(Math.floor(sec / 3600) % 100) + ":" + pad(Math.floor(sec / 60) % 60) + ":" + pad(sec % 60) + ":" + pad(f % 24); } };
      /* v145: timecode is static (a ticking counter looked like blinking) */ tc.textContent = "REC"; }
  }


  /* stage 2: counters, second marquee row, timeline reveal, gallery rail, card spotlight */
  var DIG = { fa: "۰۱۲۳۴۵۶۷۸۹" };
  function counters() {
    return; /* v127: numbers are shown as-is, no count-up from zero */
    if (!moving()) return;
    $$("#hstats dd,.pf-stats dd,.ac-stats b").forEach(function (el) {
      if (el.dataset.cnt) return; var raw = el.textContent.trim(); if (!/\d|[۰-۹]/.test(raw)) return;
      var latin = raw.replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }), n = parseInt(latin, 10); if (!isFinite(n) || n < 2 || n > 99999) return;
      el.dataset.cnt = "1"; var per = /[۰-۹]/.test(raw), fmt = function (v) { var t = String(v); return per ? t.replace(/\d/g, function (d) { return DIG.fa[d]; }) : t; };
      el.textContent = fmt(0);
      var run = function () { var t0 = performance.now(), dur = 1100; (function f(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(n * e)); if (k < 1) requestAnimationFrame(f); else el.textContent = raw; })(t0); };
      if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); run(); } }, { threshold: .4 }); o.observe(el); } else el.textContent = raw;
    });
  }
  function marquee2() {
    var m = $("#mq"), t = $("#mqt"); if (!m || !t || !t.innerHTML) return;
    var m2 = $("#mq2");
    if (!m2) { m2 = m.cloneNode(true); m2.id = "mq2"; m2.classList.add("rev"); $("#mqt", m2).id = "mqt2"; m.parentNode.insertBefore(m2, m.nextSibling); }
    var t2 = $("#mqt2"); if (t2 && t2.innerHTML !== t.innerHTML) t2.innerHTML = t.innerHTML;
  }
  var tio;
  function timeline() {
    var items = $$(".tlv li"); if (!items.length) return;
    if (!moving() || !("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("in"); }); return; }
    tio = tio || new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); tio.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i, n) { if (i.dataset.tl) return; i.dataset.tl = "1"; i.style.setProperty("--n", n % 4); tio.observe(i); });
  }
  function rail() {
    var g = $("#gal"); if (!g || !g.children.length) return;
    if (!g.classList.contains("rail")) {
      g.classList.add("rail"); var w = document.createElement("div"); w.className = "railw"; g.parentNode.insertBefore(w, g); w.appendChild(g);
      [["l", "‹", -1], ["r", "›", 1]].forEach(function (b) { var x = document.createElement("button"); x.type = "button"; x.className = "rbtn " + b[0]; x.textContent = b[1]; x.setAttribute("aria-label", b[2] < 0 ? tr("چپ", "Scroll left") : tr("راست", "Scroll right")); x.onclick = function () { g.scrollBy({ left: b[2] * g.clientWidth * .8, behavior: still ? "auto" : "smooth" }); }; w.appendChild(x); });
      var down = false, sx = 0, sl = 0, moved = false;
      g.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = g.scrollLeft; });
      addEventListener("pointermove", function (e) { if (!down) return; var d = e.clientX - sx; if (Math.abs(d) > 4) { moved = true; g.classList.add("drag"); } g.scrollLeft = sl - d; });
      addEventListener("pointerup", function () { if (!down) return; down = false; setTimeout(function () { g.classList.remove("drag"); }, 0); });
      g.addEventListener("click", function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    }
  }
  var spotOn = false;
  function spotlight() {
    if (spotOn || !matchMedia("(hover:hover)").matches) return; spotOn = true;
    document.addEventListener("pointermove", function (e) { var c = e.target.closest && e.target.closest(".card,.dcard,.pcards a,.ac-card,.fcol,.cc-p,.cc-misb,.gal a,.pc,.cc"); if (!c) return; var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); }, { passive: true });
  }

  window.__fx = function () { try { hero(); counters(); marquee2(); timeline(); rail(); spotlight(); reveal(); parallax(); showreel(); compare(); buttons(); lightbox(); } catch (e) { if (window.console) console.warn("fx", e); } };
  cursor(); share(); window.__fx();
})();
