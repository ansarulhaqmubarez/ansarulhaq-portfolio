/* Course page: questions and answers (table course_questions, cms-13.sql). Students who are enrolled ask; the super admin answers in the admin panel. */
(function () {
  "use strict";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = {
    fa: { h: "پرسش و پاسخ", p: "سؤال دربارهٔ درس‌ها را اینجا بپرس. پاسخ را مدرس می‌نویسد.", ph: "سؤالت را بنویس (حداقل ۵ حرف)", all: "کل دوره", les: "درس", ask: "ارسال سؤال", none: "هنوز سؤالی نیست. اولین نفر باش.", ans: "پاسخ", wait: "در انتظار پاسخ", mine: "سؤال من", ok: "سؤال ثبت شد.", bad: "ثبت نشد. cms-13.sql در Supabase اجرا شده؟", short: "سؤال خیلی کوتاه است.", slow: "چند ثانیه صبر کن و دوباره بفرست.", del: "حذف سؤال من", askDel: "سؤالت حذف شود؟", load: "بارگذاری ناموفق. cms-13.sql اجرا شده؟" },
    en: { h: "Questions and answers", p: "Ask about the lessons here. The instructor writes the answers.", ph: "Write your question (at least 5 characters)", all: "Whole course", les: "Lesson", ask: "Send question", none: "No questions yet. Be the first.", ans: "Answer", wait: "Waiting for an answer", mine: "My question", ok: "Question sent.", bad: "Not sent. Was cms-13.sql run in Supabase?", short: "The question is too short.", slow: "Wait a few seconds and send again.", del: "Delete my question", askDel: "Delete your question?", load: "Could not load. Was cms-13.sql run?" }
  };
  window.__qa = { mount: function (o) {
    var SB = o.SB, L = T[o.lang === "fa" ? "fa" : "en"], ses = SB.get(), q = encodeURIComponent(o.course), host = o.root; if (!ses || !host) return;
    var old = host.querySelector("#qaBox"); if (old) old.remove();
    var box = document.createElement("section"); box.id = "qaBox"; box.className = "qa"; box.setAttribute("aria-labelledby", "qaH"); host.appendChild(box);
    var rows = [], msg = "", last = 0, lt = {}; (o.lessons || []).forEach(function (l, i) { lt[l.id] = (L.les + " " + (i + 1) + ": " + o.ttl(l.title)); });
    function draw() {
      box.innerHTML = '<h2 id="qaH">' + esc(L.h) + '</h2><p class="muted">' + esc(L.p) + "</p>" + (msg ? '<p class="fstatus" role="status">' + esc(msg) + "</p>" : "") +
        '<form id="qaF" class="qa-f"><label class="sr-only" for="qaL">' + esc(L.les) + '</label><select id="qaL" name="l"><option value="">' + esc(L.all) + "</option>" + (o.lessons || []).map(function (l) { return '<option value="' + esc(l.id) + '">' + esc(lt[l.id]) + "</option>"; }).join("") + "</select>" +
        '<label class="sr-only" for="qaT">' + esc(L.ph) + '</label><textarea id="qaT" name="b" rows="3" maxlength="1000" placeholder="' + esc(L.ph) + '" required></textarea><button class="btn go" type="submit">' + esc(L.ask) + "</button></form>" +
        (rows.length ? '<ul class="qa-l">' + rows.map(function (r) {
          return '<li class="qa-i"><p class="qa-m muted">' + esc((r.author_name || "") + (r.lesson_id && lt[r.lesson_id] ? " · " + lt[r.lesson_id] : "")) + (r.user_id === ses.id ? ' <span class="pill">' + esc(L.mine) + "</span>" : "") + "</p><p>" + esc(r.body) + "</p>" +
            (r.answer ? '<p class="qa-a"><b>' + esc(L.ans) + ":</b> " + esc(r.answer) + "</p>" : '<p class="muted">' + esc(L.wait) + "</p>") +
            (r.user_id === ses.id ? '<button type="button" class="btn" data-d="' + esc(r.id) + '">' + esc(L.del) + "</button>" : "") + "</li>";
        }).join("") + "</ul>" : '<p class="muted">' + esc(L.none) + "</p>");
    }
    function load() { SB.rest("course_questions?course_id=eq." + q + "&select=id,lesson_id,user_id,author_name,body,answer,created_at&order=created_at.desc&limit=100").then(function (r) { rows = r || []; draw(); }).catch(function () { rows = []; msg = L.load; draw(); }); }
    box.addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target, b = f.b.value.trim(); msg = "";
      if (b.length < 5) { msg = L.short; return draw(); }
      if (Date.now() - last < 15000) { msg = L.slow; return draw(); }
      last = Date.now(); var nm = String(ses.name || ses.email || "").split(/[\s@]/)[0].slice(0, 30);
      SB.send("POST", "course_questions", { course_id: o.course, lesson_id: f.l.value || null, user_id: ses.id, author_name: nm, body: b }, "return=minimal").then(function () { msg = L.ok; load(); }).catch(function () { msg = L.bad; draw(); });
    });
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-d]"); if (!b || !window.confirm(L.askDel)) return;
      SB.send("DELETE", "course_questions?id=eq." + encodeURIComponent(b.dataset.d)).then(load).catch(function () { msg = L.bad; draw(); });
    });
    load();
  } };
})();
