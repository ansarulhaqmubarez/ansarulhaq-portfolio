/* Footer: QR block + collapsible columns on phones; Home: small draggable video player. No inline code (CSP). */
(function () {
  var S = window.SITE || {}, R = document.documentElement, fa = R.lang === "fa", page = document.body.dataset.page || "home";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.textContent = h; return e; }

  function footer() {
    var f = $("#site-footer"); if (!f || f.dataset.f2) return; var brand = $("#ftBrand", f) || $(".ft-brand", f); if (!brand) return; f.dataset.f2 = "1";
    var box = el("div", "ft-qr"), cap = el("p", "ft-qrc", fa ? "اسکن کنید و سایت را باز کنید" : "Scan to open the site"), host = el("div", "ft-qrb");
    host.setAttribute("role", "img"); host.setAttribute("aria-label", fa ? "کد QR آدرس سایت" : "QR code of the site address");
    box.appendChild(host); box.appendChild(cap); brand.appendChild(box);
    function draw() { try { var q = window.qrcode(0, "M"); q.addData(location.origin + "/"); q.make(); host.innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); var s = $("svg", host); if (s) { s.setAttribute("aria-hidden", "true"); s.setAttribute("width", "96"); s.setAttribute("height", "96"); } } catch (e) {} }
    function load() { if (window.qrcode) return draw(); var sc = document.createElement("script"); sc.src = "/assets/js/qr.js"; sc.onload = draw; document.head.appendChild(sc); }
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: "300px" }); io.observe(box); } else load();
    /* collapsible columns on phones */
    $$(".ft-c", f).forEach(function (c) {
      var h = $("h2", c), ul = $("ul", c); if (!h || !ul) return;
      var b = el("button", "ft-tg"); b.type = "button"; b.innerHTML = h.innerHTML; b.setAttribute("aria-expanded", "true"); h.innerHTML = ""; h.appendChild(b);
      var mq = window.matchMedia("(max-width:700px)");
      function set(open) { c.classList.toggle("ft-closed", !open); b.setAttribute("aria-expanded", open ? "true" : "false"); }
      set(!mq.matches); b.onclick = function () { if (mq.matches) set(c.classList.contains("ft-closed")); };
      var fn = function () { set(!mq.matches); }; if (mq.addEventListener) mq.addEventListener("change", fn);
    });
  }

  function mini() {
    if (page !== "home") return;
    var pl = (S.playlists || []).filter(function (p) { return /list=([\w-]+)/.test(p.url || ""); })[0]; if (!pl) return;
    var id = /list=([\w-]+)/.exec(pl.url)[1], gone = false; try { gone = sessionStorage.getItem("mv-x") === "1"; } catch (e) {} if (gone) return;
    var w = el("aside", "mv"); w.setAttribute("aria-label", fa ? "ویدیوهای من" : "My videos");
    var hd = el("div", "mv-h"), grip = el("button", "mv-g", fa ? "ویدیوهای من" : "My videos"); grip.type = "button";
    grip.setAttribute("aria-label", (fa ? "جابه‌جایی پخش‌کننده؛ با کلیدهای جهت‌نما حرکت دهید" : "Move player; use arrow keys")); 
    var mn = el("button", "mv-b", "–"), cl = el("button", "mv-b", "×"); mn.type = cl.type = "button";
    mn.setAttribute("aria-label", fa ? "کوچک/بزرگ کردن" : "Minimize / expand"); cl.setAttribute("aria-label", fa ? "بستن" : "Close");
    hd.appendChild(grip); hd.appendChild(mn); hd.appendChild(cl);
    var body = el("div", "mv-p"), pb = el("button", "mv-play"); pb.type = "button"; pb.setAttribute("aria-label", fa ? "پخش ویدیوها" : "Play videos");
    pb.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span>' + (fa ? "پخش" : "Play") + "</span>";
    body.appendChild(pb); w.appendChild(hd); w.appendChild(body); document.body.appendChild(w);
    pb.onclick = function () { var f = document.createElement("iframe"); f.src = "https://www.youtube-nocookie.com/embed/videoseries?list=" + id + "&autoplay=1&rel=0"; f.title = fa ? "ویدیوهای من" : "My videos"; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.setAttribute("allowfullscreen", ""); f.referrerPolicy = "strict-origin-when-cross-origin"; body.innerHTML = ""; body.appendChild(f); };
    mn.onclick = function () { var m = w.classList.toggle("mv-min"); mn.textContent = m ? "+" : "–"; };
    cl.onclick = function () { try { sessionStorage.setItem("mv-x", "1"); } catch (e) {} w.remove(); };
    /* drag (mouse/touch/pen) and keyboard, any direction */
    function place(x, y) { var r = w.getBoundingClientRect(); x = Math.max(4, Math.min(innerWidth - r.width - 4, x)); y = Math.max(4, Math.min(innerHeight - r.height - 4, y)); w.style.left = x + "px"; w.style.top = y + "px"; w.style.right = "auto"; w.style.bottom = "auto"; }
    var d = null;
    grip.addEventListener("pointerdown", function (e) { var r = w.getBoundingClientRect(); d = { dx: e.clientX - r.left, dy: e.clientY - r.top }; grip.setPointerCapture(e.pointerId); e.preventDefault(); });
    grip.addEventListener("pointermove", function (e) { if (d) place(e.clientX - d.dx, e.clientY - d.dy); });
    grip.addEventListener("pointerup", function () { d = null; }); grip.addEventListener("pointercancel", function () { d = null; });
    grip.addEventListener("keydown", function (e) { var k = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key]; if (!k) return; e.preventDefault(); var r = w.getBoundingClientRect(); place(r.left + k[0], r.top + k[1]); });
    addEventListener("resize", function () { if (w.style.left) { var r = w.getBoundingClientRect(); place(r.left, r.top); } });
  }
  function go() { footer(); mini(); }
  if (document.readyState !== "loading") setTimeout(go, 400); else document.addEventListener("DOMContentLoaded", function () { setTimeout(go, 400); });
  window.addEventListener("load", function () { setTimeout(footer, 300); });
})();
