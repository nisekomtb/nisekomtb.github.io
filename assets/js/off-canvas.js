(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var html = document.documentElement;
    var wrapper = document.body;
    var inner = document.querySelector('.t3-wrapper');
    var toggles = document.querySelectorAll('.off-canvas-toggle');
    var offcanvas = document.querySelector('.t3-off-canvas');
    var closeButtons = document.querySelectorAll('.t3-off-canvas .close');
    var btn = null;
    var nav = null;
    var direction = 'left';
    var fixed = null;
    var JA_isLoading = false;

    if (!wrapper) return;

    // Add effect class for nav
    toggles.forEach(function (toggle) {
      var navSelector = toggle.dataset.nav;
      var navEl = navSelector ? document.querySelector(navSelector) : null;
      var effect = toggle.dataset.effect;
      var isRtl = html.getAttribute('dir') === 'rtl';
      var pos = toggle.dataset.pos;
      var dir = (isRtl && pos !== 'right') || (!isRtl && pos === 'right') ? 'right' : 'left';

      if (navEl) {
        navEl.classList.add(effect);
        navEl.classList.add('off-canvas-' + dir);

        // Move to outside wrapper-content
        var insideEffects = ['off-canvas-effect-3', 'off-canvas-effect-16', 'off-canvas-effect-7', 'off-canvas-effect-8', 'off-canvas-effect-14'];
        if (insideEffects.indexOf(effect) === -1) {
          inner.parentNode.insertBefore(navEl, inner);
        } else {
          inner.insertBefore(navEl, inner.firstChild);
        }
      }
    });

    function stopBubble(e) {
      e.stopPropagation();
    }

    function oc_show() {
      if (JA_isLoading) return;
      JA_isLoading = true;
      wrapper.classList.add('off-canvas-open');
      inner.addEventListener('click', oc_hide);
      closeButtons.forEach(function (btn) { btn.addEventListener('click', oc_hide); });
      if (offcanvas) offcanvas.addEventListener('click', handleClick);

      setTimeout(function () { JA_isLoading = false; }, 200);
    }

    function oc_hide() {
      if (JA_isLoading) return;
      JA_isLoading = true;

      // Remove events
      inner.removeEventListener('click', oc_hide);
      closeButtons.forEach(function (b) { b.removeEventListener('click', oc_hide); });
      if (offcanvas) offcanvas.removeEventListener('click', handleClick);

      // Delay for click action
      setTimeout(function () {
        wrapper.classList.remove('off-canvas-open');
      }, 100);

      setTimeout(function () {
        if (btn) {
          var effect = btn.dataset.effect;
          if (effect) wrapper.classList.remove(effect);
        }
        wrapper.classList.remove('off-canvas-' + direction);
        wrapper.scrollTop = 0;

        // Enable scroll
        html.classList.remove('noscroll');
        html.style.top = '';
        var savedTop = parseInt(html.dataset.top || '0', 10);
        window.scrollTo(0, savedTop);

        if (nav) nav.classList.remove('off-canvas-current');

        // Restore fixed elements
        if (fixed) {
          fixed.forEach(function (el) {
            el.style.position = '';
            el.style.marginTop = '';
          });
        }

        JA_isLoading = false;
      }, 700);
    }

    function handleClick(e) {
      var link = e.target.closest('a');
      if (link) {
        if (!e.target.href) return;
        // Handle anchor link
        var arr1 = e.target.href.split('#');
        var arr2 = location.href.split('#');
        if (arr1[0] === arr2[0] && arr1.length > 1 && arr1[1].length) {
          oc_hide();
          setTimeout(function () {
            var anchor = document.querySelector('a[name="' + arr1[1] + '"]');
            if (!anchor) anchor = document.getElementById(arr1[1]);
            if (anchor) {
              anchor.scrollIntoView({ behavior: 'smooth' });
            }
          }, 1000);
        }
        // Prevent only if anchor same page
        if (e.target.href.search('#') !== -1) return;
      }
      stopBubble(e);
      return true;
    }

    // Find fixed-position elements inside inner
    function findFixed() {
      var all = inner.querySelectorAll('*');
      var result = [];
      all.forEach(function (el) {
        if (getComputedStyle(el).position === 'fixed') {
          result.push(el);
        }
      });
      // Also include .affix elements
      inner.querySelectorAll('.affix').forEach(function (el) {
        if (result.indexOf(el) === -1) result.push(el);
      });
      return result;
    }

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        stopBubble(e);

        if (wrapper.classList.contains('off-canvas-open')) {
          oc_hide(e);
          return false;
        }

        btn = toggle;
        nav = btn.dataset.nav ? document.querySelector(btn.dataset.nav) : null;

        if (!fixed) fixed = findFixed();
        else {
          // Refresh: keep only currently fixed + .affix elements
          fixed = fixed.filter(function (el) {
            return getComputedStyle(el).position === 'fixed';
          });
          inner.querySelectorAll('.affix').forEach(function (el) {
            if (fixed.indexOf(el) === -1) fixed.push(el);
          });
        }

        if (nav) nav.classList.add('off-canvas-current');

        var isRtl = html.getAttribute('dir') === 'rtl';
        var pos = btn.dataset.pos;
        direction = (isRtl && pos !== 'right') || (!isRtl && pos === 'right') ? 'right' : 'left';

        if (offcanvas) offcanvas.style.height = window.innerHeight + 'px';

        // Disable scroll on page
        var scrollTop = html.scrollTop || document.body.scrollTop;
        html.classList.add('noscroll');
        html.style.top = -scrollTop + 'px';
        html.dataset.top = scrollTop;
        if (offcanvas) offcanvas.style.top = scrollTop + 'px';

        // Make fixed elements become absolute
        fixed.forEach(function (el) {
          var parent = el.parentElement;
          while (parent !== inner && getComputedStyle(parent).position === 'static') {
            parent = parent.parentElement;
          }
          var mtop = -parent.getBoundingClientRect().top - window.pageYOffset + (parent.getBoundingClientRect().top + window.pageYOffset) * 0;
          // Calculate offset from parent
          var parentRect = parent.getBoundingClientRect();
          mtop = -(parentRect.top + window.pageYOffset);
          el.style.position = 'absolute';
          el.style.marginTop = mtop + 'px';
        });

        wrapper.scrollTop = scrollTop;

        // Update effect class - remove old off-canvas-effect-* classes
        wrapper.className = wrapper.className.replace(/\s*off-canvas-effect-\d+\s*/g, ' ').trim() +
          ' ' + btn.dataset.effect + ' ' + 'off-canvas-' + direction;

        setTimeout(oc_show, 50);

        return false;
      });
    });

    // Preload fixed items
    window.addEventListener('load', function () {
      setTimeout(function () {
        fixed = findFixed();
      }, 100);
    });
  });
})();
