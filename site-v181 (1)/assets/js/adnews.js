/* Admin: newsletter subscribers (read, search, delete, export CSV). Permissions are enforced by Supabase (super_admin only). */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "ایمیل‌هایی که بازدیدکننده‌ها در فرم خبرنامه گذاشته‌اند. برای نمایش فرم، در «ظاهر و جلوه‌ها» گزینهٔ خبرنامه را روشن کن.", q: "جستجوی ایمیل", n: "تعداد", csv: "دانلود CSV", del: "حذف", none: "هنوز ایمیلی ثبت نشده.", err: "خواندن فهرست ممکن نشد. آیا cms-7.sql را اجرا کرده‌ای و با حساب مدیر کل وارد شده‌ای؟", sure: "این ایمیل حذف شود؟" },
    en: { p: "Emails visitors left in the newsletter form. To show the form, switch Newsletter on in Look & effects.", q: "Search email", n: "Count", csv: "Download CSV", del: "Delete", none: "No emails yet.", err: "Could not read the list. Did you run cms-7.sql and sign in as super admin?", sure: "Delete this email?" }
  };
  var csvCell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
  window.__adNews = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], rows = [];
    box.innerHTML = '<p class="muted">' + esc(L.p) + '</p><div class="stu-t"><label class="adc">' + esc(L.q) + '<input type="search" id="nwQ" maxlength="80"></label><button type="button" class="btn" id="nwC">' + esc(L.csv) + '</button></div><p class="muted" id="nwN" role="status"></p><ul class="ck-l" id="nwL"></ul>';
    var list = box.querySelector("#nwL");
    function draw() {
      var q = box.querySelector("#nwQ").value.trim().toLowerCase(), v = rows.filter(function (x) { return !q || x.email.toLowerCase().indexOf(q) >= 0; });
      box.querySelector("#nwN").textContent = L.n + ": " + v.length;
      list.innerHTML = v.length ? v.slice(0, 200).map(function (x) { return '<li><span dir="ltr">' + esc(x.email) + '</span> <small>' + esc((x.created_at || "").slice(0, 10)) + ' · ' + esc(x.lang) + '</small> <button type="button" class="btn" data-id="' + esc(x.id) + '">' + esc(L.del) + '</button></li>'; }).join("") : '<li>' + esc(L.none) + '</li>';
    }
    SB.rest("newsletter_subscribers?select=id,email,lang,created_at&order=created_at.desc&limit=5000").then(function (r) { rows = Array.isArray(r) ? r : []; draw(); }).catch(function () { list.innerHTML = '<li class="fstatus err">' + esc(L.err) + '</li>'; });
    box.querySelector("#nwQ").addEventListener("input", draw);
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.id === "nwC") { var body = rows.map(function (x) { return [x.email, x.lang, x.created_at].map(csvCell).join(","); }), blob = new Blob(["﻿" + ["email,lang,date"].concat(body).join("\r\n")], { type: "text/csv;charset=utf-8" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "newsletter.csv"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); return; }
      if (b.dataset.id) { if (!confirm(L.sure)) return; var id = b.dataset.id; SB.send("DELETE", "newsletter_subscribers?id=eq." + encodeURIComponent(id), null, "return=minimal").then(function () { rows = rows.filter(function (x) { return x.id !== id; }); draw(); }).catch(function () {}); }
    });
  } };
})();
