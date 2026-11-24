/* servicesx.js: extra sections on services.html (what you get, what I need, delivery, FAQ). No prices or timelines are invented:
   they are agreed after the brief. Re-applies after a language change. */
(function () {
  "use strict";
  var R = document.documentElement;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var D = {
    fa: {
      k: "نتیجه‌ای که می‌گیری", c: [["ویدیوی معرفی", "ویدیوی کوتاه برای معرفی یک کسب‌وکار، دوره یا محصول.", "هدف، مخاطب، متن یا ایده، لوگو و فایل‌های موجود."], ["فیلم کوتاه و رویداد", "فیلم‌برداری و تدوین مراسم، کارگاه یا فیلم کوتاه.", "تاریخ و مکان، برنامهٔ رویداد، نمونه‌هایی که دوست داری."], ["لوگو و هویت بصری", "لوگو، رنگ، قلم و راهنمای استفادهٔ ساده.", "نام برند، حوزهٔ کار، رنگ‌ها یا نمونه‌هایی که می‌پسندی."], ["پوستر و چاپی", "پوستر، بنر و مواد چاپی با اندازهٔ درست.", "متن نهایی، اندازه، لوگو و عکس‌ها."], ["موشن‌گرافیک", "انیمیشن لوگو، نوار نام‌نمایی و ویدیوی توضیحی.", "لوگو، متن‌ها، رنگ‌های برند و مثال حرکت."], ["آموزش", "دوره‌ها و کارگاه‌های مجازی با آزمون و گواهی.", "موضوع، سطح یادگیرنده‌ها و زمان‌های ممکن."]],
      nT: "برای شروع از تو چه می‌خواهم", n: ["هدف پروژه را در یک یا دو جمله بگو", "مخاطب کیست؟", "زبان متن‌ها و صدا", "نمونه‌هایی که دوست داری (لینک یا عکس)", "لوگو و فایل‌ها یا فیلم‌های خام", "زمان تحویل مورد نظر"],
      dT: "تحویل", d: ["فایل نهایی در قالبی که لازم داری (مثلاً MP4 برای ویدیو، PNG یا PDF برای طراحی).", "فایل‌های سورس در صورت توافق قبلی.", "تعداد دور بازبینی و شرایط پرداخت پیش از شروع، نوشته می‌شود."],
      qT: "پرسش‌های رایج", q: [["قیمت چطور تعیین می‌شود؟", "لیست قیمت ثابت ندارم. بعد از دیدن موضوع و حجم کار، قیمت و زمان را با هم توافق می‌کنیم."], ["نمونهٔ کار می‌شود دید؟", "بله، در بخش همهٔ نمونه‌کارها و گالری گرافیک."], ["بازبینی چقدر است؟", "تعداد دور بازبینی پیش از شروع توافق می‌شود تا هر دو طرف بدانند چه انتظاری دارند."], ["از راه دور هم کار می‌کنید؟", "فایل‌ها آنلاین رد و بدل می‌شود. اگر در کابل هستی می‌توانیم حضوری هم صحبت کنیم."], ["چطور شروع کنم؟", "فرم کوتاه شروع پروژه را پر کن؛ پیام آماده برای واتساپ یا ایمیل ساخته می‌شود."]],
      b1: "شروع پروژه", b2: "دیدن نمونه‌کارها", b3: "ابزارهای رایگان"
    },
    en: {
      k: "What you get", c: [["Promo video", "A short video that introduces a business, course or product.", "Goal, audience, script or idea, logo and any files you have."], ["Event and short film", "Filming and editing of an event, workshop or short film.", "Date and place, event plan, examples you like."], ["Logo and visual identity", "Logo, colours, fonts and a simple usage guide.", "Brand name, field of work, colours or examples you like."], ["Posters and print", "Posters, banners and print material in the right size.", "Final text, size, logo and photos."], ["Motion graphics", "Logo animation, lower thirds and explainer video.", "Logo, texts, brand colours and a motion example."], ["Training", "Online courses and workshops with exams and certificates.", "Topic, learner level and possible times."]],
      nT: "What I need from you to start", n: ["The goal in one or two sentences", "Who the audience is", "Language of text and voice", "Examples you like (links or images)", "Logo, files or raw footage", "Your preferred delivery date"],
      dT: "Delivery", d: ["Final files in the format you need (for example MP4 for video, PNG or PDF for design).", "Source files if agreed beforehand.", "Revision rounds and payment terms are written down before work starts."],
      qT: "Common questions", q: [["How is the price decided?", "I have no fixed price list. After I see the subject and size of the work, we agree price and timing together."], ["Can I see samples?", "Yes: the Works page and the graphics gallery."], ["How many revisions are there?", "The number of revision rounds is agreed before starting so both sides know what to expect."], ["Do you work remotely?", "Files are exchanged online. If you are in Kabul we can also talk in person."], ["How do I start?", "Fill in the short project form; a ready message for WhatsApp or e-mail is prepared for you."]],
      b1: "Start a project", b2: "See my work", b3: "Free tools"
    }
  };
  function add() {
    var host = document.getElementById("services"); if (!host || host.querySelector(".svx")) return; var promo = host.querySelector(".ac-promo"); if (!promo) return;
    var L = D[R.lang === "fa" ? "fa" : "en"], w = el("div", "svx");
    var s1 = el("section", "ac-sec"); s1.appendChild(el("h2", "", L.k)); var g = el("div", "ac-grid");
    L.c.forEach(function (c) { var a = el("article", "ac-card"); a.appendChild(el("h3", "ac-h", c[0])); a.appendChild(el("p", "", c[1])); var s = el("p", "svx-n"); var b = el("b", "", (R.lang === "fa" ? "از تو: " : "From you: ")); s.appendChild(b); s.appendChild(document.createTextNode(c[2])); a.appendChild(s); g.appendChild(a); }); s1.appendChild(g); w.appendChild(s1);
    var s2 = el("section", "ac-sec svx-two"), a2 = el("div"), b2 = el("div"); a2.appendChild(el("h2", "", L.nT)); var ul = el("ul", "svx-l"); L.n.forEach(function (t) { ul.appendChild(el("li", "", t)); }); a2.appendChild(ul);
    b2.appendChild(el("h2", "", L.dT)); var u2 = el("ul", "svx-l"); L.d.forEach(function (t) { u2.appendChild(el("li", "", t)); }); b2.appendChild(u2); s2.appendChild(a2); s2.appendChild(b2); w.appendChild(s2);
    var s3 = el("section", "ac-sec"); s3.appendChild(el("h2", "", L.qT)); L.q.forEach(function (q) { var d = el("details", "svx-q"); d.appendChild(el("summary", "", q[0])); d.appendChild(el("p", "", q[1])); s3.appendChild(d); }); w.appendChild(s3);
    var r = el("p", "svx-r"); var bb = el("button", "btn go", L.b1); bb.type = "button"; bb.setAttribute("data-brief", ""); r.appendChild(bb); [["works.html", L.b2], ["lab.html", L.b3]].forEach(function (x) { var a = el("a", "btn", x[1]); a.href = x[0]; r.appendChild(a); }); w.appendChild(r);
    promo.parentNode.insertBefore(w, promo);
  }
  add(); var host = document.getElementById("services");
  if (host) new MutationObserver(function () { if (!host.querySelector(".svx")) add(); }).observe(host, { childList: true });
})();
