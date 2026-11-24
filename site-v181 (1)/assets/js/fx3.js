/* fx3.js: living-design layer. Own code, no libraries. */
(function () {
  "use strict";
  var R = document.documentElement, S = window.SITE || {}, PAGE = document.body.dataset.page || "home";
  if (PAGE === "admin") return;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var D = {}; try { D = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; } catch (e) {}
  /* v128: install-as-app button (shown only when the browser offers it) */
  (function () { var ev = null; function mk() { if (document.getElementById("pwaI") || !ev) return; var h = document.querySelector(".fbar-r"); if (!h) { setTimeout(mk, 1500); return; } var a = document.createElement("button"); a.id = "pwaI"; a.type = "button"; a.textContent = R.lang === "fa" ? "نصب برنامه" : "Install app"; a.style.cssText = "background:none;border:1px solid currentColor;border-radius:999px;padding:4px 14px;color:inherit;font:inherit;cursor:pointer"; a.onclick = function () { try { ev.prompt(); } catch (e) {} ev = null; a.remove(); }; h.appendChild(a); }
    addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); ev = e; mk(); }); })();
  if (still || D.motion === "off" || R.classList.contains("lite")) return;
  var b = document.body, E = function (t, c) { var e = document.createElement(t); if (c) e.className = c; return e; };

  /* scroll progress + parallax var (one rAF) */
  var sp = E("div"); sp.id = "sp"; sp.setAttribute("aria-hidden", "true"); b.appendChild(sp);
  var tick = 0, SMALL = false; try { SMALL = matchMedia("(max-width:900px),(pointer:coarse)").matches; } catch (e) {}
  function onScroll() {
    if (tick) return; tick = requestAnimationFrame(function () {
      tick = 0; var h = R.scrollHeight - innerHeight, y = scrollY;
      var pv = h > 0 ? Math.min(1, y / h).toFixed(4) : 0; sp.style.setProperty("--sp", pv); var tt = document.querySelector(".totop"); if (tt) tt.style.setProperty("--sp", pv);
      var st = document.getElementById("story"); if (st) { var sr = st.getBoundingClientRect(), pp = Math.max(0, Math.min(1, -sr.top / Math.max(1, sr.height - innerHeight))); st.style.setProperty("--p", pp.toFixed(3)); var ix = Math.min(2, Math.floor(pp * 3)); $$(".sty-p", st).forEach(function (e, k) { e.classList.toggle("on", k === ix); e.classList.toggle("past", k < ix); }); $$(".sty-d i", st).forEach(function (e, k) { e.classList.toggle("on", k <= ix); }); }
      var cc = document.getElementById("cc"); if (cc) cc.style.setProperty("--hs", Math.min(1, y / (innerHeight * .9)).toFixed(3));
      var cards = $$(".stk-c"); cards.forEach(function (c, i) { var nx = cards[i + 1]; if (!nx) return; var r = nx.getBoundingClientRect(), t = Math.max(0, Math.min(1, 1 - (r.top - 90) / (innerHeight * .6))); c.style.setProperty("--sc", (1 - t * .07).toFixed(3)); c.style.setProperty("--br", (1 - t * .35).toFixed(2)); });
      if (!SMALL) $$(".bigt").forEach(function (d) { var r = d.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; d.style.setProperty("--bt", ((r.top - innerHeight / 2) * (d.dataset.rev ? -.6 : .6)).toFixed(1)); });
      if (!SMALL) $$(".dec").forEach(function (d) {
        var r = d.parentNode.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) return;
        d.style.setProperty("--py", ((r.top + r.height / 2 - innerHeight / 2) / innerHeight).toFixed(3));
      });
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);

  /* aurora background */
  var au = E("div", "aur"); au.setAttribute("aria-hidden", "true"); au.innerHTML = "<i></i><i></i><i></i>"; b.insertBefore(au, b.firstChild);

  /* button ripple */
  document.addEventListener("pointerdown", function (e) {
    var t = e.target.closest && e.target.closest(".btn"); if (!t || t.disabled) return;
    var r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) / 2, d = E("span", "rpl");
    d.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
    t.appendChild(d); setTimeout(function () { d.remove(); }, 650);
  });

  /* floating decor shapes in sections */
  var SH = [
    '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="22" stroke-dasharray="6 8"/></svg>',
    '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M34 26L10 50l24 24M66 26l24 24-24 24M56 20L44 80"/></svg>',
    '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><rect x="14" y="22" width="72" height="56" rx="8"/><path d="M14 36h72M14 64h72M30 22v56M70 22v56"/></svg>',
    '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M30 20l52 30-52 30z"/></svg>',
    '<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 8l7 35 35 7-35 7-7 35-7-35-35-7 35-7z"/></svg>',
    '<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="20" cy="20" r="4"/><circle cx="50" cy="20" r="4"/><circle cx="80" cy="20" r="4"/><circle cx="20" cy="50" r="4"/><circle cx="50" cy="50" r="4"/><circle cx="80" cy="50" r="4"/><circle cx="20" cy="80" r="4"/><circle cx="50" cy="80" r="4"/><circle cx="80" cy="80" r="4"/></svg>'
  ];
  function decor() {
    $$(".sec, main.page").forEach(function (s, i) {
      if (s.querySelector(":scope>.dec") || s.id === "cc" || s.offsetHeight < 260) return;
      var d = E("div", "dec"), a = E("div"), c = E("div"), n = (i * 2) % SH.length, side = i % 2 ? "inset-inline-end" : "inset-inline-start";
      a.style.cssText = "width:" + (90 + (i % 3) * 30) + "px;height:" + (90 + (i % 3) * 30) + "px;top:" + (6 + (i % 4) * 8) + "%;" + side + ":" + (1 + (i % 3) * 3) + "%;--k:" + (26 + i * 6) + "px";
      c.style.cssText = "width:70px;height:70px;bottom:" + (6 + (i % 3) * 7) + "%;" + (i % 2 ? "inset-inline-start" : "inset-inline-end") + ":" + (3 + (i % 4) * 4) + "%;--k:-" + (34 + i * 4) + "px";
      var pt = E("div", "pat p" + (i % 4)); d.appendChild(pt); a.innerHTML = SH[n]; c.innerHTML = SH[(n + 3) % SH.length]; d.appendChild(a); d.appendChild(c); s.insertBefore(d, s.firstChild);
    });
    onScroll();
  }

  /* heading word reveal */
  var wio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("w-in"); wio.unobserve(e.target); } }); }, { threshold: .4 }) : null;
  function words() {
    if (!wio) return;
    $$(".sec h2, main.page h1").forEach(function (h) {
      if (h.dataset.w || h.children.length || !h.textContent.trim()) return; h.dataset.w = "1";
      var t = h.textContent.trim().split(/\s+/); h.setAttribute("aria-label", h.textContent.trim()); h.textContent = "";
      t.forEach(function (w, i) { var s = E("span", "wsp"); s.setAttribute("aria-hidden", "true"); s.style.setProperty("--i", i); s.textContent = w; h.appendChild(s); if (i < t.length - 1) h.appendChild(document.createTextNode(" ")); });
      wio.observe(h);
    });
  }

  /* ribbons + giant scroll text (home only) */
  function bands() {
    if (PAGE !== "home") return;
    var m = document.querySelector("main"), fa = R.lang === "fa", key = fa ? "fa" : "en";
    if (!m || (document.getElementById("rib1") && document.getElementById("rib1").dataset.k === key)) return;
    ["rib1", "rib2", "bigt1"].forEach(function (id) { var o = document.getElementById(id); if (o) o.remove(); });
    var W = fa ? ["فیلم", "تدوین", "گرافیک", "کد", "آکادمی", "گواهی", "ریلز", "برند"] : ["FILM", "EDIT", "DESIGN", "CODE", "ACADEMY", "CERTIFY", "REELS", "BRAND"];
    var row = function (arr) { var h = ""; for (var k = 0; k < 4; k++) arr.forEach(function (w) { h += "<span>" + w + "</span><i>✦</i>"; }); return h; };
    var mk = function (id, cls, html, before) { var d = E("div", cls); d.id = id; d.dataset.k = key; d.setAttribute("aria-hidden", "true"); d.innerHTML = html; var ref = document.getElementById(before); if (ref && ref.parentNode === m) m.insertBefore(d, ref); return d; };
    mk("rib1", "rib", '<div class="rt">' + row(W) + '</div><div class="rt" aria-hidden="true">' + row(W) + "</div>", "what");
    mk("rib2", "rib rb2", '<div class="rt rv">' + row(W.slice().reverse()) + '</div><div class="rt rv">' + row(W.slice().reverse()) + "</div>", "courses");
    var bt = mk("bigt1", "bigt", "<span>CINECODE · CINECODE · CINECODE</span>", "work"); if (bt) bt.dataset.rev = "";
    onScroll();
  }

  /* header state, footer wave + giant brand, hero chips */
  var hsT = 0; addEventListener("scroll", function () { if (hsT) return; hsT = requestAnimationFrame(function () { hsT = 0; R.classList.toggle("hs", scrollY > 40); }); }, { passive: true });
  function chrome3() {
    var f = document.getElementById("site-footer");
    if (f && !document.getElementById("ftWave")) {
      var w = E("div"); w.id = "ftWave"; w.className = "ft-wave"; w.setAttribute("aria-hidden", "true");
      w.innerHTML = '<svg viewBox="0 0 2400 90" preserveAspectRatio="none"><path d="M0 45 Q150 0 300 45 T600 45 T900 45 T1200 45 T1500 45 T1800 45 T2100 45 T2400 45 V90 H0Z" fill="currentColor"/></svg>';
      f.parentNode.insertBefore(w, f);
      var bg = E("div", "ft-big"); bg.setAttribute("aria-hidden", "true"); bg.textContent = "CINECODE"; f.appendChild(bg);
    }
    var v = document.querySelector("#cc .cc-vis");
    if (v && !v.querySelector(".hchip3")) {
      [["Premiere", "c1"], ["</>", "c2"], ["Photoshop", "c3"]].forEach(function (c) { var d = E("span", "hchip3 " + c[1]); d.setAttribute("aria-hidden", "true"); d.textContent = c[0]; v.appendChild(d); });
    }
  }

  /* terminal + clapperboard section, live Kabul clock */
  var CODE = [[["const ", "k"], ["me", "v"], [" = {", "p"]], [["  city: ", "p"], ["\"Kabul\"", "s"], [",", "p"]], [["  film: ", "p"], ["[\"shoot\", \"edit\", \"color\"]", "s"], [",", "p"]], [["  design: ", "p"], ["[\"brand\", \"poster\", \"UI\"]", "s"], [",", "p"]], [["  code: ", "p"], ["[\"Java\", \"JS\", \"Python\"]", "s"], [",", "p"]], [["  academy: ", "p"], ["\"free + certified\"", "s"], [",", "p"]], [["};", "p"]], [["me", "v"], [".build();  ", "p"], ["// \u25B6 CineCode", "c"]]];
  function term() {
    var m = document.querySelector("main"), fa = R.lang === "fa", key = fa ? "fa" : "en", o = document.getElementById("term");
    if (PAGE !== "home" || !m || (o && o.dataset.k === key)) return; if (o) o.remove();
    var ref = document.getElementById("doors") || document.getElementById("cc"); if (!ref || ref.parentNode !== m) return;
    var sec = E("section", "sec term"); sec.id = "term"; sec.dataset.k = key; sec.setAttribute("aria-label", fa ? "کد و سینما" : "Code and cinema");
    var h = fa ? ["کد می‌نویسم، فیلم می‌سازم", "هر پروژه از یک ایده شروع می‌شود؛ بعد تصویر، صدا و کد به هم می‌رسند."] : ["I write code. I make films.", "Every project starts with an idea; then picture, sound and code meet."];
    sec.innerHTML = '<h2>' + h[0] + '</h2><p class="tm-sub">' + h[1] + '</p><div class="tm-g"><div class="tm-w" dir="ltr"><div class="tm-b"><i></i><i></i><i></i><span>cinecode.js</span></div><pre class="tm-c" aria-label="code sample"></pre></div>' +
      '<div class="tm-cl" aria-hidden="true"><svg viewBox="0 0 220 190" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><g class="clap"><path d="M14 52L196 26l8 34L22 86z" fill="var(--accent)" stroke="none"/><path d="M52 46l14 24M96 40l14 24M140 34l14 24" stroke="#fff" stroke-width="9"/></g><rect x="14" y="78" width="192" height="100" rx="8" fill="var(--surface)"/><path d="M14 112h192M14 146h192M70 78v100"/><text x="22" y="104" font-size="15" fill="currentColor" stroke="none" font-weight="800">SCENE</text><text x="22" y="138" font-size="15" fill="currentColor" stroke="none" font-weight="800">TAKE</text><text x="86" y="104" font-size="18" fill="var(--accent)" stroke="none" font-weight="900">01</text><text x="86" y="138" font-size="18" fill="var(--hot)" stroke="none" font-weight="900">01</text></svg><b class="tm-live"><i></i><span id="tmClock"></span></b></div></div>';
    m.insertBefore(sec, ref.nextSibling);
    var pre = sec.querySelector(".tm-c"), spans = [];
    CODE.forEach(function (ln) { ln.forEach(function (sg) { var sp = E("span", "t-" + sg[1]); sp.dataset.t = sg[0]; pre.appendChild(sp); spans.push(sp); }); pre.appendChild(document.createTextNode("\n")); });
    var caret = E("span", "tm-car"); pre.appendChild(caret);
    var started = false, run = function () { if (started) return; started = true; var si = 0, ci = 0; (function step() { if (si >= spans.length) return; var sp = spans[si], t = sp.dataset.t; ci += 2; sp.textContent = t.slice(0, ci); if (ci >= t.length) { si++; ci = 0; } setTimeout(step, 22); })(); };
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: .3 }); io.observe(sec); } else run();
  }
  function clock() {
    var el = document.getElementById("tmClock"); if (!el) return;
    try { var f = new Intl.DateTimeFormat(R.lang === "fa" ? "fa-AF" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kabul" }); el.textContent = (R.lang === "fa" ? "کابل · " : "Kabul · ") + f.format(new Date()); } catch (e) {}
  }
  setInterval(clock, 20000);

  /* film edge + morphing blob */
  function extras3() {
    if (!document.getElementById("filmEdge") && innerWidth > 1100) { var f = E("div"); f.id = "filmEdge"; f.className = "film-edge"; f.setAttribute("aria-hidden", "true"); b.appendChild(f); }
    var v = document.querySelector("#cc .cc-vis");
    if (v && !v.querySelector(".blobm")) { var bl = E("i", "blobm"); bl.setAttribute("aria-hidden", "true"); v.insertBefore(bl, v.firstChild); }
  }

  /* sticky stacking showcase (one card per graphic category) */
  function stack() {
    var m = document.querySelector("main"), fa = R.lang === "fa", key = fa ? "fa" : "en", o = document.getElementById("stk");
    if (PAGE !== "home" || !m || (o && o.dataset.k === key)) return; if (o) o.remove();
    var ref = document.getElementById("work"); if (!ref || ref.parentNode !== m) return;
    var gal = (S.gallery || []).filter(function (g) { return g && /^[\w-]+$/.test(g.id || "") && !g.hidden; }); if (gal.length < 4) return;
    var CAT = fa ? { poster: ["پوستر", "پوستر و تبلیغ"], academy: ["آموزشی", "طرح‌های آموزشی و آکادمی"], banner: ["بنر", "بنر شبکه‌های اجتماعی"], brand: ["برند", "هویت بصری و لوگو"], print: ["چاپی", "مواد چاپی"] } : { poster: ["Poster", "Posters and promos"], academy: ["Academy", "Educational and academy design"], banner: ["Banner", "Social media banners"], brand: ["Brand", "Brand identity and logos"], print: ["Print", "Print materials"] };
    var pick = [], seen = {}; gal.forEach(function (g) { if (CAT[g.cat] && !seen[g.cat] && pick.length < 4) { seen[g.cat] = 1; pick.push(g); } }); if (pick.length < 3) return;
    var cnt = function (c) { return gal.filter(function (g) { return g.cat === c; }).length; }, nf = function (n) { try { return new Intl.NumberFormat(fa ? "fa-AF" : "en").format(n); } catch (e) { return n; } };
    var sec = E("section", "sec stk"); sec.id = "stk"; sec.dataset.k = key; sec.setAttribute("aria-label", fa ? "دسته‌های طراحی" : "Design categories");
    var h = E("h2"); h.textContent = fa ? "دنیای طراحی گرافیک" : "The world of graphic design"; sec.appendChild(h);
    var ST = ["#0B4F8A", "#0B6DB8", "#0B6DB8", "#C2570C"];
    pick.forEach(function (g, i) {
      var c = E("a", "stk-c"); c.href = "graphics.html"; c.style.setProperty("--i", i); c.style.setProperty("--bg", ST[i % 4]);
      c.innerHTML = '<span class="stk-n">0' + (i + 1) + '</span><span class="stk-t"><b>' + CAT[g.cat][0] + '</b><em>' + CAT[g.cat][1] + '</em><u>' + nf(cnt(g.cat)) + (fa ? " طرح" : " designs") + ' \u2192</u></span><span class="stk-i"><img src="assets/work/' + g.id + '.webp" alt="" loading="lazy" width="520" height="520"></span>';
      sec.appendChild(c);
    });
    m.insertBefore(sec, ref.nextSibling); onScroll();
  }
  var cio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("cr-in"); cio.unobserve(e.target); } }); }, { threshold: .15 }) : null;
  function clips() { if (!cio) return; $$(".wm-c:not(.cr)").forEach(function (c) { var r = c.getBoundingClientRect(); if (r.top < innerHeight) return; c.classList.add("cr"); cio.observe(c); }); }

  /* pinned scroll story (oversized type, scroll-driven) */
  function story() {
    var m = document.querySelector("main"), fa = R.lang === "fa", key = fa ? "fa" : "en", o = document.getElementById("story");
    if (PAGE !== "home" || !m || (o && o.dataset.k === key)) return; if (o) o.remove();
    var ref = document.getElementById("stk") || document.getElementById("term") || document.getElementById("doors"); if (!ref || ref.parentNode !== m) return;
    var P = fa ? [["فیلم", "از ایده تا تدوین و رنگ؛ هر قاب یک قصه.", ["فیلم‌برداری", "تدوین", "رنگ"], "#0B4F8A"], ["گرافیک", "پوستر، برند و بنر با هویت بصری یکدست.", ["پوستر", "لوگو", "چاپ"], "#0B6DB8"], ["کد", "برنامه‌نویسی و سایت‌های سبک و سریع.", ["Java", "JS", "Python"], "#0B6DB8"]] : [["FILM", "From idea to edit and color; every frame tells a story.", ["Shooting", "Editing", "Color"], "#0B4F8A"], ["DESIGN", "Posters, brands and banners with one visual identity.", ["Poster", "Logo", "Print"], "#0B6DB8"], ["CODE", "Programming and light, fast websites.", ["Java", "JS", "Python"], "#0B6DB8"]];
    var sec = E("section", "story"); sec.id = "story"; sec.dataset.k = key; sec.setAttribute("aria-label", fa ? "سه مهارت" : "Three crafts");
    var h = ""; P.forEach(function (x, i) { h += '<div class="sty-p' + (i === 0 ? " on" : "") + '" style="--pc:' + x[3] + '"><span class="sty-n">0' + (i + 1) + '</span><b class="sty-w">' + x[0] + '</b><p>' + x[1] + '</p><ul>' + x[2].map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>"; });
    sec.innerHTML = '<div class="sty-s"><div class="sty-bg"></div>' + h + '<div class="sty-d" aria-hidden="true"><i class="on"></i><i></i><i></i></div></div>';
    m.insertBefore(sec, ref.nextSibling); onScroll();
  }

  /* pro footer: icons on every link, glass columns; academy hero chips */
  var FI = { academy: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"/>', courses: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5"/>', library: '<path d="M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.4 13.2-3-.8z"/>', blog: '<path d="M5 3h14v18H5zM9 8h6M9 12h6M9 16h4"/>', verify: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5"/>', auth: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>', about: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>', cv: '<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6"/>', works: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>', graphics: '<path d="M12 3l2.5 6L21 10l-5 4 1.5 7L12 17.5 6.5 21 8 14 3 10l6.5-1z"/>', certificates: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>', reels: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 9.5l3 2-3 2z"/>', presskit: '<path d="M4 7h16v13H4zM9 7V4h6v3M4 13h16"/>', privacy: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>', sitemap: '<rect x="9" y="3" width="6" height="5"/><rect x="2" y="16" width="6" height="5"/><rect x="16" y="16" width="6" height="5"/><path d="M12 8v4M5 16v-4h14v4"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', tel: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>', chat: '<path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z"/>', send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>', home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>' };
  function fIcon(h) { h = h || ""; if (h.indexOf("mailto:") === 0) return FI.mail; if (h.indexOf("tel:") === 0) return FI.tel; if (h.indexOf("wa.me") > -1) return FI.chat; if (h.indexOf("t.me") > -1) return FI.send; if (h.indexOf("#contact") > -1) return FI.mail; if (h.indexOf("#courses") > -1) return FI.courses; var k = h.replace(/\.(html|xml)$/, ""); return FI[k] || null; }
  function footerPro() {
    var f = document.getElementById("site-footer"); if (!f) return;
    $$(".ft-c", f).forEach(function (c) {
      c.classList.add("ft-glass");
      $$("a", c).forEach(function (a) {
        if (a.querySelector(".fi,svg") || a.classList.contains("ft-ch") || /^(mailto|tel):/.test(a.getAttribute("href") || "")) return;
        var d = fIcon(a.getAttribute("href")); if (!d) return;
        var i = E("span", "fi"); i.setAttribute("aria-hidden", "true"); i.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>"; a.insertBefore(i, a.firstChild); a.classList.add("fl");
      });
    });
    var ah = document.querySelector(".ac-hero");
    if (ah && !ah.querySelector(".hchip3")) { var fa = R.lang === "fa"; (fa ? ["رایگان", "آزمون", "گواهی QR"] : ["Free", "Quizzes", "QR certificate"]).forEach(function (t, k) { var d = E("span", "hchip3 a" + (k + 1)); d.setAttribute("aria-hidden", "true"); d.textContent = t; ah.appendChild(d); }); ah.classList.add("ac-live"); }
  }

  /* course card covers: topic icon on an animated gradient */
  var CV = { film: ['<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>', "#0B4F8A,#39A9E8"], design: ['<path d="M12 3l2.5 6L21 10l-5 4 1.5 7L12 17.5 6.5 21 8 14 3 10l6.5-1z"/>', "#0B6DB8,#FF8F6B"], code: ['<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>', "#0B6DB8,#62C4FF"], book: ['<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5"/>', "#0D2347,#0B4F8A"] };
  function covers() {
    $$(".ac-card:not(.cvd)").forEach(function (c, i) {
      var h = c.querySelector("h3"); if (!h) return; c.classList.add("cvd");
      var t = (h.textContent || "").toLowerCase(), k = /ویدیو|تدوین|فیلم|video|edit|film/.test(t) ? "film" : /گرافیک|طراحی|design|graphic/.test(t) ? "design" : /برنامه|پایتون|کد|python|code|java|web/.test(t) ? "code" : "book";
      var g = CV[k][1].split(","), d = E("div", "ac-cov"); d.setAttribute("aria-hidden", "true"); d.style.cssText = "--c1:" + g[0] + ";--c2:" + g[1];
      d.innerHTML = '<i></i><i></i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + CV[k][0] + "</svg><b>0" + (i + 1) + "</b>";
      c.insertBefore(d, c.firstChild);
    });
  }

  /* cinematic reference direction: universe section, numbered eyebrows, hide old doors */
  function universe() {
    var m = document.querySelector("main"), fa = R.lang === "fa", key = fa ? "fa" : "en", o = document.getElementById("uni");
    if (PAGE !== "home" || !m || (o && o.dataset.k === key)) return; if (o) o.remove();
    var ref = document.getElementById("cc"); if (!ref || ref.parentNode !== m) return;
    var D = fa ? [["فناوری", "TECH", "علوم کامپیوتر، برنامه‌نویسی، هوش مصنوعی و توسعهٔ وب.", "academy.html#courses", "#7CCBF3", '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>'], ["فیلم", "FILM", "سینما، فیلم‌سازی، فیلم‌برداری، تدوین، فیلم‌نامه و مستند.", "works.html", "#39A9E8", '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>'], ["طراحی", "DESIGN", "طراحی گرافیک، برندینگ، هنرهای تصویری و موشن گرافیک.", "graphics.html", "#D8E1EA", '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="16" cy="10" r="1.3"/><path d="M12 21c-1.5 0-2-1-2-2s1-2 2-2 3 0 3-2"/>']] : [["TECH", "TECH", "Computer Science, Programming, Artificial Intelligence, Web Development.", "academy.html#courses", "#7CCBF3", '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>'], ["FILM", "FILM", "Cinema, Filmmaking, Cinematography, Editing, Screenwriting, Documentary.", "works.html", "#39A9E8", '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>'], ["DESIGN", "DESIGN", "Graphic Design, Branding, Visual Arts, Motion Graphics, Digital Creativity.", "graphics.html", "#D8E1EA", '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="16" cy="10" r="1.3"/><path d="M12 21c-1.5 0-2-1-2-2s1-2 2-2 3 0 3-2"/>']];
    var sec = E("section", "sec uni"); sec.id = "uni"; sec.dataset.k = key; sec.setAttribute("aria-label", fa ? "جهان خلاقانه" : "Creative universe");
    var h = fa ? ["سه جهان. یک دیدگاه.", "فناوری، سینما و طراحی؛ در کنار هم برای آیندهٔ خلاق."] : ["Three Worlds. One Vision.", "Technology, cinema and design, combined for a creative future."];
    var c = ""; D.forEach(function (d) { c += '<a class="uni-c" href="' + d[3] + '" style="--c:' + d[4] + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + d[5] + '</svg><b>' + d[0] + '</b><em>' + d[2] + '</em><span class="uni-a">\u2192</span></a>'; });
    sec.innerHTML = '<h2>' + h[0] + '</h2><p class="tm-sub">' + h[1] + '</p><div class="uni-g">' + c + "</div>";
    m.insertBefore(sec, ref.nextSibling);
  }
  var EY = { uni: ["OUR CREATIVE UNIVERSE", "جهان خلاقانهٔ ما"], term: ["CODE & CINEMA", "کد و سینما"], work: ["SELECTED WORKS", "نمونه‌کارهای برگزیده"], stk: ["GRAPHIC DESIGN", "طراحی گرافیک"], courses: ["THE ACADEMY", "آکادمی"], process: ["OUR PROCESS", "مسیر ما"], about: ["FOUNDER", "بنیان‌گذار"], contact: ["CONTACT", "تماس"] };
  function eyebrows() {
    var fa = R.lang === "fa", n = 1; $$("main > section[id]").forEach(function (s) {
      var d = EY[s.id]; if (!d) return; n++; var o = s.querySelector(".eyb"), t = (n < 10 ? "0" : "") + n + " / " + d[fa ? 1 : 0];
      if (o) { if (o.textContent !== t) o.textContent = t; return; }
      var h = s.querySelector("h2"); if (!h) return; var e = E("span", "eyb"); e.textContent = t; e.setAttribute("aria-hidden", "true"); h.parentNode.insertBefore(e, h);
    });
  }
  function all() { try { covers(); } catch (e) {} try { footerPro(); } catch (e) {} try { stack(); } catch (e) {} try { story(); } catch (e) {} try { clips(); } catch (e) {} extras3(); term(); clock(); decor(); words(); bands(); chrome3(); }
  setTimeout(all, 1400); setTimeout(all, 3500);
  var mo, mt; try { mo = new MutationObserver(function () { clearTimeout(mt); mt = setTimeout(all, 700); }); mo.observe(document.querySelector("main") || b, { childList: true, subtree: true }); } catch (e) {}
})();
