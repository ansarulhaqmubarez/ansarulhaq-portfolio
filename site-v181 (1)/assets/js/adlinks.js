/* Admin: study / download links per lesson. Saved as design.lesson_links = { lessonId: [ {k:"link"|"dl", t:{fa,en}, u} ] } in site_settings. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "برای هر درس، لینک مطالعه یا فایل دانلود بگذار. فایل را در Supabase Storage (باکت media) آپلود کن و لینک عمومی‌اش را اینجا بنویس، یا لینک https بگذار.", pick: "درس را انتخاب کن", fa: "نام فارسی", en: "نام انگلیسی", u: "لینک (https://…)", kind: "نوع", link: "مطالعه", dl: "دانلود", add: "افزودن", del: "حذف", ok: "ذخیره شد ✓", bad: "ذخیره نشد. سوپرادمین باش و cms-6.sql را اجرا کن.", bu: "لینک باید با https:// شروع شود.", none: "این درس هنوز لینکی ندارد.", nol: "هنوز درسی نیست.", ld: "در حال بارگذاری…" },
    en: { p: "Add a study link or download file for each lesson. Upload the file to Supabase Storage (bucket media) and paste its public link, or use an https link.", pick: "Choose a lesson", fa: "Persian name", en: "English name", u: "Link (https://…)", kind: "Type", link: "Study", dl: "Download", add: "Add", del: "Remove", ok: "Saved ✓", bad: "Not saved. Be super admin and run cms-6.sql.", bu: "Link must start with https://", none: "No links for this lesson yet.", nol: "No lessons yet.", ld: "Loading…" }
  };
  var lt = function (o) { return o && typeof o === "object" ? (o.fa || o.en || "") : String(o || ""); };
  window.__adLinks = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], map = {}, lessons = [], cur = "", msg = "";
    function save() {
      SB.send("POST", "site_settings?on_conflict=key", { key: "design.lesson_links", value: map }, "resolution=merge-duplicates,return=minimal").then(function () {
        try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.lesson_links = map; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
        msg = L.ok; draw();
      }).catch(function () { msg = L.bad; draw(); });
    }
    function draw() {
      if (!lessons.length) { box.innerHTML = '<p class="muted">' + esc(L.nol) + "</p>"; return; }
      var arr = (cur && map[cur]) || [];
      box.innerHTML = '<p class="muted">' + esc(L.p) + "</p>" + (msg ? '<p class="fstatus" role="status">' + esc(msg) + "</p>" : "") +
        '<label class="adc">' + esc(L.pick) + '<select id="llSel"><option value="">—</option>' + lessons.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === cur ? " selected" : "") + ">" + esc(x.course_id + " · " + x.position + " · " + lt(x.title)) + "</option>"; }).join("") + "</select></label>" +
        (cur ? (arr.length ? '<ul class="stu-l">' + arr.map(function (x, i) { return "<li><b>" + esc((x.k === "dl" ? "⬇ " : "↗ ") + lt(x.t)) + '</b> <small dir="ltr">' + esc(x.u) + '</small> <button type="button" class="btn" data-d="' + i + '">' + esc(L.del) + "</button></li>"; }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>") +
          '<form id="llNew" class="stu-t"><label class="adc">' + esc(L.fa) + '<input name="fa" maxlength="80" required></label><label class="adc">' + esc(L.en) + '<input name="en" dir="ltr" maxlength="80"></label><label class="adc">' + esc(L.u) + '<input name="u" dir="ltr" maxlength="400" required></label><label class="adc">' + esc(L.kind) + '<select name="k"><option value="link">' + esc(L.link) + '</option><option value="dl">' + esc(L.dl) + '</option></select></label><button class="btn go" type="submit">' + esc(L.add) + "</button></form>" : "");
    }
    box.addEventListener("change", function (e) { if (e.target.id === "llSel") { cur = e.target.value; msg = ""; draw(); } });
    box.addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target; if (!cur) return;
      if (!/^https:\/\/[^\s"'<>]+$/i.test(f.u.value.trim())) { msg = L.bu; draw(); return; }
      var a = map[cur] || (map[cur] = []); if (a.length >= 12) return;
      a.push({ k: f.k.value === "dl" ? "dl" : "link", t: { fa: f.fa.value.trim(), en: f.en.value.trim() }, u: f.u.value.trim() }); save();
    });
    box.addEventListener("click", function (e) { var b = e.target.closest("[data-d]"); if (!b || !cur) return; map[cur].splice(+b.dataset.d, 1); if (!map[cur].length) delete map[cur]; save(); });
    box.innerHTML = '<p class="muted">' + esc(L.ld) + "</p>";
    Promise.all([SB.rest("site_settings?select=value&key=eq.design.lesson_links").catch(function () { return []; }), SB.rest("lessons?select=id,course_id,position,title&order=course_id,position").catch(function () { return []; })]).then(function (r) {
      var v = r[0] && r[0][0] && r[0][0].value; map = v && typeof v === "object" && !Array.isArray(v) ? v : {}; lessons = Array.isArray(r[1]) ? r[1] : []; draw();
    });
  } };
})();
