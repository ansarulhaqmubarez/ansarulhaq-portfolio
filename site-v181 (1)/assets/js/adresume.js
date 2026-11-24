/* Admin: Resume architect (education + work experience). Table site_resume (cms-5.sql). Staff only (RLS enforces it).
   The public site reads the table and falls back to data/content.js while the table is empty. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { te: "تحصیلات", tx: "سوابق کاری", imp: "وارد کردن از فایل سایت", impH: "فقط موارد تازه را اضافه می‌کند و چیزی را عوض نمی‌کند.", add: "مورد تازه", none: "هنوز چیزی نیست.", edit: "ویرایش", hide: "پنهان", show: "نمایش", del: "حذف", up: "بالا", dn: "پایین", sure: "حذف شود؟ برگشت ندارد.", save: "ذخیره", cancel: "بستن", saved: "ذخیره شد.", failed: "ذخیره نشد. دوباره تلاش کن.", loadErr: "خواندن ممکن نشد. ممکن است cms-5.sql هنوز اجرا نشده باشد.", imported: "وارد شد: ", hid: "پنهان در سایت", fa: "فارسی", en: "English", school: "دانشگاه یا مؤسسه", field: "رشته", status: "وضعیت (مثلاً سمستر ششم، سال سوم)", org: "مرکز یا شرکت", role: "عنوان کاری", when: "بازهٔ زمانی (مثلاً ۲۰۲۳ تا ۲۰۲۴)", text: "توضیح کوتاه", tasks: "کارهای انجام‌شده (هر کار در یک خط)", orgNote: "نام مرکز یک بار نوشته می‌شود.", bad: "نام لازم است." },
    en: { te: "Education", tx: "Work experience", imp: "Import from site file", impH: "Adds only new items and changes nothing that exists.", add: "New entry", none: "Nothing here yet.", edit: "Edit", hide: "Hide", show: "Show", del: "Delete", up: "Up", dn: "Down", sure: "Delete this? It cannot be undone.", save: "Save", cancel: "Close", saved: "Saved.", failed: "Not saved. Try again.", loadErr: "Could not read. cms-5.sql may not have been run yet.", imported: "Imported: ", hid: "Hidden on the site", fa: "Persian", en: "English", school: "University or institution", field: "Field of study", status: "Status (e.g. Semester 6, year 3)", org: "Center or company", role: "Role / title", when: "Dates (e.g. 2023 to 2024)", text: "Short description", tasks: "Tasks done (one per line)", orgNote: "The organisation name is written once.", bad: "A name is required." }
  };
  var ID_RE = /^[a-z0-9_-]{1,40}$/;
  function clip(v, n) { return String(v == null ? "" : v).trim().slice(0, n); }
  function pair(f, p, n) { var o = { fa: clip(f.elements[p + "_fa"].value, n), en: clip(f.elements[p + "_en"].value, n) }; return o; }
  function lines(v) { return String(v || "").split(/\r?\n/).map(function (x) { return x.trim().slice(0, 200); }).filter(Boolean).slice(0, 20); }

  window.__adResume = { mount: function (box, o) {
    var SB = o.SB, S = o.S, lang = o.lang === "fa" ? "fa" : "en", L = T[lang], base = window.__SITE0 || S;
    var kind = "education", rows = [];
    box.innerHTML = '<div class="st-tabs" role="tablist"><button type="button" class="btn go" data-k="education" role="tab"></button> <button type="button" class="btn" data-k="experience" role="tab"></button></div><p class="fstatus" id="rsSt" role="status"></p><div id="rsB"></div>';
    var st = box.querySelector("#rsSt"), body = box.querySelector("#rsB"), tabs = box.querySelectorAll("[data-k]");
    function say(m, k) { st.textContent = m || ""; st.className = "fstatus " + (k || ""); }
    function pick(v) { return v && typeof v === "object" ? (v[lang] || v.fa || v.en || "") : (v || ""); }
    function name(r) { var d = r.data || {}; return kind === "education" ? pick(d.school) || r.id : (d.org || r.id); }
    function sub(r) { var d = r.data || {}; return kind === "education" ? [pick(d.field), pick(d.status)].filter(Boolean).join(" - ") : [pick(d.role), pick(d.when)].filter(Boolean).join(" - "); }
    function mine() { return rows.filter(function (r) { return r.kind === kind; }); }
    function load() {
      return SB.rest("site_resume?select=id,kind,data,position,hidden&order=position.asc,created_at.asc&limit=300").then(function (r) { rows = r || []; }).catch(function () { rows = []; say(L.loadErr, "err"); });
    }
    function reorder(list) { return Promise.all(list.map(function (r, i) { return SB.send("PATCH", "site_resume?id=eq." + encodeURIComponent(r.id), { position: i }, "return=minimal"); })); }
    function draw() {
      [].forEach.call(tabs, function (b) { var on = b.getAttribute("data-k") === kind; b.setAttribute("aria-selected", on ? "true" : "false"); b.className = "btn" + (on ? " go" : ""); b.textContent = b.getAttribute("data-k") === "education" ? L.te : L.tx; });
      var list = mine();
      body.innerHTML = '<p class="muted">' + esc(L.impH) + '</p><p><button type="button" class="btn" id="rsImp">' + esc(L.imp) + '</button> <button type="button" class="btn go" id="rsAdd">' + esc(L.add) + '</button></p><div id="rsForm"></div>' +
        (list.length ? '<ol class="st-list">' + list.map(function (r, i) {
          return '<li data-id="' + esc(r.id) + '"' + (r.hidden ? ' class="st-off"' : "") + '><div class="st-t"><b>' + esc(name(r)) + '</b><small>' + esc(sub(r)) + '</small></div><div class="ib-a">' +
            '<button type="button" class="btn" data-a="up"' + (i === 0 ? " disabled" : "") + ' aria-label="' + esc(L.up) + '">&uarr;</button>' +
            '<button type="button" class="btn" data-a="dn"' + (i === list.length - 1 ? " disabled" : "") + ' aria-label="' + esc(L.dn) + '">&darr;</button>' +
            '<button type="button" class="btn" data-a="ed">' + esc(L.edit) + '</button>' +
            '<button type="button" class="btn" data-a="hd">' + esc(r.hidden ? L.show : L.hide) + '</button>' +
            '<button type="button" class="btn" data-a="del">' + esc(L.del) + '</button></div></li>';
        }).join("") + '</ol>' : '<p class="muted">' + esc(L.none) + '</p>');
    }
    function form(r) {
      var d = (r && r.data) || {}, isE = kind === "education", f = document.getElementById("rsForm");
      var pf = function (nm, lab, v, ml, area) { return '<label>' + esc(lab) + ' - ' + esc(L.fa) + (area ? '<textarea name="' + nm + '_fa" rows="2" maxlength="' + ml + '" dir="rtl">' : '<input name="' + nm + '_fa" maxlength="' + ml + '" dir="rtl" value="') + esc(v && v.fa) + (area ? "</textarea>" : '">') + '</label><label>' + esc(lab) + ' - ' + esc(L.en) + (area ? '<textarea name="' + nm + '_en" rows="2" maxlength="' + ml + '" dir="ltr">' : '<input name="' + nm + '_en" maxlength="' + ml + '" dir="ltr" value="') + esc(v && v.en) + (area ? "</textarea>" : '">') + '</label>'; };
      var tk = d.tasks || {}, tf = (tk.fa || []).join("\n"), te = (tk.en || []).join("\n");
      f.innerHTML = '<form class="st-f" novalidate>' + (isE ? pf("school", L.school, d.school, 120) + pf("field", L.field, d.field, 120) + pf("status", L.status, d.status, 80)
        : '<label>' + esc(L.org) + '<input name="org" maxlength="120" dir="ltr" value="' + esc(d.org) + '"></label>' + pf("role", L.role, d.role, 120) + pf("when", L.when, d.when, 60) + pf("text", L.text, d.text, 400, true) +
          '<label>' + esc(L.tasks) + ' - ' + esc(L.fa) + '<textarea name="tasks_fa" rows="4" dir="rtl">' + esc(tf) + '</textarea></label><label>' + esc(L.tasks) + ' - ' + esc(L.en) + '<textarea name="tasks_en" rows="4" dir="ltr">' + esc(te) + '</textarea></label>') +
        '<label class="st-chk"><input type="checkbox" name="hid"' + (r && r.hidden ? " checked" : "") + '> ' + esc(L.hid) + '</label><p><button type="submit" class="btn go">' + esc(L.save) + '</button> <button type="button" class="btn" id="rsX">' + esc(L.cancel) + '</button></p></form>';
      var frm = f.querySelector("form");
      f.querySelector("#rsX").onclick = function () { f.innerHTML = ""; };
      frm.onsubmit = function (e) {
        e.preventDefault(); var data;
        if (isE) { data = { school: pair(frm, "school", 120), field: pair(frm, "field", 120), status: pair(frm, "status", 80) }; if (!data.school.fa && !data.school.en) { say(L.bad, "err"); return; } }
        else { data = { org: clip(frm.elements.org.value, 120), role: pair(frm, "role", 120), when: pair(frm, "when", 60), text: pair(frm, "text", 400), tasks: { fa: lines(frm.elements.tasks_fa.value), en: lines(frm.elements.tasks_en.value) } }; if (!data.org) { say(L.bad, "err"); return; } }
        var nid = r ? r.id : (isE ? "e" : "x") + Date.now().toString(36), pos = r ? r.position : mine().length;
        if (!ID_RE.test(nid)) { say(L.failed, "err"); return; }
        SB.send("POST", "site_resume?on_conflict=id", { id: nid, kind: kind, data: data, hidden: frm.elements.hid.checked, position: pos }, "resolution=merge-duplicates,return=minimal")
          .then(load).then(function () { draw(); say(L.saved, "ok"); }).catch(function () { say(L.failed, "err"); });
      };
      f.scrollIntoView && f.scrollIntoView({ block: "nearest" });
    }
    body.addEventListener("click", function (e) {
      var t = e.target; if (!t.closest) return;
      if (t.id === "rsAdd") { form(null); return; }
      if (t.id === "rsImp") {
        var src = kind === "education" ? (base.education || []) : (base.experience || []);
        var arr = src.map(function (p, i) { var d = JSON.parse(JSON.stringify(p)); delete d.id; return { id: p.id, kind: kind, data: d, position: mine().length + i }; });
        if (!arr.length) return;
        SB.send("POST", "site_resume?on_conflict=id", arr, "resolution=ignore-duplicates,return=minimal").then(load).then(function () { draw(); say(L.imported + arr.length, "ok"); }).catch(function () { say(L.failed, "err"); });
        return;
      }
      var li = t.closest("li[data-id]"), a = t.getAttribute && t.getAttribute("data-a"); if (!li || !a) return;
      var id = li.getAttribute("data-id"), list = mine(), i = list.findIndex(function (r) { return r.id === id; }), r = list[i];
      if (a === "ed") form(r);
      else if (a === "hd") SB.send("PATCH", "site_resume?id=eq." + encodeURIComponent(id), { hidden: !r.hidden }, "return=minimal").then(load).then(draw).catch(function () { say(L.failed, "err"); });
      else if (a === "del") { if (window.confirm(L.sure)) SB.send("DELETE", "site_resume?id=eq." + encodeURIComponent(id), null, "return=minimal").then(load).then(draw).catch(function () { say(L.failed, "err"); }); }
      else if (a === "up" || a === "dn") { var j = a === "up" ? i - 1 : i + 1; if (j < 0 || j >= list.length) return; var tmp = list[i]; list[i] = list[j]; list[j] = tmp; reorder(list).then(load).then(draw).catch(function () { say(L.failed, "err"); }); }
    });
    [].forEach.call(tabs, function (b) { b.onclick = function () { kind = b.getAttribute("data-k"); draw(); }; });
    load().then(draw);
  } };
})();
