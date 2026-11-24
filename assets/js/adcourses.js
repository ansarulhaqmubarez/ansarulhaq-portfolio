/* Admin: Courses and lessons manager. Uses the existing tables courses / lessons (staff can write them by RLS). No new SQL needed. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { add: "دورهٔ تازه", none: "هنوز دوره‌ای نیست.", edit: "ویرایش", pub: "انتشار", unpub: "پیش‌نویس", del: "حذف", sure: "این دوره و همهٔ درس‌هایش حذف شود؟ برگشت ندارد.", sureL: "این درس حذف شود؟", save: "ذخیره", cancel: "بستن", saved: "ذخیره شد.", failed: "ذخیره نشد. دوباره تلاش کن.", loadErr: "خواندن ممکن نشد.", id: "شناسه (حروف کوچک انگلیسی و خط تیره، بعداً تغییر نمی‌کند)", title: "عنوان", summary: "توضیح", fa: "فارسی", en: "English", cat: "دسته", level: "سطح", status: "وضعیت", pass: "درصد قبولی", att: "تعداد دفعات امتحان", mins: "زمان امتحان (دقیقه)", beginner: "مبتدی", intermediate: "متوسط", advanced: "پیشرفته", draft: "پیش‌نویس", published: "منتشرشده", lessons: "درس‌ها", addL: "درس تازه", noL: "هنوز درسی نیست.", yt: "شناسهٔ یوتیوب یا لینک ویدیو", dur: "مدت (دقیقه)", up: "بالا", dn: "پایین", bad: "شناسه یا عنوان درست نیست.", ytBad: "شناسهٔ یوتیوب درست نیست.", idDup: "این شناسه قبلاً هست.", openL: "درس‌ها", count: "درس" },
    en: { add: "New course", none: "No courses yet.", edit: "Edit", pub: "Publish", unpub: "Draft", del: "Delete", sure: "Delete this course and all its lessons? It cannot be undone.", sureL: "Delete this lesson?", save: "Save", cancel: "Close", saved: "Saved.", failed: "Not saved. Try again.", loadErr: "Could not read.", id: "ID (lowercase letters and dashes, cannot change later)", title: "Title", summary: "Summary", fa: "Persian", en: "English", cat: "Category", level: "Level", status: "Status", pass: "Pass percent", att: "Exam attempts", mins: "Exam minutes", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", draft: "Draft", published: "Published", lessons: "Lessons", addL: "New lesson", noL: "No lessons yet.", yt: "YouTube ID or video link", dur: "Length (minutes)", up: "Up", dn: "Down", bad: "ID or title is not valid.", ytBad: "The YouTube ID is not valid.", idDup: "This ID already exists.", openL: "Lessons", count: "lessons" }
  };
  var ID_RE = /^[a-z0-9][a-z0-9-]{1,38}$/;
  function clip(v, n) { return String(v == null ? "" : v).trim().slice(0, n); }
  function ytId(v) {
    v = clip(v, 200); if (!v) return "";
    var m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/); if (m) return m[1];
    return /^[\w-]{11}$/.test(v) ? v : null;
  }
  function num(v, a, b, d) { var n = parseInt(v, 10); return isFinite(n) ? Math.min(b, Math.max(a, n)) : d; }

  window.__adCourses = { mount: function (box, o) {
    var SB = o.SB, lang = o.lang === "fa" ? "fa" : "en", L = T[lang];
    var courses = [], lessons = [], openC = "";
    box.innerHTML = '<p class="fstatus" id="crSt" role="status"></p><p><button type="button" class="btn go" id="crAdd"></button></p><div id="crForm"></div><div id="crB"></div>';
    var st = box.querySelector("#crSt"), body = box.querySelector("#crB"), formBox = box.querySelector("#crForm");
    box.querySelector("#crAdd").textContent = L.add;
    function say(m, k) { st.textContent = m || ""; st.className = "fstatus " + (k || ""); }
    function pick(v) { return v && typeof v === "object" ? (v[lang] || v.fa || v.en || "") : (v || ""); }
    function loadC() { return SB.rest("courses?select=id,title,summary,category,level,status,pass_percent,max_attempts,exam_minutes&order=created_at").then(function (r) { courses = r || []; }).catch(function () { courses = []; say(L.loadErr, "err"); }); }
    function loadL(cid) { return SB.rest("lessons?select=id,position,title,youtube_id,duration_sec&course_id=eq." + encodeURIComponent(cid) + "&order=position").then(function (r) { lessons = r || []; }).catch(function () { lessons = []; say(L.loadErr, "err"); }); }
    function sel(name, opts, cur) { return '<select name="' + name + '">' + opts.map(function (o2) { return '<option value="' + o2[0] + '"' + (o2[0] === cur ? " selected" : "") + '>' + esc(o2[1]) + '</option>'; }).join("") + '</select>'; }
    function draw() {
      body.innerHTML = courses.length ? '<ul class="st-list">' + courses.map(function (c) {
        var open = c.id === openC;
        return '<li data-id="' + esc(c.id) + '"' + (c.status !== "published" ? ' class="st-off"' : "") + '><div class="st-t"><b>' + esc(pick(c.title) || c.id) + '</b><small>' + esc(c.id) + ' - ' + esc(L[c.status] || c.status) + ' - ' + esc(L[c.level] || c.level) + '</small></div><div class="ib-a">' +
          '<button type="button" class="btn" data-a="ls" aria-expanded="' + (open ? "true" : "false") + '">' + esc(L.openL) + '</button>' +
          '<button type="button" class="btn" data-a="ed">' + esc(L.edit) + '</button>' +
          '<button type="button" class="btn" data-a="pb">' + esc(c.status === "published" ? L.unpub : L.pub) + '</button>' +
          '<button type="button" class="btn" data-a="del">' + esc(L.del) + '</button></div>' + (open ? '<div class="cr-l" id="crL"></div>' : "") + '</li>';
      }).join("") + '</ul>' : '<p class="muted">' + esc(L.none) + '</p>';
      if (openC) drawL();
    }
    function drawL() {
      var b = box.querySelector("#crL"); if (!b) return;
      b.innerHTML = '<h3>' + esc(L.lessons) + '</h3><p><button type="button" class="btn go" id="lsAdd">' + esc(L.addL) + '</button></p><div id="lsForm"></div>' +
        (lessons.length ? '<ol class="st-list">' + lessons.map(function (l, i) {
          return '<li data-lid="' + esc(l.id) + '"><div class="st-t"><b>' + esc(pick(l.title) || "-") + '</b><small dir="ltr">' + esc(l.youtube_id || "") + (l.duration_sec ? " - " + Math.round(l.duration_sec / 60) + " min" : "") + '</small></div><div class="ib-a">' +
            '<button type="button" class="btn" data-a="lup"' + (i === 0 ? " disabled" : "") + ' aria-label="' + esc(L.up) + '">&uarr;</button>' +
            '<button type="button" class="btn" data-a="ldn"' + (i === lessons.length - 1 ? " disabled" : "") + ' aria-label="' + esc(L.dn) + '">&darr;</button>' +
            '<button type="button" class="btn" data-a="led">' + esc(L.edit) + '</button><button type="button" class="btn" data-a="ldel">' + esc(L.del) + '</button></div></li>';
        }).join("") + '</ol>' : '<p class="muted">' + esc(L.noL) + '</p>');
    }
    function courseForm(c) {
      var isNew = !c; c = c || { title: {}, summary: {}, category: "", level: "beginner", status: "draft", pass_percent: 70, max_attempts: 3, exam_minutes: 30 };
      var f = function (nm, lab, v, ml, area) { return '<label>' + esc(lab) + ' - ' + esc(L.fa) + (area ? '<textarea name="' + nm + '_fa" rows="2" maxlength="' + ml + '" dir="rtl">' : '<input name="' + nm + '_fa" maxlength="' + ml + '" dir="rtl" value="') + esc(v && v.fa) + (area ? "</textarea>" : '">') + '</label><label>' + esc(lab) + ' - ' + esc(L.en) + (area ? '<textarea name="' + nm + '_en" rows="2" maxlength="' + ml + '" dir="ltr">' : '<input name="' + nm + '_en" maxlength="' + ml + '" dir="ltr" value="') + esc(v && v.en) + (area ? "</textarea>" : '">') + '</label>'; };
      formBox.innerHTML = '<form class="st-f" novalidate>' + (isNew ? '<label>' + esc(L.id) + '<input name="cid" dir="ltr" maxlength="40"></label>' : "") + f("title", L.title, c.title, 120) + f("summary", L.summary, c.summary, 400, true) +
        '<label>' + esc(L.cat) + '<input name="cat" maxlength="40" value="' + esc(c.category) + '"></label><label>' + esc(L.level) + sel("level", [["beginner", L.beginner], ["intermediate", L.intermediate], ["advanced", L.advanced]], c.level) + '</label><label>' + esc(L.status) + sel("status", [["draft", L.draft], ["published", L.published]], c.status) + '</label>' +
        '<label>' + esc(L.pass) + '<input name="pass" type="number" min="1" max="100" value="' + esc(c.pass_percent) + '"></label><label>' + esc(L.att) + '<input name="att" type="number" min="1" max="20" value="' + esc(c.max_attempts) + '"></label><label>' + esc(L.mins) + '<input name="mins" type="number" min="1" max="300" value="' + esc(c.exam_minutes) + '"></label>' +
        '<p><button type="submit" class="btn go">' + esc(L.save) + '</button> <button type="button" class="btn" id="crX">' + esc(L.cancel) + '</button></p></form>';
      var frm = formBox.querySelector("form"); formBox.querySelector("#crX").onclick = function () { formBox.innerHTML = ""; };
      frm.onsubmit = function (e) {
        e.preventDefault(); var g = function (n) { return clip(frm.elements[n].value, 400); };
        var id = isNew ? g("cid") : c.id;
        if (!ID_RE.test(id) || (!g("title_fa") && !g("title_en"))) return say(L.bad, "err");
        if (isNew && courses.some(function (x) { return x.id === id; })) return say(L.idDup, "err");
        var row = { title: { fa: g("title_fa"), en: g("title_en") }, summary: { fa: g("summary_fa"), en: g("summary_en") }, category: clip(frm.elements.cat.value, 40), level: frm.elements.level.value, status: frm.elements.status.value, pass_percent: num(frm.elements.pass.value, 1, 100, 70), max_attempts: num(frm.elements.att.value, 1, 20, 3), exam_minutes: num(frm.elements.mins.value, 1, 300, 30) };
        var p = isNew ? SB.send("POST", "courses", Object.assign({ id: id }, row), "return=minimal") : SB.send("PATCH", "courses?id=eq." + encodeURIComponent(id), row, "return=minimal");
        p.then(loadC).then(function () { formBox.innerHTML = ""; draw(); say(L.saved, "ok"); }).catch(function () { say(L.failed, "err"); });
      };
    }
    function lessonForm(l) {
      var isNew = !l, f = document.getElementById("lsForm"); l = l || { title: {}, youtube_id: "", duration_sec: 0 };
      f.innerHTML = '<form class="st-f" novalidate><label>' + esc(L.title) + ' - ' + esc(L.fa) + '<input name="tfa" maxlength="120" dir="rtl" value="' + esc(l.title && l.title.fa) + '"></label><label>' + esc(L.title) + ' - ' + esc(L.en) + '<input name="ten" maxlength="120" dir="ltr" value="' + esc(l.title && l.title.en) + '"></label>' +
        '<label>' + esc(L.yt) + '<input name="yt" dir="ltr" maxlength="200" value="' + esc(l.youtube_id) + '"></label><label>' + esc(L.dur) + '<input name="dur" type="number" min="0" max="600" value="' + esc(Math.round((l.duration_sec || 0) / 60)) + '"></label>' +
        '<p><button type="submit" class="btn go">' + esc(L.save) + '</button> <button type="button" class="btn" id="lsX">' + esc(L.cancel) + '</button></p></form>';
      var frm = f.querySelector("form"); f.querySelector("#lsX").onclick = function () { f.innerHTML = ""; };
      frm.onsubmit = function (e) {
        e.preventDefault(); var tfa = clip(frm.elements.tfa.value, 120), ten = clip(frm.elements.ten.value, 120), y = ytId(frm.elements.yt.value);
        if (!tfa && !ten) return say(L.bad, "err"); if (y === null) return say(L.ytBad, "err");
        var row = { title: { fa: tfa, en: ten }, youtube_id: y, duration_sec: num(frm.elements.dur.value, 0, 600, 0) * 60 };
        var p = isNew ? SB.send("POST", "lessons", Object.assign({ course_id: openC, position: lessons.length ? Math.max.apply(null, lessons.map(function (x) { return x.position; })) + 1 : 1 }, row), "return=minimal") : SB.send("PATCH", "lessons?id=eq." + encodeURIComponent(l.id), row, "return=minimal");
        p.then(function () { return loadL(openC); }).then(function () { drawL(); say(L.saved, "ok"); }).catch(function () { say(L.failed, "err"); });
      };
    }
    function reorderL(list) {
      /* unique (course_id, position): first move everything out of the way, then write the final order */
      return list.reduce(function (p, l, i) { return p.then(function () { return SB.send("PATCH", "lessons?id=eq." + encodeURIComponent(l.id), { position: 1000 + i }, "return=minimal"); }); }, Promise.resolve())
        .then(function () { return list.reduce(function (p, l, i) { return p.then(function () { return SB.send("PATCH", "lessons?id=eq." + encodeURIComponent(l.id), { position: i + 1 }, "return=minimal"); }); }, Promise.resolve()); });
    }
    box.querySelector("#crAdd").onclick = function () { courseForm(null); };
    box.addEventListener("click", function (e) {
      var t = e.target; if (!t.closest) return; var a = t.getAttribute("data-a");
      if (t.id === "lsAdd") { lessonForm(null); return; }
      if (!a) return;
      var lil = t.closest("li[data-lid]");
      if (lil) {
        var lid = lil.getAttribute("data-lid"), i = lessons.findIndex(function (x) { return x.id === lid; });
        if (a === "led") lessonForm(lessons[i]);
        else if (a === "ldel") { if (window.confirm(L.sureL)) SB.send("DELETE", "lessons?id=eq." + encodeURIComponent(lid), null, "return=minimal").then(function () { return loadL(openC); }).then(drawL).catch(function () { say(L.failed, "err"); }); }
        else if (a === "lup" || a === "ldn") { var j = a === "lup" ? i - 1 : i + 1; if (j < 0 || j >= lessons.length) return; var arr = lessons.slice(), tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; reorderL(arr).then(function () { return loadL(openC); }).then(drawL).catch(function () { say(L.failed, "err"); }); }
        return;
      }
      var li = t.closest("li[data-id]"); if (!li) return; var id = li.getAttribute("data-id"), c = courses.find(function (x) { return x.id === id; });
      if (a === "ed") courseForm(c);
      else if (a === "pb") SB.send("PATCH", "courses?id=eq." + encodeURIComponent(id), { status: c.status === "published" ? "draft" : "published" }, "return=minimal").then(loadC).then(draw).catch(function () { say(L.failed, "err"); });
      else if (a === "del") { if (window.confirm(L.sure)) SB.send("DELETE", "courses?id=eq." + encodeURIComponent(id), null, "return=minimal").then(function () { if (openC === id) openC = ""; return loadC(); }).then(draw).catch(function () { say(L.failed, "err"); }); }
      else if (a === "ls") { if (openC === id) { openC = ""; draw(); } else { openC = id; loadL(id).then(draw); } }
    });
    loadC().then(draw);
  } };
})();
