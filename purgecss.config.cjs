// Build-time CSS pruning config. Operates on _site (build output) ONLY — the
// source CSS under assets/css/ is never touched. See _scripts/purge-css.sh for
// the fail-safe wrapper that validates and moves pruned output into place.
//
// SAFELIST is load-bearing: a static pruner cannot see classes added at runtime
// (Ecwid storefront, Bootstrap JS components, our nav/animation toggles, Splide,
// PhotoSwipe, Trailforks). Anything here is kept regardless of static usage.
module.exports = {
  content: ['_site/**/*.html', 'assets/js/**/*.js'],
  css: [
    '_site/assets/css/template.css',
    '_site/assets/css/megamenu.css',
    '_site/assets/css/mobile-nav.css',
    '_site/assets/css/home.css',
    '_site/assets/css/bootstrap.min.css',
  ],
  output: '_site/.purged/',
  // Conservative: never strip keyframes, @font-face, or CSS variables — they are
  // easy to use indirectly (JS-added classes, var() refs) and cheap to keep.
  keyframes: false,
  fontFace: false,
  variables: false,
  safelist: {
    standard: [
      // our nav + scroll-animation runtime toggles (added by t3.js/menu.js/
      // mobile-nav.js/script.js, not present in static HTML in their active state)
      'in', 'ja-inview', 'ja-animate', 'video-ready', 'animating', 'noscroll',
      'open', 'group', 'mega', 'mega-align-left', 'mega-align-right', 'mm-hover',
      'mobile-nav-open', 'mobile-nav-current', 'dropdown-submenu',
    ],
    greedy: [
      // Ecwid storefront (injected at runtime by Ecwid's remote JS)
      /ecwid/, /^ec-/, /ec_/,
      // Bootstrap JS component states
      /^modal/, /^carousel/, /^dropdown/, /^dropup$/, /^dropend$/, /^dropstart$/,
      /^collapse/, /^collapsing$/, /^offcanvas/, /^tooltip/, /^bs-tooltip/,
      /^popover/, /^fade$/, /^show$/, /^showing$/, /^hiding$/, /^active$/,
      /^disabled$/, /^slide/,
      // Splide carousel, PhotoSwipe lightbox, Trailforks widgets
      /^splide/, /^is-/, /^pswp/, /^TrailforksWidget/, /^tf-/,
    ],
  },
};
