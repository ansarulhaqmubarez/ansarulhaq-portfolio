/* Admin: learner-protection switches stored in site_settings (only super_admin can save; RLS enforces it). */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { note: "این سوییچ‌ها فقط بازدارنده‌اند و جلوی ضبط صفحه را نمی‌گیرند. فقط مدیر ارشد (super_admin) می‌تواند ذخیره کند.", rc: "بستن راست‌کلیک روی پخش‌کننده و آزمون", sel: "بستن انتخاب متن در صفحهٔ دوره", wm: "واترمارک ایمیل و شناسهٔ دانشجو روی ویدیو", saved: "ذخیره شد", failed: "ذخیره نشد (فقط مدیر ارشد، یا cms-1.sql اجرا نشده)", err: "بارگذاری نشد." },
    en: { note: "These switches are a deterrent only and cannot stop screen recording. Only a super_admin can save.", rc: "Block right-click on the player and exams", sel: "Block text selection on the course page", wm: "Watermark learner email and ID over the video", saved: "Saved", failed: "Could not save (super_admin only, or cms-1.sql not run)", err: "Could not load." }
  };
  var KEYS = [["security.block_right_click", "rc"], ["security.block_text_selection", "sel"], ["security.video_watermark", "wm"]];
  window.__adSec = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], cur = {};
    box.innerHTML = '<p class="muted">' + esc(L.note) + '</p><div class="sw-list">' + KEYS.map(function (k) { return '<label class="sw"><input type="checkbox" data-k="' + k[0] + '"><span>' + esc(L[k[1]]) + '</span></label>'; }).join("") + '</div><p class="fstatus" role="status" aria-live="polite" id="swSt"></p>';
    var st = box.querySelector("#swSt");
    SB.rest("site_settings?select=key,value&key=like.security.*").then(function (rows) {
      (rows || []).forEach(function (r) { cur[r.key] = r.value === true; });
      [].forEach.call(box.querySelectorAll("input[data-k]"), function (i) { i.checked = !!cur[i.getAttribute("data-k")]; });
    }).catch(function () { st.textContent = L.err; st.className = "fstatus err"; });
    box.addEventListener("change", function (e) {
      var i = e.target; if (!i.matches || !i.matches("input[data-k]")) return;
      SB.send("POST", "site_settings?on_conflict=key", { key: i.getAttribute("data-k"), value: i.checked }, "resolution=merge-duplicates,return=minimal")
        .then(function () { st.textContent = L.saved; st.className = "fstatus ok"; })
        .catch(function () { i.checked = !i.checked; st.textContent = L.failed; st.className = "fstatus err"; });
    });
  } };
})();
