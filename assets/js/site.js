(function () {
  var root = document.documentElement;
  root.classList.add("js");

  function revealCards() {
    var cards = document.querySelectorAll(".post-card");
    if (!cards.length) return;

    if (!("IntersectionObserver" in window)) {
      cards.forEach(function (card) {
        card.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cards.forEach(function (card, index) {
      card.style.setProperty("--reveal-delay", index * 80 + "ms");
      observer.observe(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealCards);
  } else {
    revealCards();
  }
})();
