(function () {
  'use strict';

  // Touch detection
  document.documentElement.classList.add('ontouchstart' in window ? 'touch' : 'no-touch');

  // CSS transform support (used by menu positioning)
  var support = {};
  (function () {
    var style = document.createElement('div').style;
    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];
    for (var i = 0; i < vendors.length; i++) {
      var transform = vendors[i] + 'ransform';
      if (transform in style) {
        support.t3transform = transform;
        break;
      }
    }
    if (!support.t3transform) support.t3transform = false;
  })();

  window.T3Support = support;
})();
