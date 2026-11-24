/* Admin: build and edit your own pages (saved as design.pages in site_settings; super_admin can write by RLS).
   Public address of a page: page.html#its-slug . Block types: heading, text, image, button, cards, YouTube link, divider. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "صفحهٔ دلخواه بساز، بدون کدنویسی. بعد از ذخیره، لینک صفحه را در «ویرایشگر منوی بالا» یا «لینک‌های فوتر» بگذار.", add: "صفحهٔ تازه", slug: "نشانی (انگلیسی، مثل my-page)", tfa: "عنوان فارسی", ten: "عنوان انگلیسی", create: "ساخت", none: "هنوز صفحه‌ای نساخته‌ای.", edit: "ویرایش", del: "حذف", open: "دیدن", hide: "مخفی", show: "نمایش", sure: "این صفحه حذف شود؟ برگشت ندارد.", save: "ذخیره", back: "برگشت", saved: "ذخیره شد ✓", failed: "ذخیره نشد. مطمئن شو سوپرادمین هستی و cms-6.sql را اجرا کرده‌ای.", badSlug: "نشانی فقط حروف کوچک انگلیسی، عدد و خط تیره (۲ تا ۴۰ حرف).", dup: "این نشانی قبلاً هست.", addb: "افزودن بخش", up: "بالا", dn: "پایین", rm: "حذف بخش",
      h: "عنوان", t: "متن", img: "عکس", btn: "دکمه", cards: "کارت‌ها", vid: "ویدیوی یوتیوب", hr: "خط جداکننده", fa: "فارسی", en: "English", url: "لینک (https://… یا page.html#…)", imgu: "آدرس عکس (assets/… یا آدرس آپلودشده در Supabase)", yt: "شناسهٔ ۱۱ حرفی یوتیوب", ct: "عنوان کارت", cd: "توضیح کوتاه", cu: "لینک کارت (اختیاری)", addc: "کارت تازه", link: "لینک صفحه", copy: "کپی لینک" },
    en: { p: "Create your own pages with no code. After saving, put the page link in the top-menu editor or footer links.", add: "New page", slug: "Address (letters, like my-page)", tfa: "Persian title", ten: "English title", create: "Create", none: "No pages yet.", edit: "Edit", del: "Delete", open: "View", hide: "Hide", show: "Show", sure: "Delete this page? It cannot be undone.", save: "Save", back: "Back", saved: "Saved ✓", failed: "Not saved. Make sure you are super admin and ran cms-6.sql.", badSlug: "Address: lowercase letters, numbers and dashes only (2 to 40).", dup: "This address already exists.", addb: "Add section", up: "Up", dn: "Down", rm: "Remove",
      h: "Heading", t: "Text", img: "Image", btn: "Button", cards: "Cards", vid: "YouTube video", hr: "Divider", fa: "Persian", en: "English", url: "Link (https://… or page.html#…)", imgu: "Image path (assets/… or an uploaded Supabase URL)", yt: "11-character YouTube ID", ct: "Card title", cd: "Short text", cu: "Card link (optional)", addc: "Add card", link: "Page link", copy: "Copy link" }
  };
  window.__adPages = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], pages = [], edit = -1, msg = "";
    function save(done) {
      SB.send("POST", "site_settings?on_conflict=key", { key: "design.pages", value: pages }, "resolution=merge-duplicates,return=minimal").then(function () {
        try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.pages = pages; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
        msg = L.saved; if (done) done(true); else draw();
      }).catch(function () { msg = L.failed; if (done) done(false); else draw(); });
    }
    function field(label, id, val, extra) { return '<label class="adc">' + esc(label) + '<input id="' + id + '" value="' + esc(val || "") + '" maxlength="' + (extra || 300) + '"></label>'; }
    function area(label, id, val) { return '<label class="adc">' + esc(label) + '<textarea id="' + id + '" rows="4" maxlength="4000">' + esc(val || "") + "</textarea></label>"; }
    function listView() {
      var h = '<p class="muted">' + esc(L.p) + '</p>' + (msg ? '<p class="fstatus" role="status">' + esc(msg) + "</p>" : "") +
        '<form id="pgNew" class="stu-t"><label class="adc">' + esc(L.slug) + '<input name="s" dir="ltr" maxlength="40" required></label><label class="adc">' + esc(L.tfa) + '<input name="fa" maxlength="120" required></label><label class="adc">' + esc(L.ten) + '<input name="en" dir="ltr" maxlength="120"></label><button class="btn go" type="submit">' + esc(L.create) + "</button></form>";
      h += pages.length ? '<ul class="stu-l">' + pages.map(function (p, i) { return '<li><b>' + esc((p.t && (p.t.fa || p.t.en)) || p.slug) + '</b> <small dir="ltr">page.html#' + esc(p.slug) + "</small> " + (p.hide ? '<span class="pill">' + esc(L.hide) + "</span> " : "") + '<a class="btn" href="page.html#' + esc(p.slug) + '" target="_blank" rel="noopener">' + esc(L.open) + '</a> <button type="button" class="btn" data-e="' + i + '">' + esc(L.edit) + '</button> <button type="button" class="btn" data-h="' + i + '">' + esc(p.hide ? L.show : L.hide) + '</button> <button type="button" class="btn" data-d="' + i + '">' + esc(L.del) + "</button></li>"; }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>";
      box.innerHTML = h;
    }
    function blockView(b, i) {
      var k = b.k, h = '<div class="pgb" data-i="' + i + '"><div class="pgb-h"><b>' + esc(L[k === "p" ? "t" : k] || k) + '</b> <button type="button" class="btn" data-m="up" data-i="' + i + '">' + esc(L.up) + '</button> <button type="button" class="btn" data-m="dn" data-i="' + i + '">' + esc(L.dn) + '</button> <button type="button" class="btn" data-m="rm" data-i="' + i + '">' + esc(L.rm) + "</button></div>";
      if (k === "h") h += field(L.fa, "b" + i + "fa", b.x && b.x.fa, 200) + field(L.en, "b" + i + "en", b.x && b.x.en, 200);
      else if (k === "p") h += area(L.fa, "b" + i + "fa", b.x && b.x.fa) + area(L.en, "b" + i + "en", b.x && b.x.en);
      else if (k === "img") h += field(L.imgu, "b" + i + "u", b.u, 400) + field(L.fa, "b" + i + "fa", b.x && b.x.fa, 200) + field(L.en, "b" + i + "en", b.x && b.x.en, 200);
      else if (k === "btn") h += field(L.fa, "b" + i + "fa", b.x && b.x.fa, 80) + field(L.en, "b" + i + "en", b.x && b.x.en, 80) + field(L.url, "b" + i + "u", b.u, 400);
      else if (k === "vid") h += field(L.yt, "b" + i + "u", b.u, 11) + field(L.fa, "b" + i + "fa", b.x && b.x.fa, 80) + field(L.en, "b" + i + "en", b.x && b.x.en, 80);
      else if (k === "cards") { h += '<div class="pgc">' + (b.c || []).map(function (c, j) { return '<fieldset><legend>' + (j + 1) + "</legend>" + field(L.ct + " (" + L.fa + ")", "b" + i + "c" + j + "tfa", c.t && c.t.fa, 100) + field(L.ct + " (" + L.en + ")", "b" + i + "c" + j + "ten", c.t && c.t.en, 100) + field(L.cd + " (" + L.fa + ")", "b" + i + "c" + j + "dfa", c.d && c.d.fa, 200) + field(L.cd + " (" + L.en + ")", "b" + i + "c" + j + "den", c.d && c.d.en, 200) + field(L.cu, "b" + i + "c" + j + "u", c.u, 400) + '<button type="button" class="btn" data-m="rc" data-i="' + i + '" data-j="' + j + '">' + esc(L.rm) + "</button></fieldset>"; }).join("") + '</div><button type="button" class="btn" data-m="ac" data-i="' + i + '">' + esc(L.addc) + "</button>"; }
      return h + "</div>";
    }
    function editView() {
      var p = pages[edit];
      var h = '<p><button type="button" class="btn" id="pgBack">← ' + esc(L.back) + '</button> <b dir="ltr">page.html#' + esc(p.slug) + "</b></p>" + (msg ? '<p class="fstatus" role="status">' + esc(msg) + "</p>" : "") +
        field(L.tfa, "ptfa", p.t && p.t.fa, 120) + field(L.ten, "pten", p.t && p.t.en, 120) + (p.b || []).map(blockView).join("") +
        '<p class="pgadd">' + esc(L.addb) + ": " + ["h", "p", "img", "btn", "cards", "vid", "hr"].map(function (k) { return '<button type="button" class="btn" data-a="' + k + '">' + esc(L[k === "p" ? "t" : k]) + "</button>"; }).join(" ") + '</p><p><button type="button" class="btn go" id="pgSave">' + esc(L.save) + "</button></p>";
      box.innerHTML = h;
    }
    function draw() { if (edit < 0) listView(); else editView(); }
    function val(id) { var e = box.querySelector("#" + id); return e ? e.value.trim() : ""; }
    function collect() {
      var p = pages[edit]; p.t = { fa: val("ptfa"), en: val("pten") };
      p.b = (p.b || []).map(function (b, i) {
        var o2 = { k: b.k };
        if (b.k === "h" || b.k === "p") o2.x = { fa: val("b" + i + "fa"), en: val("b" + i + "en") };
        if (b.k === "img" || b.k === "btn" || b.k === "vid") { o2.u = val("b" + i + "u"); o2.x = { fa: val("b" + i + "fa"), en: val("b" + i + "en") }; }
        if (b.k === "cards") o2.c = (b.c || []).map(function (c, j) { return { t: { fa: val("b" + i + "c" + j + "tfa"), en: val("b" + i + "c" + j + "ten") }, d: { fa: val("b" + i + "c" + j + "dfa"), en: val("b" + i + "c" + j + "den") }, u: val("b" + i + "c" + j + "u") }; });
        return o2;
      });
    }
    box.addEventListener("submit", function (e) {
      if (e.target.id !== "pgNew") return; e.preventDefault(); var f = e.target.elements, s = f.s.value.trim().toLowerCase();
      if (!/^[a-z0-9][a-z0-9-]{1,39}$/.test(s)) { msg = L.badSlug; draw(); return; }
      if (pages.some(function (p) { return p.slug === s; })) { msg = L.dup; draw(); return; }
      pages.push({ slug: s, t: { fa: f.fa.value.trim(), en: f.en.value.trim() }, b: [{ k: "h", x: { fa: "", en: "" } }, { k: "p", x: { fa: "", en: "" } }] }); edit = pages.length - 1; msg = ""; save(function () { draw(); });
    });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (edit < 0) {
        if (b.dataset.e) { edit = +b.dataset.e; msg = ""; draw(); }
        else if (b.dataset.h) { var p = pages[+b.dataset.h]; p.hide = !p.hide; save(); }
        else if (b.dataset.d) { if (confirm(L.sure)) { pages.splice(+b.dataset.d, 1); save(); } }
        return;
      }
      if (b.id === "pgBack") { edit = -1; msg = ""; draw(); return; }
      if (b.id === "pgSave") { collect(); save(); return; }
      collect(); var p2 = pages[edit], i = +b.dataset.i;
      if (b.dataset.a) { var k = b.dataset.a; p2.b.push(k === "cards" ? { k: k, c: [{ t: { fa: "", en: "" }, d: { fa: "", en: "" }, u: "" }] } : { k: k, x: { fa: "", en: "" }, u: "" }); }
      else if (b.dataset.m === "rm") p2.b.splice(i, 1);
      else if (b.dataset.m === "up" && i > 0) { var t = p2.b[i]; p2.b[i] = p2.b[i - 1]; p2.b[i - 1] = t; }
      else if (b.dataset.m === "dn" && i < p2.b.length - 1) { var t2 = p2.b[i]; p2.b[i] = p2.b[i + 1]; p2.b[i + 1] = t2; }
      else if (b.dataset.m === "ac") { if (p2.b[i].c.length < 12) p2.b[i].c.push({ t: { fa: "", en: "" }, d: { fa: "", en: "" }, u: "" }); }
      else if (b.dataset.m === "rc") p2.b[i].c.splice(+b.dataset.j, 1);
      draw();
    });
    SB.rest("site_settings?select=value&key=eq.design.pages").then(function (r) { var v = r && r[0] && r[0].value; pages = Array.isArray(v) ? v : []; draw(); }).catch(function () { pages = []; draw(); });
  } };
})();
