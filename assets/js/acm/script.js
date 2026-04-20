(function () {
  'use strict';

  // Add grayscale image for partners
  window.addEventListener('load', function () {
    document.querySelectorAll('.img-grayscale img').forEach(function (img) {
      var span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.width = img.width + 'px';
      span.style.height = img.height + 'px';

      img.parentNode.insertBefore(span, img);
      span.appendChild(img);

      var clone = img.cloneNode(true);
      clone.classList.add('gotcolors');
      clone.style.position = 'absolute';
      clone.style.opacity = '0';
      clone.style.zIndex = '10';
      clone.style.transition = 'opacity 0.2s';
      span.insertBefore(clone, img);

      // Replace with grayscale version
      img.src = img.src.replace('.png', '.g.png');
      img.style.transition = 'opacity 0.5s';
      img.style.opacity = '0.5';
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.img-grayscale .client-item').forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        var color = item.querySelector('.gotcolors');
        if (color) color.style.opacity = '1';
      });
      item.addEventListener('mouseleave', function () {
        var color = item.querySelector('.gotcolors');
        if (color) color.style.opacity = '0';
      });
    });
  });
})();
