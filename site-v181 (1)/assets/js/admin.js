/* Admin panel (staff only): questions, written-answer review, certificates. All permissions are enforced by Supabase (RLS + RPC), not here. */
(() => {
"use strict";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const X = {
  fa: { t: "پنل مدیر", no: "این صفحه فقط برای مدیر است.", load: "در حال بارگذاری…", q: "سؤال‌ها", add: "افزودن سؤال", course: "دوره", kind: "نوع", quiz: "آزمونک (بعد از درس)", final: "آزمون پایانی", after: "بعد از درس شماره", qtype: "شکل سؤال", mcq: "چهار گزینه‌ای", written: "تشریحی", pfa: "متن سؤال (فارسی)", pen: "متن سؤال (انگلیسی، اختیاری)", opt: "گزینه", ofa: "فارسی", oen: "انگلیسی", right: "درست", save: "ذخیره سؤال", saved: "سؤال ذخیره شد.", err: "نشد. دوباره امتحان کن.", need: "متن سؤال و دو گزینه (یکی درست) لازم است.",
    list: "سؤال‌های این دوره", del: "حذف", delAsk: "این سؤال حذف شود؟", none: "هنوز سؤالی نیست.", rev: "آزمون‌های در انتظار بررسی", norev: "چیزی برای بررسی نیست.", approve: "تأیید و صدور گواهی", reject: "رد", score: "نمره گزینه‌ای", flags: "رویدادهای مشکوک", ans: "پاسخ",
    mis: "آمار مدیریتی (داده واقعی)", mL: "دانشجو", mE: "ثبت‌نام در دوره", mD: "درس‌های کامل‌شده", mA: "آزمون پایانی ثبت‌شده", mP: "درصد قبولی آزمون پایانی", mC: "گواهی معتبر", mR: "در انتظار بررسی", cty: "کشورها", gen: "جنسیت", edu: "تحصیلات", male: "مرد", female: "زن", unk: "نامشخص", lrn: "دانشجویان تازه", joined: "تاریخ ثبت‌نام", country: "کشور", certs: "گواهی‌ها", revoke: "باطل کن", restore: "دوباره معتبر کن", revoked: "باطل", valid: "معتبر", code: "کد", student: "دانشجو", date: "تاریخ", anyc: "هنوز گواهی صادر نشده.", fin: "پایانی", qz: "آزمونک" },
  en: { t: "Admin panel", no: "This page is for admins only.", load: "Loading…", q: "Questions", add: "Add a question", course: "Course", kind: "Type", quiz: "Quiz (after a lesson)", final: "Final exam", after: "After lesson number", qtype: "Format", mcq: "Multiple choice", written: "Written", pfa: "Question text (Persian)", pen: "Question text (English, optional)", opt: "Option", ofa: "Persian", oen: "English", right: "Correct", save: "Save question", saved: "Question saved.", err: "That did not work. Try again.", need: "A question text and two options (one correct) are needed.",
    list: "Questions in this course", del: "Delete", delAsk: "Delete this question?", none: "No questions yet.", rev: "Exams waiting for review", norev: "Nothing to review.", approve: "Approve and issue certificate", reject: "Reject", score: "Multiple-choice score", flags: "Suspicious events", ans: "Answer",
    mis: "Management stats (real data)", mL: "Learners", mE: "Course enrolments", mD: "Lessons completed", mA: "Final exams taken", mP: "Final exam pass rate", mC: "Valid certificates", mR: "Waiting for review", cty: "Countries", gen: "Gender", edu: "Education", male: "Male", female: "Female", unk: "Unknown", lrn: "Newest learners", joined: "Joined", country: "Country", certs: "Certificates", revoke: "Revoke", restore: "Make valid again", revoked: "Revoked", valid: "Valid", code: "Code", student: "Student", date: "Date", anyc: "No certificates issued yet.", fin: "Final", qz: "Quiz" }
};
window.__admin = { async mount(o) {
  const { root, SB, lang, S } = o, L = X[lang === "fa" ? "fa" : "en"];
  const ttl = v => (v && typeof v === "object") ? (v[lang] || v.en || v.fa || "") : (v || "");
  const say = (id, m, k) => { const n = root.querySelector(id); if (n) { n.textContent = m; n.className = "fstatus " + (k || ""); } };
  root.innerHTML = `<h1 class="ph1">${esc(L.t)}</h1><p class="muted" role="status">${esc(L.load)}</p>`;
  const s = SB.get(); if (!s) { location.replace("auth.html"); return; }
  let me; try { me = (await SB.rest(`profiles?select=role&id=eq.${s.id}`))[0]; } catch (e) {}
  if (!me || !/^(admin|super_admin)$/.test(me.role)) { root.innerHTML = `<h1 class="ph1">${esc(L.t)}</h1><p class="fstatus err" role="alert">${esc(L.no)}</p>`; return; }
  let courses = [], cur = "";
  try { courses = await SB.rest("courses?select=id,title&order=created_at"); } catch (e) {}
  cur = courses[0] ? courses[0].id : "";

  const shell = () => {
    root.innerHTML = `<h1 class="ph1">${esc(L.t)}</h1>
    <section class="ac-sec" id="inbox"><h2>${esc(lang === "fa" ? "صندوق پیام‌ها" : "Inbox")}</h2><div id="adIn"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "آمار و تحلیل بازدید" : "Visit analytics")}</h2><div id="adAn"></div></section>
    <section class="ac-sec" id="cms"><h2>${esc(lang === "fa" ? "ویرایش متن‌ها و اطلاعات تماس" : "Edit texts and contact details")}</h2><div id="adCms"></div></section>
    <section class="ac-sec" id="coursemgr"><h2>${esc(lang === "fa" ? "مدیریت دوره‌ها و درس‌ها" : "Courses and lessons manager")}</h2><div id="adCourses"></div></section>
    <section class="ac-sec" id="resume"><h2>${esc(lang === "fa" ? "معمار رزومه (تحصیلات و سوابق کاری)" : "Resume architect (education and work)")}</h2><div id="adResume"></div></section>
    <section class="ac-sec" id="studio"><h2>${esc(lang === "fa" ? "استودیوی پروژه‌ها و گالری" : "Projects studio and gallery")}</h2><div id="adStudio"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "بررسی پیش از انتشار" : "Pre-launch check")}</h2><div id="adCk"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "دانشجویان" : "Students")}</h2><div id="adStu"></div></section>
    <section class="ac-sec" id="pagesec"><h2>${esc(lang === "fa" ? "ساخت صفحهٔ دلخواه" : "Page builder")}</h2><div id="adPages"></div></section>
    <section class="ac-sec" id="ftsec"><h2>${esc(lang === "fa" ? "لینک‌های فوتر" : "Footer links")}</h2><div id="adFooter"></div></section>
    <section class="ac-sec" id="llsec"><h2>${esc(lang === "fa" ? "لینک مطالعه و دانلود درس‌ها" : "Lesson study and download links")}</h2><div id="adLinks"></div></section>
    <section class="ac-sec" id="rlsec"><h2>${esc(lang === "fa" ? "ریلز (ویدیوهای کوتاه)" : "Reels (short videos)")}</h2><div id="adReels"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "خبرنامه (ایمیل‌ها)" : "Newsletter (emails)")}</h2><div id="adNews"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "نظرهای بازدیدکنندگان (تأیید برای نمایش)" : "Visitor feedback (approve to show)")}</h2><div id="adFeed"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "پشتیبان‌گیری و بازگردانی" : "Backup & restore")}</h2><div id="adBk"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "امنیت و محافظت از دوره‌ها" : "Learner protection")}</h2><div id="adSec"></div></section>
    <section class="ac-sec"><h2>${esc(lang === "fa" ? "ظاهر و افکت‌ها" : "Look & effects")}</h2><div id="adDesign"></div></section>
    <section class="ac-sec"><h2>${esc(L.mis)}</h2><div id="adMis"></div></section>
    <section class="ac-sec"><h2>${esc(L.rev)}</h2><div id="adRev"></div></section>
    <section class="ac-sec"><h2>${esc(L.add)}</h2>
      <form id="adF" class="adf" novalidate>
        <label>${esc(L.course)}<select name="course">${courses.map(c => `<option value="${esc(c.id)}"${c.id === cur ? " selected" : ""}>${esc(ttl(c.title) || c.id)}</option>`).join("")}</select></label>
        <label>${esc(L.kind)}<select name="kind"><option value="quiz">${esc(L.quiz)}</option><option value="final">${esc(L.final)}</option></select></label>
        <label id="adAf">${esc(L.after)}<input name="after" type="number" min="1" max="200" value="2" dir="ltr"></label>
        <label>${esc(L.qtype)}<select name="qtype"><option value="mcq">${esc(L.mcq)}</option><option value="written">${esc(L.written)}</option></select></label>
        <label class="adw">${esc(L.pfa)}<textarea name="pfa" rows="2" maxlength="600"></textarea></label>
        <label class="adw">${esc(L.pen)}<textarea name="pen" rows="2" maxlength="600" dir="ltr"></textarea></label>
        <div class="adw" id="adOpts">${[1, 2, 3, 4].map(i => `<div class="ado"><label class="exo"><input type="radio" name="right" value="${i}"${i === 1 ? " checked" : ""}><span>${esc(L.right)} · ${esc(L.opt)} ${i}</span></label><input name="ofa${i}" placeholder="${esc(L.ofa)}" maxlength="300"><input name="oen${i}" placeholder="${esc(L.oen)}" maxlength="300" dir="ltr"></div>`).join("")}</div>
        <div class="adw"><button class="btn go" type="submit">${esc(L.save)}</button></div><p class="fstatus adw" id="adSt" role="status"></p>
      </form></section>
    <section class="ac-sec"><h2>${esc(L.list)}</h2><label class="adc">${esc(L.course)} <select id="adC">${courses.map(c => `<option value="${esc(c.id)}"${c.id === cur ? " selected" : ""}>${esc(ttl(c.title) || c.id)}</option>`).join("")}</select></label><div id="adQ"></div></section>
    <section class="ac-sec"><h2>${esc(L.certs)}</h2><div id="adCe"></div></section>`;
    if (window.__adInbox) window.__adInbox.mount(root.querySelector("#adIn"), { SB, lang, S });
    if (window.__adAnalytics) window.__adAnalytics.mount(root.querySelector("#adAn"), { SB, lang, S });
    if (window.__adCms) window.__adCms.mount(root.querySelector("#adCms"), { SB, lang, S });
    if (window.__adCourses) window.__adCourses.mount(root.querySelector("#adCourses"), { SB, lang, S });
    if (window.__adResume) window.__adResume.mount(root.querySelector("#adResume"), { SB, lang, S });
    if (window.__adStudio) window.__adStudio.mount(root.querySelector("#adStudio"), { SB, lang, S });
    if (window.__adCheck) window.__adCheck.mount(root.querySelector("#adCk"), { SB, lang, S });
    if (window.__adBackup) window.__adBackup.mount(root.querySelector("#adBk"), { SB, lang, S });
    if (window.__adStudents) window.__adStudents.mount(root.querySelector("#adStu"), { SB, lang, S });
    if (window.__adPages) window.__adPages.mount(root.querySelector("#adPages"), { SB, lang, S });
    if (window.__adFooter) window.__adFooter.mount(root.querySelector("#adFooter"), { SB, lang, S });
    if (window.__adLinks) window.__adLinks.mount(root.querySelector("#adLinks"), { SB, lang, S });
    if (window.__adReels) window.__adReels.mount(root.querySelector("#adReels"), { SB, lang, S });
    if (window.__adNews) window.__adNews.mount(root.querySelector("#adNews"), { SB, lang, S });
    if (window.__adFeed) window.__adFeed.mount(root.querySelector("#adFeed"), { SB, lang, S });
    if (window.__adDesign) window.__adDesign.mount(root.querySelector("#adDesign"), { SB, lang, S });
    if (window.__adSec) window.__adSec.mount(root.querySelector("#adSec"), { SB, lang, S });
    const f = root.querySelector("#adF"), sync = () => { root.querySelector("#adAf").hidden = f.elements.kind.value !== "quiz"; root.querySelector("#adOpts").hidden = f.elements.qtype.value !== "mcq"; };
    f.elements.kind.onchange = sync; f.elements.qtype.onchange = sync; sync();
    root.querySelector("#adC").onchange = e => { cur = e.target.value; qlist(); };
    f.addEventListener("submit", async e => { e.preventDefault();
      const v = n => (f.elements[n].value || "").trim(), qtype = v("qtype"), kind = v("kind");
      const prompt = {}; if (v("pfa")) prompt.fa = v("pfa"); if (v("pen")) prompt.en = v("pen");
      const opts = [1, 2, 3, 4].map(i => { const l = {}; if (v("ofa" + i)) l.fa = v("ofa" + i); if (v("oen" + i)) l.en = v("oen" + i); return { l, ok: f.elements.right.value === String(i) }; }).filter(x => Object.keys(x.l).length);
      if (!Object.keys(prompt).length || (qtype === "mcq" && (opts.length < 2 || !opts.some(x => x.ok)))) return say("#adSt", L.need, "err");
      try {
        const after = kind === "quiz" ? Math.max(1, parseInt(v("after"), 10) || 2) : null;
        const r = await SB.send("POST", "questions", { course_id: v("course"), kind, after_lesson: after, qtype, prompt }, "return=representation");
        const qid = r[0].id;
        if (qtype === "mcq") await SB.send("POST", "options", opts.map(x => ({ question_id: qid, label: x.l, is_correct: x.ok })), "return=minimal");
        say("#adSt", L.saved, "ok"); cur = v("course"); root.querySelector("#adC").value = cur; ["pfa", "pen"].forEach(n => f.elements[n].value = ""); for (let i = 1; i <= 4; i++) { f.elements["ofa" + i].value = ""; f.elements["oen" + i].value = ""; } qlist();
      } catch (x) { say("#adSt", L.err + (x.status ? " (" + x.status + ")" : ""), "err"); }
    });
  };

  async function qlist() {
    const box = root.querySelector("#adQ"); if (!box) return;
    try {
      const qs = await SB.rest(`questions?course_id=eq.${encodeURIComponent(cur)}&select=id,kind,after_lesson,qtype,prompt,options(label,is_correct)&order=kind,after_lesson,position`);
      box.innerHTML = qs.length ? `<ul class="adl">${qs.map(q => `<li><b>${esc(q.kind === "quiz" ? L.qz + " " + q.after_lesson : L.fin)}</b> · ${esc(q.qtype === "mcq" ? L.mcq : L.written)}<p>${esc(ttl(q.prompt))}</p>${q.qtype === "mcq" ? `<ol>${(q.options || []).map(op => `<li${op.is_correct ? ' class="adok"' : ""}>${esc(ttl(op.label))}${op.is_correct ? " ✓" : ""}</li>`).join("")}</ol>` : ""}<button type="button" class="btn" data-d="${esc(q.id)}">${esc(L.del)}</button></li>`).join("")}</ul>` : `<p class="muted">${esc(L.none)}</p>`;
      box.querySelectorAll("[data-d]").forEach(b => b.onclick = async () => { if (!confirm(L.delAsk)) return; try { await SB.send("DELETE", `questions?id=eq.${b.dataset.d}`, null, "return=minimal"); qlist(); } catch (e) { say("#adSt", L.err, "err"); } });
    } catch (e) { box.innerHTML = `<p class="fstatus err">${esc(L.err)}</p>`; }
  }

  async function reviews() {
    const box = root.querySelector("#adRev"); if (!box) return;
    try {
      const at = await SB.rest("attempts?pending_review=eq.true&select=id,user_id,course_id,score_percent,submitted_at&order=submitted_at");
      if (!at.length) { box.innerHTML = `<p class="muted">${esc(L.norev)}</p>`; return; }
      const ids = at.map(a => a.id).join(","), uids = [...new Set(at.map(a => a.user_id))].join(",");
      const [wa, pr, ev] = await Promise.all([SB.rest(`written_answers?attempt_id=in.(${ids})&select=attempt_id,question_id,body,questions(prompt)`), SB.rest(`profiles?id=in.(${uids})&select=id,full_name`), SB.rest(`integrity_events?attempt_id=in.(${ids})&select=attempt_id,kind`)]);
      box.innerHTML = at.map(a => `<article class="ac-card"><h3>${esc((pr.find(p => p.id === a.user_id) || {}).full_name || a.user_id)} · ${esc(a.course_id)}</h3><p>${esc(L.score)}: ${esc(a.score_percent)}% · ${esc(L.flags)}: ${ev.filter(x => x.attempt_id === a.id).length}</p>
        ${wa.filter(w => w.attempt_id === a.id).map(w => `<div class="exq"><p><b>${esc(ttl(w.questions && w.questions.prompt))}</b></p><p>${esc(L.ans)}: ${esc(w.body) || "—"}</p></div>`).join("")}
        <div class="exa"><button type="button" class="btn go" data-a="${esc(a.id)}" data-v="1">${esc(L.approve)}</button><button type="button" class="btn" data-a="${esc(a.id)}" data-v="0">${esc(L.reject)}</button></div></article>`).join("");
      box.querySelectorAll("[data-a]").forEach(b => b.onclick = async () => { b.disabled = true; try { await SB.send("POST", "rpc/review_attempt", { p_attempt: b.dataset.a, p_approve: b.dataset.v === "1" }); reviews(); certs(); } catch (e) { b.disabled = false; alert(L.err); } });
    } catch (e) { box.innerHTML = `<p class="fstatus err">${esc(L.err)}</p>`; }
  }

  async function certs() {
    const box = root.querySelector("#adCe"); if (!box) return;
    try {
      const cs = await SB.rest("certificates?select=code,user_id,course_id,full_name,issued_at,revoked&order=issued_at.desc&limit=100");
      box.innerHTML = cs.length ? `<table class="adt"><thead><tr><th>${esc(L.code)}</th><th>${esc(L.student)}</th><th>${esc(L.course)}</th><th>${esc(L.date)}</th><th></th></tr></thead><tbody>${cs.map(c => `<tr><td dir="ltr"><a href="verify.html?code=${encodeURIComponent(c.code)}">${esc(c.code)}</a></td><td>${esc(c.full_name)}</td><td>${esc(c.course_id)}</td><td dir="ltr">${esc(String(c.issued_at).slice(0, 10))}</td><td><button type="button" class="btn" data-c="${esc(c.code)}" data-r="${c.revoked ? 0 : 1}">${esc(c.revoked ? L.restore : L.revoke)}</button></td></tr>`).join("")}</tbody></table>` : `<p class="muted">${esc(L.anyc)}</p>`;
      box.querySelectorAll("[data-c]").forEach(b => b.onclick = async () => { b.disabled = true; try { await SB.send("PATCH", `certificates?code=eq.${encodeURIComponent(b.dataset.c)}`, { revoked: b.dataset.r === "1" }, "return=minimal"); certs(); } catch (e) { b.disabled = false; alert(L.err); } });
    } catch (e) { box.innerHTML = `<p class="fstatus err">${esc(L.err)}</p>`; }
  }

  async function mis() {
    const box = root.querySelector("#adMis"); if (!box) return;
    try {
      const [pr, en, ls, at, ce] = await Promise.all([SB.rest("profiles?select=full_name,country,gender,education,created_at,role&order=created_at.desc&limit=2000"), SB.rest("enrollments?select=course_id&limit=5000"), SB.rest("lesson_progress?select=completed&completed=eq.true&limit=20000"), SB.rest("attempts?select=kind,passed,pending_review&submitted_at=not.is.null&limit=5000").catch(() => []), SB.rest("certificates?select=revoked&limit=5000")]);
      const fin = at.filter(a => a.kind === "final" || a.kind == null), okf = fin.filter(a => a.passed).length, pend = at.filter(a => a.pending_review).length;
      const bars = (title, rows) => { const tot = rows.reduce((n, r) => n + r[1], 0) || 1; return `<div class="bt"><b style="font-size:16px">${esc(title)}</b>${rows.length ? rows.map(r => `<span>${esc(r[0])} · ${r[1]}<i class="mbar"><u style="width:${Math.round(r[1] * 100 / tot)}%"></u></i></span>`).join("") : "<span>—</span>"}</div>`; };
      const count = f => { const m = {}; pr.forEach(p => { const k = f(p) || L.unk; m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6); };
      box.innerHTML = `<div class="bento"><div class="bt"><b>${pr.length}</b><span>${esc(L.mL)}</span></div><div class="bt"><b>${en.length}</b><span>${esc(L.mE)}</span></div><div class="bt"><b>${ls.length}</b><span>${esc(L.mD)}</span></div><div class="bt"><b>${fin.length}</b><span>${esc(L.mA)}</span></div><div class="bt"><b>${fin.length ? Math.round(okf * 100 / fin.length) + "%" : "—"}</b><span>${esc(L.mP)}</span></div><div class="bt"><b>${ce.filter(c => !c.revoked).length}</b><span>${esc(L.mC)}</span></div><div class="bt"><b>${pend}</b><span>${esc(L.mR)}</span></div></div>
        <div class="bento" style="margin-top:12px">${bars(L.cty, count(p => p.country))}${bars(L.gen, count(p => ({ male: L.male, female: L.female }[p.gender])))}${bars(L.edu, count(p => p.education))}</div>
        <h3 style="margin-top:18px">${esc(L.lrn)}</h3><table class="adt"><thead><tr><th>${esc(L.student)}</th><th>${esc(L.country)}</th><th>${esc(L.joined)}</th></tr></thead><tbody>${pr.slice(0, 10).map(p => `<tr><td>${esc(p.full_name || "—")}</td><td>${esc(p.country || "—")}</td><td dir="ltr">${esc(String(p.created_at).slice(0, 10))}</td></tr>`).join("")}</tbody></table>`;
    } catch (e) { box.innerHTML = `<p class="fstatus err">${esc(L.err)}</p>`; }
  }

  shell(); mis(); qlist(); reviews(); certs();
} };
})();
