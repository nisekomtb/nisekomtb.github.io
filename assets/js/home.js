/* Home page JS. Loaded only on / and /ja/.
 * Implements: hero video fade-in, scroll-cue, count-up numbers,
 * network scroll-scrub, intersection-observer-driven fade-ups.
 * Honours prefers-reduced-motion. */
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
    initFeatureParallax();
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

  /* Section 07: snowsports quote background parallax. As the section
     scrolls through the viewport, the pre-scaled Yotei photo translates
     vertically at ~16% of the section's total visible scroll range.
     The CSS sets transform: scale(1.15) by default so the JS-driven
     translateY has room to move without revealing the section bg.
     iOS Safari ignores background-attachment: fixed, so we do it by
     hand here. Skipped on mobile (small viewports + scroll position
     fidelity) and on reduced-motion. */
  function initFeatureParallax() {
    var section = document.querySelector('.home-feature');
    if (!section || prefersReducedMotion || isMobile) return;
    var img = section.querySelector('.home-feature-bg-img');
    if (!img) return;

    var sectionTop = 0, sectionHeight = 0, vh = window.innerHeight;
    var armed = false, ticking = false;

    function measure() {
      var rect = section.getBoundingClientRect();
      sectionTop = rect.top + (window.scrollY || window.pageYOffset || 0);
      sectionHeight = section.offsetHeight;
      vh = window.innerHeight;
    }

    function update() {
      if (!armed) return;
      var scrollY = window.scrollY || window.pageYOffset || 0;
      /* progress 0 when the section's top edge is just below the
         viewport (about to enter); 1 when the section's bottom edge
         is just above the viewport (just left). Clamped to [0,1]. */
      var range = sectionHeight + vh;
      var progress = (scrollY + vh - sectionTop) / range;
      progress = Math.min(Math.max(progress, 0), 1);
      /* Translate from +8% (down) at entry to -8% (up) at exit.
         16% total travel against the 15% scale headroom keeps edges
         from leaking. */
      var translatePct = (0.5 - progress) * 16;
      img.style.transform = 'scale(1.15) translateY(' + translatePct.toFixed(2) + '%)';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking && armed) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', function () {
      window.requestAnimationFrame(function () { measure(); update(); });
    }, { passive: true });

    measure();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          armed = e.isIntersecting;
          if (armed) update();
        });
      }, { rootMargin: '50px 0px 50px 0px' });
      io.observe(section);
    } else {
      armed = true;
      update();
    }
  }

  function initNetworkScrub() {
    var section = document.querySelector('.home-network');
    if (!section) return;
    var rows = section.querySelectorAll('.home-network-row');
    var spineFill = section.querySelector('.home-network-spine-fill');
    var svg = section.querySelector('.home-network-svg');
    var yearGroups = svg ? svg.querySelectorAll('g[id^="year-"]') : [];

    var years = section.dataset.years.split(',');
    var currentIdx = -1;
    /* Paint is held off until the section first enters the viewport, so
       the 2023 trail draws in as the user arrives rather than completing
       silently while the section is still below the fold. */
    var armed = false;

    /* Prep each SVG path: stash its length, set dasharray to length, start
       with dashoffset = length so the path is fully un-drawn. setYear()
       later transitions dashoffset to 0 to "draw" the trail. */
    if (svg) {
      svg.querySelectorAll('path').forEach(function (path) {
        var len = path.getTotalLength();
        path._pathLength = len;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      });
    }

    /* idx === -1 means "no year drawn" — used when the section is out of
       frame so trails reset to their pre-entry state and animate back
       in cleanly the next time the section enters. */
    function setYear(idx) {
      if (idx >= years.length) idx = years.length - 1;
      if (idx === currentIdx) return;
      var currentYear = idx < 0 ? null : parseInt(years[idx], 10);
      yearGroups.forEach(function (g) {
        var openedYear = parseInt(g.id.replace('year-', ''), 10);
        g.querySelectorAll('path').forEach(function (path) {
          /* A path is drawn when its opening year has passed AND its
             closed-year (if any) has not. data-closed-year on a path
             un-draws it from that year onward, so e.g. Kaikan-Old opens
             with year-2024 and unwinds in 2025 when Kaikan opens. */
          var closedYear = path.dataset.closedYear ? parseInt(path.dataset.closedYear, 10) : Infinity;
          var draw = currentYear !== null && currentYear >= openedYear && currentYear < closedYear;
          path.style.strokeDashoffset = draw ? 0 : path._pathLength;
        });
      });
      rows.forEach(function (row, i) {
        if (idx < 0) row.removeAttribute('data-state');
        else if (i < idx) row.setAttribute('data-state', 'passed');
        else if (i === idx) row.setAttribute('data-state', 'current');
        else row.removeAttribute('data-state');
      });
      currentIdx = idx;
    }

    /* Mobile and reduced-motion: render in final state (all trails drawn,
       2026 row marked current). CSS un-sticks the section so it scrolls
       naturally. */
    if (prefersReducedMotion || isMobile) {
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
      if (!armed) return;
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
    if ('IntersectionObserver' in window) {
      /* rootMargin collapses the intersection root to a 0-height line at
         the viewport top, so the observer fires the moment the section's
         top edge crosses the viewport top — i.e. when the sticky stage
         pins and the satellite map is fully visible.

         We stay subscribed and toggle in both directions: scrolling back
         up past the trigger un-arms and resets the trails, so the entry
         animation replays on re-entry rather than freezing drawn. */
      var armObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            armed = true;
            update();
          } else {
            armed = false;
            setYear(-1);
            if (spineFill) spineFill.style.height = '0%';
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -100% 0px' });
      armObserver.observe(section);
    } else {
      armed = true;
      update();
    }
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
