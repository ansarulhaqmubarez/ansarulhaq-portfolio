/* Course page: applies the admin switches from site_settings (security.block_right_click, security.block_text_selection, security.video_watermark).
   These are deterrents only. They cannot stop screen recording. */
(function () {
  "use strict";
  function boot() {
    var SB = window.__SB, S = window.SITE; if (!SB || !S || !S.supabaseUrl) return;
    SB.rest("site_settings?select=key,value&key=like.security.*").then(function (rows) {
      var f = {}; (rows || []).forEach(function (r) { f[r.key] = r.value === true; });
      if (f["security.block_text_selection"]) document.documentElement.classList.add("sec-nosel");
      if (f["security.block_right_click"]) document.addEventListener("contextmenu", function (e) { if (e.target.closest && e.target.closest("#lplay,.exm")) e.preventDefault(); });
      if (f["security.video_watermark"]) watermark();
    }).catch(function () {});
  }
  function watermark() {
    var ses = window.__SB.get && window.__SB.get(); if (!ses) return;
    var label = String(ses.email || ses.id || "").slice(0, 40) + " · " + String(ses.id || "").slice(0, 8).toUpperCase();
    var put = function () {
      var box = document.getElementById("lplay"); if (!box || box.querySelector(".lwm") || !box.querySelector("iframe")) return;
      box.style.position = "relative"; var w = document.createElement("div"); w.className = "lwm"; w.setAttribute("aria-hidden", "true"); w.textContent = label; box.appendChild(w);
    };
    new MutationObserver(put).observe(document.body, { childList: true, subtree: true }); put();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 50); }); else setTimeout(boot, 50);
})();
