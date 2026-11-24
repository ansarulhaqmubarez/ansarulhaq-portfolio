/* lab.js: CineCode Lab. Four creative tools that run only in the visitor's browser (nothing is uploaded):
   1) cinema colour grading, 2) poster studio, 3) search the real works by colour, 4) a personal learning path card.
   Real data only: works and courses come from window.SITE. */
(function () {
  "use strict";
  var S = window.SITE || {}, R = document.documentElement;
  var fa = function () { return R.lang === "fa"; };
  var tx = function (o) { return (o && (o[fa() ? "fa" : "en"] || o.fa || o.en)) || ""; };
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function btn(t, c, fn) { var b = el("button", c, t); b.type = "button"; if (fn) b.onclick = fn; return b; }
  function dl(canvas, name) { canvas.toBlob(function (b) { if (!b) return; var u = URL.createObjectURL(b), a = el("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); }, "image/png"); }
  function range(label, min, max, val, on) { var l = el("label"); l.appendChild(el("span", "", label)); var r = el("input"); r.type = "range"; r.min = min; r.max = max; r.value = val; r.setAttribute("aria-label", label); r.oninput = function () { on(+r.value); }; l.appendChild(r); return l; }
  var gal = function () { return (S.gallery || []).filter(function (g) { return g && /^[\w-]+$/.test(g.id || "") && !g.hidden; }); };
  var dlg;
  function zoom(id) { if (!dlg) { dlg = el("dialog", "lb-dlg"); dlg.setAttribute("aria-label", "Work"); document.body.appendChild(dlg); dlg.addEventListener("click", function () { dlg.close(); }); } dlg.textContent = ""; var im = el("img"); im.src = "assets/work/" + id + ".webp"; im.alt = ""; dlg.appendChild(im); var x = btn("×", "", function () { dlg.close(); }); x.setAttribute("aria-label", fa() ? "بستن" : "Close"); dlg.appendChild(x); if (dlg.showModal) dlg.showModal(); }
  function loadImg(src) { return new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = src; }); }

  /* ---------- 1. cinema grade ---------- */
  var clamp = function (x) { return x < 0 ? 0 : x > 255 ? 255 : x; };
  function con(v, k) { return (v - 128) * k + 128; }
  var LOOKS = {
    teal: { fa: "فیلمی سبز‌آبی و نارنجی", en: "Teal and orange", f: function (r, g, b) { var l = (.299 * r + .587 * g + .114 * b) / 255, s = (1 - l) * (1 - l), h = l * l; return [con(r - 22 * s + 36 * h, 1.12), con(g + 8 * s + 8 * h, 1.12), con(b + 36 * s - 32 * h, 1.12)]; } },
    noir: { fa: "سیاه و سفید نوآر", en: "Noir", f: function (r, g, b) { var l = .299 * r + .587 * g + .114 * b, v = con(l, 1.35); return [v, v, v]; } },
    vintage: { fa: "فیلم قدیمی", en: "Vintage film", f: function (r, g, b) { var l = .299 * r + .587 * g + .114 * b; r = l + (r - l) * .75; g = l + (g - l) * .75; b = l + (b - l) * .75; return [con(r, .9) + 22, con(g, .9) + 12, con(b, .9) - 6 + 8]; } },
    cyber: { fa: "سایبر نئونی", en: "Cyber neon", f: function (r, g, b) { var l = (.299 * r + .587 * g + .114 * b) / 255, s = 1 - l, l2 = l * l, m = (r + g + b) / 3; return [con(m + (r - m) * 1.35 + 40 * l2 - 10 * s, 1.1), con(m + (g - m) * 1.2 + 6 * s, 1.1), con(m + (b - m) * 1.5 + 50 * s, 1.1)]; } },
    gold: { fa: "طلایی گرم", en: "Warm gold", f: function (r, g, b) { return [con(r * 1.08 + 12, 1.08), con(g * 1.02 + 4, 1.08), con(b * .86, 1.08)]; } },
    bleach: { fa: "بلیچ‌بایپس", en: "Bleach bypass", f: function (r, g, b) { var l = .299 * r + .587 * g + .114 * b; return [con(l + (r - l) * .5, 1.25), con(l + (g - l) * .5, 1.25), con(l + (b - l) * .5, 1.25)]; } }
  };

  function cube(look, a) {
    var N = 17, L = ["TITLE \"CineCode " + look + "\"", "LUT_3D_SIZE " + N, "DOMAIN_MIN 0 0 0", "DOMAIN_MAX 1 1 1"], fn = LOOKS[look].f;
    for (var b = 0; b < N; b++) for (var g = 0; g < N; g++) for (var r = 0; r < N; r++) { var R0 = r / (N - 1) * 255, G0 = g / (N - 1) * 255, B0 = b / (N - 1) * 255, q = fn(R0, G0, B0); L.push([R0 + (q[0] - R0) * a, G0 + (q[1] - G0) * a, B0 + (q[2] - B0) * a].map(function (v) { return (clamp(v) / 255).toFixed(6); }).join(" ")); }
    save(L.join("\n") + "\n", "cinecode-" + look + ".cube", "text/plain");
  }
  function save(text, name, type) { var u = URL.createObjectURL(new Blob([text], { type: type + ";charset=utf-8" })), a = el("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); }
  function gradeTool(host) {
    var T = fa() ? { up: "یک عکس انتخاب کن", sm: "عکس نمونه از آثار من", amt: "شدت رنگ‌بندی", gr: "دانه‌های فیلم", vg: "تیرگی کناره‌ها", lb: "نوار سینمایی ۲٫۳۹:۱", cmp: "مقایسه قبل / بعد", dl: "دانلود تصویر", nt: "عکس فقط در مرورگر خودت پردازش می‌شود و جایی فرستاده نمی‌شود.", em: "یک عکس انتخاب کن یا نمونه را امتحان کن." } : { up: "Choose a photo", sm: "Use a sample from my works", amt: "Grade strength", gr: "Film grain", vg: "Vignette", lb: "2.39:1 letterbox", cmp: "Compare before / after", dl: "Download image", nt: "Your photo is processed only in your browser and is never uploaded.", em: "Choose a photo or try the sample." };
    var st = { look: "teal", amt: 80, gr: 15, vg: 35, lb: false, cmp: 50 }, orig = null, W = 0, H = 0, noise = null, pend = 0;
    var g = el("div", "lb-g"), cv = el("div", "lb-cv"), out = el("canvas"), bef = el("canvas", "b"), line = el("div"); cv.appendChild(out); cv.appendChild(bef); cv.appendChild(line);
    line.style.cssText = "position:absolute;top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 10px #000;pointer-events:none;display:none"; out.width = 800; out.height = 500; var ph = el("p", "lb-note", T.em); ph.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:20px;margin:0"; cv.appendChild(ph);
    var ctl = el("div", "lb-ctl"); var f = el("input"); f.type = "file"; f.accept = "image/*"; f.className = "lb-in"; f.setAttribute("aria-label", T.up);
    f.onchange = function () { if (f.files && f.files[0]) { var u = URL.createObjectURL(f.files[0]); loadImg(u).then(function (im) { setImg(im); URL.revokeObjectURL(u); }); } };
    ctl.appendChild(f); ctl.appendChild(btn(T.sm, "lb-bt", function () { var g2 = gal(); if (!g2.length) return; loadImg("assets/work/" + g2[Math.min(9, g2.length - 1)].id + ".webp").then(setImg); }));
    var lk = el("div", "lb-lk"); lk.setAttribute("role", "group"); Object.keys(LOOKS).forEach(function (k) { var b = btn(LOOKS[k][fa() ? "fa" : "en"], "", function () { st.look = k; mark(); sched(); }); b.dataset.k = k; lk.appendChild(b); }); ctl.appendChild(lk);
    function mark() { [].forEach.call(lk.children, function (b) { b.setAttribute("aria-pressed", b.dataset.k === st.look ? "true" : "false"); }); } mark();
    ctl.appendChild(range(T.amt, 0, 100, st.amt, function (v) { st.amt = v; sched(); })); ctl.appendChild(range(T.gr, 0, 100, st.gr, function (v) { st.gr = v; sched(); })); ctl.appendChild(range(T.vg, 0, 100, st.vg, function (v) { st.vg = v; sched(); }));
    var ck = el("label", "lb-ck"), c1 = el("input"); c1.type = "checkbox"; c1.onchange = function () { st.lb = c1.checked; sched(); }; ck.appendChild(c1); ck.appendChild(el("span", "", T.lb)); ctl.appendChild(ck);
    ctl.appendChild(range(T.cmp, 0, 100, st.cmp, function (v) { st.cmp = v; split(); }));
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { if (orig) dl(out, "cinecode-grade.png"); })); ctl.appendChild(btn(fa() ? "دانلود LUT (.cube) برای تدوین" : "Download LUT (.cube) for editing", "lb-bt", function () { cube(st.look, st.amt / 100); })); ctl.appendChild(el("p", "lb-note", fa() ? "فایل .cube در پریمیر، داوینچی ریزالو و افتر افکتس باز می‌شود. دانه و تیرگی کناره‌ها در LUT نیست." : "The .cube file opens in Premiere, DaVinci Resolve and After Effects. Grain and vignette are not part of the LUT.")); ctl.appendChild(el("p", "lb-note", T.nt));
    g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    function setImg(im) { var k = Math.min(1, 1280 / Math.max(im.width, im.height)); W = Math.round(im.width * k); H = Math.round(im.height * k); bef.width = out.width = W; bef.height = out.height = H; var c = bef.getContext("2d"); c.drawImage(im, 0, 0, W, H); orig = c.getImageData(0, 0, W, H); noise = new Int8Array(W * H); var s = 7; for (var i = 0; i < noise.length; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; noise[i] = (s >> 16) % 64 - 32; } ph.style.display = "none"; line.style.display = "block"; split(); sched(); }
    function split() { bef.style.clipPath = "inset(0 " + (100 - st.cmp) + "% 0 0)"; line.style.left = st.cmp + "%"; }
    function sched() { if (pend) return; pend = requestAnimationFrame(function () { pend = 0; paint(); }); }
    function paint() {
      if (!orig) return; var c = out.getContext("2d"), d = c.createImageData(W, H), o = orig.data, p = d.data, fn = LOOKS[st.look].f, a = st.amt / 100, gr = st.gr / 100 * 1.4, vg = st.vg / 100, cx = W / 2, cy = H / 2, md = cx * cx + cy * cy;
      for (var y = 0, i = 0, n = 0; y < H; y++) for (var x = 0; x < W; x++, i += 4, n++) {
        var r = o[i], g1 = o[i + 1], b = o[i + 2], q = fn(r, g1, b), nz = noise[n] * gr, dx = x - cx, dy = y - cy, v = 1 - vg * (dx * dx + dy * dy) / md * 1.1; if (v < 0) v = 0;
        p[i] = clamp((r + (q[0] - r) * a + nz) * v); p[i + 1] = clamp((g1 + (q[1] - g1) * a + nz) * v); p[i + 2] = clamp((b + (q[2] - b) * a + nz) * v); p[i + 3] = 255;
      }
      c.putImageData(d, 0, 0); if (st.lb) { var bh = (H - W / 2.39) / 2; if (bh > 0) { c.fillStyle = "#000"; c.fillRect(0, 0, W, bh); c.fillRect(0, H - bh, W, bh); } }
    }
  }

  /* ---------- 2. poster studio ---------- */
  function posterTool(host) {
    var T = fa() ? { ti: "عنوان", su: "زیرعنوان", ac: "رنگ اصلی", tp: "قالب", sz: "اندازه", br: "نشان سینه‌کد", dl: "دانلود پوستر", t1: "نئون", t2: "قطری", t3: "قاب ساده", dt: "جشنوارهٔ فیلم کابل", ds: "شب‌های سینما زیر ستاره‌ها", nt: "پوستر در مرورگر تو ساخته می‌شود؛ هیچ‌چیز آپلود نمی‌شود." } : { ti: "Title", su: "Subtitle", ac: "Accent colour", tp: "Template", sz: "Size", br: "CineCode mark", dl: "Download poster", t1: "Neon", t2: "Diagonal", t3: "Clean frame", dt: "Kabul Film Night", ds: "Cinema under the stars", nt: "The poster is made in your browser; nothing is uploaded." };
    var st = { ti: T.dt, su: T.ds, ac: "#39A9E8", tp: "neon", sz: "1080x1350", br: true }, logo = null; loadImg("assets/img/logo-mark-light.png").then(function (i) { logo = i; paint(); }, function () {});
    var g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl");
    function inp(label, key, area) { var l = el("label"); l.appendChild(el("span", "", label)); var i = area ? el("textarea") : el("input"); if (!area) i.type = "text"; i.maxLength = 90; i.value = st[key]; i.setAttribute("aria-label", label); if (area) i.rows = 2; i.oninput = function () { st[key] = i.value; paint(); }; l.appendChild(i); return l; }
    ctl.appendChild(inp(T.ti, "ti", true)); ctl.appendChild(inp(T.su, "su", false));
    var l1 = el("label"); l1.appendChild(el("span", "", T.ac)); var col = el("input"); col.type = "color"; col.value = st.ac; col.setAttribute("aria-label", T.ac); col.oninput = function () { st.ac = col.value; paint(); }; l1.appendChild(col); ctl.appendChild(l1);
    function sel(label, key, opts) { var l = el("label"); l.appendChild(el("span", "", label)); var s = el("select"); s.setAttribute("aria-label", label); opts.forEach(function (o) { var e = el("option", "", o[1]); e.value = o[0]; s.appendChild(e); }); s.value = st[key]; s.onchange = function () { st[key] = s.value; paint(); }; l.appendChild(s); return l; }
    ctl.appendChild(sel(T.tp, "tp", [["neon", T.t1], ["split", T.t2], ["frame", T.t3]])); ctl.appendChild(sel(T.sz, "sz", [["1080x1350", "1080×1350 (4:5)"], ["1080x1080", "1080×1080 (1:1)"], ["1080x1920", "1080×1920 (9:16)"]]));
    var ck = el("label", "lb-ck"), c1 = el("input"); c1.type = "checkbox"; c1.checked = true; c1.onchange = function () { st.br = c1.checked; paint(); }; ck.appendChild(c1); ck.appendChild(el("span", "", T.br)); ctl.appendChild(ck);
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { dl(c, "cinecode-poster.png"); })); ctl.appendChild(el("p", "lb-note", T.nt)); g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    function wrap(x, text, mw) { var w = text.split(/\s+/).filter(Boolean), L = [], cur = ""; w.forEach(function (t) { var tt = cur ? cur + " " + t : t; if (x.measureText(tt).width > mw && cur) { L.push(cur); cur = t; } else cur = tt; }); if (cur) L.push(cur); return L; }
    function hex(h, a) { var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }
    function paint() {
      var p = st.sz.split("x"), W = +p[0], H = +p[1]; c.width = W; c.height = H; var x = c.getContext("2d"), rtl = /[؀-ۿ]/.test(st.ti + st.su), ff = rtl ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"';
      x.direction = rtl ? "rtl" : "ltr"; x.textAlign = "center"; x.textBaseline = "alphabetic";
      if (st.tp === "neon") { var g1 = x.createLinearGradient(0, 0, W, H); g1.addColorStop(0, "#07172D"); g1.addColorStop(1, "#150f45"); x.fillStyle = g1; x.fillRect(0, 0, W, H); var rg = x.createRadialGradient(W * .75, H * .22, 0, W * .75, H * .22, W * .8); rg.addColorStop(0, hex(st.ac, .55)); rg.addColorStop(1, "rgba(8,13,32,0)"); x.fillStyle = rg; x.fillRect(0, 0, W, H); x.strokeStyle = hex(st.ac, .35); x.lineWidth = 2; var hz = H * .62; for (var i = 0; i < 14; i++) { var y = hz + Math.pow(i / 14, 2) * (H - hz); x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); } for (i = -10; i <= 10; i++) { x.beginPath(); x.moveTo(W / 2 + i * 40, hz); x.lineTo(W / 2 + i * 230, H); x.stroke(); } }
      else if (st.tp === "split") { x.fillStyle = "#07172d"; x.fillRect(0, 0, W, H); x.fillStyle = st.ac; x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, H * .38); x.lineTo(0, H * .62); x.closePath(); x.fill(); x.fillStyle = "rgba(255,255,255,.12)"; x.beginPath(); x.moveTo(0, H * .62); x.lineTo(W, H * .38); x.lineTo(W, H * .44); x.lineTo(0, H * .68); x.closePath(); x.fill(); }
      else { x.fillStyle = "#f4f9fe"; x.fillRect(0, 0, W, H); x.strokeStyle = st.ac; x.lineWidth = 14; x.strokeRect(54, 54, W - 108, H - 108); x.lineWidth = 3; x.strokeRect(84, 84, W - 168, H - 168); }
      var dark = st.tp !== "frame", ink = dark ? "#F4F7FB" : "#0A1D38", mw = W * .8, size = W * .12, L; x.font = "900 " + size + "px " + ff;
      for (var k = 0; k < 30; k++) { x.font = "900 " + size + "px " + ff; L = wrap(x, st.ti, mw); if (L.length <= 4 && L.every(function (s) { return x.measureText(s).width <= mw; })) break; size *= .92; }
      var lh = size * 1.18, y0 = st.tp === "split" ? H * .62 : H * .42 - (L.length - 1) * lh / 2; x.fillStyle = ink; x.shadowColor = dark ? hex(st.ac, .8) : "transparent"; x.shadowBlur = dark ? 30 : 0; L.forEach(function (s, i2) { x.fillText(s, W / 2, y0 + i2 * lh); }); x.shadowBlur = 0;
      var ssz = Math.max(28, size * .36); x.font = "500 " + ssz + "px " + ff; x.fillStyle = dark ? "#CBD7E6" : "#4a4d78"; wrap(x, st.su, mw).slice(0, 3).forEach(function (s, i3) { x.fillText(s, W / 2, y0 + (L.length - 1) * lh + ssz * 2.4 + i3 * ssz * 1.3); });
      x.fillStyle = st.ac; x.fillRect(W / 2 - 60, y0 + (L.length - 1) * lh + ssz * 1.1 - 6, 120, 6);
      if (st.br && logo) { var lw = W * .11; x.globalAlpha = dark ? 1 : .9; x.drawImage(logo, W / 2 - lw / 2, H - lw - 70, lw, lw * logo.height / logo.width); x.globalAlpha = 1; }
    }
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang"'), document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('500 40px "Farhang FA"', "ا")]).then(paint, paint); paint();
  }

  /* ---------- 3. search the works by colour ---------- */
  var FAM = [["red", "قرمز", "Red", "#E5484D"], ["orange", "نارنجی", "Orange", "#F5822A"], ["yellow", "زرد", "Yellow", "#F5C518"], ["green", "سبز", "Green", "#3DB36B"], ["teal", "فیروزه‌ای", "Teal", "#7CCBF3"], ["blue", "آبی", "Blue", "#3D7DF5"], ["purple", "بنفش", "Purple", "#39A9E8"], ["pink", "صورتی", "Pink", "#D8E1EA"], ["dark", "تیره", "Dark", "#1a1a2e"], ["light", "روشن", "Light", "#f1efe8"], ["gray", "خاکستری", "Gray", "#8a8a96"]];
  function family(h) { h = (h + 360) % 360; return h < 15 || h >= 345 ? "red" : h < 45 ? "orange" : h < 70 ? "yellow" : h < 160 ? "green" : h < 200 ? "teal" : h < 255 ? "blue" : h < 300 ? "purple" : "pink"; }
  function analyse(img) {
    var c = el("canvas"); c.width = c.height = 20; var x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0, 20, 20); var d = x.getImageData(0, 0, 20, 20).data, w = {}, sat = 0, L = 0, n = 400;
    for (var i = 0; i < d.length; i += 4) { var r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)), h = 0; L += l;
      if (mx !== mn) { var dd = mx - mn; h = mx === r ? ((g - b) / dd) % 6 : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; h *= 60; }
      if (s > .28 && l > .14 && l < .88) { var wt = s * (1 - Math.abs(2 * l - 1)); w[family(h)] = (w[family(h)] || 0) + wt; sat += wt; } }
    var best = "", bw = 0; for (var k in w) if (w[k] > bw) { bw = w[k]; best = k; } L /= n;
    if (best && sat / n > .1) return best; return L < .3 ? "dark" : L > .72 ? "light" : "gray";
  }
  function colorTool(host) {
    var T = fa() ? { an: "در حال تحلیل رنگ آثار…", all: "همه", nt: "رنگ غالب هر اثر در مرورگر تو محاسبه می‌شود. روی یک رنگ بزن تا آثار هم‌رنگ را ببینی.", ct: "اثر" } : { an: "Analysing the colours of my works…", all: "All", nt: "The dominant colour of each work is computed in your browser. Tap a colour to see matching works.", ct: "works" };
    var items = gal(), res = {}, cur = "all"; var pb = el("div", "lb-bar"), bar = el("i"); pb.appendChild(bar); var msg = el("p", "lb-note", T.an), sw = el("div", "lb-sw"), grid = el("div", "lb-gal"); host.appendChild(msg); host.appendChild(pb); host.appendChild(sw); host.appendChild(grid); host.appendChild(el("p", "lb-note", T.nt));
    var done = 0; Promise.all(items.map(function (g) { return loadImg("assets/work/" + g.id + "-t.webp").then(function (im) { res[g.id] = analyse(im); }, function () {}).then(function () { done++; bar.style.width = (done / items.length * 100) + "%"; }); })).then(function () { msg.remove(); pb.remove(); show(); });
    function show() {
      var cnt = {}; items.forEach(function (g) { var f = res[g.id]; if (f) cnt[f] = (cnt[f] || 0) + 1; }); sw.textContent = "";
      var ops = [["all", T.all, "linear-gradient(135deg,#39A9E8,#7CCBF3)", items.length]].concat(FAM.filter(function (f) { return cnt[f[0]]; }).map(function (f) { return [f[0], f[fa() ? 1 : 2], f[3], cnt[f[0]]]; }));
      ops.forEach(function (o) { var b = btn("", ""); var i = el("i"); i.style.background = o[2]; b.appendChild(i); b.appendChild(el("span", "", o[1] + " · " + o[3])); b.setAttribute("aria-pressed", o[0] === cur ? "true" : "false"); b.onclick = function () { cur = o[0]; show(); }; sw.appendChild(b); });
      grid.textContent = ""; items.filter(function (g) { return cur === "all" || res[g.id] === cur; }).forEach(function (g) { var b = btn("", ""); b.setAttribute("aria-label", T.ct); var im = el("img"); im.src = "assets/work/" + g.id + "-t.webp"; im.alt = ""; im.loading = "lazy"; b.appendChild(im); b.onclick = function () { zoom(g.id); }; grid.appendChild(b); });
    }
  }

  /* ---------- 4. personal learning path card ---------- */
  function pathTool(host) {
    var cs = (S.courses || []).filter(function (c) { return c && /^[\w-]+$/.test(c.id || ""); });
    var F = fa(); var Q = F ? [
      { q: "چه چیزی بیشتر تو را هیجان‌زده می‌کند؟", o: [["فیلم ساختن و تدوین", "film"], ["طراحی پوستر و برند", "design"], ["نوشتن کد و ساختن برنامه", "code"], ["هنوز نمی‌دانم", "none"]] },
      { q: "کدام سبک به تو نزدیک‌تر است؟", o: [["قصه و تصویر متحرک", "film"], ["رنگ و ترکیب‌بندی", "design"], ["منطق و حل مسئله", "code"]] },
      { q: "هفته‌ای چقدر وقت داری؟", o: [["حدود ۲ ساعت", 1], ["حدود ۵ ساعت", 2], ["۱۰ ساعت یا بیشتر", 3]] },
      { q: "هدفت چیست؟", o: [["سرگرمی و یادگیری", "hobby"], ["درس و دانشگاه", "study"], ["کار و درآمد", "work"]] }
    ] : [
      { q: "What excites you the most?", o: [["Making and editing films", "film"], ["Designing posters and brands", "design"], ["Writing code and building apps", "code"], ["I'm not sure yet", "none"]] },
      { q: "Which style is closer to you?", o: [["Story and moving image", "film"], ["Colour and composition", "design"], ["Logic and problem solving", "code"]] },
      { q: "How much time do you have each week?", o: [["About 2 hours", 1], ["About 5 hours", 2], ["10 hours or more", 3]] },
      { q: "What is your goal?", o: [["Fun and learning", "hobby"], ["School and university", "study"], ["Work and income", "work"]] }
    ];
    var map = { film: "k1", design: "k2", code: "k3" }, ans = [], step = 0, name = "";
    var box = el("div", "lb-q"); host.appendChild(box);
    function ask() {
      box.textContent = ""; if (step >= Q.length) return result();
      var h = el("h3", "", Q[step].q); h.setAttribute("tabindex", "-1"); box.appendChild(h); box.appendChild(el("p", "lb-note", (step + 1) + " / " + Q.length));
      Q[step].o.forEach(function (o) { box.appendChild(btn(o[0], "lb-op", function () { ans[step] = o[1]; step++; ask(); })); });
      if (step) box.appendChild(btn(F ? "قبلی" : "Back", "lb-bt", function () { step--; ask(); }));
    }
    function result() {
      var sc = {}; cs.forEach(function (c) { sc[c.id] = 0; }); if (map[ans[0]] && sc[map[ans[0]]] != null) sc[map[ans[0]]] += 3; if (map[ans[1]] && sc[map[ans[1]]] != null) sc[map[ans[1]]] += 1;
      var order = cs.slice().sort(function (a, b) { return sc[b.id] - sc[a.id]; }), p = order[0], s2 = order[1]; if (!p) { box.appendChild(el("p", "", F ? "هنوز دوره‌ای ثبت نشده است." : "No courses are listed yet.")); return; }
      var les = (p.lessons || []).length || 5, per = ans[2] || 1, weeks = Math.ceil(les / per);
      var steps = F ? ["حساب رایگان بساز", "«" + tx(p.title) + "» را شروع کن (" + les + " درس)", ans[3] === "work" ? "پروژهٔ پایانی را برای نمونه‌کارت بساز" : ans[3] === "study" ? "آزمون بده و یادداشت‌هایت را مرتب کن" : "آزمون بده و گواهی‌ات را بگیر"] : ["Create a free account", "Start “" + tx(p.title) + "” (" + les + " lessons)", ans[3] === "work" ? "Build the final project for your portfolio" : ans[3] === "study" ? "Take the exam and organise your notes" : "Take the exam and earn your certificate"];
      var meta = F ? les + " درس · حدود " + weeks + " هفته · رایگان" : les + " lessons · about " + weeks + " weeks · free";
      box.appendChild(el("h3", "", (F ? "مسیر پیشنهادی تو: " : "Your suggested path: ") + tx(p.title))); box.appendChild(el("p", "lb-note", meta + (s2 ? (F ? " · بعد از آن: " : " · next: ") + tx(s2.title) : "")));
      var nl = el("label"); nl.appendChild(el("span", "", F ? "نام تو روی کارت (اختیاری)" : "Your name on the card (optional)")); var ni = el("input"); ni.type = "text"; ni.maxLength = 40; ni.value = name; ni.className = "lb-in"; nl.appendChild(ni); box.appendChild(nl);
      var cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); cv.style.maxWidth = "420px"; box.appendChild(cv); var row = el("div", "lb-lk");
      var go = el("a", "lb-bt go", F ? "دیدن دوره" : "See the course"); go.href = "course.html#" + p.id; go.style.cssText = "display:inline-flex;align-items:center;text-decoration:none"; row.appendChild(go); row.appendChild(btn(F ? "دانلود کارت" : "Download card", "lb-bt", function () { dl(c, "cinecode-path.png"); })); row.appendChild(btn(F ? "از اول" : "Start over", "lb-bt", function () { step = 0; ans = []; ask(); })); box.appendChild(row);
      box.appendChild(el("p", "lb-note", F ? "توجه: دوره‌ها هنوز در حال آماده‌سازی‌اند و این پیشنهاد بر اساس فهرست برنامه‌ریزی‌شده است. زمان هفته‌ها تخمین است." : "Note: the courses are still being prepared and this suggestion follows the planned list. Weeks are an estimate."));
      function draw() {
        var W = 1080, H = 1350, x = c.getContext("2d"); c.width = W; c.height = H; var ff = F ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"'; x.direction = F ? "rtl" : "ltr"; x.textAlign = F ? "right" : "left"; var X = F ? W - 90 : 90;
        var g1 = x.createLinearGradient(0, 0, W, H); g1.addColorStop(0, "#07172D"); g1.addColorStop(1, "#133463"); x.fillStyle = g1; x.fillRect(0, 0, W, H); var rg = x.createRadialGradient(W * .8, H * .15, 0, W * .8, H * .15, W * .8); rg.addColorStop(0, "rgba(124,203,243,.45)"); rg.addColorStop(1, "rgba(8,13,32,0)"); x.fillStyle = rg; x.fillRect(0, 0, W, H);
        x.font = "500 34px " + ff; x.fillStyle = "#7CCBF3"; x.fillText(F ? "مسیر یادگیری من" : "MY LEARNING PATH", X, 130); if (ni.value.trim()) { x.font = "700 56px " + ff; x.fillStyle = "#CBD7E6"; x.fillText(ni.value.trim(), X, 215); }
        x.font = "900 110px " + ff; x.fillStyle = "#F4F7FB"; var words = tx(p.title).split(" "), L = [], cur = ""; words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (x.measureText(t).width > W - 180 && cur) { L.push(cur); cur = w; } else cur = t; }); L.push(cur); L.slice(0, 3).forEach(function (s, i) { x.fillText(s, X, 380 + i * 130); });
        x.font = "500 40px " + ff; x.fillStyle = "#7CCBF3"; x.fillText(meta, X, 380 + Math.min(L.length, 3) * 130 + 20);
        steps.forEach(function (s, i) { var y = 800 + i * 150; x.fillStyle = "rgba(255,255,255,.07)"; x.beginPath(); x.roundRect(70, y - 70, W - 140, 120, 28); x.fill(); x.fillStyle = "#39A9E8"; x.beginPath(); x.arc(F ? W - 140 : 140, y - 10, 34, 0, 7); x.fill(); x.fillStyle = "#fff"; x.font = "900 40px " + ff; x.textAlign = "center"; x.fillText(String(i + 1), F ? W - 140 : 140, y + 4); x.textAlign = F ? "right" : "left"; x.font = "700 38px " + ff; x.fillStyle = "#F4F7FB"; x.fillText(s, F ? W - 210 : 210, y + 2); });
        x.font = "500 32px " + ff; x.fillStyle = "#A9BAD0"; x.textAlign = "center"; x.fillText("CineCode Academy · Ansarulhaq Mubarez · Kabul", W / 2, H - 60);
      }
      ni.oninput = function () { name = ni.value; draw(); }; var paint = function () { try { draw(); } catch (e) {} }; if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).then(paint, paint); paint();
    }
    ask();
  }


  /* ---------- 5. reel maker: real works -> short video with synthesized music, recorded in the browser ---------- */
  function reelTool(host) {
    var F = fa(), T = F ? { pick: "تا ۸ اثر را به ترتیب انتخاب کن", mood: "حال‌وهوای موسیقی", m1: "آرام", m2: "حماسی", m3: "ضرباهنگ", tr: "انتقال", t1: "محو", t2: "لغزش", t3: "زوم", dur: "مدت هر نما (ثانیه)", ti: "عنوان ریل", play: "پخش", stop: "توقف", rec: "ساخت و دانلود ویدیو", nt: "ویدیو و موسیقی در مرورگر تو ساخته می‌شود و جایی فرستاده نمی‌شود. خروجی WebM است.", sel: "انتخاب‌شده", none: "دست‌کم یک اثر انتخاب کن.", unsup: "مرورگر شما ضبط ویدیو را پشتیبانی نمی‌کند، ولی پخش پیش‌نمایش کار می‌کند.", rd: "در حال ضبط…" } : { pick: "Pick up to 8 works in order", mood: "Music mood", m1: "Calm", m2: "Epic", m3: "Pulse", tr: "Transition", t1: "Fade", t2: "Slide", t3: "Zoom", dur: "Seconds per shot", ti: "Reel title", play: "Play", stop: "Stop", rec: "Render and download video", nt: "The video and music are made in your browser and never uploaded. Output is WebM.", sel: "selected", none: "Select at least one work.", unsup: "Your browser cannot record video, but preview still works.", rd: "Recording…" };
    var st = { ids: [], mood: "calm", tr: "fade", d: 3, ti: F ? "نمونه‌کارهای من" : "My Showreel" }, imgs = {}, logo = null, raf = 0, t0 = 0, playing = false, rec = null, ac = null, dest = null, nodes = [], sched = 0;
    loadImg("assets/img/logo-mark-light.png").then(function (i) { logo = i; }, function () {});
    var g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); c.width = 1280; c.height = 720; cv.appendChild(c); var x = c.getContext("2d"); var ctl = el("div", "lb-ctl");
    var msg = el("p", "lb-note", ""); msg.setAttribute("role", "status");
    ctl.appendChild(el("p", "lb-note", T.pick)); var pg = el("div", "lb-pk");
    var cnt = el("p", "lb-note", "0 / 8 " + T.sel);
    gal().forEach(function (it) { var b = btn("", ""), im = el("img"); im.src = "assets/work/" + it.id + "-t.webp"; im.alt = ""; im.loading = "lazy"; b.appendChild(im); b.setAttribute("aria-pressed", "false"); b.setAttribute("aria-label", it.id); b.onclick = function () { var k = st.ids.indexOf(it.id); if (k >= 0) st.ids.splice(k, 1); else if (st.ids.length < 8) st.ids.push(it.id); else return; b.setAttribute("aria-pressed", k >= 0 ? "false" : "true"); cnt.textContent = st.ids.length + " / 8 " + T.sel; stop(); draw(0); }; pg.appendChild(b); });
    ctl.appendChild(pg); ctl.appendChild(cnt);
    function sel(label, key, opts) { var l = el("label"); l.appendChild(el("span", "", label)); var s2 = el("select"); s2.setAttribute("aria-label", label); opts.forEach(function (o) { var e = el("option", "", o[1]); e.value = o[0]; s2.appendChild(e); }); s2.value = st[key]; s2.onchange = function () { st[key] = s2.value; }; l.appendChild(s2); return l; }
    ctl.appendChild(sel(T.mood, "mood", [["calm", T.m1], ["epic", T.m2], ["pulse", T.m3]])); ctl.appendChild(sel(T.tr, "tr", [["fade", T.t1], ["slide", T.t2], ["zoom", T.t3]]));
    ctl.appendChild(range(T.dur, 2, 5, st.d, function (v) { st.d = v; }));
    var tl = el("label"); tl.appendChild(el("span", "", T.ti)); var ti = el("input"); ti.type = "text"; ti.maxLength = 40; ti.value = st.ti; ti.className = "lb-in"; ti.oninput = function () { st.ti = ti.value; draw(0); }; tl.appendChild(ti); ctl.appendChild(tl);
    var row = el("div", "lb-lk"), pb = btn(T.play, "lb-bt", function () { playing ? stop() : start(false); }), rb = btn(T.rec, "lb-bt go", function () { start(true); }); row.appendChild(pb); row.appendChild(rb); ctl.appendChild(row); ctl.appendChild(msg); ctl.appendChild(el("p", "lb-note", T.nt));
    g.appendChild(cv); g.appendChild(ctl); host.appendChild(g); var END = 2.5;
    function total() { return st.ids.length * st.d + END; }
    function load(ids) { return Promise.all(ids.map(function (id) { return imgs[id] ? 1 : loadImg("assets/work/" + id + ".webp").then(function (i) { imgs[id] = i; }, function () {}); })); }
    function cover(im, sc, ox, a) { var W = 1280, H = 720, r = Math.max(W / im.width, H / im.height) * sc, w = im.width * r, h = im.height * r; x.globalAlpha = a; x.drawImage(im, (W - w) / 2 + ox, (H - h) / 2, w, h); x.globalAlpha = 1; }
    function draw(t) {
      var W = 1280, H = 720, n = st.ids.length, ff = F ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"'; x.fillStyle = "#051225"; x.fillRect(0, 0, W, H); x.direction = F ? "rtl" : "ltr"; x.textAlign = "center";
      if (!n) { x.fillStyle = "#CBD7E6"; x.font = "700 40px " + ff; x.fillText(T.none, W / 2, H / 2); return; }
      var body = n * st.d;
      if (t < body) { var i = Math.min(n - 1, Math.floor(t / st.d)), u = (t - i * st.d) / st.d, im = imgs[st.ids[i]], pv = i ? imgs[st.ids[i - 1]] : null, e = Math.min(1, (t - i * st.d) / .6), k = 1 + .12 * u;
        if (pv) cover(pv, 1.12, 0, 1);
        if (im) { if (!pv) cover(im, k, 0, 1); else if (st.tr === "fade") cover(im, k, 0, e); else if (st.tr === "slide") cover(im, k, (1 - e) * W * (F ? -1 : 1), 1); else { cover(im, k * (1.25 - .25 * e), 0, e); } }
        if (i === 0 && u < .8) { var al = Math.min(1, (.8 - u) * 3, u * 4); x.fillStyle = "rgba(5,7,26," + (.5 * al) + ")"; x.fillRect(0, 0, W, H); x.globalAlpha = al; x.fillStyle = "#fff"; x.font = "900 96px " + ff; x.shadowColor = "#000"; x.shadowBlur = 24; x.fillText(st.ti, W / 2, H / 2 + 30); x.shadowBlur = 0; x.globalAlpha = 1; }
      } else { var q = Math.min(1, (t - body) / .8); x.fillStyle = "#07172D"; x.fillRect(0, 0, W, H); var rg = x.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 600); rg.addColorStop(0, "rgba(128,92,255," + .5 * q + ")"); rg.addColorStop(1, "rgba(8,13,32,0)"); x.fillStyle = rg; x.fillRect(0, 0, W, H); x.globalAlpha = q; if (logo) x.drawImage(logo, W / 2 - 80, 170, 160, 160 * logo.height / logo.width); x.fillStyle = "#F4F7FB"; x.font = "900 70px " + ff; x.fillText("CineCode Academy", W / 2, 440); x.fillStyle = "#7CCBF3"; x.font = "500 38px " + ff; x.fillText(F ? "انصارالحق مبارز · کابل" : "Ansarulhaq Mubarez · Kabul", W / 2, 510); x.globalAlpha = 1; }
      x.fillStyle = "#000"; x.fillRect(0, 0, W, 36); x.fillRect(0, H - 36, W, 36);
    }
    /* music: simple synthesized chords + drums, scheduled ahead of the audio clock */
    var CH = { calm: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], epic: [[45, 52, 57], [41, 48, 53], [36, 43, 48], [43, 50, 55]], pulse: [[57, 60, 64], [55, 59, 62], [53, 57, 60], [55, 59, 62]] };
    function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function tone(t, f, d, type, vol, out) { var o = ac.createOscillator(), gn = ac.createGain(); o.type = type; o.frequency.value = f; gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(vol, t + Math.min(.4, d / 3)); gn.gain.linearRampToValueAtTime(0, t + d); o.connect(gn); gn.connect(out); o.start(t); o.stop(t + d + .05); nodes.push(o); }
    function drum(t, kind, out) { var o = ac.createOscillator(), gn = ac.createGain(); if (kind === "k") { o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + .15); gn.gain.setValueAtTime(.9, t); gn.gain.exponentialRampToValueAtTime(.001, t + .25); } else { o.type = "square"; o.frequency.value = 7000; gn.gain.setValueAtTime(.05, t); gn.gain.exponentialRampToValueAtTime(.001, t + .04); } o.connect(gn); gn.connect(out); o.start(t); o.stop(t + .3); nodes.push(o); }
    function music(dur) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ac = new AC(); dest = ac.createMediaStreamDestination(); var m = ac.createGain(); m.gain.value = .5; var lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = st.mood === "calm" ? 1400 : 2600; m.connect(lp); lp.connect(ac.destination); lp.connect(dest);
      var t0a = ac.currentTime + .1, bar = st.mood === "calm" ? 4 : 2, bpm = st.mood === "pulse" ? 120 : 90, beat = 60 / bpm, ch = CH[st.mood];
      for (var b = 0, T2 = 0; T2 < dur; b++, T2 += bar * (st.mood === "calm" ? 1 : 1)) {
        var cc = ch[b % 4], tt = t0a + T2, len = bar + .2;
        cc.forEach(function (n) { tone(tt, hz(n), len, st.mood === "epic" ? "sawtooth" : "triangle", st.mood === "epic" ? .07 : .12, m); });
        tone(tt, hz(cc[0] - 12), len, "sine", .25, m);
        if (st.mood !== "calm") for (var k = 0; k < bar / beat; k++) { drum(tt + k * beat, "k", m); if (st.mood === "pulse") { drum(tt + k * beat + beat / 2, "h", m); tone(tt + k * beat + beat / 2, hz(cc[k % 3] + 12), beat / 2, "square", .035, m); } }
      }
      var end = t0a + dur - 1.2, mg = m.gain; mg.setValueAtTime(.5, end); mg.linearRampToValueAtTime(0, t0a + dur); return dest;
    }
    function cleanup() { nodes.forEach(function (o) { try { o.stop(); } catch (e) {} }); nodes = []; if (ac) { try { ac.close(); } catch (e) {} ac = null; } }
    function stop() { playing = false; cancelAnimationFrame(raf); cleanup(); pb.textContent = T.play; if (rec && rec.state !== "inactive") { rec.__cancel = true; rec.stop(); } rec = null; rb.disabled = false; }
    function start(record) {
      if (!st.ids.length) { msg.textContent = T.none; return; } stop(); msg.textContent = ""; var dur = total();
      load(st.ids).then(function () {
        var dst = music(dur), chunks = []; if (record) { if (!c.captureStream || !window.MediaRecorder) { msg.textContent = T.unsup; record = false; } else { var vs = c.captureStream(30); if (dst) dst.stream.getAudioTracks().forEach(function (a) { vs.addTrack(a); }); var mt = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].filter(function (m) { return MediaRecorder.isTypeSupported(m); })[0]; try { rec = new MediaRecorder(vs, mt ? { mimeType: mt, videoBitsPerSecond: 5e6 } : {}); } catch (e) { rec = null; msg.textContent = T.unsup; } if (rec) { var me = rec; me.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); }; me.onstop = function () { if (me.__cancel || !chunks.length) return; var u = URL.createObjectURL(new Blob(chunks, { type: "video/webm" })), a = el("a"); a.href = u; a.download = "cinecode-reel.webm"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000); msg.textContent = ""; }; me.start(250); msg.textContent = T.rd; rb.disabled = true; } } }
        playing = true; pb.textContent = T.stop; var s0 = performance.now();
        (function tick() { if (!playing) return; var t = (performance.now() - s0) / 1000; if (t >= dur) { draw(dur - .01); var r2 = rec; playing = false; pb.textContent = T.play; cleanup(); if (r2 && r2.state !== "inactive") r2.stop(); rec = null; rb.disabled = false; return; } draw(t); raf = requestAnimationFrame(tick); })();
      });
    }
    draw(0); window.addEventListener("pagehide", stop);
  }


  /* ---------- 6. composition coach: rule-based photo analysis (no AI model, no upload) ---------- */
  function coachTool(host) {
    var F = fa(), T = F ? { up: "یک عکس انتخاب کن", sm: "نمونه از آثار من", g: "راهنماها", th: "قاعدهٔ یک‌سوم", gd: "نسبت طلایی", ce: "مرکز", di: "قطرها", pal: "پالت رنگ (برای کپی کلیک کن)", em: "یک عکس انتخاب کن یا نمونه را امتحان کن.", nt: "تحلیل با محاسبهٔ ساده روی پیکسل‌ها انجام می‌شود، نه هوش مصنوعی، و عکس جایی فرستاده نمی‌شود.", cp: "کپی شد" } : { up: "Choose a photo", sm: "Sample from my works", g: "Guides", th: "Rule of thirds", gd: "Golden ratio", ce: "Centre", di: "Diagonals", pal: "Palette (click to copy)", em: "Choose a photo or try the sample.", nt: "The analysis is simple pixel maths, not an AI model, and the photo is never uploaded.", cp: "Copied" };
    var G = { th: true, gd: false, ce: false, di: false }, im = null;
    var g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); c.width = 800; c.height = 500; cv.appendChild(c); var ph = el("p", "lb-note", T.em); ph.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;text-align:center;margin:0;padding:20px"; cv.appendChild(ph);
    var ctl = el("div", "lb-ctl"), f = el("input"); f.type = "file"; f.accept = "image/*"; f.className = "lb-in"; f.setAttribute("aria-label", T.up); f.onchange = function () { if (f.files && f.files[0]) { var u = URL.createObjectURL(f.files[0]); loadImg(u).then(function (i) { set(i); URL.revokeObjectURL(u); }); } };
    ctl.appendChild(f); ctl.appendChild(btn(T.sm, "lb-bt", function () { var a = gal(); if (a.length) loadImg("assets/work/" + a[Math.min(20, a.length - 1)].id + ".webp").then(set); }));
    var gb = el("div", "lb-lk"); gb.setAttribute("role", "group"); gb.setAttribute("aria-label", T.g); Object.keys(G).forEach(function (k) { var b = btn(T[k], "", function () { G[k] = !G[k]; b.setAttribute("aria-pressed", G[k]); draw(); }); b.setAttribute("aria-pressed", G[k]); gb.appendChild(b); }); ctl.appendChild(gb);
    var rep = el("div", "lb-rep"), hist = el("canvas"); hist.width = 256; hist.height = 70; hist.style.cssText = "width:100%;height:70px;border-radius:10px;background:#051225"; var pal = el("div", "lb-sw"); ctl.appendChild(hist); ctl.appendChild(rep); ctl.appendChild(el("p", "lb-note", T.pal)); ctl.appendChild(pal); ctl.appendChild(el("p", "lb-note", T.nt)); var live = el("p", "lb-note", ""); live.setAttribute("role", "status"); ctl.appendChild(live);
    g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    function set(i) { im = i; var k = Math.min(1, 1100 / Math.max(i.width, i.height)); c.width = Math.round(i.width * k); c.height = Math.round(i.height * k); ph.style.display = "none"; draw(); analyse2(); }
    function draw() {
      if (!im) return; var x = c.getContext("2d"), W = c.width, H = c.height; x.drawImage(im, 0, 0, W, H); x.lineWidth = Math.max(2, W / 400); x.strokeStyle = "rgba(255,255,255,.85)"; x.shadowColor = "rgba(0,0,0,.7)"; x.shadowBlur = 3;
      function ln(a, b, d, e) { x.beginPath(); x.moveTo(a, b); x.lineTo(d, e); x.stroke(); }
      if (G.th) { [1 / 3, 2 / 3].forEach(function (r) { ln(W * r, 0, W * r, H); ln(0, H * r, W, H * r); }); }
      if (G.gd) { x.strokeStyle = "rgba(245,197,24,.95)"; [.382, .618].forEach(function (r) { ln(W * r, 0, W * r, H); ln(0, H * r, W, H * r); }); }
      if (G.ce) { x.strokeStyle = "rgba(124,203,243,.95)"; ln(W / 2, 0, W / 2, H); ln(0, H / 2, W, H / 2); }
      if (G.di) { x.strokeStyle = "rgba(216,225,234,.95)"; ln(0, 0, W, H); ln(W, 0, 0, H); } x.shadowBlur = 0;
    }
    function analyse2() {
      var s = el("canvas"), w = 64, h = Math.max(8, Math.round(64 * im.height / im.width)); s.width = w; s.height = h; var x = s.getContext("2d", { willReadFrequently: true }); x.drawImage(im, 0, 0, w, h); var d = x.getImageData(0, 0, w, h).data, hs = new Array(64).fill(0), sum = 0, sq = 0, n = w * h, cx = 0, cy = 0, lw = 0, wr = 0, bl = 0, st = 0, bins = {};
      for (var i = 0, p = 0; i < d.length; i += 4, p++) { var r = d[i], gg = d[i + 1], b = d[i + 2], l = .299 * r + .587 * gg + .114 * b; hs[l >> 2]++; sum += l; sq += l * l; var px = p % w, py = (p / w) | 0, wt = l * l; cx += px * wt; cy += py * wt; lw += wt; wr += r; bl += b; st += Math.max(r, gg, b) - Math.min(r, gg, b); var key = (r >> 5) + "," + (gg >> 5) + "," + (b >> 5); var o = bins[key] || (bins[key] = [0, 0, 0, 0]); o[0]++; o[1] += r; o[2] += gg; o[3] += b; }
      var m = sum / n, sd = Math.sqrt(sq / n - m * m), cxn = cx / lw / w, cyn = cy / lw / h, sat = st / n, warm = (wr - bl) / n;
      var hx = hist.getContext("2d"), mx = Math.max.apply(null, hs); hx.clearRect(0, 0, 256, 70); hx.fillStyle = "#39A9E8"; hs.forEach(function (v, i2) { hx.fillRect(i2 * 4, 70 - v / mx * 66, 3, v / mx * 66); });
      var ex = m < 70 ? (F ? "تیره (کم‌نور)" : "Dark (underexposed)") : m > 185 ? (F ? "روشن (پرنور)" : "Bright (overexposed)") : (F ? "متعادل" : "Balanced"), co = sd < 40 ? (F ? "کم‌کنتراست" : "Low contrast") : sd > 75 ? (F ? "پرکنتراست" : "High contrast") : (F ? "کنتراست خوب" : "Good contrast"), tn = warm > 18 ? (F ? "گرم" : "Warm") : warm < -18 ? (F ? "سرد" : "Cool") : (F ? "خنثی" : "Neutral"), sa = sat < 40 ? (F ? "کم‌رنگ" : "Muted") : sat > 95 ? (F ? "پررنگ" : "Vivid") : (F ? "متوسط" : "Moderate");
      var side = cxn < .42 ? (F ? "چپ" : "left") : cxn > .58 ? (F ? "راست" : "right") : (F ? "مرکز" : "centre"), vert = cyn < .42 ? (F ? "بالا" : "top") : cyn > .58 ? (F ? "پایین" : "bottom") : (F ? "میانه" : "middle");
      var tip = side === "centre" && vert === (F ? "میانه" : "middle") ? (F ? "وزن تصویر وسط است؛ برای پویایی سوژه را روی یکی از خطوط یک‌سوم ببر." : "The visual weight sits in the middle; move the subject onto a thirds line for more energy.") : (F ? "وزن روشنایی به سمت " + side + "-" + vert + " است؛ فضای خالی طرف مقابل را باز بگذار تا تعادل بماند." : "The brightest weight leans " + side + "-" + vert + "; leave breathing room on the opposite side for balance.");
      rep.textContent = ""; [[F ? "نور" : "Exposure", ex + " · " + Math.round(m / 2.55) + "%"], [F ? "کنتراست" : "Contrast", co], [F ? "دمای رنگ" : "Tone", tn], [F ? "اشباع" : "Saturation", sa], [F ? "وزن بصری" : "Visual weight", side + " / " + vert]].forEach(function (r2) { var li = el("p", "lb-kv"); li.appendChild(el("b", "", r2[0] + ": ")); li.appendChild(document.createTextNode(r2[1])); rep.appendChild(li); }); rep.appendChild(el("p", "lb-note", (F ? "پیشنهاد: " : "Tip: ") + tip));
      pal.textContent = ""; Object.keys(bins).map(function (k) { return bins[k]; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 5).forEach(function (o) { var hx2 = "#" + [o[1], o[2], o[3]].map(function (v) { return ("0" + Math.round(v / o[0]).toString(16)).slice(-2); }).join(""); var b = btn("", ""); var i3 = el("i"); i3.style.background = hx2; b.appendChild(i3); b.appendChild(el("span", "", hx2.toUpperCase())); b.onclick = function () { if (navigator.clipboard) navigator.clipboard.writeText(hx2).then(function () { live.textContent = T.cp + " " + hx2; }, function () {}); }; pal.appendChild(b); });
    }
  }

  /* ---------- 7. kinetic type: a text animation recorded to a WebM clip ---------- */
  function typeTool(host) {
    var F = fa(), T = F ? { tx: "متن (هر کلمه یک ضربه)", sty: "سبک", s1: "جهش", s2: "لغزش", s3: "نئون", fm: "قالب", f1: "افقی ۱۶:۹", f2: "عمودی ۹:۱۶", pl: "پخش", rec: "ساخت و دانلود ویدیو", nt: "ویدیو در مرورگر تو ساخته می‌شود و جایی فرستاده نمی‌شود. خروجی WebM بدون صدا است.", un: "این مرورگر ضبط ویدیو را پشتیبانی نمی‌کند.", rd: "در حال ضبط…" } : { tx: "Text (one word per beat)", sty: "Style", s1: "Pop", s2: "Slide", s3: "Neon", fm: "Format", f1: "Landscape 16:9", f2: "Vertical 9:16", pl: "Play", rec: "Render and download video", nt: "The video is made in your browser and never uploaded. Output is silent WebM.", un: "This browser cannot record video.", rd: "Recording…" };
    var st = { tx: F ? "داستان بگو با تصویر و کد" : "Tell stories with image and code", sty: "pop", fm: "h" }, raf = 0, playing = false, rec = null;
    var g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl"), x = c.getContext("2d");
    var l = el("label"); l.appendChild(el("span", "", T.tx)); var ta = el("textarea"); ta.rows = 3; ta.maxLength = 120; ta.value = st.tx; ta.setAttribute("aria-label", T.tx); ta.oninput = function () { st.tx = ta.value; stop(); frame(.1); }; l.appendChild(ta); ctl.appendChild(l);
    function sel(label, key, opts, cb) { var l2 = el("label"); l2.appendChild(el("span", "", label)); var s2 = el("select"); s2.setAttribute("aria-label", label); opts.forEach(function (o) { var e = el("option", "", o[1]); e.value = o[0]; s2.appendChild(e); }); s2.value = st[key]; s2.onchange = function () { st[key] = s2.value; stop(); size(); frame(.1); }; l2.appendChild(s2); return l2; }
    ctl.appendChild(sel(T.sty, "sty", [["pop", T.s1], ["slide", T.s2], ["neon", T.s3]])); ctl.appendChild(sel(T.fm, "fm", [["h", T.f1], ["v", T.f2]]));
    var row = el("div", "lb-lk"), pb = btn(T.pl, "lb-bt", function () { start(false); }), rb = btn(T.rec, "lb-bt go", function () { start(true); }); row.appendChild(pb); row.appendChild(rb); ctl.appendChild(row); var msg = el("p", "lb-note", ""); msg.setAttribute("role", "status"); ctl.appendChild(msg); ctl.appendChild(el("p", "lb-note", T.nt)); g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    var BEAT = .55, HOLD = 1.2, COL = ["#39A9E8", "#7CCBF3", "#D8E1EA", "#F5C518", "#3D7DF5"];
    function size() { c.width = st.fm === "h" ? 1280 : 720; c.height = st.fm === "h" ? 720 : 1280; cv.style.maxWidth = st.fm === "h" ? "" : "340px"; }
    function words() { return st.tx.split(/\s+/).filter(Boolean); }
    function total() { return words().length * BEAT + HOLD; }
    function frame(t) {
      var W = c.width, H = c.height, w = words(), n = w.length, rtl = /[؀-ۿ]/.test(st.tx), ff = rtl ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"', i = Math.min(n - 1, Math.floor(t / BEAT)), u = Math.min(1, (t - i * BEAT) / .22), e = 1 - Math.pow(1 - u, 3), col = COL[i % COL.length];
      var g1 = x.createLinearGradient(0, 0, W, H); g1.addColorStop(0, "#07172D"); g1.addColorStop(1, "#133463"); x.fillStyle = g1; x.fillRect(0, 0, W, H); var rg = x.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .7); rg.addColorStop(0, col + "55"); rg.addColorStop(1, "rgba(8,13,32,0)"); x.fillStyle = rg; x.fillRect(0, 0, W, H);
      x.direction = rtl ? "rtl" : "ltr"; x.textAlign = "center"; x.textBaseline = "middle"; if (!n) return;
      var done = t >= n * BEAT, size2 = Math.min(W * .22, 220); x.font = "900 " + size2 + "px " + ff;
      if (done) { var lines = [], cur = ""; w.forEach(function (q) { var tt = cur ? cur + " " + q : q; if (x.measureText(tt).width > W * .85 && cur) { lines.push(cur); cur = q; } else cur = tt; }); lines.push(cur); var fs = Math.min(W * .1, 110); x.font = "900 " + fs + "px " + ff; x.fillStyle = "#F4F7FB"; lines.forEach(function (ln, k) { x.fillText(ln, W / 2, H / 2 + (k - (lines.length - 1) / 2) * fs * 1.3); }); return; }
      var word = w[i]; while (x.measureText(word).width > W * .88 && size2 > 30) { size2 -= 6; x.font = "900 " + size2 + "px " + ff; }
      x.save(); x.translate(W / 2, H / 2);
      if (st.sty === "pop") { var sc = .4 + .6 * e + .08 * Math.sin(u * Math.PI); x.scale(sc, sc); x.globalAlpha = Math.min(1, u * 3); }
      else if (st.sty === "slide") { x.translate((1 - e) * W * .35 * (rtl ? -1 : 1), 0); x.globalAlpha = Math.min(1, u * 2.5); }
      else { x.globalAlpha = Math.min(1, u * 3); x.shadowColor = col; x.shadowBlur = 40 + 30 * e; }
      x.fillStyle = st.sty === "neon" ? "#fff" : col; x.fillText(word, 0, 0); x.restore(); x.globalAlpha = 1; x.shadowBlur = 0;
      x.fillStyle = "rgba(255,255,255,.15)"; x.fillRect(W * .1, H - 60, W * .8, 6); x.fillStyle = col; x.fillRect(W * .1, H - 60, W * .8 * ((i + 1) / n), 6);
    }
    function stop() { playing = false; cancelAnimationFrame(raf); if (rec && rec.state !== "inactive") { rec.__c = true; rec.stop(); } rec = null; rb.disabled = false; }
    function start(record) {
      stop(); msg.textContent = ""; if (!words().length) return; var chunks = [], dur = total();
      function document2() { return document.fonts && document.fonts.load ? Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).catch(function () {}) : Promise.resolve(); }
      document2().then(function () {
        if (record) { if (!c.captureStream || !window.MediaRecorder) { msg.textContent = T.un; record = false; } else { var mt = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].filter(function (m) { return MediaRecorder.isTypeSupported(m); })[0]; try { var me = rec = new MediaRecorder(c.captureStream(30), mt ? { mimeType: mt, videoBitsPerSecond: 4e6 } : {}); me.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); }; me.onstop = function () { if (me.__c || !chunks.length) return; var u = URL.createObjectURL(new Blob(chunks, { type: "video/webm" })), a = el("a"); a.href = u; a.download = "cinecode-type.webm"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000); msg.textContent = ""; }; me.start(250); rb.disabled = true; msg.textContent = T.rd; } catch (e2) { rec = null; msg.textContent = T.un; } } }
        playing = true; var s0 = performance.now(); (function tick() { if (!playing) return; var t = (performance.now() - s0) / 1000; if (t >= dur) { frame(dur - .01); playing = false; var r2 = rec; rec = null; rb.disabled = false; if (r2 && r2.state !== "inactive") r2.stop(); return; } frame(t); raf = requestAnimationFrame(tick); })();
      });
    }
    size(); frame(.1); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).then(function () { if (!playing) frame(.1); }, function () {}); window.addEventListener("pagehide", stop);
  }


  /* ---------- 8. vision and contrast lab ---------- */
  var SIM = { prot: [[.152286, 1.052583, -.204868], [.114503, .786281, .099216], [-.003882, -.048116, 1.051998]], deut: [[.367322, .860646, -.227968], [.280085, .672501, .047413], [-.01182, .04294, .968881]], trit: [[1.255528, -.076749, -.178779], [-.078411, .930809, .147602], [.004733, .691367, .3039]] };
  function lin(v) { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }
  function unl(v) { v = v < 0 ? 0 : v > 1 ? 1 : v; return 255 * (v <= .0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - .055); }
  function lum(h) { var n = parseInt(h.slice(1), 16); return .2126 * lin(n >> 16) + .7152 * lin(n >> 8 & 255) + .0722 * lin(n & 255); }
  function visionTool(host) {
    var F = fa(), T = F ? { up: "یک عکس انتخاب کن", sm: "نمونه از آثار من", v0: "دید عادی", v1: "کوررنگی قرمز (پروتان)", v2: "کوررنگی سبز (دوتان)", v3: "کوررنگی آبی (تریتان)", v4: "بی‌رنگ (آکروماتوپسی)", nt: "شبیه‌سازی تقریبی است و برای بررسی طراحی کاربرد دارد، نه تشخیص پزشکی.", ct: "بررسی کنتراست متن (WCAG)", fg: "رنگ متن", bg: "رنگ پس‌زمینه", rt: "نسبت کنتراست", ok: "قبول", no: "رد", n: "متن معمولی", l: "متن درشت" } : { up: "Choose a photo", sm: "Sample from my works", v0: "Normal vision", v1: "Red-blind (protanopia)", v2: "Green-blind (deuteranopia)", v3: "Blue-blind (tritanopia)", v4: "No colour (achromatopsia)", nt: "The simulation is approximate and meant for design checks, not medical diagnosis.", ct: "Text contrast check (WCAG)", fg: "Text colour", bg: "Background colour", rt: "Contrast ratio", ok: "Pass", no: "Fail", n: "Normal text", l: "Large text" };
    var mode = "v0", src = null, g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); c.width = 800; c.height = 500; cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var f = el("input"); f.type = "file"; f.accept = "image/*"; f.className = "lb-in"; f.setAttribute("aria-label", T.up); f.onchange = function () { if (f.files && f.files[0]) { var u = URL.createObjectURL(f.files[0]); loadImg(u).then(function (i) { set(i); URL.revokeObjectURL(u); }); } };
    ctl.appendChild(f); ctl.appendChild(btn(T.sm, "lb-bt", function () { var a = gal(); if (a.length) loadImg("assets/work/" + a[Math.min(4, a.length - 1)].id + ".webp").then(set); }));
    var vb = el("div", "lb-lk"); vb.setAttribute("role", "group"); ["v0", "v1", "v2", "v3", "v4"].forEach(function (k) { var b = btn(T[k], "", function () { mode = k; mk(); paint(); }); b.dataset.k = k; vb.appendChild(b); }); ctl.appendChild(vb);
    function mk() { [].forEach.call(vb.children, function (b) { b.setAttribute("aria-pressed", b.dataset.k === mode ? "true" : "false"); }); } mk();
    ctl.appendChild(el("p", "lb-note", T.nt)); ctl.appendChild(el("h3", "", T.ct));
    function col(label, val, cb) { var l = el("label"); l.appendChild(el("span", "", label)); var i = el("input"); i.type = "color"; i.value = val; i.setAttribute("aria-label", label); i.oninput = function () { cb(i.value); upd(); }; l.appendChild(i); return l; }
    var fg = "#F4F7FB", bg = "#102b55"; ctl.appendChild(col(T.fg, fg, function (v) { fg = v; })); ctl.appendChild(col(T.bg, bg, function (v) { bg = v; }));
    var pv = el("div", "lb-pv"); pv.style.cssText = "padding:16px;border-radius:12px;font-weight:700;font-size:1.2rem;text-align:center"; pv.textContent = F ? "نمونهٔ متن Aa" : "Sample text Aa"; var res = el("p", "lb-kv"); res.setAttribute("role", "status"); ctl.appendChild(pv); ctl.appendChild(res);
    function upd() { var a = lum(fg), b = lum(bg), r = (Math.max(a, b) + .05) / (Math.min(a, b) + .05); pv.style.color = fg; pv.style.background = bg; var ok = function (t) { return r >= t ? T.ok : T.no; }; res.textContent = T.rt + ": " + r.toFixed(2) + ":1 · " + T.n + " AA: " + ok(4.5) + " / AAA: " + ok(7) + " · " + T.l + " AA: " + ok(3) + " / AAA: " + ok(4.5); } upd();
    g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    function set(i) { src = i; var k = Math.min(1, 900 / Math.max(i.width, i.height)); c.width = Math.round(i.width * k); c.height = Math.round(i.height * k); c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); base = c.getContext("2d").getImageData(0, 0, c.width, c.height); paint(); }
    var base = null;
    function paint() { if (!base) return; var d = c.getContext("2d").createImageData(base.width, base.height), o = base.data, p = d.data, M = mode === "v1" ? SIM.prot : mode === "v2" ? SIM.deut : mode === "v3" ? SIM.trit : null;
      for (var i = 0; i < o.length; i += 4) { var r = lin(o[i]), g1 = lin(o[i + 1]), b = lin(o[i + 2]); if (mode === "v0") { p[i] = o[i]; p[i + 1] = o[i + 1]; p[i + 2] = o[i + 2]; } else if (mode === "v4") { var y = unl(.2126 * r + .7152 * g1 + .0722 * b); p[i] = p[i + 1] = p[i + 2] = y; } else { p[i] = unl(M[0][0] * r + M[0][1] * g1 + M[0][2] * b); p[i + 1] = unl(M[1][0] * r + M[1][1] * g1 + M[1][2] * b); p[i + 2] = unl(M[2][0] * r + M[2][1] * g1 + M[2][2] * b); } p[i + 3] = 255; } c.getContext("2d").putImageData(d, 0, 0); }
  }

  /* ---------- 9. subtitle maker ---------- */
  function subTool(host) {
    var F = fa(), T = F ? { tx: "هر خط یک زیرنویس", sp: "سرعت خواندن (نویسه در ثانیه)", of: "شروع از ثانیه", gp: "فاصله بین خطوط (ثانیه)", srt: "دانلود SRT", vtt: "دانلود VTT", cp: "کپی SRT", nt: "این ابزار زمان‌بندی را از طول هر خط حساب می‌کند. بعد در تدوین‌گر می‌توانی دقیق‌تر کنی.", ex: "سلام و خوش آمدید\nاین زیرنویس در مرورگر ساخته شد\nبرای ویدیوهای تو آماده است", ok: "کپی شد" } : { tx: "One subtitle per line", sp: "Reading speed (characters per second)", of: "Start at (seconds)", gp: "Gap between lines (seconds)", srt: "Download SRT", vtt: "Download VTT", cp: "Copy SRT", nt: "Timing is estimated from the length of each line. Fine-tune it in your editor.", ex: "Hello and welcome\nThese subtitles were made in the browser\nReady for your videos", ok: "Copied" };
    var st = { tx: T.ex, sp: 15, of: 0, gp: .2 }, g = el("div", "lb-g"), ctl = el("div", "lb-ctl"), out = el("pre", "lb-pre"); out.style.cssText = "white-space:pre-wrap;direction:ltr;text-align:left;background:#051225;border-radius:14px;padding:14px;max-height:420px;overflow:auto;margin:0;font-size:.9rem";
    var l = el("label"); l.appendChild(el("span", "", T.tx)); var ta = el("textarea"); ta.rows = 7; ta.value = st.tx; ta.setAttribute("aria-label", T.tx); ta.oninput = function () { st.tx = ta.value; r(); }; l.appendChild(ta); ctl.appendChild(l);
    ctl.appendChild(range(T.sp, 8, 25, st.sp, function (v) { st.sp = v; r(); })); ctl.appendChild(range(T.of, 0, 60, 0, function (v) { st.of = v; r(); })); ctl.appendChild(range(T.gp, 0, 20, 2, function (v) { st.gp = v / 10; r(); }));
    var row = el("div", "lb-lk"), live = el("p", "lb-note", ""); live.setAttribute("role", "status"); row.appendChild(btn(T.srt, "lb-bt go", function () { save(gen("srt"), "subtitles.srt", "application/x-subrip"); })); row.appendChild(btn(T.vtt, "lb-bt", function () { save(gen("vtt"), "subtitles.vtt", "text/vtt"); })); row.appendChild(btn(T.cp, "lb-bt", function () { if (navigator.clipboard) navigator.clipboard.writeText(gen("srt")).then(function () { live.textContent = T.ok; }, function () {}); })); ctl.appendChild(row); ctl.appendChild(live); ctl.appendChild(el("p", "lb-note", T.nt));
    g.appendChild(ctl); g.appendChild(out); host.appendChild(g);
    function tm(t, v) { var ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s2 = Math.floor(ms / 1000) % 60, e = ms % 1000, z = function (n, w) { return ("000" + n).slice(-w); }; return z(h, 2) + ":" + z(m, 2) + ":" + z(s2, 2) + (v ? "." : ",") + z(e, 3); }
    function gen(kind) { var t = st.of, o = kind === "vtt" ? ["WEBVTT", ""] : []; st.tx.split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (ln, i) { var d = Math.max(1.5, ln.length / st.sp); o.push(String(i + 1)); o.push(tm(t, kind === "vtt") + " --> " + tm(t + d, kind === "vtt")); o.push(ln); o.push(""); t += d + st.gp; }); return o.join("\n"); }
    function r() { out.textContent = gen("srt"); } r();
  }

  /* ---------- 10. storyboard sheet ---------- */
  function boardTool(host) {
    var F = fa(), SH = F ? ["نمای باز", "نمای متوسط", "نمای نزدیک", "از روی شانه", "زاویهٔ پایین", "نمای هوایی"] : ["Wide", "Medium", "Close-up", "Over the shoulder", "Low angle", "Aerial"],
      T = F ? { ti: "عنوان استوری‌بورد", img: "تصویر (کلیک: اثر بعدی)", up: "عکس خودت", cap: "توضیح صحنه", dl: "دانلود برگهٔ استوری‌بورد", nt: "برگه در مرورگر ساخته می‌شود و جایی فرستاده نمی‌شود.", def: "فیلم کوتاه من" } : { ti: "Storyboard title", img: "Image (click: next work)", up: "Your photo", cap: "Scene note", dl: "Download storyboard sheet", nt: "The sheet is made in your browser and never uploaded.", def: "My short film" };
    var items = gal(), P = []; for (var i = 0; i < 6; i++) P.push({ im: null, id: i * 7 % Math.max(1, items.length), shot: i % 6, cap: "" });
    var st = { ti: T.def }, g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl"), pn = el("div", "lb-pn2"); pn.style.cssText = "display:grid;gap:10px;max-height:520px;overflow:auto";
    var tl = el("label"); tl.appendChild(el("span", "", T.ti)); var ti = el("input"); ti.type = "text"; ti.maxLength = 50; ti.value = st.ti; ti.className = "lb-in"; ti.oninput = function () { st.ti = ti.value; draw(); }; tl.appendChild(ti); ctl.appendChild(tl);
    P.forEach(function (p, k) { var row = el("div", "lb-lk"); row.style.cssText = "align-items:center;gap:8px;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px"; var b = btn("", "", function () { p.im = null; p.id = (p.id + 1) % Math.max(1, items.length); ld(p).then(draw); }); b.setAttribute("aria-label", T.img + " " + (k + 1)); b.style.cssText = "width:84px;height:56px;padding:0;border-radius:8px;overflow:hidden"; var im = el("img"); im.alt = ""; im.style.cssText = "width:100%;height:100%;object-fit:cover"; b.appendChild(im); p.th = im; row.appendChild(b);
      var u = el("input"); u.type = "file"; u.accept = "image/*"; u.setAttribute("aria-label", T.up + " " + (k + 1)); u.style.maxWidth = "110px"; u.onchange = function () { if (u.files && u.files[0]) { var uu = URL.createObjectURL(u.files[0]); loadImg(uu).then(function (i2) { p.im = i2; p.th.src = uu; draw(); }); } }; row.appendChild(u);
      var s2 = el("select"); s2.setAttribute("aria-label", "shot " + (k + 1)); SH.forEach(function (n, j) { var e = el("option", "", n); e.value = j; s2.appendChild(e); }); s2.value = p.shot; s2.onchange = function () { p.shot = +s2.value; draw(); }; row.appendChild(s2);
      var ci = el("input"); ci.type = "text"; ci.maxLength = 70; ci.placeholder = T.cap; ci.setAttribute("aria-label", T.cap + " " + (k + 1)); ci.style.flex = "1 1 140px"; ci.oninput = function () { p.cap = ci.value; draw(); }; row.appendChild(ci); pn.appendChild(row); });
    ctl.appendChild(pn); ctl.appendChild(btn(T.dl, "lb-bt go", function () { dl(c, "cinecode-storyboard.png"); })); ctl.appendChild(el("p", "lb-note", T.nt)); g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    function ld(p) { if (!items.length) return Promise.resolve(); return loadImg("assets/work/" + items[p.id].id + "-t.webp").then(function (i2) { p.im = i2; p.th.src = i2.src; }, function () {}); }
    function draw() {
      var W = 1800, H = 1200, x = c.getContext("2d"), rtl = /[؀-ۿ]/.test(st.ti + P.map(function (p) { return p.cap; }).join("")), ff = rtl ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"'; c.width = W; c.height = H; x.fillStyle = "#f4f9fe"; x.fillRect(0, 0, W, H); x.direction = rtl ? "rtl" : "ltr"; x.textAlign = rtl ? "right" : "left"; x.fillStyle = "#0A1D38"; x.font = "900 64px " + ff; x.fillText(st.ti, rtl ? W - 60 : 60, 90); x.fillStyle = "#39A9E8"; x.fillRect(60, 112, W - 120, 5);
      P.forEach(function (p, k) { var col = k % 3, row = Math.floor(k / 3), fw = 540, fh = 304, gx = (W - 120 - fw * 3) / 2, X = 60 + (rtl ? 2 - col : col) * (fw + gx), Y = 170 + row * 480; x.fillStyle = "#0A1D38"; x.fillRect(X, Y, fw, fh); if (p.im) { var r = Math.max(fw / p.im.width, fh / p.im.height), w2 = p.im.width * r, h2 = p.im.height * r; x.save(); x.beginPath(); x.rect(X, Y, fw, fh); x.clip(); x.drawImage(p.im, X + (fw - w2) / 2, Y + (fh - h2) / 2, w2, h2); x.restore(); } x.strokeStyle = "#0A1D38"; x.lineWidth = 4; x.strokeRect(X, Y, fw, fh);
        x.textAlign = rtl ? "right" : "left"; var tx0 = rtl ? X + fw : X; x.fillStyle = "#39A9E8"; x.font = "900 34px " + ff; x.fillText((k + 1) + " · " + SH[p.shot], tx0, Y + fh + 44); x.fillStyle = "#33365c"; x.font = "500 28px " + ff; var words = p.cap.split(/\s+/).filter(Boolean), line = "", yy = Y + fh + 86, n = 0; words.forEach(function (w3) { var t = line ? line + " " + w3 : w3; if (x.measureText(t).width > fw && line) { if (n < 2) x.fillText(line, tx0, yy); yy += 34; n++; line = w3; } else line = t; }); if (line && n < 2) x.fillText(line, tx0, yy); });
      x.textAlign = "center"; x.fillStyle = "#8fa3bf"; x.font = "500 26px " + ff; x.fillText("CineCode Academy · Ansarulhaq Mubarez", W / 2, H - 30);
    }
    Promise.all(P.map(ld)).then(draw); draw(); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).then(draw, function () {});
  }


  /* ---------- 11. lower thirds and motion bars (WebM, green-screen or dark background) ---------- */
  function barsTool(host) {
    var F = fa(), T = F ? { nm: "نام یا عنوان", sb: "زیرعنوان", st: "سبک", s1: "نوار لغزان", s2: "خط و متن", s3: "شیشه‌ای", s4: "نوار پیشرفت", bg: "پس‌زمینه", b1: "سبز (برای کروما کی)", b2: "تیره", b3: "تصویر اثر من", ac: "رنگ", pl: "پخش", rec: "ساخت و دانلود ویدیو", nt: "برای استفاده در تدوین: پس‌زمینهٔ سبز را با کروما کی حذف کن. ویدیو در مرورگر تو ساخته می‌شود و جایی فرستاده نمی‌شود. خروجی WebM است و پس‌زمینهٔ شفاف ندارد.", un: "این مرورگر ضبط ویدیو را پشتیبانی نمی‌کند.", rd: "در حال ضبط…" } : { nm: "Name or title", sb: "Subtitle", st: "Style", s1: "Sliding bar", s2: "Line and text", s3: "Glass", s4: "Progress bar", bg: "Background", b1: "Green (for chroma key)", b2: "Dark", b3: "Image from my works", ac: "Colour", pl: "Play", rec: "Render and download video", nt: "For editing: remove the green background with a chroma key. The video is made in your browser and never uploaded. Output is WebM without transparency.", un: "This browser cannot record video.", rd: "Recording…" };
    var st = { nm: F ? "انصارالحق مبارز" : "Ansarulhaq Mubarez", sb: F ? "تدوینگر و طراح · کابل" : "Editor and designer · Kabul", sty: "bar", bg: "green", ac: "#39A9E8" }, bgi = null, raf = 0, playing = false, rec = null;
    var g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); c.width = 1280; c.height = 720; cv.appendChild(c); var x = c.getContext("2d"), ctl = el("div", "lb-ctl");
    function inp(label, key) { var l = el("label"); l.appendChild(el("span", "", label)); var i = el("input"); i.type = "text"; i.maxLength = 48; i.value = st[key]; i.className = "lb-in"; i.setAttribute("aria-label", label); i.oninput = function () { st[key] = i.value; if (!playing) frame(3); }; l.appendChild(i); return l; }
    function sel(label, key, opts) { var l = el("label"); l.appendChild(el("span", "", label)); var s2 = el("select"); s2.setAttribute("aria-label", label); opts.forEach(function (o) { var e = el("option", "", o[1]); e.value = o[0]; s2.appendChild(e); }); s2.value = st[key]; s2.onchange = function () { st[key] = s2.value; if (key === "bg" && s2.value === "img" && !bgi) { var a = gal(); if (a.length) loadImg("assets/work/" + a[Math.min(6, a.length - 1)].id + ".webp").then(function (i) { bgi = i; frame(3); }); } if (!playing) frame(3); }; l.appendChild(s2); return l; }
    ctl.appendChild(inp(T.nm, "nm")); ctl.appendChild(inp(T.sb, "sb")); ctl.appendChild(sel(T.st, "sty", [["bar", T.s1], ["line", T.s2], ["glass", T.s3], ["prog", T.s4], ["news", F ? "نوار خبری" : "News bar"], ["bug", F ? "نشان گوشهٔ تصویر" : "Corner bug"], ["title", F ? "کارت عنوان مرکزی" : "Centre title card"]])); ctl.appendChild(sel(T.bg, "bg", [["green", T.b1], ["dark", T.b2], ["img", T.b3]]));
    var cl = el("label"); cl.appendChild(el("span", "", T.ac)); var ci = el("input"); ci.type = "color"; ci.value = st.ac; ci.setAttribute("aria-label", T.ac); ci.oninput = function () { st.ac = ci.value; if (!playing) frame(3); }; cl.appendChild(ci); ctl.appendChild(cl);
    var row = el("div", "lb-lk"), pb = btn(T.pl, "lb-bt", function () { start(false); }), rb = btn(T.rec, "lb-bt go", function () { start(true); }); row.appendChild(pb); row.appendChild(rb); ctl.appendChild(row); var msg = el("p", "lb-note", ""); msg.setAttribute("role", "status"); ctl.appendChild(msg); ctl.appendChild(el("p", "lb-note", T.nt)); g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    var DUR = 6; function ease(t) { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 3); }
    function frame(t) {
      var W = 1280, H = 720, rtl = /[؀-ۿ]/.test(st.nm + st.sb), ff = rtl ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"';
      if (st.bg === "green") { x.fillStyle = "#00B140"; x.fillRect(0, 0, W, H); } else if (st.bg === "dark") { var g1 = x.createLinearGradient(0, 0, W, H); g1.addColorStop(0, "#07172D"); g1.addColorStop(1, "#133463"); x.fillStyle = g1; x.fillRect(0, 0, W, H); } else if (bgi) { var r = Math.max(W / bgi.width, H / bgi.height); x.drawImage(bgi, (W - bgi.width * r) / 2, (H - bgi.height * r) / 2, bgi.width * r, bgi.height * r); x.fillStyle = "rgba(0,0,0,.25)"; x.fillRect(0, 0, W, H); } else { x.fillStyle = "#07172D"; x.fillRect(0, 0, W, H); }
      var inn = ease(t / 1), out = ease((t - (DUR - 1)) / 1), v = inn * (1 - out), BX = rtl ? W - 90 : 90, BY = H - 190, bw = 660;
      x.direction = rtl ? "rtl" : "ltr"; x.textAlign = rtl ? "right" : "left"; x.textBaseline = "alphabetic"; var tx0 = rtl ? W - 90 - 28 : 90 + 28;
      function dir(w) { return rtl ? W - 90 - w : 90; }
      if (st.sty === "bar") { var w1 = bw * ease(t / .6) * (1 - out); x.fillStyle = st.ac; x.fillRect(dir(w1), BY, w1, 70); x.fillStyle = "#0A1D38"; var w2 = bw * .86 * ease((t - .25) / .6) * (1 - out); x.fillRect(dir(w2), BY + 70, w2, 54); x.save(); x.beginPath(); x.rect(dir(w1), BY, w1, 70); x.clip(); x.fillStyle = "#fff"; x.font = "900 44px " + ff; x.fillText(st.nm, tx0, BY + 52); x.restore(); x.save(); x.beginPath(); x.rect(dir(w2), BY + 70, w2, 54); x.clip(); x.fillStyle = "#E6F1FB"; x.font = "500 28px " + ff; x.fillText(st.sb, tx0, BY + 108); x.restore(); }
      else if (st.sty === "line") { var lh = 130 * ease(t / .6) * (1 - out); x.fillStyle = st.ac; x.fillRect(rtl ? W - 90 - 8 : 90, BY - 6 + (130 - lh), 8, lh); x.globalAlpha = v; x.fillStyle = "#fff"; x.shadowColor = "rgba(0,0,0,.6)"; x.shadowBlur = 12; x.font = "900 54px " + ff; x.fillText(st.nm, rtl ? W - 90 - 28 : 90 + 28, BY + 50 + (1 - inn) * 20); x.font = "500 30px " + ff; x.fillStyle = "#E6F1FB"; x.fillText(st.sb, rtl ? W - 90 - 28 : 90 + 28, BY + 100 + (1 - inn) * 20); x.shadowBlur = 0; x.globalAlpha = 1; }
      else if (st.sty === "glass") { x.globalAlpha = v; x.fillStyle = "rgba(16,18,43,.72)"; x.beginPath(); x.roundRect(dir(bw), BY + (1 - inn) * 40, bw, 130, 22); x.fill(); x.strokeStyle = st.ac; x.lineWidth = 3; x.stroke(); x.fillStyle = "#fff"; x.font = "900 46px " + ff; x.fillText(st.nm, tx0 + (rtl ? -10 : 10), BY + 56 + (1 - inn) * 40); x.fillStyle = "#CBD7E6"; x.font = "500 28px " + ff; x.fillText(st.sb, tx0 + (rtl ? -10 : 10), BY + 100 + (1 - inn) * 40); x.globalAlpha = 1; }
      else if (st.sty === "news") { var nh = 96, ny = H - 150, nw = W * ease(t / .7) * (1 - out); x.fillStyle = "#0A1D38"; x.fillRect(rtl ? W - nw : 0, ny, nw, nh); var tg = Math.min(300, nw); x.fillStyle = st.ac; x.fillRect(rtl ? W - tg : 0, ny, tg, nh); x.save(); x.beginPath(); x.rect(rtl ? W - nw : 0, ny, nw, nh); x.clip(); x.fillStyle = "#fff"; x.font = "900 40px " + ff; x.textAlign = "center"; x.fillText(st.sb.slice(0, 14), rtl ? W - 150 : 150, ny + 62); x.textAlign = rtl ? "right" : "left"; x.globalAlpha = ease((t - .5) / .5) * (1 - out); x.font = "800 44px " + ff; x.fillText(st.nm, rtl ? W - 340 : 340, ny + 62); x.restore(); }
      else if (st.sty === "bug") { var bw2 = 440 * ease(t / .6) * (1 - out), bx = rtl ? 50 : W - 50 - bw2; x.fillStyle = "rgba(16,18,43,.85)"; x.beginPath(); x.roundRect(bx, 50, Math.max(0, bw2), 78, 39); x.fill(); x.save(); x.beginPath(); x.roundRect(bx, 50, Math.max(0, bw2), 78, 39); x.clip(); x.fillStyle = st.ac; x.beginPath(); x.arc(bx + 40, 89, 16, 0, 7); x.fill(); x.fillStyle = "#fff"; x.font = "800 34px " + ff; x.textAlign = "left"; x.direction = rtl ? "rtl" : "ltr"; x.fillText(st.nm.slice(0, 22), bx + 72, 102); x.restore(); }
      else if (st.sty === "title") { var th = 150 * ease(t / .7) * (1 - out); x.fillStyle = st.ac; x.fillRect(W / 2 - 360, H / 2 - th - 6, 720, 6); x.fillRect(W / 2 - 360, H / 2 + th + 0, 720, 6); x.fillStyle = "rgba(16,18,43,.7)"; x.fillRect(W / 2 - 360, H / 2 - th, 720, th * 2); x.save(); x.beginPath(); x.rect(W / 2 - 360, H / 2 - th, 720, th * 2); x.clip(); x.fillStyle = "#fff"; x.textAlign = "center"; x.direction = rtl ? "rtl" : "ltr"; x.font = "900 64px " + ff; x.globalAlpha = ease((t - .4) / .5) * (1 - out); x.fillText(st.nm, W / 2, H / 2 + 6); x.font = "600 32px " + ff; x.fillStyle = st.ac; x.fillText(st.sb, W / 2, H / 2 + 62); x.restore(); }
      else { var pw = (W - 180) * Math.min(1, t / (DUR - .5)); x.fillStyle = "rgba(255,255,255,.25)"; x.fillRect(90, H - 70, W - 180, 14); x.fillStyle = st.ac; x.fillRect(90, H - 70, pw, 14); x.globalAlpha = v; x.fillStyle = "#fff"; x.shadowColor = "rgba(0,0,0,.6)"; x.shadowBlur = 10; x.font = "900 46px " + ff; x.textAlign = "left"; x.direction = rtl ? "rtl" : "ltr"; x.fillText(st.nm, 90, H - 110); x.font = "500 26px " + ff; x.fillStyle = "#E6F1FB"; x.fillText(st.sb, 90 + 0, H - 80 - 28); x.shadowBlur = 0; x.globalAlpha = 1; }
    }
    function stop() { playing = false; cancelAnimationFrame(raf); if (rec && rec.state !== "inactive") { rec.__c = true; rec.stop(); } rec = null; rb.disabled = false; }
    function start(record) {
      stop(); msg.textContent = ""; var chunks = [];
      var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).catch(function () {}) : Promise.resolve();
      fonts.then(function () {
        if (record) { if (!c.captureStream || !window.MediaRecorder) { msg.textContent = T.un; record = false; } else { var mt = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].filter(function (m) { return MediaRecorder.isTypeSupported(m); })[0]; try { var me = rec = new MediaRecorder(c.captureStream(30), mt ? { mimeType: mt, videoBitsPerSecond: 5e6 } : {}); me.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); }; me.onstop = function () { if (me.__c || !chunks.length) return; var u = URL.createObjectURL(new Blob(chunks, { type: "video/webm" })), a = el("a"); a.href = u; a.download = "cinecode-lower-third.webm"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000); msg.textContent = ""; }; me.start(250); rb.disabled = true; msg.textContent = T.rd; } catch (e2) { rec = null; msg.textContent = T.un; } } }
        playing = true; var s0 = performance.now(); (function tick() { if (!playing) return; var t = (performance.now() - s0) / 1000; if (t >= DUR) { frame(DUR - .01); playing = false; var r2 = rec; rec = null; rb.disabled = false; if (r2 && r2.state !== "inactive") r2.stop(); return; } frame(t); raf = requestAnimationFrame(tick); })();
      });
    }
    frame(3); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).then(function () { if (!playing) frame(3); }, function () {}); window.addEventListener("pagehide", stop);
  }

  /* ---------- 12. case study builder (from the portfolio structure: goal, role, tools, process, challenge, result, reflection) ---------- */
  function caseTool(host) {
    var F = fa(), Q = F ? [["ti", "عنوان پروژه"], ["go", "هدف پروژه"], ["ro", "نقش من"], ["to", "ابزارها (با کاما جدا کن)"], ["pr", "روند کار"], ["ch", "چالش‌ها"], ["re", "نتیجه"], ["rf", "آنچه یاد گرفتم"]] : [["ti", "Project title"], ["go", "Goal"], ["ro", "My role"], ["to", "Tools (separate with commas)"], ["pr", "Process"], ["ch", "Challenges"], ["re", "Result"], ["rf", "What I learned"]],
      T = F ? { dl: "دانلود برگهٔ مطالعهٔ موردی", cp: "کپی متن", nt: "هر بخش را کوتاه بنویس. برگه در مرورگر ساخته می‌شود و جایی فرستاده نمی‌شود.", ok: "کپی شد" } : { dl: "Download case study sheet", cp: "Copy text", nt: "Keep each part short. The sheet is made in your browser and never uploaded.", ok: "Copied" };
    var st = {}; Q.forEach(function (q) { st[q[0]] = ""; });
    var g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl");
    Q.forEach(function (q) { var l = el("label"); l.appendChild(el("span", "", q[1])); var i = q[0] === "ti" || q[0] === "to" || q[0] === "ro" ? el("input") : el("textarea"); if (i.tagName === "INPUT") { i.type = "text"; i.className = "lb-in"; } else i.rows = 2; i.maxLength = 220; i.setAttribute("aria-label", q[1]); i.oninput = function () { st[q[0]] = i.value; draw(); }; l.appendChild(i); ctl.appendChild(l); });
    var live = el("p", "lb-note", ""); live.setAttribute("role", "status");
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { dl(c, "cinecode-case-study.png"); })); ctl.appendChild(btn(T.cp, "lb-bt", function () { var t = Q.map(function (q) { return q[1] + ": " + st[q[0]]; }).join("\n"); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { live.textContent = T.ok; }, function () {}); })); ctl.appendChild(live); ctl.appendChild(el("p", "lb-note", T.nt)); g.appendChild(cv); g.appendChild(ctl); host.appendChild(g);
    function draw() {
      var W = 1400, H = 1900, x = c.getContext("2d"), all = Q.map(function (q) { return st[q[0]]; }).join(" "), rtl = /[؀-ۿ]/.test(all), ff = rtl ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"'; c.width = W; c.height = H; x.fillStyle = "#f4f9fe"; x.fillRect(0, 0, W, H); x.fillStyle = "#102b55"; x.fillRect(0, 0, W, 260); x.direction = rtl ? "rtl" : "ltr"; x.textAlign = rtl ? "right" : "left"; var X0 = rtl ? W - 80 : 80;
      x.fillStyle = "#7CCBF3"; x.font = "700 30px " + ff; x.fillText(F ? "مطالعهٔ موردی پروژه" : "PROJECT CASE STUDY", X0, 90); x.fillStyle = "#fff"; x.font = "900 76px " + ff; var t = st.ti || (F ? "عنوان پروژه" : "Project title"); while (x.measureText(t).width > W - 160 && t.length > 4) t = t.slice(0, -2); x.fillText(t, X0, 190);
      var y = 330, cw = W - 160; Q.slice(1).forEach(function (q, i) {
        var v = st[q[0]] || (F ? "…" : "…"); x.fillStyle = "#39A9E8"; x.font = "900 34px " + ff; x.fillText(q[1].replace(/\s*[(（].*$/, ""), X0, y); x.fillStyle = "#0A1D38"; x.font = "500 32px " + ff; var words = v.split(/\s+/), line = "", yy = y + 48, n = 0;
        if (q[0] === "to") { var tools = v.split(/[,،]/).map(function (s) { return s.trim(); }).filter(Boolean), px = rtl ? W - 80 : 80; tools.slice(0, 8).forEach(function (tl) { var w = x.measureText(tl).width + 40; if (rtl) px -= w; x.fillStyle = "#e5defc"; x.beginPath(); x.roundRect(px, yy - 34, w, 52, 26); x.fill(); x.fillStyle = "#102b55"; x.textAlign = "center"; x.fillText(tl, px + w / 2, yy + 3); x.textAlign = rtl ? "right" : "left"; if (!rtl) px += w + 12; else px -= 12; }); y += 150; return; }
        words.forEach(function (w3) { var tt = line ? line + " " + w3 : w3; if (x.measureText(tt).width > cw && line) { if (n < 3) x.fillText(line, X0, yy); yy += 44; n++; line = w3; } else line = tt; }); if (line && n < 3) x.fillText(line, X0, yy); y += 60 + Math.min(n + 1, 3) * 44 + 50; });
      x.fillStyle = "#8fa3bf"; x.textAlign = "center"; x.font = "500 26px " + ff; x.fillText("CineCode · Ansarulhaq Mubarez", W / 2, H - 50);
    }
    draw(); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).then(draw, function () {});
  }

  /* ---------- 13. film calculators ---------- */
  function calcTool(host) {
    var F = fa(), g = el("div", "lb-g"), ctl = el("div", "lb-ctl"), out = el("div", "lb-cv");
    var T = F ? { fps: "نرخ فریم", fr: "تعداد فریم", tc: "تایم‌کد (ساعت:دقیقه:ثانیه:فریم)", sec: "مدت (ثانیه)", br: "بیت‌ریت (مگابیت بر ثانیه)", mn: "مدت فیلم (دقیقه)", w: "عرض (پیکسل)", ar: "نسبت تصویر", sh: "شاتر ۱۸۰ درجه", gb: "حجم تقریبی", h: "ارتفاع", nt: "محاسبه‌ها در مرورگر انجام می‌شود. حجم واقعی به کدک بستگی دارد.", sl: "سرعت شاتر", fm: "فریم‌ها", tcl: "تایم‌کد", cp: "کپی نتیجه", ok: "کپی شد" } : { fps: "Frame rate", fr: "Frames", tc: "Timecode (hh:mm:ss:ff)", sec: "Duration (seconds)", br: "Bitrate (Mbps)", mn: "Film length (minutes)", w: "Width (px)", ar: "Aspect ratio", sh: "180° shutter", gb: "Approx. size", h: "Height", nt: "All maths runs in your browser. Real size depends on the codec.", sl: "Shutter speed", fm: "Frames", tcl: "Timecode", cp: "Copy result", ok: "Copied" };
    function num(lbl, v, step) { var l = el("label"); l.appendChild(el("span", "", lbl)); var i = el("input", "lb-in"); i.type = "number"; i.value = v; i.step = step || 1; i.min = 0; i.setAttribute("inputmode", "decimal"); l.appendChild(i); ctl.appendChild(l); return i; }
    var fl = el("label"); fl.appendChild(el("span", "", T.fps)); var fs = el("select"); [24, 25, 30, 50, 60].forEach(function (n) { var o = el("option", "", n + " fps"); o.value = n; fs.appendChild(o); }); fl.appendChild(fs); ctl.appendChild(fl);
    var sec = num(T.sec, 12.5, 0.1), mn = num(T.mn, 5, 0.5), br = num(T.br, 50, 1), w = num(T.w, 1920, 10);
    var al = el("label"); al.appendChild(el("span", "", T.ar)); var as = el("select"); [["16:9", 16 / 9], ["9:16", 9 / 16], ["1:1", 1], ["4:5", 4 / 5], ["4:3", 4 / 3], ["2.39:1", 2.39]].forEach(function (a) { var o = el("option", "", a[0]); o.value = a[1]; as.appendChild(o); }); al.appendChild(as); ctl.appendChild(al);
    var tcl = el("label"); tcl.appendChild(el("span", "", T.tc)); var tci = el("input", "lb-in"); tci.type = "text"; tci.dir = "ltr"; tci.value = "00:00:12:12"; tcl.appendChild(tci); ctl.appendChild(tcl);
    var live = el("div", "lb-note", ""); live.setAttribute("role", "status"); live.style.whiteSpace = "pre-line"; live.dir = "ltr";
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    function upd() {
      var f = +fs.value, s = Math.max(0, +sec.value || 0), fr = Math.round(s * f), h = Math.floor(fr / (f * 3600)), m = Math.floor(fr / (f * 60)) % 60, ss = Math.floor(fr / f) % 60, ff = fr % f;
      var gb = ((+br.value || 0) * 1e6 * 60 * (+mn.value || 0)) / 8 / 1e9, ww = Math.max(2, Math.round(+w.value || 0)), hh = Math.round(ww / (+as.value)); if (hh % 2) hh++;
      var m2 = /^(\d+):(\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(tci.value.trim()), tf = m2 ? ((+m2[1] * 3600 + +m2[2] * 60 + +m2[3]) * f + +m2[4]) : null;
      live.textContent = T.fm + ": " + fr + "  =  " + p2(h) + ":" + p2(m) + ":" + p2(ss) + ":" + p2(ff) + "\n" + T.tcl + " → " + T.fm + ": " + (tf == null ? "—" : tf + "  (" + (tf / f).toFixed(2) + " s)") + "\n" + T.gb + ": " + gb.toFixed(2) + " GB\n" + ww + " × " + hh + " px\n" + T.sh + ": 1/" + Math.round(2 * f) + " s  (" + (1000 / (2 * f)).toFixed(1) + " ms)";
    }
    ctl.querySelectorAll("input,select").forEach(function (i) { i.addEventListener("input", upd); i.addEventListener("change", upd); });
    ctl.appendChild(btn(T.cp, "lb-bt", function () { if (navigator.clipboard) navigator.clipboard.writeText(live.textContent).then(function () { var o = live.textContent; live.textContent = T.ok; setTimeout(upd, 900); }, function () {}); }));
    out.appendChild(live); out.appendChild(el("p", "lb-note", T.nt)); g.appendChild(ctl); g.appendChild(out); host.appendChild(g); upd();
  }

  /* ---------- 14. motion easing designer ---------- */
  function easeTool(host) {
    var F = fa(), g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); c.width = 520; c.height = 520; c.style.maxWidth = "100%"; cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var T = F ? { x1: "نقطهٔ ۱ افقی", y1: "نقطهٔ ۱ عمودی", x2: "نقطهٔ ۲ افقی", y2: "نقطهٔ ۲ عمودی", pl: "پخش یک‌بارهٔ حرکت", cp: "کپی CSS", ok: "کپی شد", pr: "حالت‌های آماده", nt: "منحنی حرکت را بساز؛ همان مقدار را در CSS، Figma یا After Effects (Easy Ease) استفاده کن. حرکت فقط یک بار پخش می‌شود.", dur: "مدت (میلی‌ثانیه)" } : { x1: "Point 1 horizontal", y1: "Point 1 vertical", x2: "Point 2 horizontal", y2: "Point 2 vertical", pl: "Play once", cp: "Copy CSS", ok: "Copied", pr: "Presets", nt: "Shape the motion curve, then use the same values in CSS, Figma or After Effects (Easy Ease). The motion plays once only.", dur: "Duration (ms)" };
    var P = { "Ease": [.25, .1, .25, 1], "Ease-out": [0, 0, .2, 1], "Ease-in-out": [.65, 0, .35, 1], "Out-expo": [.16, 1, .3, 1], "In-expo": [.7, 0, .84, 0], "Back": [.34, 1.56, .64, 1], "Linear": [0, 0, 1, 1] };
    var v = [.65, 0, .35, 1], ins = [];
    [["x1", 0, 1], ["y1", -1, 2], ["x2", 0, 1], ["y2", -1, 2]].forEach(function (d, k) { var l = el("label"); l.appendChild(el("span", "", T[d[0]])); var i = el("input"); i.type = "range"; i.min = d[1]; i.max = d[2]; i.step = .01; i.value = v[k]; i.addEventListener("input", function () { v[k] = +i.value; draw(); }); ins.push(i); l.appendChild(i); ctl.appendChild(l); });
    var pl = el("label"); pl.appendChild(el("span", "", T.pr)); var ps = el("select"); Object.keys(P).forEach(function (n) { var o = el("option", "", n); o.value = n; ps.appendChild(o); }); ps.value = "Ease-in-out"; ps.addEventListener("change", function () { v = P[ps.value].slice(); ins.forEach(function (i, k) { i.value = v[k]; }); draw(); }); pl.appendChild(ps); ctl.appendChild(pl);
    var dl = el("label"); dl.appendChild(el("span", "", T.dur)); var di = el("input"); di.type = "range"; di.min = 200; di.max = 2000; di.step = 50; di.value = 800; dl.appendChild(di); ctl.appendChild(dl);
    var code = el("p", "lb-note", ""); code.dir = "ltr"; code.setAttribute("role", "status");
    var tr = el("div"); tr.style.cssText = "position:relative;height:36px;margin-top:14px;border-radius:18px;background:rgba(57,169,232,.18)"; var dot = el("i"); dot.style.cssText = "position:absolute;top:4px;left:4px;width:28px;height:28px;border-radius:50%;background:#7CCBF3"; tr.appendChild(dot); cv.appendChild(tr);
    function css() { return "cubic-bezier(" + v.map(function (n) { return +n.toFixed(2); }).join(", ") + ")"; }
    function draw() {
      var x = c.getContext("2d"), W = 520, S = 400, o = 60; x.clearRect(0, 0, W, W); x.fillStyle = "#07172D"; x.fillRect(0, 0, W, W);
      x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 1; x.strokeRect(o, o + 50, S, S - 100 + 0); x.beginPath(); x.moveTo(o, o + S - 50 + 0); x.lineTo(o + S, o + 50); x.stroke();
      var X = function (a) { return o + a * S; }, Y = function (b) { return o + S - 50 - b * (S - 100); };
      x.strokeStyle = "#39A9E8"; x.lineWidth = 2; x.beginPath(); x.moveTo(X(0), Y(0)); x.lineTo(X(v[0]), Y(v[1])); x.moveTo(X(1), Y(1)); x.lineTo(X(v[2]), Y(v[3])); x.stroke();
      x.strokeStyle = "#7CCBF3"; x.lineWidth = 5; x.beginPath(); x.moveTo(X(0), Y(0)); x.bezierCurveTo(X(v[0]), Y(v[1]), X(v[2]), Y(v[3]), X(1), Y(1)); x.stroke();
      x.fillStyle = "#F4F7FB"; [[v[0], v[1]], [v[2], v[3]]].forEach(function (p) { x.beginPath(); x.arc(X(p[0]), Y(p[1]), 9, 0, 7); x.fill(); });
      code.textContent = "transition-timing-function: " + css() + ";"; }
    ctl.appendChild(btn(T.pl, "lb-bt go", function () { var d = +di.value; dot.style.transition = "none"; dot.style.transform = "translateX(0)"; void dot.offsetWidth; dot.style.transition = "transform " + d + "ms " + css(); dot.style.transform = "translateX(" + Math.max(0, tr.clientWidth - 36) + "px)"; }));
    ctl.appendChild(btn(T.cp, "lb-bt", function () { if (navigator.clipboard) navigator.clipboard.writeText(css()).then(function () { code.textContent = T.ok; setTimeout(draw, 900); }, function () {}); }));
    ctl.appendChild(code); ctl.appendChild(el("p", "lb-note", T.nt)); g.appendChild(cv); g.appendChild(ctl); host.appendChild(g); draw();
  }

  /* ---------- 15. quote / invoice sheet ---------- */
  function quoteTool(host) {
    var F = fa(), g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var T = F ? { me: "نام تو یا شرکت", cl: "نام مشتری", ti: "عنوان پروژه", it: "خدمات (هر خط: شرح ; مبلغ)", cu: "واحد پول", dt: "یادداشت و شرایط پرداخت", dl: "دانلود برگه (PNG)", pr: "چاپ", nt: "همهٔ مبلغ‌ها را خودت وارد می‌کنی؛ چیزی ذخیره یا فرستاده نمی‌شود.", tot: "جمع", q: "پیش‌فاکتور", ex: "طراحی لوگو ; 5000\nمونتاژ ویدیو ۶۰ ثانیه ; 12000", dn: "۵۰٪ پیش‌پرداخت، باقی هنگام تحویل." } : { me: "Your name or studio", cl: "Client name", ti: "Project title", it: "Services (one per line: description ; amount)", cu: "Currency", dt: "Notes and payment terms", dl: "Download sheet (PNG)", pr: "Print", nt: "You type every amount yourself. Nothing is saved or sent.", tot: "Total", q: "QUOTE", ex: "Logo design ; 500\nVideo edit, 60 seconds ; 1200", dn: "50% upfront, balance on delivery." };
    var st = { me: "", cl: "", ti: "", it: T.ex, cu: F ? "AFN" : "USD", dt: T.dn };
    [["me", 1], ["cl", 1], ["ti", 1], ["it", 0], ["cu", 1], ["dt", 0]].forEach(function (q) { var l = el("label"); l.appendChild(el("span", "", T[q[0]])); var i = q[1] ? el("input") : el("textarea"); if (q[1]) { i.type = "text"; i.className = "lb-in"; } else i.rows = 4; i.value = st[q[0]]; i.addEventListener("input", function () { st[q[0]] = i.value; draw(); }); l.appendChild(i); ctl.appendChild(l); });
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { dl(c, "cinecode-quote.png"); })); ctl.appendChild(el("p", "lb-note", T.nt));
    function parse() { var tot = 0, rows = st.it.split(/\n/).map(function (l) { var p = l.split(/[;؛]/), d = (p[0] || "").trim(), a = parseFloat(String(p[1] || "").replace(/[٠-٩]/g, function (x) { return x.charCodeAt(0) - 1632; }).replace(/[,\s]/g, "")); if (!d) return null; if (isFinite(a)) tot += a; return [d, isFinite(a) ? a : null]; }).filter(Boolean).slice(0, 12); return { rows: rows, tot: tot }; }
    function draw() {
      var W = 1200, H = 1600, x = c.getContext("2d"), all = Object.keys(st).map(function (k) { return st[k]; }).join(" "), rtl = /[؀-ۿ]/.test(all), ff = rtl ? '"Farhang FA","Farhang"' : 'Inter,Arial,sans-serif', P = parse(), X0 = rtl ? W - 90 : 90, al = rtl ? "right" : "left"; c.width = W; c.height = H; c.style.maxWidth = "100%"; c.style.height = "auto";
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H); x.fillStyle = "#07172D"; x.fillRect(0, 0, W, 230); x.textAlign = al; x.fillStyle = "#7CCBF3"; x.font = "800 40px " + ff; x.fillText(T.q, X0, 100); x.fillStyle = "#fff"; x.font = "900 60px " + ff; x.fillText(st.ti || (F ? "عنوان پروژه" : "Project title"), X0, 175);
      x.fillStyle = "#0A1D38"; x.font = "700 34px " + ff; x.fillText((F ? "از: " : "From: ") + (st.me || "—"), X0, 300); x.fillText((F ? "برای: " : "For: ") + (st.cl || "—"), X0, 350); x.fillStyle = "#0B6DB8"; x.font = "600 28px " + ff; x.fillText(new Date().toISOString().slice(0, 10), X0, 400);
      var y = 470, XA = rtl ? 90 : W - 90; x.fillStyle = "#EAF3FB"; x.fillRect(80, y - 44, W - 160, 60);
      P.rows.forEach(function (r, i) { y += 78; x.fillStyle = "#0A1D38"; x.font = "500 32px " + ff; x.textAlign = al; x.fillText(r[0].slice(0, 46), X0, y); x.textAlign = rtl ? "left" : "right"; x.font = "800 32px " + ff; x.fillText(r[1] == null ? "—" : r[1].toLocaleString("en") + " " + st.cu, XA, y); x.fillStyle = "#E2EEF9"; x.fillRect(80, y + 24, W - 160, 2); });
      y = Math.max(y + 130, 1000); x.fillStyle = "#39A9E8"; x.fillRect(80, y - 56, W - 160, 96); x.fillStyle = "#fff"; x.textAlign = al; x.font = "800 38px " + ff; x.fillText(T.tot, X0, y + 8); x.textAlign = rtl ? "left" : "right"; x.fillText(P.tot.toLocaleString("en") + " " + st.cu, XA, y + 8);
      x.fillStyle = "#0A1D38"; x.textAlign = al; x.font = "500 30px " + ff; var words = st.dt.split(/\s+/), line = "", yy = y + 140, n = 0; words.forEach(function (w3) { var tt = line ? line + " " + w3 : w3; if (x.measureText(tt).width > W - 180 && line) { if (n < 8) x.fillText(line, X0, yy); yy += 44; n++; line = w3; } else line = tt; }); if (line && n < 8) x.fillText(line, X0, yy);
      x.fillStyle = "#8fa3bf"; x.textAlign = "center"; x.font = "500 24px " + ff; x.fillText("CineCode Lab", W / 2, H - 50);
    }
    g.appendChild(ctl); g.appendChild(cv); host.appendChild(g); draw(); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('800 40px "Farhang FA"', "ا"), document.fonts.load('800 40px "Farhang"')]).then(draw, function () {});
  }

  /* ---------- 16. brand starter kit ---------- */
  function hsl(h, s, l) { s /= 100; l /= 100; var a = s * Math.min(l, 1 - l), f = function (n) { var k = (n + h / 30) % 12, v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * v).toString(16).padStart(2, "0"); }; return "#" + f(0) + f(8) + f(4); }
  function brandTool(host) {
    var F = fa(), g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var T = F ? { nm: "نام برند", tg: "شعار کوتاه", hu: "رنگ اصلی (۰ تا ۳۶۰)", sc: "نوع هماهنگی", dl: "دانلود کارت برند (PNG)", cp: "کپی کدهای رنگ", ok: "کپی شد", nt: "یک نقطهٔ شروع برای برند. رنگ‌ها با ریاضی رنگ ساخته می‌شوند؛ مناسب بودن برای کارت نهایی با خودت است.", H: ["مکمل", "سه‌گانه", "هم‌جوار"], pr: "رنگ اصلی", ac: "رنگ تأکید", bg: "پس‌زمینه", tx: "متن" } : { nm: "Brand name", tg: "Short tagline", hu: "Main colour (0 to 360)", sc: "Harmony", dl: "Download brand card (PNG)", cp: "Copy colour codes", ok: "Copied", nt: "A starting point for a brand. Colours come from colour maths; judging the final fit is up to you.", H: ["Complementary", "Triadic", "Analogous"], pr: "Primary", ac: "Accent", bg: "Background", tx: "Text" };
    var st = { nm: "", tg: "", hu: 256, sc: 0 };
    [["nm", 1], ["tg", 1]].forEach(function (q) { var l = el("label"); l.appendChild(el("span", "", T[q[0]])); var i = el("input", "lb-in"); i.type = "text"; i.addEventListener("input", function () { st[q[0]] = i.value; draw(); }); l.appendChild(i); ctl.appendChild(l); });
    var hl = el("label"); hl.appendChild(el("span", "", T.hu)); var hi = el("input"); hi.type = "range"; hi.min = 0; hi.max = 360; hi.value = 256; hi.addEventListener("input", function () { st.hu = +hi.value; draw(); }); hl.appendChild(hi); ctl.appendChild(hl);
    var sl = el("label"); sl.appendChild(el("span", "", T.sc)); var ss = el("select"); T.H.forEach(function (n, i) { var o = el("option", "", n); o.value = i; ss.appendChild(o); }); ss.addEventListener("change", function () { st.sc = +ss.value; draw(); }); sl.appendChild(ss); ctl.appendChild(sl);
    var cols; function pal() { var h = st.hu, off = [180, 120, 30][st.sc]; cols = [[T.pr, hsl(h, 75, 55)], [T.ac, hsl((h + off) % 360, 80, 55)], [T.bg, hsl(h, 35, 8)], [T.tx, hsl(h, 20, 96)]]; }
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { dl(c, "brand-card.png"); }));
    var note = el("p", "lb-note", ""); note.setAttribute("role", "status");
    ctl.appendChild(btn(T.cp, "lb-bt", function () { if (navigator.clipboard) navigator.clipboard.writeText(cols.map(function (k) { return k[0] + ": " + k[1]; }).join("\n")).then(function () { note.textContent = T.ok; setTimeout(function () { note.textContent = T.nt; }, 900); }, function () {}); }));
    note.textContent = T.nt; ctl.appendChild(note);
    function draw() {
      pal(); var W = 1200, H = 800, x = c.getContext("2d"), rtl = /[؀-ۿ]/.test(st.nm + st.tg), ff = rtl ? '"Farhang FA","Farhang"' : '"Farhang","Farhang FA"'; c.width = W; c.height = H; c.style.maxWidth = "100%"; c.style.height = "auto";
      x.fillStyle = cols[2][1]; x.fillRect(0, 0, W, H); var gr = x.createLinearGradient(0, 0, W, H); gr.addColorStop(0, cols[0][1]); gr.addColorStop(1, cols[1][1]); x.fillStyle = gr; x.globalAlpha = .22; x.fillRect(0, 0, W, H); x.globalAlpha = 1;
      x.textAlign = rtl ? "right" : "left"; var X0 = rtl ? W - 80 : 80; x.fillStyle = cols[3][1]; x.font = "900 110px " + ff; x.fillText(st.nm || (F ? "نام برند" : "Brand name"), X0, 220); x.fillStyle = cols[1][1]; x.font = "600 40px " + ff; x.fillText(st.tg || (F ? "شعار کوتاه شما" : "Your short tagline"), X0, 290);
      cols.forEach(function (k, i) { var bx = 80 + i * 268; x.fillStyle = k[1]; x.beginPath(); x.roundRect ? x.roundRect(bx, 440, 240, 200, 22) : x.rect(bx, 440, 240, 200); x.fill(); x.strokeStyle = "rgba(255,255,255,.25)"; x.lineWidth = 2; x.stroke(); x.textAlign = "left"; x.fillStyle = cols[3][1]; x.font = "700 26px " + ff; x.fillText(k[0], bx, 690); x.font = "600 26px monospace"; x.fillText(k[1].toUpperCase(), bx, 730); });
    }
    g.appendChild(ctl); g.appendChild(cv); host.appendChild(g); draw(); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 60px "Farhang FA"', "ا"), document.fonts.load('900 60px "Farhang"')]).then(draw, function () {});
  }

  /* ---------- 17. platform safe zones ---------- */
  function zoneTool(host) {
    var F = fa(), g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var T = F ? { pl: "قالب", dl: "دانلود قالب (PNG شفاف)", nt: "خطوط راهنما تقریبی‌اند و پلتفرم‌ها گاهی عوض‌شان می‌کنند. متن و لوگوی مهم را داخل ناحیهٔ خط‌چین فیروزه‌ای بگذار. فایل را روی ویدیو بگذار و پیش از خروجی بردار.", safe: "ناحیهٔ امن", ui: "زیر دکمه‌ها و متن پلتفرم" } : { pl: "Template", dl: "Download template (transparent PNG)", nt: "Guides are approximate and platforms change them. Keep key text and logos inside the dashed teal area. Lay the file over your video and remove it before export.", safe: "Safe area", ui: "Under platform buttons and text" };
    var Z = { "Reels / Shorts / TikTok 9:16": [1080, 1920, 120, 120, 250, 480], "Instagram post 4:5": [1080, 1350, 60, 60, 60, 60], "Square 1:1": [1080, 1080, 60, 60, 60, 60], "YouTube 16:9": [1920, 1080, 96, 96, 96, 96], "Cinema 2.39:1": [1920, 804, 96, 96, 60, 60] };
    var key = Object.keys(Z)[0]; var l = el("label"); l.appendChild(el("span", "", T.pl)); var sl = el("select"); Object.keys(Z).forEach(function (k) { var o = el("option", "", k); o.value = k; sl.appendChild(o); }); sl.addEventListener("change", function () { key = sl.value; draw(); }); l.appendChild(sl); ctl.appendChild(l);
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { draw(true); dl(c, "safe-zone.png"); draw(); })); ctl.appendChild(el("p", "lb-note", T.nt));
    function draw(clear) {
      var z = Z[key], W = z[0], H = z[1], x = c.getContext("2d"); c.width = W; c.height = H; c.style.maxWidth = "100%"; c.style.height = "auto"; c.style.maxHeight = "70vh";
      if (!clear) { x.fillStyle = "#07172D"; x.fillRect(0, 0, W, H); }
      var L = z[2], R2 = z[3], Tp = z[4], B = z[5]; x.fillStyle = "rgba(255,80,80,.28)"; x.fillRect(0, 0, W, Tp); x.fillRect(0, H - B, W, B); x.fillRect(0, Tp, L, H - Tp - B); x.fillRect(W - R2, Tp, R2, H - Tp - B);
      x.strokeStyle = "#7CCBF3"; x.lineWidth = Math.max(4, W / 270); x.setLineDash([W / 40, W / 60]); x.strokeRect(L, Tp, W - L - R2, H - Tp - B); x.setLineDash([]); x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.moveTo(0, H / 2); x.lineTo(W, H / 2); x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 2; x.stroke();
      x.fillStyle = "#7CCBF3"; x.font = "700 " + Math.round(W / 28) + "px Inter,Arial,sans-serif"; x.textAlign = "center"; x.fillText(W + "×" + H, W / 2, H / 2 - W / 30);
    }
    g.appendChild(ctl); g.appendChild(cv); host.appendChild(g); draw();
  }

  /* ---------- 18. shot list ---------- */
  function shotTool(host) {
    var F = fa(), g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var T = F ? { ti: "عنوان پروژه", ls: "شات‌ها (هر خط: شرح ; نوع کادر ; لنز/حرکت)", dl: "دانلود برگه (PNG)", cs: "دانلود CSV", nt: "برگهٔ شات‌لیست برای روز فیلم‌برداری. چیزی ذخیره یا فرستاده نمی‌شود.", ex: "ورود به دفتر ; واید ; ۳۵mm، ثابت\nچهرهٔ مدیر ; کلوزآپ ; ۸۵mm\nجزئیات دست‌ها ; اینسرت ; ماکرو", H: ["#", "شرح", "کادر", "لنز / حرکت", "✓"] } : { ti: "Project title", ls: "Shots (one per line: description ; framing ; lens/move)", dl: "Download sheet (PNG)", cs: "Download CSV", nt: "A shot list for shoot day. Nothing is saved or sent.", ex: "Enter the office ; Wide ; 35mm, static\nManager's face ; Close-up ; 85mm\nHands detail ; Insert ; Macro", H: ["#", "Description", "Framing", "Lens / move", "✓"] };
    var st = { ti: "", ls: T.ex };
    var l1 = el("label"); l1.appendChild(el("span", "", T.ti)); var i1 = el("input", "lb-in"); i1.type = "text"; i1.addEventListener("input", function () { st.ti = i1.value; draw(); }); l1.appendChild(i1); ctl.appendChild(l1);
    var l2 = el("label"); l2.appendChild(el("span", "", T.ls)); var i2 = el("textarea"); i2.rows = 7; i2.value = st.ls; i2.addEventListener("input", function () { st.ls = i2.value; draw(); }); l2.appendChild(i2); ctl.appendChild(l2);
    function rows() { return st.ls.split(/\n/).map(function (l) { var p = l.split(/[;؛]/).map(function (s) { return s.trim(); }); return p[0] ? [p[0], p[1] || "", p[2] || ""] : null; }).filter(Boolean).slice(0, 18); }
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { dl(c, "shot-list.png"); }));
    ctl.appendChild(btn(T.cs, "lb-bt", function () { var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; }; save("﻿" + T.H.slice(0, 4).map(q).join(",") + "\n" + rows().map(function (r, i) { return [i + 1].concat(r).map(q).join(","); }).join("\n"), "shot-list.csv", "text/csv"); }));
    ctl.appendChild(el("p", "lb-note", T.nt));
    function draw() {
      var R = rows(), W = 1400, H = 330 + Math.max(R.length, 3) * 84 + 80, x = c.getContext("2d"), rtl = /[؀-ۿ]/.test(st.ls + st.ti), ff = rtl ? '"Farhang FA","Farhang"' : 'Inter,Arial,sans-serif'; c.width = W; c.height = H; c.style.maxWidth = "100%"; c.style.height = "auto";
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H); x.fillStyle = "#07172D"; x.fillRect(0, 0, W, 200); x.textAlign = rtl ? "right" : "left"; var X0 = rtl ? W - 70 : 70; x.fillStyle = "#7CCBF3"; x.font = "800 32px " + ff; x.fillText("SHOT LIST", X0, 80); x.fillStyle = "#fff"; x.font = "900 56px " + ff; x.fillText(st.ti || (F ? "عنوان پروژه" : "Project title"), X0, 150);
      var cx = rtl ? [W - 70, W - 150, W - 780, W - 1050, 100] : [70, 150, 780, 1050, 1290], y = 270; x.fillStyle = "#EAF3FB"; x.fillRect(50, y - 48, W - 100, 64); x.fillStyle = "#0B6DB8"; x.font = "800 28px " + ff; T.H.forEach(function (h, i) { x.textAlign = i === 4 ? "center" : (rtl ? "right" : "left"); x.fillText(h, i === 4 ? (rtl ? 100 : 1300) : cx[i], y); });
      R.forEach(function (r, i) { y += 84; x.fillStyle = "#0A1D38"; x.font = "800 30px " + ff; x.textAlign = rtl ? "right" : "left"; x.fillText(String(i + 1), cx[0], y); x.font = "500 30px " + ff; x.fillText(r[0].slice(0, 34), cx[1], y); x.fillText(r[1].slice(0, 16), cx[2], y); x.fillText(r[2].slice(0, 22), cx[3], y); x.strokeStyle = "#39A9E8"; x.lineWidth = 3; x.strokeRect(rtl ? 80 : 1280, y - 30, 40, 40); x.fillStyle = "#E2EEF9"; x.fillRect(50, y + 24, W - 100, 2); });
    }
    g.appendChild(ctl); g.appendChild(cv); host.appendChild(g); draw(); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('800 30px "Farhang FA"', "ا")]).then(draw, function () {});
  }

  /* ---------- 19. proposal writer ---------- */
  function propTool(host) {
    var F = fa(), g = el("div", "lb-g"), ctl = el("div", "lb-ctl"), out = el("div", "lb-cv");
    var T = F ? { cl: "نام مشتری", pj: "عنوان پروژه", sv: "نوع خدمت", wk: "مدت اجرا (هفته)", rv: "تعداد دور بازبینی", dl: "کپی متن پیشنهاد", ok: "کپی شد", sd: "دانلود TXT", nt: "یک چارچوب حرفه‌ای برای پیشنهاد کاری. قیمت و جزئیات را خودت اضافه کن؛ چیزی ذخیره یا فرستاده نمی‌شود.", S: ["ویدیوی معرفی", "طراحی برند و لوگو", "موشن‌گرافیک", "فیلم‌برداری رویداد", "آموزش و کارگاه"] } : { cl: "Client name", pj: "Project title", sv: "Service", wk: "Timeline (weeks)", rv: "Revision rounds", dl: "Copy proposal", ok: "Copied", sd: "Download TXT", nt: "A professional outline for a work proposal. Add your own price and details; nothing is saved or sent.", S: ["Promo video", "Brand and logo design", "Motion graphics", "Event filming", "Training and workshop"] };
    var D = F ? [["ویدیو، فیلمنامه، فیلم‌برداری، تدوین، رنگ و صدا", "فیلمنامه و استوری‌بورد؛ روز فیلم‌برداری؛ تدوین؛ رنگ‌بندی؛ تحویل MP4"], ["لوگو، پالت رنگ، تایپوگرافی، راهنمای استفاده", "سه پیشنهاد اولیه؛ انتخاب یک مسیر؛ ست کامل لوگو؛ راهنمای برند"], ["انیمیشن لوگو، نوار نام‌نمایی، ویدیوی توضیحی", "طرح حرکت؛ انیمیشن؛ صدا؛ خروجی برای شبکه‌ها"], ["پوشش تصویری رویداد و تدوین خلاصه", "فیلم‌برداری در محل؛ تدوین خلاصه؛ تحویل کلیپ‌های کوتاه"], ["برنامهٔ درسی، تمرین و گواهی", "برنامهٔ جلسات؛ مواد آموزشی؛ تمرین عملی؛ ارزیابی و گواهی"]] : [["Video, script, filming, editing, colour and sound", "Script and storyboard; shoot day; edit; colour grade; MP4 delivery"], ["Logo, colour palette, typography, usage guide", "Three first concepts; one chosen direction; full logo set; brand guide"], ["Logo animation, lower thirds, explainer video", "Motion plan; animation; sound; exports for social media"], ["Event coverage and highlight edit", "On-site filming; highlight edit; short social clips"], ["Curriculum, exercises and certificate", "Session plan; learning material; hands-on practice; assessment and certificate"]];
    var st = { cl: "", pj: "", sv: 0, wk: 3, rv: 2 };
    [["cl", 1], ["pj", 1]].forEach(function (q) { var l = el("label"); l.appendChild(el("span", "", T[q[0]])); var i = el("input", "lb-in"); i.type = "text"; i.addEventListener("input", function () { st[q[0]] = i.value; draw(); }); l.appendChild(i); ctl.appendChild(l); });
    var sl = el("label"); sl.appendChild(el("span", "", T.sv)); var ss = el("select"); T.S.forEach(function (n, i) { var o = el("option", "", n); o.value = i; ss.appendChild(o); }); ss.addEventListener("change", function () { st.sv = +ss.value; draw(); }); sl.appendChild(ss); ctl.appendChild(sl);
    [["wk", 1, 24], ["rv", 0, 6]].forEach(function (q) { var l = el("label"); l.appendChild(el("span", "", T[q[0]])); var i = el("input", "lb-in"); i.type = "number"; i.min = q[1]; i.max = q[2]; i.value = st[q[0]]; i.addEventListener("input", function () { st[q[0]] = Math.max(q[1], Math.min(q[2], +i.value || 0)); draw(); }); l.appendChild(i); ctl.appendChild(l); });
    var ta = el("textarea"); ta.rows = 18; ta.readOnly = true; ta.className = "pc-stx"; ta.style.minHeight = "340px"; out.appendChild(ta);
    var note = el("p", "lb-note", T.nt); note.setAttribute("role", "status");
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { note.textContent = T.ok; setTimeout(function () { note.textContent = T.nt; }, 900); }, function () {}); }));
    ctl.appendChild(btn(T.sd, "lb-bt", function () { save(ta.value, "proposal.txt", "text/plain"); })); ctl.appendChild(note);
    function draw() {
      var d = D[st.sv], n = st.wk, r = st.rv, L = F ? ["پیشنهاد کار", "برای", "پروژه", "دامنهٔ کار", "مراحل", "زمان‌بندی", "بازبینی", "پرداخت", "قیمت", "هفته", "دور بازبینی ", "۵۰٪ پیش‌پرداخت، ۵۰٪ هنگام تحویل", "[مبلغ را اینجا بنویس]", "اعتبار پیشنهاد: ۱۴ روز", "از طرف: [نام تو]", "تحویل نهایی پس از پرداخت کامل"] : ["Work proposal", "For", "Project", "Scope", "Steps", "Timeline", "Revisions", "Payment", "Price", "weeks", "revision rounds", "50% upfront, 50% on delivery", "[write your price here]", "Valid for 14 days", "From: [your name]", "Final files after full payment"];
      ta.value = L[0].toUpperCase() + "\n" + "=".repeat(24) + "\n" + L[1] + ": " + (st.cl || "—") + "\n" + L[2] + ": " + (st.pj || T.S[st.sv]) + "\n\n" + L[3] + "\n- " + d[0] + "\n\n" + L[4] + "\n" + d[1].split("؛").join(";").split(";").map(function (s, i) { return (i + 1) + ". " + s.trim(); }).join("\n") + "\n\n" + L[5] + "\n- " + n + " " + L[9] + "\n\n" + L[6] + "\n- " + r + " " + L[10] + "\n\n" + L[7] + "\n- " + L[11] + "\n- " + L[15] + "\n\n" + L[8] + "\n- " + L[12] + "\n\n" + L[13] + "\n" + L[14];
    }
    g.appendChild(ctl); g.appendChild(out); host.appendChild(g); draw();
  }

  /* ---------- 20. 30-day content calendar ---------- */
  function calTool(host) {
    var F = fa(), g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var T = F ? { tp: "موضوع‌ها (هر خط یک ایده)", pw: "پست در هفته", dl: "دانلود تقویم (PNG)", cs: "دانلود CSV", nt: "ایده‌ها به‌ترتیب روی روزهای انتخاب‌شده می‌نشینند. روزها و ایده‌ها را خودت عوض کن؛ چیزی ذخیره یا فرستاده نمی‌شود.", ex: "پشت‌صحنهٔ یک پروژه\nقبل و بعد از رنگ‌بندی\nنکتهٔ کوتاه تدوین\nمعرفی یک ابزار\nنمونه‌کار جدید\nپرسش و پاسخ", ti: "تقویم محتوای ۳۰ روزه", D: ["ش", "ی", "د", "س", "چ", "پ", "ج"] } : { tp: "Topics (one idea per line)", pw: "Posts per week", dl: "Download calendar (PNG)", cs: "Download CSV", nt: "Ideas are placed in order on the chosen days. Change days and ideas freely; nothing is saved or sent.", ex: "Behind the scenes of a project\nBefore and after colour grade\nQuick editing tip\nA tool I use\nNew portfolio piece\nQ and A", ti: "30-DAY CONTENT CALENDAR", D: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };
    var st = { tp: T.ex, pw: 3 };
    var l1 = el("label"); l1.appendChild(el("span", "", T.tp)); var i1 = el("textarea"); i1.rows = 7; i1.value = st.tp; i1.addEventListener("input", function () { st.tp = i1.value; draw(); }); l1.appendChild(i1); ctl.appendChild(l1);
    var l2 = el("label"); l2.appendChild(el("span", "", T.pw)); var i2 = el("select"); [1, 2, 3, 4, 5, 7].forEach(function (n) { var o = el("option", "", n); o.value = n; i2.appendChild(o); }); i2.value = 3; i2.addEventListener("change", function () { st.pw = +i2.value; draw(); }); l2.appendChild(i2); ctl.appendChild(l2);
    var PAT = { 1: [2], 2: [1, 4], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4], 7: [0, 1, 2, 3, 4, 5, 6] };
    function plan() { var tp = st.tp.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean), out = [], k = 0; for (var d = 0; d < 35; d++) { var on = PAT[st.pw].indexOf(d % 7) >= 0 && d < 30; out.push(on && tp.length ? tp[k++ % tp.length] : ""); } return out; }
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { dl(c, "content-calendar.png"); }));
    ctl.appendChild(btn(T.cs, "lb-bt", function () { var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; }; save("﻿day,idea\n" + plan().map(function (t, i) { return t && i < 30 ? (i + 1) + "," + q(t) : null; }).filter(Boolean).join("\n"), "content-calendar.csv", "text/csv"); }));
    ctl.appendChild(el("p", "lb-note", T.nt));
    function draw() {
      var P = plan(), W = 1400, H = 1200, x = c.getContext("2d"), rtl = /[؀-ۿ]/.test(st.tp) || F, ff = rtl ? '"Farhang FA","Farhang"' : 'Inter,Arial,sans-serif'; c.width = W; c.height = H; c.style.maxWidth = "100%"; c.style.height = "auto";
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H); x.fillStyle = "#07172D"; x.fillRect(0, 0, W, 150); x.fillStyle = "#fff"; x.textAlign = rtl ? "right" : "left"; x.font = "900 54px " + ff; x.fillText(T.ti, rtl ? W - 60 : 60, 95);
      var cw = (W - 100) / 7, ch = 190, ox = 50, oy = 250; x.textAlign = "center"; x.fillStyle = "#0B6DB8"; x.font = "800 28px " + ff; T.D.forEach(function (d, i) { x.fillText(d, ox + (rtl ? 6 - i : i) * cw + cw / 2, oy - 24); });
      P.forEach(function (t, i) { var col = i % 7, row = Math.floor(i / 7), bx = ox + (rtl ? 6 - col : col) * cw, by = oy + row * ch; if (i >= 30) return; x.fillStyle = t ? "#EAF3FB" : "#F7F6FB"; x.fillRect(bx + 4, by + 4, cw - 8, ch - 8); x.fillStyle = "#39A9E8"; x.textAlign = rtl ? "right" : "left"; x.font = "800 24px Inter,Arial,sans-serif"; x.fillText(String(i + 1), rtl ? bx + cw - 16 : bx + 16, by + 36); if (t) { x.fillStyle = "#0A1D38"; x.font = "600 22px " + ff; var w = t.split(/\s+/), line = "", yy = by + 74, n = 0; w.forEach(function (w3) { var tt = line ? line + " " + w3 : w3; if (x.measureText(tt).width > cw - 32 && line) { if (n < 4) x.fillText(line, rtl ? bx + cw - 16 : bx + 16, yy); yy += 30; n++; line = w3; } else line = tt; }); if (line && n < 4) x.fillText(line, rtl ? bx + cw - 16 : bx + 16, yy); } });
    }
    g.appendChild(ctl); g.appendChild(cv); host.appendChild(g); draw(); if (document.fonts && document.fonts.load) document.fonts.load('600 22px "Farhang FA"', "ا").then(draw, function () {});
  }

  /* ---------- 21. caption maker with limits ---------- */
  function capTool(host) {
    var F = fa(), g = el("div", "lb-g"), ctl = el("div", "lb-ctl"), out = el("div", "lb-cv");
    var T = F ? { tx: "متن پست", ht: "هشتگ‌ها (با فاصله یا کاما)", nt: "سقف نویسه‌ها تقریبی است و شبکه‌ها آن را تغییر می‌دهند. متن در مرورگر می‌ماند.", cp: "کپی", ok: "کپی شد", ch: "نویسه", ov: "بیش از سقف", ex: "امروز یک پروژهٔ تازه را تحویل دادم. پشت‌صحنه را در ادامه ببینید.", hx: "فیلم‌سازی تدوین موشن‌گرافیک" } : { tx: "Post text", ht: "Hashtags (space or comma separated)", nt: "Character limits are approximate and platforms change them. Text stays in your browser.", cp: "Copy", ok: "Copied", ch: "characters", ov: "over the limit", ex: "Delivered a new project today. Behind the scenes below.", hx: "filmmaking editing motiongraphics" };
    var N = [["X", 280, 2], ["Instagram", 2200, 30], ["LinkedIn", 3000, 5], ["TikTok", 2200, 5], ["Facebook", 63206, 5], ["Threads", 500, 1]];
    var l1 = el("label"); l1.appendChild(el("span", "", T.tx)); var a1 = el("textarea"); a1.rows = 6; a1.value = T.ex; l1.appendChild(a1); ctl.appendChild(l1);
    var l2 = el("label"); l2.appendChild(el("span", "", T.ht)); var a2 = el("input", "lb-in"); a2.type = "text"; a2.value = T.hx; a2.dir = "ltr"; l2.appendChild(a2); ctl.appendChild(l2); ctl.appendChild(el("p", "lb-note", T.nt));
    var rows = [];
    N.forEach(function (n) { var box = el("div", "lb-kv"); box.style.cssText = "padding:12px;border:1px solid rgba(110,176,230,.3);border-radius:14px;margin-bottom:10px"; var hd = el("b", "", n[0]); var st = el("span", "", ""); st.style.marginInline = "10px"; var ta = el("textarea"); ta.readOnly = true; ta.rows = 3; ta.className = "pc-stx"; var cb = btn(T.cp, "lb-bt", function () { if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { cb.textContent = T.ok; setTimeout(function () { cb.textContent = T.cp; }, 900); }, function () {}); }); box.appendChild(hd); box.appendChild(st); box.appendChild(cb); box.appendChild(ta); out.appendChild(box); rows.push([n, st, ta]); });
    function upd() { var tags = a2.value.split(/[\s,،#]+/).filter(Boolean).map(function (t) { return "#" + t; }); rows.forEach(function (r) { var n = r[0], t = a1.value.trim() + (tags.length ? "\n\n" + tags.slice(0, n[2]).join(" ") : ""), len = Array.from(t).length; r[2].value = t; r[1].textContent = len + " / " + n[1] + " " + T.ch + (len > n[1] ? " · " + T.ov : ""); r[1].style.color = len > n[1] ? "#FF6B6B" : "inherit"; }); }
    a1.addEventListener("input", upd); a2.addEventListener("input", upd); g.appendChild(ctl); g.appendChild(out); host.appendChild(g); upd();
  }

  /* ---------- 22. social image resizer ---------- */
  function sizeTool(host) {
    var F = fa(), g = el("div", "lb-g"), cv = el("div", "lb-cv"), c = el("canvas"); c.width = 540; c.height = 540; c.style.maxWidth = "100%"; c.style.height = "auto"; cv.appendChild(c); var ctl = el("div", "lb-ctl");
    var T = F ? { pk: "عکس را انتخاب کن", sz: "اندازه", zm: "بزرگ‌نمایی", px: "جابه‌جایی افقی", py: "جابه‌جایی عمودی", dl: "دانلود (JPG)", nt: "عکس فقط در مرورگر تو پردازش می‌شود و جایی فرستاده نمی‌شود.", none: "هنوز عکسی انتخاب نشده" } : { pk: "Choose an image", sz: "Size", zm: "Zoom", px: "Move horizontally", py: "Move vertically", dl: "Download (JPG)", nt: "The image is processed only in your browser and never uploaded.", none: "No image chosen yet" };
    var Z = [["Instagram post 1080×1350", 1080, 1350], ["Square 1080×1080", 1080, 1080], ["Story / Reels 1080×1920", 1080, 1920], ["YouTube thumbnail 1280×720", 1280, 720], ["X / LinkedIn post 1200×675", 1200, 675], ["Facebook cover 820×312", 820, 312], ["Profile picture 400×400", 400, 400]];
    var img = null, sz = 0, zm = 1, ox = 0, oy = 0;
    var fl = el("label"); fl.appendChild(el("span", "", T.pk)); var fi = el("input"); fi.type = "file"; fi.accept = "image/*"; fl.appendChild(fi); ctl.appendChild(fl);
    var sl = el("label"); sl.appendChild(el("span", "", T.sz)); var ss = el("select"); Z.forEach(function (z, i) { var o = el("option", "", z[0]); o.value = i; ss.appendChild(o); }); sl.appendChild(ss); ctl.appendChild(sl);
    function rng(lbl, mn, mx, st, v, fn) { var l = el("label"); l.appendChild(el("span", "", lbl)); var i = el("input"); i.type = "range"; i.min = mn; i.max = mx; i.step = st; i.value = v; i.addEventListener("input", function () { fn(+i.value); draw(); }); l.appendChild(i); ctl.appendChild(l); }
    rng(T.zm, 1, 3, .01, 1, function (v) { zm = v; }); rng(T.px, -1, 1, .01, 0, function (v) { ox = v; }); rng(T.py, -1, 1, .01, 0, function (v) { oy = v; });
    ss.addEventListener("change", function () { sz = +ss.value; draw(); });
    fi.addEventListener("change", function () { var f = fi.files && fi.files[0]; if (!f) return; var u = URL.createObjectURL(f), im = new Image(); im.onload = function () { img = im; draw(); URL.revokeObjectURL(u); }; im.src = u; });
    function layout(W, H) { var s = Math.max(W / img.width, H / img.height) * zm, w = img.width * s, h = img.height * s; return [(W - w) / 2 + ox * (w - W) / 2, (H - h) / 2 + oy * (h - H) / 2, w, h]; }
    function draw(full) { var z = Z[sz], W = full ? z[1] : 540, H = full ? z[2] : Math.round(540 * z[2] / z[1]), x; var t = full ? document.createElement("canvas") : c; t.width = W; t.height = H; x = t.getContext("2d"); x.fillStyle = "#07172D"; x.fillRect(0, 0, W, H); if (img) { var p = layout(W, H); x.drawImage(img, p[0], p[1], p[2], p[3]); } else { x.fillStyle = "#8fa3bf"; x.font = "600 22px Inter,Arial,sans-serif"; x.textAlign = "center"; x.fillText(T.none, W / 2, H / 2); } return t; }
    ctl.appendChild(btn(T.dl, "lb-bt go", function () { if (!img) return; var t = draw(true); t.toBlob(function (b) { var u = URL.createObjectURL(b), a = el("a"); a.href = u; a.download = "social-image.jpg"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 3000); }, "image/jpeg", .92); }));
    ctl.appendChild(el("p", "lb-note", T.nt)); g.appendChild(ctl); g.appendChild(cv); host.appendChild(g); draw();
  }

  /* ---------- 23. email signature ---------- */
  function sigTool(host) {
    var F = fa(), g = el("div", "lb-g"), ctl = el("div", "lb-cv"), pv = el("div", "lb-cv"); var S = window.SITE || {};
    var T = F ? { nm: "نام", rl: "سمت", em: "ایمیل", ph: "شماره", ws: "وب‌سایت", cp: "کپی متن ساده", ch: "کپی HTML", ok: "کپی شد", nt: "هر چیزی را که نمی‌خواهی در امضا باشد خالی بگذار. چیزی ذخیره یا فرستاده نمی‌شود.", rt: "فیلم‌ساز · طراح گرافیک" } : { nm: "Name", rl: "Role", em: "Email", ph: "Phone", ws: "Website", cp: "Copy plain text", ch: "Copy HTML", ok: "Copied", nt: "Leave empty anything you do not want in the signature. Nothing is saved or sent.", rt: "Filmmaker · Graphic designer" };
    var st = { nm: "", rl: T.rt, em: "", ph: "", ws: "" }, form = el("div", "lb-ctl");
    [["nm", "text"], ["rl", "text"], ["em", "email"], ["ph", "tel"], ["ws", "url"]].forEach(function (q) { var l = el("label"); l.appendChild(el("span", "", T[q[0]])); var i = el("input", "lb-in"); i.type = q[1]; i.value = st[q[0]]; if (q[0] !== "nm" && q[0] !== "rl") i.dir = "ltr"; i.addEventListener("input", function () { st[q[0]] = i.value; draw(); }); l.appendChild(i); form.appendChild(l); });
    var note = el("p", "lb-note", T.nt); note.setAttribute("role", "status");
    function plain() { return [st.nm, st.rl, [st.em, st.ph].filter(Boolean).join("  |  "), st.ws].filter(Boolean).join("\n"); }
    function esc2(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function html() { var l = []; if (st.nm) l.push('<b style="font-size:16px;color:#0A1D38">' + esc2(st.nm) + "</b>"); if (st.rl) l.push('<span style="color:#0B6DB8">' + esc2(st.rl) + "</span>"); var c = []; if (st.em) c.push('<a href="mailto:' + esc2(st.em) + '" style="color:#0A1D38">' + esc2(st.em) + "</a>"); if (st.ph) c.push(esc2(st.ph)); if (c.length) l.push(c.join(" &nbsp;|&nbsp; ")); if (st.ws && /^https:\/\//i.test(st.ws)) l.push('<a href="' + esc2(st.ws) + '" style="color:#0A1D38">' + esc2(st.ws.replace(/^https:\/\//, "")) + "</a>"); else if (st.ws) l.push(esc2(st.ws)); return '<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;border-inline-start:4px solid #39A9E8;padding-inline-start:12px">' + l.join("<br>") + "</div>"; }
    function draw() { pv.innerHTML = '<div style="background:#fff;color:#0A1D38;padding:18px;border-radius:12px">' + html() + "</div>"; }
    function cpy(t, b) { if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { var o = b.textContent; b.textContent = T.ok; setTimeout(function () { b.textContent = o; }, 900); }, function () {}); }
    var b1 = btn(T.cp, "lb-bt go", function () { cpy(plain(), b1); }), b2 = btn(T.ch, "lb-bt", function () { cpy(html(), b2); });
    form.appendChild(b1); form.appendChild(b2); form.appendChild(note); g.appendChild(form); g.appendChild(pv); host.appendChild(g); draw();
  }

  /* ---------- 24. print size and DPI calculator ---------- */
  function printTool(host) {
    var F = fa(), g = el("div", "lb-g"), ctl = el("div", "lb-ctl"), out = el("div", "lb-cv");
    var T = F ? { ps: "اندازهٔ آماده", w: "عرض", h: "ارتفاع", un: "واحد", dp: "DPI (کیفیت چاپ)", bl: "بلید یا حاشیهٔ برش (میلی‌متر)", cp: "کپی نتیجه", ok: "کپی شد", nt: "برای چاپ معمولی ۳۰۰ DPI، برای بیلبورد و بنر بزرگ که از دور دیده می‌شود ۷۲ تا ۱۵۰ DPI کافی است. بلید یعنی طرح از لبهٔ برش بیرون بزند تا لبهٔ سفید نماند.", r1: "اندازهٔ نهایی", r2: "با بلید", r3: "پیکسل لازم (نهایی)", r4: "پیکسل لازم (با بلید)", r5: "نسبت", mm: "میلی‌متر", cm: "سانتی‌متر", inch: "اینچ" } : { ps: "Preset", w: "Width", h: "Height", un: "Unit", dp: "DPI (print quality)", bl: "Bleed (mm)", cp: "Copy result", ok: "Copied", nt: "Use 300 DPI for normal print; 72 to 150 DPI is enough for billboards and large banners seen from far away. Bleed means the design runs past the cut line so no white edge appears.", r1: "Final size", r2: "With bleed", r3: "Pixels needed (final)", r4: "Pixels needed (with bleed)", r5: "Ratio", mm: "mm", cm: "cm", inch: "inch" };
    var P = [["A4", 210, 297], ["A3", 297, 420], ["A5", 148, 210], ["A6", 105, 148], [F ? "کارت ویزیت" : "Business card", 90, 50], [F ? "پوستر ۵۰×۷۰" : "Poster 50×70 cm", 500, 700], [F ? "بنر ۱۰۰×۲۰۰" : "Banner 100×200 cm", 1000, 2000], [F ? "رول‌آپ ۸۵×۲۰۰" : "Roll-up 85×200 cm", 850, 2000], [F ? "بیلبورد ۳×۶ متر" : "Billboard 3×6 m", 3000, 6000]];
    var st = { w: 210, h: 297, un: "mm", dpi: 300, bl: 3 };
    var pl = el("label"); pl.appendChild(el("span", "", T.ps)); var ps = el("select"); P.forEach(function (p, i) { var o = el("option", "", p[0]); o.value = i; ps.appendChild(o); }); pl.appendChild(ps); ctl.appendChild(pl);
    function num(lbl, k, step) { var l = el("label"); l.appendChild(el("span", "", lbl)); var i = el("input", "lb-in"); i.type = "number"; i.min = 0; i.step = step; i.value = st[k]; i.setAttribute("inputmode", "decimal"); i.addEventListener("input", function () { st[k] = +i.value || 0; upd(); }); l.appendChild(i); ctl.appendChild(l); return i; }
    var wi = num(T.w, "w", 1), hi = num(T.h, "h", 1);
    var ul = el("label"); ul.appendChild(el("span", "", T.un)); var us = el("select"); [["mm", T.mm], ["cm", T.cm], ["in", T.inch]].forEach(function (u) { var o = el("option", "", u[1]); o.value = u[0]; us.appendChild(o); }); ul.appendChild(us); ctl.appendChild(ul);
    num(T.dp, "dpi", 10); num(T.bl, "bl", 1);
    ps.addEventListener("change", function () { var p = P[+ps.value]; us.value = "mm"; st.un = "mm"; st.w = p[1]; st.h = p[2]; wi.value = p[1]; hi.value = p[2]; upd(); });
    us.addEventListener("change", function () { st.un = us.value; upd(); });
    var res = el("div", "lb-note", ""); res.setAttribute("role", "status"); res.style.whiteSpace = "pre-line"; res.dir = "ltr";
    function mmv(v) { return st.un === "mm" ? v : st.un === "cm" ? v * 10 : v * 25.4; }
    function px(mm) { return Math.round(mm / 25.4 * st.dpi); }
    function upd() { var w = mmv(st.w), h = mmv(st.h), b = Math.max(0, st.bl), wb = w + 2 * b, hb = h + 2 * b; var g2 = function (a, c) { return c ? (a / c).toFixed(3) : "—"; };
      res.textContent = T.r1 + ": " + w.toFixed(1) + " × " + h.toFixed(1) + " mm  (" + (w / 25.4).toFixed(2) + " × " + (h / 25.4).toFixed(2) + " in)\n" + T.r2 + ": " + wb.toFixed(1) + " × " + hb.toFixed(1) + " mm\n" + T.r3 + ": " + px(w) + " × " + px(h) + " px\n" + T.r4 + ": " + px(wb) + " × " + px(hb) + " px  (" + (px(wb) * px(hb) / 1e6).toFixed(1) + " MP)\n" + T.r5 + ": " + g2(w, h); }
    ctl.appendChild(btn(T.cp, "lb-bt go", function () { if (navigator.clipboard) navigator.clipboard.writeText(res.textContent).then(function () { var o = res.textContent; res.textContent = T.ok; setTimeout(upd, 900); }, function () {}); }));
    out.appendChild(res); out.appendChild(el("p", "lb-note", T.nt)); g.appendChild(ctl); g.appendChild(out); host.appendChild(g); upd();
  }

  /* ---------- page ---------- */
  var tab = 0;
  function build() {
    var host = document.getElementById("lab"); if (!host) return; var f = fa(); host.textContent = "";
    var w = el("div", "lb"); var h1 = el("h1", "", "CineCode Lab"); h1.dir = "ltr"; w.appendChild(h1); w.appendChild(el("p", "lb-p", f ? "بیست‌وچهار ابزار خلاق و رایگان که کاملاً در مرورگر خودت اجرا می‌شوند. هیچ عکس یا متنی جایی فرستاده نمی‌شود." : "Twenty-four free creative tools that run entirely in your browser. No photo or text is ever uploaded."));
    var names = f ? ["رنگ‌بندی سینمایی", "استودیوی پوستر", "جستجوی آثار با رنگ", "مسیر یادگیری من", "سازندهٔ ریل", "مربی ترکیب‌بندی", "تایپوگرافی متحرک", "کوررنگی و کنتراست", "سازندهٔ زیرنویس", "استوری‌بورد", "نوار نام‌نمایی", "مطالعهٔ موردی", "ماشین‌حساب فیلم", "منحنی حرکت", "پیش‌فاکتور", "کارت برند", "نواحی امن شبکه‌ها", "شات‌لیست", "پیشنهاد کار", "تقویم محتوا", "کپشن شبکه‌ها", "اندازهٔ عکس شبکه‌ها", "امضای ایمیل", "ماشین‌حساب چاپ"] : ["Cinema grade", "Poster studio", "Search by colour", "My learning path", "Reel maker", "Composition coach", "Kinetic type", "Vision & contrast", "Subtitle maker", "Storyboard", "Lower thirds", "Case study", "Film calculators", "Motion easing", "Quote sheet", "Brand kit", "Social safe zones", "Shot list", "Proposal writer", "Content calendar", "Caption maker", "Social image sizes", "Email signature", "Print size and DPI"];
    var tl = el("div", "lb-t"); tl.setAttribute("role", "tablist"); var pn = el("div", "lb-pn"); pn.setAttribute("role", "tabpanel");
    names.forEach(function (n, i) { var b = btn(n, "", function () { tab = i; show(); }); b.setAttribute("role", "tab"); b.id = "lbt" + i; tl.appendChild(b); });
    w.appendChild(tl); w.appendChild(pn); host.appendChild(w);
    function show() { [].forEach.call(tl.children, function (b, i) { b.setAttribute("aria-selected", i === tab ? "true" : "false"); b.tabIndex = i === tab ? 0 : -1; }); pn.setAttribute("aria-labelledby", "lbt" + tab); try { var sb = tl.children[tab]; if (tl.scrollWidth > tl.clientWidth) tl.scrollLeft = sb.offsetLeft - (tl.clientWidth - sb.offsetWidth) / 2 * (document.dir === "rtl" ? -1 : 1) * 0 - (tl.clientWidth - sb.offsetWidth) / 2; } catch (e) {} pn.textContent = ""; [gradeTool, posterTool, colorTool, pathTool, reelTool, coachTool, typeTool, visionTool, subTool, boardTool, barsTool, caseTool, calcTool, easeTool, quoteTool, brandTool, zoneTool, shotTool, propTool, calTool, capTool, sizeTool, sigTool, printTool][tab](pn); }
    tl.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { tab = (tab + (e.key === "ArrowRight" ? 1 : 23)) % 24; show(); tl.children[tab].focus(); } });
    var q = new URLSearchParams(location.search).get("t"); if (q && /^([0-9]|1[0-9]|2[0-3])$/.test(q)) tab = +q; show();
  }
  var started = false; function go() { if (started) return; started = true; build(); new MutationObserver(function () { build(); }).observe(R, { attributes: true, attributeFilter: ["lang"] }); }
  if (window.SITE) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go(); } else addEventListener("load", go);
})();
