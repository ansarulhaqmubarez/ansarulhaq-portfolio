/* Site behaviour. Content lives in data/content.js; this file only draws it.
   One file serves every page; document.body.dataset.page says which one is open:
   home | project | press | privacy | notfound */
(() => {
"use strict";
const S = window.SITE;
const taskList = x => { const a = x && x.tasks && x.tasks[lang]; return Array.isArray(a) && a.length ? `<ul class="tsk">${a.slice(0, 20).map(t => `<li>${esc(String(t))}</li>`).join("")}</ul>` : ""; };
/* images: built-in files (assets/work/...) or an admin upload in the public "media" bucket of our own Supabase project. Anything else is ignored. */
const MEDIA_RE = /^https:\/\/[a-z0-9]{8,30}\.supabase\.co\/storage\/v1\/object\/public\/media\/[\w./-]{1,200}$/;
const okMedia = u => typeof u === "string" && MEDIA_RE.test(u) && u.indexOf("..") < 0;
const gsrc = (g, t) => (g && okMedia(g.src)) ? ((t && okMedia(g.thumb)) ? g.thumb : g.src) : "assets/work/" + (g ? g.id : "") + (t ? "-t" : "") + ".webp";
const pcover = p => (p && okMedia(p.img)) ? `;background-image:url('${p.img}');background-size:cover;background-position:center` : "";
const PAGE = document.body.dataset.page || "home";
const R = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SAFE_URL = u => /^https:\/\//i.test(u || "") ? u : "";

/* ---------- preferences ---------- */
let lang = /^(fa|ps|prs)/i.test(navigator.language || "") ? "fa" : "en", PS = false; /* PS = Pashto text on top of the Persian-script layout (rtl) */
const cn = navigator.connection || {};
let lite = still || cn.saveData === true || /^(slow-2g|2g|3g)$/.test(cn.effectiveType || "") || (navigator.deviceMemory && navigator.deviceMemory <= 2);
try {
  const l = localStorage.getItem("am-lang"); if (l === "en" || l === "fa") lang = l;
  if (lang === "fa" && localStorage.getItem("am-ps") === "1") PS = true;
  const th = localStorage.getItem("am-mode"); R.dataset.theme = (th === "light" || th === "dark") ? th : "light";
  const s = localStorage.getItem("am-lite"); if (s === "1") lite = true; if (s === "0" && !still) lite = false;
} catch (e) {}
R.classList.toggle("lite", !!lite);
let _psUi = null;
const T = () => { if (PS && S.ui.ps) return _psUi || (_psUi = Object.assign({}, S.ui.fa, S.ui.ps)); return S.ui[lang]; };
const tx = o => (o && ((PS && o.ps) || o[lang] || o.en)) || "";
const LV = v => (v && typeof v === "object") ? tx(v) : (v || "");
const curGrade = () => R.dataset.theme === "light" ? "light" : "dark";
let DOCK = [], CLOSE_ALL = () => {};
const pill = sample => sample ? `<span class="pill">${esc(T().sample)}</span>` : "";
const fmt = f => { const p = n => String(n).padStart(2, "0"); return `${p(Math.floor(f / 86400) % 100)}:${p(Math.floor(f / 1440) % 60)}:${p(Math.floor(f / 24) % 60)}:${p(f % 24)}`; };

/* ---------- Kabul time sets the light of the page ---------- */
function kabul() {
  const k = new Date(Date.now() + 16200000), h = k.getUTCHours(), m = k.getUTCMinutes();
  const ph = h >= 5 && h < 8 ? "dawn" : h >= 8 && h < 16 ? "day" : h >= 16 && h < 19 ? "golden" : "night";
  R.dataset.phase = ph;
  const el = $("#kab"); if (!el) return;
  let txt = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  if (lang === "fa") txt = txt.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  el.textContent = T().kab + " " + txt + " · " + T().phase[ph];
}

/* ---------- shared header and footer ---------- */
/* Standard icon set: 24px grid, 1.8 stroke, rounded. Generic line icons, not brand logos. */
const IC = {
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  youtube:'<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>',
  behance:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h4a2 2 0 010 3.5H7zm0 3.5h4.5a2 2 0 010 4H7z"/>',
  github:'<path d="M9 8l-4 4 4 4M15 8l4 4-4 4"/>',
  linkedin:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M3 13h18"/>',
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  tiktok:'<path d="M9 18V6l9-2v11"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="15" r="2.5"/>',
  x:'<path d="M5 5l14 14M19 5L5 19"/>',
  threads:'<circle cx="12" cy="12" r="3.5"/><path d="M15.5 12v1.2a2.3 2.3 0 004.5 0V12a8 8 0 10-3.2 6.4"/>',
  facebook:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.5"/><path d="M3 19a6 6 0 0112 0M15 14.5a4.5 4.5 0 016 4.5"/>',
  snapchat:'<path d="M5 17V10a7 7 0 0114 0v7l-2-1-2 2-3-2-3 2-2-2z"/><circle cx="9.5" cy="10" r=".6"/><circle cx="14.5" cy="10" r=".6"/>',
  telegram:'<path d="M21 4L3 11l6 2 2 6 3-4 4 3z"/>',
  pinterest:'<path d="M12 3a6 6 0 00-6 6c0 4 3 6 6 6s6-2 6-6a6 6 0 00-6-6zM12 15v6"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
  lock:'<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 018 0v3"/>',
  film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  edu:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
  exp:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M3 13h18"/>',
  skills:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
  award:'<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>',
  book:'<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5"/>',
  doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  grid:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
  home:'<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"/>',
  pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  spark:'<path d="M5 5h14v10H11l-4 4v-4H5z"/><path d="M9 9h6M9 12h4"/>',
  chev:'<path d="M6 9l6 6 6-6"/>',
  sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
  moon:'<path d="M20 14.2A8.2 8.2 0 019.8 4a8.2 8.2 0 1010.2 10.2z"/>',
  palette:'<path d="M12 3a9 9 0 100 18c1.4 0 2-.9 2-1.8 0-1.3-1-1.5-1-2.7 0-1 .8-1.5 1.8-1.5H17a4 4 0 004-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7" r=".8"/><circle cx="15" cy="7" r=".8"/>',
  bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  aperture:'<circle cx="12" cy="12" r="10"/><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>',
  link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1"/>'
};
const icon = (k, c) => `<svg class="ic ${c || ""}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${IC[k] || IC.link}</svg>`;

function buildChrome() {
  const home = PAGE === "home", pre = home ? "" : "index.html";
  const T_ = T();
  DOCK = [
    { id: "g1", ic: "user", k: "dGroup1", items: [["", "abT", "user", "about.html"], ["about", "nAbout", "user"], ["edu", "nEdu", "edu"], ["exp", "nExp", "exp"], ["skills", "nSkills", "skills"], ["lang", "nLang", "globe"]] },
    { id: "g2", ic: "film", k: "dGroup2", items: [["work", "nWork", "grid"], ["design", "nDesign", "spark"], ["works", "nWorks", "grid", "works.html"], ["", "nPortfolio", "film", "portfolio.html"], ["", "nGfx", "spark", "graphics.html"], ["vids", "nVid", "play"]] },
    { id: "g3", ic: "award", k: "dGroup3", items: [["certs", "nCerts", "award"], ["", "nCertP", "award", "certificates.html"], ["courses", "nCourses", "book"], ["academy", "nAcademy", "edu", "academy.html"], ["library", "libPT", "book", "library.html"], ["blog", "nBlog", "doc", "blog.html"]] },
    { id: "g4", ic: "link", k: "dGroup4", items: [["links", "nLinks", "link"], ["cv", "cvT", "doc", "cv.html"], ["privacy", "privacy", "lock", "privacy.html"]] }
  ];
  const mItems = (g, pfx) => g.items.map(([id, k, ic, href]) => `<a role="menuitem" href="${href || pre + "#" + id}">${icon(ic)}<span data-k="${k}"></span></a>`).join("");
  const gBtn = g => `<div class="dkg hg"><button type="button" class="gt" data-m="hm-${g.id}" aria-expanded="false" aria-haspopup="menu" aria-controls="hm-${g.id}">${icon(g.ic)}<span data-k="${g.k}"></span>${icon("chev", "chv")}</button><div class="dkm hm" id="hm-${g.id}" hidden role="menu">${mItems(g)}</div></div>`;
  const sel = (id, ic) => `<div class="dkg"><button type="button" class="gt" id="${id}Btn" data-m="${id}M" aria-expanded="false" aria-haspopup="menu" aria-controls="${id}M">${icon(ic)}<span id="${id}V"></span>${icon("chev", "chv")}</button><div class="dkm hm hs" id="${id}M" hidden role="menu"></div></div>`;
  $("#site-header").innerHTML = `<div class="wrap bar">
    <a class="logo hl-mark" href="${home ? "#top" : "index.html"}" id="logo" aria-label="CineCode Academy"><img class="lg lg-l" src="assets/img/logo-full.png" width="184" height="47" alt="CineCode Academy"><img class="lg lg-d" src="assets/img/logo-full-light.png" width="184" height="47" alt="" aria-hidden="true" loading="lazy"></a>
    <nav class="hnav" aria-label="${lang === "fa" ? "منوی اصلی" : "Main menu"}">${(() => {
      const cur = (id) => (PAGE === id ? ' aria-current="page"' : "");
      const dd = (id, k, items) => `<div class="dkg hg nvg"><button type="button" class="gt nv" data-m="hm-${id}" aria-expanded="false" aria-haspopup="menu" aria-controls="hm-${id}"><span data-k="${k}"></span>${icon("chev", "chv")}</button><div class="dkm hm" id="hm-${id}" hidden role="menu">${items.map(([h, kk, ic]) => `<a role="menuitem" href="${h}">${icon(ic)}<span data-k="${kk}"></span></a>`).join("")}</div></div>`;
      return `<a href="index.html"${cur("home")} data-k="nHome"></a>` +
        dd("ac", "nAcad", [["academy.html", "nAcademy", "edu"], ["library.html", "libPT", "book"], ["certificates.html", "nCertP", "award"], ["verify.html", "nCerts", "award"], ["faq.html", "nFaq", "doc"]]) +
        `<a href="academy.html#courses" data-k="nCourses"></a>` +
        dd("st", "nWorks", [["portfolio.html", "nPortfolio", "film"], ["works.html", "nWorks", "grid"], ["graphics.html", "nGfx", "spark"], ["reels.html", "nReels", "play"], ["services.html", "nServices", "film"], ["lab.html", "dLab", "spark"]]) +
        `<a href="about.html"${cur("about")} data-k="nAbout"></a><a href="contact.html"${cur("contact")} data-k="nContact"></a>`;
    })()}</nav><div class="gtabs" id="gtabs">${DOCK.map(gBtn).join("")}</div>
    <div class="tools">
      <a class="gt loginl" href="auth.html" id="loginl"></a><a class="gt signin" href="auth.html#register" id="signin"></a>
      ${sel("lang", "globe")}<button type="button" class="gt mode" id="modeBtn" aria-pressed="false"><span class="mi" aria-hidden="true"></span></button>
      <button type="button" class="gt" id="srchBtn" aria-haspopup="dialog">${icon("search")}<span id="srchV"></span></button>
      <button type="button" class="gt" id="liteBtn" aria-pressed="false">${icon("bolt")}<span id="liteV"></span></button>
    </div></div>`;
  /* dock: grouped navigation, fixed at the bottom of every page */
  const menu = g => `<div class="dkm" id="m-${g.id}" hidden role="menu">${g.items.map(([id, k, ic, href]) => `<a role="menuitem" href="${href || pre + "#" + id}" data-s="${href ? "" : id}">${icon(ic)}<span data-k="${k}"></span></a>`).join("")}</div>`;
  const dk = document.createElement("div"); dk.className = "dock"; dk.id = "dock"; dk.setAttribute("role", "navigation"); dk.setAttribute("aria-label", "Sections");
  dk.innerHTML = `<a class="dk-logo dk-av" href="${home ? "#top" : "index.html"}" id="dklogo"><img src="assets/img/me-sq.webp" width="48" height="48" alt=""></a>
    <div class="dk-in">${DOCK.map(g => `<div class="dkg"><button type="button" class="dkb" data-g="${g.id}" aria-expanded="false" aria-controls="m-${g.id}">${icon(g.ic)}<span data-k="${g.k}"></span></button>${menu(g)}</div>`).join("")}</div>
    <a class="dk-cta" href="${pre}#contact">${icon("mail")}<span data-k="nContact"></span></a>`;
  document.body.appendChild(dk);
  try { const sg = SB.get(); if (sg) { const dl = $("#dklogo"), nm = String(sg.name || sg.email || "?").trim(); dl.href = "account.html"; dl.innerHTML = `<span class="dk-ini">${esc(nm.charAt(0).toUpperCase())}</span>`; dl.setAttribute("aria-label", nm); } } catch (e) {}
  const closeAll = () => { $$(".dkm").forEach(m => m.hidden = true); $$(".dkb,.gt[data-m]").forEach(b => b.setAttribute("aria-expanded", "false")); };
  CLOSE_ALL = closeAll;
  $$(".gt[data-m]").forEach(b => b.onclick = e => { e.stopPropagation(); const m = document.getElementById(b.dataset.m), open = m.hidden; closeAll(); if (open) { m.hidden = false; b.setAttribute("aria-expanded", "true"); const f = $("a,button", m); if (f) f.focus(); } });
  $$(".dkb", dk).forEach(b => b.onclick = e => { e.stopPropagation(); const m = $("#m-" + b.dataset.g), open = m.hidden; closeAll(); if (open) { m.hidden = false; b.setAttribute("aria-expanded", "true"); const f = $("a", m); if (f) f.focus(); } });
  document.addEventListener("click", e => { if (!e.target.closest(".dkg")) closeAll(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
  $$(".dkm a").forEach(x => x.addEventListener("click", closeAll));
  if (home && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { const g = DOCK.find(g => g.items.some(i => i[0] === en.target.id)); $$(".dkb", dk).forEach(b => b.classList.toggle("on", !!g && b.dataset.g === g.id)); } }), { rootMargin: "-35% 0px -55% 0px" });
    DOCK.forEach(g => g.items.forEach(i => { const e = document.getElementById(i[0]); if (e) io.observe(e); }));
  }
  /* footer: columns, dotted rule, legal row and social row */
  const FC = [
    { k: "dGroup1", ic: "user", items: [["", "abT", "user", "about.html"], ["about", "nAbout", "user"], ["edu", "nEdu", "edu"], ["exp", "nExp", "exp"], ["skills", "nSkills", "skills"]] },
    { k: "dGroup2", ic: "film", items: [["work", "nWork", "grid"], ["design", "nDesign", "spark"], ["", "nWorks", "grid", "works.html"], ["vids", "nVid", "play"]] },
    { k: "dGroup3", ic: "award", items: [["certs", "nCerts", "award"], ["", "nCertP", "award", "certificates.html"], ["courses", "nCourses", "book"], ["", "nAcademy", "edu", "academy.html"], ["", "libPT", "book", "library.html"], ["", "nBlog", "doc", "blog.html"]] },
    { k: "dGroup4", ic: "link", items: [["links", "nLinks", "link"], ["contact", "nContact", "mail"], ["", "cvT", "doc", "cv.html"], ["", "signIn", "lock", "auth.html"]] }
  ];
  const col = c => `<div class="fcol"><h2><span class="fti">${icon(c.ic)}</span><span data-k="${c.k}"></span></h2><ul>${c.items.map(([id, nk, ic, href]) => `<li><a href="${href || pre + "#" + id}">${icon(ic)}<span data-k="${nk}"></span></a></li>`).join("")}</ul></div>`;
  const QL = [["", "fHome", "home", "index.html"], ["", "abT", "user", "about.html"], ["", "nAcademy", "edu", "academy.html"], ["", "libPT", "book", "library.html"], ["", "nBlog", "doc", "blog.html"], ["", "nWorks", "grid", "works.html"], ["", "fVer", "award", "verify.html"], ["", "privacy", "lock", "privacy.html"]];
  const lk = (href, nk) => `<li><a href="${href}"><span data-k="${nk}"></span></a></li>`;
  const ACA = [["academy.html", "nAcademy"], ["academy.html#courses", "nCourses"], ["library.html", "libPT"], ["certificates.html", "nCertP"], ["verify.html", "fVer"], ["faq.html", "nFaq"], ["events.html", "nEvents"], ["auth.html", "signIn"]];
  const ABT = [["about.html", "abT"], ["portfolio.html", "nPortfolio"], ["blog.html", "nBlog"], ["works.html", "nWorks"], ["graphics.html", "nGfx"], ["reels.html", "nReels"], ["services.html", "nServices"], ["lab.html", "dLab"], ["cv.html", "cvT"], ["presskit.html", "press"]];
  const FCTA = PS ? ["پروژه‌ای ستاسو په ذهن کې ده؟", "خپله مفکوره ولیکئ؛ ځواب به ترلاسه کړئ.", "پیغام واستوئ"] : lang === "fa" ? ["پروژه‌ای در ذهن داری؟", "ایده‌ات را بنویس؛ جواب می‌گیری.", "فرستادن پیام"] : ["Got a project in mind?", "Write your idea and get a reply.", "Send a message"];
  $("#site-footer").innerHTML = `<div class="wrap fx"><div class="ft-grid">
    <div class="ft-brand" id="ftBrand"><a class="ft-logo" href="index.html" aria-label="CineCode Academy"><img class="lg lg-l" src="assets/img/logo-full.png" width="184" height="47" alt="CineCode Academy" loading="lazy"><img class="lg lg-d" src="assets/img/logo-full-light.png" width="184" height="47" alt="" aria-hidden="true" loading="lazy"></a><p data-k="hsite"></p></div>
    <div class="ft-c ft-aca"><h2 data-k="nAcademy"></h2><ul>${ACA.map(([h, k]) => lk(h, k)).join("")}</ul></div>
    <div class="ft-c ft-exp"><h2 data-k="ftExplore"></h2><ul>${ABT.map(([h, k]) => lk(h, k)).join("")}</ul></div>
    <div class="ft-c ft-con"><h2 data-k="fGT"></h2><ul><li><a href="mailto:${esc(S.contactEmail)}" dir="ltr">${icon("mail")}<span>${esc(S.contactEmail)}</span></a></li>${(S.phones || []).slice(0, 1).map(ph => `<li class="ft-ph"><a href="tel:${esc(ph.n)}" dir="ltr">${icon("phone")}<span>${esc(ph.show)}</span></a>${ph.wa ? `<a class="ft-ch" href="https://wa.me/${esc(ph.n.replace(/\D/g, ""))}" target="_blank" rel="noopener noreferrer" aria-label="${lang === "fa" ? "واتساپ" : "WhatsApp"}">${icon("chat")}${lang === "fa" ? "واتساپ" : "WhatsApp"}</a>` : ""}${ph.tg ? `<a class="ft-ch" href="https://t.me/${esc(ph.n)}" target="_blank" rel="noopener noreferrer" aria-label="${lang === "fa" ? "تلگرام" : "Telegram"}">${icon("telegram")}${lang === "fa" ? "تلگرام" : "Telegram"}</a>` : ""}</li>`).join("")}<li><span class="ft-t">${icon("pin")}<span data-k="fLoc"></span></span></li><li><a class="btn go ft-btn" href="contact.html">${icon("mail")}<span data-k="fSend"></span></a></li></ul></div>
    <nav class="ft-more" aria-label="${lang === "fa" ? "بخش‌های بیشتر" : "More pages"}">${[["blog.html", "nBlog"], ["notes.html", "ntT"], ["activity.html", "actT"], ["timeline.html", "tlT"], ["toolkit.html", "tkT"], ["directory.html", "dirT"], ["project.html", "projectsAll"], ["card.html", "dCard"], ["social.html", "nSocial"], ["resources.html", "nResources"]].map(([h, k]) => `<a href="${h}" data-k="${k}"></a>`).join("")}</nav>
    <div class="fsoc-row"><span class="fs" id="fsoc"></span></div></div>
    <div class="fbar"><div class="wrap fx fbar-in"><div class="fbar-l"><p class="fcopy" data-k="fCopy"></p><p class="fmis" data-k="fSlogan"></p></div><nav class="fbar-r" aria-label="Legal"><a href="privacy.html" data-k="privacy"></a><a href="terms.html">${lang === "fa" ? "شرایط استفاده" : "Terms of Service"}</a><a href="faq.html" data-k="nFaq"></a><a href="feedback.html" data-k="nFeedback"></a><a href="sitemap.xml">Sitemap</a></nav></div></div>`;
  try { /* custom pages from admin → footer "About" column */
    const pgs = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).pages, ul = $("#site-footer .ft-exp ul");
    const fl = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).footer_links, ul1 = $("#site-footer .ft-aca ul"), lg = localStorage.getItem("am-lang") === "en" ? "en" : "fa";
    if (Array.isArray(fl) && ul1) fl.slice(0, 8).forEach(x => { const u = x && x.u; if (!u || !/^(https:\/\/[^\s"'<>]+|[\w-]+\.html(#[\w-]*)?|#[\w-]+)$/i.test(u)) return; const li = document.createElement("li"), a = document.createElement("a"); a.href = u; if (/^https:/i.test(u)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } a.textContent = (x.t && (x.t[lg] || x.t.fa || x.t.en)) || u; li.appendChild(a); ul1.appendChild(li); });
    if (Array.isArray(pgs) && ul) pgs.filter(x => x && /^[a-z0-9-]{2,40}$/.test(x.slug || "") && !x.hide).slice(0, 8).forEach(x => { const li = document.createElement("li"), a = document.createElement("a"); a.href = "page.html#" + x.slug; a.textContent = (x.t && (x.t[(localStorage.getItem("am-lang") === "en" ? "en" : "fa")] || x.t.fa || x.t.en)) || x.slug; li.appendChild(a); ul.appendChild(li); });
  } catch (e) {}
  $("#liteBtn").onclick = () => { const on = !R.classList.contains("lite"); R.classList.toggle("lite", on); try { localStorage.setItem("am-lite", on ? "1" : "0"); } catch (e) {} if (!on && !still) startLoop(); renderAll(); };
}

function hasSamples() {
  return S.about.sample || S.projects.some(p => p.sample) || S.certs.some(c => c.sample) || S.press.shortBio.sample || S.press.longBio.sample;
}


/* map (loaded only after a click) and cookie notice */
function renderMap() {
  const m = $("#mapc"); if (!m || !S.mapArea) return; const T_ = T(), A = S.mapArea;
  const d = .02 * Math.pow(2, 13 - A.zoom), bbox = [A.lon - d * 1.6, A.lat - d, A.lon + d * 1.6, A.lat + d].map(n => n.toFixed(5)).join("%2C");
  const osm = `https://www.openstreetmap.org/?mlat=${A.lat}&mlon=${A.lon}#map=${A.zoom}/${A.lat}/${A.lon}`;
  const gm = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Chehelsotoon, Kabul, Afghanistan");
  /* drawn illustration: works everywhere, nothing is loaded from other sites */
  const svg = `<svg class="mapsvg" viewBox="0 0 640 300" role="img" aria-label="${esc(T_.mapArea)}" preserveAspectRatio="xMidYMid slice">
    <rect width="640" height="300" fill="#E6E6E6"/>
    <path d="M-10 210C90 190 170 250 270 230S430 160 650 200" fill="none" stroke="#C9D9E6" stroke-width="26" stroke-linecap="round"/>
    <g stroke="#FAFAFA" stroke-width="10" fill="none" stroke-linecap="round"><path d="M0 90H640M0 150H640M90 0V300M230 0V300M380 0V300M520 0V300"/><path d="M0 40L640 110M120 300L420 0" stroke-width="7"/></g>
    <g fill="#D6D6D6"><rect x="104" y="20" width="110" height="56" rx="8"/><rect x="244" y="20" width="120" height="56" rx="8"/><rect x="394" y="20" width="110" height="56" rx="8"/><rect x="104" y="104" width="110" height="34" rx="8"/><rect x="394" y="104" width="110" height="34" rx="8"/><rect x="534" y="160" width="90" height="50" rx="8"/><rect x="14" y="164" width="60" height="40" rx="8"/></g>
    <g fill="#BFD3C4"><rect x="246" y="104" width="120" height="34" rx="17"/></g>
    <circle cx="320" cy="121" r="26" fill="#161616" opacity=".12"/><circle cx="320" cy="121" r="14" fill="#161616"/><circle cx="320" cy="121" r="5" fill="#fff"/></svg>`;
  m.innerHTML = `<h3>${icon("pin")} ${esc(T_.mapT)}</h3><p class="muted">${esc(T_.mapArea)}</p>
    <div class="mapf" id="mapf">${svg}<span class="mapchip">${esc(T_.mapArea)}</span></div>
    <div class="mapa"><a class="btn go" href="${esc(osm)}" target="_blank" rel="noopener noreferrer">${icon("pin")} ${esc(T_.mapOpen)}</a><a class="btn" href="${esc(gm)}" target="_blank" rel="noopener noreferrer">${icon("link")} Google Maps</a><button type="button" class="btn" id="mapb">${esc(T_.mapShow)}</button></div>
    <p class="muted mapn">${esc(T_.mapNote)}</p>`;
  $("#mapb").onclick = () => { const f = $("#mapf"); f.innerHTML = `<iframe title="${esc(T_.mapT)}" loading="lazy" referrerpolicy="no-referrer" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik"></iframe>`; $("#mapb").hidden = true; };
}
function setupCookie() {
  let seen = false; try { seen = localStorage.getItem("am-ck") === "1"; } catch (e) {}
  if (seen || $("#ck")) return;
  const d = document.createElement("div"); d.className = "ck"; d.id = "ck"; d.setAttribute("role", "region");
  d.innerHTML = `<p id="ckt"></p><div><a href="privacy.html" id="ckm"></a><button type="button" class="btn go" id="cko"></button></div>`;
  document.body.appendChild(d);
  const paint = () => { const T_ = T(); d.setAttribute("aria-label", T_.ckMore); $("#ckt").textContent = T_.ckText; $("#ckm").textContent = T_.ckMore; $("#cko").textContent = T_.ckOk; };
  paint(); new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  $("#cko").onclick = () => { try { localStorage.setItem("am-ck", "1"); } catch (e) {} d.remove(); };
}

function applyChrome() {
  const T_ = T();
  R.lang = lang; R.dir = lang === "fa" ? "rtl" : "ltr"; R.dataset.ps = PS ? "1" : "0";
  $$("[data-k]").forEach(e => { e.textContent = T_[e.dataset.k] || ""; });
  $$(".dkb,.dk-cta").forEach(e => e.setAttribute("aria-label", e.textContent.trim()));
  const dl = $("#dklogo"); if (dl) dl.setAttribute("aria-label", tx(S.name));
  const fs = $("#fsoc"); if (fs) { fs.innerHTML = S.socials.filter(s => s.show && SAFE_URL(s.url)).map(s => `<a class="sob" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)}" title="${esc(s.label)}">${icon(s.label.toLowerCase())}</a>`).join(""); }
  const si = $("#signin"), li2 = $("#loginl"); if (si) { const sg = SB.get(), lab = sg ? T_.acctT : (T_.stStart || T_.signIn); si.href = sg ? "account.html" : "auth.html#register"; si.setAttribute("aria-label", lab); si.innerHTML = icon(sg ? "user" : "spark") + `<span>${esc(lab)}</span>`; if (li2) { li2.hidden = !!sg; li2.textContent = T_.signIn || ""; } }
  const lg = $("#logo"); lg.setAttribute("aria-label", tx(S.name));
  const LANGS = [["fa", "فارسی"], ["ps", "پښتو"], ["en", "English"]], curL = PS ? "ps" : lang;
  $("#langV").textContent = (LANGS.find(x => x[0] === curL) || LANGS[0])[1];
  $("#langM").innerHTML = LANGS.map(([k, n]) => `<button type="button" role="menuitemradio" aria-checked="${k === curL}" data-l="${k}">${k === curL ? icon("check") : '<i class="ic"></i>'}<span>${esc(n)}</span></button>`).join("");
  $$("#langM button").forEach(b => b.onclick = () => { const k = b.dataset.l; PS = k === "ps"; lang = PS ? "fa" : k; try { localStorage.setItem("am-lang", lang); localStorage.setItem("am-ps", PS ? "1" : "0"); } catch (e) {} R.dataset.ps = PS ? "1" : "0"; CLOSE_ALL(); renderAll(); });
  const isDk = curGrade() === "dark", mb = $("#modeBtn");
  mb.innerHTML = icon(isDk ? "moon" : "sun"); mb.setAttribute("aria-label", isDk ? T_.modeL : T_.modeD); mb.title = isDk ? T_.modeL : T_.modeD; mb.setAttribute("aria-pressed", isDk);
  mb.onclick = () => { const n = curGrade() === "dark" ? "light" : "dark"; R.dataset.theme = n; try { localStorage.setItem("am-mode", n); } catch (e) {} renderAll(); };
  const lb = $("#liteBtn"); $("#liteV").textContent = T_.lite; lb.classList.toggle("on", R.classList.contains("lite")); lb.setAttribute("aria-pressed", R.classList.contains("lite"));
  [["#langBtn", T_.lang], ["#liteBtn", T_.lite]].forEach(([s, t]) => { const e = $(s); if (e) e.setAttribute("aria-label", t + ": " + e.textContent.trim()); });
  const note = $("#note"); if (note) { note.textContent = T_.banner; note.hidden = !hasSamples(); }
  const skip = $("#skip"); if (skip) skip.textContent = T_.skip;
  kabul();
}

/* ---------- clipboard ---------- */
async function copyText(text, btn) {
  const T_ = T(); let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
    try { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove(); } catch (e2) {}
  }
  if (!btn) return ok;
  const old = btn.textContent; btn.textContent = ok ? T_.copied : T_.copyFail;
  setTimeout(() => { btn.textContent = old; }, 1800);
  return ok;
}

/* =====================================================================
   HOME
   ===================================================================== */
/* ---------- printable CV (built only from verified data in content.js) ---------- */
function renderCV() {
  const T_ = T(); document.title = T_.cvT + " | " + tx(S.name);
  const sk = [...(S.skills.video || []), ...(S.skills.design || [])].map(x => x[1]).concat(S.cvTools || []);
  const certs = (S.cvCerts || []).map(id => S.certs.find(c => c.id === id)).filter(Boolean);
  const links = (S.socials || []).filter(s => s.show && SAFE_URL(s.url)).slice(0, 5);
  const CT = ["modern", "classic", "compact"]; let ct = "modern"; try { const v = localStorage.getItem("am-cvt"), d = (JSON.parse(localStorage.getItem("am-design") || "{}") || {}).cv_tpl; ct = CT.includes(v) ? v : (CT.includes(d) ? d : "modern"); } catch (e) {}
  const CN = lang === "fa" ? { modern: "مدرن", classic: "کلاسیک", compact: "فشرده", st: "قالب رزومه" } : { modern: "Modern", classic: "Classic", compact: "Compact", st: "Résumé style" };
  const side = `<div class="cvx-s"><img src="assets/img/me-sq.webp" width="120" height="120" alt=""><h1>${esc(tx(S.name))}</h1><p class="cvr">${esc(tx(S.roles))}</p>
    <h2>${esc(lang === "fa" ? "تماس" : "Contact")}</h2><ul class="cvx-c"><li>${esc(tx(S.city))}</li><li><a href="mailto:${esc(S.contactEmail)}">${esc(S.contactEmail)}</a></li>${S.phone ? `<li dir="ltr">${esc(S.phone)}</li>` : ""}${links.map(l => `<li dir="ltr">${esc(l.url.replace(/^https?:\/\/(www\.)?/, ""))}</li>`).join("")}</ul>
    <h2>${esc(T_.cvSk)}</h2><ul class="cvx-chips">${sk.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2>${esc(T_.cvLg)}</h2><ul class="cvx-chips">${(S.languages || []).map(l => `<li>${esc(tx(l))}</li>`).join("")}</ul></div>`;
  const main = `<div class="cvx-m"><section class="cvx-b"><h2>${esc(T_.cvSum)}</h2><p>${esc(tx(S.about))}</p></section>
    <section class="cvx-b"><h2>${esc(T_.cvExp)}</h2><ol class="cvx-tl">${(S.experience || []).map(x => `<li><div class="cvt"><b>${esc(x.org)}</b><span>${esc(tx(x.when))}</span></div><p class="cvs">${esc(tx(x.role))}</p><p>${esc(tx(x.text))}</p>${taskList(x)}</li>`).join("")}</ol></section>
    <section class="cvx-b"><h2>${esc(T_.cvEdu)}</h2>${(S.education || []).map(e => `<div class="cvi2"><div class="cvt"><b>${esc(tx(e.school))}</b><span>${esc(tx(e.status))}</span></div><p class="cvs">${esc(tx(e.field))}</p></div>`).join("")}</section>
    ${certs.length ? `<section class="cvx-b"><h2>${esc(T_.cvCe)}</h2><ul class="cvl">${certs.map(c => `<li><b>${esc(LV(c.title))}</b> · ${esc(LV(c.issuer))}${c.year ? " · " + esc(c.year) : ""}</li>`).join("")}</ul><p class="cvn">${esc(T_.cvNote)}</p></section>` : ""}</div>`;
  $("#cv").innerHTML = `<div class="cv-bar"><a class="back" href="index.html">${lang === "fa" ? "→" : "←"} ${esc(T_.wkBack)}</a><div class="cvx-sw" role="group" aria-label="${esc(CN.st)}">${CT.map(k => `<button type="button" class="btn" data-ct="${k}" aria-pressed="${k === ct}">${esc(CN[k])}</button>`).join("")}</div><button type="button" class="btn go" id="cvPrint">${esc(T_.cvPrint)}</button></div>
  <article class="cvp cvx cvx-${ct}">${side}${main}</article>`;
  $$("[data-ct]", $("#cv")).forEach(b => b.onclick = () => { try { localStorage.setItem("am-cvt", b.dataset.ct); } catch (e) {} renderCV(); const n = $('[data-ct="' + b.dataset.ct + '"]'); if (n) n.focus(); });
  $("#cvPrint").onclick = () => window.print();
  { const pb = document.createElement("button"); pb.type = "button"; pb.className = $("#cvPrint").className; pb.id = "cvPdf"; pb.textContent = lang === "fa" ? "دانلود فایل PDF" : "Download PDF file"; $("#cvPrint").after(pb);
    pb.onclick = () => { const el = $("#cv .cvx"), lab = pb.textContent; if (!el) return; pb.disabled = true; pb.textContent = lang === "fa" ? "در حال ساخت PDF…" : "Building PDF…";
      const run = () => window.__pdf.fromElement(el, "CV-Ansarulhaq-Mubarez.pdf", { fit: false }).catch(() => alert(lang === "fa" ? "ساخت PDF نشد. از دکمهٔ چاپ استفاده کن." : "Could not build the PDF. Use Print.")).then(() => { pb.disabled = false; pb.textContent = lab; });
      if (window.__pdf) run(); else { const sc = document.createElement("script"); sc.src = "assets/js/pdf.js"; sc.onload = run; document.head.appendChild(sc); } }; }
}

/* ---------- academy landing page ---------- */
const AC = {
  fa: { home: "خانه", crumb: "آکادمی", lab: "یادگیری رایگان", h1: "آکادمی سینه‌کد", intro: "دوره‌های رایگان فیلم‌سازی، تدوین، طراحی و برنامه‌نویسی، با آزمون و گواهی گذراندن دوره. قدم به قدم، به زبان ساده.", c1: "ساخت حساب یادگیرنده", c2: "ورود", c3: "دیدن دوره‌ها", how: "چطور کار می‌کند", hs: [["حساب بساز", "با ایمیل ثبت‌نام کن. رایگان است."], ["ثبت‌نام و یادگیری", "درس‌ها را ببین و با تمرین جلو برو."], ["آزمون بده", "بعد از پایان درس‌ها، آزمون دوره را بده."], ["گواهی بگیر", "گواهی گذراندن دوره با کد و QR تأیید."]], st: ["دوره", "درس", "رایگان", "گواهی گذراندن دوره"], stv: "رایگان", sample: "نمونه", learn: "گام به گام یاد بگیر", lvl: "سطح", sub: "موضوع", all: "همه", free: "رایگان", view: "دیدن دوره", les: "درس", soon: "به‌زودی", note: "فعلاً این دوره‌ها نمونه‌اند. ثبت‌نام و آزمون بعد از اتصال حساب‌ها (Supabase) باز می‌شود.", cert: "گواهی این آکادمی «گواهی گذراندن دوره» است، نه مدرک دانشگاهی.", certb: "دیدن مدارک من", none: "دوره‌ای با این فیلتر نیست." },
  en: { home: "Home", crumb: "Academy", lab: "Free learning", h1: "CineCode Academy", intro: "Free courses in filmmaking, editing, graphic design and programming, with an exam and a course completion certificate. Step by step, in plain language.", c1: "Create a learner account", c2: "Sign in", c3: "Browse courses", how: "How it works", hs: [["Create an account", "Register with your email. It is free."], ["Enrol and learn", "Watch the lessons and practise as you go."], ["Take the exam", "When the lessons are done, take the course exam."], ["Get your certificate", "A course completion certificate with a verify code and QR."]], st: ["Courses", "Lessons", "Free", "Completion certificate"], stv: "Free", sample: "Sample", learn: "Learn step by step", lvl: "Level", sub: "Subject", all: "All", free: "Free", view: "View course", les: "lessons", soon: "Coming soon", note: "These courses are samples for now. Enrolment and exams open once accounts (Supabase) are connected.", cert: "This academy's certificate is a course completion certificate, not a university degree.", certb: "See my credentials", none: "No course matches this filter." }
};
const AC2 = {
  fa: { q: "جستجوی دوره", sort: "مرتب‌سازی", s0: "پیش‌فرض", s1: "نام (الف تا ی)", s2: "بیشترین درس", cnt: "دوره پیدا شد", libT: "کتابخانه منابع", libH: "منابع آموزشی رایگان، یک‌جا", libP: "پیوند به منابع آموزشی خوب درباره فیلم، طراحی و برنامه‌نویسی. همه پیوندها به سایت‌های بیرونی می‌روند و مال من نیستند؛ شرایط، قیمت و گواهی هر سایت را خودت همان‌جا بخوان. من آن‌ها را باز نکرده‌ام، پس اگر پیوندی کار نکرد به من بگو.", libB: "باز کردن کتابخانه", tchT: "با ما تدریس کن", tchH: "مدرس یا همکار شو", tchP: "اگر در فیلم‌سازی، طراحی یا برنامه‌نویسی تجربه داری و می‌خواهی درسی رایگان بگذاری، ایمیل بزن.", tchB: "ارسال ایمیل", soon: "به‌زودی", stvN: "از پایگاه داده بعد از اتصال سرور" },
  en: { q: "Search courses", sort: "Sort", s0: "Default", s1: "Name (A to Z)", s2: "Most lessons", cnt: "courses found", libT: "Study library", libH: "Free learning resources, in one place", libP: "Links to good learning resources on film, design and programming. All links go to outside sites and are not mine; read each site's terms, prices and certificates there. I could not open them while building, so tell me if a link is broken.", libB: "Open the library", tchT: "Teach with us", tchH: "Become an instructor or collaborator", tchP: "If you have experience in filmmaking, design or programming and want to offer a free lesson, send an email.", tchB: "Send an email", soon: "Soon", stvN: "From the database once the server is connected" }
};
let acLvl = "all", acSub = "all", acQ = "", acSort = "0";
function renderAbout() {
  const T_ = T(); document.title = T_.abT + " | " + tx(S.name);
  $("#about").innerHTML = `<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(T_.nHome)}</a> / <span aria-current="page">${esc(T_.abT)}</span></nav>
  <section class="ac-hero"><div class="ac-t"><span class="lbl">${esc(tx(S.roles))}</span><h1 class="ph1">${esc(tx(S.name))}</h1><p>${esc(tx(S.about))}${S.about.sample ? " " + pill(true) : ""}</p>
    <div class="ac-cta"><a class="btn go" href="index.html#contact">${esc(T_.abCta)}</a><a class="btn" href="works.html">${esc(T_.abWk)}</a></div></div>
    <div class="ac-ph" aria-hidden="true"><span class="ac-ring"></span><span class="ac-dot"></span><div class="ac-arch"><img src="assets/img/me.webp" alt="" width="954" height="959"></div></div></section>
  <section class="ac-sec"><h2>${esc(T_.nEdu)}</h2><div class="ac-grid">${(S.education || []).map(e => `<article class="ac-card"><h3>${esc(tx(e.school))}</h3><p>${esc(tx(e.field))}</p><span class="lbl">${esc(tx(e.status))}</span></article>`).join("")}</div></section>
  <section class="ac-sec"><h2>${esc(T_.nExp)}</h2><ol class="tlv">${(S.experience || []).map(x => `<li><span class="lbl">${esc(tx(x.when))}</span><h3>${esc(x.org)}</h3><p class="rl">${esc(tx(x.role))}</p><p>${esc(tx(x.text))}</p>${taskList(x)}</li>`).join("")}</ol></section>
  <section class="ac-sec"><h2>${esc(T_.abLg)}</h2><ul class="chips">${(S.languages || []).map(l => `<li>${esc(tx(l))}</li>`).join("")}</ul></section>`;
}
function renderServices() {
  const T_ = T(); document.title = T_.svT + " | " + tx(S.name);
  const sv = [["sv1", "play"], ["sv2", "spark"], ["sv3", "film"]], sp = ["sp1", "sp2", "sp3", "sp4"];
  $("#services").innerHTML = `<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(T_.nHome)}</a> / <span aria-current="page">${esc(T_.svT)}</span></nav>
  <h1 class="ph1">${esc(T_.svT)}</h1><p class="muted">${esc(T_.svP)}</p>
  <div class="ac-grid">${sv.map(([k, ic]) => `<article class="ac-card"><span class="wkt-ic" aria-hidden="true">${icon(ic)}</span><h2 class="ac-h">${esc(T_[k])}</h2><p>${esc(T_[k + "D"])}</p></article>`).join("")}</div>
  <section class="ac-sec"><h2>${esc(T_.svH)}</h2><ol class="ac-how">${sp.map((k, i) => `<li><span class="ac-n">${i + 1}</span><h3>${esc(T_[k])}</h3><p>${esc(T_[k + "D"])}</p></li>`).join("")}</ol></section>
  <section class="ac-promo"><div><h2>${esc(T_.svCta)}</h2></div><a class="btn go" href="index.html#contact">${esc(T_.abCta)}</a></section>`;
}
/* ---------- items model + directory engine: one list for works, credentials and learning ---------- */
function buildItems() {
  const T_ = T(), it = [], GN = { poster: "gpost", academy: "gacad", banner: "gban", brand: "gbra", print: "gprn" };
  (S.gallery || []).forEach((g, i) => it.push({ id: g.id, layer: "projects", type: "graphic", status: "real", title: (T_.cats[GN[g.cat]] || g.cat) + " " + (i + 1), meta: "", year: null, thumb: gsrc(g, true), href: gsrc(g) }));
  (S.projects || []).forEach((p, i) => it.push({ id: p.id, layer: "projects", type: "project", status: p.sample ? "sample" : "real", title: p.title ? tx(p.title) : `${T_.projectTitle} ${i + 1}`, meta: T_.cats[p.cat] || "", year: p.year || null, href: `project.html#${p.id}` }));
  (S.certs || []).forEach(c => it.push({ id: c.id, layer: "credentials", type: "certificate", status: c.sample ? "sample" : "real", title: LV(c.title), meta: LV(c.issuer), year: c.year || null, thumb: c.img ? `assets/certs/${c.id}-t.webp` : "", href: SAFE_URL(c.verifyUrl) ? c.verifyUrl : (c.img ? `assets/certs/${c.id}.webp` : ""), ext: !!SAFE_URL(c.verifyUrl) }));
  (S.education || []).forEach(e => it.push({ id: e.id, layer: "credentials", type: "education", status: "real", title: tx(e.school), meta: tx(e.field) + ", " + tx(e.status), year: null, href: "index.html#edu" }));
  (S.experience || []).forEach(x => it.push({ id: x.id, layer: "credentials", type: "position", status: "real", title: x.org, meta: tx(x.role) + ", " + tx(x.when), year: null, href: "index.html#exp" }));
  (S.courses || []).forEach(c => it.push({ id: c.id, layer: "knowledge", type: "course", status: c.sample ? "sample" : "real", title: tx(c.title), meta: tx(c.cat), year: null, href: `course.html#${c.id}` }));
  (S.library || []).forEach(r => it.push({ id: r.id, layer: "knowledge", type: "resource", status: r.first ? "real" : "third", title: tx(r.title), meta: tx(r.cat), year: null, href: r.url, ext: true }));
  const ex = (arr, layer, ok) => (arr || []).filter(e => !ok || ok(e)).forEach(e => it.push({ id: e.id, layer, type: e.type, status: e.status || "real", title: LV(e.title), meta: LV(e.text || e.meta || ""), year: e.date ? +String(e.date).slice(0, 4) : (e.year || null), date: e.date || "", href: SAFE_URL(e.url) ? e.url : "", ext: !!SAFE_URL(e.url), hours: +e.hours || 0 }));
  ex(S.activity, "activity"); ex(S.notes, "knowledge");
  ex((S.milestones || []).map(m => ({ ...m, type: "milestone" })), "credentials");
  ex((S.testimonials || []).map(m => ({ ...m, type: "testimonial" })), "credentials", e => e.consent === true);
  return it;
}
let dirL = "all", dirT = "all", dirY = "all", dirQ = "", dirS = false, dirN = 24;
function renderDirectory() {
  const T_ = T(), all = buildItems(); document.title = T_.dirT + " | " + tx(S.name);
  const layers = ["projects", "credentials", "knowledge", "activity"];
  const real = all.filter(i => i.status === "real"), cnt = l => real.filter(i => i.layer === l).length;
  const pool = all.filter(i => dirS || i.status !== "sample");
  const types = ["all", ...new Set(pool.filter(i => dirL === "all" || i.layer === dirL).map(i => i.type))];
  const years = ["all", ...[...new Set(pool.map(i => i.year).filter(Boolean))].sort((a, b) => b - a)];
  const chip = (arr, cur, key, lab) => arr.map(v => `<button type="button" class="${String(v) === String(cur) ? "on" : ""}" data-${key}="${esc(v)}" aria-pressed="${String(v) === String(cur)}">${esc(lab(v))}</button>`).join("");
  $("#directory").innerHTML = `<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(T_.nHome)}</a> / <span aria-current="page">${esc(T_.dirT)}</span></nav>
  <h1 class="ph1">${esc(T_.dirT)}</h1><p class="muted">${esc(T_.dirP)}</p>
  <section class="ac-stats" aria-label="${esc(T_.dirReal)}"><div><b>${real.length}</b><span>${esc(T_.dirReal)}</span></div>${layers.map(l => `<div><b>${cnt(l)}</b><span>${esc(T_["ly_" + l])}</span></div>`).join("")}</section>
  <div class="ac-tools"><label class="ac-q"><span class="lbl">${esc(T_.dirQ)}</span><input type="search" id="dQ" value="${esc(dirQ)}" autocomplete="off"></label>
  <label class="check"><input type="checkbox" id="dS"${dirS ? " checked" : ""}><span>${esc(T_.dirSam)}</span></label></div>
  <div class="ac-f"><div class="wf" id="dLs">${chip(["all", ...layers], dirL, "l", v => v === "all" ? T_.dirAllL : T_["ly_" + v])}</div></div>
  <div class="ac-f"><div class="wf" id="dTs">${chip(types, dirT, "t", v => v === "all" ? T_.dirAllT : T_["ty_" + v] || v)}</div></div>
  ${years.length > 1 ? `<div class="ac-f"><div class="wf" id="dYs">${chip(years, dirY, "y", v => v === "all" ? T_.dirAllY : v)}</div></div>` : ""}
  <p class="muted" id="dCnt" role="status" aria-live="polite"></p><div class="dgrid" id="dGrid"></div><p class="gmore"><button type="button" class="btn go" id="dMore"></button></p>`;
  const grid = () => {
    const nq = NORM(dirQ), list = pool.filter(i => (dirL === "all" || i.layer === dirL) && (dirT === "all" || i.type === dirT) && (dirY === "all" || String(i.year) === String(dirY)) && (!nq || NORM(i.title + " " + i.meta).includes(nq)));
    $("#dCnt").textContent = list.length + " / " + pool.length;
    $("#dGrid").innerHTML = list.slice(0, dirN).map(i => { const tag = i.status === "sample" ? T_.st_sample : i.status === "third" ? T_.st_third : "";
      const body = `${i.thumb ? `<img src="${esc(i.thumb)}" alt="" loading="lazy" decoding="async" width="420" height="300">` : `<span class="dic" aria-hidden="true">${icon(i.layer === "credentials" ? "award" : i.layer === "knowledge" ? "book" : "grid")}</span>`}<span class="dtx"><span class="lbl">${esc(T_["ty_" + i.type] || i.type)}${i.year ? " · " + esc(i.year) : ""}${tag ? " · " + esc(tag) : ""}</span><b>${esc(i.title)}</b><span class="muted">${esc(i.meta)}</span></span>`;
      return i.href ? `<a class="dcard" href="${esc(i.href)}"${i.ext || /^assets\//.test(i.href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${body}</a>` : `<div class="dcard">${body}</div>`; }).join("") || `<p class="muted">${esc(T_.dirNone)}</p>`;
    const m = $("#dMore"); m.hidden = list.length <= dirN; m.textContent = T_.dirMore + " (" + Math.max(0, list.length - dirN) + ")";
  };
  grid(); $("#dQ").oninput = e => { dirQ = e.target.value; dirN = 24; grid(); };
  $("#dMore").onclick = () => { dirN += 24; grid(); };
  $("#dS").onchange = e => { dirS = e.target.checked; dirN = 24; renderDirectory(); };
  $$("#dLs button").forEach(b => b.onclick = () => { dirL = b.dataset.l; dirT = "all"; dirN = 24; renderDirectory(); });
  $$("#dTs button").forEach(b => b.onclick = () => { dirT = b.dataset.t; dirN = 24; renderDirectory(); });
  $$("#dYs button").forEach(b => b.onclick = () => { dirY = b.dataset.y; dirN = 24; renderDirectory(); });
}
function statsEngine(it) {
  const real = it.filter(i => i.status === "real");
  return [["sx_work", real.filter(i => i.layer === "projects").length], ["sx_cert", real.filter(i => i.type === "certificate").length], ["sx_act", real.filter(i => i.layer === "activity").length], ["sx_hours", real.filter(i => i.type === "mentoring").reduce((n, i) => n + (i.hours || 0), 0)], ["sx_notes", real.filter(i => i.type === "til" || i.type === "article" || i.type === "checklist" || i.type === "bookshelf" || i.type === "translation" || i.type === "newsletter").length], ["sx_ms", real.filter(i => i.type === "milestone").length]];
}
const statsHTML = (T_, it) => `<section class="ac-stats">${statsEngine(it).filter(([k, n]) => n > 0).map(([k, n]) => `<div><b>${n}</b><span>${esc(T_[k])}</span></div>`).join("")}</section>`;
const crumbHTML = (T_, t) => `<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(T_.nHome)}</a> / <span aria-current="page">${esc(t)}</span></nav>`;
function itemLink(i) { const body = `<span class="lbl">${esc(i.date || (i.year ? i.year : ""))}${i.date || i.year ? " · " : ""}${esc(i.type)}</span><b>${esc(i.title)}</b><span class="muted">${esc(i.meta)}</span>`; return body; }
function renderTimeline() {
  const T_ = T(), all = buildItems().filter(i => i.status === "real"); document.title = T_.tlT + " | " + tx(S.name);
  const dated = all.filter(i => i.year).sort((a, b) => (b.date || b.year + "").localeCompare(a.date || a.year + "")), und = all.length - dated.length;
  const years = [...new Set(dated.map(i => i.year))];
  $("#timeline").innerHTML = crumbHTML(T_, T_.tlT) + `<h1 class="ph1">${esc(T_.tlT)}</h1><p class="muted">${esc(T_.tlP)}</p>` + statsHTML(T_, buildItems()) +
    (years.length ? years.map(y => `<section class="ac-sec"><h2>${esc(y)}</h2><ol class="tlv">${dated.filter(i => i.year === y).map(i => `<li><span class="lbl">${esc(T_["ty_" + i.type] || i.type)}${i.date ? " · " + esc(i.date) : ""}</span><h3>${i.href ? `<a href="${esc(i.href)}"${i.ext || /^assets\//.test(i.href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(i.title)}</a>` : esc(i.title)}</h3><p>${esc(i.meta)}</p></li>`).join("")}</ol></section>`).join("") : `<p class="muted">${esc(T_.tlNone)}</p>`) +
    `<p class="muted">${und} ${esc(T_.tlUnd)} <a href="directory.html">${esc(T_.dirT)}</a></p>`;
}
function renderLedger(kind) {
  const T_ = T(), cfg = kind === "notes" ? { t: T_.ntT, p: T_.ntP, n: T_.ntNone, types: ["til", "article", "checklist", "bookshelf", "translation", "newsletter"] } : { t: T_.actT, p: T_.actP, n: T_.actNone, types: ["event", "community", "opensource", "mentoring", "volunteering"] };
  document.title = cfg.t + " | " + tx(S.name);
  const all = buildItems().filter(i => i.status === "real" && cfg.types.includes(i.type)).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const f = kind === "notes" ? (window.__nf || "all") : (window.__af || "all");
  const list = all.filter(i => f === "all" || i.type === f);
  $("#" + kind).innerHTML = crumbHTML(T_, cfg.t) + `<h1 class="ph1">${esc(cfg.t)}</h1><p class="muted">${esc(cfg.p)}</p>` + (kind === "activity" ? statsHTML(T_, buildItems()) : "") +
    (all.length ? `<div class="ac-f"><div class="wf" id="lgf">${["all", ...cfg.types].map(v => `<button type="button" class="${v === f ? "on" : ""}" data-t="${v}" aria-pressed="${v === f}">${esc(v === "all" ? T_.dirAllT : T_["ty_" + v])}</button>`).join("")}</div></div><div class="dgrid">${list.map(i => `<${i.href ? "a" : "div"} class="dcard"${i.href ? ` href="${esc(i.href)}" target="_blank" rel="noopener noreferrer"` : ""}><span class="dtx"><span class="lbl">${esc(T_["ty_" + i.type] || i.type)}${i.date ? " · " + esc(i.date) : ""}</span><b>${esc(i.title)}</b><span class="muted">${esc(i.meta)}</span></span></${i.href ? "a" : "div"}>`).join("")}</div>` : `<p class="muted">${esc(cfg.n)}</p>`);
  $$("#lgf button").forEach(b => b.onclick = () => { if (kind === "notes") window.__nf = b.dataset.t; else window.__af = b.dataset.t; renderLedger(kind); });
}
function renderToolkit() {
  const T_ = T(); document.title = T_.tkT + " | " + tx(S.name);
  const tools = [...new Set([...(S.skills.video || []), ...(S.skills.design || []), ...(S.skills.cs || [])].map(s => s[1]).concat(S.cvTools || []))];
  $("#toolkit").innerHTML = crumbHTML(T_, T_.tkT) + `<h1 class="ph1">${esc(T_.tkT)}</h1><p class="muted">${esc(T_.tkP)}</p>
  <section class="ac-sec"><h2>${esc(T_.tkStats)}</h2>${statsHTML(T_, buildItems())}</section>
  <section class="ac-sec"><h2>${esc(T_.tkStack)}</h2><ul class="chips">${tools.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>
  <section class="ac-sec"><h2>${esc(T_.tkCv)}</h2><p class="muted">${esc(T_.tkCvD)}</p><a class="btn go" href="cv.html">${esc(T_.cvT)}</a></section>
  <section class="ac-sec"><h2>${esc(T_.tkBook)}</h2>${SAFE_URL(S.booking) ? `<a class="btn go" href="${esc(S.booking)}" target="_blank" rel="noopener noreferrer">${esc(T_.tkBookB)}</a>` : `<p class="muted">${esc(T_.tkBookD)}</p>`}</section>`;
}

/* ---------- student account: profile, enrolled courses with real progress, exam results, certificates ---------- */
/* ---------- student profile (Supabase profiles + private avatar) ---------- */
const PF_COUNTRIES = [["AF", "افغانستان", "Afghanistan", "93"], ["IR", "ایران", "Iran", "98"], ["PK", "پاکستان", "Pakistan", "92"], ["TJ", "تاجیکستان", "Tajikistan", "992"], ["UZ", "ازبکستان", "Uzbekistan", "998"], ["TM", "ترکمنستان", "Turkmenistan", "993"], ["IN", "هند", "India", "91"], ["TR", "ترکیه", "Türkiye", "90"], ["AE", "امارات", "UAE", "971"], ["SA", "عربستان", "Saudi Arabia", "966"], ["QA", "قطر", "Qatar", "974"], ["DE", "آلمان", "Germany", "49"], ["FR", "فرانسه", "France", "33"], ["GB", "بریتانیا", "United Kingdom", "44"], ["NL", "هلند", "Netherlands", "31"], ["SE", "سوئد", "Sweden", "46"], ["NO", "نروژ", "Norway", "47"], ["DK", "دانمارک", "Denmark", "45"], ["IT", "ایتالیا", "Italy", "39"], ["ES", "اسپانیا", "Spain", "34"], ["AT", "اتریش", "Austria", "43"], ["CH", "سوئیس", "Switzerland", "41"], ["BE", "بلژیک", "Belgium", "32"], ["US", "آمریکا", "United States", "1"], ["CA", "کانادا", "Canada", "1"], ["AU", "استرالیا", "Australia", "61"], ["NZ", "نیوزیلند", "New Zealand", "64"], ["JP", "ژاپن", "Japan", "81"], ["KR", "کره جنوبی", "South Korea", "82"], ["CN", "چین", "China", "86"], ["RU", "روسیه", "Russia", "7"], ["KZ", "قزاقستان", "Kazakhstan", "7"], ["OT", "کشور دیگر", "Other", "0"]];
const PF_EDU = [["primary", "ابتدایی", "Primary school"], ["secondary", "متوسطه", "Lower secondary"], ["highschool", "لیسه (دوازدهم)", "High school"], ["diploma", "دیپلم تخصصی", "Diploma"], ["bachelor", "لیسانس", "Bachelor"], ["master", "ماستر", "Master"], ["phd", "دکترا", "PhD"], ["other", "دیگر", "Other"]];
const PF = {
  fa: { t: "پروفایل من", sub: "این اطلاعات فقط برای خودت و مدیر آکادمی دیده می‌شود. برای ثبت‌نام در دوره‌ها باید پروفایل کامل باشد.", done: "تکمیل پروفایل", photo: "عکس پروفایل", photoH: "اختیاری. عکس واضح از صورت، حداکثر ۲ مگابایت. خودکار کوچک می‌شود.", pick: "انتخاب عکس", name: "نام و نام خانوادگی", nameH: "همان‌طور که روی گواهی چاپ می‌شود. فقط نام واقعی بنویس.", gender: "جنسیت", male: "مرد", female: "زن", pickOne: "انتخاب کن", gH: "برای آمار آکادمی و خطاب درست.", by: "سال تولد", byH: "فقط سال، مثلاً ۲۰۰۰. روز و ماه لازم نیست.", country: "کشور", cH: "کشوری که اکنون در آن زندگی می‌کنی.", phone: "شماره تماس", pH: "بدون صفر اول و بدون علامت، مثلاً ۷۰۰۱۲۳۴۵۶. کد کشور خودکار است.", edu: "سطح تحصیلی", eH: "بالاترین مدرکی که گرفته‌ای یا در حال تحصیلش هستی.", terms: "قوانین دوره و ", privacy: "حریم خصوصی", terms2: " را می‌پذیرم و می‌دانم گواهی فقط بعد از قبولی در آزمون صادر می‌شود.", save: "ذخیره پروفایل", saved: "پروفایل ذخیره شد.", failed: "ذخیره نشد. دوباره امتحان کن.", missing: "اطلاعات ناقص است:", noSql: "ستون‌های پروفایل هنوز در Supabase ساخته نشده‌اند (فایل profile-1.sql).", pw: "رمز عبور جدید", pwH: "حداقل ۸ کاراکتر. با کیبورد انگلیسی بنویس.", pwSave: "تغییر رمز", pwOk: "رمز عوض شد.", pwBad: "رمز تغییر نکرد.", resetT: "رمز جدید انتخاب کن", sec: "امنیت حساب", upErr: "آپلود عکس انجام نشد.", big: "عکس خیلی بزرگ است.", kind: "فقط عکس انتخاب کن." },
  en: { t: "My profile", sub: "Only you and the academy admin can see this. Your profile must be complete before you can enroll in courses.", done: "Profile complete", photo: "Profile photo", photoH: "Optional. A clear face photo, up to 2 MB. It is resized automatically.", pick: "Choose photo", name: "Full name", nameH: "Exactly as it should appear on your certificate. Use your real name.", gender: "Gender", male: "Male", female: "Female", pickOne: "Choose", gH: "Used for academy statistics and correct address.", by: "Year of birth", byH: "Year only, for example 2000. No day or month needed.", country: "Country", cH: "The country you live in now.", phone: "Phone number", pH: "No leading zero, no symbols, for example 700123456. The country code is added for you.", edu: "Education level", eH: "The highest level you finished or are studying for.", terms: "I accept the course rules and the ", privacy: "privacy policy", terms2: ", and I understand a certificate is only issued after passing the exam.", save: "Save profile", saved: "Profile saved.", failed: "Could not save. Try again.", missing: "Missing:", noSql: "The profile columns are not in Supabase yet (run profile-1.sql).", pw: "New password", pwH: "At least 8 characters. Type with the English keyboard.", pwSave: "Change password", pwOk: "Password changed.", pwBad: "Password was not changed.", resetT: "Choose a new password", sec: "Account security", upErr: "Photo upload failed.", big: "The photo is too large.", kind: "Please choose an image." }
};
const pfAvatar = async (path, img) => { try { const t = await SB.token(); const r = await fetch(SB.base() + "/storage/v1/object/authenticated/avatars/" + path, { headers: { apikey: S.supabaseAnonKey, Authorization: "Bearer " + t } }); if (r.ok) img.src = URL.createObjectURL(await r.blob()); } catch (e) {} };
function pfSection(prof, uid) {
  const P = PF[lang], pr = prof || {}, ctry = c => lang === "fa" ? c[1] : c[2];
  const need = [["full_name", P.name], ["gender", P.gender], ["birth_year", P.by], ["country", P.country], ["phone", P.phone], ["education", P.edu], ["terms_accepted_at", lang === "fa" ? "پذیرش قوانین" : "Accept the rules"]];
  const miss = need.filter(([k]) => !pr[k] || (k === "phone" && String(pr[k]).length < 6) || (k === "full_name" && String(pr[k]).trim().length < 3));
  const pct = Math.round((need.length - miss.length) * 100 / need.length);
  const years = []; for (let y = 2022; y >= 1930; y--) years.push(y);
  const cur = new Date().getFullYear(); void cur;
  const fld = (lbl, hint, inner, id) => `<label class="pfl" for="${id}"><span class="pfn">${esc(lbl)}</span>${inner}<small class="hint">${esc(hint)}</small></label>`;
  return `<section class="ac-sec pfs" id="profile"><h2>${esc(P.t)}</h2><p class="muted">${esc(P.sub)}</p>
    <div class="pfp" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(P.done)}"><i style="width:${pct}%"></i></div><p class="muted">${esc(P.done)}: ${pct}%${miss.length ? " · " + esc(P.missing) + " " + esc(miss.map(m => m[1]).join("، ")) : ""}</p>
    <form id="pff" novalidate class="pfg">
      <div class="pfav"><img id="pfimg" alt="" width="96" height="96" src="assets/img/avatar-empty.svg"><div><strong>${esc(P.photo)}</strong><small class="hint">${esc(P.photoH)}</small><input type="file" id="pffile" accept="image/jpeg,image/png,image/webp" hidden><button type="button" class="btn" id="pfpick">${esc(P.pick)}</button></div></div>
      ${fld(P.name, P.nameH, `<input id="pf_n" name="full_name" autocomplete="name" value="${esc(pr.full_name || "")}" required>`, "pf_n")}
      ${fld(P.gender, P.gH, `<select id="pf_g" name="gender"><option value="">${esc(P.pickOne)}</option><option value="male"${pr.gender === "male" ? " selected" : ""}>${esc(P.male)}</option><option value="female"${pr.gender === "female" ? " selected" : ""}>${esc(P.female)}</option></select>`, "pf_g")}
      ${fld(P.by, P.byH, `<select id="pf_b" name="birth_year"><option value="">${esc(P.pickOne)}</option>${years.map(y => `<option value="${y}"${pr.birth_year === y ? " selected" : ""}>${((n) => lang === "fa" ? String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]) : String(n))(y)} ${lang === "fa" ? "میلادی" : ""} (${lang === "fa" ? "" : "Solar Hijri "}${((n) => lang === "fa" ? String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]) : String(n))(y - 622)}–${((n) => lang === "fa" ? String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]) : String(n))(y - 621)}${lang === "fa" ? " شمسی" : ""})</option>`).join("")}</select>`, "pf_b")}
      ${fld(P.country, P.cH, `<select id="pf_c" name="country"><option value="">${esc(P.pickOne)}</option>${PF_COUNTRIES.map(c => `<option value="${c[0]}" data-cc="${c[3]}"${pr.country === c[0] ? " selected" : ""}>${esc(ctry(c))}</option>`).join("")}</select>`, "pf_c")}
      ${fld(P.phone, P.pH, `<span class="pfph"><b id="pfcc" dir="ltr">+${esc(pr.phone_cc || "")}</b><input id="pf_p" name="phone" inputmode="numeric" dir="ltr" maxlength="15" autocomplete="tel-national" value="${esc(pr.phone || "")}"></span>`, "pf_p")}
      ${fld(P.edu, P.eH, `<select id="pf_e" name="education"><option value="">${esc(P.pickOne)}</option>${PF_EDU.map(e => `<option value="${e[0]}"${pr.education === e[0] ? " selected" : ""}>${esc(lang === "fa" ? e[1] : e[2])}</option>`).join("")}</select>`, "pf_e")}
      <label class="chk"><input type="checkbox" id="pf_t"${pr.terms_accepted_at ? " checked" : ""}><span>${esc(P.terms)}<a href="privacy.html">${esc(P.privacy)}</a>${esc(P.terms2)}</span></label>
      <button class="btn go" type="submit">${esc(P.save)}</button><p class="fstatus" id="pfst" role="status" aria-live="polite"></p>
    </form>
    <h3 class="pfsec">${esc(P.sec)}</h3>
    <form id="pwf" novalidate class="pfg"><label class="pfl" for="pw_n"><span class="pfn">${esc(P.pw)}</span><span class="pw"><input id="pw_n" type="password" autocomplete="new-password" minlength="8" dir="ltr"><button type="button" class="pwb" id="pwb2" aria-label="${lang === "fa" ? "نمایش رمز" : "Show password"}">${icon("eye")}</button></span><small class="hint">${esc(P.pwH)}</small></label><button class="btn" type="submit">${esc(P.pwSave)}</button><p class="fstatus" id="pwst" role="status" aria-live="polite"></p></form></section>`;
}
function pfWire(root, uid, prof, again) {
  const P = PF[lang], f = $("#pff", root); if (!f) return;
  const say = (id, m, k) => { const e = $(id, root); e.textContent = m; e.className = "fstatus " + (k || ""); };
  const cc = () => { const o = $("#pf_c", root).selectedOptions[0]; $("#pfcc", root).textContent = o && o.dataset.cc && o.dataset.cc !== "0" ? "+" + o.dataset.cc : "+"; }; $("#pf_c", root).onchange = cc; cc();
  if (prof && prof.avatar_path) pfAvatar(prof.avatar_path, $("#pfimg", root));
  $("#pfpick", root).onclick = () => $("#pffile", root).click();
  $("#pffile", root).onchange = async e => { const file = e.target.files[0]; if (!file) return; if (!/^image\//.test(file.type)) return say("#pfst", P.kind, "err"); if (file.size > 2 * 1024 * 1024) return say("#pfst", P.big, "err");
    try { const bmp = await createImageBitmap(file), n = 320, c = document.createElement("canvas"); c.width = c.height = n; const m = Math.min(bmp.width, bmp.height); c.getContext("2d").drawImage(bmp, (bmp.width - m) / 2, (bmp.height - m) / 2, m, m, 0, 0, n, n);
      const blob = await new Promise(r => c.toBlob(r, "image/jpeg", .86)), t = await SB.token(), path = uid + "/avatar.jpg";
      const r = await fetch(SB.base() + "/storage/v1/object/avatars/" + path, { method: "POST", headers: { apikey: S.supabaseAnonKey, Authorization: "Bearer " + t, "Content-Type": "image/jpeg", "x-upsert": "true" }, body: blob }); if (!r.ok) throw new Error("up " + r.status);
      await SB.send("PATCH", `profiles?id=eq.${uid}`, { avatar_path: path }, "return=minimal"); $("#pfimg", root).src = URL.createObjectURL(blob); say("#pfst", P.saved, "ok"); } catch (x) { say("#pfst", P.upErr, "err"); } };
  f.addEventListener("submit", async e => { e.preventDefault(); const g = n => f.elements[n].value.trim();
    const body = { full_name: g("full_name"), gender: g("gender") || null, birth_year: g("birth_year") ? parseInt(g("birth_year"), 10) : null, country: g("country"), phone_cc: ($("#pf_c", root).selectedOptions[0] || {}).dataset ? ($("#pf_c", root).selectedOptions[0].dataset.cc || "").replace(/^0$/, "") : "", phone: g("phone").replace(/\D/g, "").replace(/^0+/, ""), education: g("education") || null, terms_accepted_at: $("#pf_t", root).checked ? (prof && prof.terms_accepted_at) || new Date().toISOString() : null };
    try { await SB.send("PATCH", `profiles?id=eq.${uid}`, body, "return=minimal"); say("#pfst", P.saved, "ok"); setTimeout(again, 700); } catch (x) { say("#pfst", P.failed + (x.status ? " (" + x.status + ")" : ""), "err"); } });
  const pb = $("#pwb2", root); if (pb) pb.onclick = () => { const i = $("#pw_n", root); i.type = i.type === "password" ? "text" : "password"; };
  $("#pwf", root).addEventListener("submit", async e => { e.preventDefault(); const v = $("#pw_n", root).value; if (v.length < 8) return say("#pwst", P.pwH, "err"); try { const t = await SB.token(); const r = await fetch(SB.base() + "/auth/v1/user", { method: "PUT", headers: { apikey: S.supabaseAnonKey, Authorization: "Bearer " + t, "Content-Type": "application/json" }, body: JSON.stringify({ password: v }) }); if (!r.ok) throw 0; $("#pw_n", root).value = ""; say("#pwst", P.pwOk, "ok"); } catch (x) { say("#pwst", P.pwBad, "err"); } });
}

/* ---------- public certificate check + printable certificate ---------- */
const VT = {
  fa: { t: "تأیید گواهی", h: "تأیید گواهی پایان دوره", p: "کد گواهی را وارد کن تا ببینی واقعی است یا نه. فقط نام، دوره، تاریخ و وضعیت نشان داده می‌شود.", code: "کد گواهی", go: "بررسی", valid: "معتبر", revoked: "باطل شده", none: "گواهی‌ای با این کد پیدا نشد.", err: "نشد. دوباره امتحان کن.",
    cert: "گواهی پایان دوره", given: "این گواهی به", done: "برای گذراندن موفق دوره", on: "تاریخ صدور", st: "وضعیت", print: "چاپ یا ذخیره PDF", li: "افزودن به لینکدین", scan: "برای تأیید، QR را بخوان",
    note: "این گواهی پایان دوره آموزشی آکادمی سینه‌کد است و مدرک دانشگاهی نیست." },
  en: { t: "Verify certificate", h: "Verify a course completion certificate", p: "Enter the certificate code to check that it is real. Only the name, course, date and status are shown.", code: "Certificate code", go: "Check", valid: "Valid", revoked: "Revoked", none: "No certificate was found with this code.", err: "That did not work. Try again.",
    cert: "Course completion certificate", given: "This certificate is awarded to", done: "for successfully completing the course", on: "Issued", st: "Status", print: "Print or save as PDF", li: "Add to LinkedIn", scan: "Scan the QR to verify",
    note: "This is a course completion certificate from CineCode Academy. It is not a university degree." }
};
function renderVerify() {
  const L = VT[lang], T_ = T(), root = $("#verify"); document.title = L.t + " | " + tx(S.name);
  const code0 = (new URLSearchParams(location.search).get("code") || "").replace(/[^\w-]/g, "").slice(0, 24).toUpperCase();
  root.innerHTML = `${crumbHTML(T_, L.t)}<h1 class="ph1">${esc(L.h)}</h1><p class="muted">${esc(L.p)}</p>
    <form id="vf" class="vform" novalidate><label>${esc(L.code)}<input name="code" dir="ltr" maxlength="24" autocomplete="off" value="${esc(code0)}" required></label><button class="btn go" type="submit">${esc(L.go)}</button></form>
    <div id="vres" role="status" aria-live="polite"></div>`;
  const res = $("#vres", root);
  const check = async code => {
    code = code.replace(/[^\w-]/g, "").toUpperCase(); if (code.length < 4) return;
    if (!SB.on()) { res.innerHTML = `<p class="fstatus err">${esc(L.err)}</p>`; return; }
    res.innerHTML = `<p class="muted">…</p>`;
    let r; try { r = await SB.send("POST", "rpc/verify_certificate", { p_code: code }); } catch (e) { res.innerHTML = `<p class="fstatus err">${esc(L.err)}</p>`; return; }
    const x = Array.isArray(r) ? r[0] : null; if (!x) { res.innerHTML = `<p class="fstatus err">${esc(L.none)}</p>`; return; }
    const ct = x.course_title && typeof x.course_title === "object" ? (x.course_title[lang] || x.course_title.en || x.course_title.fa || "") : String(x.course_title || "");
    let dt = ""; try { dt = new Date(x.issued_at).toLocaleDateString(lang === "fa" ? "fa-AF-u-ca-gregory" : "en-GB", { year: "numeric", month: "long", day: "numeric" }); } catch (e) {}
    const ok = x.status === "valid", url = location.origin + location.pathname.replace(/[^/]*$/, "") + "verify.html?code=" + encodeURIComponent(code);
    const li = ok ? "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=" + encodeURIComponent(ct + " | " + tx(S.name)) + "&organizationName=" + encodeURIComponent(tx(S.name) + " Academy") + "&certId=" + encodeURIComponent(code) + "&certUrl=" + encodeURIComponent(url) : "";
    res.innerHTML = '<div id="vcm"></div>';
    SB.send("POST", "rpc/certificate_proof", { p_code: code }).then(r2 => { const z = Array.isArray(r2) ? r2[0] : null; if (!z || !z.cert_no) return; const pp = document.createElement("p"); pp.className = "muted vproof"; pp.dir = "ltr"; pp.style.wordBreak = "break-all"; pp.textContent = (lang === "fa" ? "Certificate No: " : "Certificate No: ") + z.cert_no + (/^[0-9a-f]{64}$/.test(z.sha256 || "") ? "  |  SHA-256: " + z.sha256 : ""); res.appendChild(pp); }).catch(() => {});
    const mountC = () => window.__cert ? window.__cert.mount($("#vcm", res), { lang, name: x.full_name, course: ct, date: dt, code, ok, url, li, title: ct + " | " + tx(S.name) }) : null;
    if (window.__cert) mountC(); else { const sc = document.createElement("script"); sc.src = "assets/js/certs.js"; sc.onload = mountC; document.head.appendChild(sc); }
  };
  $("#vf", root).addEventListener("submit", e => { e.preventDefault(); const c = e.target.elements.code.value; history.replaceState(null, "", "?code=" + encodeURIComponent(c.trim())); check(c); });
  if (code0) check(code0);
}

const DT = {
  fa: { t: "داشبورد من", c: "دوره‌های ثبت‌نام‌شده", l: "درس‌های کامل‌شده", w: "زمان دیدن ویدیو", k: "گواهی‌ها", b: "بهترین نمره آزمون پایانی", d: "آخرین روز یادگیری", h: "ساعت", m: "دقیقه", lid: "شناسه دانشجو", tOv: "داشبورد", tLe: "یادگیری و نتایج", tCe: "گواهی‌ها", tPr: "پروفایل و امنیت", cont: "ادامه درس", exam: "رفتن به آزمون", cert: "دیدن گواهی", qz: "آزمونک", fn: "آزمون پایانی" },
  en: { t: "My dashboard", c: "Enrolled courses", l: "Lessons completed", w: "Video watch time", k: "Certificates", b: "Best final exam score", d: "Last learning day", h: "h", m: "min", lid: "Learner ID", tOv: "Dashboard", tLe: "Learning and results", tCe: "Certificates", tPr: "Profile and security", cont: "Continue lesson", exam: "Go to the exam", cert: "View certificate", qz: "Quiz", fn: "Final exam" }
};
async function renderAccount() {
  const T_ = T(), root = $("#account"); document.title = T_.acctT + " | " + tx(S.name);
  const s = SB.get(); if (!SB.on() || !s) { location.replace("auth.html"); return; }
  root.innerHTML = `<p class="muted" role="status">${esc(T_.acctLoad)}</p>`;
  try {
    const id = s.id, [prof, enr, les, prg, att, cer] = await Promise.all([
      SB.rest(`profiles?select=full_name,role,gender,birth_year,country,phone_cc,phone,education,avatar_path,terms_accepted_at&id=eq.${id}`).catch(() => SB.rest(`profiles?select=full_name,role&id=eq.${id}`).then(r => { r.__old = 1; return r; })), SB.rest(`enrollments?select=course_id,created_at,courses(title,level)&user_id=eq.${id}&order=created_at.desc`),
      SB.rest("lessons?select=id,course_id,position,duration_sec,title&order=position").catch(() => SB.rest("lessons?select=id,course_id,position,duration_sec&order=position")), SB.rest(`lesson_progress?select=lesson_id,completed,watched_sec,last_report_at&user_id=eq.${id}`),
      SB.rest(`attempts?select=course_id,score_percent,passed,submitted_at,kind,after_lesson,pending_review&user_id=eq.${id}&submitted_at=not.is.null&order=submitted_at.desc`).catch(() => SB.rest(`attempts?select=course_id,score_percent,passed,submitted_at&user_id=eq.${id}&submitted_at=not.is.null&order=submitted_at.desc`)), SB.rest(`certificates?select=code,course_id,issued_at,revoked&user_id=eq.${id}`)]);
    const name = (prof[0] && prof[0].full_name) || s.name || s.email, done = new Set(prg.filter(p => p.completed).map(p => p.lesson_id));
    const ttl = c => c && c.title ? (c.title[lang] || c.title.en || c.title.fa || "") : "";
    const D = DT[lang], pmap = {}; prg.forEach(p => pmap[p.lesson_id] = p);
    
    const secs = prg.reduce((n, p) => n + (p.watched_sec || 0), 0), dn = prg.filter(p => p.completed).length;
    const fin = att.filter(x => x.kind !== "quiz"), best = fin.length ? Math.max(...fin.map(x => +x.score_percent || 0)) : null;
    const lastAt = prg.map(p => p.last_report_at).filter(Boolean).sort().pop();
    const hm = n => n >= 3600 ? Math.floor(n / 3600) + " " + D.h + " " + Math.round((n % 3600) / 60) + " " + D.m : Math.max(0, Math.round(n / 60)) + " " + D.m;
    const cards = enr.map(e => { const ls = les.filter(l => l.course_id === e.course_id), d = ls.filter(l => done.has(l.id)).length, pc = ls.length ? Math.round(d * 100 / ls.length) : 0;
      const nx = ls.find(l => !done.has(l.id)), hasC = cer.some(c => c.course_id === e.course_id);
      return `<article class="ac-card dcard"><div class="ring" style="--p:${pc}" role="progressbar" aria-valuenow="${pc}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(T_.acctProg)}"><b>${pc}%</b></div><div><h3>${esc(ttl(e.courses) || e.course_id)}</h3><p>${d} / ${ls.length} ${esc(T_.acctLes)}</p><p><a class="btn ${nx ? "go" : ""}" href="course.html#${encodeURIComponent(e.course_id)}">${esc(hasC ? D.cert : nx ? D.cont + " " + (ls.indexOf(nx) + 1) : D.exam)}</a></p></div></article>`; }).join("");
    const dash = `<section class="ac-sec dash" aria-label="${esc(D.t)}"><h2>${esc(D.t)}</h2><div class="bento">
      <div class="bt"><b>${enr.length}</b><span>${esc(D.c)}</span></div><div class="bt"><b>${dn}</b><span>${esc(D.l)}</span></div><div class="bt"><b>${esc(hm(secs))}</b><span>${esc(D.w)}</span></div>
      <div class="bt"><b>${cer.filter(c => !c.revoked).length}</b><span>${esc(D.k)}</span></div><div class="bt"><b>${best == null ? "—" : best + "%"}</b><span>${esc(D.b)}</span></div><div class="bt"><b dir="ltr">${lastAt ? esc(String(lastAt).slice(0, 10)) : "—"}</b><span>${esc(D.d)}</span></div></div></section>`;
    const gm = window.__gamify ? window.__gamify.html({ lang, prg, att, cer }) : "";
    const UM = lang === 'fa' ? {m:'حساب من',p:'پروفایل',n:'اعلان‌ها',g:'تنظیمات حساب',r:'پیشرفت'} : {m:'My account',p:'Profile',n:'Notifications',g:'Account settings',r:'Progress'};
    const isAdm = prof[0] && /^(admin|super_admin)$/.test(prof[0].role), rl = (prof[0] && prof[0].role) || "student";
    root.innerHTML = `${crumbHTML(T_, T_.acctT)}<header class="portal"><div class="pav" aria-hidden="true">${esc((name || "?").trim().charAt(0).toUpperCase())}</div><div class="pwho"><h1 class="ph1">${esc(T_.acctHi)} ${esc(name)}</h1><p dir="ltr" class="muted">${esc(s.email)}</p><p class="pmeta"><span class="pill">${esc(rl)}</span><span class="pill">${esc(D.lid)}: <b dir="ltr">${esc(String(id).slice(0, 8).toUpperCase())}</b></span>${isAdm ? `<a class="btn go" href="admin.html">${lang === "fa" ? "پنل مدیر" : "Admin panel"}</a>` : ""}</p></div><div class="pum"><button type="button" class="btn" id="pumb" aria-expanded="false" aria-controls="pumm">${esc(UM.m)} ▾</button><ul id="pumm" hidden><li><button type="button" data-gt="profile">${esc(UM.p)}</button></li><li><button type="button" data-bell="1">${esc(UM.n)}</button></li><li><button type="button" data-gt="profile">${esc(UM.g)}</button></li><li><button type="button" data-gt="learning">${esc(UM.r)}</button></li><li><button type="button" id="acctOut">${esc(T_.acctOut)}</button></li></ul></div></header>
    <nav class="ptabs" role="tablist" aria-label="${esc(T_.acctT)}">${[["overview", D.tOv], ["class", lang === "fa" ? "فضای درسی" : "Classroom"], ["learning", D.tLe], ["certs", D.tCe], ["profile", D.tPr]].map(t => `<button type="button" role="tab" id="pt-${t[0]}" aria-controls="pp-${t[0]}" data-t="${t[0]}">${esc(t[1])}</button>`).join("")}</nav>
    <div class="ppane" id="pp-overview" role="tabpanel" aria-labelledby="pt-overview">
    <div id="phome"></div>${gm}<div id="pmount"></div></div>
    <div class="ppane" id="pp-class" role="tabpanel" aria-labelledby="pt-class" hidden><div id="pclass"></div></div>
    <div class="ppane" id="pp-learning" role="tabpanel" aria-labelledby="pt-learning" hidden>
    ${dash}<section class="ac-sec"><h2>${esc(T_.acctAtt)}</h2>${att.length ? `<ul class="chips">${att.map(x => `<li>${esc(ttl((enr.find(e => e.course_id === x.course_id) || {}).courses) || x.course_id)} · ${esc(x.kind === "quiz" ? D.qz + " " + x.after_lesson : D.fn)}: ${esc(x.score_percent)}% ${x.pending_review ? "…" : x.passed ? "✓" : "✗"}</li>`).join("")}</ul>` : `<p class="muted">${esc(T_.acctNoAtt)}</p>`}</section></div>
    <div class="ppane" id="pp-certs" role="tabpanel" aria-labelledby="pt-certs" hidden>
    <section class="ac-sec"><h2>${esc(T_.acctCert)}</h2>${cer.length ? `<div id="pcCerts"></div>` : `<p class="muted">${esc(T_.acctNoCert)}</p>`}</section></div>
    <div class="ppane" id="pp-profile" role="tabpanel" aria-labelledby="pt-profile" hidden>
    ${prof.__old ? `<p class="fstatus err">${esc(PF[lang].noSql)}</p>` : (location.hash === "#reset" ? `<section class="ac-sec"><h2>${esc(PF[lang].resetT)}</h2></section>` : "") + pfSection(prof[0], id)}</div>`;
    if (cer.length) { const box = $("#pcCerts", root), mk = () => {
        const list = cer.slice().sort((x, y) => (x.revoked ? 1 : 0) - (y.revoked ? 1 : 0));
        box.innerHTML = `<div class="pcc-tabs" role="group" aria-label="${esc(T_.acctCert)}">${list.map((x, i) => `<button type="button" class="btn" data-i="${i}" aria-pressed="${i === 0}"><span dir="ltr">${esc(x.code)}</span></button>`).join("")}</div><div id="pccv"></div>`;
        const show = i => { const x = list[i], c = (enr.find(e => e.course_id === x.course_id) || {}).courses; let dt = ""; try { dt = new Date(x.issued_at).toLocaleDateString(lang === "fa" ? "fa-AF-u-ca-gregory" : "en-GB", { year: "numeric", month: "long", day: "numeric" }); } catch (e) {}
          window.__cert.mount($("#pccv", box), { lang, name, course: ttl(c) || x.course_id, date: dt, iso: x.issued_at, code: x.code, ok: !x.revoked, url: location.origin + location.pathname.replace(/[^/]*$/, "") + "verify.html?code=" + encodeURIComponent(x.code), title: ttl(c) + " | " + tx(S.name) });
          $$(".pcc-tabs button", box).forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.i === i))); };
        $(".pcc-tabs", box).onclick = e => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); }; show(0); };
      if (window.__cert) mk(); else { if (!$('link[href$="certs.css"]')) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "assets/css/certs.css"; document.head.appendChild(l); } const sc = document.createElement("script"); sc.src = "assets/js/certs.js"; sc.onload = mk; document.head.appendChild(sc); } }
    if (window.__portal && window.__portal.classroom) window.__portal.classroom({ root: $("#pclass"), enr, les, done, cer, att, lang, ttl });
    if (window.__portal && window.__portal.home) window.__portal.home({ root: $("#phome"), enr, les, done, cer, att, prof: prof[0] || {}, name, lang, ttl, uid: id, since: s.created_at || (prof[0] && prof[0].terms_accepted_at) || (enr[enr.length - 1] || {}).created_at || new Date().toISOString() });
    if (window.__portal) window.__portal.mount({ root: $("#pmount"), enr, les, done, cer, lang, ttl, uid: id, instructor: tx(S.name) });
    { const tabs = $$(".ptabs button", root), show = t => { tabs.forEach(b => { const on = b.dataset.t === t; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; $("#pp-" + b.dataset.t, root).hidden = !on; }); };
      tabs.forEach(b => b.onclick = () => { show(b.dataset.t); try { history.replaceState(null, "", "#" + b.dataset.t); } catch (e) {} });
      const h = location.hash.slice(1); show(h === "reset" ? "profile" : ["overview", "learning", "certs", "profile"].includes(h) ? h : "overview"); }
    $("#acctOut").onclick = async () => { await SB.out(); location.href = "index.html"; };
    { const pb = $("#pumb"), pm = $("#pumm"); pb.onclick = e => { e.stopPropagation(); pm.hidden = !pm.hidden; pb.setAttribute("aria-expanded", String(!pm.hidden)); };
      document.addEventListener("click", e => { if (!e.target.closest(".pum")) { pm.hidden = true; pb.setAttribute("aria-expanded", "false"); } });
      pm.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; pm.hidden = true; if (b.dataset.gt) { const tb = $("#pt-" + b.dataset.gt); if (tb) tb.click(); window.scrollTo({ top: 0 }); } else if (b.dataset.bell) { const bl = $("#bellBtn"); if (bl) bl.click(); } }); }
    if (!prof.__old) { pfWire(root, id, prof[0], renderAccount); }
  } catch (e) { root.innerHTML = `${crumbHTML(T_, T_.acctT)}<p class="fstatus err" role="alert">${esc(T_.acctErr)}</p><p><button type="button" class="btn" id="acctOut">${esc(T_.acctOut)}</button></p>`; $("#acctOut").onclick = async () => { await SB.out(); location.href = "auth.html"; }; }
}
let lbT = "all", lbL = "all", lbQ = "";
function renderLibrary() {
  const T_ = T(), all = S.library || [], fa = lang === "fa", LIM = 30;
  document.title = T_.libPT + " | " + tx(S.name);
  const LV_ = { Beginner: fa ? "مبتدی" : "Beginner", Intermediate: fa ? "متوسط" : "Intermediate", Advanced: fa ? "پیشرفته" : "Advanced" };
  const TI = { course: "edu", video: "play", software: "grid", sound: "film", article: "doc", stock: "grid", book: "book" };
  const types = [...new Set(all.map(r => r.type))], lvls = [...new Set(all.map(r => r.level))];
  const tn = v => v === "all" ? T_.libAllT : T_["t_" + v] || v, ln = v => v === "all" ? T_.libAllL : LV_[v] || v;
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const freeN = all.filter(r => r.free).length;
  const cnt = (k, v) => all.filter(r => (k === "t" ? (v === "all" || r.type === v) : (v === "all" || r.level === v))).length;
  const chip = (arr, cur, key, lab) => ["all", ...arr].map(v => `<button type="button" class="${v === cur ? "on" : ""}" data-${key}="${esc(v)}" aria-pressed="${v === cur}">${key === "t" && v !== "all" ? icon(TI[v] || "link") : ""}<span>${esc(lab(v))}</span><i>${cnt(key, v)}</i></button>`).join("");
  $("#library").innerHTML = `<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(T_.nHome)}</a> / <a href="academy.html">${esc(T_.nAcademy)}</a> / <span aria-current="page">${esc(T_.libPT)}</span></nav>
  <header class="lb-hd"><div><span class="lbl">${esc(T_.nAcademy)}</span><h1 class="ph1">${esc(T_.libPT)}</h1><p class="lb-lead">${esc(T_.libPD)}</p></div>
    <ul class="lb-st" aria-label="${esc(T_.libPT)}"><li><b>${all.length}</b><span>${esc(T_.libN)}</span></li><li><b>${freeN}</b><span>${esc(T_.libFree)}</span></li><li><b>${types.length}</b><span>${esc(fa ? "نوع منبع" : "types")}</span></li></ul></header>
  <div class="lb-body"><aside class="lb-side" aria-label="${esc(fa ? "فیلترها" : "Filters")}">
    <label class="lb-q"><span class="lbl">${esc(T_.libQ)}</span><input type="search" id="lbQ" placeholder="…" value="${esc(lbQ)}" autocomplete="off" enterkeyhint="search"></label>
    <div class="lb-f"><span class="lbl">${esc(fa ? "نوع" : "Type")}</span><div class="lb-ch" id="lbTs">${chip(types, lbT, "t", tn)}</div></div>
    <div class="lb-f"><span class="lbl">${esc(fa ? "سطح" : "Level")}</span><div class="lb-ch lv" id="lbLs">${chip(lvls, lbL, "l", ln)}</div></div>
    <p class="lb-note">${esc(fa ? "همهٔ پیوندها به سایت‌های بیرونی می‌روند. من این منابع را نساخته‌ام و دربارهٔ محتوای آن‌ها تعهدی ندارم." : "Every link opens an outside site. I did not make these resources and cannot vouch for their content.")}</p>
    <a class="btn" href="resources.html">${esc(fa ? "آرشیو ۸۵۰+ سایت و منبع" : "Archive of 850+ sites")}</a></aside>
  <section class="lb-main" aria-live="polite"><p class="lb-cnt" id="lbCnt" role="status"></p><ul class="lb-list" id="lbGrid"></ul><button type="button" class="btn lb-more" id="lbMore" hidden></button></section></div>`;
  let lim = LIM;
  const grid = () => {
    const nq = NORM(lbQ), list = all.filter(r => (lbT === "all" || r.type === lbT) && (lbL === "all" || r.level === lbL) && (!nq || NORM([tx(r.title), tx(r.text), tx(r.cat)].join(" ")).includes(nq)));
    $("#lbCnt").textContent = list.length + " " + T_.libN;
    $("#lbGrid").innerHTML = list.slice(0, lim).map(r => `<li><a class="lbr" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><span class="lbr-i" aria-hidden="true">${icon(TI[r.type] || "link")}</span><span class="lbr-b"><b>${esc(tx(r.title))}</b><span>${esc(tx(r.text))}</span><small>${esc(tn(r.type))} · ${esc(ln(r.level))}${r.cat ? " · " + esc(tx(r.cat)) : ""} · <span dir="ltr">${esc(host(r.url))}</span>${r.free ? " · " + esc(T_.libFree) : ""}${r.first ? "" : " · " + esc(T_.libThird)}</small></span><span class="lbr-o" aria-label="${esc(T_.libOpen)}">↗</span></a></li>`).join("") || `<li class="lb-none">${esc(T_.libNone)}</li>`;
    const m = $("#lbMore"); m.hidden = list.length <= lim; m.textContent = (fa ? "نمایش بیشتر" : "Show more") + " (" + Math.min(lim, list.length) + " / " + list.length + ")";
  };
  grid(); $("#lbQ").oninput = e => { lbQ = e.target.value; lim = LIM; grid(); };
  $("#lbMore").onclick = () => { lim += LIM; grid(); };
  const rerun = () => { const q = lbQ; renderLibrary(); const i = $("#lbQ"); if (i && q) i.value = q; };
  $$("#lbTs button").forEach(b => b.onclick = () => { lbT = b.dataset.t; rerun(); }); $$("#lbLs button").forEach(b => b.onclick = () => { lbL = b.dataset.l; rerun(); });
}
function renderAcademy() {
  const C = AC[lang], X = AC2[lang], cs = S.courses || [];
  document.title = C.h1 + " | " + tx(S.name);
  const lv = ["all", ...new Set(cs.map(c => tx(c.level)))], sb = ["all", ...new Set(cs.map(c => tx(c.cat)))];
  const chips = (arr, cur, key) => arr.map(v => `<button type="button" class="${v === cur ? "on" : ""}" data-${key}="${esc(v)}" aria-pressed="${v === cur}">${esc(v === "all" ? C.all : v)}</button>`).join("");
  const list = cs.filter(c => (acLvl === "all" || tx(c.level) === acLvl) && (acSub === "all" || tx(c.cat) === acSub));
  const lessons = cs.reduce((n, c) => n + (c.lessons || []).length, 0);
  $("#academy").innerHTML = `
  <nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(C.home)}</a> / <span aria-current="page">${esc(C.crumb)}</span></nav>
  <section class="ac-hero"><div class="ac-t"><span class="lbl">${esc(C.lab)}</span><h1 class="ph1">${esc(C.h1)}</h1><p>${esc(C.intro)}</p>
    <div class="ac-cta"><a class="btn go" href="auth.html#register">${esc(C.c1)}</a><a class="btn" href="auth.html">${esc(C.c2)}</a><a class="btn" href="#courses">${esc(C.c3)}</a></div></div>
    <div class="ac-ph" aria-hidden="true"><span class="ac-ring"></span><span class="ac-dot"></span><div class="ac-arch"><img src="assets/img/me.webp" alt="" width="954" height="959"></div></div></section>
  <section class="ac-sec"><h2>${esc(C.how)}</h2><ol class="ac-how">${C.hs.map((s, i) => `<li><span class="ac-n">${i + 1}</span><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></li>`).join("")}</ol></section>
  <section class="ac-stats" aria-label="Stats"><div><b>${cs.length}</b><span>${esc(C.st[0])}${cs.some(c => c.sample) ? " · " + esc(C.sample) : ""}</span></div><div><b>${lessons}</b><span>${esc(C.st[1])}</span></div><div><b>${esc(C.stv)}</b><span>${esc(C.st[2])}</span></div><div><b>${icon("award")}</b><span>${esc(C.st[3])}</span></div></section>
  <section class="ac-sec" id="courses"><h2>${esc(C.learn)}</h2><p class="muted">${esc(C.note)}</p>
    <div class="ac-f"><span class="lbl">${esc(C.lvl)}</span><div class="wf" id="acL">${chips(lv, acLvl, "l")}</div></div>
    <div class="ac-f"><span class="lbl">${esc(C.sub)}</span><div class="wf" id="acS">${chips(sb, acSub, "s")}</div></div>
    <div class="ac-tools"><label class="ac-q"><span class="lbl">${esc(X.q)}</span><input type="search" id="acQ" value="${esc(acQ)}" autocomplete="off"></label><label class="ac-q"><span class="lbl">${esc(X.sort)}</span><select id="acSo"><option value="0">${esc(X.s0)}</option><option value="1">${esc(X.s1)}</option><option value="2">${esc(X.s2)}</option></select></label></div>
    <p class="muted" id="acCnt" role="status" aria-live="polite"></p><div class="ac-grid" id="acGrid"></div></section>
  <section class="ac-promo"><div><h2>${esc(C.crumb)}</h2><p>${esc(C.cert)}</p></div><a class="btn go" href="index.html#certs">${esc(C.certb)}</a></section>
  <section class="ac-sec" id="library"><span class="lbl">${esc(X.libT)}</span><h2>${esc(X.libH)}</h2><p class="muted">${esc(X.libP)}</p><a class="btn go" href="library.html">${esc(X.libB)}</a></section>
  <section class="ac-sec" id="teach"><span class="lbl">${esc(X.tchT)}</span><h2>${esc(X.tchH)}</h2><p class="muted">${esc(X.tchP)}</p><a class="btn" href="mailto:${esc(S.contactEmail)}?subject=${encodeURIComponent(X.tchT)}">${esc(X.tchB)}</a></section>`;
  const grid = () => {
    const nq = NORM(acQ), list = cs.filter(c => (acLvl === "all" || tx(c.level) === acLvl) && (acSub === "all" || tx(c.cat) === acSub) && (!nq || NORM([tx(c.title), tx(c.text), tx(c.cat)].join(" ")).includes(nq)));
    if (acSort === "1") list.sort((p, q) => tx(p.title).localeCompare(tx(q.title), lang)); if (acSort === "2") list.sort((p, q) => (q.lessons || []).length - (p.lessons || []).length);
    $("#acCnt").textContent = list.length + " " + X.cnt;
    $("#acGrid").innerHTML = list.map(c => `<article class="ac-card"><div class="ac-meta"><span class="ac-tag">${esc(tx(c.level))}</span><span>${(c.lessons || []).length} ${esc(C.les)}</span>${c.sample ? `<span class="pill">${esc(C.sample)}</span>` : ""}${c.status === "soon" ? `<span class="pill">${esc(X.soon)}</span>` : ""}</div><h3>${esc(tx(c.title))}</h3><p>${esc(tx(c.text))}</p><div class="ac-foot"><b>${esc(C.free)}</b><a href="course.html#${esc(c.id)}">${esc(C.view)} ${lang === "fa" ? "←" : "→"}</a></div></article>`).join("") || `<p class="muted">${esc(C.none)}</p>`;
  };
  grid(); $("#acSo").value = acSort;
  (async () => { if (!SB.on()) return; try {
    const rows = await SB.rest("courses?select=id,title,summary,level&status=eq.published&order=created_at"); if (!rows.length || !$("#acGrid")) return;
    const t = o => (o && typeof o === "object") ? (o[lang] || o.en || o.fa || "") : (o || ""), LVN = { beginner: lang === "fa" ? "مبتدی" : "Beginner", intermediate: lang === "fa" ? "متوسط" : "Intermediate", advanced: lang === "fa" ? "پیشرفته" : "Advanced" };
    $("#acGrid").insertAdjacentHTML("beforebegin", `<h3 class="lv-h">${esc(lang === "fa" ? "دوره‌های فعال" : "Live courses")}</h3><div class="ac-grid" id="liveGrid">${rows.map(c => `<article class="ac-card"><div class="ac-meta"><span class="ac-tag">${esc(LVN[c.level] || c.level)}</span><span class="pill">${esc(lang === "fa" ? "رایگان" : "Free")}</span></div><h3>${esc(t(c.title))}</h3><p>${esc(t(c.summary))}</p><a class="btn go" href="course.html#${esc(c.id)}">${esc(lang === "fa" ? "دیدن دوره" : "Open course")}</a></article>`).join("")}</div>`);
  } catch (e) {} })();
  $("#acQ").oninput = e => { acQ = e.target.value; grid(); }; $("#acSo").onchange = e => { acSort = e.target.value; grid(); };
  $$("#acL button").forEach(b => b.onclick = () => { acLvl = b.dataset.l; renderAcademy(); });
  $$("#acS button").forEach(b => b.onclick = () => { acSub = b.dataset.s; renderAcademy(); });
}

/* ---------- works page: categories, frames, lightbox with arrows ---------- */
let wkCat = "all", wkLim = 24;
function renderWorks() {
  const T_ = T(), gl = S.gallery || [];
  const GN = { poster: "gpost", academy: "gacad", banner: "gban", brand: "gbra", print: "gprn" };
  const GI = { all: "spark", poster: "grid", academy: "edu", banner: "play", brand: "aperture", print: "doc" };
  const cats = ["all", "poster", "academy", "banner", "brand", "print"];
  const cnt = k => k === "all" ? gl.length : gl.filter(g => g.cat === k).length;
  const nm = k => k === "all" ? T_.nWorks : T_.cats[GN[k]];
  const ds = k => k === "all" ? "" : T_[GN[k] + "D"];
  document.title = T_.nWorks + " | " + tx(S.name);
  $("#wkT").textContent = T_.nWorks; $("#wkP").textContent = T_.wkIntro; $("#wkBack").textContent = "← " + T_.wkBack;
  $("#wkTiles").innerHTML = cats.filter(k => cnt(k)).map(k => `<button type="button" class="wkt-i${k === wkCat ? " on" : ""}" data-c="${k}" aria-pressed="${k === wkCat}"><span class="wkt-ic">${icon(GI[k])}</span><span class="wkt-n">${esc(nm(k))}</span><span class="wkt-c">${cnt(k)} ${esc(T_.wkCount)}</span><span class="wkt-d">${esc(ds(k))}</span></button>`).join("");
  $$("#wkTiles button").forEach(b => b.onclick = () => { wkCat = b.dataset.c; wkLim = 24; renderWorks(); });
  const list = gl.filter(g => wkCat === "all" || g.cat === wkCat);
  WKLIST = list;
  try { const w0 = new URLSearchParams(location.search).get("w"), i0 = w0 ? list.findIndex(g => g.id === w0) : -1; if (i0 >= wkLim) wkLim = i0 + 1; } catch (e) {}
  $("#wkGrid").innerHTML = list.slice(0, wkLim).map((g, n) => `<figure class="wkf"><button type="button" class="wkb" data-i="${n}" aria-label="${esc(T_.zoom)}: ${esc(nm(g.cat))} ${n + 1}"><img src="${esc(gsrc(g, true))}" alt="${esc(nm(g.cat))}" loading="lazy" decoding="async" width="${g.w}" height="${g.h}"></button><figcaption><span>${String(n + 1).padStart(2, "0")}</span><span>${esc(nm(g.cat))}</span></figcaption></figure>`).join("");
  const grid = $("#wkGrid");
  { let mb = $("#wkMore"); if (!mb) { mb = document.createElement("button"); mb.type = "button"; mb.className = "btn wk-more"; mb.id = "wkMore"; grid.after(mb); mb.onclick = () => { wkLim += 24; renderWorks(); const f = $$("#wkGrid .wkb")[wkLim - 24]; if (f) f.focus({ preventScroll: true }); }; }
    mb.hidden = list.length <= wkLim; mb.textContent = (lang === "fa" ? "نمایش بیشتر" : "Show more") + " (" + Math.min(wkLim, list.length) + " / " + list.length + ")"; }
  if (!grid.dataset.b) { grid.dataset.b = "1"; grid.addEventListener("click", e => { const b = e.target.closest(".wkb"); if (b) wkOpen(+b.dataset.i); });
    try { const w = new URLSearchParams(location.search).get("w"); if (w) { const i = list.findIndex(g => g.id === w); if (i >= 0) setTimeout(() => wkOpen(i), 300); } } catch (e) {} }
}
let WKLIST = [], WKI = 0;
function wkOpen(i) {
  const T_ = T(); let d = $("#wkd");
  if (!d) {
    d = document.createElement("dialog"); d.className = "cdlg wkd"; d.id = "wkd";
    d.innerHTML = `<div class="wkn"><button type="button" class="btn" id="wkPv"></button><span id="wkCt" aria-live="polite"></span><button type="button" class="btn" id="wkNx"></button></div><img id="wkImg" alt=""><button type="button" class="btn go" id="wkX"></button>`;
    { const ac = document.createElement("div"); ac.className = "wkac"; ac.innerHTML = '<button type="button" class="btn" id="wkLn"></button><a class="btn" id="wkWa" target="_blank" rel="noopener noreferrer"></a><a class="btn" id="wkTg" target="_blank" rel="noopener noreferrer"></a><a class="btn" id="wkDl" download></a><span class="muted" id="wkSt" role="status" aria-live="polite"></span>'; d.insertBefore(ac, $("#wkX", d)); }
    document.body.appendChild(d);
    { let x0 = 0, y0 = 0; const im = $("#wkImg", d); im.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true }); im.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { const rtl = document.documentElement.dir === "rtl"; go((dx < 0) !== rtl ? 1 : -1); } }, { passive: true }); }
    const go = s => { WKI = (WKI + s + WKLIST.length) % WKLIST.length; wkShow(); };
    $("#wkPv", d).onclick = () => go(-1); $("#wkNx", d).onclick = () => go(1); $("#wkX", d).onclick = () => d.close();
    d.addEventListener("click", e => { if (e.target === d) d.close(); });
    d.addEventListener("keydown", e => { const rtl = document.documentElement.dir === "rtl"; if (e.key === "ArrowLeft") go(rtl ? 1 : -1); if (e.key === "ArrowRight") go(rtl ? -1 : 1); });
  }
  $("#wkPv", d).textContent = "‹ " + T_.wkPrev; $("#wkNx", d).textContent = T_.wkNext + " ›"; $("#wkX", d).textContent = T_.close;
  WKI = i; wkShow(); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}
function wkShow() {
  const g = WKLIST[WKI]; if (!g) return;
  const GN = { poster: "gpost", academy: "gacad", banner: "gban", brand: "gbra", print: "gprn" };
  $("#wkImg").src = gsrc(g); $("#wkImg").alt = T().cats[GN[g.cat]];
  $("#wkCt").textContent = (WKI + 1) + " / " + WKLIST.length;
  const f = document.documentElement.lang === "fa", url = location.origin + location.pathname.replace(/[^/]*$/, "") + "works.html?w=" + encodeURIComponent(g.id), msg = (f ? "یکی از نمونه‌کارهای انصارالحق مبارز: " : "A work by Ansarulhaq Mubarez: ") + url;
  $("#wkLn").textContent = f ? "کپی لینک این اثر" : "Copy link to this work"; $("#wkWa").textContent = f ? "واتساپ" : "WhatsApp"; $("#wkTg").textContent = f ? "تلگرام" : "Telegram"; $("#wkDl").textContent = f ? "دانلود" : "Download";
  $("#wkWa").href = "https://wa.me/?text=" + encodeURIComponent(msg); $("#wkTg").href = "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(f ? "نمونه‌کار انصارالحق مبارز" : "A work by Ansarulhaq Mubarez");
  $("#wkDl").href = gsrc(g); $("#wkDl").setAttribute("download", "cinecode-work-" + g.id + ".webp");
  $("#wkLn").onclick = () => { const ok = () => { $("#wkSt").textContent = f ? "کپی شد" : "Copied"; }; if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, ok); };
  $("#wkSt").textContent = "";
  try { history.replaceState(null, "", "?w=" + encodeURIComponent(g.id)); } catch (e) {}
  [1, -1].forEach(k => { const n = WKLIST[(WKI + k + WKLIST.length) % WKLIST.length]; if (n) { const i = new Image(); i.src = gsrc(n); } });
}

let gfilter = "all"; let wfilter = "all"; let filter = "top";
/* ---------- CineCode hero: copy from SITE.cc, typewriter on the title only ---------- */
let ccT = 0, ccK = "";
const CC_IC = {
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  design: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5" opacity=".6"/>'
};
function ccArt(k) {
  if (k === "code") return `<svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" opacity=".55"><path d="M60 45L25 75l35 30M260 45l35 30-35 30M185 25l-50 100"/></g><g fill="currentColor" opacity=".22"><rect x="90" y="30" width="60" height="8" rx="4"/><rect x="170" y="50" width="70" height="8" rx="4"/><rect x="90" y="100" width="90" height="8" rx="4"/><rect x="200" y="112" width="40" height="8" rx="4"/></g></svg>`;
  if (k === "film") return `<svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><circle cx="160" cy="75" r="46"/><circle cx="160" cy="75" r="18"/><path d="M160 29v28M206 75h-28M160 121V93M114 75h28M193 42l-20 20M193 108l-20-20M127 108l20-20M127 42l20 20"/></g><g fill="currentColor" opacity=".2"><rect x="8" y="10" width="14" height="10" rx="2"/><rect x="8" y="40" width="14" height="10" rx="2"/><rect x="8" y="70" width="14" height="10" rx="2"/><rect x="8" y="100" width="14" height="10" rx="2"/><rect x="298" y="10" width="14" height="10" rx="2"/><rect x="298" y="40" width="14" height="10" rx="2"/><rect x="298" y="70" width="14" height="10" rx="2"/><rect x="298" y="100" width="14" height="10" rx="2"/></g></svg>`;
  return `<svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><path d="M70 120C110 20 210 20 250 120"/><circle cx="70" cy="120" r="6"/><circle cx="250" cy="120" r="6"/><circle cx="160" cy="45" r="6"/><path d="M70 120L160 45 250 120" opacity=".5"/></g><g fill="currentColor" opacity=".2"><rect x="30" y="30" width="30" height="30" rx="4"/><rect x="262" y="26" width="30" height="30" rx="15"/><path d="M150 100l20 35h-40z"/></g></svg>`;
}
function renderCC() {
  const C = S.cc; if (!C || !$("#cc")) return;
  const title = tx(C.title);
  $("#ccTag").textContent = tx(C.tag);
  $("#ccSr").textContent = title;
  $("#ccSub").textContent = tx(C.sub); $("#ccBody").textContent = tx(C.body);
  $("#ccC1").textContent = tx(C.cta1); $("#ccC2").textContent = tx(C.cta2);
  $("#ccSl").innerHTML = C.slogans.map(x => `<li>${esc(tx(x))}</li>`).join("");
  $("#ccPT").textContent = tx(C.pilT);
  $("#ccGrid").innerHTML = C.pillars.map(p => `<article class="cc-p cc-${p.k}"><div class="cc-art">${ccArt(p.k)}<span class="cc-ic"><svg class="ic" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CC_IC[p.k]}</svg></span></div><div class="cc-pb"><span class="cc-n">${esc(tx(p.n))} · ${esc(tx(p.s))}</span><h3>${esc(tx(p.t))}</h3><p>${esc(tx(p.d))}</p></div></article>`).join("");
  $("#ccMT").textContent = tx(C.misT); $("#ccMis2").textContent = tx(C.mis); $("#ccFl").textContent = tx(C.founder);
  /* typewriter: title only, once per language. Untyped letters stay in the layout (invisible) so nothing jumps. */
  const key = lang + title; if (key === ccK) return; ccK = key; clearTimeout(ccT);
  const out = $("#ccTyped"), paint = n => { out.innerHTML = esc(title.slice(0, n)) + (n < title.length ? `<i class="cc-cur"></i><span class="cc-rest">${esc(title.slice(n))}</span>` : ""); };
  if (still || R.classList.contains("lite")) { paint(title.length); return; }
  let n = 0; (function step() { n++; paint(n); if (n < title.length) ccT = setTimeout(step, 70); })();
}
function renderHome() {
  const T_ = T();
  renderCC();
  $("#name").innerHTML = tx(S.name).split(/\s+/).map(w => `<span>${esc(w)}</span>`).join("");
  $("#hphoto").alt = tx(S.name);
  $("#hmeta").innerHTML = `<span class="clk" title="${esc(T_.kabulT)}">${icon("clock")}<span>${esc(T_.kabulT)}</span> <b id="kclk" aria-hidden="true">--:--:--</b></span><span>${esc(tx(S.city))}</span><span>${new Date().getFullYear()}</span>`;
  { const kc = () => { const e = $("#kclk"); if (e) e.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kabul", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()); }; kc(); if (!window.__kclk) window.__kclk = setInterval(kc, 1000); }
  $("#hcats").innerHTML = [["#vids", "play", T_.hcFilm], ["#design", "spark", T_.hcDesign], ["#certs", "award", T_.hcCerts], ["#courses", "book", T_.hcAcad], ["works.html", "grid", T_.nWorks]].map(([h, ic, t]) => `<li><a href="${h}">${icon(ic)}<span>${esc(t)}</span></a></li>`).join("") + `<li class="hsite">${esc(T_.hsite)}</li>`;
  { const n = (x) => Array.isArray(x) ? x.length : 0;
    const st = [[n(S.gallery), T_.stGal], [n(S.certs), T_.stCert], [n(S.education), T_.stEdu], [n(S.languages), T_.stLang]].filter(x => x[0] > 0);
    $("#hstats").innerHTML = st.map(x => `<div><dd>${x[0]}</dd><dt>${esc(x[1])}</dt></div>`).join("");
    $("#stnote").textContent = T_.stNote; $("#pcT").textContent = T_.pcT;
    $("#pcards").innerHTML = [["works.html", T_.nWorks, T_.pc1D], ["academy.html", T_.nAcademy, T_.pc2D], ["#certs", T_.nCerts, T_.pc3D], ["cv.html", T_.cvT, T_.pc4D]].map((c, i) => `<li><a href="${c[0]}"><span class="pn" aria-hidden="true">0${i + 1}</span><h3>${esc(c[1])}</h3><p>${esc(c[2])}</p><span class="pgo">${esc(T_.pcGo)} →</span></a></li>`).join(""); }
  $("#roles").textContent = tx(S.roles);
  $("#tag").textContent = tx(S.tagline);
  const av = $("#avail");
  if (S.availability) { av.hidden = false; av.className = "avail " + S.availability; av.textContent = S.availability === "open" ? T_.open : T_.busy; } else av.hidden = true;
  $("#aboutText").innerHTML = esc(tx(S.about)) + (S.about.sample ? ` ${pill(true)}` : "");
  const tile = (a, n, w) => `<div class="tile glass"><span class="ico${w ? " w" : ""}" aria-hidden="true">${esc(a)}</span><span>${esc(n)}</span></div>`;
  $("#c1").innerHTML = S.skills.video.map(s => tile(s[0], s[1], false)).join("");
  $("#c2").innerHTML = S.skills.design.map(s => tile(s[0], s[1], true)).join("");
  $("#c3").innerHTML = (S.skills.cs && S.skills.cs.length) ? S.skills.cs.map(s => tile(s[0], s[1], false)).join("") : `<span class="ghost">${esc(T_.pending)}</span>`;

  const catName = c => c === "design" ? T_.cats.designW : T_.cats[c];
  const WP = S.projects.filter(p => !p.sample);
  const wcats = ["all", ...new Set(WP.map(p => p.cat))];
  $("#workF").innerHTML = wcats.map(k => `<button type="button" class="${k === wfilter ? "on" : ""}" data-w="${k}" aria-pressed="${k === wfilter}">${esc(k === "all" ? T_.cats.all : catName(k))}</button>`).join("");
  $$("#workF button").forEach(b => { b.onclick = () => { wfilter = b.dataset.w; renderHome(); }; });
  if (!WP.length) { $("#workF").hidden = true; $("#workGrid").innerHTML = `<div class="pjl-empty"><span class="pjl-ic" aria-hidden="true">${icon("film")}</span><div><h3>${esc(lang === "fa" ? "پروژه‌های ویدیویی به‌زودی" : "Video projects are coming")}</h3><p>${esc(lang === "fa" ? "کارهای طراحی واقعی من در بخش نمونه‌کارها هستند." : "My real design work is in the Works section.")}</p><div class="pjl-cta"><a class="btn go" href="works.html">${esc(T_.gAll)}</a></div></div></div>`; } else
  $("#workGrid").innerHTML = S.projects.map((p, n) => ({ p, n })).filter(o => !o.p.sample && (wfilter === "all" || o.p.cat === wfilter)).map(({ p, n }) => {
    const title = p.title ? tx(p.title) : `${T_.projectTitle} ${n + 1}`;
    const ratio = [".75", "1", ".8", ".66"][n % 4];
    return `<a class="pc" href="project.html#${esc(p.id)}"><div class="pcv" style="--x:${esc(p.x)};--y:${esc(p.y)};aspect-ratio:1/${ratio}"><span>${esc(p.tc)}</span><b>${esc(title)}</b></div>
      <div class="pcm"><span class="pca" aria-hidden="true">A</span><span class="pct">${esc(title)}</span><span class="pcc">${esc(catName(p.cat))}</span>${pill(p.sample)}</div></a>`;
  }).join("");

  const cats = ["top", "all", "cs", "design", "film", "biz", "lang", "work", "community"];
  $("#filters").innerHTML = cats.map(k => `<button type="button" class="btn ${k === filter ? "on" : ""}" data-f="${k}" aria-pressed="${k === filter}">${esc(T_.cats[k])}</button>`).join("");
  $$("#filters .btn").forEach(b => { b.onclick = () => { filter = b.dataset.f; renderHome(); layoutClips(); }; });
  $("#eduList").innerHTML = (S.education || []).map(e => `<div class="card glass"><h3>${esc(tx(e.school))}</h3><p>${esc(tx(e.field))}</p><p class="lbl">${esc(tx(e.status))}</p></div>`).join("");
  { const GN = { poster: "gpost", academy: "gacad", banner: "gban", brand: "gbra", print: "gprn" };
    const gl = S.gallery || []; $("#design").hidden = !gl.length;
    const tz = { poster: 4, academy: 3, banner: 2, brand: 2, print: 1 }, seen = {};
    const tease = gl.filter(g => (seen[g.cat] = (seen[g.cat] || 0) + 1) <= (tz[g.cat] || 0));
    $("#gal").classList.add("gs");
    $("#gal").innerHTML = tease.map((g, i) => `<button type="button" class="gi gsf" data-g="${esc(g.id)}" aria-label="${esc(T_.zoom)}: ${esc(T_.cats[GN[g.cat]])}"><span class="gsf-fr"><span class="gsf-in"><img src="${esc(gsrc(g, true))}" alt="${esc(T_.cats[GN[g.cat]])}" loading="lazy" decoding="async" width="${g.w}" height="${g.h}"></span></span><span class="gsf-cap"><b>${esc(T_.cats[GN[g.cat]])}</b><i>${lang === "fa" ? "تقدیرنامه‌ای از کار · " : "Plaque of work · "}${i + 1}/${tease.length}</i></span></button>`).join("");
    window.__gsInit && window.__gsInit();
    $("#gAll").textContent = T_.gAll + " (" + gl.length + ") →";
    const gd = $("#gal"); if (!gd.dataset.b) { gd.dataset.b = "1"; gd.addEventListener("click", e => { const b = e.target.closest(".gi"); if (!b) return; const d = $("#cdlg"); $("#cdimg").src = gsrc((S.gallery || []).find(x => x.id === b.dataset.g) || { id: b.dataset.g }); $("#cdimg").alt = b.querySelector("img").alt; $("#cdt").textContent = b.querySelector("img").alt; if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }); } }
  const dlg = $("#cdlg");
  if (!dlg.dataset.b) { dlg.dataset.b = "1";
    $("#strip").addEventListener("click", e => { const b = e.target.closest(".cth"); if (!b) return; const c = S.certs.find(x => x.id === b.dataset.c);
      $("#cdimg").src = "assets/certs/" + c.id + ".webp"; $("#cdimg").alt = LV(c.title); $("#cdt").textContent = LV(c.title) + (c.issuer ? " · " + LV(c.issuer) : "");
      { let sh = $("#cdsh"); if (!sh) { sh = document.createElement("div"); sh.id = "cdsh"; sh.className = "cdsh"; $("#cdt").after(sh); }
        const f = lang === "fa", ttl = LV(c.title), iss = LV(c.issuer) || "", pg = location.origin + location.pathname.replace(/[^/]*$/, "") + "certificates.html", ver = SAFE_URL(c.verifyUrl) || "", code = c.code ? String(c.code) : "";
        const idl = (code ? (f ? "\nشمارهٔ گواهی: " : "\nCredential ID: ") + code : "") + (ver ? (f ? "\nتأیید: " : "\nVerify: ") + ver : "");
        const TX = f ? { li: "با افتخار گواهی «" + ttl + "»" + (iss ? " از " + iss : "") + (c.year ? " (" + c.year + ")" : "") + " را دریافت کردم." + idl + "\nمسیر یادگیری من: " + pg + "\n#یادگیری #مهارت #CineCode", x: "گواهی «" + ttl + "»" + (iss ? " از " + iss : "") + " را گرفتم 🎓" + (code ? " " + code : "") + "\n" + pg, wa: "سلام 👋 گواهی «" + ttl + "»" + (iss ? " از " + iss : "") + " را گرفتم 🎓" + idl + "\n" + pg, tg: "🎓 " + ttl + (iss ? "\n🏫 " + iss : "") + (code ? "\n🔖 " + code : "") + "\n" + pg, fb: "یک مهارت تازه! 🎬 گواهی «" + ttl + "»" + (iss ? " از " + iss : "") + " را دریافت کردم." + idl + "\n" + pg }
          : { li: "I'm proud to share that I earned “" + ttl + "”" + (iss ? " from " + iss : "") + (c.year ? " (" + c.year + ")" : "") + "." + idl + "\nMy learning path: " + pg + "\n#Learning #Skills #CineCode", x: "Earned “" + ttl + "”" + (iss ? " from " + iss : "") + " 🎓" + (code ? " " + code : "") + "\n" + pg, wa: "Hey 👋 I earned “" + ttl + "”" + (iss ? " from " + iss : "") + " 🎓" + idl + "\n" + pg, tg: "🎓 " + ttl + (iss ? "\n🏫 " + iss : "") + (code ? "\n🔖 " + code : "") + "\n" + pg, fb: "A new skill! 🎬 I earned “" + ttl + "”" + (iss ? " from " + iss : "") + "." + idl + "\n" + pg };
        const e = encodeURIComponent, U = e(pg), li = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=" + e(ttl) + "&organizationName=" + e(iss) + (c.year ? "&issueYear=" + c.year : "") + (ver ? "&certUrl=" + e(ver) : "") + (code ? "&certId=" + e(code) : "");
        const L = [["LinkedIn", li], ["X", "https://twitter.com/intent/tweet?text=" + e(TX.x)], [f ? "واتساپ" : "WhatsApp", "https://wa.me/?text=" + e(TX.wa)], [f ? "تلگرام" : "Telegram", "https://t.me/share/url?url=" + U + "&text=" + e(TX.tg)], [f ? "فیسبوک" : "Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + U + "&quote=" + e(TX.fb)]];
        sh.innerHTML = '<span class="lbl">' + (f ? "اشتراک‌گذاری این گواهی" : "Share this certificate") + '</span><div class="cdl">' + L.map(a => '<a class="btn" href="' + esc(a[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(a[0]) + '</a>').join("") + '<button type="button" class="btn" id="cdcp">' + (f ? "کپی متن" : "Copy text") + '</button></div><p class="muted cdn" role="status"></p>' + (code ? "" : '<p class="muted cdn">' + (f ? "این گواهی شمارهٔ اعتبارسنجی عمومی ندارد؛ در متن فقط نام و صادرکننده آمده است." : "This certificate has no public credential ID; the text only names the certificate and issuer.") + '</p>');
        $("#cdcp").onclick = () => { const m = $(".cdn", sh); const ok = () => { m.textContent = f ? "کپی شد" : "Copied"; }; if (navigator.clipboard) navigator.clipboard.writeText(TX.li).then(ok, ok); }; }
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
    $("#cdx").onclick = () => dlg.close();
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); }
  $("#cdx").textContent = T_.close;
  $("#expList").innerHTML = (S.experience || []).map(x => `<li><span class="lbl">${esc(tx(x.when))}</span><h3>${esc(x.org)}</h3><p class="rl">${esc(tx(x.role))}</p><p>${esc(tx(x.text))}</p>${taskList(x)}</li>`).join("");
  $("#exp").hidden = !(S.experience || []).length;
  $("#langList").innerHTML = (S.languages || []).map(l => `<li class="glass">${esc(tx(l))}</li>`).join("");
  document.getElementById("lang").hidden = !(S.languages || []).length;
  renderMap();
  $("#cNote").textContent = T_.cNote;
  { const CI = ["film", "spark", "book", "grid", "play", "award"]; $("#courseList").innerHTML = (S.courses || []).map((c, i) => `<a class="card glass ccv" href="course.html#${esc(c.id)}"><span class="ccv-c ccv-${i % 4}" aria-hidden="true">${icon(CI[i % CI.length])}<i></i><i></i></span><div class="ccv-b"><span class="lbl">${esc(T_.cSoon)}</span><h3>${esc(tx(c.title))}</h3><p>${esc(tx(c.text))}</p><p class="ccv-f"><span class="chip">${esc(T_.cLevel)}: ${esc(tx(c.level))}</span><span class="ccv-go">${lang === "fa" ? "مشاهده ←" : "View →"}</span></p>${pill(c.sample)}</div></a>`).join(""); }
  $("#courses").hidden = !(S.courses || []).length;

  /* profile header and tabs (stats are counted from the real data, nothing is typed in by hand) */
  { const l = lang === "fa" ? { c: T_.nContact, p: T_.nPress, tabs: [["work", T_.nWork], ["about", T_.nAbout], ["certs", T_.nCerts], ["courses", T_.nCourses]], st: [[(S.education || []).length, "تحصیل جاری"], [(S.certs || []).length, "گواهی"], [(S.languages || []).length, "زبان"], [(S.experience || []).length, "سابقه کار"]] }
      : { c: T_.nContact, p: T_.nPress, tabs: [["work", T_.nWork], ["about", T_.nAbout], ["certs", T_.nCerts], ["courses", T_.nCourses]], st: [[(S.education || []).length, "Current studies"], [(S.certs || []).length, "Certificates"], [(S.languages || []).length, "Languages"], [(S.experience || []).length, "Work history"]] };
    $("#pfAv").innerHTML = '<img src="assets/img/me-sq.webp" width="72" height="72" alt="">';
    $("#pfName").textContent = tx(S.name); $("#pfRole").textContent = tx(S.roles); $("#pfCity").textContent = tx(S.city);
    $("#pfContact").textContent = l.c; $("#pfPress").textContent = l.p;
    $("#pfStats").innerHTML = l.st.filter(x => x[0]).map(x => `<div><dd>${esc(x[0])}</dd><dt>${esc(x[1])}</dt></div>`).join("");
    $("#ptabs").innerHTML = l.tabs.map(([id, n]) => `<a href="#${id}" data-t="${id}">${esc(n)}</a>`).join("");
    if (!window.__ptio && "IntersectionObserver" in window) { window.__ptio = new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) { $$("#ptabs a").forEach(x => x.removeAttribute("aria-current")); const t = $(`#ptabs a[data-t="${en.target.id}"]`); if (t) t.setAttribute("aria-current", "true"); } }); }, { rootMargin: "-30% 0px -60% 0px" }); ["work", "about", "certs", "courses"].forEach(id => { const e = document.getElementById(id); if (e) window.__ptio.observe(e); }); }
  }
  const tt = $("#totop"); tt.textContent = "↑"; tt.setAttribute("aria-label", T_.toTop);
  $("#vidList").innerHTML = (S.playlists || []).map(v => `<a class="card glass" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer"><span class="lbl">YouTube</span><h3>${esc(tx(v.title))}</h3><p>${esc(T_.vidOpen)} ↗</p></a>`).join("");
  $("#vids").hidden = !(S.playlists || []).length;
  const shown = S.certs.filter(c => filter === "all" || (filter === "top" ? c.featured : c.cat === filter));
  $("#strip").innerHTML = shown.map((c, n) => {
    const title = LV(c.title) || T_.certTitle;
    const meta = [LV(c.issuer), c.year].filter(Boolean).join(" · ");
    const ver = SAFE_URL(c.verifyUrl) ? `<a class="vlink" href="${esc(c.verifyUrl)}" target="_blank" rel="noopener noreferrer">${esc(T_.verify)}</a>` : `<span class="lbl">${esc(T_.noVerify)}</span>`;
    return `<div class="fr"><div class="fcard"><span class="lbl">FR ${String(n + 1).padStart(2, "0")}</span>
      ${c.img ? `<button type="button" class="cth" data-c="${esc(c.id)}" aria-label="${esc(T_.zoom)}: ${esc(title)}"><img src="assets/certs/${esc(c.id)}-t.webp" alt="" loading="lazy" decoding="async" width="420" height="300"></button>` : ""}<div class="meta"><h3>${esc(title)}</h3>${pill(c.sample)}</div><p>${esc(T_.cats[c.cat])}${meta ? ". " + esc(meta) : ""}</p>${ver}</div></div>`;
  }).join("");

  const lau = $("#laurels"); lau.hidden = !S.laurels.length;
  $("#laurelList").innerHTML = S.laurels.map(l => {
    const u = SAFE_URL(l.url);
    const inner = `<span class="lbl">${esc(l.year || "")}</span><h3>${esc(tx(l.title))}</h3><p>${esc(l.event || "")}</p>`;
    return u ? `<a class="card glass" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : `<div class="card glass">${inner}</div>`;
  }).join("");

  $("#pressTease").textContent = T_.pressTease;
  $("#socials").innerHTML = S.socials.filter(s => s.show && SAFE_URL(s.url)).map(s => `<a class="glass" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${icon(s.label.toLowerCase())}${esc(s.label)}</a>`).join("");

  fillContact(T_);
}

function fillContact(T_, fb) {
  $("#contactIntro").textContent = T_.contactIntro;
  const typeSel = $("#f-type"), keep = typeSel.selectedIndex;
  typeSel.innerHTML = T_.types.map(x => `<option>${esc(x)}</option>`).join(""); typeSel.selectedIndex = Math.max(0, keep);
  $("#l-name").textContent = T_.fName; $("#l-email").textContent = T_.fEmail; $("#l-type").textContent = T_.fType; $("#l-msg").textContent = T_.fMsg; $("#l-consent").textContent = T_.fConsent;
  $("#f-send").textContent = T_.send;
  const em = $("#emailLine") || { };
  const rows = [];
  if (S.contactEmail) rows.push(`<a class="cl" href="mailto:${esc(S.contactEmail)}">${icon("mail")}<span dir="ltr">${esc(S.contactEmail)}</span></a>`);
  if (S.phone) { const d = S.phone.replace(/[^\d]/g, ""); rows.push(`<a class="cl" href="tel:+${d}">${icon("phone")}<span dir="ltr">${esc(S.phone)}</span></a>`, `<a class="cl" href="https://wa.me/${d}" target="_blank" rel="noopener noreferrer">${icon("chat")}<span>WhatsApp</span></a>`); }
  if ("hidden" in em || em.nodeType) { em.hidden = !rows.length; em.innerHTML = rows.join(""); }
  if (fb) { $("#contactIntro").textContent = fb.intro; typeSel.innerHTML = fb.types.map(x => `<option>${esc(x)}</option>`).join(""); }
  const sd = $("#cxSide"); if (sd) sd.innerHTML = `<h2>${esc(lang === "fa" || lang === "ps" ? "راه‌های ارتباط" : "Ways to reach me")}</h2><div class="cx-rows">${rows.join("")}</div><p class="muted">${esc(lang === "fa" || lang === "ps" ? "معمولاً پیام‌ها را خودم می‌خوانم و پاسخ می‌دهم. زمان پاسخ را وعده نمی‌دهم." : "I read and answer messages myself. I do not promise a response time.")}</p>`;
}
const FAQ = {
  fa: [["آکادمی سینه‌کد چیست؟", "یک آکادمی آنلاین رایگان برای یادگیری ویدیو، تدوین و طراحی گرافیک، همراه با کتابخانه منابع و گواهی پایان دوره."], ["گواهی چگونه صادر می‌شود؟", "گواهی فقط بعد از قبولی در آزمون دوره صادر می‌شود. هر گواهی کد دارد و در صفحهٔ بررسی گواهی قابل راستی‌آزمایی است."], ["چگونه صحت یک گواهی را بررسی کنم؟", "کد گواهی را در صفحهٔ «مدارک» (verify) وارد کن. اگر کد در فهرست باشد، اطلاعات آن نشان داده می‌شود."], ["ثبت‌نام و ورود چگونه است؟", "از دکمهٔ «شروع یادگیری» حساب بساز و با «ورود» وارد شو. اگر سرور حساب‌ها در دسترس نباشد، دوباره امتحان کن."], ["برای سفارش طراحی یا ویدیو چه کنم؟", "به صفحهٔ خدمات برو و فرم سفارش را پر کن، یا از صفحهٔ تماس پیام بفرست. قیمت و زمان را بعد از دیدن پروژه با هم هماهنگ می‌کنیم."], ["نمونه‌کارها از چه کسانی است؟", "نمونه‌ها کارهای طراحی خودم است. نام و لوگوی برندهای داخل کارها متعلق به صاحبان آن‌هاست."], ["اطلاعات من چه می‌شود؟", "فقط برای پاسخ دادن به پیام تو استفاده می‌شود. جزئیات در صفحهٔ حریم خصوصی است."], ["سایت به چند زبان است؟", "فارسی، پشتو و انگلیسی. زبان را از منوی بالا عوض کن."], ["مشکل یا پیشنهاد دارم", "از صفحهٔ بازخورد برایم بنویس. همهٔ پیام‌ها را می‌خوانم."]],
  en: [["What is CineCode Academy?", "A free online academy for learning video, editing and graphic design, with a study library and a completion certificate."], ["How is a certificate issued?", "A certificate is issued only after passing the course exam. Each certificate has a code that can be checked on the verification page."], ["How do I verify a certificate?", "Enter the certificate code on the Certificates verification page. If the code is on record, its details are shown."], ["How do sign-up and login work?", "Use Start learning to create an account and Login to sign in. If the accounts server is unreachable, try again later."], ["How do I order design or video work?", "Open the Services page and fill in the order form, or write from the Contact page. We agree price and timing after I see the project."], ["Whose work is shown in the portfolio?", "The samples are my own design work. Brand names and logos inside the pieces belong to their owners."], ["What happens to my data?", "It is used only to reply to your message. Details are on the Privacy page."], ["Which languages does the site support?", "Persian, Pashto and English. Switch from the top menu."], ["I have a problem or suggestion", "Write to me from the Feedback page. I read every message."]]
};
function renderContact() {
  const T_ = T(), fa = lang !== "en";
  const fb = PAGE === "feedback" ? (fa ? { intro: "مشکلی دیدی یا پیشنهادی داری؟ اینجا بنویس تا سایت را بهتر کنم.", types: ["پیشنهاد", "گزارش مشکل", "اشتباه در محتوا", "نظر دربارهٔ دوره", "سایر"] } : { intro: "Found a problem or have an idea? Tell me so I can improve the site.", types: ["Suggestion", "Problem report", "Content error", "About a course", "Other"] }) : null;
  fillContact(T_, fb);
  const ti = PAGE === "feedback" ? T_.nFeedback : T_.nContact;
  const px = $("#px"); if (px) px.innerHTML = `<span class="lbl">${esc(tx(S.name))}</span><h1 class="ph1">${esc(ti)}</h1>`;
  document.title = ti + " | " + tx(S.name);
  crumbs(ti);
  if (PAGE === "contact") renderMap();
}
function crumbs(t) { const c = $("#crumbs"); if (c) c.innerHTML = `<a href="index.html">${esc(T().nHome)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(t)}</span>`; }
function renderFaq() {
  const fa = lang !== "en", L = FAQ[fa ? "fa" : "en"], ti = T().nFaq;
  $("#px").innerHTML = `<span class="lbl">${esc(tx(S.name))}</span><h1 class="ph1">${esc(ti)}</h1>`;
  $("#faqList").innerHTML = L.map(([q, a]) => `<details class="fq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  $("#faqCta").innerHTML = `<p>${esc(fa ? "جوابت را پیدا نکردی؟" : "Did not find your answer?")}</p><a class="btn go" href="contact.html">${esc(T().nContact)}</a>`;
  document.title = ti + " | " + tx(S.name); crumbs(ti);
}

function setupForm() {
  const form = $("#form"), st = $("#f-status");
  const say = (msg, kind) => { st.textContent = msg; st.className = "fstatus " + (kind || ""); };
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (form.dataset.busy) return;
    const T_ = T();
    if (form.elements.website.value) return; /* honeypot: bots fill this hidden field */
    const name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), msg = form.elements.message.value.trim();
    if (!name) return say(T_.errName, "err");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say(T_.errEmail, "err");
    if (msg.length < 10) return say(T_.errMsg, "err");
    if (!form.elements.consent.checked) return say(T_.errConsent, "err");
    const data = { name, email, type: form.elements.type.value, message: msg };
    if (S.formKey) { data.access_key = S.formKey; data.subject = "Portfolio: " + data.type; }
    const composed = `${data.type}\n${data.name} <${data.email}>\n\n${data.message}`;
    if (!SAFE_URL(S.formEndpoint) && !SB.on()) {
      say(T_.notConnected, "err");
      const b = document.createElement("button"); b.type = "button"; b.className = "btn"; b.textContent = T_.copy;
      b.onclick = () => copyText(composed, b); st.appendChild(document.createTextNode(" ")); st.appendChild(b);
      return;
    }
    const btn = $("#f-send"); form.dataset.busy = "1"; btn.disabled = true; btn.textContent = T_.sending;
    /* 1) save in our own inbox (Supabase) so the admin can read it; 2) also send through the form service. Success if either works. */
    let dbOk = false;
    if (SB.on()) { try { const r = await SB.send("POST", "rpc/submit_contact", { p_name: name, p_email: email, p_category: data.type, p_message: msg }); dbOk = !!(r && r.ok); } catch (err) {} }
    let svcOk = false;
    if (SAFE_URL(S.formEndpoint)) { try { const r = await fetch(S.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) }); svcOk = r.ok; } catch (err) {} }
    if (dbOk || svcOk) { say(T_.okSent, "ok"); form.reset(); try { if (window.__track) window.__track("contact_submit"); } catch (err) {} } else say(T_.errSend, "err");
    btn.disabled = false; btn.textContent = T_.send; delete form.dataset.busy;
  });
}

/* ---------- timeline bar (home only) ---------- */
let q = 0;
const secs = () => [$("#home"), ...$$("main section[data-nav]:not([hidden])")].filter(Boolean);
const CLIPC = ["--accent", "--warm", "--accent", "--hot", "--warm", "--accent", "--hot", "--accent"];
function layoutClips() {
  const c = $("#clips"); if (!c) return;
  c.innerHTML = secs().map((el, n) => {
    const h = Math.max(60, el.offsetHeight);
    return `<div class="clip" style="flex:${h} 1 0;--c:var(${CLIPC[n % CLIPC.length]})">${esc(T()[el.dataset.nav || "nHome"])}</div>`;
  }).join("");
  upd();
}
function upd() {
  const tl = $("#tl"); if (!tl) return;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), pr = Math.min(1, Math.max(0, scrollY / max));
  tl.style.setProperty("--p", pr.toFixed(4));
  $("#tlcode").textContent = fmt(Math.floor(pr * 180 * 24));
  let a = 0; secs().forEach((el, n) => { if (el.getBoundingClientRect().top <= innerHeight * .4) a = n; });
  $$(".clip").forEach((c, n) => c.classList.toggle("on", n === a));
}
function setupTimeline() {
  addEventListener("scroll", () => { if (!q) q = requestAnimationFrame(() => { q = 0; upd(); }); }, { passive: true });
  addEventListener("resize", layoutClips);
  const tl = $("#tl");
  const scrub = e => {
    const r = tl.getBoundingClientRect(); let x = (e.clientX - r.left) / r.width; if (R.dir === "rtl") x = 1 - x;
    x = Math.min(1, Math.max(0, x));
    scrollTo({ top: x * (document.documentElement.scrollHeight - innerHeight), behavior: "instant" });
  };
  tl.addEventListener("pointerdown", e => { tl.setPointerCapture(e.pointerId); scrub(e); });
  tl.addEventListener("pointermove", e => { if (tl.hasPointerCapture(e.pointerId)) scrub(e); });
}

/* ---------- lens, background and tilt (home only) ---------- */
let running = false, loopFn = null;
function startLoop() { if (loopFn && !running) { running = true; requestAnimationFrame(loopFn); } }
function setupMotion() {
  if (!$("#lens")) return; /* the 3D lens was removed from the hero */
  const lens = $("#lens"), bg = $("#bg"), tcEl = $("#tc");
  const t0 = performance.now();
  let px = 0, py = 0, last = -1e9, cx = 0, cy = 0, sy = -1;
  addEventListener("pointermove", e => { px = Math.max(-1, Math.min(1, (e.clientX / innerWidth - .5) * 2)); py = Math.max(-1, Math.min(1, (e.clientY / innerHeight - .5) * 2)); last = performance.now(); }, { passive: true });
  let vis = true, lastTc = 0;
  if ("IntersectionObserver" in window) new IntersectionObserver(e => { vis = e[0].isIntersecting; if (vis) startLoop(); }).observe($("#home"));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) startLoop(); });
  loopFn = now => {
    if (R.classList.contains("lite") || !vis || document.hidden) { running = false; return; }
    if (now - lastTc > 120) { lastTc = now; tcEl.textContent = fmt(Math.floor((now - t0) / 1000 * 24)); }
    const live = now - last < 2500, tx_ = live ? px : Math.sin(now / 2600) * .55, ty_ = live ? py : Math.cos(now / 3300) * .3;
    cx += (tx_ - cx) * .08; cy += (ty_ - cy) * .08;
    lens.style.setProperty("--rx", (-cy * 16 - 4).toFixed(2) + "deg");
    lens.style.setProperty("--ry", (cx * 24 + 8).toFixed(2) + "deg");
    requestAnimationFrame(loopFn);
  };
  if (!R.classList.contains("lite")) startLoop();
  if (!still && matchMedia("(hover: hover)").matches) {
    const g = $("#workGrid");
    g.addEventListener("pointermove", e => { const c = e.target.closest(".card"); if (!c) return; const r = c.getBoundingClientRect();
      c.style.setProperty("--ty", (((e.clientX - r.left) / r.width - .5) * 9).toFixed(2) + "deg");
      c.style.setProperty("--tx", ((.5 - (e.clientY - r.top) / r.height) * 9).toFixed(2) + "deg"); });
    g.addEventListener("pointerout", e => { const c = e.target.closest(".card"); if (c) { c.style.setProperty("--tx", "0deg"); c.style.setProperty("--ty", "0deg"); } });
  }
  const intro = $("#intro"); let seen = false;
  try { seen = sessionStorage.getItem("am-seen") === "1"; sessionStorage.setItem("am-seen", "1"); } catch (e) {}
  if (seen || R.classList.contains("lite")) intro.remove(); else setTimeout(() => intro.remove(), 2400);
}

/* =====================================================================
   PROJECT PAGE  (address looks like project.html#p1)
   ===================================================================== */
function renderProject() {
  const T_ = T(), root = $("#project"), fa = lang === "fa";
  const id = decodeURIComponent(location.hash.slice(1));
  const idx = S.projects.findIndex(x => x.id === id), p = S.projects[idx];
  const catName = c => c === "design" ? T_.cats.designW : T_.cats[c];
  const L = fa ? { pj: "پروژه‌ها", works: "نمونه‌کارها", lead: "پروژه‌های ویدیویی و تدوین من. فقط کارهای واقعی به‌عنوان پروژه منتشر می‌شوند.", none: "هنوز پروژهٔ ویدیویی منتشر نشده", noneP: "کارهای طراحی واقعی من در بخش نمونه‌کارها هستند. پروژه‌های ویدیویی بعد از آماده شدن اینجا می‌آیند.", seeW: "دیدن نمونه‌کارهای طراحی", svc: "سفارش پروژه", slots: "جایگاه‌های رزروشده (محتوای نمونه)", slotsP: "این‌ها پروژهٔ واقعی نیستند؛ فقط قالب صفحه هستند تا محتوا اضافه شود.", ph: "قالب نمونه", phN: "این صفحه قالب است، نه کار واقعی. اطلاعات این پروژه هنوز اضافه نشده است.", need: "برای تکمیل لازم است", info: "اطلاعات پروژه", prev: "قبلی", next: "بعدی", all: "همهٔ پروژه‌ها", story: "داستان پروژه", m: { title: "عنوان", summary: "توضیح کوتاه", year: "سال", role: "نقش", tools: "ابزارها", video: "ویدیو یا لینک یوتیوب", brief: "خلاصهٔ کار", process: "روند", result: "نتیجه", img: "تصویر کاور" } } : { pj: "Projects", works: "Works", lead: "My video and editing projects. Only real work is published as a project.", none: "No video project has been published yet", noneP: "My real design work is in the Works section. Video projects will appear here once they are ready.", seeW: "See design works", svc: "Order a project", slots: "Reserved slots (placeholder content)", slotsP: "These are not real projects. They are page templates waiting for content.", ph: "Template", phN: "This page is a template, not finished work. Its project details have not been added yet.", need: "Needed to complete it", info: "Project details", prev: "Previous", next: "Next", all: "All projects", story: "The story", m: { title: "Title", summary: "Short description", year: "Year", role: "Role", tools: "Tools", video: "Video or YouTube link", brief: "Brief", process: "Process", result: "Result", img: "Cover image" } };
  const crumbs = last => `<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(T_.nHome)}</a> / <a href="works.html">${esc(L.works)}</a> / ${last}</nav>`;
  const ttl = (q_, n) => q_.title ? tx(q_.title) : `${T_.projectTitle} ${n + 1}`;
  if (!p) {
    document.title = L.pj + " | " + tx(S.name);
    const real = S.projects.map((q_, n) => ({ q_, n })).filter(o => !o.q_.sample), slots = S.projects.map((q_, n) => ({ q_, n })).filter(o => o.q_.sample);
    const card = ({ q_, n }) => `<a class="pjc" href="#${esc(q_.id)}"><div class="thumb" style="--x:${esc(q_.x)};--y:${esc(q_.y)}${pcover(q_)}"><span>${esc(q_.tc)}</span></div><div class="pjc-b"><h2>${esc(ttl(q_, n))}</h2><p>${esc(catName(q_.cat))}${q_.year ? " · " + esc(q_.year) : ""}</p></div></a>`;
    root.innerHTML = `${crumbs(`<span aria-current="page">${esc(L.pj)}</span>`)}<header class="pjl-hd"><span class="lbl">${esc(tx(S.name))}</span><h1 class="ph1">${esc(L.pj)}</h1><p>${esc(L.lead)}</p></header>
    ${real.length ? `<div class="pjl-grid">${real.map(card).join("")}</div>` : `<section class="pjl-empty"><span class="pjl-ic" aria-hidden="true">${icon("film")}</span><div><h2>${esc(L.none)}</h2><p>${esc(L.noneP)}</p><div class="pjl-cta"><a class="btn go" href="works.html">${esc(L.seeW)}</a><a class="btn" href="services.html">${esc(L.svc)}</a></div></div></section>`}
    ${slots.length ? `<details class="pjl-slots"><summary>${esc(L.slots)} <i>${slots.length}</i></summary><p>${esc(L.slotsP)}</p><ul>${slots.map(({ q_, n }) => `<li><a href="#${esc(q_.id)}"><span>${esc(ttl(q_, n))}</span><small>${esc(catName(q_.cat))}</small><em>${esc(L.ph)}</em></a></li>`).join("")}</ul></details>` : ""}`;
    return;
  }
  const title = ttl(p, idx), dash = T_.unknown;
  document.title = title + " | " + tx(S.name);
  const okImg = a => (a || []).filter(b => b && /^[\w./-]+$/.test(b.img || "") && b.img.indexOf("..") < 0);
  const miss = [["title", p.title], ["summary", p.summary], ["year", p.year], ["role", p.role], ["tools", p.tools && p.tools.length], ["video", p.youtube], ["brief", p.brief], ["process", p.process], ["result", p.result], ["img", p.img]].filter(x => !x[1]).map(x => L.m[x[0]]);
  const video = p.youtube && /^[\w-]{6,20}$/.test(p.youtube)
    ? `<button class="vid" type="button" data-yt="${esc(p.youtube)}" aria-label="${esc(T_.play)}"><span class="play" aria-hidden="true"></span><span class="lbl">${esc(T_.play)}</span></button>`
    : `<div class="vid empty" role="img" aria-label="${esc(T_.noVideo)}" style="--x:${esc(p.x)};--y:${esc(p.y)}${pcover(p)}"><span class="lbl">${esc(T_.noVideo)}</span></div>`;
  const ext = [["behance", "Behance"], ["link", fa ? "پیوند پروژه" : "Project link"]].map(([k, n]) => (typeof p[k] === "string" && /^https:\/\/[^\s"'<>]{4,300}$/.test(p[k])) ? `<a class="btn" href="${esc(p[k])}" target="_blank" rel="noopener noreferrer">${esc(n)} ↗</a>` : "").join("");
  const csHTML = [["csBrief", p.brief], ["csProcess", p.process], ["csResult", p.result]].filter(x => x[1]).map(([k, v]) => `<section class="pjd-sec"><h2>${esc(T_[k])}</h2><p>${esc(tx(v))}</p></section>`).join("");
  const ba = p.beforeAfter && !p.sample ? `<section class="pjd-sec"><h2>${esc(T_.baTitle)}</h2><div class="ba" style="--pos:50%"><div class="ba-a"><span class="lbl">${esc(T_.before)}</span></div><div class="ba-b"><span class="lbl">${esc(T_.after)}</span></div><input type="range" min="0" max="100" value="50" aria-label="${esc(T_.baLabel)}"></div></section>` : "";
  const bt = okImg(p.bts), bts = bt.length ? `<section class="pjd-sec"><h2>${esc(fa ? "پشت صحنه" : "Behind the scenes")}</h2><div class="bts">${bt.map(b => `<figure><img src="${esc(b.img)}" alt="${esc(b.text ? tx(b.text) : "")}" loading="lazy" decoding="async"><figcaption>${esc(b.text ? tx(b.text) : "")}</figcaption></figure>`).join("")}</div></section>` : "";
  const tg = p.tags || {}, extra = [["tgClient", tg.client], ["tgScale", tg.scale], ["tgIndustry", tg.industry], ["tgCountry", tg.country], ["tgOutcome", tg.outcome]].filter(x => x[1]).map(([k, v]) => [T_[k], LV(v)]);
  const facts = [[T_.year, p.year || dash], [T_.role, p.role ? tx(p.role) : catName(p.cat)], [T_.duration, p.tc], ...extra];
  const credits = p.credits && p.credits.length ? `<h3>${esc(T_.credits)}</h3><dl class="pjd-f">${p.credits.map(c => `<div><dt>${esc(tx(c.k))}</dt><dd>${esc(c.v)}</dd></div>`).join("")}</dl>` : "";
  const prev = S.projects[idx - 1], next = S.projects[idx + 1];
  root.innerHTML = `${crumbs(`<a href="project.html">${esc(L.pj)}</a> / <span aria-current="page">${esc(title)}</span>`)}
  ${p.sample ? `<aside class="pjd-note" role="note"><b>${esc(L.ph)}</b><p>${esc(L.phN)}</p>${miss.length ? `<details><summary>${esc(L.need)} (${miss.length})</summary><ul>${miss.map(m => `<li>${esc(m)}</li>`).join("")}</ul></details>` : ""}</aside>` : ""}
  <header class="pjd-hd"><span class="lbl">${esc(catName(p.cat))}</span><h1 class="ph1">${esc(title)}</h1>${p.summary ? `<p class="pjd-sum">${esc(tx(p.summary))}</p>` : ""}</header>
  <div class="pjd"><div class="pjd-main">${video}${ext ? `<div class="pjd-ext">${ext}</div>` : ""}${csHTML}${ba}${bts}</div>
    <aside class="pjd-side" aria-label="${esc(L.info)}"><h2>${esc(L.info)}</h2><dl class="pjd-f">${facts.map(f => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join("")}</dl>
      <h3>${esc(T_.tools)}</h3>${p.tools && p.tools.length ? `<ul class="chips">${p.tools.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : `<p class="muted">${esc(dash)}</p>`}${credits}
      <a class="btn go" href="contact.html">${icon("mail")} ${esc(T_.nContact)}</a></aside></div>
  <nav class="pjd-nav" aria-label="${esc(L.pj)}">${prev ? `<a class="btn" href="#${esc(prev.id)}">${fa ? "→" : "←"} ${esc(L.prev)}</a>` : "<span></span>"}<a class="btn" href="project.html">${esc(L.all)}</a>${next ? `<a class="btn" href="#${esc(next.id)}">${esc(L.next)} ${fa ? "←" : "→"}</a>` : "<span></span>"}</nav>`;
  const vb = $(".vid[data-yt]", root);
  if (vb) vb.onclick = () => {
    const f = document.createElement("iframe"); f.className = "vid"; f.title = title;
    f.src = "https://www.youtube-nocookie.com/embed/" + vb.dataset.yt + "?autoplay=1&rel=0";
    f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true; f.referrerPolicy = "strict-origin-when-cross-origin";
    vb.replaceWith(f);
  };
  const rng = $(".ba input", root);
  if (rng) rng.addEventListener("input", () => { rng.parentElement.style.setProperty("--pos", rng.value + "%"); });
}


/* =====================================================================
   SIGN IN PAGE (talks to Supabase Auth over its public REST API once supabaseUrl and supabaseAnonKey are set)
   ===================================================================== */
/* ---------- Supabase client (public REST only; the browser holds just the public key and the user's own session) ---------- */
const SB = {
  on: () => !!(SAFE_URL(S.supabaseUrl) && S.supabaseAnonKey),
  base: () => S.supabaseUrl.replace(/\/$/, ""),
  get() { try { return JSON.parse(localStorage.getItem("am-sb")); } catch (e) { return null; } },
  set(s) { try { s ? localStorage.setItem("am-sb", JSON.stringify(s)) : localStorage.removeItem("am-sb"); } catch (e) {} },
  keep(j, email) { if (!j || !j.access_token) return null; const s = { t: j.access_token, r: j.refresh_token, exp: j.expires_at || (Math.floor(Date.now() / 1000) + (j.expires_in || 3600)), id: j.user && j.user.id, email: (j.user && j.user.email) || email, name: j.user && j.user.user_metadata && j.user.user_metadata.full_name }; this.set(s); return s; },
  async auth(path, body) {
    const r = await fetch(this.base() + "/auth/v1/" + path, { method: "POST", headers: { "Content-Type": "application/json", apikey: S.supabaseAnonKey }, body: JSON.stringify(body) });
    return { ok: r.ok, j: await r.json().catch(() => ({})) };
  },
  async token() {
    const s = this.get(); if (!s) return null;
    if (s.exp - 60 > Date.now() / 1000) return s.t;
    const r = await this.auth("token?grant_type=refresh_token", { refresh_token: s.r });
    if (r.ok && r.j.access_token) { const n = this.keep(r.j, s.email); return n && n.t; }
    this.set(null); return null;
  },
  async rest(path) {
    const t = await this.token(); const h = { apikey: S.supabaseAnonKey, Accept: "application/json" }; if (t) h.Authorization = "Bearer " + t;
    const r = await fetch(this.base() + "/rest/v1/" + path, { headers: h });
    if (!r.ok) throw new Error("rest " + r.status);
    return r.json();
  },
  async out() { const t = await this.token(); try { if (t) await fetch(this.base() + "/auth/v1/logout", { method: "POST", headers: { apikey: S.supabaseAnonKey, Authorization: "Bearer " + t } }); } catch (e) {} this.set(null); }
};

/* ---------- live course (Supabase): enroll, lesson player, progress ---------- */
SB.send = async function (method, path, body, prefer) {
  const t = await this.token(); const h = { apikey: S.supabaseAnonKey, "Content-Type": "application/json", Accept: "application/json" };
  if (t) h.Authorization = "Bearer " + t; if (prefer) h.Prefer = prefer;
  const r = await fetch(this.base() + "/rest/v1/" + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => null); if (!r.ok) { const e = new Error("send " + r.status); e.status = r.status; e.j = j; throw e; } return j;
};
window.__SB = SB;
const LC = {
  fa: { live: "دوره زنده", enr: "ثبت‌نام رایگان در دوره", enrd: "در این دوره ثبت‌نام کرده‌ای", login: "برای ثبت‌نام وارد شو", les: "درس", watch: "پخش", done: "کامل شد", pct: "پیشرفت", lock: "بعد از ثبت‌نام باز می‌شود", err: "انجام نشد. دوباره امتحان کن.", already: "قبلاً ثبت‌نام کرده‌ای.", min: "دقیقه", pl: "پخش درس", note: "پیشرفت فقط وقتی ثبت می‌شود که ویدیو واقعاً پخش شود.", play: "پخش", pause: "مکث", back: "۱۰ ثانیه عقب", speed: "سرعت", full: "تمام‌صفحه", fast: "سرعت بالاتر از ۱× مجاز نیست.", noSkip: "جلو زدن مجاز نیست. ویدیو را تا آخر ببین.", wait: "پخش‌کننده در حال آماده شدن است…", slow: "ویدیو شروع نشد؟ اینترنت یا یوتیوب ممکن است کند باشد.", basic: "پخش‌کننده ساده", basicNote: "پخش‌کننده ساده فعال شد. در این حالت پیشرفت درس ثبت نمی‌شود؛ بعداً دوباره با پخش‌کننده اصلی ببین.", askT: "هنوز آنجایی؟", askP: "برای ادامه تأیید کن. ثانیه باقی‌مانده:", askB: "من اینجا هستم", askOut: "ویدیو برای عدم فعالیت متوقف شد.", resume: "ادامه ویدیو", lockPrev: "اول درس قبلی را کامل ببین", rules: "قوانین: جلو زدن ممکن نیست، سرعت فقط ۱× یا کندتر، و هر چند دقیقه باید حضورت را تأیید کنی." },
  en: { live: "Live course", enr: "Enroll for free", enrd: "You are enrolled in this course", login: "Sign in to enroll", les: "Lesson", watch: "Watch", done: "Completed", pct: "Progress", lock: "Unlocks after you enroll", err: "That did not work. Try again.", already: "You are already enrolled.", min: "min", pl: "Lesson player", note: "Progress is only recorded while the video is really playing.", play: "Play", pause: "Pause", back: "Back 10 s", speed: "Speed", full: "Fullscreen", fast: "Speeds above 1× are not allowed.", noSkip: "Skipping ahead is not allowed. Watch to the end.", wait: "The player is getting ready…", slow: "Video did not start? Your connection or YouTube may be slow.", basic: "Basic player", basicNote: "Basic player is on. Progress is NOT recorded in this mode; watch again later with the main player.", askT: "Are you still there?", askP: "Confirm to continue. Seconds left:", askB: "I am here", askOut: "The video paused because of inactivity.", resume: "Resume video", lockPrev: "Finish the previous lesson first", rules: "Rules: no skipping ahead, speed 1× or slower, and you confirm you are present every few minutes." }
};
async function liveCourse(id, root, C0) {
  if (!SB.on() || !/^[\w-]+$/.test(id || "")) return;
  const L = LC[lang], q = encodeURIComponent(id);
  let course, lessons;
  const why = (fa_msg, en_msg) => { const m = $("#cmsg", root), n = $(".cnote", root); const t = lang === "fa" ? fa_msg : en_msg; if (n) n.textContent = ""; if (m) { m.textContent = t; m.className = "fstatus err"; m.setAttribute("role", "alert"); } };
  try {
    course = (await SB.rest(`courses?id=eq.${q}&select=id,title,summary`))[0];
    if (!course) { why("این دوره در پایگاه‌داده پیدا نشد. در پنل ادمین چک کن: دوره با همین شناسه (" + id + ") ساخته شده و وضعیتش «منتشرشده» است؟" + (SB.get() ? "" : " اگر منتشر شده، یک بار وارد حساب شو."), "This course was not found. In the admin panel check that a course with this id (" + id + ") exists and is set to Published." + (SB.get() ? "" : " If it is published, try signing in first.")); return; }
    lessons = await SB.rest(`lessons?course_id=eq.${q}&select=id,position,title,youtube_id,duration_sec&order=position`);
  } catch (e) { why("بارگذاری دوره از پایگاه‌داده خطا داد (" + String(e && e.message || e).replace(/^rest /, "کد ") + "). اگر تازه SQL زده‌ای چند ثانیه صبر کن و رفرش کن.", "Loading the course failed (" + String(e && e.message || e) + "). If you just ran SQL, wait a few seconds and refresh."); return; }
  if (!lessons.length) { const n0 = $(".cnote", root); if (n0) n0.textContent = ""; }
  const ses = SB.get(); let enrolled = false, prog = {};
  if (ses) { try {
    enrolled = (await SB.rest(`enrollments?course_id=eq.${q}&select=course_id`)).length > 0;
    if (enrolled && lessons.length) (await SB.rest(`lesson_progress?lesson_id=in.(${lessons.map(l => l.id).join(",")})&select=lesson_id,watched_sec,completed`)).forEach(r => prog[r.lesson_id] = r);
  } catch (e) {} }
  const ttl = o => (o && typeof o === "object") ? (o[lang] || o.en || o.fa || "") : (o || "");
  const lt = $(".ltab", root), btn = $("#cenr"), msg = $("#cmsg"); if (!lt || !btn) return;
  const h1 = $(".ph1", root); if (h1 && ttl(course.title)) h1.textContent = ttl(course.title);
  const nt = $(".cnote", root); if (nt) nt.textContent = L.note;
  const done = lessons.filter(l => prog[l.id] && prog[l.id].completed).length;
  const locked = i => enrolled && i > 0 && !(prog[lessons[i - 1].id] && prog[lessons[i - 1].id].completed);
  const rows = lessons.map((l, i) => { const p = prog[l.id], ok = p && p.completed, lk = locked(i), mins = l.duration_sec ? Math.max(1, Math.round(l.duration_sec / 60)) + " " + L.min : "—";
    return `<div class="lrow${enrolled && !lk ? "" : " lk"}"><span class="ln">${esc(L.les)} ${i + 1}</span><span class="lt">${icon(enrolled && !lk ? "play" : "lock")}${esc(ttl(l.title))}${ok ? ` <b class="lok">✓ ${esc(L.done)}</b>` : ""}</span>${enrolled && !lk ? `<button type="button" class="btn lpl" data-l="${esc(l.id)}">${esc(L.watch)}</button>` : `<span class="ld">${esc(lk ? L.lockPrev : mins)}</span>`}</div>`; }).join("");
  lt.innerHTML = `<div class="lhead"><span>${esc(L.les)}</span><span></span><span>${esc(enrolled ? L.pct + " " + done + "/" + lessons.length : L.lock)}</span></div>${rows}<div id="lplay" role="region" aria-label="${esc(L.pl)}"></div>`;
  if (enrolled && window.__exam) window.__exam.mount({ root: lt.parentNode, course: id, lessons, prog, lang, ttl, SB, reload: () => liveCourse(id, root, C0) });
  btn.disabled = false;
  if (enrolled) { btn.innerHTML = "✓ " + esc(L.enrd); btn.disabled = true; }
  else if (!ses) { btn.innerHTML = esc(L.login); btn.onclick = () => { location.href = "auth.html"; }; }
  else btn.onclick = async () => { btn.disabled = true; try { let pf = null; try { pf = (await SB.rest(`profiles?select=full_name,gender,birth_year,country,phone,education,terms_accepted_at&id=eq.${ses.id}`))[0]; } catch (e) {} const okp = pf && pf.full_name && pf.full_name.trim().length >= 3 && pf.gender && pf.birth_year && pf.country && pf.phone && pf.phone.length >= 6 && pf.education && pf.terms_accepted_at; if (pf && !okp) { btn.disabled = false; const MS = [["full_name", "نام کامل", "Full name", v => v && v.trim().length >= 3], ["gender", "جنسیت", "Gender"], ["birth_year", "سال تولد", "Birth year"], ["country", "کشور", "Country"], ["phone", "شمارهٔ تلفن", "Phone", v => v && v.length >= 6], ["education", "تحصیلات", "Education"], ["terms_accepted_at", "پذیرش شرایط", "Accept terms"]].filter(m => !(m[3] ? m[3](pf[m[0]]) : pf[m[0]])).map(m => lang === "fa" ? m[1] : m[2]).join(lang === "fa" ? "، " : ", "); msg.innerHTML = esc((lang === "fa" ? "برای ثبت‌نام این بخش‌های پروفایل کم است: " : "To enroll, finish these profile fields: ") + MS + ". ") + `<a href="account.html#profile">${esc(lang === "fa" ? "تکمیل پروفایل" : "Complete profile")}</a>`; msg.className = "fstatus err"; return; } await SB.send("POST", "enrollments", { user_id: ses.id, course_id: id }, "return=minimal"); liveCourse(id, root, C0); } catch (e) { btn.disabled = false; const ej = e.j || {}, ec = String(ej.code || ""), fa_ = lang === "fa", em = (ej.message || ej.hint || "").toString().slice(0, 140);
    if (e.status === 401 || /jwt|expired/i.test(em)) { msg.innerHTML = esc(fa_ ? "نشست تو تمام شده است. دوباره وارد شو. " : "Your session expired. Please sign in again. ") + `<a href="auth.html">${esc(fa_ ? "ورود" : "Sign in")}</a>`; msg.className = "fstatus err"; return; }
    if (e.status === 409 && ec === "23503") { msg.textContent = fa_ ? "ثبت‌نام نشد: این دوره یا پروفایل تو در پایگاه داده پیدا نشد. (کد: 23503) این را به مدیر سایت بگو." : "Could not enroll: this course or your profile was not found in the database (code 23503). Tell the site admin."; msg.className = "fstatus err"; return; }
    if (e.status === 403 || ec === "42501") { msg.innerHTML = esc(lang === "fa" ? "اول پروفایلت را کامل کن. " : "Complete your profile first. ") + `<a href="account.html#profile">${esc(lang === "fa" ? "تکمیل پروفایل" : "Complete profile")}</a>`; msg.className = "fstatus err"; return; } if (e.status === 409) { msg.textContent = L.already; msg.className = "fstatus err"; liveCourse(id, root, C0); return; }
    msg.textContent = L.err + " (" + (e.status || "network") + (ec ? " " + ec : "") + (em ? ": " + em : "") + ")"; msg.className = "fstatus err"; } };
  if (!enrolled) return;
  const box = $("#lplay", root); let cc = 0, mutedK = 0, links = null, timer = 0, curL = null, last = 0, st = -1, maxOk = 0, rate = 1, dur = 0, played = 0, nextAsk = 0, asking = false, askT = 0, lastT = 0, f = null, ready = false, want = false, hs = 0, slowT = 0;
  const post = (func, args) => { try { f && f.contentWindow.postMessage(JSON.stringify({ event: "command", func, args: args === undefined ? "" : args }), "*"); } catch (e) {} };
  const stop = () => { clearInterval(timer); timer = 0; };
  const report = async () => { if (!curL || last < 1 || asking) return; try { const r = await SB.send("POST", "rpc/report_progress", { p_lesson: curL.id, p_watched: Math.floor(maxOk) }); const x = Array.isArray(r) ? r[0] : r; if (x) { prog[curL.id] = { lesson_id: curL.id, watched_sec: x.watched_sec, completed: x.completed }; if (x.completed && !curL.__done) { curL.__done = 1; setTimeout(() => liveCourse(id, root, C0), 1200); } } } catch (e) {} };
  const say = m => { const n = $("#lnote", box); if (n) { n.textContent = m; clearTimeout(n.__t); n.__t = setTimeout(() => { n.textContent = ""; }, 4000); } };
  const askNext = () => 480 + Math.floor(Math.random() * 240);
  const ask = () => { asking = true; post("pauseVideo"); stop(); report(); const o = $("#lask", box); if (!o) return; o.hidden = false; let left = 60; $("#lcd", o).textContent = left; const b = $("#lok", o); b.focus(); clearInterval(askT);
    askT = setInterval(() => { left--; $("#lcd", o).textContent = left; if (left <= 0) { clearInterval(askT); $("#lmsg", o).textContent = L.askOut; b.textContent = L.resume; } }, 1000); };
  const onMsg = ev => { if (!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(ev.origin) || !curL) return; let d; try { d = typeof ev.data === "string" ? JSON.parse(ev.data) : ev.data; } catch (e) { return; } if (d && (d.event === "onReady" || d.event === "infoDelivery" || d.event === "initialDelivery")) { if (!ready) { ready = true; clearInterval(hs); clearTimeout(slowT); const sl = $("#lslow", box); if (sl) sl.hidden = true; if (want) { want = false; post("playVideo"); const cl = curL; setTimeout(() => { if (curL === cl && st !== 1 && !asking) { post("mute"); post("playVideo"); const sn = $("#lsnd", box); if (sn) sn.hidden = false; say(lang === "fa" ? "ویدیو بی‌صدا شروع شد. دکمه «صدا» را بزن." : "Started muted. Tap Sound to hear it."); } }, 1800); } } } if (!d || d.event !== "infoDelivery" || !d.info) return;
    const i = d.info; if (typeof i.duration === "number" && i.duration > 0) dur = i.duration;
    if (typeof i.playbackRate === "number" && i.playbackRate !== rate) { rate = i.playbackRate; if (rate > 1) { post("setPlaybackRate", [1]); say(L.fast); } }
    if (typeof i.currentTime === "number") { const t = i.currentTime, now = Date.now(); const dt = lastT ? (now - lastT) / 1000 : 0; lastT = now;
      if (t > maxOk + 2.5 + dt) { post("seekTo", [maxOk, true]); say(L.noSkip); } else { last = t; if (t > maxOk) maxOk = t; } }
    if (typeof i.playerState === "number") { const ps = i.playerState; if (ps !== st) { st = ps; const pb = $("#lpp", box); if (pb) pb.textContent = ps === 1 ? L.pause : L.play; }
      if (ps === 1 && !timer && !asking) { timer = setInterval(() => { played += 1; if (played % 10 === 0) report(); if (nextAsk && played >= nextAsk) { nextAsk = played + askNext(); ask(); } const pr = $("#lbar i", box); if (pr && dur) pr.style.width = Math.min(100, last / dur * 100) + "%"; }, 1000); }
      if (ps !== 1 && timer) { stop(); report(); } } };
  if (!window.__lcMsg) { window.__lcMsg = true; window.addEventListener("message", ev => window.__lcFn && window.__lcFn(ev)); } window.__lcFn = onMsg;
  const open = (l, start0) => { stop(); report(); ready = false; want = true; clearInterval(hs); clearTimeout(slowT); asking = false; curL = l; last = 0; maxOk = (prog[l.id] && prog[l.id].watched_sec) || 0; if (start0) maxOk = Math.max(maxOk, start0); rate = 1; dur = l.duration_sec || 0; played = 0; lastT = 0; nextAsk = askNext();
    if (!/^[\w-]{6,20}$/.test(l.youtube_id || "")) { box.textContent = ""; return; }
    box.innerHTML = `<h3>${esc(ttl(l.title))}</h3><div class="lframe" id="lfr"><iframe id="lyt" src="https://www.youtube-nocookie.com/embed/${esc(l.youtube_id)}?enablejsapi=1&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3${cc ? "&cc_load_policy=1&cc_lang_pref=" + (lang === "fa" ? "fa" : "en") : ""}${start0 ? "&start=" + start0 : ""}&origin=${encodeURIComponent(location.origin)}" title="${esc(ttl(l.title))}" allow="autoplay; encrypted-media; picture-in-picture" tabindex="-1"></iframe><div class="lshield" id="lsh"></div>
      <div class="lask" id="lask" hidden role="alertdialog" aria-label="${esc(L.askT)}"><p><b>${esc(L.askT)}</b></p><p id="lmsg">${esc(L.askP)} <span id="lcd">60</span></p><button type="button" class="btn go" id="lok">${esc(L.askB)}</button></div></div>
      <p class="lslow" id="lslow" hidden role="status">${esc(L.slow)} <button type="button" class="btn" id="lbasic">${esc(L.basic)}</button></p><div class="lctl"><button type="button" class="btn" id="lpp">${esc(L.play)}</button><button type="button" class="btn" id="lbk">${esc(L.back)}</button><button type="button" class="btn" id="lsnd" hidden>${lang === "fa" ? "صدا" : "Sound"}</button><label class="lsp">${esc(L.speed)} <select id="lsp"><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1" selected>1×</option></select></label><button type="button" class="btn" id="lcc" aria-pressed="${cc ? "true" : "false"}">${lang === "fa" ? "زیرنویس" : "Captions"}</button><button type="button" class="btn" id="lfs">${esc(L.full)}</button><div class="lbar" id="lbar" aria-hidden="true"><i></i></div></div><p class="muted" id="lnote" role="status" aria-live="polite"></p><p class="muted lrule">${esc(L.rules)}</p><p class="muted lkeys">${lang === "fa" ? "کلیدها: فاصله = پخش/توقف، J یا ← = ۱۰ ثانیه عقب، M = بی‌صدا، C = زیرنویس، F = تمام‌صفحه" : "Keys: Space = play/pause, J or ← = back 10s, M = mute, C = captions, F = fullscreen"}</p><div id="lstudy"></div>`;
    f = $("#lyt", box);
    const sl2 = $("#lstudy", box), showLinks = () => { const arr = links && links[l.id]; if (!Array.isArray(arr) || !arr.length || !sl2) return; sl2.innerHTML = `<h4>${lang === "fa" ? "منابع این درس" : "Lesson resources"}</h4>`; const ul = document.createElement("ul"); ul.className = "lst"; arr.slice(0, 12).forEach(x => { if (!x || !/^(https:\/\/[^\s"'<>]+|assets\/[\w\-\/.]+)$/i.test(x.u || "")) return; const li = document.createElement("li"), a = document.createElement("a"); a.href = x.u; a.target = "_blank"; a.rel = "noopener noreferrer"; if (x.k === "dl") a.setAttribute("download", ""); a.textContent = (x.k === "dl" ? "⬇ " : "↗ ") + ((x.t && (x.t[lang === "fa" ? "fa" : "en"] || x.t.fa || x.t.en)) || x.u); li.appendChild(a); ul.appendChild(li); }); sl2.appendChild(ul); };
    if (links) showLinks(); else SB.rest("site_settings?select=value&key=eq.design.lesson_links").then(r => { links = (r && r[0] && r[0].value && typeof r[0].value === "object") ? r[0].value : {}; showLinks(); }).catch(() => { links = {}; });
    $("#lcc", box).onclick = e => { cc = cc ? 0 : 1; open(l, Math.floor(last)); }; f.onload = () => { const hi = () => { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*"); } catch (e) {} }; hi(); clearInterval(hs); let tries = 0; hs = setInterval(() => { if (ready || ++tries > 40) return clearInterval(hs); hi(); }, 500); setTimeout(() => { if (maxOk > 5) post("seekTo", [maxOk, true]); }, 1200); };
    $("#lsnd", box).onclick = e => { post("unMute"); post("setVolume", [100]); e.currentTarget.hidden = true; };
    $("#lpp", box).onclick = () => { if (asking) return; if (!ready) { want = true; say(L.wait); } post(st === 1 ? "pauseVideo" : "playVideo"); };
    $("#lsh", box).onclick = () => { if (asking) return; if (!ready) { want = true; say(L.wait); } post(st === 1 ? "pauseVideo" : "playVideo"); };
    $("#lbk", box).onclick = () => { post("seekTo", [Math.max(0, last - 10), true]); };
    $("#lsp", box).onchange = e => { rate = parseFloat(e.target.value); post("setPlaybackRate", [Math.min(1, rate)]); };
    $("#lfs", box).onclick = () => { const fr = $("#lfr", box); if (fr.requestFullscreen) fr.requestFullscreen().catch(() => {}); };
    $("#lok", box).onclick = () => { clearInterval(askT); asking = false; $("#lask", box).hidden = true; $("#lmsg", box).textContent = L.askP + " 60"; $("#lok", box).textContent = L.askB; post("playVideo"); };
    slowT = setTimeout(() => { if (ready) return; const sl = $("#lslow", box); if (sl) { sl.hidden = false; $("#lbasic", box).onclick = () => { const fr = $("#lfr", box); if (fr) fr.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(l.youtube_id)}?rel=0&modestbranding=1&playsinline=1" title="${esc(ttl(l.title))}" allow="fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`; stop(); sl.textContent = L.basicNote; }; } }, 9000);
    box.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "nearest" }); };
  $$(".lpl", root).forEach(b => b.onclick = () => { const l = lessons.find(x => x.id === b.dataset.l); if (l) open(l); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && curL && st === 1) post("pauseVideo"); });
  if (!window.__lcKeys) { window.__lcKeys = true; document.addEventListener("keydown", e => { const fn = window.__lcKeyFn; if (fn) fn(e); }); }
  window.__lcKeyFn = e => { if (!curL || asking || e.ctrlKey || e.metaKey || e.altKey) return; const t = e.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return; if (t && t.tagName === "BUTTON" && (e.key === " " || e.key === "Enter")) return; const k = e.key.toLowerCase();
    if (k === " " || k === "k") { e.preventDefault(); post(st === 1 ? "pauseVideo" : "playVideo"); }
    else if (k === "j" || e.key === "ArrowLeft") { e.preventDefault(); post("seekTo", [Math.max(0, last - 10), true]); }
    else if (k === "m") { mutedK = mutedK ? 0 : 1; post(mutedK ? "mute" : "unMute"); }
    else if (k === "c") { const b = $("#lcc", box); if (b) b.click(); }
    else if (k === "f") { const fr = $("#lfr", box); if (fr && fr.requestFullscreen) fr.requestFullscreen().catch(() => {}); } };
}

/* e-mail links (confirm, recover) arrive as #access_token=... on the site address */
(async () => { const h = location.hash || (/[?&]error(_code|_description)?=/.test(location.search) ? "#" + location.search.slice(1) : "");
  if (/error=|error_code=|error_description=/.test(h) && !/access_token=/.test(h)) { const q = new URLSearchParams(h.slice(1)), ec = q.get("error_code") || "", ed = (q.get("error") || "") + " " + (q.get("error_description") || "");
    try { sessionStorage.setItem("am-autherr", ec === "otp_expired" ? "expired" : /access_denied|cancel|denied/i.test(ed) ? "cancel" : "failed"); } catch (e) {}
    history.replaceState(null, "", location.pathname); if (PAGE !== "auth") location.replace("auth.html"); return; }
  if (!/access_token=/.test(h) || !SB.on()) return; const q = new URLSearchParams(h.slice(1)), at = q.get("access_token"), rt = q.get("refresh_token"), ty = q.get("type");
  try { const r = await fetch(SB.base() + "/auth/v1/user", { headers: { apikey: S.supabaseAnonKey, Authorization: "Bearer " + at } }); const u = r.ok ? await r.json() : null;
    SB.keep({ access_token: at, refresh_token: rt, expires_in: parseInt(q.get("expires_in") || "3600", 10), user: u }, u && u.email); } catch (e) {}
  history.replaceState(null, "", location.pathname); location.replace("account.html" + (ty === "recovery" ? "#reset" : "#profile")); })();

let authMode = location.hash === "#register" ? "register" : "login";
function renderAuth() {
  if (SB.get()) { location.replace("account.html"); return; }
  const T_ = T(), root = $("#auth"), on = SAFE_URL(S.supabaseUrl) && S.supabaseAnonKey;
  const reg = authMode === "register";
  document.title = T_.signIn + " | " + tx(S.name);
  const AB = lang === "fa" ? { h: "یاد بگیر، بساز، گواهی بگیر", l: ["دوره‌های سینما، برنامه‌نویسی و طراحی", "پیشرفت و امتیاز تو ذخیره می‌شود", "گواهی با QR و بارکد، قابل تأیید و اشتراک در لینکدین", "بدون تبلیغ و بدون ردیابی"] } : { h: "Learn, build, get certified", l: ["Cinema, coding and design courses", "Your progress and points are saved", "Certificates with QR and barcode, verifiable and shareable to LinkedIn", "No ads, no tracking"] };
  root.innerHTML = `<div class="authx"><aside class="auths" aria-hidden="false"><div class="auths-bg" aria-hidden="true"><i></i><i></i><i></i></div><h2>${esc(AB.h)}</h2><ul>${AB.l.map(x => `<li>${icon("award")}<span>${esc(x)}</span></li>`).join("")}</ul></aside><div class="authc">
    <div class="alogo"><img class="lg lg-l" src="assets/img/logo-full.png" width="260" height="66" alt="CineCode Academy"><img class="lg lg-d" src="assets/img/logo-full-light.png" width="260" height="66" alt="" aria-hidden="true" loading="lazy"></div>
    <div class="atabs" role="tablist"><button type="button" role="tab" aria-selected="${!reg}" data-m="login">${esc(T_.aLogin)}</button><button type="button" role="tab" aria-selected="${reg}" data-m="register">${esc(T_.aReg)}</button></div>
    <h1 class="ph1">${esc(reg ? T_.aReg : T_.aLogin)}</h1>
    <p class="muted">${esc(on ? T_.aNote : T_.aOff)}</p>
    ${on ? `<div class="oauth" role="group" aria-label="${lang === "fa" ? "ورود با حساب دیگر" : "Continue with another account"}"><button type="button" class="btn oa" data-p="google"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.6 4.1-5.35 4.1a5.9 5.9 0 0 1 0-11.8c1.9 0 3.17.8 3.9 1.5l2.66-2.56A9.4 9.4 0 0 0 12 2.5a9.5 9.5 0 1 0 0 19c5.48 0 9.1-3.85 9.1-9.27 0-.62-.07-1.1-.15-1.13z"/></svg><span>${lang === "fa" ? "ادامه با Google" : "Continue with Google"}</span></button><button type="button" class="btn oa" data-p="github"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg><span>${lang === "fa" ? "ادامه با GitHub" : "Continue with GitHub"}</span></button></div><p class="oadiv" aria-hidden="true"><span>${lang === "fa" ? "یا با ایمیل" : "or with email"}</span></p>` : ""}
    <form id="af" novalidate>
      ${reg ? `<label>${esc(T_.fName)}<input name="name" autocomplete="name" required></label>` : ""}
      <label>${esc(T_.fEmail)}<input name="email" type="email" autocomplete="email" dir="ltr" required></label>
      <label>${esc(T_.aPass)}<span class="pw"><input name="password" type="password" autocomplete="${reg ? "new-password" : "current-password"}" minlength="8" dir="ltr" required><button type="button" class="pwb" id="pwb" aria-pressed="false" aria-label="${lang === "fa" ? "نمایش رمز" : "Show password"}">${icon("eye")}</button></span>${reg ? `<small class="hint">${lang === "fa" ? "حداقل ۸ کاراکتر. با کیبورد انگلیسی بنویس." : "At least 8 characters. Type with the English keyboard."}</small>` : ""}</label>
      ${reg ? `<label class="chk"><input name="consent" type="checkbox"><span>${esc(T_.aConsent)} <a href="privacy.html">${esc(T_.privacy)}</a></span></label>` : ""}
      <button class="btn go" type="submit">${icon("lock")} ${esc(reg ? T_.aReg : T_.aLogin)}</button>
      ${reg ? "" : `<button class="btn" type="button" id="aforgot">${esc(T_.aForgot)}</button>`}
      <p class="fstatus" id="astatus" role="status" aria-live="polite"></p>
    </form></div></div>`;
  { const pi = $("input[name=password]", root); if (pi && reg) { const m = document.createElement("div"); m.className = "pwm"; m.innerHTML = '<i></i><i></i><i></i><i></i><span class="pwt" aria-live="polite"></span>'; pi.closest("label").appendChild(m); pi.addEventListener("input", () => { const v = pi.value; let n = 0; if (v.length >= 8) n++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) n++; if (/\d/.test(v)) n++; if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) n++; if (!v) n = 0; m.dataset.n = n; $(".pwt", m).textContent = v ? (lang === "fa" ? ["", "ضعیف", "متوسط", "خوب", "قوی"] : ["", "Weak", "Fair", "Good", "Strong"])[n] || "" : ""; }); } }
  $$(".atabs button", root).forEach(b => b.onclick = () => { authMode = b.dataset.m; renderAuth(); });
  { const pb = $("#pwb"); if (pb) pb.onclick = () => { const i = $("input[name=password]", root), sh = i.type === "password"; i.type = sh ? "text" : "password"; pb.setAttribute("aria-pressed", String(sh)); pb.setAttribute("aria-label", lang === "fa" ? (sh ? "پنهان کردن رمز" : "نمایش رمز") : (sh ? "Hide password" : "Show password")); pb.classList.toggle("on", sh); }; }
  const f = $("#af"), st = $("#astatus"), say = (m, k) => { st.textContent = m; st.className = "fstatus " + (k || ""); };
  try { const ae = sessionStorage.getItem("am-autherr"); if (ae) { sessionStorage.removeItem("am-autherr"); const fa_ = lang === "fa"; say(ae === "cancel" ? (fa_ ? "ورود لغو شد. هر وقت خواستی دوباره تلاش کن." : "Sign-in was cancelled. You can try again any time.") : ae === "expired" ? (fa_ ? "لینک تأیید منقضی یا استفاده‌شده است. وارد شوید؛ اگر ایمیل شما قبلاً تأیید شده باشد وارد می‌شوید، وگرنه دوباره ثبت‌نام کنید." : "This link expired or was already used. Sign in; if your email was already confirmed you will get in, otherwise register again.") : (fa_ ? "ورود انجام نشد. دوباره تلاش کنید یا با ایمیل وارد شوید." : "Sign-in failed. Try again or use your email."), "err"); } } catch (e) {}
  const call = async (path, body) => {
    const r = await fetch(S.supabaseUrl.replace(/\/$/, "") + "/auth/v1/" + path, { method: "POST", headers: { "Content-Type": "application/json", apikey: S.supabaseAnonKey }, body: JSON.stringify(body) });
    return { ok: r.ok, status: r.status, j: await r.json().catch(() => ({})) };
  };
  const why = r => (r.j && (r.j.msg || r.j.error_description || r.j.message)) || (T_.errSend + " (" + r.status + ")");
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const email = f.elements.email.value.trim(), pw = f.elements.password.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say(T_.errEmail, "err");
    if (pw.length < 8) return say(T_.aShort, "err");
    if (reg && !f.elements.consent.checked) return say(T_.errConsent, "err");
    if (!on) return say(T_.aOffMsg, "err");
    try {
      if (reg) { const r = await call("signup?redirect_to=" + encodeURIComponent(location.origin + "/auth.html"), { email, password: pw, data: { full_name: f.elements.name.value.trim() } }); if (r.ok && r.j.access_token) { SB.keep(r.j, email); location.href = "account.html"; return; } r.ok ? say(T_.aCheck, "ok") : say(why(r), "err"); }
      else { const r = await call("token?grant_type=password", { email, password: pw }); if (r.ok && r.j.access_token) { SB.keep(r.j, email); say(T_.aIn, "ok"); location.href = "account.html"; } else say(r.status === 400 || r.status === 401 ? T_.aBad : why(r), "err"); }
    } catch (x) { say(T_.errNet, "err"); }
  });
  const oas = $$(".oa", root), oaOff = () => oas.forEach(b => { b.disabled = false; b.removeAttribute("aria-busy"); });
  oas.forEach(b => b.onclick = () => {
    if (!on) return say(T_.aOffMsg, "err");
    const p = b.dataset.p, nm = p === "google" ? "Google" : "GitHub";
    oas.forEach(x => x.disabled = true); b.setAttribute("aria-busy", "true");
    say(lang === "fa" ? "در حال رفتن به " + nm + "…" : "Redirecting to " + nm + "…", "");
    const to = encodeURIComponent(location.origin + "/auth.html");
    const ok = setTimeout(() => { oaOff(); say(lang === "fa" ? "پاسخی نیامد. اینترنت را بررسی کن و دوباره تلاش کن." : "No response. Check your connection and try again.", "err"); }, 15000);
    window.addEventListener("pagehide", () => clearTimeout(ok), { once: true });
    location.href = S.supabaseUrl.replace(/\/$/, "") + "/auth/v1/authorize?provider=" + p + "&redirect_to=" + to;
  });
  window.addEventListener("pageshow", e => { if (e.persisted) { oaOff(); say("", ""); } });
  const fg = $("#aforgot");
  if (fg) fg.onclick = async () => {
    const email = f.elements.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say(T_.errEmail, "err");
    if (!on) return say(T_.aOffMsg, "err");
    try { const r = await call("recover?redirect_to=" + encodeURIComponent(location.origin + "/auth.html"), { email }); say(r.ok ? T_.aCheck : why(r), r.ok ? "ok" : "err"); } catch (x) { say(T_.errNet, "err"); }
  };
}


/* =====================================================================
   ASSISTANT (level 1): answers only from data/content.js. No server, no AI, no tracking, nothing is sent anywhere.
   ===================================================================== */
function setupBot() {
  const norm = x => String(x || "").toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[ً-ٟ‌]/g, " ").replace(/[^\p{L}\p{N}\s]/gu, " ");
  const L = () => lang;
  const D = {
    about: { k: ["who", "about", "yourself", "کی", "کیستی", "درباره", "معرفی", "خودت"], c: { fa: "درباره من", en: "Who are you?" } },
    work: { k: ["work", "project", "portfolio", "film", "کار", "پروژه", "نمونه", "فیلم"], c: { fa: "کارها", en: "Your work" } },
    skills: { k: ["skill", "tool", "software", "premiere", "photoshop", "مهارت", "ابزار", "نرم"], c: { fa: "مهارت‌ها", en: "Skills" } },
    edu: { k: ["study", "education", "university", "degree", "تحصیل", "دانشگاه", "رشته", "درس"], c: { fa: "تحصیلات", en: "Education" } },
    exp: { k: ["experience", "job", "career", "تجربه", "سابقه", "کار قبلی"], c: { fa: "تجربه", en: "Experience" } },
    cert: { k: ["certificate", "certificates", "course", "گواهی", "مدرک", "سرتیفیکیت"], c: { fa: "گواهی‌ها", en: "Certificates" } },
    lang: { k: ["language", "speak", "زبان", "پشتو", "دری"], c: { fa: "زبان‌ها", en: "Languages" } },
    hire: { k: ["hire", "price", "cost", "service", "available", "freelance", "استخدام", "قیمت", "خدمات", "سفارش", "آزاد"], c: { fa: "سفارش پروژه", en: "Hire you" } },
    contact: { k: ["contact", "email", "phone", "whatsapp", "reach", "تماس", "ایمیل", "شماره", "واتساپ", "ارتباط"], c: { fa: "تماس", en: "Contact" } },
    social: { k: ["social", "instagram", "youtube", "linkedin", "tiktok", "behance", "github", "شبکه", "اینستاگرام", "یوتیوب"], c: { fa: "شبکه‌ها", en: "Social links" } },
    academy: { k: ["academy", "class", "learn", "exam", "آکادمی", "کلاس", "آزمون", "یادگیری"], c: { fa: "آکادمی", en: "Academy" } },
    press: { k: ["press", "festival", "media kit", "bio", "پرس", "جشنواره", "بیوگرافی", "رسانه"], c: { fa: "پرس‌کیت", en: "Press kit" } }
  };
  const A = key => {
    const l = L(), T_ = T();
    const name = tx(S.name);
    switch (key) {
      case "about": return { t: `${name}. ${tx(S.roles)}. ${tx(S.city)}.\n${tx(S.about)}`, to: "about" };
      case "work": { const real = S.projects.filter(p => !p.sample).length; return { t: real ? (l === "fa" ? `${real} پروژه واقعی در بخش کارها هست.` : `There are ${real} real projects in the Work section.`) : (l === "fa" ? "کارهای واقعی به‌زودی اینجا می‌آید. فعلاً نمونه‌هاست و با برچسب «نمونه» مشخص شده‌اند. فیلم‌ها را در یوتیوب هم می‌شود دید." : "Real projects are being added. For now the cards are samples and labeled as such. You can also watch videos on YouTube."), to: "work" }; }
      case "skills": return { t: [...(S.skills.video || []), ...(S.skills.design || []), ...(S.skills.cs || [])].map(x => x[1]).join("، "), to: "skills" };
      case "edu": return { t: (S.education || []).map(e => `${tx(e.school)}: ${tx(e.field)} (${tx(e.status)})`).join("\n"), to: "edu" };
      case "exp": return { t: (S.experience || []).map(x => `${x.org}: ${tx(x.role)} (${tx(x.when)})`).join("\n"), to: "exp" };
      case "cert": return { t: l === "fa" ? `${S.certs.length} گواهی در بخش گواهی‌ها هست. هر گواهی به نام صادرکننده‌اش است و فقط جایی لینک تأیید دارد که خود صادرکننده داده باشد.` : `${S.certs.length} certificates are listed. Each belongs to its issuer, and a verify link is shown only where the issuer provides one.`, to: "certs" };
      case "lang": return { t: (S.languages || []).map(x => tx(x)).join("، "), to: "lang" };
      case "hire": return { t: (S.availability === "open" ? (l === "fa" ? "در حال حاضر برای پروژه‌ها آزاد است. " : "Currently open for projects. ") : "") + (l === "fa" ? "تدوین ویدیو، طراحی گرافیک و فیلم‌سازی. قیمت از طریق گفت‌وگو مشخص می‌شود؛ پروژه‌ات را در فرم تماس بنویس." : "Video editing, graphic design and filmmaking. Pricing is agreed in conversation; describe your project in the contact form."), to: "contact" };
      case "contact": return { t: [S.contactEmail, S.phone ? "\u200E" + S.phone : ""].filter(Boolean).join("\n") + "\n" + (l === "fa" ? "یا فرم تماس را پر کن." : "Or use the contact form."), to: "contact" };
      case "social": return { t: S.socials.filter(x => x.show).map(x => x.label).join("، "), to: "links" };
      case "academy": return { t: l === "fa" ? "آکادمی هنوز باز نشده. قرار است دوره‌های ویدیویی رایگان، آزمون و گواهی گذراندن دوره داشته باشد. گواهی آن مدرک دانشگاهی نیست." : "The academy is not open yet. It will offer free video courses, exams and a course completion certificate. That certificate is not a university degree.", to: "courses" };
      case "press": return { t: l === "fa" ? "کیت رسانه‌ای برای جشنواره‌ها و رسانه‌ها در صفحه پرس‌کیت است." : "The press kit for festivals and media is on the Press kit page.", href: "presskit.html" };
      default: return { t: l === "fa" ? "این را در اطلاعات سایت پیدا نکردم و حدس نمی‌زنم. از دکمه‌ها استفاده کن یا در فرم تماس بنویس." : "I could not find that on this site and I will not guess. Use the buttons or write in the contact form.", to: "contact", fail: true };
    }
  };
  const root = document.createElement("div"); root.className = "bot"; root.id = "bot";
  root.innerHTML = `<button type="button" class="botb" id="botb" aria-expanded="false" aria-controls="botp"></button>
    <div class="botp" id="botp" role="region" hidden aria-label="Assistant"><div class="both"><strong id="bott"></strong><button type="button" id="botx" class="botx"></button></div>
    <div class="botm" id="botm" role="log" aria-live="polite"></div><div class="botc" id="botc"></div>
    <form class="botf" id="botf"><input id="boti" autocomplete="off" maxlength="120"><button class="btn go" type="submit" id="bots"></button></form></div>`;
  document.body.appendChild(root);
  const $b = id => document.getElementById(id), msgs = $b("botm");
  const add = (txt, who, link) => {
    const d = document.createElement("div"); d.className = "bm " + who; d.textContent = txt;
    if (link) { const a = document.createElement("a"); a.href = link.href; a.textContent = link.label; if (link.out) { a.target = "_blank"; a.rel = "noopener noreferrer"; } d.appendChild(document.createElement("br")); d.appendChild(a); }
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  };
  const labels = () => lang === "fa" ? { b: "دستیار", t: "دستیار سایت (فقط از اطلاعات همین سایت جواب می‌دهد)", x: "بستن", p: "سؤالت را بنویس", s: "بفرست", hi: "سلام! من دستیار ساده این سایت هستم، نه هوش مصنوعی. فقط از اطلاعات همین سایت جواب می‌دهم.", go: "رفتن به این بخش" } : { b: "Assistant", t: "Site assistant (answers only from this site)", x: "Close", p: "Type your question", s: "Send", hi: "Hi! I am a simple assistant for this site, not an AI. I answer only from the information on this site.", go: "Go to this section" };
  const chips = () => { $b("botc").innerHTML = ""; Object.keys(D).forEach(k => { const b = document.createElement("button"); b.type = "button"; b.textContent = D[k].c[lang]; b.onclick = () => ask(D[k].c[lang], k); $b("botc").appendChild(b); }); };
  const ask = (q, key) => {
    add(q, "u");
    if (!key) { const n = norm(q); let best = null, sc = 0; for (const k in D) { const s_ = D[k].k.reduce((m, w) => m + (n.includes(norm(w).trim()) ? 1 : 0), 0); if (s_ > sc) { sc = s_; best = k; } } key = best; }
    const r = A(key || "none"), lb = labels();
    add(r.t, "b", r.href ? { href: r.href, label: lb.go } : r.to ? { href: "#" + r.to, label: lb.go } : null);
  };
  const paint = () => { if (!$b("botb")) return; const lb = labels(); $b("botb").innerHTML = icon("spark"); $b("botb").setAttribute("aria-label", lb.b); $b("botb").title = lb.b; $b("bott").textContent = lb.t; $b("botx").textContent = lb.x; $b("boti").placeholder = lb.p; $b("boti").setAttribute("aria-label", lb.p); $b("bots").textContent = lb.s; chips(); };
  let started = false;
  const open = on => { $b("botp").hidden = !on; $b("botb").setAttribute("aria-expanded", on); if (on) { paint(); if (!started) { started = true; add(labels().hi, "b"); } $b("boti").focus(); } };
  $b("botb").onclick = () => open($b("botp").hidden);
  $b("botx").onclick = () => { open(false); $b("botb").focus(); };
  root.addEventListener("keydown", e => { if (e.key === "Escape" && !$b("botp").hidden) { open(false); $b("botb").focus(); } });
  $b("botf").addEventListener("submit", e => { e.preventDefault(); const q = $b("boti").value.trim(); if (!q) return; $b("boti").value = ""; ask(q); });
  paint();
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}


/* =====================================================================
   COURSE PAGE (sample layout of the future academy; enrolling is not connected)
   ===================================================================== */
const CT = {
  fa: { tick: "آکادمی به‌زودی باز می‌شود · دوره‌های رایگان · گواهی گذراندن دوره", enroll: "ثبت‌نام رایگان", soon: "به‌زودی", free: "رایگان", intro: "ویدیوی معرفی هنوز اضافه نشده", by: "مدرس", cat: "دسته", fmt: "قالب", lng: "زبان", dur: "مدت", lvl: "سطح", online: "آنلاین", dari: "دری", tbd: "به‌زودی اعلام می‌شود", chapters: "فصل‌های دوره", lesson: "درس", time: "مدت", locked: "قفل", meet: "با مدرس آشنا شو", feats: "ویژگی‌ها", f1: "گواهی گذراندن دوره (مدرک دانشگاهی نیست)", f2: "رایگان", f3: "روی موبایل و کامپیوتر", f4: "ویدیوها از یوتیوب", note: "این صفحه نمونه است. دوره‌ها و ثبت‌نام بعد از وصل شدن حساب‌ها (Supabase) فعال می‌شوند.", related: "دوره‌های مشابه", more: "دوره‌های بیشتر", big: "یاد بگیر، بساز، ارتقا بده · ", back: "بازگشت به دوره‌ها", about: "درباره دوره", sampleL: "گواهی", sampleH: "نمونهٔ گواهی این دوره", sampleP: "بعد از گذراندن دوره و آزمون، گواهی‌ای مثل این می‌گیری. این فقط نمونه است و نام و کد آن واقعی نیست.", soonMsg: "ثبت‌نام هنوز باز نیست. به‌زودی." },
  en: { tick: "The academy opens soon · Free courses · Course completion certificate", enroll: "Enroll for free", soon: "Coming soon", free: "Free", intro: "Intro video not added yet", by: "Instructor", cat: "Category", fmt: "Format", lng: "Language", dur: "Duration", lvl: "Level", online: "Online", dari: "Dari", tbd: "Announced soon", chapters: "Explore every course chapter", lesson: "Lesson", time: "Duration", locked: "Locked", meet: "Meet the instructor", feats: "Features", f1: "Certificate of course completion (not a university degree)", f2: "Free", f3: "On mobile and desktop", f4: "Videos hosted on YouTube", note: "This is a sample page. Courses and enrollment go live once accounts (Supabase) are connected.", related: "Related courses", more: "More courses", big: "Learn it, make it, level up · ", back: "Back to courses", about: "About this course", sampleL: "Certificate", sampleH: "Sample certificate for this course", sampleP: "After you finish the course and pass the exam you get a certificate like this. This is only a sample; the name and code are not real.", soonMsg: "Enrollment is not open yet. Coming soon." }
};
function renderCourse() {
  const C = CT[lang], root = $("#course"), id = decodeURIComponent(location.hash.slice(1)) || (S.courses[0] || {}).id;
  const c = (S.courses || []).find(x => x.id === id) || (/^[\w-]+$/.test(id || "") && SB.on() ? { id, title: { fa: "…", en: "…" }, text: { fa: "", en: "" }, cat: { fa: "", en: "" }, level: { fa: "", en: "" }, lessons: [], sample: false } : S.courses[0]);
  const tk = $("#tickt"); if (tk) tk.innerHTML = Array(6).fill(`<span>${esc(C.tick)}</span>`).join("");
  if (!c) { root.innerHTML = `<p class="muted">${esc(C.note)}</p>`; return; }
  const title = tx(c.title); document.title = title + " | " + tx(S.name);
  const rows = (c.lessons || []).map((l, i) => `<div class="lrow${i ? " lk" : ""}"><span class="ln">${esc(C.lesson)} ${i + 1}</span><span class="lt">${i ? icon("lock") : icon("play")}${esc(tx(l))}</span><span class="ld">—</span></div>`).join("");
  const rel = S.courses.filter(x => x.id !== c.id).map(x => `<a class="card glass" href="#${esc(x.id)}"><span class="lbl">${esc(C.soon)}</span><h3>${esc(tx(x.title))}</h3><p>${esc(tx(x.text))}</p>${pill(x.sample)}</a>`).join("");
  const meta = [[C.cat, tx(c.cat)], [C.fmt, C.online], [C.lng, C.dari], [C.dur, C.tbd], [C.lvl, tx(c.level)]];
  root.innerHTML = `<a class="back" href="index.html#courses">${lang === "fa" ? "→" : "←"} ${esc(C.back)}</a>
    <div class="cv"><div class="cvm"><div class="cvf" role="img" aria-label="${esc(C.intro)}"><span class="play" aria-hidden="true"></span><span class="lbl">${esc(C.intro)}</span></div>
      <ul class="cvi"><li>${icon("award")} ${esc(C.f1)}</li><li>${icon("globe")} ${esc(C.dari)}</li><li>${icon("book")} ${esc(c.lessons.length)} ${esc(C.lesson)}</li></ul></div>
    <aside class="cvc"><div class="ptitle">${pill(c.sample)}</div><h1 class="ph1">${esc(title)}</h1>
      <p class="muted">${esc(C.by)}: ${esc(tx(S.name))}</p>
      <p class="cprice">${esc(C.free)}</p>
      <button type="button" class="btn go cenr" id="cenr">${icon("lock")} ${esc(C.enroll)}</button>
      <p class="fstatus" id="cmsg" role="status" aria-live="polite"></p>
      <p class="muted cnote">${esc(C.note)}</p></aside></div>
    <p class="cbig">${esc(tx(c.text))}</p>
    <div class="cmeta">${meta.map(m => `<div><span class="lbl">${esc(m[0])}</span><strong>${esc(m[1])}</strong></div>`).join("")}</div>
    <section class="csec"><span class="lbl">${esc(C.chapters.split(" ")[0] === "Explore" ? "Course content" : "محتوا")}</span><h2>${esc(C.chapters)}</h2>
      <div class="ltab"><div class="lhead"><span>${esc(C.lesson)}</span><span></span><span>${esc(C.time)}</span></div>${rows}</div></section>
    <section class="csec ccert"><span class="lbl">${lang === "fa" ? "درباره گواهی این دوره" : "About this course certificate"}</span><h2>${lang === "fa" ? "گواهی «" + esc(title) + "» چه چیزی را نشان می‌دهد؟" : "What the “" + esc(title) + "” certificate shows"}</h2>
      <ul class="cfeat ccf"><li>${icon("award")}${lang === "fa" ? "پس از دیدن همهٔ " + esc(c.lessons.length) + " درس این دوره صادر می‌شود. این گواهی پایان دوره است، نه مدرک دانشگاهی." : "Issued after you finish all " + esc(c.lessons.length) + " lessons of this course. It is a course completion certificate, not a university degree."}</li>
      <li>${icon("book")}${lang === "fa" ? "نام تو، نام دوره، تاریخ صدور، کد یکتا، QR، بارکد، مهر و امضای مدرس روی آن است." : "It carries your name, the course name, the issue date, a unique code, a QR, a barcode, a seal and the instructor's signature."}</li>
      <li>${icon("globe")}${lang === "fa" ? "هر کسی با کد یا QR می‌تواند در صفحهٔ تأیید گواهی درستی آن را ببیند و یک تصدیق‌نامهٔ رسمی (روز، تاریخ شمسی و میلادی، ساعت) بگیرد." : "Anyone can check it with the code or QR on the verify page and get an official verification statement (weekday, Solar Hijri and Gregorian date, time)."}</li>
      <li>${icon("grid")}${lang === "fa" ? "با یک کلیک در لینکدین، ایکس، واتساپ، تلگرام، فیسبوک، اینستاگرام و ایمیل با متن آمادهٔ مخصوص هر شبکه و تصویر QR‌دار به اشتراک گذاشته می‌شود." : "Share it in one click to LinkedIn, X, WhatsApp, Telegram, Facebook, Instagram and email, with a ready text for each network and a share image with the QR."}</li></ul>
      <p class="muted">${lang === "fa" ? "پایین، نمونهٔ این گواهی را ببین. «تصدیق‌نامهٔ رسمی» را هم بزن تا نمونهٔ آن را ببینی. این‌ها نمونه‌اند و واقعی نیستند." : "See the sample below and press “Official verification statement” to preview it. These are samples, not real records."}</p></section>
    <section class="csec csample"><span class="lbl">${esc(C.sampleL)}</span><h2>${esc(C.sampleH)}</h2><p class="muted">${esc(C.sampleP)}</p><div id="csamp"></div></section>
    <section class="csec cteach"><span class="lbl">${esc(C.meet)}</span><div class="cname">${tx(S.name).split(/\s+/).map(w => `<span>${esc(w)}</span>`).join("")}</div><p class="sub">${esc(tx(S.about))}</p></section>
    <section class="csec"><h2>${esc(C.feats)}</h2><ul class="cfeat"><li>${icon("award")}${esc(C.f1)}</li><li>${icon("book")}${esc(C.f2)}</li><li>${icon("grid")}${esc(C.f3)}</li><li>${icon("play")}${esc(C.f4)}</li></ul></section>
    <div class="cmq" aria-hidden="true"><div class="cmqt">${Array(4).fill(`<span>${esc(C.big)}</span>`).join("")}</div></div>
    <section class="csec"><span class="lbl">${esc(C.related)}</span><h2>${esc(C.more)}</h2><div class="grid">${rel}</div></section>`;
  { const sb = $("#csamp"), go = () => window.__cert && sb && window.__cert.mount(sb, { lang, name: lang === "fa" ? "نام دانشجو (نمونه)" : "Student Name (sample)", course: title, date: lang === "fa" ? "تاریخ صدور" : "Issue date", code: "CCA-SAMPLE", ok: true, sample: true, url: location.origin + location.pathname.replace(/[^/]*$/, "") + "verify.html?code=CCA-SAMPLE" }); if (window.__cert) go(); else { const sc = document.createElement("script"); sc.src = "assets/js/certs.js"; sc.onload = go; document.head.appendChild(sc); } }
  { const bt = $("#cenr"), mg = $("#cmsg"), fa0 = lang === "fa";
    const h = async () => { if (!SB.on()) { mg.textContent = C.soonMsg; mg.className = "fstatus err"; return; }
      mg.textContent = fa0 ? "در حال بارگذاری دوره…" : "Loading the course…"; mg.className = "fstatus";
      await liveCourse(c.id, root, C); if (bt.onclick !== h && !bt.disabled) { mg.textContent = ""; bt.click(); } };
    bt.onclick = h; }
  liveCourse(c.id, root, C);
}

/* =====================================================================
   PRESS KIT PAGE
   ===================================================================== */
function renderPress() {
  const T_ = T(), root = $("#press"), fa = lang === "fa", P = S.press;
  document.title = T_.pressTitle + " | " + tx(S.name);
  const L = fa ? { cr: "کیت رسانه‌ای", lead: "هر چیزی که برای معرفی انصارالحق مبارز و آکادمی سینه‌کد لازم است: بیوگرافی، لوگو، عکس و اطلاعات تماس.", logos: "لوگو", logosP: "فایل‌های PNG با پس‌زمینهٔ شفاف. نسخهٔ مناسب رنگ پس‌زمینه را انتخاب کن.", onLight: "برای پس‌زمینهٔ روشن", onDark: "برای پس‌زمینهٔ تیره", full: "لوگوی کامل", mark: "نشان", photo: "عکس", files: "فایل‌ها", ready: "آماده", soon: "هنوز اضافه نشده", contact: "تماس برای رسانه‌ها", contactP: "برای مصاحبه، همکاری یا مطالب بیشتر پیام بده.", needBio: "بیوگرافی کامل هنوز نوشته نشده است.", ft: "مشخصات" } : { cr: "Press kit", lead: "Everything needed to introduce Ansarulhaq Mubarez and CineCode Academy: bio, logos, photo and contact details.", logos: "Logos", logosP: "PNG files with a transparent background. Pick the version that suits the background colour.", onLight: "For light backgrounds", onDark: "For dark backgrounds", full: "Full logo", mark: "Mark", photo: "Photo", files: "Files", ready: "Available", soon: "Not added yet", contact: "Media contact", contactP: "Write to me for interviews, collaboration or more material.", needBio: "The full bio has not been written yet.", ft: "Details" };
  const bioBlock = (key, label, id) => { const b = P[key]; if (!b || b.sample) return ""; return `<section class="pk-bio"><div class="pk-bh"><h2>${esc(label)}</h2><button class="btn" type="button" data-copy="${id}">${esc(T_.copyBio)}</button></div><p id="${id}">${esc(tx(b))}</p></section>`; };
  const facts = P.facts.filter(f => tx(f.v)).map(f => `<div><dt>${esc(tx(f.k))}</dt><dd>${esc(tx(f.v))}</dd></div>`).join("");
  const LG = [["assets/img/cc-full.png", L.full, L.onLight, "light"], ["assets/img/cc-full-dark.png", L.full, L.onDark, "dark"], ["assets/img/cc-mark.png", L.mark, L.onLight, "light"], ["assets/img/cc-mark-dark.png", L.mark, L.onDark, "dark"]];
  const logos = LG.map(([f, n, w, t]) => `<figure class="pk-lg"><div class="pk-tile ${t}"><img src="${f}" alt="${esc(n)}" loading="lazy" decoding="async"></div><figcaption><span><b>${esc(n)}</b><small>${esc(w)} · PNG</small></span><a class="btn" href="${f}" download>${esc(T_.download)}</a></figcaption></figure>`).join("");
  const dls = P.downloads.filter(d => d.id !== "logo").map(d => {
    const lab = esc(tx(d.label)), ok = d.file && /^[\w./-]+$/.test(d.file) && d.file.indexOf("..") < 0;
    return `<li class="${ok ? "ok" : "no"}"><span class="pk-fn">${lab}</span>${ok ? `<a class="btn" href="${esc(d.file)}" download>${esc(T_.download)}</a>` : `<span class="pk-st">${esc(L.soon)}</span>`}</li>`;
  }).join("");
  const em = S.contactEmail ? `<a class="btn go" href="mailto:${esc(S.contactEmail)}?subject=${encodeURIComponent(L.cr)}">${icon("mail")} ${esc(S.contactEmail)}</a>` : "";
  root.innerHTML = `<nav class="crumb" aria-label="Breadcrumb"><a href="index.html">${esc(T_.nHome)}</a> / <span aria-current="page">${esc(L.cr)}</span></nav>
  <header class="pk-hero"><div class="pk-t"><span class="lbl">${esc(tx(S.name))}</span><h1 class="ph1">${esc(T_.pressTitle)}</h1><p class="pk-lead">${esc(L.lead)}</p>
    <div class="pk-short"><h2>${esc(T_.shortBio)}</h2><p id="bio1">${esc(tx(P.shortBio))}</p><button class="btn" type="button" data-copy="bio1">${esc(T_.copyBio)}</button></div></div>
    <figure class="pk-ph"><img src="assets/img/me.webp" width="480" height="482" alt="${esc(tx(S.name))}" decoding="async"><figcaption>${esc(tx(S.name))} · ${esc(tx(S.city))}</figcaption></figure></header>
  ${bioBlock("longBio", T_.longBio, "bio2")}
  <div class="pk-cols"><section class="pk-sec"><h2>${esc(L.ft)}</h2><dl class="pk-facts">${facts}</dl></section>
  <section class="pk-sec"><h2>${esc(L.files)}</h2><ul class="pk-dl">${dls}</ul></section></div>
  <section class="pk-sec"><h2>${esc(L.logos)}</h2><p class="pk-sub">${esc(L.logosP)}</p><div class="pk-logos">${logos}</div></section>
  <section class="pk-contact"><div><h2>${esc(L.contact)}</h2><p>${esc(L.contactP)}</p></div>${em}</section>
  <p class="pk-use">${esc(T_.pressUse)}</p>`;
  $$("[data-copy]", root).forEach(b => { b.onclick = () => { copyText($("#" + b.dataset.copy).textContent, b); }; });
}

/* ---------- quick search (Ctrl+K): pages, sections, certificates, courses, links ---------- */
const NORM = s => String(s || "").toLowerCase().replace(/[\u064B-\u065F\u0670\u200c]/g, "").replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
function searchIndex() {
  const T_ = T(), idx = [], add = (g, t, sub, href, ext) => idx.push({ g, t, sub: sub || "", href, ext, n: NORM(t + " " + (sub || "")) });
  [["about", "nAbout"], ["edu", "nEdu"], ["exp", "nExp"], ["skills", "nSkills"], ["work", "nWork"], ["design", "nDesign"], ["vids", "nVid"], ["certs", "nCerts"], ["courses", "nCourses"], ["links", "nLinks"], ["contact", "nContact"]].forEach(([id, k]) => add("pages", T_[k], "", "index.html#" + id));
  [["works.html", "nWorks"], ["academy.html", "nAcademy"], ["cv.html", "cvT"], ["presskit.html", "nPress"], ["privacy.html", "privacy"]].forEach(([h, k]) => add("pages", T_[k], "", h));
  { const f = lang === "fa", LB = f ? ["رنگ‌بندی سینمایی", "استودیوی پوستر", "جستجوی آثار با رنگ", "مسیر یادگیری من", "سازندهٔ ریل", "مربی ترکیب‌بندی", "تایپوگرافی متحرک", "کوررنگی و کنتراست", "سازندهٔ زیرنویس", "استوری‌بورد", "نوار نام‌نمایی", "مطالعهٔ موردی", "ماشین‌حساب فیلم", "منحنی حرکت", "پیش‌فاکتور", "کارت برند", "نواحی امن شبکه‌ها", "شات‌لیست", "پیشنهاد کار", "تقویم محتوا", "کپشن شبکه‌ها", "اندازهٔ عکس شبکه‌ها", "امضای ایمیل", "ماشین‌حساب چاپ"] : ["Cinema grade", "Poster studio", "Search by colour", "My learning path", "Reel maker", "Composition coach", "Kinetic type", "Vision & contrast", "Subtitle maker", "Storyboard", "Lower thirds", "Case study", "Film calculators", "Motion easing", "Quote sheet", "Brand kit", "Social safe zones", "Shot list", "Proposal writer", "Content calendar", "Caption maker", "Social image sizes", "Email signature", "Print size and DPI"];
    LB.forEach((n, i) => add("pages", (f ? "آزمایشگاه: " : "Lab: ") + n, "lab tool ابزار", "lab.html?t=" + i));
    [["card.html", f ? "کارت دیجیتال" : "Digital card"], ["social.html", f ? "صفحه‌های اجتماعی من" : "My social pages"], ["services.html#dx", f ? "خدمات طراحی گرافیک و تبلیغات" : "Graphic design and advertising services"], ["verify.html", f ? "تأیید گواهی" : "Verify certificate"], ["reels.html", f ? "ریلز" : "Reels"], ["library.html", f ? "کتابخانه" : "Library"], ["kiosk.html", f ? "حالت نمایشگاه" : "Exhibition kiosk mode"]].forEach(([h, t]) => add("pages", t, "", h)); }
  (S.certs || []).forEach(c => add("certs", LV(c.title), LV(c.issuer), "index.html#certs"));
  (S.courses || []).forEach(c => add("courses", tx(c.title), tx(c.cat), "course.html#" + c.id));
  (S.education || []).forEach(e => add("edu", tx(e.school), tx(e.field), "index.html#edu"));
  (S.experience || []).forEach(x => add("exp", x.org, tx(x.role), "index.html#exp"));
  (S.socials || []).filter(s => s.show && SAFE_URL(s.url)).forEach(s => add("links", s.label, "", s.url, true));
  return idx;
}
function setupSearch() {
  const T_ = T(); let d = $("#srch");
  if (!d) {
    d = document.createElement("dialog"); d.className = "srch"; d.id = "srch"; d.setAttribute("aria-label", T_.srch);
    d.innerHTML = `<div class="srch-in"><input type="text" id="srchQ" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="btn" id="srchX"></button></div><ul id="srchR" class="srch-r"></ul><p class="srch-n muted" id="srchE" hidden></p>`;
    document.body.appendChild(d);
    let sel = -1, res = [];
    const draw = () => {
      const q = NORM($("#srchQ").value.trim()), terms = q.split(/\s+/).filter(Boolean), GL = { pages: T_.srchPages, certs: T_.nCerts, courses: T_.nCourses, edu: T_.nEdu, exp: T_.nExp, links: T_.nLinks };
      res = terms.length ? searchIndex().filter(x => terms.every(t => x.n.includes(t))).slice(0, 12) : searchIndex().filter(x => x.g === "pages").slice(0, 8);
      sel = res.length ? 0 : -1;
      $("#srchR").innerHTML = res.map((x, i) => `<li id="sr${i}"><a${i === 0 ? ' aria-current="true"' : ""} href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="srch-g">${esc(GL[x.g] || x.g)}</span><span class="srch-t">${esc(x.t)}</span>${x.sub ? `<span class="srch-s">${esc(x.sub)}</span>` : ""}</a></li>`).join("");
      $("#srchE").hidden = !!res.length; $("#srchE").textContent = T_.srchNone;
    };
    const mark = () => $$("#srchR a").forEach((x, i) => i === sel ? x.setAttribute("aria-current", "true") : x.removeAttribute("aria-current"));
    $("#srchQ").addEventListener("input", draw);
    $("#srchQ").addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); if (res.length) { sel = (sel + 1) % res.length; mark(); } }
      if (e.key === "ArrowUp") { e.preventDefault(); if (res.length) { sel = (sel - 1 + res.length) % res.length; mark(); } }
      if (e.key === "Enter" && res[sel]) { e.preventDefault(); const a = $("a", $("#sr" + sel)); a.click(); }
    });
    $("#srchX").onclick = () => d.close();
    d.addEventListener("click", e => { if (e.target === d) d.close(); else if (e.target.closest("#srchR a")) d.close(); });
    d.draw = draw;
  }
  $("#srchQ").placeholder = T_.srchPh; $("#srchQ").setAttribute("aria-label", T_.srch); $("#srchX").textContent = T_.close;
  $("#srchV").textContent = T_.srch;
  $("#srchBtn").setAttribute("aria-label", T_.srch);
  const open = () => { CLOSE_ALL && CLOSE_ALL(); $("#srchQ").value = ""; d.draw(); if (d.showModal) d.showModal(); else d.setAttribute("open", ""); $("#srchQ").focus(); };
  $("#srchBtn").onclick = open;
  if (!window.__srchK) { window.__srchK = 1; addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); const b = $("#srchBtn"); if (b) b.click(); } }); }
}

/* ---------- render all ---------- */
function renderAll() {
  applyChrome();
  setupSearch();
  if (!document.getElementById("bot")) setupBot();
  setupCookie();
  if (PAGE === "auth") renderAuth();
  if (PAGE === "home") { renderHome(); renderMarquee(); renderSlider(); layoutClips(); }
  if (PAGE === "project") renderProject();
  if (PAGE === "course") renderCourse();
  if (PAGE === "verify") renderVerify();
  if (PAGE === "admin") { document.title = (lang === "fa" ? "پنل مدیر" : "Admin panel") + " | " + tx(S.name); if (window.__admin) window.__admin.mount({ root: $("#admin"), SB, lang, S }); }
  if (PAGE === "works") renderWorks();
  if (PAGE === "portfolio" && window.renderPortfolio) window.renderPortfolio();
  if (PAGE === "library") renderLibrary();
  if (PAGE === "about") renderAbout();
  if (PAGE === "directory") renderDirectory();
  if (PAGE === "timeline") renderTimeline();
  if (PAGE === "notes") renderLedger("notes");
  if (PAGE === "activity") renderLedger("activity");
  if (PAGE === "toolkit") renderToolkit();
  if (PAGE === "account") renderAccount();
  if (PAGE === "services") renderServices();
  if (PAGE === "academy") renderAcademy();
  if (PAGE === "contact" || PAGE === "feedback") renderContact();
  if (PAGE === "faq") renderFaq();
  if (PAGE === "cv") renderCV();
  if (PAGE === "press") renderPress();
  if (PAGE === "privacy") $$("[data-lang]").forEach(e => { e.hidden = e.dataset.lang !== lang; });
  if (PAGE === "notfound") { $("#nf-t").textContent = T().notFoundTitle; $("#nf-p").textContent = T().notFoundText; document.title = T().notFoundTitle; }
  if (PAGE === "home") document.title = tx(S.name);
  if (PAGE === "privacy") document.title = T().privacyTitle + " | " + tx(S.name);
  document.documentElement.classList.add("rdy");
  if (window.__fx) window.__fx();
}

/* ---------- marquee, slider, scroll effects (home) ---------- */
let slTimer = 0, slI = 0, slPaused = false;
function renderMarquee() {
  const w = (S.marquee && S.marquee[lang]) || []; if (!w.length) return;
  const one = w.map(x => `<span>${esc(x)}</span><i></i>`).join("");
  $("#mqt").innerHTML = one + one + one + one;
}
function renderSlider() {
  const T_ = T(), B = S.banners || [], sl = $("#sl"); if (!B.length) { sl.parentElement.hidden = true; return; }
  sl.parentElement.setAttribute("aria-label", T_.sLabel);
  sl.innerHTML = `<div class="slv" aria-live="off">` + B.map((b, n) => `<div class="slide c-${esc(b.c || "a")}" data-n="${n}" role="group" aria-roledescription="slide" aria-label="${n + 1} ${T_.sOf} ${B.length}" ${n ? "inert" : ""}>
      <span class="pill">${esc(tx(b.tag))}</span><h2 class="st">${esc(tx(b.title))}</h2><p>${esc(tx(b.text))}</p>
      <a class="btn go" href="${esc(b.href)}">${esc(tx(b.cta))}</a><b class="sn" aria-hidden="true">0${n + 1}</b></div>`).join("") + `</div>
    <div class="slc"><button type="button" class="btn" id="slPrev" aria-label="${esc(T_.sPrev)}">${lang === "fa" ? "→" : "←"}</button>
      <div class="dots">${B.map((b, n) => `<button type="button" class="dt" data-n="${n}" aria-label="${n + 1} ${T_.sOf} ${B.length}"></button>`).join("")}</div>
      <button type="button" class="btn" id="sx" aria-label="${esc(T_.sNext)}">${lang === "fa" ? "←" : "→"}</button>
      <button type="button" class="btn" id="sa" aria-pressed="false">${esc(T_.sPause)}</button></div>`;
  slI = Math.min(slI, B.length - 1);
  const go = n => { slI = (n + B.length) % B.length;
    $$(".slide", sl).forEach((e, i) => { e.classList.toggle("on", i === slI); e.classList.toggle("off", i < slI); if (i === slI) e.removeAttribute("inert"); else e.setAttribute("inert", ""); });
    $$(".dt", sl).forEach((e, i) => e.setAttribute("aria-current", i === slI ? "true" : "false")); };
  const stop = () => { clearInterval(slTimer); slTimer = 0; };
  const run = () => { stop(); if (!slPaused && !still && !R.classList.contains("lite")) slTimer = setInterval(() => go(slI + 1), 6500); };
  $("#slPrev").onclick = () => { go(slI - 1); run(); }; $("#sx").onclick = () => { go(slI + 1); run(); };
  $$(".dt", sl).forEach(e => e.onclick = () => { go(+e.dataset.n); run(); });
  const sa = $("#sa"); const lbl = () => { sa.textContent = slPaused ? T_.sPlay : T_.sPause; sa.setAttribute("aria-pressed", slPaused); };
  sa.onclick = () => { slPaused = !slPaused; lbl(); run(); }; lbl();
  sl.onmouseenter = stop; sl.onmouseleave = run; sl.addEventListener("focusin", stop); sl.addEventListener("focusout", run);
  let x0 = null; sl.addEventListener("pointerdown", e => { x0 = e.clientX; }); sl.addEventListener("pointerup", e => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) { go(slI + (dx < 0 ? 1 : -1) * (lang === "fa" ? -1 : 1)); run(); } });
  go(slI); run();
}
function setupScroll() {
  const bar = $("#prog i");
  const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0).toFixed(4) + ")"; };
  const tt = $("#totop"), hd = $("#site-header");
  tt.onclick = () => scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  const upd2 = () => { tt.hidden = scrollY < 700; hd.classList.toggle("stuck", scrollY > 20); };
  addEventListener("scroll", () => { upd(); upd2(); }, { passive: true }); upd(); upd2();
  if (still || !("IntersectionObserver" in window)) return;
  // staggered reveal for grids; content stays visible if this never runs
  const els = $$("#workGrid>*,#c1>*,#c2>*,#c3>*,#socials>*,.strip>*,.sh");
  els.forEach((e, i) => { e.classList.add("rvl"); e.style.setProperty("--d", ((i % 6) * 70) + "ms"); });
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}

/* ---------- scroll-driven film frames (hero sequence), optional ---------- */
function setupSeq() {
  const H = S.hero || {}, sec = $("#seq"); if (!sec) return;
  const mf = /^(.*?)(\d+)(\.[A-Za-z0-9]+)$/.exec(H.first || ""), ml = /^(.*?)(\d+)(\.[A-Za-z0-9]+)$/.exec(H.last || "");
  if (!mf || !ml || mf[1] !== ml[1] || mf[3] !== ml[3]) return;           // off when not configured or inconsistent
  const a = +mf[2], b = +ml[2], pad = mf[2].length; if (!(b >= a)) return;
  const total = b - a + 1, mid = a + Math.floor((total - 1) / 2);          // real range wins over the stated count
  const src = n => (H.folder ? H.folder.replace(/\/$/, "") + "/" : "") + mf[1] + String(n).padStart(pad, "0") + mf[3];
  const cv = $("#seqc"), cx = cv.getContext("2d"), imgs = new Array(total), lab = $("#seqp");
  sec.hidden = false; sec.style.height = Math.round(innerHeight + total * 16) + "px";
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const size = () => { cv.width = Math.round(cv.clientWidth * dpr); cv.height = Math.round(cv.clientHeight * dpr); draw(cur); };
  let cur = Math.floor((total - 1) / 2), want = cur, raf = 0, loaded = 0;
  function nearest(i) { for (let d = 0; d < total; d++) for (const j of [i - d, i + d]) if (imgs[j] && imgs[j].complete && imgs[j].naturalWidth) return imgs[j]; return null; }
  function draw(i) { const im = nearest(i); if (!im) return; const cw = cv.width, ch = cv.height, r = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), w = im.naturalWidth * r, h = im.naturalHeight * r; cx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h); }
  const load = i => { const im = new Image(); im.decoding = "async"; im.onload = im.onerror = () => { loaded++; lab.textContent = loaded < total ? Math.round(loaded / total * 100) + "%" : ""; if (loaded === 1 || i === want) draw(want); }; im.src = src(a + i); imgs[i] = im; };
  const calm = still || R.classList.contains("lite");
  if (calm) { load(Math.floor((total - 1) / 2)); sec.style.height = "auto"; sec.classList.add("calm"); size(); addEventListener("resize", size); return; }
  const order = []; for (let i = 0; i < total; i += 4) order.push(i); for (let i = 0; i < total; i++) if (i % 4) order.push(i);
  order.forEach((i, k) => setTimeout(() => load(i), k * 25));
  const upd = () => { raf = 0; const r = sec.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))); want = Math.round(p * (total - 1)); if (want !== cur) { cur = want; draw(cur); } };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  addEventListener("resize", size); size(); upd();
}

/* ---------- scroll-scrubbed hero video (optional) ---------- */
function setupVHero() {
  const HV = S.heroVideo || {}, home = $("#home"), vh = $("#vh"), v = $("#vv"), hc = $("#hc"); if (!HV.src || !home || !vh) return;
  if (still || R.classList.contains("lite")) return;                       // calm/slow mode keeps the light lens hero
  home.classList.add("vhon"); vh.hidden = false; if (HV.poster) v.poster = HV.poster;
  const vi = $("#vi"); let dur = 0, L = 0, cur = 0, target = 0, raf = 0, inView = true, ready = false;
  const off = () => { home.classList.remove("vhon"); home.style.removeProperty("--vl"); vh.hidden = true; hc.removeAttribute("inert"); hc.style.opacity = ""; hc.style.transform = ""; };
  v.addEventListener("error", off);
  v.addEventListener("loadedmetadata", () => { dur = v.duration || 0; if (!(dur > 0)) return off(); L = Math.round(Math.max(1500, dur * 260)); home.style.setProperty("--vl", L + "px"); ready = true; v.pause(); upd(); });
  v.src = HV.src; v.load();
  const clamp = x => Math.max(0, Math.min(1, x));
  function upd() { if (!ready) return; const r = home.getBoundingClientRect(), p = clamp(-r.top / L);
    vi.style.opacity = (1 - clamp(p / .07)).toFixed(3); vi.style.transform = "translateY(" + (-p * 120).toFixed(1) + "px)";
    const k = clamp((p - .55) / .25); hc.style.opacity = k.toFixed(3); hc.style.transform = "translateY(" + ((1 - k) * 28).toFixed(1) + "px)";
    if (k < .3) hc.setAttribute("inert", ""); else hc.removeAttribute("inert");
    target = clamp((p - .07) / .93) * dur; if (!raf) raf = requestAnimationFrame(tick); }
  function tick() { raf = 0; cur += (target - cur) * .2; if (Math.abs(target - cur) < .004) cur = target;
    if (!v.seeking && Math.abs(v.currentTime - cur) > .02) v.currentTime = cur;
    if (inView && cur !== target) raf = requestAnimationFrame(tick); }
  if ("IntersectionObserver" in window) new IntersectionObserver(e => { inView = e[0].isIntersecting; if (inView) upd(); }).observe(home);
  addEventListener("scroll", () => { if (!raf || !inView) upd(); }, { passive: true }); addEventListener("resize", upd);
}

buildChrome();
window.__pfCtx = () => ({ S, lang, tx, esc, $, $$, gsrc, T: T(), wkOpen, setList: l => { WKLIST = l; } });
renderAll();
/* admin-edited texts (table site_content). Only localized {fa,en} texts and a short allowlist of contact fields can be overridden. */
{
  const PLAIN = /^(contactEmail2?|phone|phones\.\d{1,2}\.(n|show))$/;
  const walk = (key) => { const ks = key.split("."); if (ks.some(k => k === "__proto__" || k === "constructor" || k === "prototype")) return null; let o = S; for (let i = 0; i < ks.length - 1; i++) { if (!o || typeof o !== "object") return null; o = o[ks[i]]; } return o && typeof o === "object" ? [o, ks[ks.length - 1]] : null; };
  const applyContent = rows => { let n = 0; (rows || []).forEach(r => {
    if (!r || typeof r.key !== "string" || !/^[A-Za-z0-9_.]{1,120}$/.test(r.key)) return; const w = walk(r.key); if (!w) return; const [o, k] = w, cur = o[k], v = r.value;
    if (PLAIN.test(r.key)) { if (typeof cur !== "string" || typeof v !== "string" || v.length > 60) return; if (/Email/.test(r.key) && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(v)) return; if (/(^phone$|\.n$)/.test(r.key) && !/^\+?\d{6,15}$/.test(v)) return; o[k] = v; n++; return; }
    if (cur && typeof cur === "object" && typeof cur.fa === "string" && typeof cur.en === "string" && v && typeof v === "object") { ["fa", "en", "ps"].forEach(l => { if (typeof v[l] === "string" && v[l].length <= 4000) { cur[l] = v[l]; n++; } }); }
  }); return n; };
  window.__applyContent = applyContent;
  if (PAGE === "admin") { try { window.__SITE0 = JSON.parse(JSON.stringify(S)); } catch (e) {} }
  if (SB.on()) SB.rest("site_content?select=key,value&limit=2000").then(rows => { if (applyContent(rows)) { buildChrome(); renderAll(); } }).catch(() => {});
  /* admin-managed projects and gallery (tables site_projects / site_gallery). Empty table = keep the built-in list. */
  if (SB.on() && PAGE !== "admin") {
    const baseP = {}; (S.projects || []).forEach(p => { baseP[p.id] = p; });
    const FIELD_OK = /^[a-z0-9_-]{1,40}$/;
    Promise.all([SB.rest("site_projects?select=id,data,position,hidden&order=position.asc,created_at.asc&limit=300").catch(() => null), SB.rest("site_gallery?select=id,data,hidden&order=created_at.asc,id.asc&limit=1000").catch(() => null), SB.rest("site_resume?select=id,kind,data,position,hidden&order=position.asc,created_at.asc&limit=200").catch(() => null)]).then(([pr, gl, rs]) => {
      let ch = false;
      if (Array.isArray(pr) && pr.length) { S.projects = pr.filter(r => r && FIELD_OK.test(r.id) && !r.hidden).map(r => Object.assign({ x: "50%", y: "50%", tc: "00:00:00:00", tools: [], credits: [], sample: false }, baseP[r.id] || {}, r.data && typeof r.data === "object" ? r.data : {}, { id: r.id })); ch = true; }
      if (Array.isArray(gl) && gl.length) { S.gallery = gl.filter(r => r && FIELD_OK.test(r.id) && !r.hidden).map(r => Object.assign({ cat: "poster", w: 640, h: 640 }, r.data && typeof r.data === "object" ? r.data : {}, { id: r.id })); ch = true; }
      if (Array.isArray(rs) && rs.length) { ["education", "experience"].forEach(k => { const mine = rs.filter(r => r && r.kind === k && FIELD_OK.test(r.id)); if (mine.length) { S[k] = mine.filter(r => !r.hidden && r.data && typeof r.data === "object").map(r => Object.assign({}, r.data, { id: r.id })); ch = true; } }); }
      if (ch) renderAll();
    });
  }
}
if (["academy", "library", "services", "about", "works"].includes(PAGE) && !still && "IntersectionObserver" in window) setTimeout(() => { const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .1 });
  $$("main .card, main .ac-card").forEach((e, i) => { if (e.getBoundingClientRect().top < innerHeight) return; e.classList.add("rvl"); e.style.setProperty("--d", ((i % 5) * 60) + "ms"); io.observe(e); }); }, 500);
if (PAGE === "contact" || PAGE === "feedback") setupForm();
if (PAGE === "home") { setupForm(); setupMotion(); setupScroll(); setupSeq(); setupVHero(); }
if (PAGE === "project") addEventListener("hashchange", () => { renderProject(); scrollTo(0, 0); });
/* course text is not copyable (selecting, copying, dragging). Form fields stay normal. Developer tools are not blocked on purpose. */
if (PAGE === "course") {
  const inField = e => !!(e.target && e.target.closest && e.target.closest("input,textarea,select,[contenteditable=true]"));
  ["copy", "cut", "dragstart", "selectstart", "contextmenu"].forEach(k => document.addEventListener(k, e => { if (inField(e)) return; if (e.target.closest && e.target.closest("main")) e.preventDefault(); }));
  document.body.classList.add("nocopy");
}
if (PAGE === "course") addEventListener("hashchange", () => { renderCourse(); scrollTo(0, 0); });
})();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });

/* optional polish layer */
{ const x = document.createElement("script"); x.src = "assets/js/extras.js"; x.defer = true; document.head.appendChild(x); }
