/* Gradient themes picker (footer): 7 animated gradient palettes + animation switch. Saved in this browser only. */
(function () {
  "use strict";
  var R = document.documentElement, pg = document.body.dataset.page || "";
  if (pg === "admin" || pg === "kiosk") return;
  function st(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  var G = [["default", "پیش‌فرض", "Default", "#07172D,#16427e"], ["aurora", "شفق", "Aurora", "#0B5D5A,#5B3FA8"], ["sunset", "غروب", "Sunset", "#8A1F5B,#E4572E"], ["emerald", "زمرد", "Emerald", "#0F7B5F,#2CA58D"], ["violet", "بنفش", "Violet", "#4B2A9C,#8A4DDB"], ["ocean", "اقیانوس", "Ocean", "#075985,#0EA5E9"]];
  var g0 = st("am-grad"); if (g0 && g0 !== "default" && G.some(function (x) { return x[0] === g0; })) R.dataset.grad = g0;
  if (st("am-anim") === "off") R.dataset.anim = "off";
  var fa = function () { return R.lang !== "en"; };
  function mount() {
    var bar = document.querySelector(".fbar-r") || document.querySelector("footer p.flex.flex-wrap"); if (!bar || bar.querySelector(".thm")) return;
    var w = document.createElement("span"); w.className = "thm";
    w.innerHTML = '<button type="button" class="thm-b" aria-expanded="false" aria-haspopup="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg><span class="thm-l"></span></button><div class="thm-p" hidden role="dialog"><strong class="thm-t"></strong><div class="thm-g"></div><label class="thm-a"><input type="checkbox" class="thm-c"> <span class="thm-m"></span></label></div>';
    bar.appendChild(w);
    var b = w.querySelector(".thm-b"), p = w.querySelector(".thm-p"), grid = w.querySelector(".thm-g"), c = w.querySelector(".thm-c");
    function paint() {
      w.querySelector(".thm-l").textContent = fa() ? "تم و گرادینت" : "Theme gradients"; w.querySelector(".thm-t").textContent = fa() ? "گرادینت متحرک سایت" : "Animated site gradient"; w.querySelector(".thm-m").textContent = fa() ? "حرکت گرادینت روشن باشد" : "Animate gradients";
      p.setAttribute("aria-label", fa() ? "تم و گرادینت" : "Theme gradients");
      var cur = R.dataset.grad || "default"; grid.innerHTML = "";
      G.forEach(function (x) { var bt = document.createElement("button"); bt.type = "button"; bt.textContent = fa() ? x[1] : x[2]; bt.style.background = "linear-gradient(135deg," + x[3] + ")"; bt.setAttribute("aria-pressed", String(cur === x[0])); bt.onclick = function () { if (x[0] === "default") { delete R.dataset.grad; st("am-grad", null); } else { R.dataset.grad = x[0]; st("am-grad", x[0]); } paint(); }; grid.appendChild(bt); });
      c.checked = R.dataset.anim !== "off";
    }
    c.onchange = function () { if (c.checked) { delete R.dataset.anim; st("am-anim", null); } else { R.dataset.anim = "off"; st("am-anim", "off"); } };
    b.onclick = function () { p.hidden = !p.hidden; b.setAttribute("aria-expanded", String(!p.hidden)); paint(); };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !p.hidden) { p.hidden = true; b.setAttribute("aria-expanded", "false"); b.focus(); } });
    document.addEventListener("click", function (e) { if (!p.hidden && !w.contains(e.target)) { p.hidden = true; b.setAttribute("aria-expanded", "false"); } });
    new MutationObserver(paint).observe(R, { attributes: true, attributeFilter: ["lang"] }); paint();
  }
  var n = 0, t = setInterval(function () { mount(); if (document.querySelector(".thm") || ++n > 20) clearInterval(t); }, 500);
  var ft = document.getElementById("site-footer"); if (ft) new MutationObserver(function () { setTimeout(mount, 50); }).observe(ft, { childList: true });
})();
