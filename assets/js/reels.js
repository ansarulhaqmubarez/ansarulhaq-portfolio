/* Reels: vertical short videos (YouTube Shorts IDs) managed in admin (design.reels). Players load only when a card scrolls into view. */
(function () {
  "use strict";
  if (document.body.dataset.page !== "reels") return;
  var root = document.getElementById("reelbox"); if (!root) return;
  var S = window.SITE || {}, lang = "fa";
  try { lang = localStorage.getItem("am-lang") === "en" ? "en" : "fa"; } catch (e) {}
  var fa = lang === "fa";
  var mk = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  var tx = function (o) { return o && typeof o === "object" ? (o[lang] || o.en || o.fa || "") : String(o || ""); };
  var LAST = [];
  function render(list) {
    lang = document.documentElement.lang === "en" ? "en" : "fa"; fa = lang === "fa"; LAST = list;
    root.innerHTML = "";
    var nav = mk("nav", "crumb"); nav.setAttribute("aria-label", "Breadcrumb"); var a0 = mk("a", "", fa ? "خانه" : "Home"); a0.href = "index.html"; nav.appendChild(a0); nav.appendChild(document.createTextNode(" / ")); nav.appendChild(mk("span", "", "Reels")); root.appendChild(nav);
    root.appendChild(mk("h1", "ph1", fa ? "ریلز: ویدیوهای کوتاه" : "Reels: short videos"));
    (function () {
      var sec = mk("section", "rl-bio"); sec.appendChild(mk("h2", "", fa ? "موشن بیوگرافی" : "Motion biography")); sec.appendChild(mk("p", "muted", fa ? "ویدیوی معرفی انصارالحق مبارز، با روایت صوتی و زیرنویس. زبان را انتخاب کن." : "A short introduction to Ansarulhaq Mubarez with narration and captions. Pick a language."));
      var g2 = mk("div", "rl-bg");
      [["fa", "فارسی", "assets/video/bio.mp4", "assets/video/bio-fa.vtt", "assets/video/bio-poster.jpg"], ["en", "English", "assets/video/bio-en.mp4", "assets/video/bio-en.vtt", "assets/video/bio-poster-en.jpg"]].forEach(function (v) {
        var c = mk("figure", "rl-bc"), vd = mk("video"); vd.controls = true; vd.preload = "none"; vd.playsInline = true; vd.poster = v[4]; vd.src = v[2]; vd.setAttribute("aria-label", (fa ? "موشن بیوگرافی " : "Motion biography ") + v[1]);
        var tr = mk("track"); tr.kind = "captions"; tr.srclang = v[0]; tr.label = v[1]; tr.src = v[3]; if (v[0] === lang) tr.default = true; vd.appendChild(tr); c.appendChild(vd); c.appendChild(mk("figcaption", "", v[1])); g2.appendChild(c); });
      sec.appendChild(g2); root.appendChild(sec); })();
    var items = (Array.isArray(list) ? list : []).filter(function (r) { return r && /^[\w-]{11}$/.test(r.id || "") && !r.hide; });
    if (!items.length) { root.appendChild(mk("p", "muted", fa ? "ریلزهای یوتیوب هنوز اضافه نشده‌اند." : "YouTube reels have not been added yet.")); return; }
    root.appendChild(mk("p", "muted", (fa ? "هر ویدیو را بزن تا پخش شود. " : "Tap a video to play it. ") + items.length + (fa ? " ویدیو" : " videos")));
    var g = mk("div", "rl-g"); root.appendChild(g);
    items.slice(0, 60).forEach(function (r, i) {
      var c = mk("article", "rl-c"), t = tx(r.t) || (fa ? "ویدیو " : "Video ") + (i + 1);
      var fr = mk("div", "rl-f"); fr.dataset.id = r.id; fr.setAttribute("aria-label", t);
      var b = mk("button", "rl-p"); b.type = "button"; b.setAttribute("aria-label", (fa ? "پخش: " : "Play: ") + t);
      var im = mk("img"); im.alt = ""; im.loading = "lazy"; im.width = 270; im.height = 480; im.src = "assets/img/me-sq.webp"; b.appendChild(im); b.appendChild(mk("span", "rl-i", "▶"));
      b.onclick = function () { var f = document.createElement("iframe"); f.src = "https://www.youtube-nocookie.com/embed/" + r.id + "?autoplay=1&rel=0&playsinline=1&modestbranding=1"; f.title = t; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; f.referrerPolicy = "strict-origin-when-cross-origin"; fr.innerHTML = ""; fr.appendChild(f); };
      fr.appendChild(b); c.appendChild(fr); c.appendChild(mk("h2", "rl-t", t)); g.appendChild(c);
    });
  }
  var cached = null; try { cached = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).reels; } catch (e) {}
  if (Array.isArray(cached)) render(cached); else render([]);
  new MutationObserver(function () { var l = document.documentElement.lang === "en" ? "en" : "fa"; if (l !== lang) render(LAST); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  var SB = window.__SB;
  if (SB && S.supabaseUrl) SB.rest("site_settings?select=value&key=eq.design.reels").then(function (r) { var v = r && r[0] && r[0].value; if (Array.isArray(v)) render(v); }).catch(function () {});
})();
