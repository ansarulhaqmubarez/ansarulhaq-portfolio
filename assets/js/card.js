/* card.js: digital business card. Real contact data comes from window.SITE; the vCard is built in the browser on the visitor's click, nothing is sent anywhere. */
(function () {
  "use strict";
  var S = window.SITE || {}, R = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var fa = function () { return R.lang === "fa"; };
  var tx = function (o) { return (o && (o[fa() ? "fa" : "en"] || o.fa || o.en)) || ""; };
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  function link(href, label, cls, ltr) { var a = el("a", cls || "cd-l"); a.href = href; if (ltr) a.dir = "ltr"; a.appendChild(el("span", "", label)); return a; }
  function vcard() {
    var esc = function (v) { return String(v).replace(/([\;,])/g, "\\$1").replace(/\n/g, "\\n"); };
    var L = ["BEGIN:VCARD", "VERSION:3.0", "N:" + esc("Mubarez") + ";" + esc("Ansarulhaq") + ";;;", "FN:" + esc("Ansarulhaq Mubarez"), "ORG:" + esc("CineCode Academy"), "TITLE:" + esc("Filmmaker, programmer and graphic designer")];
    (S.phones || []).forEach(function (p) { if (p && /^\+?\d{7,15}$/.test(p.n || "")) L.push("TEL;TYPE=CELL:" + p.n); });
    [S.contactEmail, S.contactEmail2].forEach(function (m) { if (m && /^[^\s@]+@[^\s@]+$/.test(m)) L.push("EMAIL;TYPE=INTERNET:" + m); });
    L.push("ADR;TYPE=WORK:;;;Kabul;;;Afghanistan", "URL:" + location.origin + location.pathname.replace(/card\.html$/, ""), "END:VCARD");
    return L.join("\r\n") + "\r\n";
  }
  function build() {
    var host = $("#card"); if (!host) return; var f = fa(); host.textContent = "";
    var wrap = el("div", "cd-w");
    var card = el("section", "cd"); card.setAttribute("aria-label", f ? "کارت دیجیتال" : "Digital card");
    var im = el("img", "cd-im"); im.src = "assets/img/me.webp"; im.alt = tx(S.name) || "Ansarulhaq Mubarez"; im.width = 220; im.height = 220;
    var head = el("div", "cd-h"); head.appendChild(el("span", "cd-eb", "CINECODE · KABUL")); head.appendChild(el("h1", "", tx(S.name) || "Ansarulhaq Mubarez"));
    head.appendChild(el("p", "cd-r", f ? "فیلم‌ساز · برنامه‌نویس · طراح گرافیک" : "Filmmaker · Programmer · Graphic designer"));
    var top = el("div", "cd-top"); top.appendChild(im); top.appendChild(head); card.appendChild(top);
    var ls = el("div", "cd-ls");
    if (S.contactEmail) ls.appendChild(link("mailto:" + S.contactEmail, S.contactEmail, "cd-l", true));
    if (S.contactEmail2) ls.appendChild(link("mailto:" + S.contactEmail2, S.contactEmail2, "cd-l", true));
    (S.phones || []).forEach(function (p) { if (p && /^\+?\d{7,15}$/.test(p.n || "")) ls.appendChild(link("tel:" + p.n, p.show || p.n, "cd-l", true)); });
    var loc = el("div", "cd-l cd-loc"); loc.appendChild(el("span", "", f ? "کابل، افغانستان" : "Kabul, Afghanistan")); ls.appendChild(loc);
    card.appendChild(ls);
    var act = el("div", "cd-a");
    var sv = el("button", "cd-b cd-go", f ? "ذخیره در مخاطبین" : "Save to contacts"); sv.type = "button";
    sv.onclick = function () { var b = new Blob([vcard()], { type: "text/vcard" }), u = URL.createObjectURL(b), a = el("a"); a.href = u; a.download = "Ansarulhaq-Mubarez.vcf"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 3000); };
    var cp = el("button", "cd-b", f ? "کپی لینک" : "Copy link"); cp.type = "button";
    cp.onclick = function () { var u = location.href.split("#")[0]; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { cp.textContent = f ? "کپی شد ✓" : "Copied ✓"; }, function () { cp.textContent = f ? "لینک را از نوار آدرس بردار" : "Copy it from the address bar"; }); };
    act.appendChild(sv); act.appendChild(cp);
    if (navigator.share) { var sh = el("button", "cd-b", f ? "اشتراک‌گذاری" : "Share"); sh.type = "button"; sh.onclick = function () { navigator.share({ title: "Ansarulhaq Mubarez", url: location.href.split("#")[0] }).catch(function () {}); }; act.appendChild(sh); }
    card.appendChild(act);
    var q = el("div", "cd-q");
    try { var qr = qrcode(0, "M"); qr.addData(location.href.split("#")[0]); qr.make(); q.innerHTML = qr.createSvgTag(6, 2, "", ""); var sv2 = q.querySelector("svg"); if (sv2) { sv2.setAttribute("role", "img"); sv2.setAttribute("aria-label", f ? "کد QR این کارت" : "QR code of this card"); sv2.removeAttribute("width"); sv2.removeAttribute("height"); } } catch (e) {}
    q.appendChild(el("span", "", f ? "اسکن کن تا این کارت در گوشی‌ات باز شود" : "Scan to open this card on your phone"));
    wrap.appendChild(card); wrap.appendChild(q); host.appendChild(wrap);
  }
  var started = false;
  function go() { if (started) return; started = true; build(); new MutationObserver(function () { build(); }).observe(R, { attributes: true, attributeFilter: ["lang"] }); }
  if (window.SITE) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go(); } else addEventListener("load", go);
})();
