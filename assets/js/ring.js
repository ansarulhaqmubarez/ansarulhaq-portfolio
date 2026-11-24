/* ring.js: 3D gallery ring on the home page. Real works from window.SITE.gallery. Drag, swipe, arrow keys or buttons; nothing moves by itself. */
(function () {
  "use strict";
  if ((document.body.dataset.page || "home") !== "home") return;
  var S = window.SITE || {}, R = document.documentElement;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var L = function () { return R.lang === "fa" ? "fa" : "en"; };
  var N = 12, ang = 0, vel = 0, drag = false, sx = 0, sa = 0, items = [], rot, sec, snapT = 0;
  function build() {
    var m = document.querySelector("main"), k = L(); if (!m) return; var o = document.getElementById("ring"); if (o && o.dataset.k === k) return; if (o) o.remove();
    var ref = document.getElementById("bio") || document.getElementById("acad"); if (!ref || ref.parentNode !== m) return;
    var gal = (S.gallery || []).filter(function (g) { return g && /^[\w-]+$/.test(g.id || "") && !g.hidden; }); if (gal.length < 6) return;
    var step = Math.max(1, Math.floor(gal.length / N)), pick = gal.filter(function (g, i) { return i % step === 0; }).slice(0, N); N = pick.length; var fa = k === "fa";
    sec = el("section", "sec rgx"); sec.id = "ring"; sec.dataset.k = k; sec.setAttribute("aria-label", fa ? "حلقهٔ آثار" : "Gallery ring");
    var h = el("div", "rg-h"); h.appendChild(el("span", "eyb", fa ? "حلقهٔ آثار" : "GALLERY RING")); h.appendChild(el("h2", "", fa ? "آثارم را بچرخان" : "Spin through my work")); h.appendChild(el("p", "", fa ? "بکش، با فلش‌ها بچرخان یا روی یک اثر بزن تا بزرگ شود." : "Drag, use the arrow keys, or tap a piece to see it large.")); sec.appendChild(h);
    var st = el("div", "rg-st"); st.tabIndex = 0; st.setAttribute("role", "group"); st.setAttribute("aria-label", fa ? "گالری سه‌بعدی؛ با فلش‌ها بچرخان" : "3D gallery; use arrow keys to rotate");
    rot = el("div", "rg-r"); items = pick.map(function (g, i) { var b = el("button", "rg-i"); b.type = "button"; b.setAttribute("aria-label", (fa ? "اثر " : "Work ") + (i + 1)); var im = el("img"); im.src = "assets/work/" + g.id + ".webp"; im.alt = ""; im.loading = "lazy"; im.draggable = false; b.appendChild(im); b.onclick = function () { if (moved > 6) return; zoom(g.id, i); }; rot.appendChild(b); return b; });
    st.appendChild(rot); sec.appendChild(st);
    var bar = el("div", "rg-b"); var pv = el("button", "", fa ? "▶" : "◀"), nx = el("button", "", fa ? "◀" : "▶"); pv.type = nx.type = "button"; pv.setAttribute("aria-label", fa ? "قبلی" : "Previous"); nx.setAttribute("aria-label", fa ? "بعدی" : "Next");
    pv.onclick = function () { go(-1); }; nx.onclick = function () { go(1); }; bar.appendChild(pv); bar.appendChild(nx); sec.appendChild(bar);
    m.insertBefore(sec, ref); layout(); bind(st);
  }
  var moved = 0;
  function layout() { if (!rot) return; var w = Math.min(230, Math.max(150, innerWidth * .44)), h = w * 1.25, Rr = Math.round((w / 2 + 14) / Math.tan(Math.PI / N)); rot.style.setProperty("--w", w + "px"); rot.style.setProperty("--h", h + "px"); items.forEach(function (b, i) { b.style.transform = "rotateY(" + (i * 360 / N) + "deg) translateZ(" + Rr + "px)"; }); rot.parentNode.style.height = (h + 80) + "px"; paint(); }
  function paint() { if (!rot) return; rot.style.transform = "translateZ(-" + Math.round((parseFloat(getComputedStyle(rot).getPropertyValue("--w")) / 2 + 14) / Math.tan(Math.PI / N)) + "px) rotateY(" + ang + "deg)"; var f = Math.round(((-ang % 360) + 360) % 360 / (360 / N)) % N; items.forEach(function (b, i) { b.classList.toggle("front", i === f); }); }
  function snap() { var s = 360 / N; ang = Math.round(ang / s) * s; rot.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)"; paint(); }
  function go(d) { rot.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)"; ang -= d * 360 / N; paint(); }
  function bind(st) {
    st.addEventListener("pointerdown", function (e) { drag = true; moved = 0; sx = e.clientX; sa = ang; rot.style.transition = "none"; });
    addEventListener("pointermove", function (e) { if (!drag) return; var d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); ang = sa + d * .35; paint(); });
    addEventListener("pointerup", function () { if (!drag) return; drag = false; snap(); });
    st.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } else if (e.key === "ArrowRight") { e.preventDefault(); go(1); } });
  }
  var dlg;
  function zoom(id, i) { if (!dlg) { dlg = el("dialog", "rg-dlg"); dlg.setAttribute("aria-label", "Work"); document.body.appendChild(dlg); dlg.addEventListener("click", function () { dlg.close(); }); }
    dlg.textContent = ""; var im = el("img"); im.src = "assets/work/" + id + ".webp"; im.alt = ""; dlg.appendChild(im); var x = el("button", "rg-x", "×"); x.type = "button"; x.setAttribute("aria-label", L() === "fa" ? "بستن" : "Close"); dlg.appendChild(x); if (dlg.showModal) dlg.showModal(); }
  var t = 0; function soon() { clearTimeout(t); t = setTimeout(build, 250); }
  function init() { build(); setTimeout(build, 900); setTimeout(build, 2500); try { new MutationObserver(soon).observe(document.querySelector("main") || document.body, { childList: true }); } catch (e) {} addEventListener("resize", layout); }
  if (window.SITE) init(); else addEventListener("load", init);
})();
