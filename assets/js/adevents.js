/* Admin: Events and webinars (design.events = [{id,title:{fa,en},desc:{fa,en},date,time,kind,place,url,hide}]). Public page: events.html */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { intro: "وبینار، کارگاه، نمایش فیلم و پخش زنده. زمان به وقت کابل. صفحهٔ نمایش: events.html", open: "باز کردن صفحه", add: "افزودن", save: "ذخیره تغییر", cancel: "لغو", edit: "ویرایش", del: "حذف", up: "بالا", dn: "پایین", hide: "مخفی", show: "نمایش",
      ok: "ذخیره شد.", bad: "ذخیره نشد. با حساب مدیر کل وارد شو و cms-6.sql را اجرا کن.", needT: "عنوان لازم است.", needD: "تاریخ را به شکل YYYY-MM-DD بنویس.", badTime: "ساعت را به شکل 18:30 بنویس.", badUrl: "لینک باید با https:// شروع شود.", askDel: "این رویداد برای همیشه حذف شود؟", none: "هنوز رویدادی اضافه نشده.",
      tfa: "عنوان فارسی", ten: "عنوان انگلیسی", dfa: "توضیح فارسی", den: "توضیح انگلیسی", date: "تاریخ (YYYY-MM-DD)", time: "ساعت به وقت کابل (مثل 18:30)", kind: "نوع", place: "مکان (مثلاً آنلاین، Zoom)", url: "لینک ورود یا ضبط (https://...)" },
    en: { intro: "Webinars, workshops, screenings and live sessions. Time is Kabul time. Public page: events.html", open: "Open page", add: "Add", save: "Save change", cancel: "Cancel", edit: "Edit", del: "Delete", up: "Up", dn: "Down", hide: "Hide", show: "Show",
      ok: "Saved.", bad: "Not saved. Sign in as super admin and run cms-6.sql.", needT: "A title is required.", needD: "Write the date as YYYY-MM-DD.", badTime: "Write the time like 18:30.", badUrl: "The link must start with https://.", askDel: "Delete this event permanently?", none: "No event added yet.",
      tfa: "Persian title", ten: "English title", dfa: "Persian description", den: "English description", date: "Date (YYYY-MM-DD)", time: "Time, Kabul (like 18:30)", kind: "Type", place: "Place (e.g. Online, Zoom)", url: "Join or recording link (https://...)" }
  };
  var KINDS = { webinar: ["وبینار", "Webinar"], workshop: ["کارگاه", "Workshop"], screening: ["نمایش فیلم", "Screening"], live: ["پخش زنده", "Live session"], other: ["دیگر", "Other"] };
  window.__adEvents = { mount: function (box, o) {
    var SB = o.SB, fa = o.lang === "fa", L = T[fa ? "fa" : "en"], list = [], ed = -1, msg = "", err = "";
    function save() {
      SB.send("POST", "site_settings?on_conflict=key", { key: "design.events", value: list }, "resolution=merge-duplicates,return=minimal").then(function () {
        try { var d = JSON.parse(localStorage.getItem("am-design") || "{}") || {}; d.events = list; localStorage.setItem("am-design", JSON.stringify(d)); } catch (e) {}
        msg = L.ok; err = ""; ed = -1; draw();
      }).catch(function () { msg = ""; err = L.bad; draw(); });
    }
    var inp = function (t, n, v, ex) { return '<label class="adc">' + esc(t) + '<input name="' + n + '" value="' + esc(v) + '" maxlength="' + ((ex && ex.max) || 160) + '"' + (ex && ex.dir ? ' dir="ltr"' : "") + "></label>"; };
    function draw() {
      var x = ed >= 0 ? list[ed] : {};
      box.innerHTML = '<p class="muted">' + esc(L.intro) + ' <a href="events.html" target="_blank" rel="noopener">' + esc(L.open) + "</a></p>" +
        (msg ? '<p class="fstatus ok" role="status">' + esc(msg) + "</p>" : "") + (err ? '<p class="fstatus err" role="alert">' + esc(err) + "</p>" : "") +
        (list.length ? '<ul class="stu-l">' + list.map(function (e, i) {
          return "<li><b>" + esc((e.title && (e.title.fa || e.title.en)) || "") + '</b> <small dir="ltr">' + esc((e.date || "") + " " + (e.time || "")) + "</small> " + (e.hide ? '<span class="pill">' + esc(L.hide) + "</span> " : "") +
            '<button type="button" class="btn" data-m="ed" data-i="' + i + '">' + esc(L.edit) + '</button> <button type="button" class="btn" data-m="h" data-i="' + i + '">' + esc(e.hide ? L.show : L.hide) + '</button> <button type="button" class="btn" data-m="up" data-i="' + i + '" aria-label="' + esc(L.up) + '">↑</button> <button type="button" class="btn" data-m="dn" data-i="' + i + '" aria-label="' + esc(L.dn) + '">↓</button> <button type="button" class="btn" data-m="d" data-i="' + i + '">' + esc(L.del) + "</button></li>";
        }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>") +
        '<form id="evF" class="stu-t">' + inp(L.tfa, "tfa", x.title && x.title.fa) + inp(L.ten, "ten", x.title && x.title.en) +
        '<label class="adc">' + esc(L.dfa) + '<textarea name="dfa" rows="3" maxlength="600">' + esc(x.desc && x.desc.fa) + "</textarea></label>" +
        '<label class="adc">' + esc(L.den) + '<textarea name="den" rows="3" maxlength="600">' + esc(x.desc && x.desc.en) + "</textarea></label>" +
        inp(L.date, "date", x.date, { dir: 1, max: 10 }) + inp(L.time, "time", x.time, { dir: 1, max: 5 }) +
        '<label class="adc">' + esc(L.kind) + '<select name="kind">' + Object.keys(KINDS).map(function (k) { return '<option value="' + k + '"' + ((x.kind || "webinar") === k ? " selected" : "") + ">" + esc(KINDS[k][fa ? 0 : 1]) + "</option>"; }).join("") + "</select></label>" +
        inp(L.place, "place", x.place, { max: 80 }) + inp(L.url, "url", x.url, { dir: 1, max: 300 }) +
        '<button class="btn go" type="submit">' + esc(ed >= 0 ? L.save : L.add) + "</button>" + (ed >= 0 ? ' <button class="btn" type="button" data-m="cancel">' + esc(L.cancel) + "</button>" : "") + "</form>";
    }
    box.addEventListener("submit", function (e) {
      if (e.target.id !== "evF") return; e.preventDefault(); var f = e.target.elements, v = function (n) { return f[n].value.trim(); };
      err = ""; msg = "";
      if (!v("tfa") && !v("ten")) { err = L.needT; return draw(); }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v("date"))) { err = L.needD; return draw(); }
      if (v("time") && !/^([01]\d|2[0-3]):[0-5]\d$/.test(v("time"))) { err = L.badTime; return draw(); }
      if (v("url") && !/^https:\/\/[^\s"'<>]+$/i.test(v("url"))) { err = L.badUrl; return draw(); }
      var base = ed >= 0 ? list[ed] : { id: "e" + Date.now().toString(36) };
      var x = { id: base.id, hide: base.hide, title: { fa: v("tfa"), en: v("ten") }, desc: { fa: v("dfa"), en: v("den") }, date: v("date"), time: v("time"), kind: KINDS[v("kind")] ? v("kind") : "other", place: v("place"), url: v("url") };
      if (ed >= 0) list[ed] = x; else { if (list.length >= 100) return; list.push(x); }
      save();
    });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-m]"); if (!b) return; var m = b.dataset.m, i = +b.dataset.i, t;
      if (m === "cancel") { ed = -1; return draw(); }
      if (m === "ed") { ed = i; msg = ""; err = ""; draw(); var f = box.querySelector("#evF"); if (f) f.scrollIntoView({ block: "nearest" }); return; }
      if (m === "d") { if (!window.confirm(L.askDel)) return; list.splice(i, 1); } else if (m === "h") list[i].hide = !list[i].hide;
      else if (m === "up" && i > 0) { t = list[i]; list[i] = list[i - 1]; list[i - 1] = t; } else if (m === "dn" && i < list.length - 1) { t = list[i]; list[i] = list[i + 1]; list[i + 1] = t; } else return;
      save();
    });
    SB.rest("site_settings?select=value&key=eq.design.events").then(function (r) { var v = r && r[0] && r[0].value; list = Array.isArray(v) ? v : []; draw(); }).catch(function () { list = []; draw(); });
  } };
})();
