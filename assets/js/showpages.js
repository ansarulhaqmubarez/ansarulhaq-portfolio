/* Two showcase pages: graphics.html (design gallery, masonry + lightbox) and certificates.html (3D cards + lightbox).
   Data comes from window.SITE (gallery, certs). Text is escaped; images are our own files (assets/work, assets/certs). */
(function () {
  "use strict";
  var PAGE = document.body.dataset.page;
  if (PAGE !== "graphics" && PAGE !== "certs") return;
  var root = document.getElementById("showpage"); if (!root) return;
  var S = window.SITE || {}, lang = "fa";
  try { lang = localStorage.getItem("am-lang") === "en" ? "en" : "fa"; } catch (e) {}
  var fa = lang === "fa";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var lv = function (x) { return x && typeof x === "object" ? (x[lang] || x.en || x.fa || "") : String(x || ""); };
  var ST = fa ? {
    gT: "نمونه‌کار طراحی گرافیک", gS: "پوستر، برند، بنر و چاپ. روی هر طرح بزن تا بزرگ ببینی.", all: "همه", n: "طرح",
    cats: { poster: "پوستر", academy: "آموزشی", banner: "بنر", brand: "برند", print: "چاپی" },
    cT: "گواهی‌ها", cS: "گواهی‌های گذراندن دوره، با نام برگزارکننده و سال.", cn: "گواهی", feat: "برگزیده",
    ccats: { cs: "علوم کامپیوتر", design: "طراحی", film: "فیلم", lang: "زبان", biz: "کسب‌وکار", community: "جامعه", work: "کار" },
    cl: "بستن", pv: "قبلی", nx: "بعدی", home: "خانه", ver: "تأیید گواهی", by: "صادرکننده"
  } : {
    gT: "Graphic design showcase", gS: "Posters, brand, banners and print. Tap any design to view it large.", all: "All", n: "designs",
    cats: { poster: "Posters", academy: "Academy", banner: "Banners", brand: "Brand", print: "Print" },
    cT: "Certificates", cS: "Course completion certificates, with issuer and year.", cn: "certificates", feat: "Featured",
    ccats: { cs: "Computer science", design: "Design", film: "Film", lang: "Language", biz: "Business", community: "Community", work: "Work" },
    cl: "Close", pv: "Previous", nx: "Next", home: "Home", ver: "Verify certificate", by: "Issued by"
  };
  var isG = PAGE === "graphics", cat = "all", list = [], cur = -1, lb = null, opener = null;
  var items = isG ? (S.gallery || []).filter(function (g) { return g && /^[\w-]+$/.test(g.id || "") && !g.hidden; }) : (S.certs || []).filter(function (c) { return c && /^[\w-]+$/.test(c.id || "") && c.img; });
  var CATS = isG ? ST.cats : ST.ccats;
  var src = function (x, t) { return (isG ? "assets/work/" : "assets/certs/") + x.id + (t ? "-t" : "") + ".webp"; };
  var title = function (x) { return isG ? (lv(x.title) || (CATS[x.cat] || "")) : lv(x.title); };

  function head() {
    var n = items.length, cats = Object.keys(CATS).filter(function (k) { return items.some(function (x) { return x.cat === k; }); });
    root.innerHTML = '<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">' + esc(ST.home) + '</a> / <span aria-current="page">' + esc(isG ? ST.gT : ST.cT) + "</span></nav>" +
      '<div class="sp-h"><h1 class="ph1">' + esc(isG ? ST.gT : ST.cT) + "</h1><p class=\"muted\">" + esc(isG ? ST.gS : ST.cS) + '</p><p class="sp-n"><b>' + n + "</b> " + esc(isG ? ST.n : ST.cn) + "</p></div>" +
      '<div class="pflt sp-f" role="group" aria-label="' + esc(isG ? ST.gT : ST.cT) + '"><button type="button" class="on" data-c="all" aria-pressed="true">' + esc(ST.all) + ' <span class="xn">' + n + "</span></button>" + cats.map(function (k) { return '<button type="button" data-c="' + k + '" aria-pressed="false">' + esc(CATS[k]) + ' <span class="xn">' + items.filter(function (x) { return x.cat === k; }).length + "</span></button>"; }).join("") + "</div>" +
      '<div id="spg" class="' + (isG ? "sp-mas" : "sp-cards") + '"></div>';
  }
  function draw() {
    list = items.filter(function (x) { return cat === "all" || x.cat === cat; });
    if (!isG) list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    var g = document.getElementById("spg");
    g.innerHTML = list.map(function (x, i) {
      var t = esc(title(x));
      if (isG) return '<button type="button" class="sp-g" data-i="' + i + '" style="--d:' + Math.min(i, 24) * 40 + 'ms" aria-label="' + t + '"><img src="' + src(x, true) + '" alt="' + t + '" loading="lazy" width="' + (x.w || 640) + '" height="' + (x.h || 640) + '"><span class="sp-cap">' + esc(CATS[x.cat] || "") + "</span></button>";
      return '<button type="button" class="sp-c" data-i="' + i + '" style="--d:' + Math.min(i, 24) * 40 + 'ms" aria-label="' + t + '"><span class="sp-ci"><img src="' + src(x, true) + '" alt="" loading="lazy" width="320" height="226"></span><span class="sp-ct"><b>' + t + "</b><small>" + esc(lv(x.issuer)) + (x.year ? " · " + esc(x.year) : "") + "</small>" + (x.featured ? '<em>' + esc(ST.feat) + "</em>" : "") + "</span></button>";
    }).join("");
  }
  function show(i) {
    if (i < 0) i = list.length - 1; if (i >= list.length) i = 0; cur = i; var x = list[i];
    if (!lb) {
      lb = document.createElement("div"); lb.className = "sp-lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
      lb.innerHTML = '<button type="button" class="sp-x" data-a="x" aria-label="' + esc(ST.cl) + '">×</button><button type="button" class="sp-p" data-a="p" aria-label="' + esc(ST.pv) + '">‹</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="sp-nx" data-a="n" aria-label="' + esc(ST.nx) + '">›</button>';
      document.body.appendChild(lb);
      lb.addEventListener("click", function (e) { var b = e.target.closest("[data-a]"); if (b) { e.stopPropagation(); if (b.dataset.a === "x") close(); else show(cur + (b.dataset.a === "n" ? 1 : -1)); } else if (e.target === lb) close(); });
    }
    var im = lb.querySelector("img"); im.src = src(x); im.alt = title(x);
    var cap = lb.querySelector("figcaption"); cap.textContent = title(x) + (isG ? "" : (x.issuer ? " · " + lv(x.issuer) : "") + (x.year ? " · " + x.year : ""));
    if (!isG && /^https:\/\//i.test(x.verifyUrl || "")) { var a = document.createElement("a"); a.href = x.verifyUrl; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = " · " + ST.ver; cap.appendChild(a); }
    lb.hidden = false; document.documentElement.style.overflow = "hidden"; lb.querySelector(".sp-x").focus();
  }
  function close() { if (lb) lb.hidden = true; document.documentElement.style.overflow = ""; if (opener) opener.focus(); }
  head(); draw();
  root.addEventListener("click", function (e) {
    var f = e.target.closest("[data-c]"); if (f) { cat = f.dataset.c; [].forEach.call(root.querySelectorAll("[data-c]"), function (b) { var on = b === f; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); }); draw(); return; }
    var c = e.target.closest("[data-i]"); if (c) { opener = c; show(+c.dataset.i); }
  });
  document.addEventListener("keydown", function (e) { if (!lb || lb.hidden) return; if (e.key === "Escape") close(); else if (e.key === "ArrowRight") show(cur + (fa ? -1 : 1)); else if (e.key === "ArrowLeft") show(cur + (fa ? 1 : -1)); });
  /* 3D tilt on certificate cards (pointer devices only, off for reduced motion) */
  if (!isG && window.matchMedia && matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
    root.addEventListener("pointermove", function (e) { var c = e.target.closest(".sp-c"); if (!c) return; var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = "perspective(700px) rotateY(" + (x * 10).toFixed(1) + "deg) rotateX(" + (-y * 10).toFixed(1) + "deg) translateY(-4px)"; });
    root.addEventListener("pointerout", function (e) { var c = e.target.closest(".sp-c"); if (c) c.style.transform = ""; });
  }
})();
