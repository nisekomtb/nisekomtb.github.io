(function () {
  'use strict';

  var T3Menu = function (elm, options) {
    this.menu = elm;
    if (!this.menu) return;

    this.options = Object.assign({}, T3Menu.defaults, options);
    this.child_open = [];
    this.loaded = false;

    this.start();
  };

  T3Menu.defaults = {
    duration: 400,
    timeout: 100,
    hidedelay: 200,
    hover: true,
    sb_width: 20,
    rtl: false
  };

  T3Menu.prototype = {
    constructor: T3Menu,

    start: function () {
      if (this.loaded) return;
      this.loaded = true;

      var self = this;
      var options = this.options;
      var menu = this.menu;

      this.items = menu.querySelectorAll('li');
      this.items.forEach(function (li) {
        var child = li.querySelector(':scope > .dropdown-menu');
        var link = li.querySelector(':scope > a');
        var item = {
          el: li,
          child: !!child,
          link: !!link,
          clickable: !(link && child),
          mega: li.classList.contains('mega'),
          status: 'close',
          timer: null,
          atimer: null,
          astimer: null,
          ftimer: null,
          ctimer: null
        };

        // Store item data on the element
        li._t3menuItem = item;

        // Click action
        if (child && !options.hover) {
          li.addEventListener('click', function (e) {
            e.stopPropagation();
            if (li.classList.contains('group')) return;
            if (item.status === 'close') {
              e.preventDefault();
              self.show(item);
            }
          });
        } else {
          li.addEventListener('click', function (e) {
            if (e.target.dataset && e.target.dataset.toggle) return;
            e.stopPropagation();
          });
        }

        // Click on caret, no action on link
        li.querySelectorAll('a > .caret').forEach(function (caret) {
          caret.addEventListener('click', function () {
            item.clickable = false;
          });
        });

        if (options.hover) {
          li.addEventListener('mouseover', function (e) {
            if (li.classList.contains('group')) return;

            // Check and handle only once
            if (e.target._showProcessed) return;
            e.target._showProcessed = true;
            setTimeout(function () { e.target._showProcessed = false; }, 10);

            self.show(item);
          });

          li.addEventListener('mouseleave', function (e) {
            if (li.classList.contains('group')) return;

            if (e.target._hideProcessed) return;
            e.target._hideProcessed = true;
            setTimeout(function () { e.target._hideProcessed = false; }, 10);

            self.hide(item, e.target);
          });

          // If has child, don't go to link before open child - fix for touch
          if (link && child) {
            link.addEventListener('click', function (e) {
              if (item.clickable) {
                e.stopPropagation();
              }
              return item.clickable;
            });
          }
        }
      });

      // Hide all on body click/tap
      document.body.addEventListener('click', function (e) {
        clearTimeout(self.timer);
        self.timer = setTimeout(self.hide_alls.bind(self), 500);
      });

      document.body.addEventListener('hideall.t3menu', function (e) {
        clearTimeout(self.timer);
        self.timer = setTimeout(self.hide_alls.bind(self, e), self.options.hidedelay);
      });

      // Ignore click on direct child
      menu.querySelectorAll('.mega-dropdown-menu').forEach(function (el) {
        el.addEventListener('hideall.t3menu', function (e) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        });
      });

      // Prevent close menu if click on form element
      menu.querySelectorAll('input, select, textarea, label').forEach(function (el) {
        el.addEventListener('click', function (e) { e.stopPropagation(); });
      });

      // Update mega-tab height
      var megatabs = menu.querySelectorAll('.mega-tab');
      megatabs.forEach(function (megatab) {
        var tabul = megatab.querySelector(':scope > div > ul');
        if (!tabul) return;
        var tabItems = Array.from(tabul.children).filter(function (c) {
          return c.classList.contains('dropdown-submenu');
        });
        var tabs = tabul.querySelectorAll(':scope > li > .dropdown-menu');
        var tabheight = 0;
        var parentItem = megatab.closest('li');

        // Mark items as tab-items
        tabItems.forEach(function (ti) { ti._megaTabItem = true; });

        // Add tabs to parent item
        if (!parentItem._megaTabs) parentItem._megaTabs = [];
        parentItem._megaTabs.push(tabul);

        // Default active the first
        if (tabItems.length) {
          tabItems[0]._megaTabActive = true;
          tabItems[0].classList.add('open');
        }

        // Make all parents visible to get height
        var parents = [];
        var p = tabul.closest('.dropdown-menu');
        while (p) {
          parents.push({ el: p, prevStyle: p.getAttribute('style') });
          p.style.visibility = 'visible';
          p.style.display = 'block';
          p = p.parentElement ? p.parentElement.closest('.dropdown-menu') : null;
        }

        tabs.forEach(function (tab) {
          var prevStyle = tab.getAttribute('style');
          tab.style.visibility = 'hidden';
          tab.style.display = 'block';
          var firstChild = tab.children[0];
          if (firstChild) {
            tabheight = Math.max(tabheight, firstChild.getBoundingClientRect().height);
          }
          if (prevStyle) tab.setAttribute('style', prevStyle);
          else tab.removeAttribute('style');
        });

        tabul.style.minHeight = tabheight + 'px';

        // Restore parents
        parents.forEach(function (obj) {
          if (obj.prevStyle) obj.el.setAttribute('style', obj.prevStyle);
          else obj.el.removeAttribute('style');
        });
      });

      // Fix for modal in menu
      menu.querySelectorAll('.modal').forEach(function (modal) {
        document.body.appendChild(modal);
      });
    },

    show: function (item) {
      var self = this;

      // Check if current item is mega-tab
      if (item.el._megaTabItem) {
        Array.from(item.el.parentNode.children).forEach(function (sibling) {
          sibling.classList.remove('open');
          sibling._megaTabActive = false;
        });
        item.el.classList.add('open');
        item.el._megaTabActive = true;
      }

      // Hide all others menu of this instance
      if (this.child_open.indexOf(item) < this.child_open.length - 1) {
        this.hide_others(item);
      }

      // Hide all for other instances
      var event = new CustomEvent('hideall.t3menu', { bubbles: true, detail: { instance: this } });
      document.body.dispatchEvent(event);

      clearTimeout(this.timer);
      clearTimeout(item.timer);
      clearTimeout(item.ftimer);
      clearTimeout(item.ctimer);

      if (item.status !== 'open' || !item.el.classList.contains('open') || !this.child_open.length) {
        if (item.mega) {
          clearTimeout(item.astimer);
          clearTimeout(item.atimer);

          this.position(item.el);

          item.astimer = setTimeout(function () {
            item.el.classList.add('animating');
          }, 10);
          item.atimer = setTimeout(function () {
            item.el.classList.remove('animating');
          }, this.options.duration + 50);
          item.timer = setTimeout(function () {
            item.el.classList.add('open');
          }, 100);
        } else {
          item.el.classList.add('open');
        }

        item.status = 'open';
        if (item.child && this.child_open.indexOf(item) === -1) {
          this.child_open.push(item);
        }
      }

      item.ctimer = setTimeout(this.clickable.bind(this, item), 300);
    },

    hide: function (item, target) {
      clearTimeout(this.timer);
      clearTimeout(item.timer);
      clearTimeout(item.astimer);
      clearTimeout(item.atimer);
      clearTimeout(item.ftimer);

      if (target && target.matches && target.matches('input')) return;

      if (item.mega) {
        item.el.classList.add('animating');
        item.atimer = setTimeout(function () {
          item.el.classList.remove('animating');
        }, this.options.duration);
        item.timer = setTimeout(function () {
          if (!item.el._megaTabActive) item.el.classList.remove('open');
        }, 100);
      } else {
        item.timer = setTimeout(function () {
          if (!item.el._megaTabActive) item.el.classList.remove('open');
        }, 100);
      }

      item.status = 'close';
      for (var i = this.child_open.length; i--;) {
        if (this.child_open[i] === item) {
          this.child_open.splice(i, 1);
        }
      }

      item.ftimer = setTimeout(this.hidden.bind(this, item), this.options.duration);
      this.timer = setTimeout(this.hide_alls.bind(this), this.options.hidedelay);
    },

    hidden: function (item) {
      if (item.status === 'close') {
        item.clickable = false;
      }
    },

    hide_others: function (item) {
      var self = this;
      this.child_open.slice().forEach(function (open) {
        if (!item || (open !== item && !open.el.contains(item.el))) {
          self.hide(open);
        }
      });
    },

    hide_alls: function (e) {
      if (!e || e.type === 'click' || (e.type === 'hideall' && e.detail && e.detail.instance !== this)) {
        var self = this;
        this.child_open.slice().forEach(function (item) {
          if (item) self.hide(item);
        });
      }
    },

    clickable: function (item) {
      item.clickable = true;
    },

    position: function (itemEl) {
      var sub = itemEl.querySelector(':scope > .mega-dropdown-menu');
      if (!sub) return;

      var is_show = sub.offsetParent !== null;

      if (!is_show) sub.style.display = 'block';

      var rect = itemEl.getBoundingClientRect();
      var offset = { left: rect.left + window.pageXOffset, top: rect.top + window.pageYOffset };
      var width = itemEl.offsetWidth;
      var screen_width = window.innerWidth - this.options.sb_width;
      var sub_width = sub.offsetWidth;
      var level = itemEl.dataset.level;

      if (!is_show) sub.style.display = '';

      // Reset custom align
      sub.style.left = '';
      sub.style.right = '';

      if (level == 1) {
        var align = itemEl.dataset.alignsub;
        var align_offset = 0;
        var align_delta = 0;
        var align_trans = 0;

        if (align === 'justify') return;
        if (!align) align = 'left';

        if (align === 'center') {
          align_offset = offset.left + (width / 2);
          if (!window.T3Support || !window.T3Support.t3transform) {
            align_trans = -sub_width / 2;
            sub.style[this.options.rtl ? 'right' : 'left'] = (align_trans + width / 2) + 'px';
          }
        } else {
          align_offset = offset.left + ((align === 'left' && this.options.rtl || align === 'right' && !this.options.rtl) ? width : 0);
        }

        if (this.options.rtl) {
          if (align === 'right') {
            if (align_offset + sub_width > screen_width) {
              align_delta = screen_width - align_offset - sub_width;
              sub.style.left = align_delta + 'px';
              if (screen_width < sub_width) {
                sub.style.left = (align_delta + sub_width - screen_width) + 'px';
              }
            }
          } else {
            if (align_offset < (align === 'center' ? sub_width / 2 : sub_width)) {
              align_delta = align_offset - (align === 'center' ? sub_width / 2 : sub_width);
              sub.style.right = (align_delta + align_trans) + 'px';
            }
            if (align_offset + (align === 'center' ? sub_width / 2 : 0) - align_delta > screen_width) {
              sub.style.right = (align_offset + (align === 'center' ? (sub_width + width) / 2 : 0) + align_trans - screen_width) + 'px';
            }
          }
        } else {
          if (align === 'right') {
            if (align_offset < sub_width) {
              align_delta = align_offset - sub_width;
              sub.style.right = align_delta + 'px';
              if (sub_width > screen_width) {
                sub.style.right = (sub_width - screen_width + align_delta) + 'px';
              }
            }
          } else {
            if (align_offset + (align === 'center' ? sub_width / 2 : sub_width) > screen_width) {
              align_delta = screen_width - align_offset - (align === 'center' ? sub_width / 2 : sub_width);
              sub.style.left = (align_delta + align_trans) + 'px';
            }
            if (align_offset - (align === 'center' ? sub_width / 2 : 0) + align_delta < 0) {
              sub.style.left = ((align === 'center' ? (sub_width + width) / 2 : 0) + align_trans - align_offset) + 'px';
            }
          }
        }
      } else {
        // Sub-level positioning
        if (this.options.rtl) {
          var parentMenu = itemEl.closest('.mega-dropdown-menu');
          if (parentMenu && parentMenu.parentElement && parentMenu.parentElement.classList.contains('mega-align-right')) {
            if (offset.left + width + sub_width > screen_width) {
              itemEl.classList.remove('mega-align-right');
              if (offset.left - sub_width < 0) {
                sub.style.right = (offset.left + width - sub_width) + 'px';
              }
            }
          } else {
            if (offset.left - sub_width < 0) {
              itemEl.classList.remove('mega-align-left');
              itemEl.classList.add('mega-align-right');
              if (offset.left + width + sub_width > screen_width) {
                sub.style.left = (screen_width - offset.left - sub_width) + 'px';
              }
            }
          }
        } else {
          var parentMenu = itemEl.closest('.mega-dropdown-menu');
          if (parentMenu && parentMenu.parentElement && parentMenu.parentElement.classList.contains('mega-align-right')) {
            if (offset.left - sub_width < 0) {
              itemEl.classList.remove('mega-align-right');
              if (offset.left + width + sub_width > screen_width) {
                sub.style.left = (screen_width - offset.left - sub_width) + 'px';
              }
            }
          } else {
            if (offset.left + width + sub_width > screen_width) {
              itemEl.classList.remove('mega-align-left');
              itemEl.classList.add('mega-align-right');
              if (offset.left - sub_width < 0) {
                sub.style.right = (offset.left + width - sub_width) + 'px';
              }
            }
          }
        }
      }
    }
  };

  // Init function for a nav element
  function initT3Menu(el, options) {
    // Ignore off-canvas navigation
    if (el.closest('#off-canvas-nav') || el.closest('#t3-off-canvas')) return;
    if (el._t3menuData) return;
    el._t3menuData = new T3Menu(el, options);
  }

  // Apply script
  document.addEventListener('DOMContentLoaded', function () {
    // Detect settings
    var megamenu = document.querySelector('.t3-megamenu');
    var mm_duration = megamenu ? (parseInt(megamenu.dataset.duration, 10) || 0) : 0;

    if (mm_duration) {
      var style = document.createElement('style');
      style.textContent =
        '.t3-megamenu.animate .animating > .mega-dropdown-menu,' +
        '.t3-megamenu.animate.slide .animating > .mega-dropdown-menu > div {' +
        'transition-duration: ' + mm_duration + 'ms !important;' +
        '-webkit-transition-duration: ' + mm_duration + 'ms !important;' +
        '}';
      document.head.appendChild(style);
    }

    var mm_timeout = mm_duration ? 100 + mm_duration : 500;
    var mm_rtl = document.documentElement.getAttribute('dir') === 'rtl';
    var mm_trigger = document.documentElement.classList.contains('mm-hover');

    // Calculate scrollbar width
    var sb_width = (function () {
      var parent = document.createElement('div');
      parent.style.cssText = 'width:50px;height:50px;overflow:auto';
      var child = document.createElement('div');
      parent.appendChild(child);
      document.body.appendChild(parent);
      var w1 = child.offsetWidth;
      child.style.height = '100px';
      var w2 = child.offsetWidth;
      var width = w1 - w2;
      document.body.removeChild(parent);
      return width;
    })();

    var menuOptions = {
      duration: mm_duration,
      timeout: mm_timeout,
      rtl: mm_rtl,
      sb_width: sb_width,
      hover: mm_trigger
    };

    document.querySelectorAll('ul.nav').forEach(function (nav) {
      if (nav.querySelector('.dropdown-menu')) {
        initT3Menu(nav, menuOptions);
      }
    });

    window.addEventListener('load', function () {
      document.querySelectorAll('ul.nav').forEach(function (nav) {
        if (nav.querySelector('.dropdown-menu')) {
          initT3Menu(nav, menuOptions);
        }
      });
    });
  });
})();
