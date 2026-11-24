/* Public certificate showcase (home, academy, course): loads certs.js lazily, shows all styles as SAMPLE. */
(function () {
  "use strict";
  var PAGE = document.body.dataset.page || "";
  var map = { home: 1, index: 1, academy: 1, course: 1 };
  if (!map[PAGE] && !/(^|\/)(index|academy|course)\.html$|\/$/.test(location.pathname)) return;
  var main = document.querySelector("main"); if (!main) return;
  try { if ((JSON.parse(localStorage.getItem("am-design") || "{}") || {}).showcase !== true) return; } catch (e) { return; }
  var sec = document.createElement("section"); sec.id = "certShow"; sec.className = "csec wrapx"; var at = document.getElementById("certs"); if (at && at.parentNode === main) main.insertBefore(sec, at); else main.appendChild(sec);
  var seen = false, lang = function () { return document.documentElement.lang === "fa" ? "fa" : "en"; };
  function load(cb) {
    if (!document.querySelector('link[href$="certs.css"]')) { var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "assets/css/certs.css"; document.head.appendChild(l); }
    if (window.__cert) return cb(); var s = document.createElement("script"); s.src = "assets/js/certs.js"; s.onload = cb; document.head.appendChild(s);
  }
  function draw() { load(function () { window.__cert.showcase(sec, lang()); }); }
  if ("IntersectionObserver" in window) { new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { seen = true; o.disconnect(); draw(); } }, { rootMargin: "400px" }).observe(sec); } else { seen = true; draw(); }
  new MutationObserver(function () { if (seen) draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
