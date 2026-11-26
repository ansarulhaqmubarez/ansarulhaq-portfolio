(function () {
  "use strict";
  if ((document.body.dataset.page || "") !== "blog") return;

  var root = document.getElementById("blog");
  if (!root) return;

  var copy = {
    fa: {
      title: "از منطق نمادین تا هوش مصنوعی مولد",
      description: "مروری بر تحول هوش مصنوعی و نقش کتاب جامع «سامی» در آموزش عالی.",
      category: "مقالهٔ پژوهشی · هوش مصنوعی",
      read: "مشاهدهٔ مقاله",
      author: "انصارالحق مبارز · Cine Code Academy"
    },
    en: {
      title: "From Symbolic Logic to Generative AI",
      description: "An analysis of AI's evolution and the role of the comprehensive reference book Sami in higher education.",
      category: "Research article · Artificial intelligence",
      read: "Read the article",
      author: "Ansar-ul-Haq Mubarez · Cine Code Academy"
    }
  };

  function render() {
    if (!document.documentElement.classList.contains("rdy")) return;
    if (root.querySelector('[data-sami-article="1"]')) return;
    var lang = document.documentElement.lang === "en" ? "en" : "fa";
    var t = copy[lang];
    var card = document.createElement("article");
    card.className = "ac-card";
    card.dataset.samiArticle = "1";
    card.style.cssText = "position:relative;overflow:hidden;border-color:#39A9E8;background:linear-gradient(135deg,rgba(7,23,45,.98),rgba(16,43,85,.94));color:#fff";
    var label = document.createElement("span");
    label.className = "lbl";
    label.style.color = "#BFE4FA";
    label.textContent = t.category;
    var heading = document.createElement("h2");
    heading.textContent = t.title;
    var description = document.createElement("p");
    description.textContent = t.description;
    description.style.color = "#D8E1EA";
    var author = document.createElement("p");
    author.className = "muted";
    author.textContent = t.author;
    author.style.color = "#BFE4FA";
    var link = document.createElement("a");
    link.className = "btn go";
    link.href = "sami-ai-evolution.html";
    link.textContent = t.read;
    card.append(label, heading, description, author, link);

    var grid = root.querySelector(".ac-grid, .dgrid, .grid");
    if (grid) grid.prepend(card);
    else root.prepend(card);
  }

  render();
  document.addEventListener("DOMContentLoaded", render, { once: true });
  new MutationObserver(function () { render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  new MutationObserver(function () { render(); }).observe(root, { childList: true, subtree: true });
})();
