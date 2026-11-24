/* Admin: backup / restore of site content (texts, look & effects, projects, gallery, résumé) as one JSON file.
   Restore validates every row and writes through the normal API, so Supabase RLS still decides what is allowed. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { p: "یک فایل پشتیبان از متن‌ها، ظاهر و افکت‌ها، پروژه‌ها، گالری و رزومه بگیر. بازگردانی فقط همین موارد را برمی‌گرداند (نه دانشجویان، دوره‌ها و گواهی‌ها).", ex: "دریافت پشتیبان", im: "بازگردانی از فایل", pick: "فایل پشتیبان (JSON)", busy: "در حال کار…", done: "انجام شد", cnt: "ردیف", bad: "فایل معتبر نیست.", err: "ناموفق بود (دسترسی یا SQL).", skip: "ردیف نامعتبر ردشد", warn: "بازگردانی مقدارهای فعلی را با مقدارهای فایل جایگزین می‌کند. ادامه می‌دهی؟" },
    en: { p: "Download one backup file of texts, look & effects, projects, gallery and résumé. Restore only brings back these (not students, courses or certificates).", ex: "Download backup", im: "Restore from file", pick: "Backup file (JSON)", busy: "Working…", done: "Done", cnt: "rows", bad: "Not a valid file.", err: "Failed (permissions or SQL).", skip: "invalid rows skipped", warn: "Restore replaces current values with the file's values. Continue?" }
  };
  var ID = /^[A-Za-z0-9_.\-]{1,80}$/;
  var TABLES = [
    { t: "site_content", sel: "key,value", key: "key", ok: function (r) { return ID.test(r.key) && r.value != null && JSON.stringify(r.value).length <= 20000; }, pick: function (r) { return { key: r.key, value: r.value }; } },
    { t: "site_settings", sel: "key,value", key: "key", filter: "key=like.design.*", ok: function (r) { return /^design\.[A-Za-z0-9_]{1,40}$/.test(r.key) && JSON.stringify(r.value).length <= 40000; }, pick: function (r) { return { key: r.key, value: r.value }; } },
    { t: "site_projects", sel: "id,data,position,hidden", key: "id", ok: function (r) { return ID.test(r.id) && r.data && typeof r.data === "object" && JSON.stringify(r.data).length <= 8000; }, pick: function (r) { return { id: r.id, data: r.data, position: +r.position || 0, hidden: !!r.hidden }; } },
    { t: "site_gallery", sel: "id,data,position,hidden", key: "id", ok: function (r) { return ID.test(r.id) && r.data && typeof r.data === "object" && JSON.stringify(r.data).length <= 8000; }, pick: function (r) { return { id: r.id, data: r.data, position: +r.position || 0, hidden: !!r.hidden }; } },
    { t: "site_resume", sel: "id,kind,data,position,hidden", key: "id", ok: function (r) { return ID.test(r.id) && /^(education|experience)$/.test(r.kind) && r.data && typeof r.data === "object" && JSON.stringify(r.data).length <= 8000; }, pick: function (r) { return { id: r.id, kind: r.kind, data: r.data, position: +r.position || 0, hidden: !!r.hidden }; } }
  ];
  window.__adBackup = { mount: function (box, o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"];
    box.innerHTML = '<p class="muted">' + esc(L.p) + '</p><p class="bk-a"><button type="button" class="btn go" id="bkEx">' + esc(L.ex) + '</button> <label class="adc">' + esc(L.pick) + '<input type="file" id="bkF" accept="application/json,.json"></label> <button type="button" class="btn" id="bkIm">' + esc(L.im) + '</button></p><p class="fstatus" id="bkSt" role="status" aria-live="polite"></p>';
    var st = box.querySelector("#bkSt"), say = function (m, k) { st.textContent = m; st.className = "fstatus " + (k || ""); };
    box.querySelector("#bkEx").onclick = function () {
      say(L.busy, "");
      Promise.all(TABLES.map(function (d) { return SB.rest(d.t + "?select=" + d.sel + (d.filter ? "&" + d.filter : "") + "&limit=5000").catch(function () { return []; }); })).then(function (r) {
        var out = { app: "cinecode-backup", v: 1, at: new Date().toISOString(), data: {} }, n = 0; TABLES.forEach(function (d, i) { out.data[d.t] = r[i]; n += r[i].length; });
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: "application/json" })); a.download = "cinecode-backup-" + out.at.slice(0, 10) + ".json"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        say(L.done + " · " + n + " " + L.cnt, "ok");
      });
    };
    box.querySelector("#bkIm").onclick = function () {
      var f = box.querySelector("#bkF").files[0]; if (!f || f.size > 8 * 1024 * 1024) return say(L.bad, "err");
      f.text().then(function (txt) {
        var j; try { j = JSON.parse(txt); } catch (e) { return say(L.bad, "err"); }
        if (!j || j.app !== "cinecode-backup" || !j.data || typeof j.data !== "object") return say(L.bad, "err");
        if (!confirm(L.warn)) return;
        say(L.busy, ""); var skipped = 0, written = 0, chain = Promise.resolve();
        TABLES.forEach(function (d) {
          var rows = Array.isArray(j.data[d.t]) ? j.data[d.t] : []; var good = []; rows.slice(0, 5000).forEach(function (r) { if (r && typeof r === "object" && d.ok(r)) good.push(d.pick(r)); else skipped++; });
          for (var i = 0; i < good.length; i += 100) (function (part) { chain = chain.then(function () { return SB.send("POST", d.t + "?on_conflict=" + d.key, part, "resolution=merge-duplicates,return=minimal").then(function () { written += part.length; }); }); })(good.slice(i, i + 100));
        });
        chain.then(function () { say(L.done + " · " + written + " " + L.cnt + (skipped ? " · " + skipped + " " + L.skip : ""), "ok"); try { localStorage.removeItem("am-design"); } catch (e) {} }).catch(function () { say(L.err, "err"); });
      });
    };
  } };
})();
