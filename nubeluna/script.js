/* ==========================================================
   NubeLuna — interacciones
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Header al hacer scroll ---------- */
  var header = document.getElementById("header");
  var onScroll = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    highlightNav();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Enlace activo según sección ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll(".nav__link"));
  function highlightNav() {
    var pos = window.scrollY + 140;
    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (!section) return;
      var active = pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight;
      link.classList.toggle("is-active", active);
    });
  }

  /* ---------- Carrusel del hero ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero__slide"));
  var heroDots = document.getElementById("heroDots");
  var heroIndex = 0;
  slides.forEach(function (_, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Imagen " + (i + 1));
    if (i === 0) b.classList.add("is-active");
    b.addEventListener("click", function () { goToSlide(i); resetHero(); });
    heroDots.appendChild(b);
  });
  function goToSlide(i) {
    heroIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-active", k === heroIndex); });
    Array.prototype.forEach.call(heroDots.children, function (d, k) {
      d.classList.toggle("is-active", k === heroIndex);
    });
  }
  var heroTimer = setInterval(function () { goToSlide(heroIndex + 1); }, 5500);
  function resetHero() {
    clearInterval(heroTimer);
    heroTimer = setInterval(function () { goToSlide(heroIndex + 1); }, 5500);
  }

  /* ---------- Carrusel de reseñas ---------- */
  var track = document.getElementById("reviewsTrack");
  var reviewDots = document.getElementById("reviewDots");
  var reviews = track.children.length;
  var rIndex = 0;
  function perView() { return window.innerWidth >= 900 ? 3 : 1; }
  function pages() { return Math.max(1, reviews - perView() + 1); }
  function buildReviewDots() {
    reviewDots.innerHTML = "";
    for (var i = 0; i < pages(); i++) {
      (function (i) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Reseña " + (i + 1));
        if (i === rIndex) b.classList.add("is-active");
        b.addEventListener("click", function () { goToReview(i); });
        reviewDots.appendChild(b);
      })(i);
    }
  }
  function goToReview(i) {
    rIndex = (i + pages()) % pages();
    var card = track.children[0];
    var step = card.getBoundingClientRect().width + (window.innerWidth >= 900 ? 30 : 0);
    track.style.transform = "translateX(" + -step * rIndex + "px)";
    Array.prototype.forEach.call(reviewDots.children, function (d, k) {
      d.classList.toggle("is-active", k === rIndex);
    });
  }
  buildReviewDots();
  setInterval(function () { goToReview(rIndex + 1); }, 6000);
  window.addEventListener("resize", function () { rIndex = 0; buildReviewDots(); goToReview(0); });

  /* ---------- Animaciones al hacer scroll ---------- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () { entry.target.classList.add("is-visible"); }, i * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });

  /* ---------- Año del footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  onScroll();
})();
