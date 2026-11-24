/* Admin: public feedback moderation (approve / hide / delete). Permissions are enforced by Supabase (super_admin only). */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "پیام‌هایی که بازدیدکننده‌ها اجازهٔ نمایش‌شان را داده‌اند. فقط موارد «تأییدشده» در صفحهٔ بازخورد دیده می‌شوند.", ok: "تأیید و نمایش", hide: "پنهان", del: "حذف", sure: "این پیام برای همیشه حذف شود؟", none: "پیامی نیست.", err: "خطا. SQL فایل cms-11-feedback.sql اجرا شده؟", on: "نمایش داده می‌شود", off: "در انتظار تأیید" },
    en: { p: "Messages visitors allowed to publish. Only approved ones appear on the feedback page.", ok: "Approve & show", hide: "Hide", del: "Delete", sure: "Delete this message permanently?", none: "No messages.", err: "Error. Did you run cms-11-feedback.sql?", on: "Shown", off: "Waiting for approval" }
  };
  window.__adFeed = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], rows = [];
    box.innerHTML = '<p class="muted">' + esc(L.p) + '</p><ul class="adl" id="fdL"></ul>';
    var list = box.querySelector("#fdL");
    function draw() {
      list.innerHTML = rows.length ? rows.map(function (x) { return '<li><b>' + esc(x.name) + '</b> · <small>' + esc(x.kind) + ' · ' + esc((x.created_at || "").slice(0, 10)) + ' · ' + esc(x.approved ? L.on : L.off) + '</small><p>' + esc(x.message) + '</p><button type="button" class="btn' + (x.approved ? '' : ' go') + '" data-id="' + esc(x.id) + '" data-a="' + (x.approved ? "0" : "1") + '">' + esc(x.approved ? L.hide : L.ok) + '</button> <button type="button" class="btn" data-id="' + esc(x.id) + '" data-d="1">' + esc(L.del) + '</button></li>'; }).join("") : '<li class="muted">' + esc(L.none) + '</li>';
    }
    SB.rest("feedback_public?select=id,name,kind,message,approved,created_at&order=created_at.desc&limit=300").then(function (r) { rows = Array.isArray(r) ? r : []; draw(); }).catch(function () { list.innerHTML = '<li class="fstatus err">' + esc(L.err) + '</li>'; });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-id]"); if (!b) return; var id = encodeURIComponent(b.dataset.id);
      if (b.dataset.d) { if (!confirm(L.sure)) return; SB.send("DELETE", "feedback_public?id=eq." + id, null, "return=minimal").then(function () { rows = rows.filter(function (x) { return x.id !== b.dataset.id; }); draw(); }).catch(function () { list.insertAdjacentHTML("afterbegin", '<li class="fstatus err">' + esc(L.err) + '</li>'); }); return; }
      SB.send("PATCH", "feedback_public?id=eq." + id, { approved: b.dataset.a === "1" }, "return=minimal").then(function () { rows.forEach(function (x) { if (x.id === b.dataset.id) x.approved = b.dataset.a === "1"; }); draw(); }).catch(function () { list.insertAdjacentHTML("afterbegin", '<li class="fstatus err">' + esc(L.err) + '</li>'); });
    });
  } };
})();
