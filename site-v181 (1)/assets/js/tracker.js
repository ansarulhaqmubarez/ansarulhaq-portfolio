/* Privacy-friendly visit counter. No cookies, no fingerprinting, no personal data.
   Respects Do Not Track / Global Privacy Control. Sends only: page path, referrer host,
   device class, browser family and a random per-tab session id (sessionStorage). */
(function () {
  "use strict";
  var S = window.SITE || {};
  if (!S.supabaseUrl || !S.supabaseAnonKey) return;
  var dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.msDoNotTrack === "1" || navigator.globalPrivacyControl === true;
  if (dnt) { window.__track = function () {}; return; }
  if (/\/(admin|account)\.html$/.test(location.pathname)) { window.__track = function () {}; return; }
  function sid() {
    try {
      var s = sessionStorage.getItem("am-sid");
      if (!s) { var a = new Uint8Array(12); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 256; });
        s = Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); sessionStorage.setItem("am-sid", s); }
      return s;
    } catch (e) { return null; }
  }
  function device() { var w = Math.min(screen.width || 1024, window.innerWidth || 1024); return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop"; }
  function browser() { var u = navigator.userAgent || ""; return /Edg\//.test(u) ? "edge" : /OPR\/|Opera/.test(u) ? "opera" : /Firefox\//.test(u) ? "firefox" : /Chrome\//.test(u) ? "chrome" : /Safari\//.test(u) ? "safari" : "other"; }
  function refHost() { try { var h = new URL(document.referrer).hostname.replace(/^www\./, ""); return h && h !== location.hostname ? h : ""; } catch (e) { return ""; } }
  var sent = {};
  function track(event, course) {
    var id = sid(); if (!id) return;
    var key = event + "|" + location.pathname + "|" + (course || ""); if (sent[key]) return; sent[key] = 1;
    var body = JSON.stringify({ p_event: event, p_path: location.pathname.slice(0, 200), p_sid: id, p_ref: refHost(), p_device: device(), p_browser: browser(), p_course: course || null });
    try {
      fetch(S.supabaseUrl.replace(/\/$/, "") + "/rest/v1/rpc/track_event", { method: "POST", keepalive: true,
        headers: { "Content-Type": "application/json", apikey: S.supabaseAnonKey, Authorization: "Bearer " + S.supabaseAnonKey }, body: body }).catch(function () {});
    } catch (e) {}
  }
  window.__track = track;
  track("page_view");
  if (/\/course\.html$/.test(location.pathname)) {
    var c = decodeURIComponent((location.hash || "").slice(1)); if (c) track("course_view", c);
    addEventListener("hashchange", function () { var h = decodeURIComponent((location.hash || "").slice(1)); if (h) { sent = {}; track("course_view", h); } });
  }
})();
