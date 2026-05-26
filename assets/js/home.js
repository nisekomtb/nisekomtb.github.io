/* Home page JS. Loaded only on / and /ja/.
 * Implements: hero video fade-in, scroll-cue, count-up numbers,
 * network scroll-scrub, intersection-observer-driven fade-ups.
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
    initHeroVideo();
    initHeroCue();
    initFadeUps();
    initNetworkScrub();
    initCountUps();
  }

  function initHeroVideo() {
    var hero = document.querySelector('.home-hero');
    var iframe = hero && hero.querySelector('.home-hero-video');
    if (!hero || !iframe) return;
    if (prefersReducedMotion) return;
    iframe.addEventListener('load', function () {
      hero.classList.add('video-ready');
    }, { once: true });
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

  function initNetworkScrub() {
    var section = document.querySelector('.home-network');
    if (!section) return;
    var images = section.querySelectorAll('.home-network-img');
    var rows = section.querySelectorAll('.home-network-row');
    var spineFill = section.querySelector('.home-network-spine-fill');
    if (images.length === 0) return;

    var years = section.dataset.years.split(',');
    var currentIdx = -1;

    function setYear(idx) {
      if (idx < 0) idx = 0;
      if (idx >= years.length) idx = years.length - 1;
      if (idx === currentIdx) return;
      images.forEach(function (img, i) {
        if (i === idx) img.setAttribute('data-active', 'true');
        else img.removeAttribute('data-active');
      });
      rows.forEach(function (row, i) {
        if (i < idx) row.setAttribute('data-state', 'passed');
        else if (i === idx) row.setAttribute('data-state', 'current');
        else row.removeAttribute('data-state');
      });
      currentIdx = idx;
    }

    /* Mobile and reduced-motion: render in final state (all rows revealed,
       2026 image active). CSS un-sticks the section so it scrolls naturally. */
    if (prefersReducedMotion || isMobile) {
      // For mobile we want to highlight 2026 as current.
      setYear(years.length - 1);
      rows.forEach(function (row) { row.setAttribute('data-state', 'passed'); });
      rows[rows.length - 1].setAttribute('data-state', 'current');
      if (spineFill) spineFill.style.height = '100%';
      return;
    }

    // Desktop: scroll-tied scrub.
    var sectionTop = 0;
    var sectionHeight = 0;
    var viewportHeight = window.innerHeight;
    var spineHeight = 0;
    var nubOffsets = []; // y-position of each nub relative to the spine top
    var spine = section.querySelector('.home-network-spine');

    function measure() {
      var rect = section.getBoundingClientRect();
      var scrollY = window.scrollY || window.pageYOffset || 0;
      sectionTop = rect.top + scrollY;
      sectionHeight = section.offsetHeight;
      viewportHeight = window.innerHeight;
      if (spine) {
        var spineRect = spine.getBoundingClientRect();
        spineHeight = spineRect.height;
        nubOffsets = [];
        rows.forEach(function (row) {
          var nub = row.querySelector('.home-network-nub');
          if (!nub) { nubOffsets.push(0); return; }
          var nubRect = nub.getBoundingClientRect();
          nubOffsets.push((nubRect.top + nubRect.height / 2) - spineRect.top);
        });
      }
    }

    var ticking = false;
    function update() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var relativeScroll = scrollY - sectionTop;
      var scrollableRange = Math.max(1, sectionHeight - viewportHeight);
      var progress = Math.min(Math.max(relativeScroll / scrollableRange, 0), 1);

      // Dot travels from nub[0] at progress=0 to nub[last] at progress=1.
      // Interpolate between adjacent nubs so the dot lands exactly on each.
      var nubFloat = progress * (years.length - 1);
      var idx = Math.round(nubFloat);
      if (idx >= years.length) idx = years.length - 1;
      setYear(idx);

      if (spineFill && spineHeight > 0 && nubOffsets.length === years.length) {
        var floorI = Math.min(Math.floor(nubFloat), years.length - 2);
        var frac = nubFloat - floorI;
        var dotY = nubOffsets[floorI] + (nubOffsets[floorI + 1] - nubOffsets[floorI]) * frac;
        spineFill.style.height = (dotY / spineHeight * 100) + '%';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

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
      var prefix = stat.dataset.prefix || '';
      var suffix = stat.dataset.suffix || '';
      var v = stat.querySelector('.value');
      if (v) v.textContent = prefix + formatNumber(target) + suffix;
    }

    // Reserve the final string width on .value so digits don't shift
    // the layout during the count-up animation.
    function lockWidth(stat) {
      var target = parseFloat(stat.dataset.target || '0');
      var prefix = stat.dataset.prefix || '';
      var suffix = stat.dataset.suffix || '';
      var v = stat.querySelector('.value');
      if (!v) return;
      var finalStr = prefix + formatNumber(target) + suffix;
      v.style.minWidth = finalStr.length + 'ch';
    }
    stats.forEach(lockWidth);

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      stats.forEach(finalValue);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var stat = entry.target;
        var target = parseFloat(stat.dataset.target || '0');
        var prefix = stat.dataset.prefix || '';
        var suffix = stat.dataset.suffix || '';
        var v = stat.querySelector('.value');
        if (!v) return;
        var duration = 1800;
        var start = performance.now();
        function tick(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
          var current = target * eased;
          // Suffix held back until the end so intermediate frames don't
          // read as wrong units (e.g. "100M+" mid-count-up to 196M+).
          v.textContent = prefix + formatNumber(current) + (t < 1 ? '': suffix);
          if (t < 1) requestAnimationFrame(tick);
          else v.textContent = prefix + formatNumber(target) + suffix;
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
