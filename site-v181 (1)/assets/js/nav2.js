/* v165 mobile header + full-screen drawer. Reads the live header so every label follows the language. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var drawer, btn, last;
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function txt(el) { var s = el.querySelector("span[data-k]") || el; return (s.textContent || "").trim(); }
  function build() {
    var h = [], nav = $("#site-header .hnav");
    if (!nav) return "";
    $$(":scope > a, :scope > .nvg", nav).forEach(function (n) {
      if (n.tagName === "A") { h.push('<a class="nvd-l" href="' + esc(n.getAttribute("href")) + '"' + (n.getAttribute("aria-current") ? ' aria-current="page"' : "") + ">" + esc(txt(n)) + "</a>"); return; }
      var b = $("button", n), m = $(".dkm", n); if (!b || !m) return;
      h.push('<details class="nvd-g"><summary>' + esc(txt(b)) + "</summary>" + $$("a", m).map(function (a) { return '<a class="nvd-s" href="' + esc(a.getAttribute("href")) + '">' + esc(txt(a)) + "</a>"; }).join("") + "</details>");
    });
    var mo = $$("#site-footer .ft-more a").map(function (a) { return '<a class="nvd-s" href="' + esc(a.getAttribute("href")) + '">' + esc((a.textContent || "").trim()) + "</a>"; });
    if (mo.length) h.push('<details class="nvd-g"><summary>' + esc(document.documentElement.lang === "en" ? "More" : "بیشتر") + "</summary>" + mo.join("") + "</details>");
    var lg = $("#loginl"), su = $("#signin"), logged = su && /account\.html/.test(su.getAttribute("href") || "");
    var acts = '<div class="nvd-a">' + (logged ? "" : '<a class="btn nvd-b" href="auth.html">' + esc(lg ? lg.textContent : "Login") + "</a>") + '<a class="btn go nvd-b" href="' + esc(su ? su.getAttribute("href") : "auth.html#register") + '">' + esc(su ? (su.textContent || "").trim() : "Sign up") + "</a></div>";
    var langs = $$("#langM button").map(function (b) { return '<button type="button" class="nvd-c" data-l="' + esc(b.dataset.l) + '" aria-pressed="' + (b.getAttribute("aria-checked") === "true") + '">' + esc((b.textContent || "").trim()) + "</button>"; }).join("");
    var tools = '<div class="nvd-t">' + langs + '<button type="button" class="nvd-c" data-act="mode">◐</button></div>';
    return acts + '<nav class="nvd-n" aria-label="Menu">' + h.join("") + "</nav>" + tools;
  }
  function open() {
    if (!drawer) {
      drawer = document.createElement("div"); drawer.id = "nvd"; drawer.hidden = true; drawer.setAttribute("role", "dialog"); drawer.setAttribute("aria-modal", "true"); drawer.setAttribute("aria-label", "Menu");
      document.body.appendChild(drawer);
      drawer.addEventListener("click", function (e) {
        var a = e.target.closest("a"); if (a) { close(true); return; }
        var c = e.target.closest("[data-l]"); if (c) { var o = $('#langM button[data-l="' + c.dataset.l + '"]'); if (o) o.click(); setTimeout(function () { drawer.innerHTML = shell(); }, 80); return; }
        if (e.target.closest("[data-act=mode]")) { var m = $("#modeBtn"); if (m) m.click(); return; }
        if (e.target.closest(".nvd-x") || e.target === drawer) close();
      });
    }
    last = document.activeElement; drawer.innerHTML = shell(); drawer.hidden = false;
    document.documentElement.classList.add("nvd-open"); btn.setAttribute("aria-expanded", "true");
    var f = $(".nvd-x", drawer); if (f) f.focus();
  }
  function shell() { return '<div class="nvd-p"><div class="nvd-h"><strong>CineCode Academy</strong><button type="button" class="nvd-x" aria-label="Close">✕</button></div>' + build() + "</div>"; }
  function close(keep) {
    if (!drawer || drawer.hidden) return; drawer.hidden = true; document.documentElement.classList.remove("nvd-open"); btn.setAttribute("aria-expanded", "false");
    if (!keep && last && last.focus) last.focus();
  }
  function ensure() {
    if (btn && document.contains(btn)) return;
    var t = $("#site-header .tools"); if (!t) return;
    btn = document.createElement("button"); btn.type = "button"; btn.className = "gt nvd-btn"; btn.id = "nvdBtn"; btn.setAttribute("aria-label", "Menu"); btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "nvd");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    btn.onclick = function () { drawer && !drawer.hidden ? close() : open(); };
    t.appendChild(btn);
  }
  document.addEventListener("keydown", function (e) {
    if (!drawer || drawer.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key === "Tab") { var f = $$("a,button,summary", drawer).filter(function (x) { return x.offsetParent !== null; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  window.addEventListener("resize", function () { if (innerWidth >= 1000) close(true); });
  window.addEventListener("pageshow", function () { close(true); });
  function init() { ensure(); setTimeout(ensure, 400); setTimeout(ensure, 1500); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
