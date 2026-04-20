(function () {
  'use strict';

  // Equal-height columns
  document.addEventListener('DOMContentLoaded', function () {
    var ehArray = [];
    var ehArray2 = [];

    document.querySelectorAll('.equal-height').forEach(function (el) {
      if (el.querySelector('.equal-height')) {
        ehArray2.push(el);
      } else {
        ehArray.push(el);
      }
    });

    for (var i = ehArray2.length - 1; i >= 0; i--) {
      ehArray.push(ehArray2[i]);
    }

    var equalHeight = function () {
      for (var i = 0; i < ehArray.length; i++) {
        var container = ehArray[i];
        var cols = Array.from(container.children).filter(function (child) {
          return child.classList.contains('col');
        });
        var maxHeight = 0;
        var equalChildHeight = container.classList.contains('equal-height-child');

        // reset min-height
        cols.forEach(function (col) {
          if (equalChildHeight) {
            var firstChild = col.children[0];
            if (firstChild) firstChild.style.minHeight = '0px';
          } else {
            col.style.minHeight = '0px';
          }
        });

        cols.forEach(function (col) {
          var h;
          if (equalChildHeight) {
            var firstChild = col.children[0];
            h = firstChild ? firstChild.getBoundingClientRect().height : 0;
          } else {
            h = col.getBoundingClientRect().height;
          }
          if (h > maxHeight) maxHeight = h;
        });

        cols.forEach(function (col) {
          if (equalChildHeight) {
            var firstChild = col.children[0];
            if (firstChild) firstChild.style.minHeight = (maxHeight + 1) + 'px';
          } else {
            col.style.minHeight = (maxHeight + 1) + 'px';
          }
        });
      }
    };

    equalHeight();

    // Use ResizeObserver if available, otherwise fall back to setInterval
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        equalHeight();
      });
      document.querySelectorAll('.equal-height > .col').forEach(function (col) {
        ro.observe(col);
      });
    } else {
      // Fallback: monitor column size changes
      var colSizes = new Map();
      document.querySelectorAll('.equal-height > .col').forEach(function (col) {
        colSizes.set(col, { width: col.offsetWidth, height: col.getBoundingClientRect().height });
      });
      setInterval(function () {
        var changed = false;
        colSizes.forEach(function (size, col) {
          var w = col.offsetWidth;
          var h = col.getBoundingClientRect().height;
          if (size.width !== w || size.height !== h) {
            changed = true;
          }
        });
        if (changed) {
          equalHeight();
          colSizes.forEach(function (size, col) {
            size.width = col.offsetWidth;
            size.height = col.getBoundingClientRect().height;
          });
        }
      }, 500);
    }
  });

  // Inview animations via IntersectionObserver
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('.enable-effect')) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ja-inview');
        }
      });
    }, { threshold: 0 });

    document.querySelectorAll('.t3-section-wrap > div, .t3-hero').forEach(function (el) {
      observer.observe(el);
    });
  });
})();
