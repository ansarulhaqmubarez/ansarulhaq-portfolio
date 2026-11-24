/* Admin: extra footer links (saved as design.footer_links in site_settings; super_admin writes by RLS). */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "لینک‌های اضافه در ستون «آکادمی» فوتر. حداکثر ۸ لینک.", fa: "نام فارسی", en: "نام انگلیسی", u: "لینک (https://… یا page.html#…)", add: "افزودن", del: "حذف", ok: "ذخیره شد ✓", bad: "ذخیره نشد. سوپرادمین باش و cms-6.sql را اجرا کن.", bu: "لینک درست نیست.", none: "هنوز لینکی نیست." },
    en: { p: "Extra links in the footer 'Academy' column. Up to 8.", fa: "Persian name", en: "English name", u: "Link (https://… or page.html#…)", add: "Add", del: "Remove", ok: "Saved ✓", bad: "Not saved. Be super admin and run cms-6.sql.", bu: "Link is not valid.", none: "No links yet." }
  };
  var okLink = function (u) { return /^(https:\/\/[^\s"'<>]+|[\w\-]+\.html(#[\w\-]*)?|#[\w\-]+)$/i.test(u || ""); };
  window.__adFooter = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], list = [], msg = "";
    function save() {
      SB.send("POST", "site_settings?on_conflict=key", { key: "design.footer_links", value: list }, "resolution=merge-duplicates,return=minimal").then(function () {
        try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.footer_links = list; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
        msg = L.ok; draw();
      }).catch(function () { msg = L.bad; draw(); });
    }
    function draw() {
      box.innerHTML = '<p class="muted">' + esc(L.p) + "</p>" + (msg ? '<p class="fstatus" role="status">' + esc(msg) + "</p>" : "") +
        (list.length ? '<ul class="stu-l">' + list.map(function (x, i) { return "<li><b>" + esc((x.t && (x.t.fa || x.t.en)) || "") + '</b> <small dir="ltr">' + esc(x.u) + '</small> <button type="button" class="btn" data-d="' + i + '">' + esc(L.del) + "</button></li>"; }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>") +
        '<form id="ftNew" class="stu-t"><label class="adc">' + esc(L.fa) + '<input name="fa" maxlength="60" required></label><label class="adc">' + esc(L.en) + '<input name="en" dir="ltr" maxlength="60"></label><label class="adc">' + esc(L.u) + '<input name="u" dir="ltr" maxlength="300" required></label><button class="btn go" type="submit">' + esc(L.add) + "</button></form>";
    }
    box.addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target;
      if (!okLink(f.u.value.trim())) { msg = L.bu; draw(); return; }
      if (list.length >= 8) return;
      list.push({ t: { fa: f.fa.value.trim(), en: f.en.value.trim() }, u: f.u.value.trim() }); save();
    });
    box.addEventListener("click", function (e) { var b = e.target.closest("[data-d]"); if (b) { list.splice(+b.dataset.d, 1); save(); } });
    SB.rest("site_settings?select=value&key=eq.design.footer_links").then(function (r) { var v = r && r[0] && r[0].value; list = Array.isArray(v) ? v : []; draw(); }).catch(function () { list = []; draw(); });
  } };
})();
