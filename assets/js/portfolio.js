/* Portfolio page — hero, selected works, discipline filter, case studies, social feed, skills, articles, CV */
(function () {
  if (document.body.dataset.page !== "portfolio") return;
  var X = window.__pfCtx && window.__pfCtx(); if (!X) return;
  var S = X.S, lang = X.lang, esc = X.esc, tx = X.tx, $ = X.$, $$ = X.$$, gsrc = X.gsrc, T = X.T, wkOpen = X.wkOpen, WKLIST;
  var P = window.PORTFOLIO || { disciplines: [], posts: [], articles: [], cases: [] };
  var fl = "all", sp = "all", lim = 24;
  var safe = function (u) { return /^https:\/\/[^\s"'<>]+$/i.test(u || "") ? u : ""; };
  var L = function () { var f = lang === "fa"; return f ? {
    t: "نمونه‌کارهای خلاقانه من", h: "فیلم، تدوین، طراحی گرافیک و آموزش", d: "این صفحه کارهای واقعی من را بر اساس رشته دسته‌بندی می‌کند. هر بخشی که هنوز کار منتشرشده ندارد، صادقانه خالی نشان داده می‌شود.", go: "دیدن کارها",
    sel: "کارهای منتخب", all: "همه کارها", va: "دیدن همه", ex: "کاوش بر اساس رشته", cnt: "کار", noW: "هنوز کار منتشرشده‌ای در این رشته اضافه نشده است.", noWh: "این بخش پس از افزودن نمونه‌کار واقعی پر می‌شود.",
    cs: "پروژه‌ها و مطالعه موردی", csE: "هنوز مطالعه موردی کاملی ثبت نشده است. پروژه‌های واقعی با جزئیات (نقش، ابزار، فرایند، خروجی) پس از ارائه اضافه می‌شوند.", csA: "صفحه پروژه‌ها",
    so: "محتوای شبکه‌های اجتماعی", soE: "هنوز پستی در فید ثبت نشده است. پست‌ها به‌صورت دستی ثبت می‌شوند؛ تا آن زمان کانال‌های رسمی را ببینید.", soO: "باز کردن در", chan: "کانال‌های رسمی",
    sk: "مهارت‌ها در عمل", skD: "ابزارهایی که واقعاً با آن‌ها کار می‌کنم و ارتباطشان با رشته‌ها. بدون درصد؛ فقط با ارجاع به کار واقعی.", skW: "کار مرتبط", skN: "هنوز کار منتشرشده‌ای برای این مهارت ثبت نشده", skF: "فیلتر کارها",
    ar: "مقالات و انتشارات", arE: "هنوز مقاله‌ای منتشر نشده است. وبلاگ و یادداشت‌ها پس از انتشار اولین نوشته اینجا نمایش داده می‌شوند.", arB: "وبلاگ", arN: "یادداشت‌ها", read: "خواندن", share: "اشتراک‌گذاری",
    cv: "رزومه من", cvD: "سوابق، مهارت‌ها و گواهی‌ها در یک صفحه.", cvB: "دانلود رزومه من", cvV: "مشاهده رزومه", cvP: "فایل PDF رزومه هنوز بارگذاری نشده؛ از صفحه رزومه می‌توانید چاپ/ذخیره PDF کنید.", more: "نمایش بیشتر", all2: "همه", zoom: "بزرگ‌نمایی" } : {
    t: "My Creative Portfolio", h: "Film, editing, graphic design and teaching", d: "This page groups my real work by discipline. Any section without published work is shown honestly as empty.", go: "Explore My Work",
    sel: "Selected Works", all: "All Works", va: "View all", ex: "Explore by Discipline", cnt: "works", noW: "No published work has been added to this discipline yet.", noWh: "This section fills in once real work is added.",
    cs: "Projects & Case Studies", csE: "No full case study has been recorded yet. Real projects with details (role, tools, process, output) will be added once provided.", csA: "Projects page",
    so: "Social Content Feed", soE: "No posts have been registered yet. Posts are added manually; until then, see the official channels.", soO: "Open on", chan: "Official channels",
    sk: "Skills in Practice", skD: "Tools I actually work with and how they connect to disciplines. No percentages — only links to real work.", skW: "related works", skN: "No published work for this skill yet", skF: "Filter works",
    ar: "Articles & Publications", arE: "No article has been published yet. The blog and notes will appear here after the first post.", arB: "Blog", arN: "Notes", read: "Read", share: "Share",
    cv: "My CV", cvD: "Experience, skills and certificates on one page.", cvB: "Download My CV", cvV: "View CV", cvP: "The CV PDF file has not been uploaded yet; use the CV page to print / save as PDF.", more: "Show more", all2: "All", zoom: "Zoom" }; };
  var dn = function (d) { return lang === "fa" ? d.fa : d.en; };
  /* admin-managed content (design.portfolio) is merged on top of data/portfolio.js; hidden items are skipped */
  var BASE = { cases: (P.cases || []).slice(), posts: (P.posts || []).slice(), articles: (P.articles || []).slice() };
  function mergeRemote(v) {
    if (!v || typeof v !== "object") return;
    ["cases", "posts", "articles"].forEach(function (k) { P[k] = BASE[k].concat((Array.isArray(v[k]) ? v[k] : []).filter(function (x) { return x && !x.hide; })); });
  }
  function cachedRemote() { try { return (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).portfolio; } catch (e) { return null; } }
  function img(u) { return /^assets\/[\w\-./]+$/.test(u || "") || (S.supabaseUrl && (u || "").indexOf(S.supabaseUrl + "/storage/") === 0) ? u : ""; }
  function caseCard(c) {
    var fa = lang === "fa", im = img(c.cover), u = safe(c.url);
    return '<article class="pf-card' + (c.status === "wip" ? " pf-wip" : "") + '">' + (im ? '<img src="' + esc(im) + '" alt="" loading="lazy" decoding="async">' : "") +
      (c.status === "wip" ? '<span class="pill pf-badge">' + (fa ? "در حال انجام" : "In progress") + "</span>" : "") +
      '<h3>' + esc(tx(c.title)) + '</h3><p>' + esc(tx(c.overview) || "") + '</p><p class="muted">' + esc([c.role, c.year, (c.tools || []).join(", ")].filter(Boolean).join(" · ")) + "</p>" +
      (u ? '<a class="btn" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + (fa ? "دیدن پروژه" : "View project") + "</a>" : "") + "</article>";
  }
  function caseGroup(list) {
    var fa = lang === "fa", done = list.filter(function (c) { return c.status !== "wip"; }), wip = list.filter(function (c) { return c.status === "wip"; });
    return (done.length ? '<div class="pf-cards">' + done.map(caseCard).join("") + "</div>" : "") +
      (wip.length ? '<h3 class="pf-sub">' + (fa ? "پروژه‌های در حال انجام" : "Projects in progress") + '</h3><div class="pf-cards">' + wip.map(caseCard).join("") + "</div>" : "");
  }
  function worksOf(d) {
    var gl = S.gallery || [], ex = P.extraCats || {};
    return gl.filter(function (g) { return d.gal.indexOf(g.cat) >= 0 || (ex[g.id] || []).indexOf(d.id) >= 0; });
  }
  function allWorks() {
    var seen = {}, out = [];
    P.disciplines.forEach(function (d) { worksOf(d).forEach(function (g) { if (!seen[g.id]) { seen[g.id] = 1; out.push(g); } }); });
    return out;
  }
  function selected() {
    var all = allWorks(), ids = P.selected || [];
    if (ids.length) return ids.map(function (i) { return all.filter(function (g) { return g.id === i; })[0]; }).filter(Boolean);
    var seen = {}, out = [];
    all.forEach(function (g) { if (!seen[g.cat]) { seen[g.cat] = 1; out.push(g); } });
    all.forEach(function (g) { if (out.length < 6 && out.indexOf(g) < 0) out.push(g); });
    return out.slice(0, 6);
  }
  var catName = function (g) { var GN = { poster: "gpost", academy: "gacad", banner: "gban", brand: "gbra", print: "gprn" }; return X.T.cats[GN[g.cat]] || g.cat; };
  function fig(g, i) { return '<figure class="wkf"><button type="button" class="wkb" data-i="' + i + '" aria-label="' + esc(L().zoom + ": " + catName(g) + " " + (i + 1)) + '"><img src="' + esc(gsrc(g, true)) + '" alt="' + esc(catName(g)) + '" loading="lazy" decoding="async" width="' + g.w + '" height="' + g.h + '"></button><figcaption><span>' + String(i + 1).padStart(2, "0") + '</span><span>' + esc(catName(g)) + '</span></figcaption></figure>'; }
  function open(list, i) { X.setList(list); wkOpen(i); }
  var cur = [];
  function render() {
    X = window.__pfCtx(); S = X.S; lang = X.lang;
    var l = L(), m = $("#pf"); if (!m) return;
    document.documentElement.lang = lang;
    document.title = l.t + " | " + tx(S.name);
    var ds = P.disciplines, sel = selected();
    var cv = (S.cvPdf && /^(assets|https:)/.test(S.cvPdf)) ? S.cvPdf : "";
    var tools = [].concat((S.skills && S.skills.video) || [], (S.skills && S.skills.design) || []);
    var posts = (P.posts || []).filter(function (p) { return safe(p.url); });
    var seenU = {}; posts = posts.filter(function (p) { var k = safe(p.url).replace(/[?#].*$/, "").replace(/\/$/, ""); if (seenU[k]) return false; seenU[k] = 1; return true; });
    var plats = []; posts.forEach(function (p) { if (plats.indexOf(p.platform) < 0) plats.push(p.platform); });
    var arts = (P.articles || []).concat((S.notes || []).map(function (n) { return { id: n.id, title: n.title, summary: n.summary || n.text, date: n.date, url: "notes.html" }; }));
    var pfL = (S.socials || []).filter(function (s) { return s.show && safe(s.url); });
    m.innerHTML =
      '<section class="pf-hero" id="pfHero"><p class="pf-k">' + esc(tx(S.name)) + '</p><h1 class="ph1">' + esc(l.t) + '</h1><p class="pf-h">' + esc(l.h) + '</p><p class="muted">' + esc(l.d) + '</p><a class="btn go" href="#pfDisc">' + esc(l.go) + '</a></section>' +
      '<section class="pf-sec" id="pfSel" aria-labelledby="pfSelH"><div class="pf-hd"><h2 id="pfSelH">' + esc(l.sel) + '</h2><a class="pf-va" href="works.html">' + esc(l.va) + ' →</a></div><div class="wkg" id="pfSelG">' + sel.map(fig).join("") + '</div></section>' +
      '<section class="pf-sec" id="pfDisc" aria-labelledby="pfDiscH"><h2 id="pfDiscH">' + esc(l.ex) + '</h2><div class="wkt pf-tiles" role="group" aria-label="' + esc(l.ex) + '">' +
      '<button type="button" class="wkt-i' + (fl === "all" ? " on" : "") + '" data-f="all" aria-pressed="' + (fl === "all") + '"><span class="wkt-n">' + esc(l.all) + '</span><span class="wkt-c">' + allWorks().length + ' ' + esc(l.cnt) + '</span></button>' +
      ds.map(function (d) { var n = worksOf(d).length; return '<button type="button" class="wkt-i' + (fl === d.id ? " on" : "") + '" data-f="' + d.id + '" aria-pressed="' + (fl === d.id) + '"><span class="wkt-n">' + esc(dn(d)) + '</span><span class="wkt-c">' + n + ' ' + esc(l.cnt) + '</span></button>'; }).join("") +
      '</div><div class="wkg" id="pfGrid" aria-live="polite"></div></section>' +
      '<section class="pf-sec" id="pfCase" aria-labelledby="pfCaseH"><h2 id="pfCaseH">' + esc(l.cs) + '</h2>' +
      ((P.cases || []).length ? caseGroup(P.cases)
        : '<div class="pjl-empty"><div><p>' + esc(l.csE) + '</p><a class="btn" href="project.html">' + esc(l.csA) + '</a></div></div>') + '</section>' +
      '<section class="pf-sec" id="pfSoc" aria-labelledby="pfSocH"><h2 id="pfSocH">' + esc(l.so) + '</h2>' +
      (posts.length ? '<div class="pf-tiles pf-plat" role="group"><button type="button" class="wkt-i' + (sp === "all" ? " on" : "") + '" data-p="all" aria-pressed="' + (sp === "all") + '"><span class="wkt-n">' + esc(l.all2) + '</span></button>' + plats.map(function (p) { return '<button type="button" class="wkt-i' + (sp === p ? " on" : "") + '" data-p="' + esc(p) + '" aria-pressed="' + (sp === p) + '"><span class="wkt-n">' + esc(p) + '</span></button>'; }).join("") + '</div><div class="pf-cards" id="pfPosts"></div>'
        : '<p class="muted">' + esc(l.soE) + '</p>') +
      '<h3 class="pf-sub">' + esc(l.chan) + '</h3><ul class="pf-ch">' + pfL.map(function (s) { return '<li><a class="btn" href="' + esc(safe(s.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + '</a></li>'; }).join("") + '</ul></section>' +
      '<section class="pf-sec" id="pfSk" aria-labelledby="pfSkH"><h2 id="pfSkH">' + esc(l.sk) + '</h2><p class="muted">' + esc(l.skD) + '</p><ul class="pf-sk">' + tools.map(function (t) { var d = ds.filter(function (x) { return x.id === (P.toolDisc || {})[t[0]]; })[0], n = d ? worksOf(d).length : 0; return '<li class="pf-card"><b>' + esc(t[1]) + '</b><span class="muted">' + (d ? esc(dn(d)) : "") + '</span>' + (n ? '<button type="button" class="btn" data-sk="' + d.id + '">' + n + ' ' + esc(l.skW) + ' — ' + esc(l.skF) + '</button>' : '<span class="muted">' + esc(l.skN) + '</span>') + '</li>'; }).join("") + '</ul></section>' +
      '<section class="pf-sec" id="pfAr" aria-labelledby="pfArH"><h2 id="pfArH">' + esc(l.ar) + '</h2>' +
      (arts.length ? '<div class="pf-cards">' + arts.map(function (a) { return '<article class="pf-card"><h3>' + esc(tx(a.title)) + '</h3><p>' + esc(tx(a.summary) || "") + '</p><a class="btn" href="' + esc(a.url || "blog.html") + '">' + esc(l.read) + '</a></article>'; }).join("") + '</div>' : '<p class="muted">' + esc(l.arE) + '</p>') +
      '<p><a class="btn" href="blog.html">' + esc(l.arB) + '</a> <a class="btn" href="notes.html">' + esc(l.arN) + '</a></p></section>' +
      '<section class="pf-sec pf-cv" id="pfCv" aria-labelledby="pfCvH"><h2 id="pfCvH">' + esc(l.cv) + '</h2><p class="muted">' + esc(l.cvD) + '</p><p>' +
      (cv ? '<a class="btn go" id="pfCvDl" href="' + esc(cv) + '" download>' + esc(l.cvB) + '</a> ' : '<a class="btn go" id="pfCvDl" href="cv.html">' + esc(l.cvB) + '</a> ') + '<a class="btn" href="cv.html">' + esc(l.cvV) + '</a></p>' + (cv ? "" : '<p class="muted">' + esc(l.cvP) + '</p>') + '</section>';
    var grid = $("#pfGrid");
    function drawGrid() {
      var d = ds.filter(function (x) { return x.id === fl; })[0];
      cur = fl === "all" ? allWorks() : (d ? worksOf(d) : []);
      grid.innerHTML = cur.length ? cur.slice(0, lim).map(fig).join("") + (cur.length > lim ? '</div><p><button type="button" class="btn" id="pfMore">' + esc(l.more) + ' (' + lim + ' / ' + cur.length + ')</button></p><div hidden>' : "") : '<div class="pjl-empty"><div><p>' + esc(l.noW) + '</p><p class="muted">' + esc(l.noWh) + '</p></div></div>';
    }
    function drawPosts() {
      var box = $("#pfPosts"); if (!box) return;
      box.innerHTML = posts.filter(function (p) { return sp === "all" || p.platform === sp; }).map(function (p) { return '<article class="pf-card">' + ((/^assets\//.test(p.thumb || "") || (S.supabaseUrl && (p.thumb || "").indexOf(S.supabaseUrl + "/storage/") === 0)) ? '<img src="' + esc(p.thumb) + '" alt="" loading="lazy" width="320" height="200">' : "") + '<p>' + esc(tx(p.caption) || "") + '</p><p class="muted">' + esc([p.platform, p.type, p.date].filter(Boolean).join(" · ")) + '</p><a class="btn" href="' + esc(safe(p.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(l.soO) + " " + esc(p.platform) + '</a></article>'; }).join("");
    }
    drawGrid(); drawPosts();
    var mb = $("#pfMore"); if (mb) mb.onclick = function () { lim += 24; render(); var t = $$("#pfGrid .wkb")[lim - 24]; if (t) t.focus({ preventScroll: true }); };
    $$("#pfDisc [data-f]").forEach(function (b) { b.onclick = function () { fl = b.dataset.f; lim = 24; render(); var t = $('#pfDisc [data-f="' + fl + '"]'); if (t) t.focus({ preventScroll: true }); }; });
    $$("#pfSoc [data-p]").forEach(function (b) { b.onclick = function () { sp = b.dataset.p; render(); var t = $('#pfSoc [data-p="' + sp + '"]'); if (t) t.focus({ preventScroll: true }); }; });
    $$("#pfSk [data-sk]").forEach(function (b) { b.onclick = function () { fl = b.dataset.sk; render(); var t = $("#pfDisc"); if (t) t.scrollIntoView({ behavior: "smooth" }); }; });
    $("#pfSelG").onclick = function (e) { var b = e.target.closest(".wkb"); if (b) open(sel, +b.dataset.i); };
    grid.onclick = function (e) { var b = e.target.closest(".wkb"); if (b) open(cur, +b.dataset.i); };
  }
  window.renderPortfolio = render;
  mergeRemote(cachedRemote());
  render();
  try {
    var SBc = window.__SB;
    if (SBc && SBc.on && SBc.on()) SBc.rest("site_settings?select=value&key=eq.design.portfolio").then(function (r) {
      var v = r && r[0] && r[0].value; if (!v) return;
      try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.portfolio = v; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
      mergeRemote(v); render();
    }).catch(function () {});
  } catch (e) {}
})();
