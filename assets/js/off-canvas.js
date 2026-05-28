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

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        stopBubble(e);

        if (wrapper.classList.contains('off-canvas-open')) {
          oc_hide(e);
          return false;
        }

        btn = toggle;
        nav = btn.dataset.nav ? document.querySelector(btn.dataset.nav) : null;

        if (nav) nav.classList.add('off-canvas-current');

        var isRtl = html.getAttribute('dir') === 'rtl';
        var pos = btn.dataset.pos;
        direction = (isRtl && pos !== 'right') || (!isRtl && pos === 'right') ? 'right' : 'left';

        // Disable scroll on page
        var scrollTop = html.scrollTop || document.body.scrollTop;
        html.classList.add('noscroll');
        html.style.top = -scrollTop + 'px';
        html.dataset.top = scrollTop;

        wrapper.scrollTop = scrollTop;

        // Update effect class - remove old off-canvas-effect-* classes
        wrapper.className = wrapper.className.replace(/\s*off-canvas-effect-\d+\s*/g, ' ').trim() +
          ' ' + btn.dataset.effect + ' ' + 'off-canvas-' + direction;

        setTimeout(oc_show, 50);

        return false;
      });
    });

  });
})();

// ============================================================
// Mobile nav overlay accessibility behaviours.
// Layered on top of the existing open/close handlers. Triggered
// by mutations to the .off-canvas-open class on document.body.
// ============================================================
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.body;
    var panel = document.querySelector('#t3-off-canvas');
    var toggle = document.querySelector('.off-canvas-toggle');
    if (!wrapper || !panel || !toggle) return;

    var lastFocused = null;
    var labelOpen = toggle.getAttribute('aria-label') || 'Open menu';
    var labelOpenJa = 'メニューを開く';
    var labelClose = 'Close menu';
    var labelCloseJa = 'メニューを閉じる';
    var isJa = document.documentElement.lang === 'ja';

    // Focusable elements include all links inside the panel AND the
    // toggle button itself, so keyboard users can Tab from the last
    // link back to the X to close the overlay without leaving the
    // dialog's keyboard scope.
    function getFocusable() {
      var inside = Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled])')
      );
      inside.push(toggle);
      return inside;
    }

    function onOpen() {
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-label', isJa ? labelCloseJa : labelClose);
      lastFocused = document.activeElement;
      var focusable = getFocusable();
      if (focusable.length) {
        // Delay slightly so the entry animation doesn't fight focus.
        setTimeout(function () { focusable[0].focus(); }, 50);
      }
    }

    function onClose() {
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-label', isJa ? labelOpenJa : labelOpen);
      if (lastFocused && lastFocused !== toggle && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      } else {
        toggle.focus();
      }
    }

    // Watch for .off-canvas-open being added/removed on the wrapper.
    // Track previous open state so spurious body-class mutations
    // (the existing IIFE rewrites className during toggle) don't
    // trigger onOpen/onClose redundantly.
    var ocOpen = wrapper.classList.contains('off-canvas-open');
    var observer = new MutationObserver(function () {
      var nowOpen = wrapper.classList.contains('off-canvas-open');
      if (nowOpen === ocOpen) return;
      ocOpen = nowOpen;
      if (nowOpen) {
        onOpen();
      } else {
        onClose();
      }
    });
    observer.observe(wrapper, { attributes: true, attributeFilter: ['class'] });

    // Escape key closes the overlay by triggering the toggle.
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!wrapper.classList.contains('off-canvas-open')) return;
      toggle.click();
    });

    // Focus trap: when Tab would leave the focusable set, wrap.
    // Listens on document because the toggle is outside the panel.
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      if (!wrapper.classList.contains('off-canvas-open')) return;
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      var active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });
  });
})();
