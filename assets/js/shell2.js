/* Shared shell for inner pages: announcement bar, animated gradient lines, new assistant widget. Home (nh.js) has its own. */
(function () {
  "use strict";
  var R = document.documentElement, page = document.body.dataset.page || "";
  if (page === "home" || page === "admin" || page === "kiosk") return;
  function go() {
    var hd = document.getElementById("site-header"), ft = document.getElementById("site-footer");
    if (hd && !document.getElementById("annBar")) {
      var a = document.createElement("div"); a.id = "annBar"; a.className = "ann";
      var fill = function () { var fa = R.lang !== "en"; a.innerHTML = ""; var ph0 = (window.SITE && window.SITE.phones || [])[0]; var s = document.createElement("span"); s.textContent = fa ? "آکادمی به‌زودی باز می‌شود؛ دوره‌ها رایگان و گواهی‌ها با کد قابل استعلام خواهند بود." : "The academy opens soon: courses will be free, with certificates you can verify by code."; var l = document.createElement("a"); l.href = "academy.html#courses"; l.textContent = fa ? "دوره‌ها" : "Courses"; a.appendChild(s); a.appendChild(l); if (ph0) { var p = document.createElement("a"); p.className = "ann-ph"; p.href = "tel:" + ph0.n; p.setAttribute("dir", "ltr"); p.setAttribute("aria-label", fa ? "تلفن" : "Phone"); p.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>'; p.appendChild(document.createElement("span")).textContent = ph0.show; a.appendChild(p); } };
      fill(); hd.parentNode.insertBefore(a, hd); document.body.classList.add("has-ann"); new MutationObserver(fill).observe(R, { attributes: true, attributeFilter: ["lang"] });
      var g = document.createElement("div"); g.className = "gline"; g.setAttribute("aria-hidden", "true"); hd.appendChild(g);
    }
    if (ft && !ft.querySelector(".gline")) { var g2 = document.createElement("div"); g2.className = "gline"; g2.setAttribute("aria-hidden", "true"); ft.insertBefore(g2, ft.firstChild); }
    var old = document.getElementById("bot"); if (old) old.remove();
    var l1 = document.createElement("link"); l1.rel = "stylesheet"; l1.href = "assets/css/bot2.css"; document.head.appendChild(l1);
    var s = document.createElement("script"); s.src = "assets/js/bot2.js"; document.head.appendChild(s);
    var s2 = document.createElement("script"); s2.src = "assets/js/mini.js"; document.head.appendChild(s2);
  }
  /* v179: footer groups with icons + cookie settings (re-applied whenever the footer is re-rendered) */
  var P = {
    cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>',
    mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
    buoy: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
    cookie: '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    award: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    msg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>',
    brief: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    clap: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    flask: '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
    rss: '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'
  };
  function svg(k) { return '<svg class="fti2" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[k] || P.file) + '</svg>'; }
  var LI = { "academy.html": "cap", "academy.html#courses": "book", "library.html": "book", "certificates.html": "award", "verify.html": "shield", "faq.html": "help", "auth.html": "login", "about.html": "user", "portfolio.html": "grid", "blog.html": "file", "works.html": "grid", "graphics.html": "palette", "reels.html": "clap", "services.html": "brief", "lab.html": "flask", "cv.html": "file", "presskit.html": "file", "privacy.html": "shield", "terms.html": "file", "feedback.html": "msg", "sitemap.xml": "map", "index.html": "home" };
  function ftx() {
    var ft = document.getElementById("site-footer"); if (!ft || ft.dataset.fx) return; if (!ft.querySelector(".ft-c")) return;
    ft.dataset.fx = "1";
    [["ft-aca", "cap"], ["ft-exp", "compass"], ["ft-con", "mail"]].forEach(function (x) { var h = ft.querySelector("." + x[0] + " h2"); if (h && !h.querySelector(".fti2")) h.insertAdjacentHTML("afterbegin", svg(x[1])); });
    [].forEach.call(ft.querySelectorAll(".ft-aca li a, .ft-exp li a, .fbar-r a"), function (a) { if (a.querySelector("svg")) return; var k = LI[(a.getAttribute("href") || "").replace(/^\.?\//, "")]; if (k) a.insertAdjacentHTML("afterbegin", svg(k)); });
    var d0 = ft.querySelector(".ft-aca li:first-child a"); if (d0 && /academy\.html$/.test(d0.getAttribute("href") || "")) d0.parentNode.remove();
    var bar = ft.querySelector(".fbar-r");
    if (bar && !bar.querySelector("[data-ckset]")) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("data-ckset", ""); b.className = "ft-ckb";
      var fill = function () { b.innerHTML = svg("cookie") + (R.lang !== "en" ? "تنظیمات کوکی" : "Cookie settings"); }; fill();
      b.onclick = function () { try { localStorage.removeItem("am-ck"); } catch (e) {} location.reload(); };
      bar.appendChild(b); new MutationObserver(fill).observe(R, { attributes: true, attributeFilter: ["lang"] });
    }
  }
  var fto = document.getElementById("site-footer");
  setTimeout(function () { ftx(); var f = document.getElementById("site-footer"); if (f) new MutationObserver(function () { if (!f.querySelector(".fti2")) { delete f.dataset.fx; ftx(); } }).observe(f, { childList: true }); }, 700);

  if (document.readyState !== "loading") setTimeout(go, 500); else document.addEventListener("DOMContentLoaded", function () { setTimeout(go, 500); });
})();
