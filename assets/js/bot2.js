/* Site assistant. Rule-based: answers ONLY from this site's own data (window.SITE). No server, no AI calls, no data leaves the browser. */
(function () {
  "use strict";
  var S = window.SITE; if (!S) return;
  var R = document.documentElement, $ = function (s, r) { return (r || document).querySelector(s); };
  var lg = function () { return R.lang === "en" ? "en" : "fa"; };
  var tx = function (o) { return (o && (o[lg()] || o.en || o.fa)) || ""; };
  var norm = function (x) { return String(x || "").toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[ً-ٟ‌]/g, " ").replace(/[^\p{L}\p{N}\s]/gu, " "); };
  var D = {
    work: { k: ["work", "portfolio", "project", "film", "design", "نمونه", "کار", "پروژه", "پورتفولیو", "فیلم", "گرافیک"], c: ["مشاهده نمونه‌کارها", "View portfolio"] },
    hire: { k: ["hire", "order", "price", "cost", "service", "edit", "سفارش", "قیمت", "خدمات", "تدوین", "استخدام"], c: ["سفارش پروژه تدوین و گرافیک", "Order an editing or design project"] },
    verify: { k: ["verify", "certificate", "code", "استعلام", "گواهی", "گواهینامه", "مدرک", "کد"], c: ["استعلام گواهینامه", "Verify a certificate"] },
    contact: { k: ["contact", "email", "phone", "whatsapp", "cv", "resume", "تماس", "ایمیل", "شماره", "واتساپ", "رزومه"], c: ["اطلاعات تماس و رزومه", "Contact info and CV"] },
    about: { k: ["who", "about", "bio", "study", "university", "کی", "درباره", "تحصیل", "دانشگاه", "معرفی"], c: ["درباره من", "About me"] },
    academy: { k: ["academy", "course", "learn", "free", "آکادمی", "دوره", "یادگیری", "رایگان"], c: ["دوره‌ها و آکادمی", "Courses and academy"] },
    social: { k: ["social", "instagram", "youtube", "linkedin", "behance", "github", "شبکه", "اینستاگرام", "یوتیوب"], c: ["شبکه‌های اجتماعی", "Social links"] }
  };
  function ans(key) {
    var f = lg() === "fa", n = tx(S.name), phone = (S.phones && S.phones[0] && S.phones[0].show) || S.phone || "";
    switch (key) {
      case "work": return { t: f ? "نمونه‌کارهای واقعی من (طراحی گرافیک) در صفحهٔ پورتفولیو است. پروژه‌های فیلم و تدوین بعد از آماده شدن اضافه می‌شوند." : "My real graphic design work is on the Portfolio page. Film and editing projects will be added once ready.", href: "portfolio.html", l: f ? "رفتن به پورتفولیو" : "Open portfolio" };
      case "hire": return { t: f ? "تدوین ویدیو، طراحی گرافیک و فیلم‌سازی. برای سفارش، توضیح پروژه را از فرم تماس بفرست؛ پاسخ به ایمیلت می‌آید." : "Video editing, graphic design and filmmaking. To order, send the project description through the contact form; the reply goes to your email.", href: "#contact", l: f ? "فرم تماس" : "Contact form" };
      case "verify": return { t: f ? (S.certs || []).length + " گواهی در بخش گواهی‌ها هست. برای استعلام گواهی آکادمی، کد گواهی را در صفحهٔ استعلام وارد کن." : (S.certs || []).length + " certificates are listed. To verify an academy certificate, enter its code on the verification page.", href: "verify.html", l: f ? "استعلام گواهی" : "Verify a certificate" };
      case "contact": return { t: [S.contactEmail, phone ? "‎" + phone + " (WhatsApp / Telegram)" : ""].filter(Boolean).join("\n") + "\n" + (f ? "رزومه در صفحهٔ رزومه است." : "The CV is on the CV page."), href: "cv.html", l: f ? "دیدن رزومه" : "Open CV" };
      case "about": return { t: n + ". " + tx(S.roles) + ". " + tx(S.city) + ".\n" + (S.education || []).map(function (e) { return tx(e.school) + ": " + tx(e.field) + " (" + tx(e.status) + ")"; }).join("\n"), href: "about.html", l: f ? "درباره من" : "About me" };
      case "academy": return { t: f ? "آکادمی هنوز باز نشده است. قرار است دوره‌ها رایگان باشند و گواهی گذراندن دوره با کد قابل استعلام داشته باشند." : "The academy is not open yet. Courses are planned to be free, with certificates that can be verified by code.", href: "#courses", l: f ? "دیدن دوره‌ها" : "See courses" };
      case "social": return { t: (S.socials || []).filter(function (x) { return x.show; }).map(function (x) { return x.label; }).join(f ? "، " : ", "), href: "social.html", l: f ? "شبکه‌ها" : "Social hub" };
      default: return { t: f ? "این را در اطلاعات سایت پیدا نکردم و حدس نمی‌زنم. از دکمه‌ها استفاده کن یا در فرم تماس بنویس." : "I could not find that on this site and I will not guess. Use the buttons or write in the contact form.", href: "#contact", l: f ? "فرم تماس" : "Contact form" };
    }
  }
  if (document.querySelector(".bx2")) return;
  var root = document.createElement("div"); root.className = "bx2";
  root.innerHTML = '<div class="b2-p" id="b2p" role="region" hidden><div class="b2-h"><strong id="b2t"></strong><button type="button" id="b2x" class="b2-x"></button></div><div class="b2-m" id="b2m" role="log" aria-live="polite"></div><div class="b2-c" id="b2c"></div><form class="b2-f" id="b2f"><input id="b2i" autocomplete="off" maxlength="120"><button class="b2-s" type="submit" id="b2s"></button></form></div><button type="button" class="b2-b" id="b2b" aria-expanded="false" aria-controls="b2p"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg></button>';
  document.body.appendChild(root);
  var m = $("#b2m"), started = false;
  function add(t, who, link) { var d = document.createElement("div"); d.className = "bm " + who; d.textContent = t; if (link) { d.appendChild(document.createElement("br")); var a = document.createElement("a"); a.href = link.href; a.textContent = link.l; d.appendChild(a); a.addEventListener("click", function () { if (link.href.charAt(0) === "#") open(false); }); } m.appendChild(d); m.scrollTop = m.scrollHeight; }
  function paint() {
    var f = lg() === "fa";
    $("#b2t").textContent = f ? "دستیار هوشمند سینه‌کد و پورتفولیو" : "CineCode & portfolio assistant"; $("#b2x").textContent = f ? "بستن" : "Close";
    $("#b2i").placeholder = f ? "سؤالت را بنویس" : "Type your question"; $("#b2s").textContent = f ? "بفرست" : "Send"; $("#b2b").setAttribute("aria-label", f ? "دستیار سایت" : "Site assistant"); $("#b2p").setAttribute("aria-label", f ? "دستیار سایت" : "Site assistant");
    var c = $("#b2c"); c.innerHTML = ""; Object.keys(D).forEach(function (k) { var b = document.createElement("button"); b.type = "button"; b.textContent = D[k].c[f ? 0 : 1]; b.onclick = function () { ask(b.textContent, k); }; c.appendChild(b); });
  }
  function ask(q, key) {
    add(q, "u");
    if (!key) { var n = norm(q), best = null, sc = 0; Object.keys(D).forEach(function (k) { var s = D[k].k.reduce(function (a, w) { return a + (n.indexOf(norm(w).trim()) >= 0 ? 1 : 0); }, 0); if (s > sc) { sc = s; best = k; } }); key = best; }
    var r = ans(key || "none"); add(r.t, "b", { href: r.href, l: r.l });
  }
  function open(on) { $("#b2p").hidden = !on; $("#b2b").setAttribute("aria-expanded", on ? "true" : "false"); if (on) { paint(); if (!started) { started = true; add(lg() === "fa" ? "سلام! من دستیار این سایتم و فقط از اطلاعات همین سایت جواب می‌دهم. یکی از دکمه‌ها را بزن یا سؤالت را بنویس." : "Hi! I am this site's assistant and I answer only from this site's own information. Tap a button or type your question.", "b"); } $("#b2i").focus(); } }
  $("#b2b").onclick = function () { open($("#b2p").hidden); };
  $("#b2x").onclick = function () { open(false); $("#b2b").focus(); };
  root.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("#b2p").hidden) { open(false); $("#b2b").focus(); } });
  $("#b2f").addEventListener("submit", function (e) { e.preventDefault(); var q = $("#b2i").value.trim(); if (!q) return; $("#b2i").value = ""; ask(q); });
  new MutationObserver(paint).observe(R, { attributes: true, attributeFilter: ["lang"] }); paint();
})();
