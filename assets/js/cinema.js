/* cinema.js: "Cinema mode" (letterbox + film grade, static, no animation) and keyboard shortcuts with a help card. */
(function () {
  "use strict";
  var R = document.documentElement, PAGE = document.body.dataset.page || "";
  if (PAGE === "admin" || PAGE === "kiosk") return;
  var fa = function () { return R.lang === "fa"; };
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var on = false; try { on = localStorage.getItem("am-cinema") === "1"; } catch (e) {}
  function apply(v, save) { on = !!v; R.classList.toggle("cinema", on); if (save) { try { localStorage.setItem("am-cinema", on ? "1" : "0"); } catch (e) {} } var b = document.getElementById("cinB"); if (b) { b.setAttribute("aria-pressed", on ? "true" : "false"); b.textContent = label(); } }
  function label() { return (fa() ? "حالت سینما" : "Cinema mode") + (on ? " ✓" : ""); }
  apply(on, false);
  function mount() { var h = document.querySelector(".fbar-r"); if (!h || document.getElementById("cinB")) return; var b = el("button", "cin-b", label()); b.id = "cinB"; b.type = "button"; b.setAttribute("aria-pressed", on ? "true" : "false"); b.onclick = function () { apply(!on, true); }; h.appendChild(b); }
  mount(); try { new MutationObserver(mount).observe(document.getElementById("site-footer") || document.body, { childList: true, subtree: true }); } catch (e) {}
  var dlg;
  function help() {
    if (!dlg) { dlg = el("dialog", "kb-dlg"); dlg.setAttribute("aria-label", "Keyboard shortcuts"); document.body.appendChild(dlg); dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); }
    var f = fa(); dlg.textContent = ""; dlg.dir = f ? "rtl" : "ltr";
    var box = el("div", "kb"); box.appendChild(el("h2", "", f ? "میان‌برهای صفحه‌کلید" : "Keyboard shortcuts"));
    var rows = f ? [["/", "جستجو"], ["C", "حالت سینما"], ["G سپس H", "صفحهٔ اول"], ["G سپس A", "آکادمی"], ["G سپس W", "نمونه‌کارها"], ["G سپس D", "کارت دیجیتال"], ["?", "این راهنما"]] : [["/", "Search"], ["C", "Cinema mode"], ["G then H", "Home"], ["G then A", "Academy"], ["G then W", "Works"], ["G then D", "Digital card"], ["?", "This help"]];
    var ul = el("ul"); rows.forEach(function (r) { var li = el("li"); li.appendChild(el("kbd", "", r[0])); li.appendChild(el("span", "", r[1])); ul.appendChild(li); }); box.appendChild(ul);
    var x = el("button", "kb-x", f ? "بستن" : "Close"); x.type = "button"; x.onclick = function () { dlg.close(); }; box.appendChild(x); dlg.appendChild(box); if (dlg.showModal) dlg.showModal();
  }
  var g = 0, gt;
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return; var t = e.target, tg = t && t.tagName; if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT" || (t && t.isContentEditable)) return; if (document.querySelector("dialog[open]") && e.key !== "?") return;
    var k = e.key.toLowerCase();
    if (g) { g = 0; clearTimeout(gt); var m = { h: "index.html", a: "academy.html", w: "works.html", d: "card.html" }[k]; if (m) { e.preventDefault(); location.href = m; } return; }
    if (k === "g") { g = 1; gt = setTimeout(function () { g = 0; }, 1500); return; }
    if (k === "c") { apply(!on, true); return; }
    if (k === "?" ) { e.preventDefault(); help(); return; }
    if (k === "/") { var s = document.getElementById("srchBtn"); if (s) { e.preventDefault(); s.click(); } }
  });
})();
/* v137: official contact QR in the header (opens the digital card; scan with a phone to save the contact) */
(function () {
  "use strict";
  var P = document.body && document.body.dataset.page; if (P === "admin" || P === "kiosk") return;
  var dlg;
  function fa() { return document.documentElement.lang === "fa"; }
  function cardUrl() { return location.origin + location.pathname.replace(/[^/]*$/, "") + "card.html"; }
  function open() {
    var f = fa();
    if (!dlg) { dlg = document.createElement("dialog"); dlg.className = "hq-dlg"; document.body.appendChild(dlg); dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); }
    var url = cardUrl();
    dlg.innerHTML = '<div class="hq-in" dir="' + (f ? "rtl" : "ltr") + '"><h2>' + (f ? "بارکد رسمی ارتباط" : "Official contact code") + '</h2><p>' + (f ? "با دوربین گوشی اسکن کن تا کارت دیجیتال انصارالحق مبارز باز شود و مخاطب را ذخیره کنی." : "Scan with your phone camera to open the digital card of Ansarulhaq Mubarez and save the contact.") + '</p><div class="hq-qr" role="img" aria-label="QR" dir="ltr"></div><p class="hq-u" dir="ltr">' + url.replace(/^https?:\/\//, "") + '</p><div class="hq-b"><a class="btn go" href="card.html">' + (f ? "باز کردن کارت" : "Open card") + '</a><button type="button" class="btn" data-c>' + (f ? "کپی لینک" : "Copy link") + '</button><button type="button" class="btn" data-x>' + (f ? "بستن" : "Close") + '</button></div><p class="hq-s" role="status"></p><div class="hq-sh"><span>' + (f ? "اشتراک این سایت" : "Share this site") + '</span><div class="hq-b" data-sh></div></div></div>';
    (function () { var base = location.origin + location.pathname.replace(/[^/]*$/, ""), tx = f ? "پورتفولیو و آکادمی سینه‌کد؛ انصارالحق مبارز، کابل. فیلم، طراحی و برنامه‌نویسی: " + base : "CineCode Academy and portfolio by Ansarulhaq Mubarez, Kabul. Film, design and code: " + base, e = encodeURIComponent, box = dlg.querySelector("[data-sh]");
      [["WhatsApp", "https://wa.me/?text=" + e(tx)], [f ? "تلگرام" : "Telegram", "https://t.me/share/url?url=" + e(base) + "&text=" + e(tx)], ["LinkedIn", "https://www.linkedin.com/sharing/share-offsite/?url=" + e(base)], ["X", "https://twitter.com/intent/tweet?text=" + e(tx)], [f ? "فیسبوک" : "Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + e(base)]].forEach(function (a) { var l = document.createElement("a"); l.className = "btn"; l.href = a[1]; l.target = "_blank"; l.rel = "noopener noreferrer"; l.textContent = a[0]; box.appendChild(l); });
      if (navigator.share) { var nb = document.createElement("button"); nb.type = "button"; nb.className = "btn"; nb.textContent = f ? "بیشتر…" : "More…"; nb.onclick = function () { navigator.share({ title: "CineCode Academy", text: tx, url: base }).catch(function () {}); }; box.appendChild(nb); } })();
    var go = function () { try { var q = window.qrcode(0, "M"); q.addData(url); q.make(); dlg.querySelector(".hq-qr").innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch (e) {} };
    if (window.qrcode) go(); else { var s = document.createElement("script"); s.src = "assets/js/qr.js"; s.onload = go; document.head.appendChild(s); }
    dlg.querySelector("[data-x]").onclick = function () { dlg.close(); };
    dlg.querySelector("[data-c]").onclick = function () { var st = dlg.querySelector(".hq-s"), ok = function () { st.textContent = f ? "کپی شد" : "Copied"; }; if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, ok); };
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function ensure() {
    var t = document.querySelector("#site-header .tools"); if (!t) return; var b = document.getElementById("hqBtn");
    if (!b) { b = document.createElement("button"); b.type = "button"; b.className = "gt"; b.id = "hqBtn"; b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v1M14 21h1M18 21h3v-3"/></svg>'; b.onclick = open; var s = document.getElementById("srchBtn"); t.insertBefore(b, s || null); }
    var al = fa() ? "بارکد رسمی ارتباط" : "Official contact code"; if (b.getAttribute("aria-label") !== al) b.setAttribute("aria-label", al);
  }
  var q1 = 0; function sched1() { if (q1) return; q1 = requestAnimationFrame(function () { q1 = 0; ensure(); }); }
  ensure(); new MutationObserver(function (m) { if (document.getElementById("hqBtn") && document.querySelector("#site-footer .fbar-r")) { var h = document.querySelector("#site-header .tools"); if (h && h.contains(document.getElementById("hqBtn"))) return; } sched1(); }).observe(document.documentElement, { childList: true, subtree: true });
})();
