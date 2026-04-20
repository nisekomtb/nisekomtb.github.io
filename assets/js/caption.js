var JCaption = function (selector) {
  document.querySelectorAll(selector).forEach(function (img) {
    var title = img.getAttribute('title');
    var width = img.getAttribute('width') || img.width;
    var align = img.getAttribute('align') || getComputedStyle(img).float || 'none';
    var className = selector.replace('.', '_');

    var wrapper = document.createElement('div');
    wrapper.className = className + ' ' + align;
    wrapper.style.cssFloat = align;
    wrapper.style.width = width + 'px';

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    if (title) {
      var caption = document.createElement('p');
      caption.className = className;
      caption.textContent = title;
      wrapper.appendChild(caption);
    }
  });
};
