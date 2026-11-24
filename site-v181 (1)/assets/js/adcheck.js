/* Admin: pre-launch check. Reads what exists in Supabase and tells the owner what is ready and what is still missing.
   The only write is one harmless key (design._ping) to test that saving works. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "این بررسی نشان می‌دهد چه چیزهایی برای انتشار آماده است. دکمه را بزن.", run: "اجرای بررسی", busy: "در حال بررسی…", ok: "آماده", no: "لازم است", warn: "توجه",
      sum: "آماده", of: "از", https: "سایت با HTTPS باز شده", httpsH: "از آدرس https روی هاست واقعی باز کن.", local: "سایت روی هاست واقعی است (نه localhost)", localH: "سایت را روی Cloudflare آپلود کن.",
      role: "حساب شما مدیر ارشد (super_admin) است", roleH: "در Supabase: update public.profiles set role='super_admin' where email='…'",
      content: "جدول متن‌ها (site_content) خوانا است", contentH: "فایل cms-2.sql را در SQL Editor اجرا کن.",
      projT: "جدول پروژه‌ها (site_projects)", galT: "جدول گالری (site_gallery)", resT: "جدول رزومه (site_resume)", tblH: "فایل SQL مربوطه (cms-3/4/5.sql) را اجرا کن.",
      imp: "داده دارد", impH: "در ادمین دکمهٔ «Import» همان بخش را بزن.",
      pub: "دست‌کم یک دوره منتشرشده هست", pubH: "در ادمین ← دوره‌ها یک دوره بساز و منتشر کن.",
      les: "دوره‌های منتشرشده درس دارند", lesH: "برای هر دوره درس (ویدیوی یوتیوب) اضافه کن.",
      sav: "ذخیرهٔ تنظیمات ظاهر کار می‌کند (cms-6)", savH: "فایل cms-6.sql را اجرا کن و با حساب super_admin وارد شو.",
      nws: "جدول خبرنامه آماده است (cms-7)", nwsH: "فایل cms-7.sql را اجرا کن و با حساب super_admin وارد شو.", mail: "ایمیل تماس تنظیم شده", mailH: "در ویرایش متن‌ها فیلد contactEmail را پر کن.",
      supa: "اتصال Supabase برقرار است", supaH: "آدرس و کلید Supabase در data/content.js را بررسی کن." },
    en: { p: "This check shows what is ready for launch. Press the button.", run: "Run check", busy: "Checking…", ok: "Ready", no: "Needed", warn: "Note",
      sum: "ready", of: "of", https: "Site is opened over HTTPS", httpsH: "Open it from the real https address.", local: "Site is on a real host (not localhost)", localH: "Upload the site to Cloudflare.",
      role: "Your account is super_admin", roleH: "In Supabase: update public.profiles set role='super_admin' where email='…'",
      content: "Texts table (site_content) is readable", contentH: "Run cms-2.sql in the SQL Editor.",
      projT: "Projects table (site_projects)", galT: "Gallery table (site_gallery)", resT: "Résumé table (site_resume)", tblH: "Run the matching SQL file (cms-3/4/5.sql).",
      imp: "has data", impH: "Press “Import” in that admin section.",
      pub: "At least one course is published", pubH: "Admin → Courses: create a course and publish it.",
      les: "Published courses have lessons", lesH: "Add lessons (YouTube videos) to each course.",
      sav: "Saving look settings works (cms-6)", savH: "Run cms-6.sql and sign in as super_admin.",
      nws: "Newsletter table is ready (cms-7)", nwsH: "Run cms-7.sql and sign in as super_admin.", mail: "Contact email is set", mailH: "Fill contactEmail in the text editor.",
      supa: "Supabase connection works", supaH: "Check the Supabase URL and key in data/content.js." }
  };
  window.__adCheck = { mount: function (box, o) {
    var SB = o.SB, S = o.S || window.SITE || {}, L = T[o.lang === "fa" ? "fa" : "en"];
    box.innerHTML = '<p class="muted">' + esc(L.p) + '</p><p><button type="button" class="btn go" id="ckRun">' + esc(L.run) + '</button></p><div id="ckOut" role="status" aria-live="polite"></div>';
    var out = box.querySelector("#ckOut");
    function q(path) { return SB.rest(path).then(function (r) { return { ok: true, rows: r }; }, function () { return { ok: false, rows: [] }; }); }
    box.querySelector("#ckRun").onclick = function () {
      out.innerHTML = '<p class="muted">' + esc(L.busy) + '</p>';
      Promise.all([
        q("profiles?select=role&id=eq." + ((SB.get() || {}).id || "x")), q("site_content?select=key&limit=1"), q("site_projects?select=id&limit=1"), q("site_gallery?select=id&limit=1"), q("site_resume?select=id&limit=1"),
        q("courses?select=id&status=eq.published&limit=50"), q("lessons?select=course_id&limit=500"), q("newsletter_subscribers?select=id&limit=1"),
        SB.send("POST", "site_settings?on_conflict=key", { key: "design._ping", value: new Date().toISOString() }, "resolution=merge-duplicates,return=minimal").then(function () { return true; }, function () { return false; })
      ]).then(function (r) {
        var courses = r[5].rows.map(function (c) { return c.id; }), withL = {}; r[6].rows.forEach(function (l) { withL[l.course_id] = 1; });
        var items = [
          [!!(S.supabaseUrl && r[0].ok), L.supa, L.supaH],
          [location.protocol === "https:", L.https, L.httpsH],
          [!/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname), L.local, L.localH],
          [r[0].ok && r[0].rows[0] && r[0].rows[0].role === "super_admin", L.role, L.roleH],
          [r[1].ok, L.content, L.contentH],
          [r[2].ok && r[2].rows.length > 0, L.projT + " · " + L.imp, r[2].ok ? L.impH : L.tblH],
          [r[3].ok && r[3].rows.length > 0, L.galT + " · " + L.imp, r[3].ok ? L.impH : L.tblH],
          [r[4].ok && r[4].rows.length > 0, L.resT + " · " + L.imp, r[4].ok ? L.impH : L.tblH],
          [courses.length > 0, L.pub, L.pubH],
          [courses.length > 0 && courses.every(function (c) { return withL[c]; }), L.les, L.lesH],
          [r[8] === true, L.sav, L.savH],
          [r[7].ok, L.nws, L.nwsH],
          [!!S.contactEmail, L.mail, L.mailH]
        ];
        var good = items.filter(function (i) { return i[0]; }).length;
        out.innerHTML = '<p class="ck-sum"><b>' + good + '</b> ' + esc(L.of) + ' ' + items.length + ' ' + esc(L.sum) + '</p><ul class="ck-l">' + items.map(function (i) { return '<li class="' + (i[0] ? "ok" : "no") + '"><span class="ck-i" aria-hidden="true">' + (i[0] ? "✓" : "✗") + '</span><span><b>' + esc(i[1]) + '</b> <em>' + esc(i[0] ? L.ok : L.no) + '</em>' + (i[0] ? "" : '<br><small>' + esc(i[2]) + '</small>') + '</span></li>'; }).join("") + '</ul>';
      });
    };
  } };
})();
