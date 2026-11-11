(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Carousel ---------- */
  function initCarousel(root) {
    var track = root.querySelector(".carousel__track");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = root.querySelector(".carousel__dots");
    var dots = Array.prototype.slice.call(
      dotsWrap.querySelectorAll(".carousel__dot"),
    );
    var current = 0;

    // Desktop features grid is not a scroller: nothing to do there.
    function isScrollable() {
      return (
        getComputedStyle(track).overflowX !== "visible" &&
        track.scrollWidth > track.clientWidth
      );
    }

    function setActive(index) {
      current = index;
      dots.forEach(function (dot, i) {
        if (i === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function goTo(index) {
      var slide = slides[index];
      // scrollTo on the track only; scrollIntoView would also scroll the page.
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft });
    }

    // 1. Active dot follows the visible slide
    var slideObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(slides.indexOf(entry.target));
        });
      },
      { root: track, threshold: 0.6 },
    );
    slides.forEach(function (slide) {
      slideObserver.observe(slide);
    });

    // 2. Autoplay state. Declared before anything uses it, so restart() is
    // safe on carousels without autoplay (it is a no-op there).
    var delay = parseInt(root.getAttribute("data-autoplay"), 10);
    var autoplay = delay > 0 && !reducedMotion.matches;
    var timer = null;
    var focused = false;
    var touched = false;
    var onScreen = true;

    function canPlay() {
      return (
        !focused && !touched && onScreen && !document.hidden && isScrollable()
      );
    }

    function stop() {
      clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (!canPlay()) return;
      timer = setInterval(function () {
        goTo((current + 1) % slides.length);
      }, delay);
    }

    function restart() {
      if (timer) start();
    }

    // 3. Dot clicks: one delegated listener on the dots container
    dotsWrap.addEventListener("click", function (event) {
      var dot = event.target.closest(".carousel__dot");
      if (!dot) return;
      event.preventDefault();
      if (!isScrollable()) return;
      goTo(dots.indexOf(dot));
      restart();
    });

    // 4. Autoplay pause/resume triggers
    if (!autoplay) return;

    root.addEventListener("focusin", function () {
      focused = true;
      stop();
    });
    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) {
        focused = false;
        start();
      }
    });
    // A touch pauses autoplay for good; the user has taken control.
    root.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "mouse") {
        touched = true;
        stop();
      }
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start();
      else stop();
    }).observe(root);
  }

  function updateScrollState(body) {
    body.parentElement.classList.toggle(
      "is-scrollable",
      body.scrollHeight > body.clientHeight + 1,
    );
  }

  function initScrollCards() {
    var bodies = Array.prototype.slice.call(
      document.querySelectorAll(".feature__body"),
    );
    var refresh = function () {
      bodies.forEach(updateScrollState);
    };

    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(refresh);
      bodies.forEach(function (body) {
        ro.observe(body);
      });
    } else {
      window.addEventListener("resize", refresh);
    }

    // Web fonts change text height once loaded.
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(refresh);
    refresh();
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  initScrollCards();
})();
