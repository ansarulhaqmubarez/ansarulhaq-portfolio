/* Sets language/direction before first paint so RTL pages do not shift when app.js runs (CLS fix). Mirrors app.js logic. */
(function () {
  try {
    var R = document.documentElement, l = /^(fa|ps|prs)/i.test(navigator.language || "") ? "fa" : "en", s = localStorage.getItem("am-lang");
    if (s === "en" || s === "fa") l = s;
    R.lang = l; R.dir = l === "fa" ? "rtl" : "ltr";
    var g = localStorage.getItem("am-grad"); if (/^(aurora|sunset|emerald|violet|ocean)$/.test(g || "")) R.dataset.grad = g;
    if (localStorage.getItem("am-anim") === "off") R.dataset.anim = "off";
  } catch (e) {}
})();
