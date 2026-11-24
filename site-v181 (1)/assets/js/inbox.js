/* Admin inbox (staff only): contact messages + work requests (leads).
   Reads/writes contact_messages and leads through Supabase (RLS: staff only). */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { h: "صندوق پیام‌ها", msgs: "پیام‌های تماس", leads: "درخواست کار", name: "نام", email: "ایمیل", type: "نوع درخواست", time: "زمان", msg: "پیام", status: "وضعیت", notes: "یادداشت",
      save: "ذخیره", saved: "ذخیره شد", del: "حذف", delAsk: "این مورد برای همیشه حذف شود؟", gmail: "پاسخ با Gmail", wa: "باز کردن در WhatsApp", none: "هنوز چیزی نیامده است.",
      err: "بارگذاری نشد. آیا فایل cms-1.sql را در Supabase اجرا کرده‌اید؟", load: "در حال بارگذاری…", failed: "ذخیره نشد.", budget: "بودجه", phone: "شمارهٔ WhatsApp (اختیاری)",
      st: { new: "تازه", read: "خوانده‌شده", replied: "پاسخ داده شد", archived: "بایگانی", contacted: "تماس گرفته شد", won: "موفق", lost: "ناموفق" },
      ty: { video_editing: "تدوین ویدیو", web_development: "طراحی وب", branding: "برندینگ", graphic_design: "طراحی گرافیک", motion: "موشن", filmmaking: "فیلم‌سازی", training: "آموزش", other: "دیگر", general: "عمومی" },
      subj: "پاسخ از CineCode Academy", greet: "سلام ", body: "،\n\nبابت پیام‌تان سپاسگزارم.\n\n— انصارالحق مبارز\nCineCode Academy", search: "جستجو" },
    en: { h: "Inbox", msgs: "Contact messages", leads: "Work requests", name: "Name", email: "Email", type: "Request type", time: "Time", msg: "Message", status: "Status", notes: "Notes",
      save: "Save", saved: "Saved", del: "Delete", delAsk: "Delete this item permanently?", gmail: "Reply via Gmail", wa: "Open in WhatsApp", none: "Nothing here yet.",
      err: "Could not load. Did you run cms-1.sql in Supabase?", load: "Loading…", failed: "Could not save.", budget: "Budget", phone: "WhatsApp number (optional)",
      st: { new: "New", read: "Read", replied: "Replied", archived: "Archived", contacted: "Contacted", won: "Won", lost: "Lost" },
      ty: { video_editing: "Video editing", web_development: "Web development", branding: "Branding", graphic_design: "Graphic design", motion: "Motion", filmmaking: "Filmmaking", training: "Training", other: "Other", general: "General" },
      subj: "Reply from CineCode Academy", greet: "Hello ", body: ",\n\nThank you for your message.\n\n— Ansarulhaq Mubarez\nCineCode Academy", search: "Search" }
  };
  var MS = ["new", "read", "replied", "archived"], LS = ["new", "contacted", "won", "lost", "archived"];

  window.__adInbox = { mount: function (box, o) {
    var SB = o.SB, lang = o.lang === "fa" ? "fa" : "en", L = T[lang], tab = "msgs", rows = [], q = "";
    var fmt = function (iso) { try { return new Date(iso).toLocaleString(lang === "fa" ? "fa-AF" : "en-GB", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return String(iso).slice(0, 16); } };
    var tname = function (k) { return L.ty[k] || k; };

    box.innerHTML = '<div class="ib"><div class="an-bar" role="tablist"><button type="button" class="an-b" role="tab" data-t="msgs" aria-pressed="true">' + esc(L.msgs) + ' <b id="ibC1"></b></button>' +
      '<button type="button" class="an-b" role="tab" data-t="leads" aria-pressed="false">' + esc(L.leads) + ' <b id="ibC2"></b></button></div>' +
      '<label class="ib-s"><span class="sr-only">' + esc(L.search) + '</span><input type="search" id="ibQ" placeholder="' + esc(L.search) + '" maxlength="80"></label>' +
      '<div id="ibL" aria-live="polite"><p class="muted">' + esc(L.load) + '</p></div></div>';
    var list = box.querySelector("#ibL");

    function gmailUrl(r) {
      var body = L.greet + r.name + L.body;
      return "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(r.email) + "&su=" + encodeURIComponent(L.subj) + "&body=" + encodeURIComponent(body);
    }
    function waUrl(r, num) {
      var n = String(num || "").replace(/\D/g, ""); if (!n) return "";
      return "https://wa.me/" + n + "?text=" + encodeURIComponent(L.greet + r.name + L.body);
    }
    function card(r) {
      var sts = tab === "msgs" ? MS : LS, kind = tab === "msgs" ? r.category : r.request_type;
      return '<article class="ib-c" data-id="' + esc(r.id) + '"><header><b dir="auto">' + esc(r.name) + '</b> <a href="mailto:' + esc(r.email) + '" dir="ltr">' + esc(r.email) + '</a>' +
        '<span class="ib-tag">' + esc(tname(kind)) + '</span><time>' + esc(fmt(r.created_at)) + '</time></header>' +
        (r.budget ? '<p class="muted">' + esc(L.budget) + ': ' + esc(r.budget) + '</p>' : "") +
        '<p class="ib-m" dir="auto">' + esc(r.message) + '</p>' +
        '<div class="ib-f"><label>' + esc(L.status) + ' <select data-f="status">' + sts.map(function (s) { return '<option value="' + s + '"' + (r.status === s ? " selected" : "") + ">" + esc(L.st[s]) + "</option>"; }).join("") + '</select></label>' +
        '<label class="ib-nt">' + esc(L.notes) + ' <input data-f="notes" maxlength="500" value="' + esc(r.notes || "") + '"></label>' +
        '<label>' + esc(L.phone) + ' <input data-f="wa" inputmode="tel" dir="ltr" maxlength="20" placeholder="93777100489"></label></div>' +
        '<div class="ib-a"><a class="btn" href="' + esc(gmailUrl(r)) + '" target="_blank" rel="noopener noreferrer">' + esc(L.gmail) + '</a>' +
        '<a class="btn" data-wa href="#" target="_blank" rel="noopener noreferrer" hidden>' + esc(L.wa) + '</a>' +
        '<button type="button" class="btn go" data-s>' + esc(L.save) + '</button><button type="button" class="btn" data-d>' + esc(L.del) + '</button><span class="fstatus" role="status"></span></div></article>';
    }
    function draw() {
      var s = q.toLowerCase(), v = rows.filter(function (r) { return !s || (r.name + " " + r.email + " " + r.message).toLowerCase().indexOf(s) >= 0; });
      list.innerHTML = v.length ? v.map(card).join("") : '<p class="muted">' + esc(L.none) + "</p>";
      [].forEach.call(list.querySelectorAll(".ib-c"), function (el) {
        var id = el.getAttribute("data-id"), r = rows.filter(function (x) { return x.id === id; })[0], st = el.querySelector(".fstatus"), tbl = tab === "msgs" ? "contact_messages" : "leads";
        var wa = el.querySelector("[data-wa]"), waIn = el.querySelector('[data-f="wa"]');
        waIn.addEventListener("input", function () { var u = waUrl(r, waIn.value); wa.hidden = !u; wa.href = u || "#"; });
        el.querySelector("[data-s]").onclick = function () {
          SB.send("PATCH", tbl + "?id=eq." + encodeURIComponent(id), { status: el.querySelector('[data-f="status"]').value, notes: el.querySelector('[data-f="notes"]').value }, "return=minimal")
            .then(function () { st.textContent = L.saved; st.className = "fstatus ok"; }).catch(function () { st.textContent = L.failed; st.className = "fstatus err"; });
        };
        el.querySelector("[data-d]").onclick = function () {
          if (!confirm(L.delAsk)) return;
          SB.send("DELETE", tbl + "?id=eq." + encodeURIComponent(id), null, "return=minimal").then(function () { rows = rows.filter(function (x) { return x.id !== id; }); draw(); counts(); })
            .catch(function () { st.textContent = L.failed; st.className = "fstatus err"; });
        };
        el.querySelector('[data-f="status"]').addEventListener("change", function () { /* saved with the Save button */ });
      });
    }
    var cnt = { msgs: 0, leads: 0 };
    function counts() { box.querySelector("#ibC" + (tab === "msgs" ? 1 : 2)).textContent = rows.length ? "(" + rows.length + ")" : ""; }
    function load() {
      var tbl = tab === "msgs" ? "contact_messages" : "leads";
      list.innerHTML = '<p class="muted">' + esc(L.load) + "</p>";
      SB.rest(tbl + "?select=*&order=created_at.desc&limit=200").then(function (d) { rows = d || []; draw(); counts(); })
        .catch(function () { list.innerHTML = '<p class="fstatus err" role="alert">' + esc(L.err) + "</p>"; });
    }
    [].forEach.call(box.querySelectorAll(".an-b"), function (b) {
      b.onclick = function () { tab = b.getAttribute("data-t"); [].forEach.call(box.querySelectorAll(".an-b"), function (x) { x.setAttribute("aria-pressed", String(x === b)); }); box.querySelector("#ibC1").textContent = ""; box.querySelector("#ibC2").textContent = ""; load(); };
    });
    box.querySelector("#ibQ").addEventListener("input", function (e) { q = e.target.value; draw(); });
    load();
  } };
})();
