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
    initHeroCue();
    initFadeUps();
    initNetworkScrub();
    initCountUps();
  }

  function initHeroCue() {
    var cue = document.getElementById('home-hero-cue');
    if (!cue) return;
    cue.addEventListener('click', function () {
      var hero = document.querySelector('.home-hero');
      var next = hero ? hero.offsetHeight : 0;
      var behavior = prefersReducedMotion ? 'auto' : 'smooth';
      window.scrollTo({ top: next, behavior: behavior });
    });
  }

  function initFadeUps() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
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
        update();
        resizeTicking = false;
      });
    }, { passive: true });

    update();
  }

  function initNetworkScrub() {
    var section = document.querySelector('.home-network');
    if (!section) return;
    var images = section.querySelectorAll('.home-network-img');
    var captions = section.querySelectorAll('.home-network-caption');
    var tabs = section.querySelectorAll('.home-network-tab');
    var badge = section.querySelector('.home-network-year-badge');
    if (images.length === 0) return;

    var years = section.dataset.years.split(',');
    var current = 0;

    function setYear(idx) {
      if (idx < 0) idx = 0;
      if (idx >= years.length) idx = years.length - 1;
      if (idx === current) return;
      images.forEach(function (img, i) {
        if (i === idx) img.setAttribute('data-active', 'true');
        else img.removeAttribute('data-active');
      });
      captions.forEach(function (cap, i) {
        if (i === idx) cap.setAttribute('data-active', 'true');
        else cap.removeAttribute('data-active');
      });
      tabs.forEach(function (tab, i) {
        if (i === idx) {
          tab.setAttribute('data-active', 'true');
          tab.setAttribute('aria-pressed', 'true');
        } else {
          tab.removeAttribute('data-active');
          tab.setAttribute('aria-pressed', 'false');
        }
      });
      if (badge) badge.textContent = years[idx];
      current = idx;
    }

    // Tab clicks (mobile + accessible)
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { setYear(i); });
    });

    if (prefersReducedMotion || isMobile) return;

    // Desktop: scroll-tied scrub.
    // Cache section dimensions to avoid layout-flushing reads per frame.
    var sectionTop = 0;
    var sectionHeight = 0;
    var viewportHeight = window.innerHeight;

    function measure() {
      var rect = section.getBoundingClientRect();
      var scrollY = window.scrollY || window.pageYOffset || 0;
      sectionTop = rect.top + scrollY;
      sectionHeight = section.offsetHeight;
      viewportHeight = window.innerHeight;
    }

    var ticking = false;
    function update() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var relativeScroll = scrollY - sectionTop;
      var scrollableRange = Math.max(1, sectionHeight - viewportHeight);
      var progress = Math.min(Math.max(relativeScroll / scrollableRange, 0), 1);
      var idx = Math.floor(progress * years.length);
      if (idx >= years.length) idx = years.length - 1;
      setYear(idx);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Recompute on resize (debounced via rAF).
    var resizeTicking = false;
    window.addEventListener('resize', function () {
      if (resizeTicking) return;
      resizeTicking = true;
      window.requestAnimationFrame(function () {
        measure();
        update();
        resizeTicking = false;
      });
    }, { passive: true });

    measure();
    update();
  }

  function initCountUps() {
    var stats = document.querySelectorAll('.home-impact-stat');
    if (stats.length === 0) return;

    function finalValue(stat) {
      var target = parseFloat(stat.dataset.target || '0');
      var suffix = stat.dataset.suffix || '';
      var v = stat.querySelector('.value');
      if (v) v.textContent = formatNumber(target) + suffix;
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      stats.forEach(finalValue);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var stat = entry.target;
        var target = parseFloat(stat.dataset.target || '0');
        var suffix = stat.dataset.suffix || '';
        var v = stat.querySelector('.value');
        if (!v) return;
        var duration = 1200;
        var start = performance.now();
        function tick(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
          var current = target * eased;
          v.textContent = formatNumber(current) + (t < 1 ? '': suffix);
          if (t < 1) requestAnimationFrame(tick);
          else v.textContent = formatNumber(target) + suffix;
        }
        requestAnimationFrame(tick);
        io.unobserve(stat);
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { io.observe(s); });
  }

  function formatNumber(n) {
    if (n >= 1000) return Math.round(n).toLocaleString();
    if (Number.isInteger(n)) return String(Math.round(n));
    return Math.round(n).toString();
  }
})();
