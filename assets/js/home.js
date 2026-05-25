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

    var ticking = false;
    function update() {
      var rect = hero.getBoundingClientRect();
      // Only animate while hero is on screen
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        ticking = false;
        return;
      }
      var scrolled = Math.min(Math.max(-rect.top, 0), hero.offsetHeight);
      var translateY = scrolled * 0.5;
      bg.style.transform = 'translate3d(0, ' + translateY + 'px, 0)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }
})();
