/* Admin: Projects studio + Gallery manager. Tables site_projects / site_gallery (cms-3.sql, cms-4.sql), images in the public "media" bucket.
   Staff only (RLS enforces it). The public site reads these tables and falls back to data/content.js when they are empty. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { tp: "پروژه‌ها", tg: "گالری", imp: "وارد کردن از فایل سایت", impH: "فقط موارد تازه را اضافه می‌کند و چیزی را عوض نمی‌کند.", add: "پروژهٔ تازه", none: "هنوز چیزی نیست.", edit: "ویرایش", hide: "پنهان", show: "نمایش", del: "حذف", up: "بالا", dn: "پایین", sure: "حذف شود؟ این کار برگشت ندارد.", save: "ذخیره", cancel: "بستن", saved: "ذخیره شد.", failed: "ذخیره نشد. نقش مدیر و اجرای cms-3 / cms-4 را بررسی کن.", loadErr: "بارگذاری نشد. آیا cms-3.sql و cms-4.sql اجرا شده است؟", id: "شناسه (انگلیسی، بدون فاصله)", idBad: "شناسه فقط a-z و 0-9 و - و _ (حداکثر ۴۰).", tfa: "عنوان (فارسی)", ten: "عنوان (انگلیسی)", cat: "دسته", year: "سال", tc: "تایم‌کد (00:01:03:02)", yt: "شناسهٔ ویدیوی یوتیوب", be: "لینک Behance", lk: "لینک دیگر", tools: "ابزارها (با کاما جدا کن)", sample: "نمونه (Sample) است", hidden: "پنهان از سایت", cover: "تصویر کاور", pick: "انتخاب تصویر", upl: "در حال آپلود…", upErr: "آپلود نشد (فقط jpg/png/webp/gif، حداکثر ۸ مگابایت، و باید مدیر باشی).", imported: "وارد شد:", pos: "ترتیب", drop: "عکس‌ها را اینجا بکش یا انتخاب کن", cnt: "مورد", ytBad: "شناسهٔ یوتیوب درست نیست.", urlBad: "لینک باید با https:// شروع شود.", tcBad: "تایم‌کد باید مثل 00:01:03:02 باشد.", noImg: "بدون تصویر" },
    en: { tp: "Projects", tg: "Gallery", imp: "Import from site file", impH: "Adds only new items and changes nothing that exists.", add: "New project", none: "Nothing here yet.", edit: "Edit", hide: "Hide", show: "Show", del: "Delete", up: "Up", dn: "Down", sure: "Delete this? It cannot be undone.", save: "Save", cancel: "Close", saved: "Saved.", failed: "Could not save. Check your admin role and that cms-3 / cms-4 were run.", loadErr: "Could not load. Were cms-3.sql and cms-4.sql run?", id: "ID (latin, no spaces)", idBad: "ID: only a-z, 0-9, - and _ (max 40).", tfa: "Title (Persian)", ten: "Title (English)", cat: "Category", year: "Year", tc: "Timecode (00:01:03:02)", yt: "YouTube video ID", be: "Behance link", lk: "Other link", tools: "Tools (comma separated)", sample: "This is a Sample", hidden: "Hidden from the site", cover: "Cover image", pick: "Choose image", upl: "Uploading…", upErr: "Upload failed (jpg/png/webp/gif only, max 8 MB, admin only).", imported: "Imported:", pos: "Order", drop: "Drop images here or choose", cnt: "items", ytBad: "The YouTube ID is not valid.", urlBad: "The link must start with https://", tcBad: "Timecode must look like 00:01:03:02.", noImg: "No image" }
  };
  var CATS = { edit: ["تدوین", "Editing"], film: ["فیلم‌سازی", "Filmmaking"], design: ["طراحی گرافیک", "Graphic design"], code: ["برنامه‌نویسی و وب", "Code & web"], motion: ["موشن", "Motion"], brand: ["برندینگ", "Branding"] };
  var GCATS = { poster: ["پوستر", "Poster"], academy: ["آکادمی", "Academy"], banner: ["بنر", "Banner"], brand: ["برند", "Brand"], print: ["چاپ", "Print"] };
  var ID_RE = /^[a-z0-9_-]{1,40}$/;
  var MEDIA = /^https:\/\/[a-z0-9]{8,30}\.supabase\.co\/storage\/v1\/object\/public\/media\/[\w./-]{1,200}$/;

  window.__adStudio = { mount: function (box, o) {
    var SB = o.SB, S = o.S, lang = o.lang === "fa" ? "fa" : "en", L = T[lang], li = lang === "fa" ? 0 : 1, base = window.__SITE0 || S;
    var tab = "p", rowsP = [], rowsG = [];
    box.innerHTML = '<div class="st-tabs" role="tablist"><button type="button" class="btn go" data-t="p" role="tab"></button> <button type="button" class="btn" data-t="g" role="tab"></button></div><p class="fstatus" id="stSt" role="status"></p><div id="stB"></div>';
    var st = box.querySelector("#stSt"), body = box.querySelector("#stB"), tabs = box.querySelectorAll("[data-t]");
    function say(m, k) { st.textContent = m || ""; st.className = "fstatus " + (k || ""); }
    function title(d, id) { var t = d && d.title; return (t && (t[lang] || t.fa || t.en)) || id; }
    function catName(map, c) { return map[c] ? map[c][li] : c; }

    /* ---------- upload (resize in the browser, then Storage) ---------- */
    function toBlob(file, max, q) {
      return createImageBitmap(file).then(function (bmp) {
        var r = Math.min(1, max / Math.max(bmp.width, bmp.height)), w = Math.max(1, Math.round(bmp.width * r)), h = Math.max(1, Math.round(bmp.height * r));
        var c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(bmp, 0, 0, w, h);
        return new Promise(function (res, rej) { c.toBlob(function (b) { b ? res({ blob: b, w: w, h: h }) : rej(new Error("blob")); }, "image/webp", q); });
      });
    }
    function put(path, blob) {
      return SB.token().then(function (t) {
        return fetch(SB.base() + "/storage/v1/object/media/" + path, { method: "POST", headers: { apikey: S.supabaseAnonKey, Authorization: "Bearer " + t, "Content-Type": "image/webp", "x-upsert": "true" }, body: blob });
      }).then(function (r) { if (!r.ok) throw new Error("up " + r.status); return SB.base() + "/storage/v1/object/public/media/" + path; });
    }
    function upload(file, folder, withThumb) {
      if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type) || file.size > 8 * 1024 * 1024) return Promise.reject(new Error("type"));
      var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      return toBlob(file, 1600, .85).then(function (a) {
        return put(folder + "/" + id + ".webp", a.blob).then(function (url) {
          if (!withThumb) return { src: url, w: a.w, h: a.h };
          return toBlob(file, 480, .8).then(function (b) { return put(folder + "/" + id + "-t.webp", b.blob); }).then(function (turl) { return { src: url, thumb: turl, w: a.w, h: a.h }; });
        });
      });
    }

    /* ---------- projects ---------- */
    function loadP() {
      return SB.rest("site_projects?select=id,data,position,hidden&order=position.asc,created_at.asc&limit=300").then(function (r) { rowsP = r || []; });
    }
    function drawP() {
      var h = '<p class="muted">' + esc(L.impH) + '</p><p><button type="button" class="btn" id="stAdd">' + esc(L.add) + '</button> <button type="button" class="btn" id="stImp">' + esc(L.imp) + '</button></p><div id="stForm"></div>';
      if (!rowsP.length) h += '<p class="muted">' + esc(L.none) + '</p>';
      else h += '<table class="adt"><thead><tr><th>' + esc(L.pos) + '</th><th></th><th>' + esc(L.tfa) + '</th><th>' + esc(L.cat) + '</th><th></th></tr></thead><tbody>' + rowsP.map(function (r, i) {
        var d = r.data || {}, img = MEDIA.test(d.img || "") ? '<img src="' + esc(d.img) + '" alt="" width="48" height="48" style="object-fit:cover;border-radius:8px">' : "";
        return '<tr data-id="' + esc(r.id) + '"><td dir="ltr">' + (i + 1) + '</td><td>' + img + '</td><td>' + esc(title(d, r.id)) + (r.hidden ? ' <small class="muted">(' + esc(L.hide) + ')</small>' : "") + (d.sample ? ' <small class="muted">(Sample)</small>' : "") + '</td><td>' + esc(catName(CATS, d.cat)) + '</td><td class="st-a"><button type="button" class="btn" data-a="e">' + esc(L.edit) + '</button> <button type="button" class="btn" data-a="u" aria-label="' + esc(L.up) + '">&uarr;</button> <button type="button" class="btn" data-a="d" aria-label="' + esc(L.dn) + '">&darr;</button> <button type="button" class="btn" data-a="h">' + esc(r.hidden ? L.show : L.hide) + '</button> <button type="button" class="btn" data-a="x">' + esc(L.del) + '</button></td></tr>';
      }).join("") + '</tbody></table>';
      body.innerHTML = h;
    }
    function savePos() { /* write the whole order */
      return Promise.all(rowsP.map(function (r, i) { return SB.send("PATCH", "site_projects?id=eq." + encodeURIComponent(r.id), { position: i }, "return=minimal"); }));
    }
    function form(r) {
      var nw = !r, d = (r && r.data) || {}, id = r ? r.id : "", f = body.querySelector("#stForm");
      var opts = Object.keys(CATS).map(function (k) { return '<option value="' + k + '"' + (d.cat === k ? " selected" : "") + '>' + esc(CATS[k][li]) + '</option>'; }).join("");
      f.innerHTML = '<form class="adf st-f" novalidate><label>' + esc(L.id) + '<input name="id" dir="ltr" maxlength="40" value="' + esc(id) + '"' + (nw ? "" : " readonly") + '></label>' +
        '<label>' + esc(L.tfa) + '<input name="tfa" maxlength="140" value="' + esc(d.title && d.title.fa) + '"></label><label>' + esc(L.ten) + '<input name="ten" dir="ltr" maxlength="140" value="' + esc(d.title && d.title.en) + '"></label>' +
        '<label>' + esc(L.cat) + '<select name="cat">' + opts + '</select></label><label>' + esc(L.year) + '<input name="year" type="number" min="1990" max="2100" dir="ltr" value="' + esc(d.year) + '"></label>' +
        '<label>' + esc(L.tc) + '<input name="tc" dir="ltr" maxlength="11" value="' + esc(d.tc || "00:00:00:00") + '"></label><label>' + esc(L.yt) + '<input name="yt" dir="ltr" maxlength="20" value="' + esc(d.youtube) + '"></label>' +
        '<label>' + esc(L.be) + '<input name="be" dir="ltr" maxlength="300" value="' + esc(d.behance) + '"></label><label>' + esc(L.lk) + '<input name="lk" dir="ltr" maxlength="300" value="' + esc(d.link) + '"></label>' +
        '<label class="adw">' + esc(L.tools) + '<input name="tools" dir="ltr" maxlength="200" value="' + esc((d.tools || []).join(", ")) + '"></label>' +
        '<div class="adw"><strong>' + esc(L.cover) + '</strong><p id="stCv">' + (MEDIA.test(d.img || "") ? '<img src="' + esc(d.img) + '" alt="" width="120" height="120" style="object-fit:cover;border-radius:10px">' : '<small class="muted">' + esc(L.noImg) + '</small>') + '</p><input type="file" id="stFile" aria-label="' + esc(L.pick) + '" accept="image/jpeg,image/png,image/webp,image/gif"></div>' +
        '<label class="sw"><input type="checkbox" name="sample"' + (d.sample ? " checked" : "") + '><span>' + esc(L.sample) + '</span></label><label class="sw"><input type="checkbox" name="hid"' + (r && r.hidden ? " checked" : "") + '><span>' + esc(L.hidden) + '</span></label>' +
        '<div class="adw"><button class="btn go" type="submit">' + esc(L.save) + '</button> <button class="btn" type="button" id="stCx">' + esc(L.cancel) + '</button></div></form>';
      var img = d.img || "", frm = f.querySelector("form");
      f.querySelector("#stCx").onclick = function () { f.innerHTML = ""; };
      f.querySelector("#stFile").onchange = function (e) {
        var file = e.target.files[0]; if (!file) return; say(L.upl);
        upload(file, "projects", false).then(function (u) { img = u.src; f.querySelector("#stCv").innerHTML = '<img src="' + esc(img) + '" alt="" width="120" height="120" style="object-fit:cover;border-radius:10px">'; say(""); }).catch(function () { say(L.upErr, "err"); });
      };
      frm.addEventListener("submit", function (e) {
        e.preventDefault(); var g = function (n) { return frm.elements[n].value.trim(); }, nid = g("id");
        if (!ID_RE.test(nid)) return say(L.idBad, "err");
        if (g("yt") && !/^[\w-]{6,20}$/.test(g("yt"))) return say(L.ytBad, "err");
        if ((g("be") && !/^https:\/\/\S{4,300}$/.test(g("be"))) || (g("lk") && !/^https:\/\/\S{4,300}$/.test(g("lk")))) return say(L.urlBad, "err");
        if (g("tc") && !/^\d\d:\d\d:\d\d:\d\d$/.test(g("tc"))) return say(L.tcBad, "err");
        var data = Object.assign({}, d, { cat: g("cat"), tc: g("tc") || "00:00:00:00", youtube: g("yt"), sample: frm.elements.sample.checked, title: { fa: g("tfa"), en: g("ten") }, tools: g("tools") ? g("tools").split(",").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 20) : [] });
        if (g("year")) data.year = parseInt(g("year"), 10); else data.year = null;
        if (g("be")) data.behance = g("be"); else delete data.behance;
        if (g("lk")) data.link = g("lk"); else delete data.link;
        if (img) data.img = img;
        var pos = r ? rowsP.findIndex(function (x) { return x.id === r.id; }) : rowsP.length;
        SB.send("POST", "site_projects?on_conflict=id", { id: nid, data: data, hidden: frm.elements.hid.checked, position: pos < 0 ? rowsP.length : pos }, "resolution=merge-duplicates,return=minimal")
          .then(function () { say(L.saved, "ok"); return loadP(); }).then(drawP).catch(function () { say(L.failed, "err"); });
      });
    }
    function bindP() {
      body.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b || tab !== "p") return;
        if (b.id === "stAdd") return form(null);
        if (b.id === "stImp") {
          var arr = (base.projects || []).map(function (p, i) { var d = JSON.parse(JSON.stringify(p)); delete d.id; return { id: p.id, data: d, position: rowsP.length + i }; });
          if (!arr.length) return;
          return SB.send("POST", "site_projects?on_conflict=id", arr, "resolution=ignore-duplicates,return=minimal").then(function () { say(L.imported + " " + arr.length, "ok"); return loadP(); }).then(drawP).catch(function () { say(L.failed, "err"); });
        }
        var tr = b.closest("tr"), a = b.getAttribute("data-a"); if (!tr || !a) return;
        var id = tr.getAttribute("data-id"), i = rowsP.findIndex(function (x) { return x.id === id; }), r = rowsP[i]; if (!r) return;
        if (a === "e") return form(r);
        if (a === "h") return SB.send("PATCH", "site_projects?id=eq." + encodeURIComponent(id), { hidden: !r.hidden }, "return=minimal").then(function () { r.hidden = !r.hidden; drawP(); say(L.saved, "ok"); }).catch(function () { say(L.failed, "err"); });
        if (a === "x") { if (!window.confirm(L.sure)) return; return SB.send("DELETE", "site_projects?id=eq." + encodeURIComponent(id), null, "return=minimal").then(function () { rowsP.splice(i, 1); return savePos(); }).then(drawP).catch(function () { say(L.failed, "err"); }); }
        if (a === "u" || a === "d") { var j = a === "u" ? i - 1 : i + 1; if (j < 0 || j >= rowsP.length) return; var t = rowsP[i]; rowsP[i] = rowsP[j]; rowsP[j] = t; drawP(); return savePos().then(function () { say(L.saved, "ok"); }).catch(function () { say(L.failed, "err"); }); }
      });
    }

    /* ---------- gallery ---------- */
    function loadG() { return SB.rest("site_gallery?select=id,data,hidden&order=created_at.asc,id.asc&limit=1000").then(function (r) { rowsG = r || []; }); }
    function gimg(r, t) { var d = r.data || {}; if (MEDIA.test(d.src || "")) return t && MEDIA.test(d.thumb || "") ? d.thumb : d.src; return "assets/work/" + r.id + (t ? "-t" : "") + ".webp"; }
    function drawG() {
      var h = '<p class="muted">' + esc(L.impH) + '</p><p><button type="button" class="btn" id="gImp">' + esc(L.imp) + '</button> <label class="btn" for="gFile">' + esc(L.drop) + '</label><input type="file" id="gFile" multiple accept="image/jpeg,image/png,image/webp,image/gif" style="position:absolute;left:-9999px"></p><p class="muted">' + rowsG.length + ' ' + esc(L.cnt) + '</p>';
      h += '<div class="st-g">' + rowsG.map(function (r) {
        var d = r.data || {}, so = Object.keys(GCATS).map(function (k) { return '<option value="' + k + '"' + (d.cat === k ? " selected" : "") + '>' + esc(GCATS[k][li]) + '</option>'; }).join("");
        return '<figure class="st-gi' + (r.hidden ? " st-off" : "") + '" data-id="' + esc(r.id) + '"><img src="' + esc(gimg(r, true)) + '" alt="" loading="lazy" width="160" height="160"><figcaption><select data-a="c" aria-label="' + esc(L.cat) + '">' + so + '</select><button type="button" class="btn" data-a="h">' + esc(r.hidden ? L.show : L.hide) + '</button><button type="button" class="btn" data-a="x">' + esc(L.del) + '</button></figcaption></figure>';
      }).join("") + '</div>';
      body.innerHTML = h;
      var drop = body; drop.ondragover = function (e) { if (tab === "g") e.preventDefault(); };
      drop.ondrop = function (e) { if (tab !== "g") return; e.preventDefault(); addFiles(e.dataTransfer.files); };
      body.querySelector("#gFile").onchange = function (e) { addFiles(e.target.files); e.target.value = ""; };
    }
    function addFiles(files) {
      var list = [].slice.call(files || []).slice(0, 30), done = 0, fails = 0; if (!list.length) return; say(L.upl);
      var chain = Promise.resolve();
      list.forEach(function (f, i) {
        chain = chain.then(function () { return upload(f, "gallery", true); }).then(function (u) {
          var id = "u" + Date.now().toString(36) + i;
          return SB.send("POST", "site_gallery?on_conflict=id", { id: id, data: { cat: "poster", w: u.w, h: u.h, src: u.src, thumb: u.thumb } }, "resolution=merge-duplicates,return=minimal").then(function () { done++; });
        }).catch(function (e) { fails++; if (window.console) console.error("studio upload", e && e.message); });
      });
      chain.then(loadG).then(drawG).then(function () { say(fails ? L.upErr : L.saved + " (" + done + ")", fails ? "err" : "ok"); });
    }
    function bindG() {
      body.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b || tab !== "g") return;
        if (b.id === "gImp") {
          var arr = (base.gallery || []).map(function (g) { return { id: g.id, data: { cat: g.cat, w: g.w, h: g.h } }; });
          if (!arr.length) return;
          return SB.send("POST", "site_gallery?on_conflict=id", arr, "resolution=ignore-duplicates,return=minimal").then(function () { say(L.imported + " " + arr.length, "ok"); return loadG(); }).then(drawG).catch(function () { say(L.failed, "err"); });
        }
        var fg = b.closest(".st-gi"), a = b.getAttribute("data-a"); if (!fg || !a) return;
        var id = fg.getAttribute("data-id"), i = rowsG.findIndex(function (x) { return x.id === id; }), r = rowsG[i]; if (!r) return;
        if (a === "h") return SB.send("PATCH", "site_gallery?id=eq." + encodeURIComponent(id), { hidden: !r.hidden }, "return=minimal").then(function () { r.hidden = !r.hidden; drawG(); }).catch(function () { say(L.failed, "err"); });
        if (a === "x") { if (!window.confirm(L.sure)) return; return SB.send("DELETE", "site_gallery?id=eq." + encodeURIComponent(id), null, "return=minimal").then(function () { rowsG.splice(i, 1); drawG(); }).catch(function () { say(L.failed, "err"); }); }
      });
      body.addEventListener("change", function (e) {
        var s = e.target; if (!s.matches || !s.matches('select[data-a="c"]') || tab !== "g") return;
        var fg = s.closest(".st-gi"), id = fg.getAttribute("data-id"), r = rowsG.find(function (x) { return x.id === id; }); if (!r) return;
        var d = Object.assign({}, r.data || {}, { cat: s.value });
        SB.send("PATCH", "site_gallery?id=eq." + encodeURIComponent(id), { data: d }, "return=minimal").then(function () { r.data = d; say(L.saved, "ok"); }).catch(function () { say(L.failed, "err"); });
      });
    }

    function go(t) {
      tab = t; say("");
      [].forEach.call(tabs, function (b) { b.className = "btn" + (b.getAttribute("data-t") === t ? " go" : ""); b.textContent = b.getAttribute("data-t") === "p" ? L.tp : L.tg; b.setAttribute("aria-selected", b.getAttribute("data-t") === t ? "true" : "false"); });
      (t === "p" ? loadP().then(drawP) : loadG().then(drawG)).catch(function () { body.innerHTML = ""; say(L.loadErr, "err"); });
    }
    [].forEach.call(tabs, function (b) { b.onclick = function () { go(b.getAttribute("data-t")); }; });
    bindP(); bindG(); go("p");
  } };
})();
