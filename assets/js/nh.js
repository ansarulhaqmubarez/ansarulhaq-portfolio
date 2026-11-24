/* New home page behaviour: language, theme, drawer, search, course filter, contact form. No inline code (CSP). */
(function () {
  "use strict";
  var S = window.SITE || {}, R = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  var lang = R.lang === "en" ? "en" : "fa";

  function applyLang(l) {
    lang = l; R.lang = l; R.dir = l === "fa" ? "rtl" : "ltr";
    $$("[data-en]").forEach(function (e) { if (e.dataset.fa == null) e.dataset.fa = e.textContent; e.textContent = l === "en" ? e.dataset.en : e.dataset.fa; });
    $$("[data-en-aria]").forEach(function (e) { if (e.dataset.faAria == null) e.dataset.faAria = e.getAttribute("aria-label") || ""; e.setAttribute("aria-label", l === "en" ? e.dataset.enAria : e.dataset.faAria); });
    $$("[data-en-alt]").forEach(function (e) { if (e.dataset.faAlt == null) e.dataset.faAlt = e.getAttribute("alt") || ""; e.setAttribute("alt", l === "en" ? e.dataset.enAlt : e.dataset.faAlt); });
    $$("[data-en-ph]").forEach(function (e) { if (e.dataset.faPh == null) e.dataset.faPh = e.getAttribute("placeholder") || ""; e.setAttribute("placeholder", l === "en" ? e.dataset.enPh : e.dataset.faPh); });
    var b = $("#langBtn"); if (b) { b.textContent = l === "fa" ? "EN" : "فا"; b.setAttribute("aria-label", l === "fa" ? "English" : "فارسی"); }
    document.title = l === "fa" ? "آکادمی سینه‌کد | انصارالحق مبارز" : "CineCode Academy | Ansarulhaq Mubarez";
    store("am-lang", l); if (l === "en") store("am-ps", "0");
    drawList(); if (typeof drawMq === "function" && $("#mqT")) drawMq();
  }
  function applyTheme(t) { R.dataset.theme = t; store("am-mode", t); var m = $(".t-moon"), s = $(".t-sun"); if (m && s) { m.classList.toggle("hidden", t === "dark"); s.classList.toggle("hidden", t !== "dark"); } var mc = $('meta[name="theme-color"]'); if (mc) mc.content = t === "dark" ? "#07172D" : "#102B55"; }

  /* drawer */
  var dr = $("#drawer"), mb = $("#menuBtn");
  function drawer(open) { dr.classList.toggle("hidden", !open); mb.setAttribute("aria-expanded", open ? "true" : "false"); document.body.style.overflow = open ? "hidden" : ""; if (open) $("#drawerX").focus(); else mb.focus(); }
  mb.onclick = function () { drawer(true); }; $("#drawerX").onclick = function () { drawer(false); }; $("#drawerBg").onclick = function () { drawer(false); };
  $$(".dl, #drawer .btn-p").forEach(function (a) { a.addEventListener("click", function () { drawer(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !dr.classList.contains("hidden")) drawer(false);
    if (e.key === "Tab" && !dr.classList.contains("hidden")) { var f = $$("a,button", dr).filter(function (x) { return x.offsetParent; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  /* search over site pages */
  var PAGES = [["index.html", "خانه", "Home"], ["portfolio.html", "نمونه‌کارها", "Portfolio"], ["works.html", "همه نمونه‌کارها", "All works"], ["graphics.html", "نمونه‌کار گرافیک", "Graphic design"], ["reels.html", "ریلز", "Reels"], ["academy.html", "آکادمی سینه‌کد", "CineCode Academy"], ["library.html", "کتابخانه و منابع", "Library and resources"], ["certificates.html", "گواهی‌ها", "Certificates"], ["verify.html", "استعلام گواهی", "Verify a certificate"], ["services.html", "خدمات", "Services"], ["lab.html", "آزمایشگاه خلاق", "Creative Lab"], ["about.html", "درباره من", "About me"], ["cv.html", "رزومه", "CV"], ["presskit.html", "کیت رسانه‌ای", "Press kit"], ["blog.html", "وبلاگ", "Blog"], ["notes.html", "یادداشت‌ها", "Notes"], ["project.html", "پروژه‌ها", "Projects"], ["timeline.html", "خط زمانی", "Timeline"], ["toolkit.html", "جعبه‌ابزار", "Toolkit"], ["resources.html", "آرشیو منابع", "Resource archive"], ["card.html", "کارت دیجیتال", "Digital card"], ["social.html", "شبکه‌های اجتماعی", "Social media"], ["contact.html", "تماس", "Contact"], ["faq.html", "سوالات متداول", "FAQ"], ["feedback.html", "بازخورد", "Feedback"], ["auth.html", "ورود / ثبت‌نام", "Sign in / Register"], ["privacy.html", "حریم خصوصی", "Privacy"], ["terms.html", "قوانین استفاده", "Terms"]];
  function drawList() {
    var q = ($("#srchQ").value || "").trim().toLowerCase(), ul = $("#srchL"); ul.innerHTML = "";
    PAGES.filter(function (p) { return !q || (p[1] + " " + p[2]).toLowerCase().indexOf(q) >= 0; }).slice(0, 12).forEach(function (p) {
      var li = document.createElement("li"), a = document.createElement("a"); a.href = p[0]; a.textContent = lang === "fa" ? p[1] : p[2]; a.className = "block px-3 py-3 rounded-xl hover:bg-alt"; li.appendChild(a); ul.appendChild(li);
    });
    if (!ul.children.length) { var e = document.createElement("li"); e.className = "px-3 py-3 text-mut"; e.textContent = lang === "fa" ? "نتیجه‌ای پیدا نشد." : "No results."; ul.appendChild(e); }
  }
  var sd = $("#srch");
  $("#srchBtn").onclick = function () { $("#srchQ").value = ""; drawList(); if (sd.showModal) sd.showModal(); else sd.setAttribute("open", ""); $("#srchQ").focus(); };
  $("#srchX").onclick = function () { sd.close ? sd.close() : sd.removeAttribute("open"); };
  sd.addEventListener("click", function (e) { if (e.target === sd) sd.close(); });
  $("#srchQ").oninput = drawList;
  $("#srchQ").addEventListener("keydown", function (e) { if (e.key === "Escape") { e.preventDefault(); sd.close ? sd.close() : sd.removeAttribute("open"); } });
  document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#srchBtn").click(); } });

  /* course filter */
  $$("#ctabs button").forEach(function (b) {
    b.onclick = function () {
      var f = b.dataset.f;
      $$("#ctabs button").forEach(function (x) { var on = x === b; x.setAttribute("aria-pressed", on ? "true" : "false"); x.classList.toggle("btn-p", on); x.classList.toggle("btn-o", !on); });
      $$("#cgrid [data-c]").forEach(function (c) { c.hidden = !(f === "all" || c.dataset.c === f); });
    };
  });

  /* live courses from Supabase (published only, public read): shown first, with a working enroll link */
  (function () {
    var g = $("#cgrid"), tpl = g && g.querySelector("article"); if (!g || !tpl || !S.supabaseUrl || !S.supabaseAnonKey) return;
    fetch(String(S.supabaseUrl).replace(/\/$/, "") + "/rest/v1/courses?select=id,title,summary,level&status=eq.published&order=created_at", { headers: { apikey: S.supabaseAnonKey, Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        var LV = { beginner: ["مقدماتی", "Beginner"], intermediate: ["متوسط", "Intermediate"], advanced: ["پیشرفته", "Advanced"] };
        function two(el, fa, en) { el.dataset.fa = fa; el.dataset.en = en; el.textContent = lang === "en" ? en : fa; }
        rows.slice().reverse().forEach(function (c) {
          if (!c || !/^[\w-]+$/.test(c.id || "")) return;
          var a = tpl.cloneNode(true), t = c.title || {}, su = c.summary || {}, lv = LV[c.level] || LV.beginner;
          a.dataset.c = "live"; a.dataset.live = "1";
          var badge = a.querySelector(".absolute.top-3.end-3"); if (badge) { two(badge, "فعال", "Open"); badge.className = badge.className.replace("bg-[#07172D]", "bg-[#39A9E8]").replace("text-white", "text-[#07172D]"); }
          var cat = a.querySelector(".absolute.top-3.start-3"); if (cat) two(cat, "دورهٔ فعال", "Live course");
          var lvl = a.querySelector(".text-accx.text-xs, span.text-xs.font-medium"); if (lvl) two(lvl, lv[0], lv[1]);
          var h = a.querySelector("h3"); if (h) two(h, t.fa || t.en || c.id, t.en || t.fa || c.id);
          var pp = a.querySelector("p.text-mut"); if (pp) two(pp, su.fa || "", su.en || "");
          var go = a.querySelector("a.btn"); if (go) { go.href = "course.html#" + encodeURIComponent(c.id); two(go, "ثبت‌نام رایگان و شروع درس‌ها", "Enrol free and start lessons"); }
          g.insertBefore(a, g.firstChild);
        });
        var note = $("#courses .max-w-2xl p"); if (note) two(note, "این دوره‌ها همین حالا برای ثبت‌نام باز هستند. بقیه دوره‌های برنامه‌ریزی‌شده به‌زودی فعال می‌شوند.", "These courses are open for enrolment now. The other planned courses will open soon.");
      }).catch(function () {});
  })();

  /* contact form (Web3Forms public key, honeypot, consent) */
  var form = $("#form"), st = $("#fstatus");
  function say(fa, en, ok) { st.textContent = lang === "fa" ? fa : en; st.className = "text-sm min-h-[1.5rem] " + (ok ? "text-green-600" : "text-red-600"); }
  form.addEventListener("submit", function (e) {
    e.preventDefault(); if (form.dataset.busy) return;
    if (form.elements.website.value) return;
    var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), msg = form.elements.message.value.trim();
    if (!name) return say("نام را وارد کن.", "Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say("ایمیل معتبر وارد کن.", "Please enter a valid email.");
    if (msg.length < 10) return say("پیام را کمی کامل‌تر بنویس (دست‌کم ۱۰ نویسه).", "Please write at least 10 characters.");
    if (!form.elements.consent.checked) return say("برای ارسال، موافقت را تیک بزن.", "Please tick the consent box.");
    if (!/^https:\/\//.test(S.formEndpoint || "")) return say("ارسال فرم هنوز وصل نشده است؛ از ایمیل یا واتساپ استفاده کن.", "The form is not connected yet; please use email or WhatsApp.");
    var data = { name: name, email: email, type: form.elements.type.value, message: msg };
    if (S.formKey) { data.access_key = S.formKey; data.subject = "Portfolio: " + data.type; }
    var btn = $("#fsend"); form.dataset.busy = "1"; btn.disabled = true; say("در حال ارسال…", "Sending…", true);
    fetch(S.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (r.ok && j.success !== false) { say("پیام ارسال شد. ممنون!", "Message sent. Thank you!", true); form.reset(); } else throw 0; }); })
      .catch(function () { say("ارسال نشد. دوباره تلاش کن یا از ایمیل استفاده کن.", "Could not send. Try again or use email."); })
      .then(function () { delete form.dataset.busy; btn.disabled = false; });
  });

  /* cookie / privacy notice: no tracking cookies are used */
  if (!store("am-ck")) {
    var ck = document.createElement("div"); ck.setAttribute("role", "region"); ck.className = "fixed bottom-3 inset-x-3 sm:inset-x-auto sm:end-4 sm:max-w-sm z-40 rounded-2xl border border-line bg-card p-4 shadow-2xl text-sm";
    ck.innerHTML = '<p class="text-mut"></p><div class="mt-3 flex gap-2 justify-end"><a class="btn btn-o !min-h-[40px] !py-1" href="privacy.html"></a><button type="button" class="btn btn-p !min-h-[40px] !py-1"></button></div>';
    document.body.appendChild(ck); document.body.classList.add("ck-on");
    var fillCk = function () { $("p", ck).textContent = lang === "fa" ? "این سایت کوکی ردیابی ندارد؛ فقط زبان و حالت نمایش را در مرورگر شما نگه می‌دارد و بازدیدها را ناشناس می‌شمارد." : "This site has no tracking cookies. It only remembers your language and theme and counts visits anonymously."; ck.setAttribute("aria-label", lang === "fa" ? "اعلان حریم خصوصی" : "Privacy notice"); $("a", ck).textContent = lang === "fa" ? "حریم خصوصی" : "Privacy"; $("button", ck).textContent = lang === "fa" ? "متوجه شدم" : "Got it"; };
    fillCk(); $("button", ck).onclick = function () { store("am-ck", "1"); ck.remove(); document.body.classList.remove("ck-on"); }; $("#langBtn").addEventListener("click", fillCk);
  }
  /* skills / tools marquee (from site data) */
  function drawMq() {
    var m = S.marquee || {}, words = (m[lang] || m.en || []).slice(), sk = S.skills || {};
    ["video", "design", "cs"].forEach(function (k) { (sk[k] || []).forEach(function (x) { if (words.indexOf(x[1]) < 0) words.push(x[1]); }); });
    var t = $("#mqT"); t.innerHTML = ""; for (var r = 0; r < 2; r++) words.forEach(function (w) { var sp = document.createElement("span"); sp.textContent = w; if (r) sp.setAttribute("aria-hidden", "true"); t.appendChild(sp); });
  }
  /* QR dialog */
  var qd = $("#qrd");
  $("#qrBtn").onclick = function () {
    var draw = function () { try { var q = window.qrcode(0, "M"); q.addData(location.origin + "/"); q.make(); $("#qrBox").innerHTML = q.createSvgTag({ cellSize: 6, margin: 0, scalable: true }); var sv = $("#qrBox svg"); if (sv) { sv.setAttribute("width", "100%"); sv.setAttribute("height", "100%"); sv.setAttribute("aria-hidden", "true"); } $("#qrUrl").textContent = location.origin + "/"; } catch (e) {} };
    if (qd.showModal) qd.showModal(); else qd.setAttribute("open", "");
    if (window.qrcode) draw(); else { var sc = document.createElement("script"); sc.src = "assets/js/qr.js"; sc.onload = draw; document.head.appendChild(sc); }
  };
  $("#qrBtn2").onclick = function () { drawer(false); $("#qrBtn").click(); };
  $("#qrX").onclick = function () { qd.close ? qd.close() : qd.removeAttribute("open"); }; qd.addEventListener("click", function (e) { if (e.target === qd) qd.close(); });
  $("#langBtn").onclick = function () { applyLang(lang === "fa" ? "en" : "fa"); };
  $("#themeBtn").onclick = function () { applyTheme(R.dataset.theme === "dark" ? "light" : "dark"); };
  drawMq();
  var sm = store("am-mode"); applyTheme(sm === "dark" ? "dark" : "light");
  var sl = store("am-lang"); if (sl === "en") applyLang("en"); else { $("#langBtn").textContent = "EN"; drawList(); }
  R.classList.add("l-ok");
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  var cks = $("#ckSet"); if (cks) cks.onclick = function () { try { localStorage.removeItem("am-ck"); } catch (e) {} location.reload(); };
})();
