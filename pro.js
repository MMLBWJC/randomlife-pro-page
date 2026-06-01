const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 2533;
const MIN_VIEWPORT_WIDTH = 1280;
const page = document.getElementById("pro-page");
const revealItems = Array.from(document.querySelectorAll(".fade-rise:not(.load-rise)"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function fitPage() {
  const layoutWidth = Math.max(window.innerWidth, MIN_VIEWPORT_WIDTH);
  const scale = layoutWidth / DESIGN_WIDTH;
  page.style.setProperty("--scale", scale.toString());
  page.style.minHeight = `${DESIGN_HEIGHT * scale}px`;
}

window.addEventListener("resize", fitPage);
fitPage();

function revealAll() {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function setupScrollReveal() {
  if (prefersReducedMotion.matches) {
    revealAll();
    return;
  }

  const revealVisibleItems = () => {
    const triggerLine = window.innerHeight * 0.88;
    const isNearPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible")) {
        return;
      }

      const rect = item.getBoundingClientRect();

      if ((rect.top <= triggerLine || isNearPageEnd) && rect.bottom >= 0) {
        item.classList.add("is-visible");
      }
    });

    if (revealItems.every((item) => item.classList.contains("is-visible"))) {
      window.clearInterval(revealTimer);
    }
  };

  const revealTimer = window.setInterval(revealVisibleItems, 250);
  window.addEventListener("scroll", revealVisibleItems, { passive: true });
  window.addEventListener("resize", revealVisibleItems);
  window.addEventListener("load", revealVisibleItems);
  revealVisibleItems();
  window.setTimeout(revealVisibleItems, 120);
}

setupScrollReveal();

function setupHeroCarousel() {
  const carousel = document.querySelector("[data-carousel]");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const dots = Array.from(carousel.querySelectorAll(".carousel-dots button"));
  const prevButton = carousel.querySelector(".carousel-arrow.prev");
  const nextButton = carousel.querySelector(".carousel-arrow.next");
  const intervalTime = 4200;
  let currentIndex = 0;
  let timer = 0;
  let transitionId = 0;

  const showSlide = (nextIndex) => {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;

    if (normalizedIndex === currentIndex) {
      return;
    }

    transitionId += 1;
    const activeTransition = transitionId;
    const previousSlide = slides[currentIndex];
    const nextSlide = slides[normalizedIndex];

    slides.forEach((slide, index) => {
      if (index !== currentIndex && index !== normalizedIndex) {
        slide.classList.remove("is-active", "is-entering");
      }
    });

    dots[currentIndex].classList.remove("is-active");

    currentIndex = normalizedIndex;
    nextSlide.classList.remove("is-entering");
    void nextSlide.offsetWidth;
    nextSlide.classList.add("is-active", "is-entering");
    dots[currentIndex].classList.add("is-active");

    const finishTransition = () => {
      if (activeTransition !== transitionId) {
        return;
      }

      previousSlide.classList.remove("is-active");
      nextSlide.classList.remove("is-entering");
    };

    nextSlide.addEventListener("animationend", finishTransition, { once: true });
    window.setTimeout(finishTransition, 900);
  };

  const restartAutoplay = () => {
    window.clearInterval(timer);

    if (!prefersReducedMotion.matches) {
      timer = window.setInterval(() => showSlide(currentIndex + 1), intervalTime);
    }
  };

  prevButton.addEventListener("click", () => {
    showSlide(currentIndex - 1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    restartAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      restartAutoplay();
    });
  });

  restartAutoplay();
}

setupHeroCarousel();
