/* CineCode motion layer: light, scroll-aware movement with an accessible reduced-motion fallback. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var sections = Array.prototype.slice.call(document.querySelectorAll("body:not([data-page]) #main > section:not(:first-of-type)"));
  if (!sections.length || !("IntersectionObserver" in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("cc-motion-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
  sections.forEach(function (section) {
    section.classList.add("cc-motion-pending");
    observer.observe(section);
  });
})();
