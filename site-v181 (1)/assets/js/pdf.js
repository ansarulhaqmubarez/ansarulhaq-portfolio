/* Own PDF maker (no libraries; CSP allows only our files). Draws a page element to a canvas (via SVG foreignObject),
   cuts it into A4 pages and writes a valid PDF with JPEG page images. Text is not selectable (it is a picture of the page).
   window.__pdf.fromElement(el, "name.pdf", { fit: true }) -> Promise */
(function () {
  "use strict";
  var NS = "http://www.w3.org/1999/xhtml";
  function blobToData(b) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsDataURL(b); }); }
  function toData(url) { return fetch(url, { credentials: "omit" }).then(function (r) { return r.blob(); }).then(blobToData); }
  function inlineStyles(src, dst, st) {
    if (src.nodeType !== 1) return;
    if (++st.n > 4000) return;
    var cs = getComputedStyle(src), s = "";
    for (var i = 0; i < cs.length; i++) { var p = cs[i]; if (p === "height" || p === "block-size" || p === "min-height") continue; s += p + ":" + cs.getPropertyValue(p) + ";"; }
    (cs.fontFamily || "").split(",").forEach(function (f) { f = f.trim().replace(/^["']|["']$/g, ""); if (f) st.fam[f.toLowerCase()] = 1; });
    dst.setAttribute("style", s);
    var bg = cs.backgroundImage, m = bg && bg.match(/url\("?([^")]+)"?\)/);
    if (m && !/^data:/.test(m[1])) st.jobs.push(toData(m[1]).then(function (d) { dst.style.backgroundImage = 'url("' + d + '")'; }).catch(function () { dst.style.backgroundImage = "none"; }));
    if (src.tagName === "IMG" && src.src && !/^data:/.test(src.src)) st.jobs.push(toData(src.src).then(function (d) { dst.setAttribute("src", d); dst.removeAttribute("srcset"); dst.removeAttribute("loading"); }).catch(function () {}));
    if (src.tagName === "CANVAS") { try { var im = document.createElement("img"); im.setAttribute("src", src.toDataURL()); im.setAttribute("style", s); dst.parentNode.replaceChild(im, dst); } catch (e) {} return; }
    var sc = src.children, dc = dst.children;
    for (var k = 0; k < sc.length && k < dc.length; k++) inlineStyles(sc[k], dc[k], st);
  }
  /* embeds only the @font-face rules the element uses (as data URLs) so the picture uses the real site fonts */
  function fontCss(fam) {
    var jobs = [];
    try {
      [].forEach.call(document.styleSheets, function (sh) {
        var rules; try { rules = sh.cssRules; } catch (e) { return; }
        [].forEach.call(rules || [], function (r) {
          if (r.type !== 5) return; var name = (r.style.getPropertyValue("font-family") || "").trim().replace(/^["']|["']$/g, "").toLowerCase(); if (!fam[name]) return;
          var src = r.style.getPropertyValue("src") || "", m = src.match(/url\("?([^")]+)"?\)/); if (!m) return;
          var u = new URL(m[1], sh.href || location.href).href, extra = ["font-weight", "font-style", "unicode-range"].map(function (k) { var v = r.style.getPropertyValue(k); return v ? k + ":" + v + ";" : ""; }).join("");
          jobs.push(toData(u).then(function (d) { return '@font-face{font-family:"' + name.replace(/"/g, "") + '";' + extra + 'src:url("' + d + '");}'; }).catch(function () { return ""; }));
        });
      });
    } catch (e) {}
    return Promise.all(jobs).then(function (a) { return a.join(""); });
  }
  function render(el, scale) {
    var r = el.getBoundingClientRect(), w = Math.ceil(r.width), h = Math.ceil(el.scrollHeight > r.height ? el.scrollHeight : r.height);
    var clone = el.cloneNode(true), st = { n: 0, jobs: [], fam: {} };
    inlineStyles(el, clone, st);
    return Promise.all(st.jobs).then(function () { return fontCss(st.fam); }).then(function (css) {
      if (css) { var sty = document.createElement("style"); sty.textContent = css; clone.insertBefore(sty, clone.firstChild); }
      clone.setAttribute("xmlns", NS); clone.style.margin = "0"; clone.style.transform = "none"; clone.style.width = w + "px"; clone.style.height = h + "px"; clone.style.position = "static"; clone.style.animation = "none"; clone.style.opacity = "1";
      var xml = new XMLSerializer().serializeToString(clone);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><foreignObject x="0" y="0" width="100%" height="100%">' + xml + "</foreignObject></svg>";
      return new Promise(function (res, rej) {
        var img = new Image(); img.onload = function () {
          var sc = Math.min(scale, 7800 / Math.max(w, h)), c = document.createElement("canvas"); c.width = Math.round(w * sc); c.height = Math.round(h * sc);
          var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); res(c);
        }; img.onerror = function () { rej(new Error("render")); };
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      });
    });
  }
  function b64ToBytes(d) { var s = atob(d.split(",")[1]), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  function ascii(s) { var u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; }
  /* pages: [{ jpeg: Uint8Array, w: px, h: px, pw: pt, ph: pt, dw: pt, dh: pt, x: pt, y: pt }] */
  function makePdf(pages) {
    var parts = [], len = 0, off = [];
    function add(u) { parts.push(u); len += u.length; }
    function obj(n, body) { off[n] = len; add(ascii(n + " 0 obj\n")); (Array.isArray(body) ? body : [body]).forEach(function (b) { add(typeof b === "string" ? ascii(b) : b); }); add(ascii("\nendobj\n")); }
    add(ascii("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"));
    var kids = [], n = 3;
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    var objs = [];
    pages.forEach(function (p, i) { var po = n++, co = n++, io = n++; kids.push(po + " 0 R"); objs.push([po, co, io, p]); });
    obj(2, "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + pages.length + " >>");
    objs.forEach(function (o) {
      var po = o[0], co = o[1], io = o[2], p = o[3], cont = "q " + p.dw.toFixed(2) + " 0 0 " + p.dh.toFixed(2) + " " + p.x.toFixed(2) + " " + (p.ph - p.y - p.dh).toFixed(2) + " cm /Im0 Do Q";
      obj(po, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + p.pw.toFixed(2) + " " + p.ph.toFixed(2) + "] /Resources << /XObject << /Im0 " + io + " 0 R >> >> /Contents " + co + " 0 R >>");
      obj(co, "<< /Length " + cont.length + " >>\nstream\n" + cont + "\nendstream");
      obj(io, ["<< /Type /XObject /Subtype /Image /Width " + p.w + " /Height " + p.h + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + p.jpeg.length + " >>\nstream\n", p.jpeg, "\nendstream"]);
    });
    var xr = len, total = n; add(ascii("xref\n0 " + total + "\n0000000000 65535 f \n"));
    for (var i = 1; i < total; i++) add(ascii(("0000000000" + off[i]).slice(-10) + " 00000 n \n"));
    add(ascii("trailer\n<< /Size " + total + " /Root 1 0 R >>\nstartxref\n" + xr + "\n%%EOF"));
    return new Blob(parts, { type: "application/pdf" });
  }
  function fromCanvas(c, opts) {
    var land = opts.fit ? c.width >= c.height : false, PW = land ? 841.89 : 595.28, PH = land ? 595.28 : 841.89, M = opts.fit ? 0 : 28, pages = [];
    if (opts.fit) {
      var k = Math.min(PW / c.width, PH / c.height), dw = c.width * k, dh = c.height * k;
      pages.push({ jpeg: b64ToBytes(c.toDataURL("image/jpeg", 0.92)), w: c.width, h: c.height, pw: PW, ph: PH, dw: dw, dh: dh, x: (PW - dw) / 2, y: (PH - dh) / 2 });
    } else {
      var k2 = (PW - 2 * M) / c.width, sliceH = Math.floor((PH - 2 * M) / k2), y = 0;
      while (y < c.height) {
        var hh = Math.min(sliceH, c.height - y), t = document.createElement("canvas"); t.width = c.width; t.height = hh; var x = t.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, t.width, hh); x.drawImage(c, 0, y, c.width, hh, 0, 0, c.width, hh);
        pages.push({ jpeg: b64ToBytes(t.toDataURL("image/jpeg", 0.92)), w: t.width, h: hh, pw: PW, ph: PH, dw: c.width * k2, dh: hh * k2, x: M, y: M }); y += hh;
      }
    }
    return makePdf(pages);
  }
  window.__pdf = {
    fromElement: function (el, name, opts) {
      opts = opts || {};
      return render(el, opts.scale || 2).then(function (c) {
        var blob = fromCanvas(c, opts); if (opts.noSave) return blob;
        var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name || "document.pdf"; document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000); return blob;
      });
    }
  };
})();
