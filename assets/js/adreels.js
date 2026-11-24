/* Admin: Reels list (design.reels = [{id: YouTube video id (11), t:{fa,en}, hide}]). Accepts a full YouTube / Shorts link too. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "ویدیوهای کوتاه (یوتیوب شورتز). لینک یا شناسهٔ ۱۱ حرفی را بگذار. صفحهٔ نمایش: reels.html", u: "لینک یوتیوب یا شناسه", fa: "عنوان فارسی", en: "عنوان انگلیسی", add: "افزودن", del: "حذف", up: "بالا", dn: "پایین", hide: "مخفی", show: "نمایش", ok: "ذخیره شد ✓", bad: "ذخیره نشد. سوپرادمین باش و cms-6.sql را اجرا کن.", bu: "لینک یا شناسهٔ یوتیوب درست نیست.", none: "هنوز ویدیویی نیست.", open: "دیدن صفحه" },
    en: { p: "Short vertical videos (YouTube Shorts). Paste a link or the 11-character ID. Public page: reels.html", u: "YouTube link or ID", fa: "Persian title", en: "English title", add: "Add", del: "Remove", up: "Up", dn: "Down", hide: "Hide", show: "Show", ok: "Saved ✓", bad: "Not saved. Be super admin and run cms-6.sql.", bu: "Not a valid YouTube link or ID.", none: "No videos yet.", open: "View page" }
  };
  var vid = function (s) { s = String(s || "").trim(); var m = s.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})(?:[?&#\/].*)?$/i); if (m) return m[1]; return /^[\w-]{11}$/.test(s) ? s : ""; };
  window.__adReels = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], list = [], msg = "";
    function save() {
      SB.send("POST", "site_settings?on_conflict=key", { key: "design.reels", value: list }, "resolution=merge-duplicates,return=minimal").then(function () {
        try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.reels = list; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
        msg = L.ok; draw();
      }).catch(function () { msg = L.bad; draw(); });
    }
    function draw() {
      box.innerHTML = '<p class="muted">' + esc(L.p) + ' <a href="reels.html" target="_blank" rel="noopener">' + esc(L.open) + "</a></p>" + (msg ? '<p class="fstatus" role="status">' + esc(msg) + "</p>" : "") +
        (list.length ? '<ul class="stu-l">' + list.map(function (x, i) { return "<li><b>" + esc((x.t && (x.t.fa || x.t.en)) || x.id) + '</b> <small dir="ltr">' + esc(x.id) + "</small> " + (x.hide ? '<span class="pill">' + esc(L.hide) + "</span> " : "") + '<button type="button" class="btn" data-m="up" data-i="' + i + '">' + esc(L.up) + '</button> <button type="button" class="btn" data-m="dn" data-i="' + i + '">' + esc(L.dn) + '</button> <button type="button" class="btn" data-m="h" data-i="' + i + '">' + esc(x.hide ? L.show : L.hide) + '</button> <button type="button" class="btn" data-m="d" data-i="' + i + '">' + esc(L.del) + "</button></li>"; }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>") +
        '<form id="rlNew" class="stu-t"><label class="adc">' + esc(L.u) + '<input name="u" dir="ltr" maxlength="200" required></label><label class="adc">' + esc(L.fa) + '<input name="fa" maxlength="80"></label><label class="adc">' + esc(L.en) + '<input name="en" dir="ltr" maxlength="80"></label><button class="btn go" type="submit">' + esc(L.add) + "</button></form>";
    }
    box.addEventListener("submit", function (e) { e.preventDefault(); var f = e.target, id = vid(f.u.value); if (!id) { msg = L.bu; draw(); return; } if (list.length >= 60) return; list.push({ id: id, t: { fa: f.fa.value.trim(), en: f.en.value.trim() } }); save(); });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-m]"); if (!b) return; var i = +b.dataset.i, m = b.dataset.m, t;
      if (m === "d") list.splice(i, 1); else if (m === "h") list[i].hide = !list[i].hide; else if (m === "up" && i > 0) { t = list[i]; list[i] = list[i - 1]; list[i - 1] = t; } else if (m === "dn" && i < list.length - 1) { t = list[i]; list[i] = list[i + 1]; list[i + 1] = t; }
      save();
    });
    SB.rest("site_settings?select=value&key=eq.design.reels").then(function (r) { var v = r && r[0] && r[0].value; list = Array.isArray(v) ? v : []; draw(); }).catch(function () { list = []; draw(); });
  } };
  window.__adReelsVid = vid;
})();
