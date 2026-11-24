/* Resource archive page: 850+ links in 17 categories, search, category filter, "show more".
   Data: data/resources.json (title, description, url, official-flag). All text is escaped; only http(s) links are made clickable. */
(function () {
  "use strict";
  if (document.body.dataset.page !== "resources") return;
  var root = document.getElementById("resources"); if (!root) return;
  var ST = {
    fa: { save: "ذخیره / حذف از ذخیره‌ها", saved: "ذخیره‌شده", t: "آرشیو منابع و سایت‌های مفید", sub: "سایت‌ها، دوره‌ها و ابزارهای دسته‌بندی‌شده. همه لینک‌ها به سایت‌های بیرونی باز می‌شوند.", q: "جستجو در همهٔ منابع…", all: "همه", more: "نمایش بیشتر", cnt: "مورد", of: "از", home: "خانه", lib: "کتابخانه", open: "باز کردن", nolink: "لینک موجود نیست", off: "آدرس رسمی افزوده شده؛ پیش از استفاده بررسی کن", cau: "سایت‌های نیازمند احتیاط", cauD: "این‌ها غیرمعتبر یا نیمه‌معتبر شمرده شده‌اند. با دقت و آگاهانه باز کن.", none: "موردی پیدا نشد.", nres: "منبع", ncat: "دسته" },
    en: { save: "Save / unsave", saved: "Saved", t: "Resource archive", sub: "Sites, courses and tools sorted by topic. All links open external websites. Descriptions are in Persian.", q: "Search all resources…", all: "All", more: "Show more", cnt: "items", of: "of", home: "Home", lib: "Library", open: "Open", nolink: "No link available", off: "Official address added; check before use", cau: "Sites to treat with caution", cauD: "These are listed as unreliable or semi-reliable. Open them carefully and knowingly.", none: "Nothing found.", nres: "resources", ncat: "categories" }
  };
  var IC = {
    1: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    2: '<path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11.5V16c2 2 8 2 10 0v-4.5"/>',
    3: '<circle cx="12" cy="9" r="5.5"/><path d="M8.7 13.5L7.5 21l4.5-2.5 4.5 2.5-1.2-7.5"/>',
    4: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',
    5: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5"/>',
    6: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    7: '<path d="M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2s0-2 1.5-2H17a4 4 0 004-4c0-5-4-10-9-10z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="11" r="1"/>',
    8: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    9: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    10: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>',
    11: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    12: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/>',
    13: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    14: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
    15: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
    16: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M8.5 11l2 2 3-3.5"/>',
    17: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5h.01"/>'
  };
  var svg = function (n, s) { return '<svg class="rs-i" viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (IC[n] || IC[10]) + "</svg>"; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var norm = function (s) { return String(s || "").toLowerCase().replace(/[‌‍ً-ٟ]/g, "").replace(/ي/g, "ی").replace(/ك/g, "ک"); };
  var host = function (u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  var data = null, cat = 0, q = "", shown = 48, PAGE = 48;
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "fa"; };

  function flat() {
    var out = [];
    data.forEach(function (c) { c.items.forEach(function (it, i) { out.push({ c: c.n, cn: c.name, caution: c.caution, t: it[0], d: it[1], u: it[2], o: it[3], k: norm(it[0] + " " + it[1] + " " + it[2]) }); }); });
    return out;
  }
  var ALL = [], SAVED = {};
  try { (JSON.parse(localStorage.getItem("am-rs-fav") || "[]") || []).forEach(function (u) { if (typeof u === "string") SAVED[u] = 1; }); } catch (e) {}
  function persist() { try { localStorage.setItem("am-rs-fav", JSON.stringify(Object.keys(SAVED).slice(0, 500))); } catch (e) {} }
  var mono = function (x) { var h = host(x.u || ""), m = (h.replace(/^(www|m)\./, "").charAt(0) || (x.t || "?").charAt(0)).toUpperCase(); return m; };
  function card(x, L) {
    var h = x.u ? host(x.u) : "";
    return '<article class="rs-c" style="--h:' + (x.c * 47 % 360) + '"><div class="rs-top"><span class="rs-b">' + svg(x.c, 18) + '</span><span class="rs-mo" aria-hidden="true" style="--h:' + ((x.t.length * 29 + (x.c * 47)) % 360) + '">' + esc(mono(x)) + '</span><span class="rs-cat">' + esc(x.cn) + "</span>" + (x.u ? '<button type="button" class="rs-st" data-s="' + esc(x.u) + '" aria-pressed="' + (!!SAVED[x.u]) + '" aria-label="' + esc(L.save) + '">' + (SAVED[x.u] ? "★" : "☆") + "</button>" : "") + "</div>" +
      "<h2>" + esc(x.t) + (x.o ? ' <abbr title="' + esc(L.off) + '">*</abbr>' : "") + "</h2><p>" + esc(x.d) + '</p><div class="rs-f">' +
      (x.u ? '<span class="rs-h" dir="ltr">' + esc(h) + '</span><a class="rs-go" href="' + esc(x.u) + '" target="_blank" rel="noopener noreferrer nofollow" aria-label="' + esc(L.open + ": " + x.t) + '">' + esc(L.open) + " ↗</a>" : '<span class="rs-h">' + esc(L.nolink) + "</span>") + "</div></article>";
  }
  function draw() {
    var L = ST[lang()], nq = norm(q.trim()), grid = root.querySelector("#rsGrid"), cau = root.querySelector("#rsCau");
    var list = ALL.filter(function (x) { return (!nq || x.k.indexOf(nq) > -1) && (cat === -1 ? !!(x.u && SAVED[x.u]) : cat ? x.c === cat : !x.caution); });
    var cl = ALL.filter(function (x) { return x.caution && (!nq || x.k.indexOf(nq) > -1); });
    root.querySelector("#rsCnt").textContent = Math.min(shown, list.length) + " " + L.of + " " + list.length + " " + L.cnt;
    grid.innerHTML = list.length ? list.slice(0, shown).map(function (x) { return card(x, L); }).join("") : '<p class="muted">' + esc(L.none) + "</p>";
    var mb = root.querySelector("#rsMore"); mb.hidden = list.length <= shown;
    cau.hidden = !!cat || !cl.length; cau.querySelector("#rsCauG").innerHTML = cl.map(function (x) { return card(x, L); }).join("");
    cau.querySelector("summary span").textContent = L.cau + " (" + cl.length + ")";
    [].forEach.call(root.querySelectorAll("[data-c]"), function (b) { b.setAttribute("aria-pressed", String(+b.dataset.c === cat)); });
  }
  function build() {
    var L = ST[lang()], total = ALL.length;
    root.innerHTML = '<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">' + esc(L.home) + '</a> / <a href="library.html">' + esc(L.lib) + '</a> / <span aria-current="page">' + esc(L.t) + "</span></nav>" +
      '<h1 class="ph1">' + esc(L.t) + '</h1><p class="muted">' + esc(L.sub) + '</p><p class="rs-n"><b>' + total + "</b> " + esc(L.nres) + " — <b>" + data.length + "</b> " + esc(L.ncat) + "</p>" +
      '<label class="ac-q"><span class="sr">' + esc(L.q) + '</span><input type="search" id="rsQ" value="' + esc(q) + '" placeholder="' + esc(L.q) + '" autocomplete="off"></label>' +
      '<div class="rs-chips" role="group" aria-label="' + esc(L.ncat) + '"><button type="button" data-c="0" aria-pressed="' + (cat === 0) + '">' + svg(10, 18) + "<span>" + esc(L.all) + '</span><i>' + ALL.filter(function (x) { return !x.caution; }).length + "</i></button>" +
      '<button type="button" data-c="-1" aria-pressed="' + (cat === -1) + '"><span>★ ' + esc(L.saved) + '</span><i id="rsSvN">' + Object.keys(SAVED).length + "</i></button>" + data.map(function (c) { return '<button type="button" data-c="' + c.n + '" aria-pressed="' + (cat === c.n) + '" style="--h:' + (c.n * 47 % 360) + '">' + svg(c.n, 18) + "<span>" + esc(c.name) + "</span><i>" + c.items.length + "</i></button>"; }).join("") + "</div>" +
      '<p class="muted" id="rsCnt" role="status" aria-live="polite"></p><div class="rs-grid" id="rsGrid"></div><p class="rs-mw"><button type="button" class="btn go" id="rsMore">' + esc(L.more) + "</button></p>" +
      '<details class="rs-cau" id="rsCau"><summary>' + svg(17, 20) + "<span></span></summary><p class=\"muted\">" + esc(L.cauD) + '</p><div class="rs-grid" id="rsCauG"></div></details>';
    root.querySelector("#rsQ").oninput = function (e) { q = e.target.value; shown = PAGE; draw(); };
    root.querySelector("#rsMore").onclick = function () { shown += PAGE; draw(); };
    root.querySelector(".rs-chips").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; cat = +b.dataset.c; shown = PAGE; draw(); };
    root.addEventListener("click", function (e) { var b = e.target.closest(".rs-st"); if (!b) return; var u = b.dataset.s; if (SAVED[u]) delete SAVED[u]; else SAVED[u] = 1; persist(); draw(); var n = root.querySelector("#rsSvN"); if (n) n.textContent = Object.keys(SAVED).length; });
    draw();
  }
  document.title = ST[lang()].t + " | " + (document.title.split("|")[1] || "").trim();
  fetch("data/resources.json", { credentials: "omit" }).then(function (r) { return r.json(); }).then(function (d) {
    data = d; ALL = flat(); var hm = /^#c(\d{1,2})$/.exec(location.hash); if (hm && +hm[1] >= 1 && +hm[1] <= 17) cat = +hm[1]; build();
    new MutationObserver(function () { build(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }).catch(function () { root.innerHTML = '<p class="fstatus err" role="alert">' + esc(ST[lang()].none) + "</p>"; });
})();
