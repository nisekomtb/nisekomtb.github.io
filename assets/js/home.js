/* Home page JS. Loaded only on / and /ja/.
 * Implements: simple parallax, count-up numbers, network scrub,
 * intersection-observer-driven fade-ups.
 * Honors prefers-reduced-motion. */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia &&
    window.matchMedia('(max-width: 767px)').matches;

  // Sections fill in their initialisers below.

  // Initialise on DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initHeroParallax();
  }

  function initHeroParallax() {
    if (prefersReducedMotion || isMobile) return;
    var bg = document.querySelector('.home-hero-bg');
    var hero = document.querySelector('.home-hero');
    if (!bg || !hero) return;

    // Cache hero height to avoid layout-flushing reads per frame.
    var heroHeight = hero.offsetHeight;
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset || 0;
      if (y > heroHeight) { ticking = false; return; }
      var scrolled = Math.min(Math.max(y, 0), heroHeight);
      bg.style.transform = 'translate3d(0, ' + (scrolled * 0.5) + 'px, 0)';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Recompute cached height on resize (debounced via rAF).
    var resizeTicking = false;
    window.addEventListener('resize', function () {
      if (resizeTicking) return;
      resizeTicking = true;
      window.requestAnimationFrame(function () {
        heroHeight = hero.offsetHeight;
        resizeTicking = false;
      });
    }, { passive: true });

    update();
  }
})();
