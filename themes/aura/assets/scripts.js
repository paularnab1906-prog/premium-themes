// Aura Editorial Theme Scripts

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initCartCount();
  });

  function initCartCount() {
    var el = document.querySelector('[data-cart-count]');
    if (!el) return;
    fetch('/cart.js')
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        var count = cart.items ? cart.items.length : 0;
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
      })
      .catch(function() {});
  }

  // Intersection Observer
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate], [data-animate-fade], [data-animate-line]').forEach(function(el) {
      obs.observe(el);
    });
  }

})();
