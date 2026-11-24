/* cine.js: reference-driven home composition (CineCode Academy & Creative Studio).
   Real data only: gallery, certificates, courses come from window.SITE. Nothing is invented. */
(function () {
  "use strict";
  var R = document.documentElement, S = window.SITE || {}, PAGE = document.body.dataset.page || "home";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var E = function (t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  var L = function () { return R.lang === "fa" ? "fa" : "en"; };
  var nf = function (n) { try { return new Intl.NumberFormat(L() === "fa" ? "fa-AF" : "en").format(n); } catch (e) { return String(n); } };
  var ic = function (d, c) { return '<svg class="' + (c || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; };
  var ICO = { code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>', film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>', art: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="16" cy="10" r="1.3"/><path d="M12 21c-1.5 0-2-1-2-2s1-2 2-2 3 0 3-2"/>', bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0012 3z"/>', pen: '<path d="M4 20l1-4L17 4l3 3L8 19zM14 7l3 3"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>', rocket: '<path d="M5 15c-1 3-1 5-1 5s2 0 5-1M14 4c3-1 6-1 6-1s0 3-1 6l-7 7-5-5zM15 9h.01"/>', cap: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', play: '<path d="M8 5l12 7-12 7z"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>', clap: '<path d="M4 9h16v11H4zM4 9l2-5 5 1-2 5M11 5l5 1-2 5"/>' };
  function main() { return $("main"); }
  function galOf() { return (S.gallery || []).filter(function (g) { return g && /^[\w-]+$/.test(g.id || "") && !g.hidden; }); }

  /* 1. hero */
  function hero() {
    var m = main(), k = L(), o = $("#hero2"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) o.remove();
    var cc = $("#cc"); if (!cc || cc.parentNode !== m) return;
    var T = k === "fa" ? { eb: "آکادمی و استودیوی خلاق سینه‌کد", l: ["منطقِ کد.", "جادوی سینما.", "هنرِ دیزاین."], p: "سینه‌کد یک پلتفرم آموزشی و فناوری خلاقانه است که علوم کامپیوتر، سینما و هنرهای گرافیکی را کنار هم می‌آورد.", b1: "تماشای ریلز", b2: "بیشتر ببین", sc: "پایین‌تر", sl: ["بیاموز.", "بساز.", "نوآوری کن."] }
      : { eb: "CINECODE ACADEMY & CREATIVE STUDIO", l: ["LOGIC OF CODE.", "MAGIC OF CINEMA.", "ART OF DESIGN."], p: "CineCode is a creative technology and educational platform bringing together Computer Science, Cinema, and Graphic Arts.", b1: "Watch Showreel", b2: "Explore More", sc: "Scroll Down", sl: ["Learn.", "Create.", "Innovate."] };
    var sr = S.showreel || {}, has = !!(sr.src || sr.yt), href = has ? (sr.yt ? "https://www.youtube.com/watch?v=" + encodeURIComponent(sr.yt) : sr.src) : "reels.html";
    if (!has && k === "fa") T.b1 = "تماشای ریلز"; else if (!has) T.b1 = "Watch Reels";
    var s = E("section", "h2", ""); s.id = "hero2"; s.dataset.k = k; s.setAttribute("aria-label", T.eb);
    s.innerHTML = '<div class="h2-bg" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<div class="h2-t"><p class="h2-eb">' + T.eb + '</p><h1 class="h2-h" aria-label="' + T.l.join(" ") + '"><span style="--i:0">' + T.l[0] + '</span><span style="--i:1" class="g">' + T.l[1] + '</span><span style="--i:2">' + T.l[2] + '</span></h1><p class="h2-p">' + T.p + '</p>' +
      '<div class="h2-b"><a class="h2-bt p" href="' + href + '"' + (sr.yt ? ' target="_blank" rel="noopener"' : "") + '>' + ic(ICO.play) + '<span>' + T.b1 + '</span></a><a class="h2-bt s" href="#uni"><span>' + T.b2 + '</span>' + ic(ICO.down) + '</a></div></div>' +
      '<div class="h2-v" aria-hidden="true"><svg class="h2-cam" viewBox="0 0 300 220" fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#7CCBF3" stroke-width="3"><circle cx="82" cy="52" r="34"/><circle cx="82" cy="52" r="10"/><circle cx="160" cy="52" r="34"/><circle cx="160" cy="52" r="10"/><rect x="40" y="92" width="170" height="90" rx="10"/><path d="M210 112l60-22v92l-60-22z"/><path d="M60 182l-18 30M190 182l18 30M125 182v30"/></g><g stroke="#39A9E8" stroke-width="2.4"><path d="M54 120h110M54 140h70"/><circle cx="188" cy="138" r="8"/></g></svg>' +
      '<div class="h2-ph"><img src="assets/img/me.webp" width="954" height="959" alt="" fetchpriority="high"></div>' +
      '<p class="h2-sl"><span>' + T.sl.join("</span><span>") + '</span></p></div>' +
      '<a class="h2-sc" href="#uni" aria-label="' + T.sc + '"><span>' + T.sc + '</span><i>' + ic(ICO.down) + '</i></a>';
    m.insertBefore(s, cc);
  }

  /* 2. creative universe */
  function universe() {
    var m = main(), k = L(), o = $("#uni"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) o.remove();
    var ref = $("#hero2") || $("#cc"); if (!ref || ref.parentNode !== m) return;
    var fa = k === "fa";
    var D = [[fa ? "فناوری" : "TECH", fa ? "علوم کامپیوتر، برنامه‌نویسی، هوش مصنوعی و توسعهٔ وب." : "Computer Science, Programming, Artificial Intelligence, Web Development.", "academy.html#courses", "#7CCBF3", ICO.code], [fa ? "فیلم" : "FILM", fa ? "سینما، فیلم‌سازی، فیلم‌برداری، تدوین، فیلم‌نامه و مستند." : "Cinema, Filmmaking, Cinematography, Editing, Screenwriting, Documentary.", "works.html", "#39A9E8", ICO.film], [fa ? "طراحی" : "DESIGN", fa ? "طراحی گرافیک، برندینگ، هنرهای تصویری و موشن گرافیک." : "Graphic Design, Branding, Visual Arts, Motion Graphics, Digital Creativity.", "graphics.html", "#D8E1EA", ICO.art]];
    var sec = E("section", "sec uni"); sec.id = "uni"; sec.dataset.k = k; sec.setAttribute("aria-label", fa ? "جهان خلاقانهٔ ما" : "Our creative universe");
    sec.innerHTML = '<div class="uni-h"><span class="eyb">02 / ' + (fa ? "جهان خلاقانهٔ ما" : "OUR CREATIVE UNIVERSE") + '</span><h2>' + (fa ? "سه جهان. یک دیدگاه." : "Three Worlds. One Vision.") + '</h2><p>' + (fa ? "فناوری، سینما و طراحی؛ در کنار هم برای آیندهٔ خلاق." : "Technology, cinema and design, combined for a creative future.") + '</p></div><div class="uni-g">' +
      D.map(function (d) { return '<a class="uni-c" href="' + d[2] + '" style="--c:' + d[3] + '">' + ic(d[4]) + '<b>' + d[0] + '</b><em>' + d[1] + '</em><span class="uni-a">' + ic(ICO.arrow) + "</span></a>"; }).join("") + "</div>";
    m.insertBefore(sec, ref.nextSibling);
  }

  /* 3. selected projects: real gallery items, one per category */
  function projects() {
    var m = main(), k = L(), o = $("#proj"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) o.remove();
    var ref = $("#uni"); if (!ref) return; var gal = galOf(); if (gal.length < 4) return;
    var fa = k === "fa", CN = fa ? { poster: "طراحی پوستر", academy: "طرح‌های آموزشی", banner: "بنر شبکه‌های اجتماعی", brand: "هویت بصری", print: "مواد چاپی" } : { poster: "Poster Design", academy: "Academy Design", banner: "Social Banners", brand: "Brand Identity", print: "Print Materials" };
    var pick = [], seen = {}; gal.forEach(function (g) { if (CN[g.cat] && !seen[g.cat] && pick.length < 4) { seen[g.cat] = 1; pick.push(g); } }); if (pick.length < 3) return;
    var sec = E("section", "sec proj"); sec.id = "proj"; sec.dataset.k = k; sec.setAttribute("aria-label", fa ? "پروژه‌های برگزیده" : "Selected creative projects");
    sec.innerHTML = '<div class="pj-top"><div><span class="eyb">03 / ' + (fa ? "نمونه‌کارهای برگزیده" : "SELECTED WORKS") + '</span><h2>' + (fa ? "پروژه‌های خلاق برگزیده" : "Selected Creative Projects") + '</h2><p>' + (fa ? "نگاهی به مسیر خلاقانهٔ ما." : "A glimpse into our creative journey.") + '</p></div><a class="h2-bt s" href="graphics.html"><span>' + (fa ? "همهٔ پروژه‌ها" : "View All Projects") + '</span>' + ic(ICO.arrow, "dir") + '</a></div><div class="pj-g">' +
      pick.map(function (g) { return '<a class="pj-c" href="graphics.html"><img src="assets/work/' + g.id + '.webp" alt="' + CN[g.cat] + '" loading="lazy" width="520" height="400"><span class="pj-l"><i>' + ic(ICO.play) + "</i>" + CN[g.cat] + "</span></a>"; }).join("") + "</div>";
    m.insertBefore(sec, ref.nextSibling);
  }


  /* 3b. motion bio video (own files, plays only on click; Persian and English versions) */
  function bio() {
    return; /* v183: intro video removed from the site */
    var m = main(), k = L(), o = $("#bio"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) { var vv = $("video", o); if (vv && !vv.paused) return; o.remove(); }
    var ref = $("#acad"); if (!ref || ref.parentNode !== m) return; var fa = k === "fa", vl = k;
    var V = { fa: { src: "assets/video/bio.mp4", vtt: "assets/video/bio-fa.vtt", poster: "assets/video/bio-poster.jpg", t: "1:04", lab: "فارسی" }, en: { src: "assets/video/bio-en.mp4", vtt: "assets/video/bio-en.vtt", poster: "assets/video/bio-poster-en.jpg", t: "0:54", lab: "English" } };
    var sec = E("section", "sec bmo"); sec.id = "bio"; sec.dataset.k = k; sec.setAttribute("aria-label", fa ? "ویدیوی موشن بیوگرافی" : "Motion biography");
    sec.innerHTML = '<div class="bio-h"><span class="eyb">' + (fa ? "ویدیو" : "MOTION BIO") + '</span><h2>' + (fa ? "ببین. بشنو. بشناس." : "Watch. Listen. Meet me.") + '</h2><p>' + (fa ? "بیوگرافی ۶۴ ثانیه‌ای انصارالحق مبارز با روایت صوتی فارسی؛ از کابل تا آکادمی سینه‌کد." : "A 54-second motion biography of Ansarulhaq Mubarez with English narration, from Kabul to CineCode Academy.") + '</p><div class="bio-sw" role="group" aria-label="' + (fa ? "زبان ویدیو" : "Video language") + '"><button type="button" data-l="fa">فارسی</button><button type="button" data-l="en">English</button></div></div>' +
      '<div class="bio-p"><button type="button" class="bio-play" aria-label="' + (fa ? "پخش ویدیو" : "Play video") + '"><img src="' + V[vl].poster + '" alt="" width="1280" height="720" loading="lazy"><span class="bio-b">' + ic('<path d="M8 5v14l11-7z"/>', "bio-i") + '</span><span class="bio-t mono">' + V[vl].t + ' · 720p</span></button></div>';
    m.insertBefore(sec, ref);
    function mark() { $$(".bio-sw button", sec).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.l === vl ? "true" : "false"); }); }
    function play() {
      var P = $(".bio-p", sec), v = E("video"); v.controls = true; v.playsInline = true; v.preload = "auto"; v.poster = V[vl].poster; v.src = V[vl].src; v.setAttribute("aria-label", fa ? "ویدیوی موشن بیوگرافی انصارالحق مبارز" : "Motion biography video");
      var tr = E("track"); tr.kind = "captions"; tr.srclang = vl; tr.label = V[vl].lab; tr.src = V[vl].vtt; tr.default = true; v.appendChild(tr);
      P.innerHTML = ""; P.appendChild(v); v.play().catch(function () {});
    }
    $(".bio-play", sec).addEventListener("click", play);
    $$(".bio-sw button", sec).forEach(function (b) { b.addEventListener("click", function () { vl = b.dataset.l; mark(); if ($("video", sec)) play(); else { var im = $(".bio-play img", sec), tt = $(".bio-t", sec); if (im) im.src = V[vl].poster; if (tt) tt.textContent = V[vl].t + " · 720p"; } }); });
    mark();
  }

  /* 4. academy banner */
  function labt() {
    var m = main(), k = L(), o = $("#labt"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) o.remove();
    var ref = $("#bio") || $("#acad"); if (!ref || ref.parentNode !== m) return; var fa = k === "fa";
    var I = fa ? [["رنگ‌بندی سینمایی", "عکس خودت را مثل فیلم رنگ‌بندی کن"], ["استودیوی پوستر", "پوستر بساز و دانلود کن"], ["جستجوی آثار با رنگ", "آثار من را بر اساس رنگ پیدا کن"], ["مسیر یادگیری من", "کارت مسیر یادگیری بساز"], ["سازندهٔ ریل", "از آثار من ویدیو با موسیقی بساز"], ["مربی ترکیب‌بندی", "تحلیل نور، رنگ و کادر عکس"], ["تایپوگرافی متحرک", "متن را به کلیپ تبدیل کن"], ["کوررنگی و کنتراست", "طراحی‌ات برای همه خوانا است؟"], ["سازندهٔ زیرنویس", "فایل SRT و VTT بساز"], ["استوری‌بورد", "برگهٔ استوری‌بورد شش‌قابی"], ["نوار نام‌نمایی", "نوار و موشن‌گرافیک برای ویدیو"], ["مطالعهٔ موردی", "برگهٔ مطالعهٔ موردی پروژه"], ["ماشین‌حساب فیلم", "تایم‌کد، حجم فایل، اندازه و شاتر"], ["منحنی حرکت", "منحنی نرم برای انیمیشن و موشن"], ["پیش‌فاکتور", "برگهٔ قیمت برای مشتری"], ["کارت برند", "رنگ و کارت برند تازه"], ["نواحی امن شبکه‌ها", "قالب ریلز، شورتس و پست"], ["شات‌لیست", "برگهٔ روز فیلم‌برداری"], ["پیشنهاد کار", "متن پیشنهاد حرفه‌ای برای مشتری"], ["تقویم محتوا", "برنامهٔ ۳۰ روزه برای شبکه‌ها"], ["کپشن شبکه‌ها", "متن پست با شمارندهٔ سقف نویسه"], ["اندازهٔ عکس شبکه‌ها", "عکس را به اندازهٔ هر شبکه ببر"], ["امضای ایمیل", "امضای حرفه‌ای آماده"], ["ماشین‌حساب چاپ", "اندازه، DPI و بلید برای چاپ"]] : [["Cinema grade", "Colour-grade your photo like a film"], ["Poster studio", "Design and download a poster"], ["Search by colour", "Find my works by colour"], ["My learning path", "Get a learning path card"], ["Reel maker", "Make a video with music from my works"], ["Composition coach", "Light, colour and framing analysis"], ["Kinetic type", "Turn text into a motion clip"], ["Vision & contrast", "Is your design readable for everyone?"], ["Subtitle maker", "Make SRT and VTT files"], ["Storyboard", "A six-frame storyboard sheet"], ["Lower thirds", "Motion bars for your video"], ["Case study", "A project case study sheet"], ["Film calculators", "Timecode, file size, resize, shutter"], ["Motion easing", "Design smooth motion curves"], ["Quote sheet", "A price sheet for your client"], ["Brand kit", "Colours and a brand card"], ["Social safe zones", "Reels, Shorts and post templates"], ["Shot list", "A sheet for shoot day"], ["Proposal writer", "A client-ready proposal outline"], ["Content calendar", "A 30-day posting plan"], ["Caption maker", "Post text with character limits"], ["Social image sizes", "Crop a photo for each network"], ["Email signature", "A tidy professional signature"], ["Print size and DPI", "Size, DPI and bleed for print"]];
    var sec = E("section", "sec lbt"); sec.id = "labt"; sec.dataset.k = k; sec.setAttribute("aria-label", "CineCode Lab");
    sec.innerHTML = '<div class="bio-h"><span class="eyb">LAB</span><h2>' + (fa ? "آزمایشگاه خلاق" : "Creative Lab") + '</h2><p>' + (fa ? "بیست‌وچهار ابزار رایگان که در مرورگر خودت اجرا می‌شوند. بازی کن، بساز و دانلود کن؛ چیزی آپلود نمی‌شود." : "Twenty-four free tools that run in your own browser. Play, make and download; nothing is uploaded.") + '</p></div><div class="lbt-g">' + I.slice(0, 8).map(function (r, i) { return '<a class="lbt-c" href="lab.html?t=' + i + '"><b>' + (i + 1) + '</b><span>' + r[0] + '</span><small>' + r[1] + '</small></a>'; }).join("") + '<a class="lbt-c lbt-more" href="lab.html"><b>+' + (I.length - 8) + '</b><span>' + (fa ? "دیدن همهٔ ابزارها" : "See all tools") + '</span><small>' + (fa ? "ابزارهای رایگان بیشتر در Lab" : "More free tools in the Lab") + '</small></a></div>';
    m.insertBefore(sec, ref);
  }
  function academy() {
    var m = main(), k = L(), o = $("#acad"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) o.remove();
    var ref = $("#courses"); if (!ref || ref.parentNode !== m) return; var fa = k === "fa";
    var sec = E("section", "sec acad"); sec.id = "acad"; sec.dataset.k = k; sec.setAttribute("aria-label", fa ? "آکادمی سینه‌کد" : "CineCode Academy");
    sec.innerHTML = '<div class="ac-l">' + ic(ICO.cap, "ac-cap") + '<div><span class="eyb">04 / ' + (fa ? "آکادمی" : "THE ACADEMY") + '</span><h2>' + (fa ? "یاد بگیر. بساز. بنا کن." : "Learn. Create. Build.") + '</h2><p>' + (fa ? "دوره‌های رایگان و پروژه‌محور در سینما، طراحی گرافیک و علوم کامپیوتر؛ با آزمون و گواهی QR." : "Free and project-based courses in Cinema, Graphic Design and Computer Science, with quizzes and QR certificates.") + '</p><a class="h2-bt p" href="academy.html"><span>' + (fa ? "دیدن دوره‌ها" : "Explore Courses") + '</span>' + ic(ICO.arrow, "dir") + '</a></div></div>' +
      '<div class="ac-v" aria-hidden="true"><svg viewBox="0 0 320 200" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="14" width="280" height="150" rx="10" stroke="#39A9E8" stroke-width="3"/><path d="M110 184h100M160 164v20" stroke="#39A9E8" stroke-width="3"/><g stroke="#7CCBF3" stroke-width="2.4"><rect x="36" y="30" width="120" height="70" rx="4"/><path d="M52 84l24-24 18 16 22-30 24 38"/><path d="M36 116h248M36 136h248"/></g><g stroke="#D8E1EA" stroke-width="5"><path d="M44 116h60M120 116h90M60 136h50M130 136h120"/></g><g stroke="#39A9E8" stroke-width="2.4"><path d="M176 34h108M176 52h84M176 70h96M176 88h60"/></g></svg></div>';
    m.insertBefore(sec, ref);
  }

  /* 5. process */
  function process2() {
    var m = main(), k = L(), o = $("#proc2"); if (PAGE !== "home" || !m) return; if (o && o.dataset.k === k) return; if (o) o.remove();
    var ref = $("#about"); if (!ref || ref.parentNode !== m) return; var fa = k === "fa";
    var P = fa ? [["۱. کشف", "پیدا کردن ایده", ICO.bulb], ["۲. مفهوم", "طرح‌ریزی دیدگاه", ICO.pen], ["۳. ساخت", "تولید و طراحی", ICO.gear], ["۴. تحویل", "ارائهٔ نتیجه", ICO.rocket]] : [["1. Discover", "Find the Idea", ICO.bulb], ["2. Concept", "Plan the Vision", ICO.pen], ["3. Create", "Produce & Design", ICO.gear], ["4. Deliver", "Share the Result", ICO.rocket]];
    var sec = E("section", "sec proc2"); sec.id = "proc2"; sec.dataset.k = k; sec.setAttribute("aria-label", fa ? "مسیر خلاقانهٔ ما" : "Our creative process");
    sec.innerHTML = '<div class="pc-h"><span class="eyb">05 / ' + (fa ? "مسیر ما" : "OUR PROCESS") + '</span><h2>' + (fa ? "از ایده تا اثر" : "From Idea to Impact") + '</h2></div><ol class="pc-g">' +
      P.map(function (p, i) { return '<li style="--i:' + i + '"><span class="pc-c">' + ic(p[2]) + '</span><b>' + p[0] + '</b><em>' + p[1] + "</em></li>"; }).join('<li class="pc-ar" aria-hidden="true">' + ic(ICO.arrow, "dir") + "</li>") + "</ol>";
    m.insertBefore(sec, ref);
  }

  /* 6. stats after founder + CTA band before contact */
  function reorder() {
    var m = main(); if (PAGE !== "home" || !m) return; var ab = $("#about"), nu = $("#numbers");
    /* v145: removed - it fought fx2 layout() over the order of #numbers and re-rendered the page ~3x/s (the blinking) */
    var k = L(), o = $("#cta2"), ct = $("#contact"); if (!ct || ct.parentNode !== m || (o && o.dataset.k === k)) return; if (o) o.remove(); var fa = k === "fa";
    var s = E("section", "sec cta2"); s.id = "cta2"; s.dataset.k = k; s.setAttribute("aria-label", fa ? "شروع پروژه" : "Start a project");
    s.innerHTML = ic(ICO.clap, "cta-ic") + '<div><h2>' + (fa ? "بیایید چیزی خارق‌العاده بسازیم." : "LET'S CREATE SOMETHING EXTRAORDINARY.") + '</h2><p>' + (fa ? "ایده‌ای داری؟ بیا زنده‌اش کنیم." : "Have an idea? Let's bring it to life.") + '</p></div><a class="h2-bt p" href="#contact"><span>' + (fa ? "شروع پروژه" : "Start a Project") + '</span>' + ic(ICO.arrow, "dir") + "</a>";
    m.insertBefore(s, ct);
  }

  /* 7. footer: brand column + newsletter (writes to public.newsletter_subscribers, see HANDOFF/cms-10.sql) */
  function footer() {
    var f = $("#site-footer .ft-grid"); if (!f) return; var fa = L() === "fa", k = L();
    var b = $("#ftBrand"), n = $("#ftNews"); if (b && b.dataset.k === k && n) return; if (b) b.remove(); if (n) n.remove();
    b = E("div", "ft-brand", '<img class="lg lg-l" src="assets/img/logo-full.png" width="184" height="47" alt="CineCode" loading="lazy"><img class="lg lg-d" src="assets/img/logo-full-light.png" width="184" height="47" alt="" aria-hidden="true" loading="lazy"><p>' + (fa ? "بیاموز. بساز. نوآوری کن." : "Learn. Create. Innovate.") + "</p>"); b.id = "ftBrand"; b.dataset.k = k; f.insertBefore(b, f.firstChild);
    n = E("div", "ft-news"); n.id = "ftNews";
    n.innerHTML = '<h3>' + (fa ? "عضویت در خبرنامه" : "Subscribe to Our Newsletter") + '</h3><form novalidate><label class="sr" for="nlE">' + (fa ? "ایمیل" : "Email") + '</label><input id="nlE" type="email" inputmode="email" autocomplete="email" maxlength="254" placeholder="' + (fa ? "ایمیل شما" : "Your Email Address") + '" dir="ltr"><button type="submit" aria-label="' + (fa ? "ارسال" : "Subscribe") + '">' + ic(ICO.arrow, "dir") + '</button></form><p class="nl-m" role="status" aria-live="polite"></p>';
    f.appendChild(n);
    var form = $("form", n), msg = $(".nl-m", n);
    form.addEventListener("submit", function (e) {
      e.preventDefault(); var em = $("#nlE").value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg.textContent = fa ? "ایمیل درست نیست." : "Please enter a valid email."; return; }
      var SB = window.__SB; if (!SB || !SB.on || !SB.on() || !SB.send) { msg.textContent = fa ? "خبرنامه هنوز فعال نشده است." : "The newsletter is not enabled yet."; return; }
      msg.textContent = "…"; SB.send("POST", "newsletter_subscribers", { email: em, lang: k }, "return=minimal").then(function () { msg.textContent = fa ? "ثبت شد. سپاس!" : "Subscribed. Thank you!"; form.reset(); }).catch(function (er) { msg.textContent = er && er.status === 409 ? (fa ? "این ایمیل قبلاً ثبت شده است." : "This email is already subscribed.") : (fa ? "ثبت نشد. بعداً دوباره امتحان کن." : "Could not subscribe. Please try again later."); });
    });
  }


  /* founder heading like the reference (name and role come from the owner's own words) */
  function founder() {
    var a = $("#about"), m = main(); if (PAGE !== "home" || !a || !m) return; var fa = L() === "fa", h = $("h2", a); if (!h) return;
    var t = fa ? "با بنیان‌گذار آشنا شوید" : "Meet the Founder";
    if (h.textContent.trim() !== t && !h.dataset.fnd) { h.dataset.fnd = "1"; h.removeAttribute("aria-label"); h.textContent = t; }
    var o = $(".fn-nm", a), k = fa ? "fa" : "en"; if (o && o.dataset.k === k) return; if (o) o.remove();
    var e = E("div", "fn-nm", '<span class="eyb">06 / ' + (fa ? "بنیان‌گذار" : "FOUNDER") + '</span><b>' + (fa ? "انصارالحق مبارز" : "Ansarulhaq Mubarez") + '</b><em>' + (fa ? "بنیان‌گذار · فیلم‌ساز · طراح گرافیک" : "Founder · Filmmaker · Graphic Designer") + "</em>"); e.dataset.k = k;
    h.parentNode.insertBefore(e, h.nextSibling);
  }
  function all() { try { founder(); } catch (e) {} try { hero(); universe(); projects(); academy(); bio(); labt(); process2(); reorder(); footer(); } catch (e) { if (window.console) console.warn("cine", e); } }
  var t = 0; function soon() { clearTimeout(t); t = setTimeout(all, 250); }
  all(); setTimeout(all, 900); setTimeout(all, 2500);
  try { new MutationObserver(soon).observe(document.querySelector("main") || document.body, { childList: true }); new MutationObserver(soon).observe(document.getElementById("site-footer") || document.body, { childList: true }); } catch (e) {}
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("#langM,.lang-opt,[data-lang]")) setTimeout(all, 400); });
})();
