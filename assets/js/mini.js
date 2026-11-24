/* Mini video player (bottom corner, YouTube-style): play, seek, volume, speed, quality (720p/360p), captions, picture-in-picture, fullscreen. No autoplay. */
(function () {
  "use strict";
  var R = document.documentElement, pg = document.body.dataset.page || "";
  if (pg === "home" || pg === "admin" || pg === "kiosk" || document.getElementById("mpl")) return;
  var BIO = { fa: { hd: "assets/video/bio.mp4", sd: "assets/video/bio-360.mp4", vtt: "assets/video/bio-fa.vtt", poster: "assets/video/bio-poster.jpg", l: "fa" }, en: { hd: "assets/video/bio-en.mp4", sd: "assets/video/bio-en-360.mp4", vtt: "assets/video/bio-en.vtt", poster: "assets/video/bio-poster-en.jpg", l: "en" } };
  var I = {
    play: '<path d="M6 3l14 9-14 9z"/>', pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    vol: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    mute: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
    cc: '<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 15h4M15 15h2M7 11h2M13 11h4"/>', pip: '<path d="M2 10h6V4"/><path d="m2 4 6 6"/><path d="M21 10V7a2 2 0 0 0-2-2h-7"/><path d="M3 14v2a2 2 0 0 0 2 2h3"/><rect width="10" height="7" x="12" y="14" rx="1"/>',
    full: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', min: '<path d="m18 15-6-6-6 6"/>', gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
  };
  function ic(k) { return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + I[k] + '</svg>'; }
  function fa() { return R.lang !== "en"; }
  function T(a, b) { return fa() ? a : b; }
  try { if (sessionStorage.getItem("mpl-x") === "1") return; } catch (e) {}
  var css = document.createElement("link"); css.rel = "stylesheet"; css.href = "assets/css/mini.css"; document.head.appendChild(css);
  var root = document.createElement("section"); root.id = "mpl"; root.className = "mpl mpl-min";
  root.innerHTML = '<button type="button" class="mpl-pill" id="mplO"></button>' +
    '<div class="mpl-box" id="mplB" hidden><div class="mpl-top"><strong id="mplT"></strong><span><button type="button" id="mplM" class="mpl-i">' + ic("min") + '</button><button type="button" id="mplX" class="mpl-i">' + ic("x") + '</button></span></div>' +
    '<div class="mpl-vw"><video id="mplV" preload="none" playsinline></video><button type="button" class="mpl-big" id="mplBig">' + ic("play") + '</button></div>' +
    '<input type="range" id="mplS" class="mpl-sk" min="0" max="1000" value="0">' +
    '<div class="mpl-bar"><button type="button" class="mpl-i" id="mplP">' + ic("play") + '</button><button type="button" class="mpl-i" id="mplMu">' + ic("vol") + '</button><input type="range" id="mplVo" class="mpl-vo" min="0" max="100" value="100"><span class="mpl-tm" id="mplTm" dir="ltr">0:00</span><span class="mpl-sp"></span>' +
    '<button type="button" class="mpl-i" id="mplCc">' + ic("cc") + '</button><button type="button" class="mpl-i" id="mplG">' + ic("gear") + '</button><button type="button" class="mpl-i" id="mplPip">' + ic("pip") + '</button><button type="button" class="mpl-i" id="mplFs">' + ic("full") + '</button></div>' +
    '<div class="mpl-menu" id="mplMn" hidden><div><b id="mplQl"></b><button type="button" data-q="hd">720p</button><button type="button" data-q="sd">360p</button></div><div><b id="mplSl"></b><button type="button" data-s="0.75">0.75×</button><button type="button" data-s="1">1×</button><button type="button" data-s="1.25">1.25×</button><button type="button" data-s="1.5">1.5×</button><button type="button" data-s="2">2×</button></div></div></div>';
  document.body.appendChild(root);
  var $ = function (i) { return document.getElementById(i); }, v = $("mplV"), q = "hd", lang = "", cc = false;
  function mm(t) { t = Math.max(0, Math.round(t || 0)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); }
  function src(keep) {
    var l = fa() ? "fa" : "en", d = BIO[l], t = keep ? v.currentTime : 0, was = !v.paused;
    v.poster = d.poster; v.innerHTML = ""; var s = document.createElement("source"); s.src = d[q]; s.type = "video/mp4"; v.appendChild(s);
    var tr = document.createElement("track"); tr.kind = "captions"; tr.src = d.vtt; tr.srclang = d.l; tr.label = fa() ? "فارسی" : "English"; v.appendChild(tr);
    v.load(); lang = l;
    v.addEventListener("loadedmetadata", function f() { v.removeEventListener("loadedmetadata", f); if (t) v.currentTime = t; applyCc(); if (was) v.play().catch(function () {}); });
  }
  function applyCc() { [].forEach.call(v.textTracks, function (x) { x.mode = cc ? "showing" : "hidden"; }); $("mplCc").setAttribute("aria-pressed", cc); }
  function paint() {
    $("mplO").innerHTML = ic("play") + "<span>" + T("ویدیوی معرفی", "Intro video") + "</span>"; $("mplT").textContent = T("ویدیوی معرفی", "Intro video");
    var L = { mplP: T("پخش/توقف", "Play/Pause"), mplMu: T("صدا", "Mute"), mplVo: T("بلندی صدا", "Volume"), mplS: T("جابه‌جایی", "Seek"), mplCc: T("زیرنویس", "Captions"), mplG: T("تنظیمات", "Settings"), mplPip: T("تصویر در تصویر", "Picture in picture"), mplFs: T("تمام‌صفحه", "Fullscreen"), mplX: T("بستن", "Close"), mplM: T("کوچک‌کردن", "Minimise"), mplBig: T("پخش", "Play"), mplO: T("پخش ویدیوی معرفی", "Play intro video") };
    Object.keys(L).forEach(function (k) { $(k).setAttribute("aria-label", L[k]); });
    $("mplQl").textContent = T("کیفیت", "Quality"); $("mplSl").textContent = T("سرعت", "Speed");
    [].forEach.call(root.querySelectorAll("[data-q]"), function (b) { b.setAttribute("aria-pressed", b.dataset.q === q); });
    [].forEach.call(root.querySelectorAll("[data-s]"), function (b) { b.setAttribute("aria-pressed", +b.dataset.s === v.playbackRate); });
    root.setAttribute("aria-label", T("پخش‌کنندهٔ ویدیوی معرفی", "Intro video player"));
  }
  function openB(on) { root.classList.toggle("mpl-min", !on); $("mplB").hidden = !on; $("mplO").hidden = on; if (on) { if (!v.querySelector("source")) src(false); $("mplP").focus(); } else v.pause(); }
  $("mplO").onclick = function () { openB(true); };
  $("mplM").onclick = function () { openB(false); $("mplO").focus(); };
  $("mplX").onclick = function () { v.pause(); try { sessionStorage.setItem("mpl-x", "1"); } catch (e) {} root.remove(); };
  function tog() { if (v.paused) v.play().catch(function () {}); else v.pause(); }
  $("mplP").onclick = tog; $("mplBig").onclick = tog; v.onclick = tog;
  v.addEventListener("play", function () { $("mplP").innerHTML = ic("pause"); root.classList.add("mpl-pl"); });
  v.addEventListener("pause", function () { $("mplP").innerHTML = ic("play"); root.classList.remove("mpl-pl"); });
  v.addEventListener("timeupdate", function () { if (v.duration) { $("mplS").value = Math.round(v.currentTime / v.duration * 1000); $("mplTm").textContent = mm(v.currentTime) + " / " + mm(v.duration); } });
  $("mplS").oninput = function () { if (v.duration) v.currentTime = this.value / 1000 * v.duration; };
  $("mplVo").oninput = function () { v.volume = this.value / 100; v.muted = v.volume === 0; $("mplMu").innerHTML = ic(v.muted ? "mute" : "vol"); };
  $("mplMu").onclick = function () { v.muted = !v.muted; $("mplMu").innerHTML = ic(v.muted ? "mute" : "vol"); };
  $("mplCc").onclick = function () { cc = !cc; applyCc(); };
  $("mplG").onclick = function () { var m = $("mplMn"); m.hidden = !m.hidden; $("mplG").setAttribute("aria-expanded", !m.hidden); paint(); };
  root.querySelector("#mplMn").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.q) { q = b.dataset.q; src(true); } if (b.dataset.s) v.playbackRate = +b.dataset.s; paint(); });
  $("mplPip").onclick = function () { if (document.pictureInPictureEnabled && v.requestPictureInPicture) { if (document.pictureInPictureElement) document.exitPictureInPicture(); else v.requestPictureInPicture().catch(function () {}); } };
  if (!document.pictureInPictureEnabled) $("mplPip").hidden = true;
  $("mplFs").onclick = function () { var el = v.parentNode; if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen().catch(function () {}); };
  root.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!$("mplMn").hidden) { $("mplMn").hidden = true; $("mplG").focus(); } else if (!$("mplB").hidden && !document.fullscreenElement) { openB(false); $("mplO").focus(); } } });
  new MutationObserver(function () { paint(); if (lang && lang !== (fa() ? "fa" : "en")) src(true); }).observe(R, { attributes: true, attributeFilter: ["lang"] });
  paint();
})();
