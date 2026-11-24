/* Admin: edit every localized text of the site (fa / en / ps) and the contact fields.
   Saves into public.site_content (staff only). The site applies those values on top of data/content.js. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { h: "ویرایش متن‌ها", p: "هر متن سایت را اینجا عوض کن. تغییر برای همهٔ بازدیدکننده‌ها اعمال می‌شود. «بازگشت» متن را به حالت اولیه برمی‌گرداند.", search: "جستجوی متن یا بخش", save: "ذخیره", reset: "بازگشت به اولیه", saved: "ذخیره شد", resetOk: "بازگشت داده شد. صفحه را تازه کن.", failed: "ذخیره نشد. آیا cms-2.sql را اجرا کرده‌اید و مدیر هستید؟", edited: "ویرایش‌شده", fa: "فارسی", en: "English", ps: "پشتو (برای آینده)", contact: "اطلاعات تماس", e1: "ایمیل اصلی", e2: "ایمیل دوم", ph: "شماره", phA: "شمارهٔ بین‌المللی با +93", phS: "شمارهٔ نمایشی", bad: "مقدار درست نیست", count: "متن", loadErr: "بارگذاری نشد. cms-2.sql را اجرا کنید." },
    en: { h: "Edit texts", p: "Change any text of the site here. The change applies to every visitor. Reset returns a text to its default.", search: "Search text or section", save: "Save", reset: "Reset to default", saved: "Saved", resetOk: "Reset. Reload the page.", failed: "Could not save. Did you run cms-2.sql, and are you an admin?", edited: "Edited", fa: "Persian", en: "English", ps: "Pashto (for later)", contact: "Contact details", e1: "Main email", e2: "Second email", ph: "Number", phA: "International number with +93", phS: "Display number", bad: "Value is not valid", count: "texts", loadErr: "Could not load. Run cms-2.sql." }
  };
  var SKIP = /^(supabase|formKey|formEndpoint|domain)/;
  function leaves(o, path, out, d) {
    if (d > 6 || !o || typeof o !== "object") return;
    if (typeof o.fa === "string" && typeof o.en === "string") { out.push({ key: path, v: o }); return; }
    Object.keys(o).forEach(function (k) { if (d === 0 && SKIP.test(k)) return; leaves(o[k], path ? path + "." + k : k, out, d + 1); });
  }
  window.__adCms = { mount: function (box, o) {
    var SB = o.SB, lang = o.lang === "fa" ? "fa" : "en", L = T[lang], base = window.__SITE0 || window.SITE, items = [], ov = {};
    leaves(base, "", items, 0);
    var groups = {}; items.forEach(function (it) { var g = it.key.split(".")[0]; (groups[g] = groups[g] || []).push(it); });
    var names = Object.keys(groups).sort();
    box.innerHTML = '<p class="muted">' + esc(L.p) + '</p><div id="cmC"></div><label class="cm-s"><span class="sr-only">' + esc(L.search) + '</span><input type="search" id="cmQ" placeholder="' + esc(L.search) + '" maxlength="80"></label><div id="cmL"></div><p class="fstatus" id="cmSt" role="status" aria-live="polite"></p>';
    var st = box.querySelector("#cmSt"), list = box.querySelector("#cmL");
    function say(m, k) { st.textContent = m; st.className = "fstatus " + (k || ""); }
    function row(it) {
      var cur = it.v, ed = ov[it.key], long = Math.max(cur.fa.length, cur.en.length) > 70;
      var f = function (l) { var val = (ed && typeof ed[l] === "string") ? ed[l] : (l === "ps" ? ((cur.ps) || "") : cur[l]); return '<label>' + esc(L[l]) + (long ? '<textarea rows="3" data-l="' + l + '" maxlength="4000" dir="' + (l === "en" ? "ltr" : "rtl") + '">' + esc(val) + '</textarea>' : '<input data-l="' + l + '" maxlength="4000" dir="' + (l === "en" ? "ltr" : "rtl") + '" value="' + esc(val) + '">') + '</label>'; };
      return '<div class="cm-r" data-k="' + esc(it.key) + '"><p class="cm-k" dir="ltr">' + esc(it.key) + (ed ? ' <b class="cm-e">' + esc(L.edited) + '</b>' : "") + '</p><div class="cm-f">' + f("fa") + f("en") + f("ps") + '</div><div class="ib-a"><button type="button" class="btn go" data-s>' + esc(L.save) + '</button><button type="button" class="btn" data-r>' + esc(L.reset) + '</button><span class="fstatus" role="status"></span></div></div>';
    }
    function draw() {
      var q = box.querySelector("#cmQ").value.trim().toLowerCase();
      var openG = {}; [].forEach.call(list.querySelectorAll("details[open]"), function (d) { openG[d.getAttribute("data-g")] = 1; });
      list.innerHTML = names.map(function (g) {
        var its = groups[g].filter(function (it) { return !q || (it.key + " " + it.v.fa + " " + it.v.en).toLowerCase().indexOf(q) >= 0; });
        if (!its.length) return "";
        var isOpen = q ? " open" : (openG[g] ? " open" : "");
        return '<details class="cm-g" data-g="' + esc(g) + '"' + isOpen + '><summary>' + esc(g) + ' <small>(' + its.length + ' ' + esc(L.count) + ')</small></summary><div class="cm-b">' + (isOpen ? its.slice(0, 60).map(row).join("") : "") + '</div></details>';
      }).join("");
    }
    function fill(det) {
      var g = det.getAttribute("data-g"), q = box.querySelector("#cmQ").value.trim().toLowerCase(), b = det.querySelector(".cm-b"); if (b.children.length) return;
      b.innerHTML = groups[g].filter(function (it) { return !q || (it.key + " " + it.v.fa + " " + it.v.en).toLowerCase().indexOf(q) >= 0; }).slice(0, 60).map(row).join("");
    }
    list.addEventListener("toggle", function (e) { if (e.target.open) fill(e.target); }, true);
    list.addEventListener("click", function (e) {
      var r = e.target.closest && e.target.closest(".cm-r"); if (!r) return; var key = r.getAttribute("data-k"), s = r.querySelector(".fstatus");
      if (e.target.matches("[data-s]")) {
        var v = {}; [].forEach.call(r.querySelectorAll("[data-l]"), function (i) { if (i.value.trim() || i.getAttribute("data-l") !== "ps") v[i.getAttribute("data-l")] = i.value; });
        SB.send("POST", "site_content?on_conflict=key", { key: key, value: v }, "resolution=merge-duplicates,return=minimal").then(function () { ov[key] = v; s.textContent = L.saved; s.className = "fstatus ok"; if (window.__applyContent) window.__applyContent([{ key: key, value: v }]); })
          .catch(function () { s.textContent = L.failed; s.className = "fstatus err"; });
      } else if (e.target.matches("[data-r]")) {
        SB.send("DELETE", "site_content?key=eq." + encodeURIComponent(key), null, "return=minimal").then(function () { delete ov[key]; s.textContent = L.resetOk; s.className = "fstatus ok"; })
          .catch(function () { s.textContent = L.failed; s.className = "fstatus err"; });
      }
    });
    box.querySelector("#cmQ").addEventListener("input", draw);

    /* contact fields */
    var cf = [["contactEmail", "e1", "email"], ["contactEmail2", "e2", "email"]];
    (base.phones || []).forEach(function (p, i) { cf.push(["phones." + i + ".n", "phA", "tel", i], ["phones." + i + ".show", "phS", "text", i]); });
    var cc = box.querySelector("#cmC");
    cc.innerHTML = '<h3>' + esc(L.contact) + '</h3><div class="cm-c">' + cf.map(function (c) {
      var cur = c[0].split(".").reduce(function (o2, k) { return o2 && o2[k]; }, window.SITE) || "";
      return '<label>' + esc(L[c[1]]) + (c[3] != null ? " " + (c[3] + 1) : "") + '<input data-ck="' + esc(c[0]) + '" type="' + c[2] + '" dir="ltr" maxlength="60" value="' + esc(cur) + '"></label>';
    }).join("") + '</div><p><button type="button" class="btn go" id="cmCS">' + esc(L.save) + '</button> <span class="fstatus" id="cmCT" role="status"></span></p>';
    cc.querySelector("#cmCS").onclick = function () {
      var t = cc.querySelector("#cmCT"), jobs = [], bad = false;
      [].forEach.call(cc.querySelectorAll("[data-ck]"), function (i) {
        var k = i.getAttribute("data-ck"), v = i.value.trim(), cur = k.split(".").reduce(function (o2, kk) { return o2 && o2[kk]; }, window.SITE);
        if (v === cur) return;
        if (/Email/.test(k) && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(v)) { bad = true; return; }
        if (/\.n$/.test(k) && !/^\+?\d{6,15}$/.test(v)) { bad = true; return; }
        jobs.push(SB.send("POST", "site_content?on_conflict=key", { key: k, value: v }, "resolution=merge-duplicates,return=minimal").then(function () { if (window.__applyContent) window.__applyContent([{ key: k, value: v }]); }));
      });
      if (bad) { t.textContent = L.bad; t.className = "fstatus err"; return; }
      Promise.all(jobs).then(function () { t.textContent = L.saved; t.className = "fstatus ok"; }).catch(function () { t.textContent = L.failed; t.className = "fstatus err"; });
    };
    SB.rest("site_content?select=key,value&limit=2000").then(function (rows) { (rows || []).forEach(function (r) { ov[r.key] = r.value; }); draw(); }).catch(function () { say(L.loadErr, "err"); draw(); });
  } };
})();
