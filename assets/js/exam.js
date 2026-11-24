/* Quizzes and the final exam for live courses. Grading is done by the server (Supabase), never here.
   The anti-copy rules below are a deterrent only; the server records what happened and flags the attempt for review. */
(() => {
"use strict";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const X = {
  fa: { h: "آزمون‌ها و گواهی", quiz: "آزمونک", after: "بعد از درس", final: "آزمون پایانی", start: "شروع", again: "دوباره", lockQ: "اول درس‌ها را کامل کن", lockF: "بعد از تمام شدن همه درس‌ها باز می‌شود",
    q: "سؤال", written: "پاسخ تشریحی را اینجا بنویس", submit: "ارسال پاسخ‌ها", leave: "خروج (بعداً ادامه می‌دهم)", leaveAsk: "از آزمون خارج می‌شوی؟ پاسخ‌هایت ذخیره نمی‌شود، ولی می‌توانی دوباره شروع کنی.",
    left: "زمان باقی‌مانده", unans: "به بعضی سؤال‌ها جواب نداده‌ای. بازهم ارسال شود؟", sending: "در حال ارسال…", score: "نمره", pass: "قبول شدی", fail: "این بار قبول نشدی", retry: "می‌توانی دوباره امتحان کنی.",
    cert: "گواهی پایان دوره", code: "کد گواهی", view: "دیدن و چاپ گواهی", pend: "پاسخ‌های تشریحی تو برای بررسی ارسال شد. بعد از تأیید، گواهی همین‌جا ظاهر می‌شود.",
    pendNote: "منتظر بررسی استاد", close: "بستن", rules: "قوانین: کپی، پیست، انتخاب متن و تغییر تب ممنوع است و ثبت می‌شود. تقلب باعث بررسی دستی می‌شود.",
    right: "درست", wrong: "غلط", yours: "پاسخ تو", ans: "پاسخ درست", none: "هنوز سؤالی برای این بخش اضافه نشده.", noSql: "آزمون هنوز فعال نشده است.",
    e_enr: "اول در دوره ثبت‌نام کن.", e_les: "اول درس‌ها را کامل کن.", e_left: "فرصت‌های آزمون تمام شده است.", e_wait: "آزمون قبلی هنوز در انتظار بررسی است.", e_done: "گواهی این دوره را قبلاً گرفته‌ای.", e_gen: "نشد. دوباره امتحان کن.",
    ok: "فعال", att: "نمره آخرین آزمون", rev: "در انتظار بررسی" },
  en: { h: "Quizzes and certificate", quiz: "Quiz", after: "after lesson", final: "Final exam", start: "Start", again: "Retry", lockQ: "Finish the lessons first", lockF: "Opens when all lessons are completed",
    q: "Question", written: "Write your answer here", submit: "Submit answers", leave: "Leave (I will continue later)", leaveAsk: "Leave the exam? Your answers will not be saved, but you can start again.",
    left: "Time left", unans: "Some questions are unanswered. Submit anyway?", sending: "Sending…", score: "Score", pass: "You passed", fail: "You did not pass this time", retry: "You can try again.",
    cert: "Course completion certificate", code: "Certificate code", view: "View and print certificate", pend: "Your written answers were sent for review. After approval the certificate appears here.",
    pendNote: "Waiting for review", close: "Close", rules: "Rules: copy, paste, text selection and switching tabs are not allowed and are recorded. Cheating leads to manual review.",
    right: "Correct", wrong: "Wrong", yours: "Your answer", ans: "Correct answer", none: "No questions have been added for this part yet.", noSql: "The exam is not enabled yet.",
    e_enr: "Enroll in the course first.", e_les: "Finish the lessons first.", e_left: "No exam attempts left.", e_wait: "Your previous exam is still waiting for review.", e_done: "You already have this course's certificate.", e_gen: "That did not work. Try again.",
    ok: "Active", att: "Last exam score", rev: "Waiting for review" }
};
const MAP = [["not enrolled", "e_enr"], ["finish all lessons", "e_les"], ["finish the lessons", "e_les"], ["no attempts left", "e_left"], ["waiting for review", "e_wait"], ["already certified", "e_done"], ["no questions yet", "none"]];

window.__exam = { mount(o) {
  const { root, course, lessons, prog, SB, ttl, reload } = o, L = X[o.lang === "fa" ? "fa" : "en"];
  const done = i => !!(prog[lessons[i].id] && prog[lessons[i].id].completed);
  const doneTo = n => lessons.slice(0, n).every((l, i) => done(i));
  const all = lessons.length > 0 && doneTo(lessons.length);
  const holder = document.createElement("section"); holder.className = "exs"; holder.id = "lexam"; root.appendChild(holder);
  const why = e => { const m = String((e && e.j && (e.j.message || e.j.hint)) || ""); const hit = MAP.find(x => m.toLowerCase().includes(x[0])); if (hit) return L[hit[1]]; if (e && e.status === 404) return L.noSql; return L.e_gen; };
  const fmt = d => { try { return new Date(d).toLocaleDateString(o.lang === "fa" ? "fa-AF-u-ca-gregory" : "en-GB", { year: "numeric", month: "long", day: "numeric" }); } catch (e) { return ""; } };

  async function paint() {
    let cert = null, last = null;
    try { cert = (await SB.rest(`certificates?course_id=eq.${encodeURIComponent(course)}&select=code,issued_at,revoked`))[0] || null; } catch (e) {}
    try { last = (await SB.rest(`attempts?course_id=eq.${encodeURIComponent(course)}&kind=eq.final&submitted_at=not.is.null&select=score_percent,passed,pending_review&order=submitted_at.desc&limit=1`))[0] || null; } catch (e) {}
    const rows = [];
    for (let k = 2; k <= lessons.length; k += 2) {
      const ok = doneTo(k);
      rows.push(`<div class="exr${ok ? "" : " lk"}"><span class="exn">${esc(L.quiz)}</span><span class="ext">${esc(L.after)} ${k}</span>${ok ? `<button type="button" class="btn" data-q="${k}">${esc(L.start)}</button>` : `<span class="exl">${esc(L.lockQ)}</span>`}</div>`);
    }
    let fin;
    if (cert) fin = `<div class="exr ok"><span class="exn">${esc(L.cert)}</span><span class="ext" dir="ltr">${esc(cert.code)}${cert.revoked ? " (revoked)" : ""} · ${esc(fmt(cert.issued_at))}</span><a class="btn go" href="verify.html?code=${encodeURIComponent(cert.code)}">${esc(L.view)}</a></div>`;
    else if (last && last.pending_review) fin = `<div class="exr"><span class="exn">${esc(L.final)}</span><span class="ext">${esc(L.pendNote)}</span><span class="exl">${esc(L.rev)}</span></div>`;
    else fin = `<div class="exr${all ? "" : " lk"}"><span class="exn">${esc(L.final)}</span><span class="ext">${last ? esc(L.att) + ": " + esc(last.score_percent) + "%" : ""}</span>${all ? `<button type="button" class="btn go" data-f="1">${esc(last ? L.again : L.start)}</button>` : `<span class="exl">${esc(L.lockF)}</span>`}</div>`;
    holder.innerHTML = `<h3>${esc(L.h)}</h3><p class="muted exrules">${esc(L.rules)}</p><div class="extab">${rows.join("")}${fin}</div><p class="fstatus" id="exmsg" role="status"></p>`;
    holder.querySelectorAll("[data-q]").forEach(b => b.onclick = () => run(parseInt(b.dataset.q, 10), b));
    holder.querySelectorAll("[data-f]").forEach(b => b.onclick = () => run(null, b));
  }

  async function run(after, btn) {
    const msg = holder.querySelector("#exmsg"); btn.disabled = true; msg.textContent = L.sending; msg.className = "fstatus";
    let row;
    try { const r = await SB.send("POST", "rpc/start_exam", { p_course: course, p_after: after }); row = Array.isArray(r) ? r[0] : r; }
    catch (e) { msg.textContent = why(e); msg.className = "fstatus err"; btn.disabled = false; return; }
    msg.textContent = ""; btn.disabled = false;
    const Q = row.questions || [], aid = row.attempt_id, mins = row.minutes || 0;
    if (!Q.length) { msg.textContent = L.none; return; }
    let over = document.createElement("div"); over.className = "exm"; over.setAttribute("role", "dialog"); over.setAttribute("aria-modal", "true");
    const quiz = after != null, title = quiz ? `${L.quiz} · ${L.after} ${after}` : L.final;
    over.innerHTML = `<div class="exb"><header><h2>${esc(title)}</h2><span class="ext2" id="extm" dir="ltr" ${mins ? "" : "hidden"}></span></header>
      <p class="muted">${esc(L.rules)}</p><form id="exf" novalidate>${Q.map((q, i) => `<fieldset class="exq" data-id="${esc(q.id)}"><legend>${esc(L.q)} ${i + 1}</legend><p>${esc(ttl(q.prompt))}</p>${q.type === "written"
        ? `<textarea name="${esc(q.id)}" rows="5" maxlength="4000" placeholder="${esc(L.written)}" autocomplete="off" spellcheck="false"></textarea>`
        : (q.options || []).map(op => `<label class="exo"><input type="radio" name="${esc(q.id)}" value="${esc(op.id)}"><span>${esc(ttl(op.label))}</span></label>`).join("")}</fieldset>`).join("")}
      <div class="exa"><button type="submit" class="btn go" id="exs">${esc(L.submit)}</button><button type="button" class="btn" id="exx">${esc(L.leave)}</button></div><p class="fstatus" id="exst" role="status"></p></form></div>`;
    document.body.appendChild(over); document.documentElement.classList.add("exm-on");
    const f = over.querySelector("#exf"), st = over.querySelector("#exst"); let fin = false, tm = 0, sent = 0; const lastLog = {};
    const log = k => { const n = Date.now(); if (fin || (lastLog[k] && n - lastLog[k] < 4000)) return; lastLog[k] = n; SB.send("POST", "rpc/log_integrity", { p_attempt: aid, p_kind: k }).catch(() => {}); };
    const inTa = e => e.target && e.target.tagName === "TEXTAREA";
    const block = k => e => { if (k === "contextmenu" || k === "select" || !inTa(e) || k === "paste" || k === "copy" || k === "cut") { e.preventDefault(); log(k); } };
    const evs = { copy: block("copy"), cut: block("cut"), paste: block("paste"), contextmenu: block("contextmenu"), selectstart: e => { if (!inTa(e)) e.preventDefault(); }, dragstart: e => e.preventDefault(),
      keydown: e => { if ((e.ctrlKey || e.metaKey) && /^[cvxapsu]$/i.test(e.key)) { if (/^[cxv]$/i.test(e.key) || !inTa(e)) { e.preventDefault(); log(/^v$/i.test(e.key) ? "paste" : /^x$/i.test(e.key) ? "cut" : /^c$/i.test(e.key) ? "copy" : "select"); } } } };
    Object.keys(evs).forEach(k => over.addEventListener(k, evs[k]));
    const vis = () => { if (document.hidden) log("tab_hidden"); }, blr = () => log("blur");
    document.addEventListener("visibilitychange", vis); window.addEventListener("blur", blr);
    const cleanup = () => { fin = true; clearInterval(tm); document.removeEventListener("visibilitychange", vis); window.removeEventListener("blur", blr); document.documentElement.classList.remove("exm-on"); };
    const close = () => { cleanup(); over.remove(); paint(); if (reload) reload(); };
    const val = () => { const a = {}; Q.forEach(q => { if (q.type === "written") a[q.id] = (f.elements[q.id].value || "").trim(); else { const c = f.querySelector(`input[name="${q.id}"]:checked`); if (c) a[q.id] = c.value; } }); return a; };
    const send = async force => {
      if (sent) return; const a = val();
      if (!force && Object.keys(a).filter(k => a[k]).length < Q.length && !confirm(L.unans)) return;
      sent = 1; over.querySelector("#exs").disabled = true; st.textContent = L.sending; clearInterval(tm);
      try { const r = await SB.send("POST", "rpc/submit_exam", { p_attempt: aid, p_answers: a }); const x = Array.isArray(r) ? r[0] : r; result(x, a); }
      catch (e) { sent = 0; over.querySelector("#exs").disabled = false; st.textContent = why(e); st.className = "fstatus err"; }
    };
    const result = (x, a) => {
      fin = true; const okq = x.passed;
      let h = `<h2>${esc(title)}</h2><p class="exres ${okq ? "yes" : "no"}"><b>${esc(L.score)}: ${esc(x.score_percent)}%</b> · ${esc(okq ? L.pass : L.fail)}</p>`;
      if (quiz) {
        const key = x.answers || {};
        h += Q.filter(q => q.type !== "written").map((q, i) => { const mine = a[q.id], good = key[q.id], lab = id => { const op = (q.options || []).find(z => z.id === id); return op ? ttl(op.label) : "—"; };
          return `<div class="exq ${mine === good ? "yes" : "no"}"><p>${esc(ttl(q.prompt))}</p><p>${esc(mine === good ? L.right : L.wrong)} · ${esc(L.yours)}: ${esc(lab(mine))}${mine === good ? "" : ` · ${esc(L.ans)}: ${esc(lab(good))}`}</p></div>`; }).join("");
      } else if (x.certificate_code) h += `<p><b>${esc(L.cert)}</b></p><p dir="ltr" class="excode">${esc(x.certificate_code)}</p><p><a class="btn go" href="verify.html?code=${encodeURIComponent(x.certificate_code)}">${esc(L.view)}</a></p>`;
      else if (x.pending) h += `<p>${esc(L.pend)}</p>`;
      else h += `<p>${esc(L.retry)}</p>`;
      h += `<p><button type="button" class="btn go" id="exc">${esc(L.close)}</button></p>`;
      over.querySelector(".exb").innerHTML = h; over.querySelector("#exc").onclick = close; over.querySelector("#exc").focus();
    };
    f.addEventListener("submit", e => { e.preventDefault(); send(false); });
    over.querySelector("#exx").onclick = () => { if (confirm(L.leaveAsk)) close(); };
    if (mins) { const end = Date.now() + mins * 60000, el = over.querySelector("#extm"); const tick = () => { const s = Math.max(0, Math.round((end - Date.now()) / 1000)); el.textContent = L.left + " " + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); if (s <= 0) { clearInterval(tm); send(true); } }; tick(); tm = setInterval(tick, 1000); }
    over.querySelector(".exq input,.exq textarea").focus();
  }
  paint();
} };
})();
