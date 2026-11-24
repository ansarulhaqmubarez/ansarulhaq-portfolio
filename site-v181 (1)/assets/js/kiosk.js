/* kiosk.js: full-screen exhibition loop. Real content only: the motion biography video, the gallery from window.SITE and a QR code of the digital card.
   Keys: Space pause, Left/Right previous/next, F full screen, M sound. ?lang=en for English, ?s=6 seconds per work (3 to 20). */
(function () {
  "use strict";
  var S = window.SITE || {}, Q = new URLSearchParams(location.search), LG = Q.get("lang") === "en" ? "en" : "fa";
  var SEC = Math.max(3, Math.min(20, +Q.get("s") || 5));
  document.documentElement.lang = LG; document.documentElement.dir = LG === "fa" ? "rtl" : "ltr";
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var T = LG === "fa" ? { go: "شروع نمایش", hint: "برای صدا و تمام‌صفحه کلیک کن", roles: "فیلم‌ساز · برنامه‌نویس · طراح گرافیک", ac: "آکادمی رایگان با گواهی قابل تأیید با QR", scan: "اسکن کن و کارت من را باز کن", pause: "توقف", play: "پخش", snd: "صدا", fs: "تمام‌صفحه", works: "نمونه‌کار" }
    : { go: "Start show", hint: "Click for sound and full screen", roles: "Filmmaker · Programmer · Graphic designer", ac: "Free academy with certificates verified by QR", scan: "Scan to open my card", pause: "Pause", play: "Play", snd: "Sound", fs: "Full screen", works: "Work" };
  var host = document.getElementById("k"), slides = [], cur = -1, timer = 0, paused = false, vid = null, started = false, bar;
  var nm = (S.name && (S.name[LG] || S.name.fa || S.name.en)) || "Ansarulhaq Mubarez";
  // 1 title
  var a = el("section", "ks"), tt = el("div", "k-title"), lg = el("img"); lg.src = "assets/img/logo-full-light.png"; lg.alt = "CineCode"; tt.appendChild(lg); tt.appendChild(el("h1", "", nm)); tt.appendChild(el("p", "", T.roles)); tt.appendChild(el("small", "", "CINECODE ACADEMY · KABUL")); a.appendChild(tt); slides.push({ e: a, d: 6 });
  // 2 video
  var vs = el("section", "ks"); vid = el("video"); vid.muted = true; vid.playsInline = true; vid.preload = "auto"; vid.src = LG === "en" ? "assets/video/bio-en.mp4" : "assets/video/bio.mp4"; vid.setAttribute("aria-label", "Motion biography");
  var tr = el("track"); tr.kind = "captions"; tr.srclang = LG; tr.label = LG === "en" ? "English" : "فارسی"; tr.src = LG === "en" ? "assets/video/bio-en.vtt" : "assets/video/bio-fa.vtt"; tr.default = true; vid.appendChild(tr); vs.appendChild(vid); slides.push({ e: vs, video: true });
  // 3 works
  var gal = (S.gallery || []).filter(function (g) { return g && /^[\w-]+$/.test(g.id || "") && !g.hidden; }), step = Math.max(1, Math.floor(gal.length / 18));
  gal.filter(function (g, i) { return i % step === 0; }).slice(0, 18).forEach(function (g, i, arr) {
    var s = el("section", "ks"), w = el("div", "k-g"), bg = el("div", "bg"); bg.style.backgroundImage = "url(assets/work/" + g.id + ".webp)"; var fr = el("div", "fr"), im = el("img"); im.src = "assets/work/" + g.id + ".webp"; im.alt = ""; fr.appendChild(im); w.appendChild(bg); w.appendChild(fr); w.appendChild(el("div", "k-n", T.works + " " + (i + 1) + " / " + arr.length)); s.appendChild(w); slides.push({ e: s, d: SEC });
  });
  // 4 QR
  var qs = el("section", "ks"), qd = el("div", "k-q"); qd.appendChild(el("h2", "", T.ac));
  var url = location.origin + location.pathname.replace(/kiosk\.html$/, "") + "card.html";
  try { var qr = qrcode(0, "M"); qr.addData(url); qr.make(); var h = el("div"); h.innerHTML = qr.createSvgTag(8, 2, "", ""); var sv = h.querySelector("svg"); if (sv) { sv.removeAttribute("width"); sv.removeAttribute("height"); sv.setAttribute("role", "img"); sv.setAttribute("aria-label", "QR code"); qd.appendChild(sv); } } catch (e) {}
  var cp = el("p", "", T.scan); if (S.contactEmail) { cp.appendChild(el("b", "", S.contactEmail)); } qd.appendChild(cp); qs.appendChild(qd); slides.push({ e: qs, d: 9 });
  slides.forEach(function (s) { host.appendChild(s.e); });
  bar = el("div", "k-bar"); bar.appendChild(el("i")); host.appendChild(bar);
  var hud = el("div", "k-hud"); host.appendChild(hud);
  function btn(txt, fn) { var b = el("button", "", txt); b.type = "button"; b.onclick = function (e) { e.stopPropagation(); fn(); }; hud.appendChild(b); return b; }
  var pb = btn(T.pause, function () { toggle(); });
  btn("◀", function () { go(cur - 1); }); btn("▶", function () { go(cur + 1); });
  btn(T.snd, function () { vid.muted = !vid.muted; }); btn(T.fs, function () { fs(); });
  function fs() { var d = document, r = d.documentElement; try { if (d.fullscreenElement) d.exitFullscreen(); else if (r.requestFullscreen) r.requestFullscreen(); } catch (e) {} }
  function clear() { clearTimeout(timer); var i = bar.firstChild; i.style.transition = "none"; i.style.width = "0"; }
  function go(n) {
    clear(); n = (n + slides.length) % slides.length; if (cur >= 0) { slides[cur].e.classList.remove("on"); if (slides[cur].video) { vid.pause(); } } cur = n; var s = slides[n]; s.e.classList.add("on");
    if (s.video) { vid.currentTime = 0; vid.onended = function () { if (!paused) go(cur + 1); }; if (!paused) vid.play().catch(function () { timer = setTimeout(function () { go(cur + 1); }, 4000); }); var i = bar.firstChild; i.style.width = "0"; }
    else if (!paused) { var i2 = bar.firstChild; void i2.offsetWidth; i2.style.transition = "width " + s.d + "s linear"; i2.style.width = "100%"; timer = setTimeout(function () { go(cur + 1); }, s.d * 1000); }
  }
  function toggle() { paused = !paused; pb.textContent = paused ? T.play : T.pause; if (paused) { clear(); if (vid) vid.pause(); } else go(cur); }
  var st = el("div", "k-start"), sb = el("div"); var b0 = el("button", "", T.go); b0.type = "button"; sb.appendChild(b0); sb.appendChild(el("p", "", T.hint)); st.appendChild(sb); host.appendChild(st);
  st.onclick = function () { st.remove(); started = true; vid.muted = false; fs(); go(0); };
  var idle; function wake() { hud.classList.add("show"); document.body.classList.remove("idle"); clearTimeout(idle); idle = setTimeout(function () { hud.classList.remove("show"); if (started) document.body.classList.add("idle"); }, 2500); }
  ["mousemove", "touchstart", "click"].forEach(function (ev) { document.addEventListener(ev, wake, { passive: true }); });
  document.addEventListener("keydown", function (e) { if (!started) return; var k = e.key; if (k === " ") { e.preventDefault(); toggle(); } else if (k === "ArrowRight") go(cur + (document.dir === "rtl" ? -1 : 1)); else if (k === "ArrowLeft") go(cur + (document.dir === "rtl" ? 1 : -1)); else if (k.toLowerCase() === "f") fs(); else if (k.toLowerCase() === "m") vid.muted = !vid.muted; });
  if (Q.get("auto") === "1") { st.remove(); started = true; go(0); }
})();
