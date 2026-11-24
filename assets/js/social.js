/* social.js: "my pages" hub (social.html), follow blocks on blog/home/services/works, and a share bar under every blog post.
   Real links only (window.SITE.socials, show:true). QR codes are made in the browser. Re-applies on language change. */
(function () {
  "use strict";
  var R = document.documentElement, PAGE = document.body.dataset.page || "";
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var fa = function () { return R.lang === "fa"; };
  function list() { var S = window.SITE || {}; return (S.socials || []).filter(function (s) { return s && s.show && /^https:\/\//i.test(s.url || ""); }); }
  function handle(u) { try { var x = new URL(u), p = x.pathname.replace(/\/+$/, "").split("/").filter(Boolean); var last = p[p.length - 1] || ""; if (/^(channel|in|share|add|profile\.php)$/.test(p[0] || "") || /^UC[\w-]{20,}$/.test(last)) return x.hostname.replace(/^www\./, ""); return last ? (last.charAt(0) === "@" ? last : "@" + last) : x.hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  var TXT = {
    fa: { f: "من را در شبکه‌ها دنبال کن", fp: "همهٔ صفحه‌های من در یک جا", h: "صفحه‌های اجتماعی من", hp: "همهٔ صفحه‌های رسمی من. روی هر کدام بزن یا QR را با گوشی اسکن کن.", v: "باز کردن", c: "کپی لینک", ok: "کپی شد", all: "دیدن همه با QR", sh: "این مطلب را بفرست", cp: "کپی لینک", ns: "اشتراک‌گذاری…", q: "QR", note: "این صفحه فقط لینک‌های رسمی خودم را نشان می‌دهد.", ttl: "صفحه‌های اجتماعی" },
    en: { f: "Follow me on social media", fp: "All my pages in one place", h: "My social pages", hp: "All my official pages. Tap one or scan its QR code with your phone.", v: "Open", c: "Copy link", ok: "Copied", all: "See all with QR", sh: "Share this post", cp: "Copy link", ns: "Share…", q: "QR", note: "This page lists only my own official links.", ttl: "Social pages" }
  };
  var L = function () { return TXT[fa() ? "fa" : "en"]; };
  function copy(t, b) { var o = b.textContent; if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { b.textContent = L().ok; setTimeout(function () { b.textContent = o; }, 1100); }, function () {}); }
  function qr(u) { var d = el("span", "so-q"); try { var q = window.qrcode(0, "M"); q.addData(u); q.make(); d.innerHTML = q.createSvgTag(4, 2, "", ""); var s = d.querySelector("svg"); if (s) { s.setAttribute("role", "img"); s.setAttribute("aria-label", "QR"); s.removeAttribute("width"); s.removeAttribute("height"); } } catch (e) {} return d; }

  /* follow block */
  function follow(where, after) {
    var S = list(); if (!S.length || !where || where.querySelector(".so-f:not(.so-n)")) return; var T = L();
    var s = el("section", "so-f"); s.setAttribute("aria-label", T.f); s.appendChild(el("h2", "", T.f));
    var u = el("ul", "so-r"); S.forEach(function (x) { var li = el("li"), a = el("a", "so-b so-" + x.label.toLowerCase().replace(/[^a-z]/g, "")); a.href = x.url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.appendChild(el("b", "", x.label)); a.appendChild(el("small", "", handle(x.url))); li.appendChild(a); u.appendChild(li); }); s.appendChild(u);
    var m = el("a", "so-all", T.all); m.href = "social.html"; s.appendChild(m);
    if (after && after.parentNode === where) where.insertBefore(s, after.nextSibling); else where.appendChild(s);
  }

  /* hub page */
  function hub() {
    var host = document.getElementById("soc"); if (!host) return; var T = L(), S = list(), key = fa() ? "fa" : "en"; if (host.dataset.k === key) return; host.dataset.k = key; host.textContent = "";
    document.title = T.ttl + " | CineCode"; var nm = (window.SITE && window.SITE.name) || {};
    host.appendChild(el("h1", "ph1", T.h)); host.appendChild(el("p", "muted", T.hp));
    var g = el("div", "so-g");
    S.forEach(function (x) { var c = el("article", "so-c"); c.appendChild(el("h2", "", x.label)); c.appendChild(el("p", "so-h", handle(x.url))); c.lastChild.dir = "ltr"; c.appendChild(qr(x.url)); var r = el("p", "so-act"); var a = el("a", "btn go", T.v); a.href = x.url; a.target = "_blank"; a.rel = "noopener noreferrer"; r.appendChild(a); var b = el("button", "btn", T.c); b.type = "button"; b.onclick = function () { copy(x.url, b); }; r.appendChild(b); c.appendChild(r); g.appendChild(c); });
    host.appendChild(g); host.appendChild(el("p", "muted", T.note));
  }

  /* share bar under blog posts */
  function shareBars() {
    if (PAGE !== "blog") return; var T = L(), enc = encodeURIComponent;
    document.querySelectorAll("#blog .bg-a").forEach(function (a) {
      if (a.querySelector(".so-sh")) return; var url = location.origin + location.pathname + "#" + a.id, h = a.querySelector("h2"), ttl = h ? h.textContent : document.title;
      var bar = el("div", "so-sh"); bar.appendChild(el("span", "", T.sh));
      [["WhatsApp", "https://wa.me/?text=" + enc(ttl + " " + url)], ["Telegram", "https://t.me/share/url?url=" + enc(url) + "&text=" + enc(ttl)], ["X", "https://twitter.com/intent/tweet?text=" + enc(ttl) + "&url=" + enc(url)], ["LinkedIn", "https://www.linkedin.com/sharing/share-offsite/?url=" + enc(url)], ["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + enc(url)]].forEach(function (n) { var l = el("a", "so-s", n[0]); l.href = n[1]; l.target = "_blank"; l.rel = "noopener noreferrer"; bar.appendChild(l); });
      var c = el("button", "so-s", T.cp); c.type = "button"; c.onclick = function () { copy(url, c); }; bar.appendChild(c);
      if (navigator.share) { var n2 = el("button", "so-s", T.ns); n2.type = "button"; n2.onclick = function () { navigator.share({ title: ttl, url: url }).catch(function () {}); }; bar.appendChild(n2); }
      a.appendChild(bar);
    });
  }

  /* YouTube playlists (real links from SITE.playlists) on the reels page */
  function playlists(where) {
    var P = ((window.SITE || {}).playlists || []).filter(function (v) { return v && /^https:\/\/(www\.)?youtube\.com\//i.test(v.url || ""); }); if (!P.length || !where || where.querySelector(".so-pl")) return; var f = fa(), s = el("section", "so-pl");
    s.appendChild(el("h2", "", f ? "پلی‌لیست‌های یوتیوب" : "YouTube playlists")); var u = el("ul", "so-r");
    P.forEach(function (v) { var li = el("li"), a = el("a", "so-b"); a.href = v.url; a.target = "_blank"; a.rel = "noopener noreferrer"; var t = v.title ? (v.title[f ? "fa" : "en"] || v.title.en || v.title.fa || "") : ""; a.appendChild(el("b", "", t || "Playlist")); a.appendChild(el("small", "", f ? "باز کردن در یوتیوب" : "Open on YouTube")); li.appendChild(a); u.appendChild(li); }); s.appendChild(u); where.appendChild(s);
  }

  /* "while you wait" links on pages that may be empty */
  function nextSteps(where) {
    if (!where || where.querySelector(".so-n")) return; var f = fa(), s = el("section", "so-f so-n"); s.appendChild(el("h2", "", f ? "تا آن وقت ببین" : "Meanwhile, explore")); var u = el("ul", "so-r");
    [[f ? "نمونه‌کارها" : "My work", f ? "پروژه‌ها و طرح‌ها" : "Projects and designs", "works.html"], [f ? "آزمایشگاه خلاق" : "Creative Lab", f ? "ابزارهای رایگان" : "Free tools", "lab.html"], [f ? "آکادمی" : "Academy", f ? "دوره‌ها و گواهی" : "Courses and certificates", "academy.html"], [f ? "ریلز" : "Reels", f ? "ویدیوها" : "Videos", "reels.html"]].forEach(function (x) { var li = el("li"), a = el("a", "so-b"); a.href = x[2]; a.appendChild(el("b", "", x[0])); a.appendChild(el("small", "", x[1])); li.appendChild(a); u.appendChild(li); }); s.appendChild(u); where.appendChild(s);
  }

  /* home: graphic design and advertising teaser (links to services.html#dx) */
  function gsvc() {
    var m = document.querySelector("main"), f = fa(), k = f ? "fa" : "en", o = document.getElementById("gsvc"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) o.remove();
    var ref = document.getElementById("courses") || document.getElementById("labt"); if (!ref || ref.parentNode !== m) return;
    var C = f ? [["هویت بصری", "لوگو · ست اداری · کارت شناسایی · کاتالوگ"], ["تبلیغات و چاپ", "بنر · پوستر · بسته‌بندی · جلد"], ["دیجیتال", "کاور و تامبنیل · پست و استوری · بنر وب · UI"], ["سینما و AI", "استوری‌بورد · روتوش · طراحی با AI · اسلاید"]] : [["Visual identity", "Logo · stationery · ID cards · catalogue"], ["Ads and print", "Banner · poster · packaging · covers"], ["Digital", "Thumbnails · post and story · web banner · UI"], ["Cinema and AI", "Storyboard · retouching · AI design · slides"]];
    var s = el("section", "sec gsv"); s.id = "gsvc"; s.dataset.k = k; s.setAttribute("aria-label", f ? "خدمات طراحی گرافیک" : "Graphic design services");
    s.appendChild(el("h2", "", f ? "طراحی گرافیک و تبلیغات" : "Graphic design and advertising")); s.appendChild(el("p", "gsv-p", f ? "۱۶ خدمت در چهار دسته، با نمونه‌کار واقعی و ثبت سفارش سریع." : "16 services in four groups, with real samples and a quick order form."));
    var u = el("ul", "so-r gsv-g"); C.forEach(function (c, i) { var li = el("li"), a = el("a", "so-b"); a.href = "services.html#dx"; a.appendChild(el("b", "", c[0])); a.appendChild(el("small", "", c[1])); a.lastChild.style.whiteSpace = "normal"; a.lastChild.style.direction = f ? "rtl" : "ltr"; li.appendChild(a); u.appendChild(li); }); s.appendChild(u);
    var b = el("a", "btn go", f ? "دیدن خدمات و سفارش" : "See services and order"); b.href = "services.html#dx"; b.style.marginTop = "18px"; b.style.display = "inline-flex"; s.appendChild(b);
    m.insertBefore(s, ref);
  }

  function all() {
    try {
      hub(); gsvc();
      var m = document.querySelector("main"); if (!m) return;
      if (PAGE === "notes" || PAGE === "activity") { var nb = document.getElementById(PAGE) || m; nextSteps(nb); follow(nb); }
      if (PAGE === "blog") { shareBars(); var b = document.getElementById("blog"); if (b) { if (!b.querySelector(".bg-a")) nextSteps(b); follow(b); } }
      else if (PAGE === "reels") { var rr = document.getElementById("reels") || m; playlists(rr); follow(rr); }
      else if (PAGE === "services") { var s = document.getElementById("services"); if (s) follow(s); }
      else if (PAGE === "works") { var w = m; if (w) follow(w); }
      else if (PAGE === "home") { var c = document.getElementById("contact"); if (c && c.parentNode === m) follow(m, c.previousElementSibling && c.previousElementSibling.id === "cta2" ? c.previousElementSibling.previousElementSibling : c.previousElementSibling); }
    } catch (e) { if (window.console) console.warn("social", e); }
  }
  var t = 0; function soon() { clearTimeout(t); t = setTimeout(function () { var l = document.querySelector(".so-f:not(.so-n)"); if (l && l.querySelector("h2").textContent !== L().f) { document.querySelectorAll(".so-f,.so-sh,.so-pl,.so-n").forEach(function (n) { n.remove(); }); } all(); }, 300); }
  function go() { all(); setTimeout(all, 900); setTimeout(all, 2500); var m = document.querySelector("main"); if (m) new MutationObserver(function () { if (m.querySelector(".so-f") && (PAGE !== "blog" || !document.querySelector("#blog .bg-a:not(:has(.so-sh))"))) { var l = m.querySelector(".so-f:not(.so-n) h2"); if (l && l.textContent === L().f) return; } soon(); }).observe(m, { childList: true, subtree: true }); }
  if (window.SITE) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go(); } else addEventListener("load", go);
})();
