/* designx.js: "Graphic design and advertising" section on services.html:
   7 service cards, a filterable gallery of my real designs (window.SITE.gallery), and a quick order form
   that prepares a WhatsApp / e-mail message with the visitor's own click. Nothing is stored or sent by the site. */
(function () {
  "use strict";
  var R = document.documentElement, S = window.SITE || {};
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var fa = function () { return R.lang === "fa"; };
  var IC = {
    banner: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h6M7 14h10"/>',
    poster: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8.5" cy="12" r="1.8"/><path d="M13 10.5h5M13 13.5h4"/>',
    logo: '<circle cx="12" cy="12" r="8"/><path d="M8 15l4-7 4 7M9.5 12.5h5"/>',
    brochure: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    cover: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/>',
    mock: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    id: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8 17c1-2.5 7-2.5 8 0"/>',
    set: '<rect x="3" y="7" width="13" height="10" rx="1.5"/><path d="M3 8l6.5 5L16 8M18 9h3v9H8"/>',
    pack: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M8 6l8 4"/>',
    book: '<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/>',
    social: '<rect x="5" y="3" width="14" height="18" rx="3"/><circle cx="12" cy="11" r="3.2"/><path d="M16.5 7.5h.01"/>',
    web: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8M12 18v3"/>',
    ui: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M13 13h5M13 16h3"/>',
    story: '<rect x="3" y="4" width="8" height="7" rx="1"/><rect x="13" y="4" width="8" height="7" rx="1"/><rect x="3" y="13" width="8" height="7" rx="1"/><path d="M14 16.5h6M14 19h4"/>',
    retouch: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M3 17l5-4 4 3 3-2 6 4"/>',
    ai: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    ppt: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8M8 12l3-3 2 2 3-4"/>'
  };
  var D = {
    fa: {
      h: "طراحی گرافیک و تبلیغات", p: "از یک بنر ساده تا هویت بصری کامل. هر طرح با توجه به مخاطب، پیام و محل استفاده ساخته می‌شود و با فایل آمادهٔ چاپ یا انتشار تحویل می‌گیرید.", order: "سفارش این خدمت",
      S: [
        ["logo", "طراحی لوگو", "لوگوتایپ، مونوگرام، لوگوی تصویری و ترکیبی؛ نشانی ساده، ماندگار و قابل استفاده در همه‌جا.", "لوگو (لوگوتایپ، مونوگرام، تصویری، ترکیبی)", "brand"],
        ["set", "ست اداری", "سربرگ، پاکت نامه، کارت ویزیت مدرن و لوکس، مهر و فاکتور با هویت یکدست.", "ست اداری (سربرگ، پاکت، کارت ویزیت، مهر، فاکتور)", "brand"],
        ["id", "کارت شناسایی", "کارت پرسنلی، کارت دانشجویی، بج سینه و کارت دعوت مجالس.", "کارت شناسایی و کارت دعوت", ""],
        ["brochure", "کاتالوگ، بروشور، تراکت و منو", "چیدمان خوانا و جذاب برای معرفی محصول، خدمات و منوی رستوران یا کافه.", "کاتالوگ / بروشور / تراکت / منو", "print"],
        ["banner", "طراحی بنر", "بنر مناسبتی و تبلیغاتی، سردر مغازه، بیلبورد و استند نمایشگاهی.", "بنر (مناسبتی، سردر، بیلبورد، استند)", "banner"],
        ["poster", "طراحی پوستر", "پوستر سینمایی، فیلم کوتاه، همایش، کنسرت و آموزشی با ترکیب‌بندی قوی.", "پوستر (سینمایی، همایش، کنسرت، آموزشی)", "poster"],
        ["pack", "بسته‌بندی و لیبل", "جعبه، پاکت و برچسب محصول که روی قفسه دیده می‌شود.", "بسته‌بندی و لیبل محصول", "print"],
        ["book", "جلد کتاب، مجله و آلبوم", "جلد کتاب، مجله، پایان‌نامه و کاور آلبوم با حس درست موضوع.", "جلد کتاب / مجله / پایان‌نامه / آلبوم", "print"],
        ["cover", "کاور و تامبنیل", "تامبنیل حرفهٔ یوتیوب، کاور ریلز و پست اینستاگرام که کلیک می‌گیرد.", "کاور و تامبنیل (یوتیوب، ریلز، پست)", ""],
        ["social", "قالب پست و استوری", "قالب اسلایدی و تک‌صفحه‌ای برای اینستاگرام، تلگرام و لینکدین.", "قالب پست و استوری (اینستاگرام، تلگرام، لینکدین)", ""],
        ["web", "بنر تبلیغاتی وب‌سایت", "اسلایدر سایت، بنر کلیکی و بنر فروش ویژه.", "بنر وب‌سایت (اسلایدر، کلیکی، فروش ویژه)", "banner"],
        ["ui", "UI، آیکون و اینفوگرافیک", "طراحی رابط کاربری اولیه، آیکون اختصاصی و اینفوگرافیک آموزشی.", "UI اولیه، آیکون و اینفوگرافیک", ""],
        ["story", "استوری‌بورد", "استوری‌بورد برای فیلم، تیزر و انیمیشن؛ قبل از فیلم‌برداری همه‌چیز دیده می‌شود.", "استوری‌بورد (فیلم، تیزر، انیمیشن)", ""],
        ["retouch", "روتوش و موکاپ", "روتوش حرفه‌ای، تغییر پس‌زمینه، ترمیم عکس قدیمی و موکاپ.", "روتوش، تغییر پس‌زمینه، ترمیم عکس، موکاپ", ""],
        ["ai", "طراحی خلاقانهٔ ترکیبی با هوش مصنوعی", "ترکیب هنر هوش مصنوعی و طراحی دستی برای پوستر و تصویر خلاقانه.", "طراحی ترکیبی با هوش مصنوعی (AI Art و پوستر)", ""],
        ["ppt", "اسلاید پاورپوینت", "اسلاید حرفه‌ای برای ارائهٔ دانشگاهی و تجاری.", "اسلاید پاورپوینت / ارائه", ""]
      ],
      T: ["طراحی گرافیک و هویت بصری", "تبلیغات محیطی و چاپی", "دیجیتال و شبکه‌های اجتماعی", "سینما، تصویر و هوش مصنوعی"], vs: "مشاهدهٔ نمونه‌کارها",
      gh: "نمونه‌کارهای گرافیک", gp: "روی هر طرح بزن تا بزرگ ببینی.", all: "همه", cats: { poster: "پوستر", banner: "بنر", brand: "لوگو و هویت", print: "چاپی", academy: "آموزشی" }, none: "هنوز نمونه‌ای در این دسته نیست.",
      fh: "ثبت سفارش سریع", fp: "نوع طرح، اندازه و توضیح کوتاه را بنویس؛ پیام آماده برای واتساپ یا ایمیل ساخته می‌شود.", ty: "نوع طرح", sz: "اندازه", szo: ["A4", "A3", "A5", "۱۰۸۰×۱۰۸۰ (پست مربع)", "۱۰۸۰×۱۹۲۰ (استوری)", "۱۲۸۰×۷۲۰ (تامبنیل یوتیوب)", "۹×۵ سانتی‌متر (کارت ویزیت)", "اندازهٔ بیلبورد / استند", "بسته‌بندی (ابعاد در توضیح)", "اسلاید ۱۶:۹", "اندازهٔ دیگر (در توضیح می‌نویسم)"], ds: "توضیح کوتاه (متن، رنگ، نمونهٔ دلخواه)", nm: "نام شما", wa: "ارسال در واتساپ", em: "ارسال با ایمیل", cp: "کپی متن", ok: "کپی شد", note: "پیام فقط با کلیک خودت فرستاده می‌شود. قیمت و زمان بعد از دیدن پروژه توافق می‌شود.", cl: "بستن",
      hi: "سلام انصارالحق، می‌خواهم یک طرح گرافیک سفارش بدهم.", L: ["نوع طرح", "اندازه", "نام", "توضیح"], eT: "سفارش طراحی گرافیک"
    },
    en: {
      h: "Graphic design and advertising", p: "From a simple banner to a full visual identity. Every design is made for the audience, the message and the place it will be used, and delivered as a print-ready or publish-ready file.", order: "Order this service",
      S: [
        ["logo", "Logo design", "Logotype, monogram, pictorial and combination marks; simple, lasting and usable everywhere.", "Logo (logotype, monogram, pictorial, combination)", "brand"],
        ["set", "Stationery set", "Letterhead, envelope, modern or luxury business card, stamp and invoice with one identity.", "Stationery set (letterhead, envelope, card, stamp, invoice)", "brand"],
        ["id", "ID and invitation cards", "Staff cards, student cards, badges and event invitation cards.", "ID card and invitation card", ""],
        ["brochure", "Catalogue, brochure, flyer and menu", "A clear, attractive layout for products, services and restaurant or café menus.", "Catalogue / brochure / flyer / menu", "print"],
        ["banner", "Banner design", "Occasion and promotional banners, shop signs, billboards and exhibition stands.", "Banner (occasion, shop sign, billboard, stand)", "banner"],
        ["poster", "Poster design", "Cinema, short film, conference, concert and educational posters with strong composition.", "Poster (cinema, conference, concert, educational)", "poster"],
        ["pack", "Packaging and labels", "Boxes, bags and product stickers that stand out on the shelf.", "Packaging and product label", "print"],
        ["book", "Book, magazine and album covers", "Covers for books, magazines, theses and albums that match the subject.", "Book / magazine / thesis / album cover", "print"],
        ["cover", "Covers and thumbnails", "Professional YouTube thumbnails, reel covers and Instagram posts that get clicks.", "Cover and thumbnail (YouTube, reels, post)", ""],
        ["social", "Post and story templates", "Carousel and single-page templates for Instagram, Telegram and LinkedIn.", "Post and story templates (Instagram, Telegram, LinkedIn)", ""],
        ["web", "Website ad banners", "Site sliders, clickable banners and special-sale banners.", "Website banner (slider, clickable, sale)", "banner"],
        ["ui", "UI, icons and infographics", "First-draft user interface, custom icons and educational infographics.", "Draft UI, icons and infographics", ""],
        ["story", "Storyboard", "Storyboards for film, teasers and animation; see everything before shooting.", "Storyboard (film, teaser, animation)", ""],
        ["retouch", "Retouching and mockups", "Professional retouching, background change, old photo restoration and mockups.", "Retouch, background change, photo restoration, mockup", ""],
        ["ai", "Creative AI-assisted design", "Combining AI art with hand design for posters and creative images.", "AI-assisted design (AI art and poster)", ""],
        ["ppt", "PowerPoint slides", "Professional slides for academic and business presentations.", "PowerPoint slides / presentation", ""]
      ],
      T: ["Graphic design and identity", "Outdoor and print", "Digital and social media", "Cinema, image and AI"], vs: "View samples",
      gh: "Graphic design portfolio", gp: "Tap a design to see it large.", all: "All", cats: { poster: "Poster", banner: "Banner", brand: "Logo and identity", print: "Print", academy: "Educational" }, none: "No samples in this category yet.",
      fh: "Quick order", fp: "Choose the design type, size and a short description; a ready message for WhatsApp or e-mail is prepared.", ty: "Design type", sz: "Size", szo: ["A4", "A3", "A5", "1080×1080 (square post)", "1080×1920 (story)", "1280×720 (YouTube thumbnail)", "9×5 cm (business card)", "Billboard / stand size", "Packaging (size in description)", "Slide 16:9", "Other size (I will write it below)"], ds: "Short description (text, colours, an example you like)", nm: "Your name", wa: "Send on WhatsApp", em: "Send by e-mail", cp: "Copy text", ok: "Copied", note: "The message is sent only when you click. Price and timing are agreed after I see the project.", cl: "Close",
      hi: "Hello Ansarulhaq, I would like to order a graphic design.", L: ["Design type", "Size", "Name", "Description"], eT: "Graphic design order"
    }
  };
  var CAT_ORDER = ["poster", "banner", "brand", "print", "academy"], flt = "all";
  function wa() { var p = (S.phones || []).filter(function (x) { return x && x.wa && /^\+?\d{7,15}$/.test(x.n || ""); })[0]; return p ? p.n.replace(/\D/g, "") : ""; }
  function ok(u) { return typeof u === "string" && /^(assets\/|https:\/\/)/.test(u); }
  function src(g, t) { return g && ok(g.src) ? (t && ok(g.thumb) ? g.thumb : g.src) : "assets/work/" + (g ? g.id : "") + (t ? "-t" : "") + ".webp"; }

  var dlg;
  function lightbox(g, list, i) {
    var L = D[fa() ? "fa" : "en"]; if (!dlg) { dlg = el("dialog", "dx-dlg"); document.body.appendChild(dlg); dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); }
    function show(k) { i = (k + list.length) % list.length; dlg.textContent = ""; var b = el("button", "dx-x", "×"); b.type = "button"; b.setAttribute("aria-label", L.cl); b.onclick = function () { dlg.close(); }; var im = el("img"); im.alt = (L.cats[list[i].cat] || "") + " " + (i + 1); im.src = src(list[i]); var n = el("button", "dx-n", fa() ? "›" : "›"), p = el("button", "dx-p", "‹"); n.type = p.type = "button"; n.setAttribute("aria-label", "Next"); p.setAttribute("aria-label", "Previous"); n.onclick = function () { show(i + 1); }; p.onclick = function () { show(i - 1); }; dlg.appendChild(b); dlg.appendChild(p); dlg.appendChild(im); dlg.appendChild(n); }
    dlg.onkeydown = function (e) { if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); };
    show(i); if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
  }

  function build(host, promo) {
    var L = D[fa() ? "fa" : "en"], w = el("section", "dx"); w.id = "dx"; w.setAttribute("aria-label", L.h);
    w.appendChild(el("h2", "dx-h", L.h)); w.appendChild(el("p", "dx-p", L.p));
    var g = el("div", "dx-g"), form;
    var tl = el("div", "dx-tabs"); tl.setAttribute("role", "tablist"), tl.setAttribute("aria-label", L.h); var cur = 0, tabs = [];
    function sel(i) { var ty = document.getElementById("dxTy"); if (ty) { ty.value = i; ty.dispatchEvent(new Event("change")); } var f = document.getElementById("dxForm"); if (f && f.scrollIntoView) f.scrollIntoView({ behavior: "smooth", block: "center" }); var d = document.getElementById("dxDs"); if (d) setTimeout(function () { d.focus({ preventScroll: true }); }, 500); }
    function samples(k) { flt = (k && document.querySelector('.dx-fc[data-k="' + k + '"]')) ? k : "all"; if (window.__dxPaint) window.__dxPaint(); var gl = document.getElementById("dxGal"); if (gl && gl.scrollIntoView) gl.scrollIntoView({ behavior: "smooth", block: "start" }); }
    function show(t) { cur = t; g.textContent = ""; tabs.forEach(function (b, k) { b.setAttribute("aria-selected", k === t ? "true" : "false"); b.tabIndex = k === t ? 0 : -1; }); g.setAttribute("aria-labelledby", "dxt" + t);
      L.S.forEach(function (s, i) { if (Math.floor(i / 4) !== t) return; var c = el("article", "dx-c"); var ic = el("span", "dx-i"); ic.setAttribute("aria-hidden", "true"); ic.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + IC[s[0]] + "</svg>"; c.appendChild(ic); c.appendChild(el("h3", "", s[1])); c.appendChild(el("p", "", s[2])); var r = el("div", "dx-ca"); var b = el("button", "btn go dx-o", L.order); b.type = "button"; b.onclick = function () { sel(i); }; var v = el("button", "btn dx-o", L.vs); v.type = "button"; v.onclick = function () { samples(s[4]); }; r.appendChild(b); r.appendChild(v); c.appendChild(r); g.appendChild(c); }); }
    L.T.forEach(function (n, k) { var b = el("button", "dx-tab", n); b.type = "button"; b.id = "dxt" + k; b.setAttribute("role", "tab"); b.onclick = function () { show(k); }; b.onkeydown = function (e) { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { var d2 = (e.key === "ArrowRight") === (document.documentElement.dir === "rtl") ? -1 : 1; var nk = (cur + d2 + 4) % 4; show(nk); tabs[nk].focus(); } }; tabs.push(b); tl.appendChild(b); });
    g.setAttribute("role", "tabpanel"); w.appendChild(tl); show(0);
    w.appendChild(g);
    /* gallery */
    var G = (S.gallery || []).filter(function (x) { return x && !x.hidden; }), have = CAT_ORDER.filter(function (k) { return G.some(function (x) { return x.cat === k; }); });
    if (G.length) {
      var gs = el("div", "dx-gal"); gs.id = "dxGal"; gs.appendChild(el("h2", "dx-h", L.gh)); gs.appendChild(el("p", "dx-p", L.gp));
      var chips = el("div", "dx-f"); chips.setAttribute("role", "group"); chips.setAttribute("aria-label", L.gh); var grid = el("div", "dx-m");
      function paint() { grid.textContent = ""; var list = G.filter(function (x) { return flt === "all" || x.cat === flt; }); if (!list.length) { grid.appendChild(el("p", "muted", L.none)); return; }
        list.slice(0, 48).forEach(function (x, i) { var b = el("button", "dx-t"); b.type = "button"; var im = el("img"); im.loading = "lazy"; im.decoding = "async"; im.alt = (L.cats[x.cat] || "") + " " + (i + 1); im.src = src(x, true); if (x.w && x.h) { im.width = 300; im.height = Math.round(300 * x.h / x.w); } b.appendChild(im); b.onclick = function () { lightbox(x, list, i); }; grid.appendChild(b); });
        [].forEach.call(chips.children, function (c) { c.setAttribute("aria-pressed", c.dataset.k === flt ? "true" : "false"); }); }
      window.__dxPaint = paint;
      [["all", L.all]].concat(have.map(function (k) { return [k, L.cats[k]]; })).forEach(function (c) { var b = el("button", "dx-fc", c[1]); b.type = "button"; b.dataset.k = c[0]; b.onclick = function () { flt = c[0]; paint(); }; chips.appendChild(b); });
      gs.appendChild(chips); gs.appendChild(grid); w.appendChild(gs); paint();
    }
    /* quick order */
    form = el("div", "dx-form"); form.id = "dxForm"; form.appendChild(el("h2", "dx-h", L.fh)); form.appendChild(el("p", "dx-p", L.fp));
    var st = { ty: 0, sz: 0, nm: "", ds: "" }, row = el("div", "dx-r");
    function fld(lbl, ctl) { var l = el("label"); l.appendChild(el("span", "", lbl)); l.appendChild(ctl); return l; }
    var ty = el("select"); ty.id = "dxTy"; L.T.forEach(function (tn, k) { var og = el("optgroup"); og.label = tn; L.S.forEach(function (s, i) { if (Math.floor(i / 4) !== k) return; var o = el("option", "", s[3]); o.value = i; og.appendChild(o); }); ty.appendChild(og); }); ty.onchange = function () { st.ty = +ty.value; upd(); };
    var sz = el("select"); L.szo.forEach(function (s, i) { var o = el("option", "", s); o.value = i; sz.appendChild(o); }); sz.onchange = function () { st.sz = +sz.value; upd(); };
    var nm = el("input"); nm.type = "text"; nm.maxLength = 60; nm.oninput = function () { st.nm = nm.value.trim(); upd(); };
    var ds = el("textarea"); ds.id = "dxDs"; ds.rows = 4; ds.maxLength = 700; ds.oninput = function () { st.ds = ds.value.trim(); upd(); };
    row.appendChild(fld(L.ty, ty)); row.appendChild(fld(L.sz, sz)); row.appendChild(fld(L.nm, nm)); form.appendChild(row); form.appendChild(fld(L.ds, ds));
    var pv = el("pre", "dx-pv"); pv.setAttribute("aria-live", "polite"); form.appendChild(pv);
    function msg() { var l = [L.hi, "", L.L[0] + ": " + L.S[st.ty][3], L.L[1] + ": " + L.szo[st.sz]]; if (st.nm) l.push(L.L[2] + ": " + st.nm); if (st.ds) l.push(L.L[3] + ": " + st.ds); return l.join("\n"); }
    function upd() { pv.textContent = msg(); }
    var act = el("p", "dx-a"), num = wa();
    if (num) { var a = el("a", "btn go", L.wa); a.target = "_blank"; a.rel = "noopener noreferrer"; a.href = "https://wa.me/" + num; a.addEventListener("click", function () { a.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(msg()); }); act.appendChild(a); }
    if (S.contactEmail) { var m = el("a", "btn", L.em); m.href = "mailto:" + S.contactEmail; m.addEventListener("click", function () { m.href = "mailto:" + S.contactEmail + "?subject=" + encodeURIComponent(L.eT) + "&body=" + encodeURIComponent(msg()); }); act.appendChild(m); }
    var cp = el("button", "btn", L.cp); cp.type = "button"; cp.onclick = function () { if (navigator.clipboard) navigator.clipboard.writeText(msg()).then(function () { cp.textContent = L.ok; setTimeout(function () { cp.textContent = L.cp; }, 1000); }, function () {}); }; act.appendChild(cp);
    form.appendChild(act); form.appendChild(el("p", "muted", L.note)); w.appendChild(form); upd();
    promo.parentNode.insertBefore(w, promo);
  }
  function add() {
    var host = document.getElementById("services"); if (!host) return; var key = fa() ? "fa" : "en", o = document.getElementById("dx"); if (o && o.dataset.k === key) return; if (o) o.remove();
    var anchor = host.querySelector(".svx") || host.querySelector(".ac-promo"); if (!anchor) return; build(host, anchor); var n = document.getElementById("dx"); if (n) n.dataset.k = key;
  }
  function go() { add(); setTimeout(add, 700); var h = document.getElementById("services"); if (h) new MutationObserver(function () { var o = document.getElementById("dx"); if (!o || o.dataset.k !== (fa() ? "fa" : "en")) add(); }).observe(h, { childList: true }); }
  if (window.SITE) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go(); } else addEventListener("load", go);
})();
