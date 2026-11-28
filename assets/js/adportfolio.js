/* Admin: Portfolio content (design.portfolio = {cases:[], posts:[], articles:[]}). Cases can be "done" or "wip" (in progress).
   Read by portfolio.js. Edit, hide, reorder and delete without touching data/portfolio.js. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { intro: "پروژه‌ها (تمام‌شده و در حال انجام)، پست‌های شبکه‌های اجتماعی و مقاله‌ها. صفحهٔ نمایش: portfolio.html", open: "باز کردن صفحه",
      cases: "پروژه‌ها", posts: "پست‌ها", articles: "مقاله‌ها", add: "افزودن", save: "ذخیره تغییر", cancel: "لغو", edit: "ویرایش", del: "حذف", up: "بالا", dn: "پایین", hide: "مخفی", show: "نمایش",
      ok: "ذخیره شد.", bad: "ذخیره نشد. با حساب مدیر کل وارد شو و cms-6.sql را اجرا کن.", badUrl: "نشانی باید با https:// شروع شود.", badImg: "تصویر باید از پوشهٔ assets/ یا https:// باشد.", needT: "عنوان لازم است.", askDel: "این مورد برای همیشه حذف شود؟",
      tfa: "عنوان فارسی", ten: "عنوان انگلیسی", ofa: "توضیح فارسی", oen: "توضیح انگلیسی", role: "نقش من", year: "سال", tools: "ابزارها (با کاما)", cover: "تصویر (assets/... یا https://...)", url: "لینک (https://...)", status: "وضعیت", done: "تمام‌شده", wip: "در حال انجام",
      plat: "شبکه", cfa: "متن فارسی", cen: "متن انگلیسی", date: "تاریخ (YYYY-MM-DD)", surl: "لینک پست (https://...)", aurl: "لینک مقاله (https:// یا blog.html)", none: "هنوز چیزی اضافه نشده." },
    en: { intro: "Projects (done and in progress), social posts and articles. Public page: portfolio.html", open: "Open page",
      cases: "Projects", posts: "Posts", articles: "Articles", add: "Add", save: "Save change", cancel: "Cancel", edit: "Edit", del: "Delete", up: "Up", dn: "Down", hide: "Hide", show: "Show",
      ok: "Saved.", bad: "Not saved. Sign in as super admin and run cms-6.sql.", badUrl: "The link must start with https://.", badImg: "The image must be under assets/ or start with https://.", needT: "A title is required.", askDel: "Delete this item permanently?",
      tfa: "Persian title", ten: "English title", ofa: "Persian description", oen: "English description", role: "My role", year: "Year", tools: "Tools (comma separated)", cover: "Image (assets/... or https://...)", url: "Link (https://...)", status: "Status", done: "Done", wip: "In progress",
      plat: "Network", cfa: "Persian text", cen: "English text", date: "Date (YYYY-MM-DD)", surl: "Post link (https://...)", aurl: "Article link (https:// or blog.html)", none: "Nothing added yet." }
  };
  var PLAT = ["youtube", "instagram", "facebook", "tiktok", "linkedin", "x", "threads", "behance", "github", "other"];
  var okUrl = function (u) { return /^https:\/\/[^\s"'<>]+$/i.test(u); };
  var okImg = function (u) { return /^assets\/[\w\-./]+$/.test(u) || okUrl(u); };
  var okPage = function (u) { return okUrl(u) || /^[\w\-]+\.html(#[\w\-]*)?$/.test(u); };
  var tt = function (o) { return (o && (o.fa || o.en)) || ""; };

  window.__adPortfolio = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], data = { cases: [], posts: [], articles: [] }, tab = "cases", ed = -1, msg = "", err = "";

    function save(next) {
      SB.send("POST", "site_settings?on_conflict=key", { key: "design.portfolio", value: data }, "resolution=merge-duplicates,return=minimal").then(function () {
        try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.portfolio = data; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
        msg = L.ok; err = ""; ed = -1; draw(); if (next) next();
      }).catch(function () { msg = ""; err = L.bad; draw(); });
    }
    var lbl = function (t, name, v, ex) { return '<label class="adc">' + esc(t) + '<input name="' + name + '" value="' + esc(v) + '" maxlength="' + (ex && ex.max || 160) + '"' + (ex && ex.dir ? ' dir="ltr"' : "") + (ex && ex.req ? " required" : "") + (ex && ex.type ? ' type="' + ex.type + '"' : "") + "></label>"; };
    var area = function (t, name, v) { return '<label class="adc">' + esc(t) + '<textarea name="' + name + '" rows="3" maxlength="600">' + esc(v) + "</textarea></label>"; };

    function form() {
      var x = ed >= 0 ? data[tab][ed] : {}, h = "";
      if (tab === "cases") {
        h = lbl(L.tfa, "tfa", x.title && x.title.fa, { req: 1 }) + lbl(L.ten, "ten", x.title && x.title.en) + area(L.ofa, "ofa", x.overview && x.overview.fa) + area(L.oen, "oen", x.overview && x.overview.en) +
          lbl(L.role, "role", x.role, { max: 80 }) + lbl(L.year, "year", x.year, { max: 9 }) + lbl(L.tools, "tools", (x.tools || []).join(", "), { max: 200 }) + lbl(L.cover, "cover", x.cover, { dir: 1, max: 300 }) + lbl(L.url, "url", x.url, { dir: 1, max: 300 }) +
          '<label class="adc">' + esc(L.status) + '<select name="status"><option value="done"' + (x.status !== "wip" ? " selected" : "") + ">" + esc(L.done) + '</option><option value="wip"' + (x.status === "wip" ? " selected" : "") + ">" + esc(L.wip) + "</option></select></label>";
      } else if (tab === "posts") {
        h = '<label class="adc">' + esc(L.plat) + '<select name="platform">' + PLAT.map(function (p) { return '<option value="' + p + '"' + (x.platform === p ? " selected" : "") + ">" + p + "</option>"; }).join("") + "</select></label>" +
          lbl(L.surl, "url", x.url, { dir: 1, max: 300, req: 1 }) + area(L.cfa, "cfa", x.caption && x.caption.fa) + area(L.cen, "cen", x.caption && x.caption.en) + lbl(L.cover, "thumb", x.thumb, { dir: 1, max: 300 }) + lbl(L.date, "date", x.date, { dir: 1, max: 10 });
      } else {
        h = lbl(L.tfa, "tfa", x.title && x.title.fa, { req: 1 }) + lbl(L.ten, "ten", x.title && x.title.en) + area(L.ofa, "ofa", x.summary && x.summary.fa) + area(L.oen, "oen", x.summary && x.summary.en) + lbl(L.aurl, "url", x.url, { dir: 1, max: 300 }) + lbl(L.cover, "cover", x.cover, { dir: 1, max: 300 }) + lbl(L.date, "date", x.date, { dir: 1, max: 10 });
      }
      return '<form id="pfF" class="stu-t">' + h + '<button class="btn go" type="submit">' + esc(ed >= 0 ? L.save : L.add) + "</button>" + (ed >= 0 ? ' <button class="btn" type="button" data-m="cancel">' + esc(L.cancel) + "</button>" : "") + "</form>";
    }

    function draw() {
      var list = data[tab];
      box.innerHTML = '<p class="muted">' + esc(L.intro) + ' <a href="portfolio.html" target="_blank" rel="noopener">' + esc(L.open) + "</a></p>" +
        '<div class="atabs" role="tablist">' + ["cases", "posts", "articles"].map(function (k) { return '<button type="button" role="tab" aria-selected="' + (k === tab) + '" data-m="tab" data-k="' + k + '">' + esc(L[k]) + " (" + data[k].length + ")</button>"; }).join("") + "</div>" +
        (msg ? '<p class="fstatus ok" role="status">' + esc(msg) + "</p>" : "") + (err ? '<p class="fstatus err" role="alert">' + esc(err) + "</p>" : "") +
        (list.length ? '<ul class="stu-l">' + list.map(function (x, i) {
          var name = tab === "posts" ? (x.platform + " · " + (x.url || "")) : tt(x.title);
          return "<li><b>" + esc(name) + "</b> " + (x.status === "wip" ? '<span class="pill">' + esc(L.wip) + "</span> " : "") + (x.hide ? '<span class="pill">' + esc(L.hide) + "</span> " : "") +
            '<button type="button" class="btn" data-m="ed" data-i="' + i + '">' + esc(L.edit) + '</button> <button type="button" class="btn" data-m="h" data-i="' + i + '">' + esc(x.hide ? L.show : L.hide) + '</button> <button type="button" class="btn" data-m="up" data-i="' + i + '" aria-label="' + esc(L.up) + '">↑</button> <button type="button" class="btn" data-m="dn" data-i="' + i + '" aria-label="' + esc(L.dn) + '">↓</button> <button type="button" class="btn" data-m="d" data-i="' + i + '">' + esc(L.del) + "</button></li>";
        }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>") + form();
    }

    box.addEventListener("submit", function (e) {
      if (e.target.id !== "pfF") return; e.preventDefault(); var f = e.target.elements, v = function (n) { return f[n] ? f[n].value.trim() : ""; }, x, base = ed >= 0 ? data[tab][ed] : { id: tab[0] + Date.now().toString(36) };
      err = ""; msg = "";
      if (tab === "posts") {
        if (!okUrl(v("url"))) { err = L.badUrl; return draw(); }
        if (v("thumb") && !okImg(v("thumb"))) { err = L.badImg; return draw(); }
        x = { id: base.id, hide: base.hide, platform: v("platform"), url: v("url"), caption: { fa: v("cfa"), en: v("cen") }, thumb: v("thumb"), date: v("date") };
      } else {
        if (!v("tfa") && !v("ten")) { err = L.needT; return draw(); }
        if (v("cover") && !okImg(v("cover"))) { err = L.badImg; return draw(); }
        if (v("url") && !(tab === "articles" ? okPage(v("url")) : okUrl(v("url")))) { err = L.badUrl; return draw(); }
        if (tab === "cases") x = { id: base.id, hide: base.hide, title: { fa: v("tfa"), en: v("ten") }, overview: { fa: v("ofa"), en: v("oen") }, role: v("role"), year: v("year"), tools: v("tools").split(",").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 20), cover: v("cover"), url: v("url"), status: v("status") === "wip" ? "wip" : "done" };
        else x = { id: base.id, hide: base.hide, title: { fa: v("tfa"), en: v("ten") }, summary: { fa: v("ofa"), en: v("oen") }, url: v("url"), cover: v("cover"), date: v("date") };
      }
      if (ed >= 0) data[tab][ed] = x; else { if (data[tab].length >= 100) return; data[tab].push(x); }
      save();
    });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-m]"); if (!b) return; var m = b.dataset.m, i = +b.dataset.i, l = data[tab], t;
      if (m === "tab") { tab = b.dataset.k; ed = -1; msg = ""; err = ""; return draw(); }
      if (m === "cancel") { ed = -1; return draw(); }
      if (m === "ed") { ed = i; msg = ""; err = ""; draw(); var f = box.querySelector("#pfF"); if (f) f.scrollIntoView({ block: "nearest" }); return; }
      if (m === "d") { if (!window.confirm(L.askDel)) return; l.splice(i, 1); } else if (m === "h") l[i].hide = !l[i].hide;
      else if (m === "up" && i > 0) { t = l[i]; l[i] = l[i - 1]; l[i - 1] = t; } else if (m === "dn" && i < l.length - 1) { t = l[i]; l[i] = l[i + 1]; l[i + 1] = t; } else return;
      save();
    });
    SB.rest("site_settings?select=value&key=eq.design.portfolio").then(function (r) {
      var v = r && r[0] && r[0].value; if (v && typeof v === "object") ["cases", "posts", "articles"].forEach(function (k) { if (Array.isArray(v[k])) data[k] = v[k]; }); draw();
    }).catch(function () { draw(); });
  } };
})();
