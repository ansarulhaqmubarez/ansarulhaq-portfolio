/* CineCode Academy · 2027 shared shell enhancement
   Native JS only. Uses local project imagery and the site's existing forms/settings. */
(function () {
  "use strict";
  var R = document.documentElement, S = window.SITE || {};
  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var L = {
    fa: {
      academy:"آکادمی", studio:"استودیو", articles:"مقاله‌ها", resources:"منابع", about:"درباره",
      start:"شروع یادگیری", hire:"سفارش پروژه", intro:"آموزش، تصویر و فناوری؛ در یک مسیر خلاق.",
      academyTitle:"از یادگیری تا ساختن", academyCopy:"دوره‌ها و منابع را بر اساس مهارت انتخاب کن.",
      studioTitle:"کارهای دیدنی، داستان‌های واقعی", studioCopy:"پروژه‌های سینما، طراحی و فناوری را ببین.",
      allAcademy:"ورود به آکادمی", allStudio:"دیدن همهٔ نمونه‌کارها",
      courses:"دوره‌ها", library:"کتابخانهٔ یادگیری", certificates:"گواهی‌ها", verify:"استعلام گواهی",
      filmmaking:"فیلم‌سازی", editing:"تدوین", design:"طراحی گرافیک", ai:"هوش مصنوعی", web:"برنامه‌نویسی و وب",
      featureAcademy:"آکادمی سینه‌کد", featureStudio:"از ایده تا قاب نهایی",
      preTag:"CINEMA · DESIGN · CODE", preTitle:"ایده‌ات را به تجربه‌ای دیدنی تبدیل کن",
      preCopy:"برای یادگیری مهارتی تازه یا ساخت پروژهٔ بعدی‌ات، از همین‌جا آغاز کن.",
      newsTitle:"خبرهای تازهٔ آکادمی", newsCopy:"درخواست دریافت خبر دوره‌ها و برنامه‌های تازه را بفرست.",
      email:"آدرس ایمیل", consent:"موافقم خبرهای آموزشی آکادمی را از طریق ایمیل دریافت کنم.",
      submit:"ثبت درخواست", success:"درخواستت به تیم آکادمی فرستاده شد.", fail:"ارسال نشد. کمی بعد دوباره تلاش کن.",
      required:"ایمیل معتبر و موافقت با دریافت خبرها لازم است.",
      verifyTitle:"استعلام گواهی‌نامه", verifyCopy:"کد گواهی را وارد کن تا اعتبار آن بررسی شود.", code:"کد گواهی", check:"بررسی",
      statusCheck:"در حال بررسی وضعیت سایت…", statusUp:"سایت در دسترس است", statusDown:"سایت اکنون پاسخ نمی‌دهد", statusUnknown:"وضعیت سایت معلوم نیست"
    },
    en: {
      academy:"Academy", studio:"Studio", articles:"Articles", resources:"Resources", about:"About",
      start:"Start learning", hire:"Request a project", intro:"Learning, image-making and technology in one creative path.",
      academyTitle:"Learn it. Make it.", academyCopy:"Choose a course or resource by the skill you want to build.",
      studioTitle:"Selected work, real stories", studioCopy:"Explore projects across cinema, design and technology.",
      allAcademy:"Explore the Academy", allStudio:"View selected work",
      courses:"Courses", library:"Learning library", certificates:"Certificates", verify:"Verify a certificate",
      filmmaking:"Filmmaking", editing:"Video editing", design:"Graphic design", ai:"Artificial intelligence", web:"Programming & web",
      featureAcademy:"CineCode Academy", featureStudio:"From first idea to final frame",
      preTag:"CINEMA · DESIGN · CODE", preTitle:"Turn your next idea into something worth seeing",
      preCopy:"Start here to learn a new skill or build your next creative project.",
      newsTitle:"Academy updates", newsCopy:"Request updates about new courses and learning events.",
      email:"Email address", consent:"I agree to receive learning updates from the Academy by email.",
      submit:"Request updates", success:"Your request was sent to the Academy team.", fail:"Could not send. Please try again shortly.",
      required:"Enter a valid email and agree to receive updates.",
      verifyTitle:"Certificate verification", verifyCopy:"Enter a certificate code to check its status.", code:"Certificate code", check:"Check",
      statusCheck:"Checking site availability…", statusUp:"Site is reachable", statusDown:"The site is not responding", statusUnknown:"Site status is unavailable"
    },
    ps: {
      academy:"اکاډمي", studio:"سټوډیو", articles:"مقالې", resources:"سرچینې", about:"زموږ په اړه",
      start:"زده‌کړه پیل کړئ", hire:"د پروژې غوښتنه", intro:"زده‌کړه، انځور او ټکنالوژي په یوه تخلیقي لاره کې.",
      academyTitle:"زده‌کړه او جوړونه", academyCopy:"د خپلې خوښې مهارت لپاره کورس یا سرچینه وټاکئ.",
      studioTitle:"ټاکل شوي کارونه او ریښتینې کیسې", studioCopy:"د سینما، ډیزاین او ټکنالوژۍ پروژې وګورئ.",
      allAcademy:"اکاډمۍ ته ورشئ", allStudio:"ټاکل شوي کارونه وګورئ",
      courses:"کورسونه", library:"د زده‌کړې کتابتون", certificates:"سندونه", verify:"د سند تایید",
      filmmaking:"فلم‌جوړونه", editing:"ویډیو اېډېټ", design:"ګرافیک ډیزاین", ai:"مصنوعي ځیرکتیا", web:"پروګرام‌لیکنه او وېب",
      featureAcademy:"سینه‌کوډ اکاډمي", featureStudio:"له مفکورې تر وروستي چوکاټه",
      preTag:"سینما · ډیزاین · کوډ", preTitle:"خپله مفکوره په لیدلو وړ تجربه بدله کړئ",
      preCopy:"د نوي مهارت یا خپلې راتلونکې پروژې لپاره له همدې ځایه پیل وکړئ.",
      newsTitle:"د اکاډمۍ تازه خبرونه", newsCopy:"د نویو کورسونو او زده‌کړیزو پروګرامونو خبرونه وغواړئ.",
      email:"برېښنالیک", consent:"زه د اکاډمۍ د زده‌کړې خبرونه د برېښنالیک له لارې منم.",
      submit:"غوښتنه ولېږئ", success:"ستاسو غوښتنه د اکاډمۍ ډلې ته ولېږل شوه.", fail:"ولېږل نه شو. لږ وروسته بیا هڅه وکړئ.",
      required:"سم برېښنالیک ولیکئ او د خبرونو ترلاسه کول ومنئ.",
      verifyTitle:"د سند تایید", verifyCopy:"د سند کوډ ولیکئ چې حالت یې وکتل شي.", code:"د سند کوډ", check:"کتل",
      statusCheck:"د وېب‌پاڼې شتون کتل کېږي…", statusUp:"وېب‌پاڼه د لاسرسي وړ ده", statusDown:"وېب‌پاڼه ځواب نه ورکوي", statusUnknown:"د وېب‌پاڼې حالت معلوم نه دی"
    }
  };
  function locale() { return R.dataset.ps === "1" || R.lang === "ps" ? "ps" : (R.lang === "en" ? "en" : "fa"); }
  function text(k) { return (L[locale()] || L.fa)[k] || L.fa[k] || k; }
  function safe(s) { return String(s || "").replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function icon(kind) {
    var path = {
      film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
      book:'<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 5v16"/>',
      award:'<circle cx="12" cy="9" r="5"/><path d="m8.5 13-1 8 4.5-2.5 4.5 2.5-1-8"/>',
      grid:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
      code:'<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/>',
      arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(path[kind]||path.grid)+'</svg>';
  }
  var academyItems = [
    ["academy.html#courses","courses","book"],["academy.html#courses","filmmaking","film"],
    ["library.html","library","book"],["certificates.html","certificates","award"],["verify.html","verify","award"]
  ];
  var studioItems = [
    ["portfolio.html","filmmaking","film"],["works.html","editing","grid"],["graphics.html","design","grid"],
    ["lab.html","ai","code"],["services.html","web","code"]
  ];
  function linkMarkup(item) {
    return '<a class="cc-menu-link" href="'+item[0]+'"><span class="cc-menu-icon">'+icon(item[2])+'</span><span>'+safe(text(item[1]))+'</span></a>';
  }
  function menuMarkup(id, key, items, featured, image, allHref, allKey, copyKey) {
    var itemsHtml = items.map(linkMarkup).join("");
    return '<div class="cc-nav-item" data-cc-menu="'+id+'">'+
      '<button type="button" aria-expanded="false" aria-haspopup="true" aria-controls="cc-mega-'+id+'">'+safe(text(key))+'<svg class="cc-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m3 6 5 5 5-5"/></svg></button>'+
      '<section class="cc-mega" id="cc-mega-'+id+'" aria-label="'+safe(text(key))+'">'+
       '<div class="cc-mega-intro"><span class="cc-eyebrow">'+safe(text("preTag"))+'</span><h3>'+safe(text(featured))+'</h3><p>'+safe(text(copyKey))+'</p><a class="cc-mega-all" href="'+allHref+'">'+safe(text(allKey))+' '+icon("arrow")+'</a></div>'+
       '<div class="cc-mega-links">'+itemsHtml+'</div>'+
       '<a class="cc-feature cc-spot" data-cc-spotlight href="'+allHref+'"><img src="'+image+'" alt="" loading="lazy"><span class="cc-feature-copy"><span class="cc-eyebrow">CINECODE / 2027</span><strong>'+safe(text(featured))+'</strong><small>'+safe(text(allKey))+'</small></span></a>'+
      '</section></div>';
  }
  function buildNav(nav, home) {
    if (!nav || nav.dataset.ccReady === "1") return;
    nav.dataset.ccReady = "1";
    nav.classList.add("cc-navigation");
    nav.setAttribute("aria-label", locale()==="en" ? "Main navigation" : locale()==="ps" ? "اصلي غورنل" : "منوی اصلی");
    nav.innerHTML =
      menuMarkup("academy","academy",academyItems,"academyTitle","assets/promo/academy-fa-post.jpg","academy.html","allAcademy","academyCopy")+
      menuMarkup("studio","studio",studioItems,"studioTitle","assets/work/w001-t.webp","portfolio.html","allStudio","studioCopy")+
      '<a href="blog.html">'+safe(text("articles"))+'</a>'+
      '<a href="resources.html">'+safe(text("resources"))+'</a>'+
      '<a href="about.html">'+safe(text("about"))+'</a>';
    if (home) { nav.classList.remove("hidden"); }
  }
  function mountHeader() {
    var homeHeader = q("body>header.sticky"), inner = q("#site-header");
    var header = homeHeader || inner; if (!header) return;
    header.dataset.ccShell = "1";
    var home = !!homeHeader;
    var nav = home ? q("nav",header) : q(".hnav",header);
    buildNav(nav,home);
    var target = home ? (q(".max-w-7xl",header)||header.firstElementChild) : q(".tools",header);
    if (home) {
      var actions = q(".cc-home-actions",header);
      if (!actions) {
        actions = document.createElement("div"); actions.className = "cc-home-actions";
        actions.innerHTML = '<a class="cc-secondary-cta" href="services.html">'+safe(text("hire"))+'</a><a class="cc-primary-cta" href="academy.html#courses">'+safe(text("start"))+'</a>';
        if (target) target.insertBefore(actions, target.lastElementChild);
      }
      if (!q(".cc-language-home",header)) {
        var lang = document.createElement("label"); lang.className = "cc-language-home cc-locale";
        lang.innerHTML = '<span class="sr-only">'+(locale()==="en"?"Language":"زبان")+'</span><select aria-label="'+(locale()==="en"?"Language":"زبان")+'"><option value="fa">دری</option><option value="ps">پښتو</option><option value="en">EN</option></select>';
        if (target) target.insertBefore(lang, actions || target.lastElementChild);
        lang.querySelector("select").value=locale();
        lang.querySelector("select").addEventListener("change",function(){setLocale(this.value);});
      }
    } else {
      var tools=target;
      if (tools && !q(".cc-primary-cta",tools)) {
        var cta=document.createElement("a");cta.className="cc-primary-cta";cta.href="academy.html#courses";cta.textContent=text("start");
        var search=q("#srchBtn",tools);if(search)tools.insertBefore(cta,search);else tools.appendChild(cta);
      }
    }
    if (!q(".cc-scroll-progress",header)) {
      var prog=document.createElement("span");prog.className="cc-scroll-progress";prog.setAttribute("aria-hidden","true");prog.innerHTML="<i></i>";header.appendChild(prog);
    }
    bindMenus(nav);
    bindSpotlights(header);
  }
  function bindMenus(nav) {
    if(!nav || nav.dataset.ccBound==="1")return;
    nav.dataset.ccBound="1";
    qa(".cc-nav-item>button",nav).forEach(function(b){
      b.addEventListener("click",function(e){e.preventDefault();var item=b.parentElement,open=item.getAttribute("aria-expanded")==="true";qa(".cc-nav-item",nav).forEach(function(x){x.setAttribute("aria-expanded","false");var y=q("button",x);if(y)y.setAttribute("aria-expanded","false");});
        item.setAttribute("aria-expanded",open?"false":"true");b.setAttribute("aria-expanded",open?"false":"true");
      });
    });
    nav.addEventListener("click",function(e){if(e.target.closest("a"))qa(".cc-nav-item",nav).forEach(function(x){x.setAttribute("aria-expanded","false");var b=q("button",x);if(b)b.setAttribute("aria-expanded","false");});});
    document.addEventListener("click",function(e){if(!nav.contains(e.target))qa(".cc-nav-item",nav).forEach(function(x){x.setAttribute("aria-expanded","false");var b=q("button",x);if(b)b.setAttribute("aria-expanded","false");});});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){qa(".cc-nav-item",nav).forEach(function(x){x.setAttribute("aria-expanded","false");var b=q("button",x);if(b)b.setAttribute("aria-expanded","false");});}});
  }
  function updateProgress() {
    var hs=qa("#site-header,body>header.sticky");
    hs.forEach(function(h){var bar=q(".cc-scroll-progress i",h);if(!bar)return;var max=document.documentElement.scrollHeight-innerHeight;bar.style.transform="scaleX("+ (max>0?Math.min(1,scrollY/max):0)+")";});
  }
  function bindSpotlights(root) {
    qa("[data-cc-spotlight],.cc-spot",root).forEach(function(el){
      if(el.dataset.ccSpot==="1")return;el.dataset.ccSpot="1";el.classList.add("cc-spot");
      el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect();el.style.setProperty("--cc-x",(e.clientX-r.left)+"px");el.style.setProperty("--cc-y",(e.clientY-r.top)+"px");});
    });
  }
  function footerMarkup() {
    return '<section class="cc-prefooter cc-reveal" aria-labelledby="cc-pre-title">'+
      '<div class="cc-pre-copy"><span class="cc-eyebrow">'+safe(text("preTag"))+'</span><h2 id="cc-pre-title">'+safe(text("preTitle"))+'</h2><p>'+safe(text("preCopy"))+'</p>'+
      '<div class="cc-pre-actions"><a href="academy.html#courses">'+safe(text("start"))+' '+icon("arrow")+'</a><a href="services.html">'+safe(text("hire"))+' '+icon("arrow")+'</a></div></div>'+
      '<div class="cc-pre-side"><div class="cc-verify-card"><strong>'+safe(text("verifyTitle"))+'</strong><p>'+safe(text("verifyCopy"))+'</p>'+
      '<form class="cc-verify-form" action="verify.html" method="get"><input name="code" maxlength="24" autocomplete="off" placeholder="'+safe(text("code"))+'" aria-label="'+safe(text("code"))+'"><button type="submit">'+safe(text("check"))+'</button></form></div>'+
      '<div class="cc-pre-meta"><a href="verify.html">'+safe(text("verify"))+' '+icon("arrow")+'</a><span class="cc-live" data-state="checking"><i aria-hidden="true"></i><span>'+safe(text("statusCheck"))+'</span></span></div></div>'+
      '</section>';
  }
  function newsletterMarkup() {
    return '<section class="cc-newsletter cc-reveal" aria-labelledby="cc-news-title"><div class="cc-news-copy"><span class="cc-eyebrow">CINECODE / UPDATES</span><strong id="cc-news-title">'+safe(text("newsTitle"))+'</strong><p>'+safe(text("newsCopy"))+'</p></div>'+
      '<form class="cc-news-form" novalidate><div class="cc-news-fields"><input type="email" name="email" dir="ltr" autocomplete="email" maxlength="254" placeholder="'+safe(text("email"))+'" aria-label="'+safe(text("email"))+'" required>'+
      '<label class="cc-news-consent"><input type="checkbox" name="consent" required><span>'+safe(text("consent"))+'</span></label><div class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>'+
      '<button type="submit">'+safe(text("submit"))+'</button><p class="cc-news-status" role="status" aria-live="polite"></p></div></form></section>';
  }
  function mountFooter() {
    var f=q("#site-footer")||q("body>footer.bg-dk");if(!f)return;
    if(!q(".cc-prefooter",f)){
      var pre=document.createElement("div");pre.innerHTML=footerMarkup();var section=pre.firstElementChild;
      var wrap=q(".wrap.fx",f)||q(".mx-auto.max-w-7xl",f);
      if(wrap)wrap.insertBefore(section,wrap.firstElementChild);
      else f.insertBefore(section,f.children[1]||null);
    }
    if(!q(".cc-newsletter",f)){
      var host=q(".wrap.fx",f)||q(".mx-auto.max-w-7xl",f)||f;
      var block=document.createElement("div");block.innerHTML=newsletterMarkup();
      var legal=q(".fbar",f)||q(".border-t",f);
      if(legal&&legal.parentNode===host)host.insertBefore(block.firstElementChild,legal);else if(host.parentNode)host.parentNode.insertBefore(block.firstElementChild,legal||host.nextSibling);else host.appendChild(block.firstElementChild);
    }
    bindNewsletter(f);bindSpotlights(f);observeReveal(f);checkSiteStatus(f);
  }
  function bindNewsletter(root) {
    var form=q(".cc-news-form",root);if(!form||form.dataset.bound==="1")return;form.dataset.bound="1";
    form.addEventListener("submit",async function(e){
      e.preventDefault();var email=form.elements.email.value.trim(),consent=form.elements.consent.checked,status=q(".cc-news-status",form),btn=q("button[type=submit]",form);
      if(form.elements.website.value)return;
      if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email)||!consent){status.textContent=text("required");return;}
      if(!S.formEndpoint||!S.formKey){status.textContent=text("fail");return;}
      btn.disabled=true;status.textContent=locale()==="en"?"Sending…":"در حال فرستادن…";
      try{
        var data={access_key:S.formKey,email:email,subject:"CineCode Academy update request",from_name:"CineCode Academy",message:"A visitor requested academy learning updates and consented by email."};
        var response=await fetch(S.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)});
        var result=await response.json();if(!response.ok||!result.success)throw new Error("Form submission failed");
        status.textContent=text("success");form.reset();
      }catch(err){status.textContent=text("fail");}
      finally{btn.disabled=false;}
    });
  }
  function checkSiteStatus(root) {
    var live=q(".cc-live",root);if(!live||live.dataset.checked==="1")return;live.dataset.checked="1";
    var label=q("span",live);if(label)label.textContent=text("statusCheck");
    fetch("/robots.txt",{cache:"no-store",credentials:"same-origin"}).then(function(r){if(!r.ok)throw new Error();live.dataset.state="up";if(label)label.textContent=text("statusUp");}).catch(function(){live.dataset.state="down";if(label)label.textContent=text("statusDown");});
  }
  function observeReveal(root) {
    var els=qa(".cc-reveal",root);if(!("IntersectionObserver"in window)||matchMedia("(prefers-reduced-motion: reduce)").matches){els.forEach(function(e){e.classList.add("cc-visible");});return;}
    var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add("cc-visible");io.unobserve(e.target);}});},{threshold:.08});
    els.forEach(function(e){if(!e.classList.contains("cc-visible")&&e.dataset.ccReveal!=="1"){e.dataset.ccReveal="1";io.observe(e);}});
  }
  function setLocale(next) {
    var old=locale();if(next===old)return;
    if(next==="en"||next==="fa"){
      if(old==="ps"){try{localStorage.setItem("am-ps","0");localStorage.setItem("am-lang",next);}catch(e){}R.dataset.ps="0";R.lang=next;R.dir=next==="fa"?"rtl":"ltr";location.reload();return;}
      var b=q("#langBtn");if(b&&((next==="en")!==(R.lang==="en")))b.click();
    }else{
      try{localStorage.setItem("am-lang","fa");localStorage.setItem("am-ps","1");}catch(e){}
      R.lang="ps";R.dir="rtl";R.dataset.ps="1";location.reload();return;
    }
  }
  function refreshLabels() {
    qa("#site-header .cc-navigation,body>header.sticky .cc-navigation").forEach(function(n){n.dataset.ccReady="";buildNav(n,n.closest("body>header.sticky")!==null);});
    qa(".cc-primary-cta").forEach(function(a){a.textContent=text("start");});
    qa(".cc-secondary-cta").forEach(function(a){a.textContent=text("hire");});
  }
  function refreshAll() {
    mountHeader();mountFooter();updateProgress();
  }
  var scheduled=false;
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;refreshAll();});}
  function init(){
    if(!q("#site-header")&&localStorage.getItem("am-ps")==="1"){R.dataset.ps="1";R.lang="ps";R.dir="rtl";}
    refreshAll();addEventListener("scroll",updateProgress,{passive:true});
    if(!window.__ccShellObserver){window.__ccShellObserver=1;var mo=new MutationObserver(function(records){
      for(var i=0;i<records.length;i++){var t=records[i].target;if(t.id==="site-header"||t.id==="site-footer"||t.closest&&t.closest("#site-header,#site-footer")){schedule();break;}}
    });mo.observe(document.body,{childList:true,subtree:true});}
    if(!window.__ccShellLocale){window.__ccShellLocale=1;new MutationObserver(function(){refreshLabels();}).observe(R,{attributes:true,attributeFilter:["lang","data-ps"]});}
    var select=q(".cc-language-home select");if(select)select.value=locale();
    var search=q("#srchBtn");if(search&&!window.__ccSearchShortcut){window.__ccSearchShortcut=1;document.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();search.click();}});}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();