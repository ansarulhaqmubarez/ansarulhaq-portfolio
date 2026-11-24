/* brief.js: "Start a project" wizard. Builds a ready message from three quick steps and hands it to WhatsApp or e-mail
   with the visitor's own click. Nothing is stored or sent by the site itself. Contact data comes from window.SITE. */
(function () {
  "use strict";
  var S = window.SITE || {}, R = document.documentElement;
  var fa = function () { return R.lang === "fa"; };
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var TXT = {
    fa: { t: "شروع پروژه", s: ["نوع کار", "زمان", "جزئیات"], q: ["چه کاری می‌خواهی؟", "چه زمانی لازم داری؟", "کمی بیشتر بگو"],
      svc: ["فیلم‌سازی و تدوین ویدیو", "طراحی گرافیک و برند", "وب‌سایت و برنامه‌نویسی", "آموزش و مشاوره"], when: ["فوری (تا یک هفته)", "۲ تا ۴ هفته", "زمان انعطاف‌پذیر است"],
      nm: "نام تو", ds: "ایده یا توضیح کوتاه پروژه", next: "بعدی", back: "قبلی", wa: "ارسال با واتس‌اپ", em: "ارسال با ایمیل", cp: "کپی متن", cl: "بستن", ok: "کپی شد ✓",
      hi: "سلام انصارالحق، می‌خواهم دربارهٔ یک پروژه صحبت کنم.", L: ["نوع کار", "زمان", "نام", "توضیح"], need: "یک گزینه را انتخاب کن." },
    en: { t: "Start a project", s: ["Type", "Timing", "Details"], q: ["What do you need?", "When do you need it?", "Tell me a bit more"],
      svc: ["Filmmaking and video editing", "Graphic design and branding", "Website and programming", "Teaching and consulting"], when: ["Urgent (within a week)", "2 to 4 weeks", "Flexible"],
      nm: "Your name", ds: "Your idea or a short description", next: "Next", back: "Back", wa: "Send on WhatsApp", em: "Send by e-mail", cp: "Copy text", cl: "Close", ok: "Copied ✓",
      hi: "Hello Ansarulhaq, I would like to talk about a project.", L: ["Type", "Timing", "Name", "Description"], need: "Please choose one." }
  };
  var dlg, st;
  function wa() { var p = (S.phones || []).filter(function (x) { return x && x.wa && /^\+?\d{7,15}$/.test(x.n || ""); })[0]; return p ? p.n.replace(/\D/g, "") : ""; }
  function msg() { var T = TXT[fa() ? "fa" : "en"]; var l = [T.hi, ""]; l.push(T.L[0] + ": " + (st.svc >= 0 ? T.svc[st.svc] : "-")); l.push(T.L[1] + ": " + (st.when >= 0 ? T.when[st.when] : "-")); if (st.name) l.push(T.L[2] + ": " + st.name); if (st.desc) l.push(T.L[3] + ": " + st.desc); return l.join("\n"); }
  function draw() {
    var T = TXT[fa() ? "fa" : "en"]; dlg.textContent = ""; dlg.setAttribute("dir", fa() ? "rtl" : "ltr");
    var box = el("div", "bf"); var x = el("button", "bf-x", "×"); x.type = "button"; x.setAttribute("aria-label", T.cl); x.onclick = function () { dlg.close(); }; box.appendChild(x);
    box.appendChild(el("h2", "bf-t", T.t));
    var dots = el("ol", "bf-d"); T.s.forEach(function (s, i) { var li = el("li", i === st.step ? "on" : i < st.step ? "done" : "", s); dots.appendChild(li); }); box.appendChild(dots);
    box.appendChild(el("p", "bf-q", T.q[st.step]));
    var body = el("div", "bf-b"); var err = el("p", "bf-e"); err.setAttribute("role", "alert");
    if (st.step < 2) {
      var key = st.step ? "when" : "svc"; var grp = el("div", "bf-o"); grp.setAttribute("role", "radiogroup");
      T[key].forEach(function (o, i) { var b = el("button", "bf-op" + (st[key === "svc" ? "svc" : "when"] === i ? " sel" : ""), o); b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", st[key] === i ? "true" : "false");
        b.onclick = function () { st[key] = i; draw(); }; grp.appendChild(b); });
      body.appendChild(grp);
    } else {
      var n = el("input", "bf-i"); n.type = "text"; n.maxLength = 60; n.placeholder = T.nm; n.value = st.name; n.setAttribute("aria-label", T.nm); n.oninput = function () { st.name = n.value.trim(); pv.textContent = msg(); };
      var d = el("textarea", "bf-i"); d.rows = 4; d.maxLength = 600; d.placeholder = T.ds; d.value = st.desc; d.setAttribute("aria-label", T.ds); d.oninput = function () { st.desc = d.value.trim(); pv.textContent = msg(); };
      var pv = el("pre", "bf-pv", msg()); body.appendChild(n); body.appendChild(d); body.appendChild(pv);
    }
    body.appendChild(err); box.appendChild(body);
    var ft = el("div", "bf-f");
    if (st.step > 0) { var bk = el("button", "bf-b2", T.back); bk.type = "button"; bk.onclick = function () { st.step--; draw(); }; ft.appendChild(bk); }
    if (st.step < 2) { var nx = el("button", "bf-go", T.next); nx.type = "button"; nx.onclick = function () { var v = st.step ? st.when : st.svc; if (v < 0) { err.textContent = T.need; return; } st.step++; draw(); }; ft.appendChild(nx); }
    else {
      var num = wa(); if (num) { var a = el("a", "bf-go", T.wa); a.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(msg()); a.target = "_blank"; a.rel = "noopener noreferrer"; a.addEventListener("click", function () { a.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(msg()); }); ft.appendChild(a); }
      if (S.contactEmail) { var m = el("a", "bf-b2", T.em); m.href = "mailto:" + S.contactEmail; m.addEventListener("click", function () { m.href = "mailto:" + S.contactEmail + "?subject=" + encodeURIComponent(T.t) + "&body=" + encodeURIComponent(msg()); }); ft.appendChild(m); }
      var c = el("button", "bf-b2", T.cp); c.type = "button"; c.onclick = function () { (navigator.clipboard ? navigator.clipboard.writeText(msg()) : Promise.reject()).then(function () { c.textContent = T.ok; }, function () {}); }; ft.appendChild(c);
    }
    box.appendChild(ft); dlg.appendChild(box);
  }
  function open() { if (!dlg) { dlg = el("dialog", "bf-dlg"); dlg.setAttribute("aria-label", "Start a project"); document.body.appendChild(dlg); dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); }
    st = { step: 0, svc: -1, when: -1, name: "", desc: "" }; draw(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
  document.addEventListener("click", function (e) { var t = e.target.closest && e.target.closest("[data-brief],#cta2 a,.cta2 a"); if (!t) return; e.preventDefault(); open(); });
})();
