/* a11y.js: visitor accessibility panel (text size, contrast, spacing, underline links, stop motion, grayscale). Saved only in this browser. */
(function () {
  "use strict";
  var P = document.body && document.body.dataset.page; if (P === "admin" || P === "kiosk") return;
  var R = document.documentElement, KEY = "am-a11y", DEF = { fs: 100, hc: 0, ls: 0, ul: 0, nm: 0, gs: 0, rf: 0 }, st = {}, dlg;
  try { st = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { st = {}; }
  Object.keys(DEF).forEach(function (k) { if (typeof st[k] !== "number") st[k] = DEF[k]; });
  st.fs = Math.max(90, Math.min(150, st.fs));
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function apply() {
    R.style.fontSize = st.fs === 100 ? "" : st.fs + "%";
    R.classList.toggle("a11y-hc", !!st.hc); R.classList.toggle("a11y-ls", !!st.ls); R.classList.toggle("a11y-ul", !!st.ul); R.classList.toggle("a11y-nm", !!st.nm); R.classList.toggle("a11y-gs", !!st.gs); R.classList.toggle("a11y-rf", !!st.rf);
  }
  apply();
  function fa() { return R.lang === "fa"; }
  function build() {
    var f = fa(), T = f ? { h: "دسترسی‌پذیری", p: "تنظیمات خواندن را برای خودت تغییر بده. فقط در همین مرورگر ذخیره می‌شود.", fs: "اندازهٔ متن", hc: "کنتراست بالا", ls: "فاصلهٔ بیشتر خطوط", ul: "زیرخط همهٔ لینک‌ها", nm: "توقف حرکت‌ها", gs: "سیاه‌وسفید", rf: "فونت ساده و خوانا", rs: "بازنشانی", x: "بستن" } : { h: "Accessibility", p: "Change reading settings for yourself. Saved only in this browser.", fs: "Text size", hc: "High contrast", ls: "More line spacing", ul: "Underline all links", nm: "Stop motion", gs: "Grayscale", rf: "Plain readable font", rs: "Reset", x: "Close" };
    dlg.innerHTML = '<div class="ay-in" dir="' + (f ? "rtl" : "ltr") + '"><h2>' + T.h + '</h2><p>' + T.p + '</p><div class="ay-fs"><span>' + T.fs + ': <b>' + st.fs + '%</b></span><div><button type="button" class="btn" data-fs="-10" aria-label="' + T.fs + ' −">A−</button><button type="button" class="btn" data-fs="10" aria-label="' + T.fs + ' +">A+</button></div></div>' +
      ["hc", "ls", "ul", "nm", "gs", "rf"].map(function (k) { return '<label class="ay-row"><input type="checkbox" data-k="' + k + '"' + (st[k] ? " checked" : "") + '><span>' + T[k] + '</span></label>'; }).join("") +
      '<div class="ay-b"><button type="button" class="btn" data-rs>' + T.rs + '</button><button type="button" class="btn go" data-x>' + T.x + '</button></div></div>';
    dlg.querySelector("[data-x]").onclick = function () { dlg.close(); };
    dlg.querySelector("[data-rs]").onclick = function () { st = JSON.parse(JSON.stringify(DEF)); save(); apply(); build(); };
    [].forEach.call(dlg.querySelectorAll("[data-fs]"), function (b) { b.onclick = function () { st.fs = Math.max(90, Math.min(150, st.fs + +b.dataset.fs)); save(); apply(); dlg.querySelector(".ay-fs b").textContent = st.fs + "%"; }; });
    [].forEach.call(dlg.querySelectorAll("[data-k]"), function (c) { c.onchange = function () { st[c.dataset.k] = c.checked ? 1 : 0; save(); apply(); }; });
  }
  function open() { if (!dlg) { dlg = document.createElement("dialog"); dlg.className = "ay-dlg"; document.body.appendChild(dlg); dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); } build(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
  function ensure() {
    var t = document.querySelector("#site-footer .fbar-r"); if (!t) return; var b = document.getElementById("ayBtn");
    if (!b) { b = document.createElement("button"); b.type = "button"; b.id = "ayBtn"; b.className = "ay-btn"; b.onclick = open; t.appendChild(b); }
    var tt = fa() ? "دسترسی‌پذیری" : "Accessibility"; if (b.textContent !== tt) b.textContent = tt;
  }
  document.addEventListener("keydown", function (e) { if (e.altKey && e.key === "0") { e.preventDefault(); open(); } });
  var q2 = 0; ensure(); new MutationObserver(function () { var bb = document.getElementById("ayBtn"), ft = document.querySelector("#site-footer .fbar-r"); if (bb && ft && ft.contains(bb)) return; if (q2) return; q2 = requestAnimationFrame(function () { q2 = 0; ensure(); }); }).observe(document.documentElement, { childList: true, subtree: true });
})();
