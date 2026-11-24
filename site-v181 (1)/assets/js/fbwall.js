/* Public feedback wall: shows only owner-approved messages; optional opt-in to publish your own. Real data only. */
(function () {
  "use strict";
  if (document.body.dataset.page !== "feedback") return;
  var R = document.documentElement, fa = function () { return R.lang !== "en"; };
  function $(s, r) { return (r || document).querySelector(s); }
  function t(a, b) { return fa() ? a : b; }
  function go() {
    var SB = window.__SB, S = window.SITE, form = $("#form"), main = $("#top");
    if (!SB || !S || !form || !main || $("#fbWall")) return;
    /* opt-in checkbox */
    var send = $("#f-send"), lab = document.createElement("label"); lab.className = "check";
    lab.innerHTML = '<input type="checkbox" name="pub" id="f-pub"><span id="l-pub"></span>'; send.parentNode.insertBefore(lab, send);
    var wall = document.createElement("section"); wall.id = "fbWall"; wall.className = "fbw"; wall.setAttribute("aria-labelledby", "fbwH");
    main.appendChild(wall);
    function paintLabels() { $("#l-pub").textContent = t("اجازه می‌دهم نظرم با نام (بدون ایمیل) پس از تأیید مدیر در سایت نمایش داده شود.", "I allow my feedback to be shown on the site with my name (no email) after the owner approves it."); }
    var items = null;
    function draw() {
      paintLabels();
      var h = '<h2 id="fbwH">' + t("نظرهای شما", "What visitors say") + '</h2>';
      if (items === null) h += '<p class="muted">' + t("در حال بارگذاری…", "Loading…") + '</p>';
      else if (!items.length) h += '<p class="muted">' + t("هنوز نظری برای نمایش تأیید نشده است. اولین نظر را تو بنویس.", "No approved feedback to show yet. Be the first to write.") + '</p>';
      wall.innerHTML = h;
      if (items && items.length) {
        var ul = document.createElement("ul"); ul.className = "fbw-l";
        items.forEach(function (x) {
          var li = document.createElement("li"), q = document.createElement("p"), who = document.createElement("small");
          q.textContent = x.message; who.textContent = x.name + (x.kind ? " · " + x.kind : "") + " · " + String(x.created_at || "").slice(0, 10);
          li.appendChild(q); li.appendChild(who); ul.appendChild(li);
        });
        wall.appendChild(ul);
      }
    }
    function load() {
      if (!SB.on()) { items = []; draw(); return; }
      SB.rest("feedback_public?select=name,kind,message,created_at&order=created_at.desc&limit=30").then(function (r) { items = Array.isArray(r) ? r : []; draw(); }).catch(function () { items = []; draw(); });
    }
    draw(); load();
    new MutationObserver(draw).observe(R, { attributes: true, attributeFilter: ["lang"] });
    /* runs after app.js's own handler: if it passed validation it set data-busy */
    form.addEventListener("submit", function () {
      if (!form.dataset.busy || !$("#f-pub").checked || !SB.on()) return;
      SB.send("POST", "rpc/submit_public_feedback", { p_name: form.elements.name.value.trim(), p_kind: form.elements.type.value, p_message: form.elements.message.value.trim(), p_lang: fa() ? "fa" : "en" }).catch(function () {});
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(go, 400); }); else setTimeout(go, 400);
})();
