/* Admin: answer course questions (table course_questions, cms-13.sql). Open questions first. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "پرسش‌های دانشجویان. بی‌پاسخ‌ها اول می‌آیند.", none: "سؤالی نیست.", ans: "پاسخ تو", send: "ذخیره پاسخ", hide: "مخفی کردن", show: "نمایش", del: "حذف", ok: "ذخیره شد.", bad: "ذخیره نشد. cms-13.sql را اجرا کن و با مدیر کل وارد شو.", open: "بی‌پاسخ", askDel: "حذف شود؟", course: "دوره" },
    en: { p: "Student questions. Unanswered first.", none: "No questions.", ans: "Your answer", send: "Save answer", hide: "Hide", show: "Show", del: "Delete", ok: "Saved.", bad: "Not saved. Run cms-13.sql and sign in as super admin.", open: "Unanswered", askDel: "Delete?", course: "Course" }
  };
  window.__adQa = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], rows = [], msg = "", err = "";
    function load() { SB.rest("course_questions?select=id,course_id,author_name,body,answer,status,created_at&order=created_at.desc&limit=200").then(function (r) { rows = (r || []).sort(function (a, b) { return (a.answer ? 1 : 0) - (b.answer ? 1 : 0); }); draw(); }).catch(function () { rows = []; err = L.bad; draw(); }); }
    function draw() {
      box.innerHTML = '<p class="muted">' + esc(L.p) + "</p>" + (msg ? '<p class="fstatus ok" role="status">' + esc(msg) + "</p>" : "") + (err ? '<p class="fstatus err" role="alert">' + esc(err) + "</p>" : "") +
        (rows.length ? '<ul class="stu-l">' + rows.map(function (r) {
          return '<li class="qa-i"><p><b>' + esc(r.author_name || "") + '</b> <small dir="ltr">' + esc(String(r.created_at || "").slice(0, 10)) + " · " + esc(L.course) + " " + esc(r.course_id) + "</small> " + (!r.answer ? '<span class="pill">' + esc(L.open) + "</span> " : "") + (r.status === "hidden" ? '<span class="pill">' + esc(L.hide) + "</span>" : "") + "</p><p>" + esc(r.body) + "</p>" +
            '<form class="qa-af" data-id="' + esc(r.id) + '"><label class="adc">' + esc(L.ans) + '<textarea name="a" rows="2" maxlength="2000">' + esc(r.answer) + '</textarea></label><button class="btn go" type="submit">' + esc(L.send) + '</button> <button class="btn" type="button" data-h="' + esc(r.id) + '" data-s="' + (r.status === "hidden" ? "show" : "hide") + '">' + esc(r.status === "hidden" ? L.show : L.hide) + '</button> <button class="btn" type="button" data-x="' + esc(r.id) + '">' + esc(L.del) + "</button></form></li>";
        }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>");
    }
    var done = function () { msg = L.ok; err = ""; load(); }, fail = function () { msg = ""; err = L.bad; draw(); };
    box.addEventListener("submit", function (e) {
      var f = e.target.closest(".qa-af"); if (!f) return; e.preventDefault(); var a = f.a.value.trim();
      SB.send("PATCH", "course_questions?id=eq." + encodeURIComponent(f.dataset.id), { answer: a || null, answered_at: a ? new Date().toISOString() : null, status: a ? "answered" : "open" }, "return=minimal").then(done).catch(fail);
    });
    box.addEventListener("click", function (e) {
      var h = e.target.closest("[data-h]"), x = e.target.closest("[data-x]");
      if (h) SB.send("PATCH", "course_questions?id=eq." + encodeURIComponent(h.dataset.h), { status: h.dataset.s === "hide" ? "hidden" : "open" }, "return=minimal").then(done).catch(fail);
      else if (x && window.confirm(L.askDel)) SB.send("DELETE", "course_questions?id=eq." + encodeURIComponent(x.dataset.x)).then(done).catch(fail);
    });
    load();
  } };
})();
