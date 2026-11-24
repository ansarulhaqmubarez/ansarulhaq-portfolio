/* =====================================================================
   CENTRAL CONTENT FILE. Edit only this file to change the site's text,
   links, projects and certificates. No other file needs to change.

   Rules used by the site:
   - sample:true  -> the item is shown with a "Sample" label and is NOT a real record.
                     Set sample:false (or delete the line) once the item is real and verified.
   - show:false   -> hides a link without deleting it.
   - Empty value  -> the matching part of the page stays hidden or shows "not added yet".
   ===================================================================== */
window.SITE = {
  /* Replace with the real domain once it is bought, e.g. "https://ansarulhaq.com" */
  domain: "https://delicate-frost-e2d6.cinecode.workers.dev",

  /* Leave "" to keep the email private (the contact form is used instead).
     Never put a password or secret key in this file: this file is public. */
  contactEmail: "amobariz383@gmail.com",

  /* Public phone. The owner chose to show it. Set "" to hide it. */
  phone: "+93777100489",

  /* Second public e-mail and all public phone numbers (editable later from the admin panel). */
  contactEmail2: "ansarulhaq.af@gmail.com",
  phones: [
    { n: "+93777100489", show: "0777100489", wa: true, tg: true },
    { n: "+93749261410", show: "0749261410" },
    { n: "+93789189866", show: "0789189866" }
  ],

  /* Account system. Fill after creating a free Supabase project (Project URL and the anon PUBLIC key only; never the service key). */
  supabaseUrl: "https://ttmkhuitmqfdfmtfiekv.supabase.co",
  supabaseAnonKey: "sb_publishable_VZZQprfm7xTUdASUtJTYEw_Z0yoT5t-",   /* public key, safe in the browser. NEVER put the secret key here. */

  /* Web3Forms: put its public access key here (free), and set formEndpoint to https://api.web3forms.com/submit */
  formKey: "a76a22ab-42f1-41c7-a0f7-706b22756e93",   /* Web3Forms public key (safe in the browser) */

  /* Public form endpoint from a form service (Formspree, Web3Forms, Basin ...).
     Leave "" until you create one. The form then tells the visitor it is not connected. */
  formEndpoint: "https://api.web3forms.com/submit",

  /* Map: area only (Kabul), never an exact address. Change the numbers to move the map. The map is loaded from OpenStreetMap only after the visitor clicks. */
  mapArea: { lat: 34.5281, lon: 69.1723, zoom: 13 },

  /* "open" = available for work, "busy" = not available, "" = hide the badge */
  availability: "open",

  name: { fa: "انصارالحق مبارز", en: "Ansarulhaq Mubarez" },
  roles: {
    fa: "فیلم‌ساز · تدوینگر · طراح گرافیک · علوم کامپیوتر",
    en: "Filmmaker · Editor · Graphic Designer · Computer Science"
  },
  city: { fa: "کابل، افغانستان", en: "Kabul, Afghanistan" },
  tagline: {
    fa: "به برندها و مراکز آموزشی کمک می‌کنم داستان‌شان را با تصویر، تدوین و طراحی بگویند.",
    en: "I help brands and educational centers tell their story through visuals, editing and design."
  },

  /* Short intro on the home page. Write from verified facts only. */
  about: {
    sample: false,
    fa: "فیلم‌ساز، تدوینگر و طراح گرافیک از کابل. در دانشگاه کابل هنر سمعی و بصری (سینما) و در دانشگاه سلام علوم کامپیوتر می‌خوانم. برای مراکز آموزشی طراحی و تدوین کرده‌ام و فیلم‌های تبلیغاتی و آموزشی ساخته‌ام. هدفم رساندن مهارت فیلم‌سازی و پست‌پروداکشن به سطح بین‌المللی و ساختن قصه‌های معنادار است.",
    en: "Filmmaker, video editor and graphic designer from Kabul. I study audio-visual arts (cinema) at Kabul University and computer science at Salam University. I have designed and edited for educational centers and made promotional and educational films. My goal is to bring my filmmaking and post-production to an international level and to tell meaningful stories."
  },

  socials: [
    { label: "YouTube",   url: "https://www.youtube.com/channel/UC6yhRDtO4fO_2j_2EmW5SCg",  show: true },
    { label: "Behance",   url: "https://www.behance.net/ansarulhaqmubarez",                 show: true },
    { label: "GitHub",    url: "https://github.com/ansarulhaqmubarez",                      show: true },
    { label: "LinkedIn",  url: "https://www.linkedin.com/in/mobariz-tv-16b4b8311",          show: true },
    { label: "Instagram", url: "https://www.instagram.com/ansrulhaq.af",                    show: true },
    { label: "TikTok",    url: "https://www.tiktok.com/@mobariz_tv",                        show: true },
    { label: "X",         url: "https://x.com/AnsarMobariz",                                show: true },
    { label: "Threads",   url: "https://www.threads.com/@ansarulhaq_2005",                  show: true },
    { label: "Facebook",  url: "https://www.facebook.com/share/19GMj5KH5j/",                show: true },
    { label: "Snapchat",  url: "https://www.snapchat.com/add/mubarez_2005",                 show: true },
    { label: "Telegram",  url: "https://t.me/ansar_mubarez2005",                            show: false },
    { label: "Pinterest", url: "https://www.pinterest.com/ansarulhaq_2005/",                show: false }
    /* WhatsApp group invite and phone number: kept out on purpose (privacy). */
  ],

  /* YouTube playlists. Titles are the owner's own names; confirm them. */
  playlists: [
    { id:"y1", title:{fa:"پلی‌لیست",en:"Playlist"},                 url:"https://www.youtube.com/playlist?list=PLuJC2bt_xleuKFiGXgAoqvqcy0bIxsC1i" },
    { id:"y2", title:{fa:"دانشگاه",en:"University"},               url:"https://www.youtube.com/playlist?list=PLuJC2bt_xles2dFCF--LF9S3gzCMRbyYi" },
    { id:"y3", title:{fa:"میز نور",en:"Noor Table"},               url:"https://www.youtube.com/playlist?list=PLuJC2bt_xletCFJLdz38NRfZ2dVPug2xW" },
    { id:"y4", title:{fa:"همبرگ‌های از آسمان",en:"Hamburgers from the Sky"}, url:"https://www.youtube.com/playlist?list=PLuJC2bt_xlevmyeRdYo4x5LjPnafHbGbV" }
  ],

  /* Scroll-scrubbed hero video (optional). Put hero/hero.mp4 (encoded with tools/encode-hero.sh) and set src. Empty src = off. */
  heroVideo: { src: "", poster: "" },

  /* Scroll-driven hero frames (optional). Put numbered images in the folder, e.g. hero/Hero_001.jpg ... Hero_050.jpg.
     Leave first/last empty to turn it off. count is checked against the real range. */
  hero: { folder: "hero", first: "", last: "", count: 0 },


  /* Only tools you have confirmed. Add more here. */
  // Slides shown in the home slider. href must be a page of this site or a full https link.
  banners: [
    { id:"b1", tag:{fa:"جدید",en:"New"}, title:{fa:"آکادمی رایگان، به‌زودی",en:"A free academy, coming soon"}, text:{fa:"دوره‌های ویدیویی، آزمون و گواهی با QR. هنوز آماده نیست؛ در حال برنامه‌ریزی است.",en:"Video courses, exams and QR certificates. Not ready yet; it is being planned."}, href:"#contact", cta:{fa:"خبرم کن",en:"Tell me when"}, c:"a" },
    { id:"b2", tag:{fa:"نمونه",en:"Sample"}, title:{fa:"کارهای برگزیده",en:"Featured work"}, text:{fa:"چند پروژه نمونه از تدوین و طراحی. جای آن‌ها را کارهای واقعی می‌گیرد.",en:"A few sample projects in editing and design. Real work will replace them."}, href:"#work", cta:{fa:"دیدن کارها",en:"See the work"}, c:"b" },
    { id:"b3", tag:{fa:"رسانه",en:"Press"}, title:{fa:"کیت رسانه‌ای",en:"Press kit"}, text:{fa:"بیو، حقایق کوتاه و فایل‌ها برای رسانه‌ها و جشنواره‌ها.",en:"Bio, quick facts and files for media and festivals."}, href:"presskit.html", cta:{fa:"باز کردن",en:"Open"}, c:"c" }
  ],
  marquee: { fa:["فیلم‌سازی","تدوین","موشن","طراحی گرافیک","برند","علوم کامپیوتر","وب","کابل"], en:["Filmmaking","Editing","Motion","Graphic design","Branding","Computer science","Web","Kabul"] },
  /* Extra tools listed in the owner's own CV (names only, no self-rated levels). */
  cvTools: ["FL Studio", "VideoStudio", "Microsoft Office"],
  /* Certificates shown on the CV (ids from certs) */
  cvCerts: ["c17", "c20", "c19", "c28", "c42", "c44", "c43", "c27"],
  skills: {
    video:  [["Pr", "Premiere Pro"], ["Ae", "After Effects"], ["Dr", "DaVinci Resolve"]],
    design: [["Ps", "Photoshop"], ["Ai", "Illustrator"]]
  },

  /* cat: edit | design | code.  youtube: video id only (the part after v=), "" if none.
     year: number or null. beforeAfter: true shows the before/after slider. */
  /* Graphic design works (owner's files). cat: poster|academy|banner|brand|print */
  gallery: [
    {id: "w001", cat: "poster", w: 640, h: 640},
    {id: "w002", cat: "poster", w: 512, h: 640},
    {id: "w003", cat: "poster", w: 360, h: 640},
    {id: "w004", cat: "poster", w: 491, h: 640},
    {id: "w006", cat: "poster", w: 640, h: 640},
    {id: "w007", cat: "poster", w: 640, h: 640},
    {id: "w008", cat: "poster", w: 637, h: 640},
    {id: "w009", cat: "poster", w: 594, h: 640},
    {id: "w010", cat: "poster", w: 528, h: 640},
    {id: "w011", cat: "poster", w: 640, h: 365},
    {id: "w014", cat: "poster", w: 640, h: 505},
    {id: "w015", cat: "poster", w: 640, h: 640},
    {id: "w016", cat: "poster", w: 583, h: 640},
    {id: "w020", cat: "poster", w: 624, h: 640},
    {id: "w021", cat: "poster", w: 360, h: 640},
    {id: "w022", cat: "poster", w: 640, h: 640},
    {id: "w025", cat: "poster", w: 360, h: 640},
    {id: "w026", cat: "poster", w: 360, h: 640},
    {id: "w028", cat: "poster", w: 630, h: 640},
    {id: "w030", cat: "poster", w: 634, h: 640},
    {id: "w031", cat: "poster", w: 640, h: 547},
    {id: "w032", cat: "poster", w: 559, h: 640},
    {id: "w033", cat: "poster", w: 640, h: 640},
    {id: "w035", cat: "poster", w: 640, h: 605},
    {id: "w038", cat: "poster", w: 640, h: 544},
    {id: "w053", cat: "poster", w: 640, h: 640},
    {id: "w054", cat: "poster", w: 640, h: 640},
    {id: "w058", cat: "poster", w: 480, h: 640},
    {id: "w059", cat: "poster", w: 475, h: 640},
    {id: "w061", cat: "poster", w: 637, h: 640},
    {id: "w064", cat: "poster", w: 640, h: 640},
    {id: "w065", cat: "poster", w: 640, h: 640},
    {id: "w066", cat: "poster", w: 640, h: 640},
    {id: "w072", cat: "poster", w: 494, h: 640},
    {id: "w075", cat: "poster", w: 636, h: 640},
    {id: "w077", cat: "poster", w: 640, h: 640},
    {id: "w078", cat: "poster", w: 640, h: 547},
    {id: "w079", cat: "poster", w: 608, h: 640},
    {id: "w080", cat: "poster", w: 640, h: 640},
    {id: "w087", cat: "poster", w: 636, h: 640},
    {id: "w005", cat: "academy", w: 640, h: 640},
    {id: "w012", cat: "academy", w: 640, h: 640},
    {id: "w013", cat: "academy", w: 640, h: 640},
    {id: "w018", cat: "academy", w: 491, h: 640},
    {id: "w019", cat: "academy", w: 640, h: 640},
    {id: "w023", cat: "academy", w: 640, h: 625},
    {id: "w027", cat: "academy", w: 640, h: 640},
    {id: "w029", cat: "academy", w: 598, h: 640},
    {id: "w034", cat: "academy", w: 640, h: 640},
    {id: "w039", cat: "academy", w: 452, h: 640},
    {id: "w045", cat: "academy", w: 640, h: 452},
    {id: "w046", cat: "academy", w: 640, h: 452},
    {id: "w052", cat: "academy", w: 640, h: 640},
    {id: "w055", cat: "academy", w: 418, h: 640},
    {id: "w056", cat: "academy", w: 488, h: 640},
    {id: "w060", cat: "academy", w: 640, h: 638},
    {id: "w062", cat: "academy", w: 640, h: 640},
    {id: "w063", cat: "academy", w: 409, h: 640},
    {id: "w082", cat: "academy", w: 640, h: 640},
    {id: "w083", cat: "academy", w: 545, h: 640},
    {id: "w084", cat: "academy", w: 640, h: 355},
    {id: "w091", cat: "academy", w: 636, h: 640},
    {id: "w017", cat: "banner", w: 640, h: 360},
    {id: "w024", cat: "banner", w: 640, h: 368},
    {id: "w041", cat: "banner", w: 640, h: 342},
    {id: "w042", cat: "banner", w: 640, h: 360},
    {id: "w057", cat: "banner", w: 640, h: 397},
    {id: "w090", cat: "banner", w: 640, h: 365},
    {id: "w047", cat: "brand", w: 640, h: 494},
    {id: "w067", cat: "brand", w: 640, h: 480},
    {id: "w070", cat: "brand", w: 640, h: 384},
    {id: "w071", cat: "brand", w: 640, h: 106},
    {id: "w076", cat: "brand", w: 640, h: 452},
    {id: "w081", cat: "brand", w: 636, h: 640},
    {id: "w085", cat: "brand", w: 640, h: 274},
    {id: "w086", cat: "brand", w: 640, h: 480},
    {id: "w089", cat: "brand", w: 640, h: 640},
    {id: "w048", cat: "print", w: 640, h: 452},
    {id: "w049", cat: "print", w: 640, h: 452},
    {id: "w051", cat: "print", w: 640, h: 636},
    {id: "w068", cat: "print", w: 640, h: 320},
    {id: "w069", cat: "print", w: 640, h: 384},
    {id: "w073", cat: "print", w: 414, h: 640},
    {id: "w074", cat: "print", w: 414, h: 640}
  ],

  /* Case study fields (all optional, shown only when filled, real facts only):
     summary, brief, process, result: {fa,en}; role: {fa,en}; tools: []; credits: [{k:{fa,en},v:""}];
     tags: { client, scale, industry, country, outcome } each string or {fa,en}. Mark sample:false only for a real project. */
  projects: [
    { id: "p1", cat: "edit",   sample: true, year: null, tc: "00:00:12:08", x: "82%", y: "18%", youtube: "", beforeAfter: true,  tools: [], credits: [] },
    { id: "p2", cat: "design", sample: true, year: null, tc: "00:00:07:15", x: "20%", y: "30%", youtube: "", beforeAfter: false, tools: [], credits: [] },
    { id: "p3", cat: "edit",   sample: true, year: null, tc: "00:01:03:02", x: "70%", y: "80%", youtube: "", beforeAfter: true,  tools: [], credits: [] },
    { id: "p4", cat: "code",   sample: true, year: null, tc: "00:00:00:00", x: "15%", y: "85%", youtube: "", beforeAfter: false, tools: [], credits: [] },
    { id: "p5", cat: "design", sample: true, year: null, tc: "00:00:21:11", x: "90%", y: "50%", youtube: "", beforeAfter: false, tools: [], credits: [] },
    { id: "p6", cat: "edit",   sample: true, year: null, tc: "00:00:45:20", x: "40%", y: "10%", youtube: "", beforeAfter: false, tools: [], credits: [] }
  ],

  /* cat: cs | design | film. verifyUrl: the issuer's official verification page, "" if none. */
  /* Work history. Years only until exact dates are confirmed. No numbers or claims without proof. */
  experience: [
    { id:"x1", org:"AlifBa Educational Center", role:{fa:"طراح گرافیک و تدوینگر ویدیو",en:"Graphic designer and video editor"}, when:{fa:"۲۰۲۳ تا ۲۰۲۴",en:"2023 to 2024"}, text:{fa:"طراحی و تدوین مواد تبلیغاتی و آموزشی مرکز آموزشی.",en:"Designed and edited promotional and educational material for the center."} },
    { id:"x2", org:"Academy Baitul Hamd", role:{fa:"طراح گرافیک و فیلم‌ساز آموزشی",en:"Graphic designer and educational filmmaker"}, when:{fa:"۲۰۲۴ تا ۲۰۲۵",en:"2024 to 2025"}, text:{fa:"ساخت فیلم‌های آموزشی و تبلیغاتی و طراحی گرافیکی برای آکادمی.",en:"Made educational and promotional films and graphic design for the academy."} }
  ],

  /* Languages: names only. Add a level only when it is proven (EF SET shows English B2). */
  languages: [
    { fa:"دری", en:"Dari" }, { fa:"پشتو", en:"Pashto" }, { fa:"انگلیسی", en:"English" }, { fa:"عربی", en:"Arabic" }
  ],

  /* Education: current studies, as stated by the owner. Keep proof documents ready if an organisation asks. */
  education: [
    { id:"e1", school:{fa:"دانشگاه کابل",en:"Kabul University"}, field:{fa:"هنر سمعی و بصری (سینما)",en:"Audio-visual arts (cinema)"}, status:{fa:"سمستر ششم، سال سوم",en:"Semester 6, year 3"} },
    { id:"e2", school:{fa:"دانشگاه سلام",en:"Salam University"}, field:{fa:"علوم کامپیوتر",en:"Computer science"}, status:{fa:"سمستر سوم، سال دوم",en:"Semester 3, year 2"} },
    { id:"e3", school:{fa:"دانشگاه باز افغانستان (آنلاین)",en:"Afghanistan Open University (online)"}, field:{fa:"علوم کامپیوتر",en:"Computer science"}, status:{fa:"سمستر اول، سال اول",en:"Semester 1, year 1"} },
    { id:"e4", school:{fa:"یونیورسیتی آف د پیپل (آنلاین)",en:"University of the People (online)"}, field:{fa:"علوم کامپیوتر",en:"Computer science"}, status:{fa:"سمستر اول",en:"Semester 1"} }
  ],

  /* Academy courses shown as "coming soon". Sample until the owner writes real courses. */
  courses: [
    { id:"k1", sample:true, level:{fa:"مبتدی",en:"Beginner"}, status:"soon", cat:{fa:"فیلم‌سازی و تدوین",en:"Filmmaking, Editing"}, title:{fa:"مبانی تدوین ویدیو",en:"Video editing basics"}, text:{fa:"برش، ریتم، صدا و خروجی. با پروژه عملی.",en:"Cuts, rhythm, sound and export, with a hands-on project."},
      lessons:[{fa:"آشنایی با محیط تدوین",en:"Meet the editing workspace"},{fa:"برش و ریتم",en:"Cutting and rhythm"},{fa:"صدا و موسیقی",en:"Sound and music"},{fa:"رنگ و خروجی",en:"Colour and export"},{fa:"پروژه پایانی",en:"Final project"}] },
    { id:"k2", sample:true, level:{fa:"مبتدی",en:"Beginner"}, status:"soon", cat:{fa:"طراحی گرافیک",en:"Graphic design"}, title:{fa:"مبانی طراحی گرافیک",en:"Graphic design basics"}, text:{fa:"رنگ، تایپوگرافی و چیدمان برای پوستر و شبکه‌های اجتماعی.",en:"Colour, typography and layout for posters and social media."},
      lessons:[{fa:"اصول بصری",en:"Visual principles"},{fa:"رنگ",en:"Colour"},{fa:"تایپوگرافی",en:"Typography"},{fa:"چیدمان",en:"Layout"},{fa:"پروژه پایانی",en:"Final project"}] },
    { id:"k3", sample:true, level:{fa:"مبتدی",en:"Beginner"}, status:"soon", cat:{fa:"علوم کامپیوتر",en:"Computer science"}, title:{fa:"برنامه‌نویسی با پایتون",en:"Python for beginners"}, text:{fa:"از اولین خط تا برنامه‌های کوچک.",en:"From the first line to small programs."},
      lessons:[{fa:"نصب و اولین برنامه",en:"Setup and first program"},{fa:"متغیرها و شرط‌ها",en:"Variables and conditions"},{fa:"حلقه‌ها",en:"Loops"},{fa:"تابع‌ها",en:"Functions"},{fa:"پروژه پایانی",en:"Final project"}] }
  ],

  /* Study library: third-party links only (first:false). Check each link before launch; add your own material with first:true. */
  library: [
    { id:"l1", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"تدوین",en:"Editing"}, title:{fa:"آموزش‌های رسمی DaVinci Resolve",en:"DaVinci Resolve official training"}, text:{fa:"آموزش‌های رایگان نرم‌افزار از سازنده آن.",en:"Free training for the software, from its maker."}, url:"https://www.blackmagicdesign.com/products/davinciresolve/training" },
    { id:"l2", type:"video", first:false, free:true, level:"Intermediate", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"Blender Studio: فیلم‌های متن‌باز",en:"Blender Studio: open movies"}, text:{fa:"فیلم‌های کوتاه متن‌باز همراه با فایل‌های تولید.",en:"Open short films with their production files."}, url:"https://studio.blender.org" },
    { id:"l3", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"علوم کامپیوتر",en:"Computer science"}, title:{fa:"Saylor Academy",en:"Saylor Academy"}, text:{fa:"دوره‌های رایگان دانشگاهی با گواهی.",en:"Free college-level courses with certificates."}, url:"https://www.saylor.org" },
    { id:"l4", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"OpenLearn (دانشگاه باز بریتانیا)",en:"OpenLearn (The Open University)"}, text:{fa:"دوره‌های کوتاه رایگان در موضوع‌های گوناگون.",en:"Short free courses on many subjects."}, url:"https://www.open.edu/openlearn/" },
    { id:"l5", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"طراحی گرافیک",en:"Graphic design"}, title:{fa:"Google Fonts",en:"Google Fonts"}, text:{fa:"فونت‌های رایگان و متن‌باز برای طراحی.",en:"Free, open-source fonts for design."}, url:"https://fonts.google.com" },
    { id:"l6", type:"sound", first:false, free:true, level:"Beginner", cat:{fa:"صدا",en:"Sound"}, title:{fa:"Freesound",en:"Freesound"}, text:{fa:"جلوه‌های صوتی با مجوز آزاد. مجوز هر فایل را بخوان.",en:"Sound effects under open licences. Read each file's licence."}, url:"https://freesound.org" },
    { id:"l7", type:"software", first:false, free:true, level:"Intermediate", cat:{fa:"تدوین",en:"Editing"}, title:{fa:"Blender",en:"Blender"}, text:{fa:"نرم‌افزار رایگان سه‌بعدی و تدوین.",en:"Free 3D and editing software."}, url:"https://www.blender.org" },
    { id:"l8", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"Coursera",en:"Coursera"}, text:{fa:"هزاران دوره از دانشگاه‌ها و شرکت‌ها. بسیاری را می‌شود رایگان دید؛ گواهی ممکن است پولی باشد.",en:"Thousands of courses from universities and companies. Many can be audited free; certificates may cost money."}, url:"https://www.coursera.org" },
    { id:"l9", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"edX",en:"edX"}, text:{fa:"دوره‌های دانشگاه‌های معتبر. دیدن بسیاری رایگان است؛ گواهی ممکن است پولی باشد.",en:"Courses from respected universities. Many are free to view; certificates may cost money."}, url:"https://www.edx.org" },
    { id:"l10", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"Khan Academy",en:"Khan Academy"}, text:{fa:"درس‌های رایگان ریاضی، علوم، رایانه و بیشتر، قدم به قدم.",en:"Free lessons in maths, science, computing and more, step by step."}, url:"https://www.khanacademy.org" },
    { id:"l11", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"freeCodeCamp",en:"freeCodeCamp"}, text:{fa:"یادگیری وب و برنامه‌نویسی با تمرین، کاملاً رایگان، با گواهی.",en:"Learn web development and programming by practice. Free, with certificates."}, url:"https://www.freecodecamp.org" },
    { id:"l12", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"CS50 (هاروارد)",en:"CS50 (هاروارد)"}, text:{fa:"درس معروف مقدمه علوم کامپیوتر دانشگاه هاروارد، رایگان.",en:"Harvard's famous introduction to computer science, free."}, url:"https://cs50.harvard.edu/x/" },
    { id:"l13", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"The Odin Project",en:"The Odin Project"}, text:{fa:"مسیر کامل رایگان برای برنامه‌نویس وب شدن.",en:"A complete free path to becoming a web developer."}, url:"https://www.theodinproject.com" },
    { id:"l14", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"علوم داده",en:"Data"}, title:{fa:"Kaggle Learn",en:"Kaggle Learn"}, text:{fa:"درس‌های کوتاه و عملی پایتون، یادگیری ماشین و داده.",en:"Short hands-on lessons in Python, machine learning and data."}, url:"https://www.kaggle.com/learn" },
    { id:"l15", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"گوگل",en:"Google"}, title:{fa:"Google Skillshop",en:"Google Skillshop"}, text:{fa:"آموزش رسمی ابزارهای گوگل (تبلیغات، آنالیتیکس و غیره).",en:"Official training for Google tools (Ads, Analytics and more)."}, url:"https://skillshop.withgoogle.com" },
    { id:"l16", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"گوگل",en:"Google"}, title:{fa:"Google Cloud Skills Boost",en:"Google Cloud Skills Boost"}, text:{fa:"آموزش رسمی ابزارهای ابری گوگل. بخشی رایگان، بخشی پولی.",en:"Official Google Cloud training. Some free, some paid."}, url:"https://www.cloudskillsboost.google" },
    { id:"l17", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"مایکروسافت",en:"Microsoft"}, title:{fa:"Microsoft Learn",en:"Microsoft Learn"}, text:{fa:"آموزش رسمی و رایگان ابزارهای مایکروسافت و برنامه‌نویسی.",en:"Official free training on Microsoft tools and programming."}, url:"https://learn.microsoft.com/training/" },
    { id:"l18", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"دانشگاه",en:"University"}, title:{fa:"MIT OpenCourseWare",en:"MIT OpenCourseWare"}, text:{fa:"مطالب درس‌های دانشگاه MIT، رایگان و باز.",en:"Course materials from MIT, free and open."}, url:"https://ocw.mit.edu" },
    { id:"l19", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"دانشگاه",en:"University"}, title:{fa:"Stanford Online",en:"Stanford Online"}, text:{fa:"بخشی از درس‌های دانشگاه استنفورد رایگان است.",en:"Some Stanford courses are free."}, url:"https://online.stanford.edu" },
    { id:"l20", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"Alison",en:"Alison"}, text:{fa:"دوره‌های کوتاه رایگان با گواهی (دارای تبلیغ).",en:"Short free courses with certificates (with ads)."}, url:"https://alison.com" },
    { id:"l21", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"وب",en:"Web"}, title:{fa:"MDN Web Docs",en:"MDN Web Docs"}, text:{fa:"مرجع و آموزش رسمی HTML، CSS و جاوااسکریپت.",en:"The reference and tutorials for HTML, CSS and JavaScript."}, url:"https://developer.mozilla.org" },
    { id:"l22", type:"article", first:false, free:true, level:"Beginner", cat:{fa:"طراحی گرافیک",en:"Graphic design"}, title:{fa:"Canva Design School",en:"Canva Design School"}, text:{fa:"درس‌ها و مقاله‌های ساده طراحی گرافیک.",en:"Simple lessons and articles on graphic design."}, url:"https://www.canva.com/designschool/" },
    { id:"l23", type:"article", first:false, free:true, level:"Beginner", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"No Film School",en:"No Film School"}, text:{fa:"مقاله‌های فیلم‌سازی، نورپردازی و تدوین.",en:"Articles on filmmaking, lighting and editing."}, url:"https://nofilmschool.com" },
    { id:"l24", type:"article", first:false, free:true, level:"Beginner", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"StudioBinder Blog",en:"StudioBinder Blog"}, text:{fa:"راهنمای نوشتن فیلمنامه، نماها و تولید.",en:"Guides to screenwriting, shots and production."}, url:"https://www.studiobinder.com/blog/" },
    { id:"l25", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"ویرایش عکس",en:"Photo editing"}, title:{fa:"Photopea",en:"Photopea"}, text:{fa:"ویرایشگر شبیه فتوشاپ که در مرورگر کار می‌کند.",en:"A Photoshop-like editor that runs in the browser."}, url:"https://www.photopea.com" },
    { id:"l26", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"ویرایش عکس",en:"Photo editing"}, title:{fa:"GIMP",en:"GIMP"}, text:{fa:"ویرایشگر عکس رایگان و متن‌باز.",en:"Free, open-source photo editor."}, url:"https://www.gimp.org" },
    { id:"l27", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"نقاشی",en:"Painting"}, title:{fa:"Krita",en:"Krita"}, text:{fa:"نرم‌افزار رایگان نقاشی دیجیتال.",en:"Free digital painting software."}, url:"https://krita.org" },
    { id:"l28", type:"software", first:false, free:true, level:"Intermediate", cat:{fa:"طراحی گرافیک",en:"Graphic design"}, title:{fa:"Inkscape",en:"Inkscape"}, text:{fa:"طراحی برداری رایگان (جایگزین ایلاستریتور).",en:"Free vector design (an Illustrator alternative)."}, url:"https://inkscape.org" },
    { id:"l29", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"طراحی گرافیک",en:"Graphic design"}, title:{fa:"Figma",en:"Figma"}, text:{fa:"طراحی رابط کاربری؛ پلان رایگان دارد.",en:"Interface design; has a free plan."}, url:"https://www.figma.com" },
    { id:"l30", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"تدوین",en:"Editing"}, title:{fa:"Kdenlive",en:"Kdenlive"}, text:{fa:"ویرایشگر ویدیوی رایگان و متن‌باز.",en:"Free, open-source video editor."}, url:"https://kdenlive.org" },
    { id:"l31", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"تدوین",en:"Editing"}, title:{fa:"OBS Studio",en:"OBS Studio"}, text:{fa:"ضبط صفحه و پخش زنده، رایگان.",en:"Free screen recording and live streaming."}, url:"https://obsproject.com" },
    { id:"l32", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"تدوین",en:"Editing"}, title:{fa:"HandBrake",en:"HandBrake"}, text:{fa:"تبدیل فرمت و کم‌حجم کردن ویدیو، رایگان.",en:"Convert and shrink video, free."}, url:"https://handbrake.fr" },
    { id:"l33", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"صدا",en:"Sound"}, title:{fa:"Audacity",en:"Audacity"}, text:{fa:"ضبط و ویرایش صدا، رایگان و متن‌باز.",en:"Free, open-source audio recording and editing."}, url:"https://www.audacityteam.org" },
    { id:"l34", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"Visual Studio Code",en:"Visual Studio Code"}, text:{fa:"ویرایشگر کد رایگان.",en:"A free code editor."}, url:"https://code.visualstudio.com" },
    { id:"l35", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"Git",en:"Git"}, text:{fa:"سیستم نسخه‌بندی کد، رایگان.",en:"Free version-control system for code."}, url:"https://git-scm.com" },
    { id:"l36", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"اداری",en:"Office"}, title:{fa:"LibreOffice",en:"LibreOffice"}, text:{fa:"جایگزین رایگان آفیس.",en:"A free Office alternative."}, url:"https://www.libreoffice.org" },
    { id:"l37", type:"stock", first:false, free:true, level:"Beginner", cat:{fa:"تصویر",en:"Images"}, title:{fa:"Unsplash",en:"Unsplash"}, text:{fa:"عکس‌های رایگان. مجوز هر عکس را بخوان.",en:"Free photos. Read each photo's licence."}, url:"https://unsplash.com" },
    { id:"l38", type:"stock", first:false, free:true, level:"Beginner", cat:{fa:"تصویر و ویدیو",en:"Images & video"}, title:{fa:"Pexels",en:"Pexels"}, text:{fa:"عکس و ویدیوی رایگان. مجوز را بخوان.",en:"Free photos and videos. Read the licence."}, url:"https://www.pexels.com" },
    { id:"l39", type:"stock", first:false, free:true, level:"Beginner", cat:{fa:"تصویر",en:"Images"}, title:{fa:"Pixabay",en:"Pixabay"}, text:{fa:"تصویر، ویدیو و موسیقی رایگان. مجوز را بخوان.",en:"Free images, video and music. Read the licence."}, url:"https://pixabay.com" },
    { id:"l40", type:"stock", first:false, free:true, level:"Beginner", cat:{fa:"رنگ",en:"Colour"}, title:{fa:"Coolors",en:"Coolors"}, text:{fa:"ساخت پالت رنگ.",en:"Colour palette generator."}, url:"https://coolors.co" },
    { id:"l41", type:"stock", first:false, free:true, level:"Beginner", cat:{fa:"آرشیو",en:"Archive"}, title:{fa:"Internet Archive: فیلم‌ها",en:"Internet Archive: فیلم‌ها"}, text:{fa:"آرشیو فیلم‌های قدیمی و دامنه عمومی.",en:"Archive of old and public-domain films."}, url:"https://archive.org/details/movies" },
    { id:"l42", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"کتاب رایگان",en:"Free books"}, title:{fa:"Project Gutenberg",en:"Project Gutenberg"}, text:{fa:"بیش از ۷۰ هزار کتاب دامنه عمومی.",en:"Over 70,000 public-domain books."}, url:"https://www.gutenberg.org" },
    { id:"l43", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"کتاب رایگان",en:"Free books"}, title:{fa:"Open Library",en:"Open Library"}, text:{fa:"کتابخانه آنلاین؛ امانت دیجیتال رایگان.",en:"An online library with free digital lending."}, url:"https://openlibrary.org" },
    { id:"l44", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"کتاب رایگان",en:"Free books"}, title:{fa:"Internet Archive",en:"Internet Archive"}, text:{fa:"کتاب، مجله و سند، رایگان.",en:"Books, magazines and documents, free."}, url:"https://archive.org" },
    { id:"l45", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"کتاب درسی",en:"Textbooks"}, title:{fa:"OpenStax",en:"OpenStax"}, text:{fa:"کتاب‌های درسی دانشگاهی رایگان.",en:"Free college textbooks."}, url:"https://openstax.org" },
    { id:"l46", type:"book", first:false, free:true, level:"Intermediate", cat:{fa:"کتاب درسی",en:"Textbooks"}, title:{fa:"LibreTexts",en:"LibreTexts"}, text:{fa:"کتاب‌های درسی رایگان در علوم و فنی.",en:"Free textbooks in science and engineering."}, url:"https://libretexts.org" },
    { id:"l47", type:"book", first:false, free:true, level:"Intermediate", cat:{fa:"کتاب درسی",en:"Textbooks"}, title:{fa:"Directory of Open Access Books",en:"Directory of Open Access Books"}, text:{fa:"فهرست کتاب‌های دانشگاهی دسترسی آزاد.",en:"A directory of open-access academic books."}, url:"https://www.doabooks.org" },
    { id:"l48", type:"book", first:false, free:true, level:"Intermediate", cat:{fa:"پژوهش",en:"Research"}, title:{fa:"Google Scholar",en:"Google Scholar"}, text:{fa:"جستجوی مقاله‌های علمی.",en:"Search for scholarly articles."}, url:"https://scholar.google.com" },
    { id:"l49", type:"book", first:false, free:true, level:"Intermediate", cat:{fa:"پژوهش",en:"Research"}, title:{fa:"arXiv",en:"arXiv"}, text:{fa:"مقاله‌های پژوهشی رایگان در علوم و کامپیوتر.",en:"Free research papers in science and computing."}, url:"https://arxiv.org" },
    { id:"l50", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"فارسی",en:"Persian"}, title:{fa:"ویکی‌نبشته فارسی",en:"ویکی‌نبشته فارسی"}, text:{fa:"متن‌های ادبی و تاریخی فارسی، رایگان.",en:"Persian literary and historical texts, free."}, url:"https://fa.wikisource.org" },
    { id:"l51", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"دانشگاه",en:"University"}, title:{fa:"Yale Courses",en:"Yale Courses"}, text:{fa:"درس‌های ضبط‌شده دانشگاه ییل، رایگان.",en:"Recorded Yale University courses, free."}, url:"https://oyc.yale.edu" },
    { id:"l52", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"دانشگاه",en:"University"}, title:{fa:"Harvard Online",en:"Harvard Online"}, text:{fa:"دوره‌های هاروارد؛ بعضی رایگان، بعضی پولی.",en:"Harvard courses; some free, some paid."}, url:"https://pll.harvard.edu" },
    { id:"l53", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"دانشگاه",en:"University"}, title:{fa:"Oxford Podcasts",en:"Oxford Podcasts"}, text:{fa:"درس‌ها و پادکست‌های رایگان دانشگاه آکسفورد.",en:"Free lectures and podcasts from the University of Oxford."}, url:"https://podcasts.ox.ac.uk" },
    { id:"l54", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"دانشگاه",en:"University"}, title:{fa:"Berkeley Webcasts",en:"Berkeley Webcasts"}, text:{fa:"درس‌های ضبط‌شده دانشگاه برکلی.",en:"Recorded lectures from UC Berkeley."}, url:"https://webcast.berkeley.edu" },
    { id:"l55", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"دانشگاه",en:"University"}, title:{fa:"Stanford Engineering Everywhere",en:"Stanford Engineering Everywhere"}, text:{fa:"درس‌های مهندسی استنفورد.",en:"Stanford engineering lectures."}, url:"https://see.stanford.edu" },
    { id:"l56", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"FutureLearn",en:"FutureLearn"}, text:{fa:"دوره‌های دانشگاهی؛ دیدن بیشتر آن‌ها رایگان است.",en:"University courses; many are free to view."}, url:"https://www.futurelearn.com" },
    { id:"l57", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"Udemy (بخش رایگان)",en:"Udemy (بخش رایگان)"}, text:{fa:"بخشی از دوره‌ها رایگان است.",en:"Some courses are free."}, url:"https://www.udemy.com" },
    { id:"l58", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"Udacity",en:"Udacity"}, text:{fa:"دوره‌های فنی؛ بخشی رایگان.",en:"Technical courses; some free."}, url:"https://www.udacity.com" },
    { id:"l59", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"LinkedIn Learning",en:"LinkedIn Learning"}, text:{fa:"دوره‌های حرفه‌ای؛ پولی با دوره آزمایشی.",en:"Professional courses; paid with a trial."}, url:"https://www.linkedin.com/learning/" },
    { id:"l60", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"Class Central",en:"Class Central"}, text:{fa:"فهرست دوره‌های آنلاین رایگان همه پلتفرم‌ها.",en:"A catalogue of free online courses from all platforms."}, url:"https://www.classcentral.com" },
    { id:"l61", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"TED-Ed",en:"TED-Ed"}, text:{fa:"درس‌های کوتاه و گرافیکی.",en:"Short animated lessons."}, url:"https://ed.ted.com" },
    { id:"l62", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"پلتفرم دوره",en:"Course platforms"}, title:{fa:"Coursera Project Network",en:"Coursera Project Network"}, text:{fa:"پروژه‌های عملی کوتاه.",en:"Short guided projects."}, url:"https://www.coursera.org/projects" },
    { id:"l63", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"Codecademy",en:"Codecademy"}, text:{fa:"یادگیری برنامه‌نویسی تعاملی؛ بخشی رایگان.",en:"Interactive coding lessons; some free."}, url:"https://www.codecademy.com" },
    { id:"l64", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"W3Schools",en:"W3Schools"}, text:{fa:"آموزش ساده HTML، CSS، JavaScript، Python و SQL.",en:"Simple tutorials for HTML, CSS, JavaScript, Python and SQL."}, url:"https://www.w3schools.com" },
    { id:"l65", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"Python.org آموزش",en:"Python.org آموزش"}, text:{fa:"آموزش رسمی پایتون.",en:"The official Python tutorial."}, url:"https://docs.python.org/3/tutorial/" },
    { id:"l66", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"Google for Developers",en:"Google for Developers"}, text:{fa:"آموزش‌ها و مستندات رسمی گوگل برای برنامه‌نویسان.",en:"Official Google tutorials and documentation for developers."}, url:"https://developers.google.com" },
    { id:"l67", type:"course", first:false, free:true, level:"Intermediate", cat:{fa:"برنامه‌نویسی",en:"Programming"}, title:{fa:"Hugging Face Courses",en:"Hugging Face Courses"}, text:{fa:"آموزش رایگان یادگیری ماشین و هوش مصنوعی.",en:"Free machine-learning and AI courses."}, url:"https://huggingface.co/learn" },
    { id:"l68", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"طراحی گرافیک",en:"Graphic design"}, title:{fa:"Adobe Tutorials",en:"Adobe Tutorials"}, text:{fa:"آموزش‌های رسمی فتوشاپ، پریمیر و افتر افکت.",en:"Official tutorials for Photoshop, Premiere and After Effects."}, url:"https://helpx.adobe.com/learn.html" },
    { id:"l69", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"طراحی گرافیک",en:"Graphic design"}, title:{fa:"Figma Learn",en:"Figma Learn"}, text:{fa:"آموزش رسمی فیگما.",en:"Official Figma learning resources."}, url:"https://help.figma.com" },
    { id:"l70", type:"course", first:false, free:true, level:"Beginner", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"Premiere Pro (Adobe)",en:"Premiere Pro (Adobe)"}, text:{fa:"آموزش‌های رسمی تدوین.",en:"Official editing tutorials."}, url:"https://helpx.adobe.com/premiere-pro/tutorials.html" },
    { id:"l71", type:"video", first:false, free:true, level:"Beginner", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"Vimeo Video School",en:"Vimeo Video School"}, text:{fa:"درس‌های فیلم‌برداری و تدوین.",en:"Lessons on shooting and editing."}, url:"https://vimeo.com/blog/category/video-school/" },
    { id:"l72", type:"video", first:false, free:true, level:"Beginner", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"Blender: آموزش‌های رسمی",en:"Blender: official tutorials"}, text:{fa:"آموزش رسمی بلندر.",en:"Official Blender learning."}, url:"https://www.blender.org/support/tutorials/" },
    { id:"l73", type:"article", first:false, free:true, level:"Intermediate", cat:{fa:"فیلم‌سازی",en:"Filmmaking"}, title:{fa:"Film Riot",en:"Film Riot"}, text:{fa:"آموزش فیلم‌سازی و جلوه‌های ویژه.",en:"Filmmaking and visual-effects tutorials."}, url:"https://www.filmriot.com" },
    { id:"l74", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"ویرایش عکس",en:"Photo editing"}, title:{fa:"Canva",en:"Canva"}, text:{fa:"طراحی آسان؛ پلان رایگان دارد.",en:"Easy design; has a free plan."}, url:"https://www.canva.com" },
    { id:"l75", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"ویرایش عکس",en:"Photo editing"}, title:{fa:"remove.bg",en:"remove.bg"}, text:{fa:"حذف پس‌زمینه عکس؛ نسخه رایگان محدود است.",en:"Remove photo backgrounds; free version is limited."}, url:"https://www.remove.bg" },
    { id:"l76", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"فونت",en:"Fonts"}, title:{fa:"Vazirmatn",en:"Vazirmatn"}, text:{fa:"فونت رایگان فارسی.",en:"A free Persian font."}, url:"https://github.com/rastikerdar/vazirmatn" },
    { id:"l77", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"ابزار",en:"Tools"}, title:{fa:"Notion",en:"Notion"}, text:{fa:"یادداشت و برنامه‌ریزی؛ پلان رایگان دارد.",en:"Notes and planning; has a free plan."}, url:"https://www.notion.so" },
    { id:"l78", type:"software", first:false, free:true, level:"Beginner", cat:{fa:"ابزار",en:"Tools"}, title:{fa:"GitHub",en:"GitHub"}, text:{fa:"نگهداری کد و پروژه؛ رایگان.",en:"Code and project hosting; free."}, url:"https://github.com" },
    { id:"l79", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"کتاب رایگان",en:"Free books"}, title:{fa:"Wikibooks",en:"Wikibooks"}, text:{fa:"کتاب‌های آزاد و مشارکتی.",en:"Free collaborative textbooks."}, url:"https://www.wikibooks.org" },
    { id:"l80", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"کتاب رایگان",en:"Free books"}, title:{fa:"Standard Ebooks",en:"Standard Ebooks"}, text:{fa:"کتاب‌های دامنه عمومی با قالب‌بندی زیبا.",en:"Beautifully formatted public-domain ebooks."}, url:"https://standardebooks.org" },
    { id:"l81", type:"book", first:false, free:true, level:"Beginner", cat:{fa:"کتاب رایگان",en:"Free books"}, title:{fa:"Free Programming Books",en:"Free Programming Books"}, text:{fa:"فهرست بزرگ کتاب‌های رایگان برنامه‌نویسی.",en:"A large list of free programming books."}, url:"https://github.com/EbookFoundation/free-programming-books" }
  ],

  /* ===== Directory layers. Add real entries here. Never add invented ones.
     Shape: { id, type, title:{fa,en}, text:{fa,en}, date:"2026-05-01" (or year:2026), url:"", hours:0, status:"real" }
     activity types: event | community | opensource | mentoring | volunteering   (hours counts mentoring time)
     notes types:    til | article | checklist | bookshelf | translation | newsletter
     milestones:     { id, title, date } ; testimonials: only with consent: { id, title, text, consent:true } ===== */
  activity: [],
  notes: [],
  milestones: [],
  testimonials: [],
  /* Optional pieces (empty = hidden). showreel: {src:"assets/video/reel.mp4", poster:"assets/video/reel.webp"} or {yt:"YouTubeId"}.
     compare: [{title:{fa:"",en:""}, before:"assets/work/a.webp", after:"assets/work/b.webp"}].  cvPdf: "assets/cv.pdf".
     In a project: bts:[{img:"assets/work/x.webp", text:{fa:"",en:""}}] shows Behind the scenes. */
  showreel: {},
  compare: [],
  cvPdf: "",
  booking: "",   /* paste a Cal.com / TidyCal link here to turn on booking */

  certs: [
    { id: "c1", img: true, cat: "cs", title: "AI for Beginners", issuer: "HP LIFE", year: 2026, verifyUrl: "" },
    { id: "c2", img: true, cat: "cs", title: "Master ChatGPT", issuer: "Uniathena", year: 2026, verifyUrl: "" },
    { id: "c3", img: true, featured: true, cat: "design", title: "Brand Design", issuer: "atingi (UNESCO, EU)", year: 2026, verifyUrl: "" },
    { id: "c4", img: true, featured: true, cat: "design", title: "The Design Brief", issuer: "Mindluster", year: 2026, verifyUrl: "" },
    { id: "c5", img: true, cat: "lang", title: "ESL005: Business-Proficient English as a Second Language (92%)", issuer: "Saylor Academy", year: 2026, verifyUrl: "" },
    { id: "c6", img: true, cat: "cs", title: "CS102: Introduction to Programming II (82.69%)", issuer: "Saylor Academy", year: 2026, verifyUrl: "" },
    { id: "c7", img: true, cat: "cs", title: "Deploy and manage Active Directory Domain Services domain controllers", issuer: "Microsoft Learn", year: 2026, verifyUrl: "" },
    { id: "c8", img: true, featured: true, cat: "film", title: "Adobe After Effects", issuer: "Mindluster", year: 2026, verifyUrl: "" },
    { id: "c9", img: true, featured: true, cat: "film", title: "Editing Audio and Video for Online Learning", issuer: "atingi lab", year: 2026, verifyUrl: "" },
    { id: "c10", img: true, featured: true, cat: "biz", title: "Digital Marketing Certified", issuer: "HubSpot Academy", year: 2026, verifyUrl: "" },
    { id: "c11", img: true, cat: "biz", title: "Foundations of Project Management", issuer: "Google, on Coursera", year: 2026, verifyUrl: "" },
    { id: "c12", img: true, cat: "design", title: "Drawing with an HB Pencil", issuer: "Mindluster", year: 2026, verifyUrl: "" },
    { id: "c13", img: true, cat: "design", title: "How to Use Canva for YouTube Growth", issuer: "Mindluster", year: 2026, verifyUrl: "" },
    { id: "c14", img: true, cat: "biz", title: "Soft Skills", issuer: "atingi (GIZ)", year: 2026, verifyUrl: "" },
    { id: "c15", img: true, cat: "cs", title: "AI Fundamentals", issuer: "Google, on Coursera", year: 2026, verifyUrl: "" },
    { id: "c16", img: true, cat: "cs", title: "Programming for Everybody (Getting Started with Python)", issuer: "University of Michigan, on Coursera", year: 2026, verifyUrl: "" },
    { id: "c17", img: true, featured: true, cat: "lang", title: "EF SET English Certificate: B2 Upper Intermediate, 54/100", issuer: "EF SET", year: 2026, verifyUrl: "https://cert.efset.org/LWtBWb" },
    { id: "c18", img: true, cat: "design", title: "Product Photo Pro (practice module completion)", issuer: "MakeMyVisuals", year: 2026, verifyUrl: "" },
    { id: "c19", img: true, featured: true, cat: "film", title: "The Business of Film (12 hours)", issuer: "OpenLearn, The Open University", year: 2026, verifyUrl: "" },
    { id: "c20", img: true, cat: "lang", title: "Teaching English as a Foreign Language, 120 hours (Distinction)", issuer: "TEFL Professional Institute, Teacher Record", year: 2026, verifyUrl: "" },
    { id: "c21", img: true, cat: "cs", title: "1 Million Prompters: Certificate of Completion", issuer: "Dubai AI initiative", year: 2026, verifyUrl: "" },
    { id: "c22", img: true, cat: "film", title: "Music", issuer: "Mindluster", year: 2026, verifyUrl: "" },
    { id: "c23", img: true, featured: true, cat: "film", title: "Photography", issuer: "Mindluster", year: 2026, verifyUrl: "" },
    { id: "c24", img: true, cat: "biz", title: "Strategic Planning in the AI Age", issuer: "HP LIFE", year: 2026, verifyUrl: "" },
    { id: "c25", img: true, cat: "cs", title: "Elements of AI", issuer: "MinnaLearn, University of Helsinki", year: 2026, verifyUrl: "" },
    { id: "c26", img: true, cat: "biz", title: "Digital Marketing Course: certificate exam, 100/100", issuer: "IIENSTITU", year: 2026, verifyUrl: "" },
    { id: "c27", img: true, cat: "work", title: { fa: "دیپلم تکمیل صنف دوازدهم (سیستم DEL)", en: "Diploma of Completion: 12th grade (DEL system)" }, issuer: { fa: "آکادمی آنلاین بیت\u200cالحمد", en: "Academy Baitul Hamd" }, year: "2023", verifyUrl: "" },
    { id: "c28", img: true, cat: "cs", title: { fa: "برنامه امور اداری کامپیوتر", en: "Computer Administrative Works Program" }, issuer: { fa: "آکادمی گوگل", en: "Google Academy" }, year: "2023", verifyUrl: "" },
    { id: "c29", img: true, cat: "community", title: { fa: "تصدیق‌نامه", en: "Certificate of completion" }, issuer: { fa: "جمعیت اصلاح افغانستان", en: "Islah Society of Afghanistan" }, year: null, verifyUrl: "" },
    { id: "c30", img: true, cat: "community", title: { fa: "تصدیق‌نامه", en: "Certificate of completion" }, issuer: { fa: "جمعیت اصلاح افغانستان", en: "Islah Society of Afghanistan" }, year: null, verifyUrl: "" },
    { id: "c31", img: true, cat: "community", title: { fa: "کورس دو هفته‌ای تربیه اسلامی", en: "Two-week Islamic education course" }, issuer: { fa: "نهاد جوانان مسلمان (نجم)", en: "Muslim Youth Foundation (Najm)" }, year: null, verifyUrl: "" },
    { id: "c32", img: true, cat: "community", title: { fa: "کورس تعلیمی اسلامی (۱۳ تا ۲۵ فبروری ۲۰۱۹)", en: "Islamic education course (13 to 25 Feb 2019)" }, issuer: { fa: "نهاد جوانان مسلمان (نجم)", en: "Muslim Youth Foundation (Najm)" }, year: "2019", verifyUrl: "" },
    { id: "c33", img: true, cat: "community", title: { fa: "تحسین‌نامه", en: "Certificate of appreciation" }, issuer: { fa: "نهاد جوانان مسلمان (نجم)", en: "Muslim Youth Foundation (Najm)" }, year: null, verifyUrl: "" },
    { id: "c34", img: true, cat: "community", title: { fa: "دوره یک‌هفته‌ای سخنرانی برتر", en: "One-week public speaking course" }, issuer: { fa: "نهاد جوانان مسلمان (نجم)", en: "Muslim Youth Foundation (Najm)" }, year: null, verifyUrl: "" },
    { id: "c35", img: true, cat: "community", title: { fa: "تقدیر از شرکت در برنامه هفته‌وار سخنرانی", en: "Appreciation for the weekly speech program" }, issuer: { fa: "نهاد جوانان مسلمان (نجم)", en: "Muslim Youth Foundation (Najm)" }, year: null, verifyUrl: "" },
    { id: "c36", img: true, cat: "community", title: { fa: "تقدیرنامه", en: "Letter of appreciation" }, issuer: { fa: "جمعیت اصلاح افغانستان، ولایت کابل، و مدرسه سردار انبیاء", en: "Islah Society (Kabul) and Sardar Anbiya madrasa" }, year: null, verifyUrl: "" },
    { id: "c37", img: true, cat: "community", title: { fa: "تقدیرنامه", en: "Letter of appreciation" }, issuer: { fa: "مدرسه حضرت عمر فاروق (رض)", en: "Hazrat Omar Farooq madrasa" }, year: null, verifyUrl: "" },
    { id: "c38", img: true, cat: "community", title: { fa: "تصدیق‌نامه کورس دو هفته‌ای", en: "Two-week course certificate" }, issuer: { fa: "جمعیت اصلاح افغانستان، اداره ولایتی نجم کابل", en: "Islah Society, Najm Kabul provincial office" }, year: null, verifyUrl: "" },
    { id: "c39", img: true, cat: "community", title: { fa: "شهادت‌نامه ناظره قرآن کریم", en: "Quran recitation certificate" }, issuer: { fa: "مدرسه حضرت عمر فاروق (رض)", en: "Hazrat Omar Farooq madrasa" }, year: null, verifyUrl: "" },
    { id: "c40", img: true, cat: "community", title: { fa: "لوح تقدیر", en: "Plaque of appreciation" }, issuer: { fa: "کانون آموزشی تکامل", en: "Takamol Education Center" }, year: "1398", verifyUrl: "" },
    { id: "c41", img: true, cat: "community", title: { fa: "لوح تقدیر", en: "Plaque of appreciation" }, issuer: { fa: "کانون آموزشی تکامل", en: "Takamol Education Center" }, year: "1398", verifyUrl: "" },
    { id: "c42", img: true, cat: "cs", title: { fa: "دوره Network+", en: "Network+ training course" }, issuer: { fa: "مرکز آموزش IT برایت\u200cهاوس", en: "Bright House IT Training Center" }, year: "2023", verifyUrl: "" },
    { id: "c43", img: true, cat: "work", title: { fa: "تصدیق‌نامه کاری: طراح گرافیک", en: "Work certificate: Graphic Designer" }, issuer: { fa: "مرکز آموزشی الف\u200cبا", en: "AlifBa Educational Center" }, year: "2023–2024", verifyUrl: "" },
    { id: "c44", img: true, cat: "cs", title: { fa: "دوره ICDL (لوح موفقیت)", en: "ICDL course (certificate of achievement)" }, issuer: { fa: "مؤسسه انکشاف مسلکی ختم\u200cالنبیین (KPDI)", en: "Khatam al-Nabieen Professional Development Institute (KPDI)" }, year: "2023", verifyUrl: "" }
  ],

  /* Real awards, festival selections and screenings only. While empty, the section stays hidden.
     Example: { title:{fa:"",en:"Official Selection"}, event:"Festival name", year:2026, url:"https://..." } */
  laurels: [],

  /* Press kit. Replace the sample texts. downloads: put the file in /downloads and write its path. */
  press: {
    shortBio: { sample: false, fa: "فیلم‌ساز، تدوینگر و طراح گرافیک از کابل. در دانشگاه کابل هنر سمعی و بصری (سینما) و در دانشگاه سلام علوم کامپیوتر می‌خوانم. برای مراکز آموزشی طراحی و تدوین کرده‌ام و فیلم‌های تبلیغاتی و آموزشی ساخته‌ام. هدفم رساندن مهارت فیلم‌سازی و پست‌پروداکشن به سطح بین‌المللی و ساختن قصه‌های معنادار است.", en: "Filmmaker, video editor and graphic designer from Kabul. I study audio-visual arts (cinema) at Kabul University and computer science at Salam University. I have designed and edited for educational centers and made promotional and educational films. My goal is to bring my filmmaking and post-production to an international level and to tell meaningful stories." },
    longBio:  { sample: true, fa: "بیوگرافی کامل (۱۵۰ تا ۲۵۰ کلمه) اینجا می‌آید.", en: "Full bio (150 to 250 words) goes here." },
    facts: [
      { k: { fa: "نام", en: "Name" }, v: { fa: "انصارالحق مبارز", en: "Ansarulhaq Mubarez" } },
      { k: { fa: "محل کار", en: "Based in" }, v: { fa: "کابل، افغانستان", en: "Kabul, Afghanistan" } },
      { k: { fa: "حوزه‌ها", en: "Fields" }, v: { fa: "فیلم‌سازی، تدوین، طراحی گرافیک، علوم کامپیوتر", en: "Filmmaking, editing, graphic design, computer science" } },
      { k: { fa: "زبان‌ها", en: "Languages" }, v: { fa: "", en: "" } }
    ],
    downloads: [
      { id: "cv",    label: { fa: "رزومه (PDF)", en: "CV (PDF)" },                   file: "" },
      { id: "photo", label: { fa: "عکس حرفه‌ای", en: "Professional photo" },         file: "downloads/ansarulhaq-mubarez-photo.jpg" },
      { id: "stills", label: { fa: "فریم‌هایی از کار", en: "Stills from the work" }, file: "" },
      { id: "logo",  label: { fa: "لوگو", en: "Logo" },                               file: "" }
    ]
  },

  cc: {
    tag: { fa: "منطقِ کد، جادوی سینما، هنرِ دیزاین.", en: "The logic of code. The magic of cinema. The art of design." },
    slogans: [
      { fa: "منطقِ کد، جادوی سینما، هنرِ دیزاین.", en: "The logic of code. The magic of cinema. The art of design." },
      { fa: "تلاقی هوش مصنوعی و هنرهای دیداری.", en: "The convergence of artificial intelligence and visual arts." },
      { fa: "آنجا که الگوریتم‌ها داستان می‌گویند.", en: "Where algorithms tell stories." }
    ],
    title: { fa: "به آکادمی سینه‌کد خوش آمدید", en: "Welcome to CineCode Academy" },
    sub: { fa: "کانونِ همگرایی سینما، کمپیوتر ساینس و گرافیک دیزاین", en: "The ultimate intersection of cinema, computer science and graphic arts." },
    body: { fa: "ما در سینه‌کد فراتر از ابزارها حرکت می‌کنیم. اینجا جایی است که کدهای برنامه نویسی به تصاویرِ زنده جان می‌بخشند و تدوین، عکاسی و وب‌دیزاین در یک اکوسیستم واحد و فوق‌پیشرفته متولد می‌شوند. پلتفرمی برای کسانی که می‌خواهند هم مهندس باشند و هم هنرمند.",
            en: "At CineCode, we move beyond boundaries. This is the ecosystem where programming code breathes life into moving images, and where cinema, advanced web development and digital graphics fuse into a unified canvas. Built for those who dare to be both engineers and artists." },
    cta1: { fa: "شروع یادگیری چندبعدی", en: "Begin multi-dimensional learning" },
    cta2: { fa: "مشاهده آثار و پروژه‌ها", en: "Explore portfolios and projects" },
    pilT: { fa: "سه ضلعِ سینه‌کد", en: "The three pillars" },
    pillars: [
      { k: "code", n: { fa: "ضلع اول", en: "Pillar 1" }, t: { fa: "مهندسی و کدنویسی", en: "Computer Science" }, s: { fa: "Computer Science", en: "Engineering logic" },
        d: { fa: "پیاده‌سازی زیرساخت‌های قدرتمند وب، هوش مصنوعی، و درک عمیق منطق نرم‌افزاری برای خلق ابزارهای نوین.", en: "Building robust web infrastructures, exploring AI frameworks, and mastering programming architecture to create the digital tools of tomorrow." } },
      { k: "film", n: { fa: "ضلع دوم", en: "Pillar 2" }, t: { fa: "هنر سمعی و بصری", en: "Audiovisual Arts" }, s: { fa: "Cinema & Audiovisual", en: "Cinematic narrative" },
        d: { fa: "کارگردانی، سناریونویسی، تصویربرداری حرفه‌ای و تدوین فیلم با استانداردهای سینمایی.", en: "Screenwriting, professional cinematography, sound recording and film editing crafted to cinematic and storytelling standards." } },
      { k: "design", n: { fa: "ضلع سوم", en: "Pillar 3" }, t: { fa: "دیزاین خلاق", en: "Graphic Arts" }, s: { fa: "Graphic Arts", en: "Visual precision" },
        d: { fa: "مهندسی پیکسل‌ها، هویت بصری برند، و خلق رابط‌های کاربری (UI/UX) مدرن، مینیمال و جهانی.", en: "Pixel engineering, brand identity, and creating minimal, fluid and world-class user interfaces (UI/UX)." } }
    ],
    misT: { fa: "مأموریت ما", en: "Our mission" },
    mis: { fa: "مأموریت آکادمی سینه‌کد، پرورش نسل جدیدی از خالقان چندبعدی است که مرزهای میان مهندسی کامپیوتر و هنرهای سمعی و بصری را از بین می‌برند. ما با ادغام منطق ریاضی کدنویسی، ظرافت روایت سینمایی و دقت مهندسی گرافیک، بستری را فراهم می‌کنیم تا ایده به پیشرفته‌ترین شکل ممکن خلق و پیاده‌سازی شود. سینه‌کد، پل ارتباطی دنیای الگوریتم‌ها و فریم‌های ماندگار است.",
           en: "The mission of CineCode Academy is to cultivate the next generation of multi-dimensional creators who erase the boundaries between computer engineering and audiovisual narrative. By combining the mathematical logic of coding, the emotional depth of cinema and the structural precision of graphic design, we give ideas a place to be built to their highest aesthetic and technical potential. CineCode is the bridge between algorithms and timeless visual stories." },
    founder: { fa: "بنیان‌گذار و مدرس", en: "Founder and instructor" }
  },
  ui: {
    fa: {
      skip: "رفتن به محتوا", banner: "پیش‌نمایش: بخش‌های دارای برچسب «نمونه» سابقه واقعی نیستند.",
      nAbout: "درباره من", nBlog: "وبلاگ", nGfx: "نمونه‌کار گرافیک", nReels: "ریلز", nCertP: "گواهی‌ها", nEdu: "تحصیلات", vIntro: "داستان من با اسکرول آغاز می‌شود", vScroll: "اسکرول کنید", nVid: "ویدیوها", vidOpen: "باز کردن در یوتیوب", nExp: "سوابق کاری", nLang: "زبان‌ها", toTop: "برگشت به بالا", close: "بستن", zoom: "نمایش بزرگ", nSkills: "مهارت‌ها", nWork: "نمونه‌کارها", nDesign: "طراحی گرافیک", srch: "جستجو", srchPh: "جستجو در سایت: مدرک، دوره، بخش…", srchNone: "چیزی پیدا نشد.", srchPages: "صفحه‌ها", cvT: "رزومه", cvPrint: "چاپ / ذخیره PDF", cvSum: "خلاصه", cvExp: "سوابق کاری", cvEdu: "تحصیلات", cvSk: "مهارت‌ها", cvLg: "زبان‌ها", cvCe: "گواهی‌های برگزیده", cvLn: "لینک‌ها", cvNote: "گواهی‌ها را صادرکننده‌های نام‌برده داده‌اند. مدارک اصلی در صورت درخواست آماده است.", nAcademy: "آکادمی سینه‌کد", nWorks: "همه نمونه‌کارها", wkIntro: "مجموعه کارهای طراحی من برای مراکز آموزشی، رسانه و برندها. یک دسته را انتخاب کن و با فلش‌ها بین کارها حرکت کن.", wkCount: "اثر", wkBack: "بازگشت به صفحه اصلی", gAll: "دیدن همه نمونه‌کارها", gposD: "پست و پوستر مناسبت‌ها و محتوای فرهنگی", gacadD: "اطلاعیه و تبلیغ دوره‌های آموزشی", gbanD: "بنر، کاور و تامبنیل ویدیو", gbraD: "لوگو، حروف‌نگاری و هویت بصری", gprnD: "کارت، بروشور و مواد چاپی", wkPrev: "قبلی", wkNext: "بعدی", hsite: "پورتفولیوی شخصی، نمونه‌کارها، مدارک و آکادمی رایگان، همه در یک جا.", hcFilm: "ویدیو و تدوین", hcDesign: "طراحی گرافیک", hcCerts: "مدارک", hcAcad: "آکادمی",errNet:"به سرور حساب‌ها وصل نشد. فیلترشکن یا پروکسی را خاموش کن، یا از آدرس http://localhost یا 127.0.0.1 باز کن (نه از پیش‌نمایش داخل اپ) و دوباره امتحان کن.",acctT:"حساب من",acctLoad:"در حال بارگذاری…",acctHi:"سلام",acctRole:"نقش",acctEnr:"دوره‌های من",acctNoEnr:"هنوز در دوره‌ای ثبت‌نام نکرده‌ای.",acctBrowse:"دیدن دوره‌ها",acctLes:"درس",acctProg:"پیشرفت",acctAtt:"نتیجه آزمون‌ها",acctNoAtt:"هنوز آزمونی نداده‌ای.",acctCert:"گواهی‌های من",acctNoCert:"هنوز گواهی نگرفته‌ای. گواهی فقط بعد از قبولی در آزمون صادر می‌شود.",acctOut:"خروج",acctErr:"اطلاعات حساب بارگذاری نشد. دوباره وارد شو.",csBrief:"خلاصه پروژه",csProcess:"روند کار",csResult:"نتیجه",tgClient:"کارفرما",tgScale:"مقیاس",tgIndustry:"صنعت",tgCountry:"کشور",tgOutcome:"نتیجه کار",tlT:"تایم‌لاین",tlP:"همه موارد دارای تاریخ، از تازه به قدیم.",tlUnd:"مورد بدون تاریخ (در فهرست همه موارد هستند)",tlNone:"هنوز موردی با تاریخ ثبت نشده.",ntT:"یادداشت‌ها",ntP:"آموخته‌های روزانه، مقاله‌ها، چک‌لیست‌ها و معرفی کتاب. هر مورد را خودم می‌نویسم.",ntNone:"هنوز یادداشتی منتشر نشده. به‌زودی اولین یادداشت اینجا می‌آید.",actT:"فعالیت‌ها",actP:"رویدادها، مشارکت در جامعه، کار متن‌باز، مشاوره و داوطلبی.",actNone:"هنوز فعالیتی ثبت نشده. فقط موارد واقعی و قابل‌اثبات ثبت می‌شود.",tkT:"جعبه‌ابزار",tkP:"ابزارهایی که کار می‌کنم، رزومه‌ها، رزرو وقت و آمار زنده.",tkStack:"ابزارها و نرم‌افزارها",tkCv:"رزومه",tkCvD:"نسخه چاپی و PDF.",tkBook:"رزرو وقت",tkBookD:"لینک رزرو هنوز تنظیم نشده.",tkBookB:"رزرو وقت",tkStats:"آمار زنده (فقط موارد واقعی)",sx_work:"طرح و پروژه",sx_cert:"گواهی",sx_act:"فعالیت",sx_hours:"ساعت مشاوره",sx_notes:"یادداشت",sx_ms:"دستاورد",ty_til:"امروز یاد گرفتم",ty_article:"مقاله",ty_checklist:"چک‌لیست",ty_bookshelf:"کتاب",ty_translation:"ترجمه",ty_newsletter:"خبرنامه",ty_event:"رویداد",ty_community:"جامعه",ty_opensource:"متن‌باز",ty_mentoring:"مشاوره",ty_volunteering:"داوطلبی",ty_milestone:"دستاورد",ty_testimonial:"توصیه‌نامه",dirT:"همه موارد",dirP:"همه کارها، مدارک و منابع این سایت در یک فهرست. با جستجو و فیلتر پیدا کن. اعداد بالا فقط از موارد واقعی شمرده می‌شوند.",dirQ:"جستجو در همه موارد",dirAllL:"همه بخش‌ها",dirAllT:"همه نوع‌ها",dirAllY:"همه سال‌ها",dirSam:"نمونه‌ها (Sample) هم نشان داده شود",dirMore:"نمایش بیشتر",dirReal:"مورد واقعی",dirNone:"موردی پیدا نشد.",dirShow:"نمایش",ly_projects:"پروژه‌ها و نمونه‌کار",ly_activity:"فعالیت و اثرگذاری",ly_credentials:"مدارک و سوابق",ly_knowledge:"دانش و آموزش",ty_graphic:"طراحی گرافیک",ty_certificate:"گواهی",ty_education:"تحصیل",ty_position:"سابقه کار",ty_project:"پروژه",ty_course:"دوره",ty_resource:"منبع",st_sample:"نمونه",st_third:"شخص ثالث",abT:"درباره من",abCr:"پیشینه",abLg:"زبان‌ها",abCta:"تماس با من",abWk:"دیدن نمونه‌کارها",svT:"خدمات",svP:"کارهایی که انجام می‌دهم. قیمت و زمان را بعد از دیدن پروژه با هم هماهنگ می‌کنیم.",svH:"روند کار",svCta:"درخواست پروژه",sv1:"تدوین ویدیو",sv1D:"برش، ریتم، صدا و رنگ. با Premiere Pro، After Effects و DaVinci Resolve.",sv2:"طراحی گرافیک",sv2D:"پوستر، بنر، لوگو و مواد چاپی. نمونه‌ها در بخش نمونه‌کارها.",sv3:"فیلم‌سازی",sv3D:"ایده و تصویربرداری تا تدوین برای فیلم کوتاه و محتوای رسانه‌ای.",sp1:"توضیح پروژه",sp1D:"هدف، مخاطب و فایل‌های موجود را برایم بنویس.",sp2:"پیش‌نویس",sp2D:"نسخه اول را می‌بینی.",sp3:"اصلاح",sp3D:"نظرت را اعمال می‌کنم.",sp4:"تحویل",sp4D:"فایل نهایی در قالب مناسب.",libPT:"کتابخانه منابع",libPD:"پیوند به منابع آموزشی. نشان «شخص ثالث» یعنی این منبع را من نساخته‌ام.",libQ:"جستجو در منابع",libAllT:"همه نوع‌ها",libAllL:"همه سطح‌ها",libFree:"رایگان",libThird:"منبع بیرونی",libFirst:"مطلب خودم",libOpen:"باز کردن",libNone:"منبعی پیدا نشد.",libN:"منبع",t_course:"دوره", t_book:"کتاب", t_stock:"تصویر و منبع",t_video:"ویدیو",t_article:"مقاله",t_software:"نرم‌افزار",t_sound:"صدا",stGal:"طرح گرافیک",stCert:"گواهی",stEdu:"سابقه تحصیلی",stLang:"زبان",stNote:"این اعداد از فهرست واقعی همین سایت شمرده می‌شوند.",pcT:"از کجا شروع کنم؟",pc1D:"طرح‌های گرافیک، بنر، لوگو و مواد چاپی با فیلتر دسته‌بندی.",pc2D:"آکادمی رایگان: دوره‌ها و فهرست آموزشی. ثبت‌نام و آزمون بعد از اتصال سرور فعال می‌شود.",pc3D:"گواهی‌ها و سوابق تحصیلی و کاری، همراه با فیلتر.",pc4D:"رزومه چاپی، کیت رسانه‌ای و راه‌های تماس.",pcGo:"ورود", kabulT: "وقت کابل", gnote: "نمونه‌هایی از کارهای طراحی من. نام و لوگوی برندها داخل کارها متعلق به صاحبان آن‌هاست.", nCerts: "مدارک", nLaurels: "جوایز", nPress: "کیت رسانه‌ای", nLinks: "لینک‌ها", nContact: "تماس", nHome: "خانه",
      cta1: "دیدن نمونه‌کارها", cta2: "همکاری با من",
      g1: "تدوین و تولید ویدیو", g2: "طراحی گرافیک", g3: "علوم کامپیوتر", pending: "پس از بررسی مدارک",
      sample: "نمونه", projectTitle: "پروژه نمونه", certTitle: "گواهی نمونه", unknown: "—",
      cats: { top: "برگزیده", lang: "زبان و آموزش", biz: "بازاریابی و کسب‌وکار", all: "همه", cs: "فناوری و هوش مصنوعی", design: "طراحی", film: "سینما و تدوین", edit: "تدوین", code: "برنامه‌نویسی", designW: "گرافیک", community: "آموزش و فعالیت اجتماعی", work: "کار و آکادمی", gpost: "پوستر و شبکه‌های اجتماعی", gacad: "آکادمی و تبلیغات", gban: "بنر و تامبنیل", gbra: "لوگو و هویت بصری", gprn: "چاپی و کارت" },
      open: "آماده همکاری", busy: "فعلاً مشغولم", verify: "تأیید رسمی", noVerify: "لینک تأیید هنوز اضافه نشده",
      lang: "English", fMission: "مأموریت ما پرورش نسل جدیدی از خالقان چندبعدی است که مرزهای میان مهندسی کامپیوتر و هنرهای سمعی و بصری را از بین می‌برند. سینه‌کد پل ارتباطی دنیای الگوریتم‌ها و فریم‌های ماندگار است.", fSlogan: "منطقِ کد، جادوی سینما، هنرِ دیزاین.", fQL: "لینک‌های سریع", fGT: "تماس با ما", fVer: "تأیید گواهی", fHome: "صفحه اصلی", fFounder: "بنیان‌گذار و مدیر", fLoc: "کابل، افغانستان", fSend: "فرستادن پیام", modeD: "حالت تیره", modeL: "حالت روشن", lite: "حالت سبک",
      phase: { dawn: "سحر", day: "روز", golden: "غروب طلایی", night: "شب" }, kab: "کابل",
      pressTease: "بیو، عکس، فریم‌ها و رزومه برای رسانه‌ها و جشنواره‌ها.", pressBtn: "باز کردن کیت رسانه‌ای", cursorView: "نمایش", sPrev:"قبلی", sNext:"بعدی", sPause:"توقف", sPlay:"پخش خودکار", sOf:"از", sLabel:"اسلایدهای معرفی", progress:"پیشرفت صفحه", cursorPlay: "پخش",
      laurelsEmpty: "",
      signIn: "ورود", dCard: "کارت دیجیتال", dLab: "آزمایشگاه خلاق", mapT:"موقعیت", mapArea:"کابل، ناحیه هفتم (چهلستون)", mapShow:"نقشه زنده", mapOpen:"باز کردن در OpenStreetMap", mapNote:"این تصویر یک نقشه نمادین از محدوده است و آدرس دقیق نمایش داده نمی‌شود. نقشه زنده فقط پس از کلیک از OpenStreetMap بارگذاری می‌شود.", ckText:"این سایت کوکی ردیابی ندارد. زبان و رنگ‌بندی تو در همین مرورگر ذخیره می‌شود و بازدیدها بی‌نام شمرده می‌شوند (بدون اطلاعات شخصی؛ با «ردیابی نکن» خاموش است).", ckOk:"متوجه شدم", ckMore:"حریم خصوصی", chatLabel:"دستیار",  dGroup1:"پروفایل", dGroup2:"کارها", dGroup3:"اعتبار", dGroup4:"بیشتر", connect:"ارتباط:", nCourses:"دوره‌ها", cSoon:"به‌زودی", cLevel:"سطح", cTakenT:"دوره‌هایی که خودم گذرانده‌ام", cTakenP:"گواهی‌های رسمی من را ببین. هر گواهی به نام صادرکننده‌اش است.", cSeeCerts:"دیدن گواهی‌ها", cNote:"آکادمی هنوز باز نشده. این‌ها دوره‌های نمونه‌اند.",  aLogin:"ورود", aReg:"ساخت حساب", aPass:"رمز عبور", aForgot:"رمز را فراموش کردم", aConsent:"با ذخیره ایمیل و نامم برای حساب آکادمی موافقم.", aNote:"با ایمیل و رمز وارد شو.", aOff:"سیستم حساب هنوز وصل نشده. این صفحه آماده است و بعد از وصل شدن Supabase کار می‌کند.", aOffMsg:"حساب هنوز وصل نشده، پس چیزی انجام نشد.", aShort:"رمز دست‌کم ۸ نویسه باشد.", aCheck:"ایمیلت را بررسی کن.", aIn:"وارد شدی.", aBad:"ایمیل یا رمز درست نیست.",  contactIntro: "درباره پروژه‌ات بنویس. پاسخ به همین فرم داده می‌شود.",
      fName: "نام", fEmail: "ایمیل", fType: "نوع درخواست", fMsg: "پیام", fConsent: "اجازه می‌دهم برای پاسخ به این پیام از اطلاعاتم استفاده شود.",
      types: ["تدوین ویدیو", "طراحی گرافیک", "تولید فیلم", "همکاری یا دعوت جشنواره", "سایر"],
      send: "ارسال", sending: "در حال ارسال…",
      errName: "نام را بنویس.", errEmail: "یک ایمیل درست بنویس.", errMsg: "پیام را کمی کامل‌تر بنویس (حداقل ۱۰ حرف).", errConsent: "برای ارسال باید اجازه را تأیید کنی.",
      okSent: "پیامت ارسال شد. ممنون.", errSend: "ارسال نشد. دوباره تلاش کن یا از لینک‌های بالا پیام بده.",
      notConnected: "فرم هنوز به سرویس ارسال وصل نشده، پس چیزی ارسال نشد.",
      copy: "کپی پیام", copied: "کپی شد", copyFail: "کپی نشد. متن را دستی انتخاب کن.",
      back: "بازگشت به صفحه اصلی", projectsAll: "همه پروژه‌ها", year: "سال", role: "نقش", tools: "ابزارها", duration: "تایم‌کد", credits: "عوامل",
      video: "ویدیو", noVideo: "ویدیو هنوز اضافه نشده", play: "پخش ویدیو", stills: "فریم‌ها", noStills: "فریم‌ها هنوز اضافه نشده",
      before: "قبل", after: "بعد", baTitle: "قبل و بعد", baLabel: "جابه‌جایی مرز قبل و بعد",
      projText: "توضیح کوتاه: مشکل، کار تو، نتیجه.", projLong: "اینجا داستان کامل پروژه می‌آید: مشکل مشتری، کار تو، ابزارها و نتیجه.",
      pressTitle: "کیت رسانه‌ای", shortBio: "بیوگرافی کوتاه", longBio: "بیوگرافی کامل", facts: "اطلاعات سریع", downloads: "دانلودها",
      notAdded: "فایل هنوز اضافه نشده", download: "دانلود", copyBio: "کپی متن",
      pressUse: "استفاده از این مطالب برای معرفی انصارالحق مبارز آزاد است. تصاویر و ویدیوها بدون اجازه کتبی قابل استفاده تجاری نیستند.",
      privacyTitle: "حریم خصوصی و حقوق",
      notFoundTitle: "این صفحه پیدا نشد", notFoundText: "آدرس را بررسی کن یا به صفحه اصلی برگرد.",
      foot: "© " + new Date().getFullYear() + " آکادمی سینه‌کد",
      fCopy: "© " + new Date().getFullYear() + " آکادمی سینه‌کد · انصارالحق مبارز · همهٔ حقوق محفوظ است.", privacy: "حریم خصوصی", press: "کیت رسانه‌ای",
      noscript: "برای دیدن این سایت جاوااسکریپت را روشن کن."
    },
    en: {
      skip: "Skip to content", banner: "Preview: items marked “Sample” are not real records.",
      nAbout: "About", nBlog: "Blog", nGfx: "Graphic design", nReels: "Reels", nCertP: "Certificates", nEdu: "Education", vIntro: "My story begins with a scroll", vScroll: "Scroll", nVid: "Videos", vidOpen: "Open on YouTube", nExp: "Experience", nLang: "Languages", toTop: "Back to top", close: "Close", zoom: "View larger", nSkills: "Skills", nWork: "Work", nDesign: "Graphic design", srch: "Search", srchPh: "Search the site: certificates, courses, sections…", srchNone: "Nothing found.", srchPages: "Pages", cvT: "CV", cvPrint: "Print / Save as PDF", cvSum: "Summary", cvExp: "Experience", cvEdu: "Education", cvSk: "Skills", cvLg: "Languages", cvCe: "Selected certificates", cvLn: "Links", cvNote: "Certificates were issued by the named issuers. Original documents are available on request.", nAcademy: "CineCode Academy", nWorks: "All works", wkIntro: "My design work for educational centers, media and brands. Pick a category and move between pieces with the arrows.", wkCount: "works", wkBack: "Back to home", gAll: "See all works", gposD: "Occasion posts and cultural content", gacadD: "Course announcements and promotion", gbanD: "Banners, covers and video thumbnails", gbraD: "Logos, lettering and visual identity", gprnD: "Cards, brochures and print material", wkPrev: "Previous", wkNext: "Next", hsite: "A personal portfolio, works, credentials and a free academy, all in one place.", hcFilm: "Video & editing", hcDesign: "Graphic design", hcCerts: "Credentials", hcAcad: "Academy",errNet:"Could not reach the account server. Turn off any VPN or proxy, or open the site from http://localhost or 127.0.0.1 (not the in-app preview), then try again.",acctT:"My account",acctLoad:"Loading…",acctHi:"Hello",acctRole:"Role",acctEnr:"My courses",acctNoEnr:"You have not enrolled in any course yet.",acctBrowse:"Browse courses",acctLes:"lessons",acctProg:"Progress",acctAtt:"Exam results",acctNoAtt:"You have not taken an exam yet.",acctCert:"My certificates",acctNoCert:"No certificate yet. A certificate is issued only after passing the exam.",acctOut:"Sign out",acctErr:"Could not load your account. Please sign in again.",csBrief:"Brief",csProcess:"Process",csResult:"Result",tgClient:"Client",tgScale:"Scale",tgIndustry:"Industry",tgCountry:"Country",tgOutcome:"Outcome",tlT:"Timeline",tlP:"Every dated item, newest first.",tlUnd:"undated items (they are in the All items list)",tlNone:"No dated items yet.",ntT:"Notes",ntP:"Things I learned, articles, checklists and book notes. I write each one myself.",ntNone:"No notes published yet. The first one will appear here soon.",actT:"Activities",actP:"Events, community contributions, open source, mentoring and volunteering.",actNone:"No activities logged yet. Only real, provable entries are added.",tkT:"Toolkit",tkP:"Tools I work with, resumes, booking and live stats.",tkStack:"Tools and software",tkCv:"Resume",tkCvD:"Printable version and PDF.",tkBook:"Book a time",tkBookD:"The booking link is not set yet.",tkBookB:"Book a time",tkStats:"Live stats (real items only)",sx_work:"Designs and projects",sx_cert:"Certificates",sx_act:"Activities",sx_hours:"Mentoring hours",sx_notes:"Notes",sx_ms:"Milestones",ty_til:"Today I learned",ty_article:"Article",ty_checklist:"Checklist",ty_bookshelf:"Book",ty_translation:"Translation",ty_newsletter:"Newsletter",ty_event:"Event",ty_community:"Community",ty_opensource:"Open source",ty_mentoring:"Mentoring",ty_volunteering:"Volunteering",ty_milestone:"Milestone",ty_testimonial:"Testimonial",dirT:"All items",dirP:"Every work, credential and resource on this site in one list. Search and filter. The numbers above count real items only.",dirQ:"Search all items",dirAllL:"All sections",dirAllT:"All types",dirAllY:"All years",dirSam:"Also show samples",dirMore:"Show more",dirReal:"real items",dirNone:"No items found.",dirShow:"Show",ly_projects:"Projects and works",ly_activity:"Activity and impact",ly_credentials:"Credentials and history",ly_knowledge:"Knowledge and learning",ty_graphic:"Graphic design",ty_certificate:"Certificate",ty_education:"Education",ty_position:"Work history",ty_project:"Project",ty_course:"Course",ty_resource:"Resource",st_sample:"Sample",st_third:"Third-party",abT:"About me",abCr:"Background",abLg:"Languages",abCta:"Contact me",abWk:"See my work",svT:"Services",svP:"What I do. We agree price and timing after I see the project.",svH:"How it works",svCta:"Request a project",sv1:"Video editing",sv1D:"Cuts, rhythm, sound and colour, in Premiere Pro, After Effects and DaVinci Resolve.",sv2:"Graphic design",sv2D:"Posters, banners, logos and print material. Examples are in the works section.",sv3:"Filmmaking",sv3D:"From idea and shooting to editing, for short films and media content.",sp1:"Project brief",sp1D:"Tell me the goal, the audience and the files you have.",sp2:"Draft",sp2D:"You see a first version.",sp3:"Revise",sp3D:"I apply your feedback.",sp4:"Delivery",sp4D:"Final files in the format you need.",libPT:"Study library",libPD:"Links to learning resources. The \"Third-party\" label means I did not make that resource.",libQ:"Search resources",libAllT:"All types",libAllL:"All levels",libFree:"Free",libThird:"External link",libFirst:"My own",libOpen:"Open",libNone:"No resources found.",libN:"resources",t_course:"Course", t_book:"Book", t_stock:"Assets",t_video:"Video",t_article:"Article",t_software:"Software",t_sound:"Sound",stGal:"Design works",stCert:"Certificates",stEdu:"Education entries",stLang:"Languages",stNote:"These numbers are counted from the real lists on this site.",pcT:"Where to start?",pc1D:"Graphic designs, banners, logos and print, with category filters.",pc2D:"The free academy: courses and learning catalogue. Sign-up and exams go live once the server is connected.",pc3D:"Certificates plus education and work history, with filters.",pc4D:"Printable CV, press kit and ways to get in touch.",pcGo:"Open", kabulT: "Kabul time", gnote: "Selected design work. Brand names and logos inside the pieces belong to their owners.", nCerts: "Certificates", nLaurels: "Awards", nPress: "Press kit", nLinks: "Links", nContact: "Contact", nHome: "Home",
      cta1: "View work", cta2: "Work with me",
      g1: "Video editing & production", g2: "Graphic design", g3: "Computer science", pending: "After documents are reviewed",
      sample: "Sample", projectTitle: "Sample project", certTitle: "Sample certificate", unknown: "—",
      cats: { top: "Featured", lang: "Language & Teaching", biz: "Business & Marketing", all: "All", cs: "Tech & AI", design: "Design", film: "Film & Editing", edit: "Editing", code: "Code", designW: "Graphic design", community: "Training & community", work: "Work & academy", gpost: "Posters & social", gacad: "Academy promos", gban: "Banners & thumbnails", gbra: "Logo & identity", gprn: "Print & cards" },
      open: "Available for work", busy: "Currently booked", verify: "Official verification", noVerify: "Verification link not added yet",
      lang: "فارسی", fMission: "Our mission is to cultivate a new generation of multi-dimensional creators who erase the boundaries between computer engineering and audiovisual arts. CineCode is the bridge between algorithms and timeless frames.", fSlogan: "The logic of code. The magic of cinema. The art of design.", fQL: "Quick links", fGT: "Get in touch", fVer: "Certificate verification", fHome: "Home", fFounder: "Founder and director", fLoc: "Kabul, Afghanistan", fSend: "Send a message", modeD: "Dark mode", modeL: "Light mode", lite: "Lite mode",
      phase: { dawn: "Dawn", day: "Day", golden: "Golden hour", night: "Night" }, kab: "Kabul",
      pressTease: "Bio, photo, stills and CV for press and festivals.", pressBtn: "Open the press kit", cursorView: "View", sPrev:"Previous", sNext:"Next", sPause:"Pause", sPlay:"Auto-play", sOf:"of", sLabel:"Highlights", progress:"Page progress", cursorPlay: "Play",
      laurelsEmpty: "",
      signIn: "Sign in", dCard: "Digital card", dLab: "Creative Lab", mapT:"Location", mapArea:"Kabul, District 7 (Chehelsotoon)", mapShow:"Live map", mapOpen:"Open in OpenStreetMap", mapNote:"This is a symbolic map of the area; no exact address is shown. The live map loads from OpenStreetMap only after you click.", ckText:"This site has no tracking cookies. It remembers your language and theme in your own browser and counts visits anonymously (no personal data; off if you send Do Not Track).", ckOk:"Got it", ckMore:"Privacy", chatLabel:"Assistant",  dGroup1:"Profile", dGroup2:"Work", dGroup3:"Credentials", dGroup4:"More", connect:"Connect:", nCourses:"Courses", cSoon:"Coming soon", cLevel:"Level", cTakenT:"Courses I have taken", cTakenP:"See my official certificates. Each one belongs to its issuer.", cSeeCerts:"See certificates", cNote:"The academy is not open yet. These are sample courses.",  aLogin:"Sign in", aReg:"Create account", aPass:"Password", aForgot:"Forgot password", aConsent:"I agree that my email and name are stored for an academy account.", aNote:"Sign in with your email and password.", aOff:"The account system is not connected yet. This page is ready and works once Supabase is connected.", aOffMsg:"Accounts are not connected yet, so nothing was done.", aShort:"Password must be at least 8 characters.", aCheck:"Check your email.", aIn:"You are signed in.", aBad:"Email or password is wrong.",  contactIntro: "Tell me about your project. Replies go to the email you enter here.",
      fName: "Name", fEmail: "Email", fType: "Request type", fMsg: "Message", fConsent: "I agree that my details are used to reply to this message.",
      types: ["Video editing", "Graphic design", "Film production", "Collaboration or festival invitation", "Other"],
      send: "Send", sending: "Sending…",
      errName: "Enter your name.", errEmail: "Enter a valid email.", errMsg: "Write a little more (at least 10 characters).", errConsent: "Please confirm the consent to send.",
      okSent: "Your message was sent. Thank you.", errSend: "It could not be sent. Try again or message through the links above.",
      notConnected: "The form is not connected to a sending service yet, so nothing was sent.",
      copy: "Copy message", copied: "Copied", copyFail: "Copy failed. Select the text by hand.",
      back: "Back to home", projectsAll: "All projects", year: "Year", role: "Role", tools: "Tools", duration: "Timecode", credits: "Credits",
      video: "Video", noVideo: "Video not added yet", play: "Play video", stills: "Stills", noStills: "Stills not added yet",
      before: "Before", after: "After", baTitle: "Before and after", baLabel: "Move the before and after divider",
      projText: "Short note: the problem, your role, the result.", projLong: "The full project story goes here: the client's problem, your role, the tools and the result.",
      pressTitle: "Press kit", shortBio: "Short bio", longBio: "Full bio", facts: "Quick facts", downloads: "Downloads",
      notAdded: "File not added yet", download: "Download", copyBio: "Copy text",
      pressUse: "These texts may be used to introduce Ansarulhaq Mubarez. Images and videos may not be used commercially without written permission.",
      privacyTitle: "Privacy and rights",
      notFoundTitle: "This page was not found", notFoundText: "Check the address or return to the home page.",
      foot: "© " + new Date().getFullYear() + " CineCode Academy",
      fCopy: "© " + new Date().getFullYear() + " CineCode Academy · Ansarulhaq Mubarez · All rights reserved.", privacy: "Privacy", press: "Press kit",
      noscript: "Turn on JavaScript to view this site."
    }
  }
};

/* Pashto (starter translation of the most visible texts; missing keys fall back to Persian). Review by a native speaker is recommended. */
window.SITE.ui.ps = {
 "skip": "محتوا ته ورتلل",
 "nAbout": "زما په اړه",
 "nBlog": "ویبلاګ",
 "nGfx": "د ګرافیک ډیزاین نمونې",
 "nReels": "ریلز",
 "nCertP": "تصدیق‌لیکونه",
 "nEdu": "زده‌کړې",
 "nVid": "ویډیوګانې",
 "nExp": "د کار تجربې",
 "nLang": "ژبې",
 "toTop": "پورته ته ورتګ",
 "close": "بندول",
 "nSkills": "مهارتونه",
 "nWork": "نمونه کارونه",
 "nDesign": "ګرافیک ډیزاین",
 "srch": "لټون",
 "srchPh": "په سایټ کې لټون: سند، کورس، برخه…",
 "srchNone": "څه و نه موندل شول.",
 "cvT": "ژوندلیک",
 "cvPrint": "چاپ",
 "nAcademy": "د سینه‌کوډ اکاډمي",
 "nWorks": "ټول نمونه کارونه",
 "wkBack": "لومړي مخ ته ورتګ",
 "gAll": "ټول نمونه کارونه وګورئ",
 "wkPrev": "مخکینی",
 "wkNext": "راتلونکی",
 "hsite": "شخصي پورټ‌فولیو، نمونه کارونه، سندونه او وړیا اکاډمي، ټول په یو ځای کې.",
 "acctT": "زما حساب",
 "acctLoad": "بارول کېږي…",
 "acctHi": "سلام",
 "acctEnr": "زما کورسونه",
 "acctNoEnr": "تاسو لا په کوم کورس کې نوم نه دی لیکلی.",
 "acctBrowse": "کورسونه وګورئ",
 "acctLes": "لوست",
 "acctProg": "پرمختګ",
 "acctAtt": "د ازموینو پایلې",
 "acctNoAtt": "تاسو لا ازموینه نه ده ورکړې.",
 "acctCert": "زما تصدیق‌لیکونه",
 "acctNoCert": "تاسو لا تصدیق‌لیک نه دی ترلاسه کړی. تصدیق‌لیک یوازې د ازموینې له بریا وروسته ورکول کېږي.",
 "acctOut": "وتل",
 "abT": "زما په اړه",
 "svT": "خدمتونه",
 "libPT": "د سرچینو کتابتون",
 "libFree": "وړیا",
 "libOpen": "پرانیستل",
 "libNone": "هیڅ سرچینه و نه موندل شوه.",
 "nCerts": "سندونه",
 "nLaurels": "جایزې",
 "nPress": "د رسنیو کټ",
 "nLinks": "لینکونه",
 "nContact": "اړیکه",
 "nHome": "کور",
 "cta1": "نمونه کارونه وګورئ",
 "cta2": "زما سره همکاري",
 "g1": "د ویډیو ترمیم او تولید",
 "g2": "ګرافیک ډیزاین",
 "g3": "کمپیوټر ساینس",
 "sample": "نمونه",
 "open": "د همکارۍ لپاره چمتو",
 "busy": "اوس بوخت یم",
 "verify": "رسمي تایید",
 "fSlogan": "د کوډ منطق، د سینما جادو، د ډیزاین هنر.",
 "fQL": "چټک لینکونه",
 "fGT": "موږ سره اړیکه",
 "fVer": "د تصدیق‌لیک تایید",
 "fHome": "لومړی مخ",
 "fLoc": "کابل، افغانستان",
 "fSend": "پیغام واستوئ",
 "modeD": "تیاره حالت",
 "modeL": "روښانه حالت",
 "lite": "سپک حالت",
 "kab": "کابل",
 "kabulT": "د کابل وخت",
 "pressBtn": "د رسنیو کټ پرانیستل",
 "signIn": "ننوتل",
 "mapT": "موقعیت",
 "ckOk": "پوه شوم",
 "ckMore": "محرمیت",
 "dGroup1": "پروفایل",
 "dGroup2": "کارونه",
 "dGroup3": "اعتبار",
 "dGroup4": "نور",
 "nCourses": "کورسونه",
 "aLogin": "ننوتل",
 "aReg": "حساب جوړول",
 "aPass": "پټنوم",
 "aForgot": "پټنوم مې هیر شوی",
 "aIn": "تاسو ننوتلی یاست.",
 "aBad": "بریښنالیک یا پټنوم سم نه دی.",
 "aShort": "پټنوم لږ تر لږه ۸ توري وي.",
 "aCheck": "خپل بریښنالیک وګورئ.",
 "contactIntro": "د خپلې پروژې په اړه ولیکئ. ځواب به همدې فورمې ته درکړل شي.",
 "fName": "نوم",
 "fEmail": "بریښنالیک",
 "fType": "د غوښتنې ډول",
 "fMsg": "پیغام",
 "send": "استول",
 "sending": "استول کېږي…",
 "errName": "نوم ولیکئ.",
 "errEmail": "سم بریښنالیک ولیکئ.",
 "errMsg": "پیغام لږ بشپړ ولیکئ (لږ تر لږه ۱۰ توري).",
 "okSent": "ستاسو پیغام ولېږل شو. مننه.",
 "errSend": "ونه لېږل شو. بیا هڅه وکړئ.",
 "copy": "د پیغام کاپي",
 "copied": "کاپي شو",
 "back": "لومړي مخ ته ورتګ",
 "projectsAll": "ټول پروژې",
 "year": "کال",
 "role": "رول",
 "tools": "وسایل",
 "video": "ویډیو",
 "play": "ویډیو پلې کول",
 "download": "ډاونلوډ",
 "privacyTitle": "محرمیت او حقونه",
 "notFoundTitle": "دا پاڼه و نه موندل شوه",
 "notFoundText": "پته وګورئ یا لومړي مخ ته ورشئ.",
 "fCopy": "© 2026 د سینه‌کوډ اکاډمي · انصارالحق مبارز · ټول حقونه خوندي دي.",
 "privacy": "محرمیت",
 "press": "د رسنیو کټ",
 "noscript": "د دې سایټ لیدو لپاره جاواسکریپټ فعال کړئ.",
 "sPrev": "مخکینی",
 "sNext": "راتلونکی",
 "pcT": "له کوم ځای پیل کړم؟",
 "pcGo": "ننوتل",
 "foot": "© 2026 د سینه‌کوډ اکاډمي",
 "cSoon": "ډیر ژر",
 "cLevel": "کچه",
 "cSeeCerts": "تصدیق‌لیکونه وګورئ"
};
window.SITE.ui.ps.foot = "© " + new Date().getFullYear() + " د سینه‌کوډ اکاډمي";
window.SITE.ui.ps.fCopy = "© " + new Date().getFullYear() + " د سینه‌کوډ اکاډمي · انصارالحق مبارز · ټول حقونه خوندي دي.";
Object.assign(window.SITE.ui.fa, { nStudio: "استودیوی خلاق", nPortfolio: "نمونه‌کارها", nJournal: "ژورنال", nServices: "خدمات", stPortal: "پورتال دانشجو" });
Object.assign(window.SITE.ui.en, { nStudio: "Creative Studio", nPortfolio: "Portfolio", nJournal: "Journal", nServices: "Services", stPortal: "Student Portal" });
Object.assign(window.SITE.ui.ps, { nStudio: "تخلیقي سټوډیو", nPortfolio: "نمونه کارونه", nJournal: "ژورنال", nServices: "خدمتونه", stPortal: "د زده‌کوونکي پورتال" });
window.SITE.ui.fa.nAcad = "آکادمی"; window.SITE.ui.en.nAcad = "Academy"; window.SITE.ui.ps.nAcad = "اکاډمي";

/* v165 navigation strings */
Object.assign(window.SITE.ui.fa, { nFaq: "پرسش‌های متداول", stStart: "شروع یادگیری", nFeedback: "بازخورد" });
Object.assign(window.SITE.ui.en, { nFaq: "FAQ", stStart: "Start learning", nFeedback: "Feedback" });
if (window.SITE.ui.ps) Object.assign(window.SITE.ui.ps, { nFaq: "پوښتنې", stStart: "زده کړه پیل کړه", nFeedback: "نظر" });
Object.assign(window.SITE.ui.fa, { ftExplore: "کاوش" });Object.assign(window.SITE.ui.en, { ftExplore: "Explore" });if (window.SITE.ui.ps) Object.assign(window.SITE.ui.ps, { ftExplore: "سپړنه" });
Object.assign(window.SITE.ui.fa, { nSocial: "شبکه‌های اجتماعی", nResources: "آرشیو منابع" });Object.assign(window.SITE.ui.en, { nSocial: "Social media", nResources: "Resource archive" });if (window.SITE.ui.ps) Object.assign(window.SITE.ui.ps, { nSocial: "ټولنیز رسنۍ", nResources: "د سرچینو آرشیف" });

Object.assign(window.SITE.ui.fa, { nPortfolio: "پورتفولیو" });Object.assign(window.SITE.ui.en, { nPortfolio: "Portfolio" });if (window.SITE.ui.ps) Object.assign(window.SITE.ui.ps, { nPortfolio: "پورټفولیو" });
