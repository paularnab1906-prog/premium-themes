// Vertex Theme Scripts

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initCartCount();
    initQuantityButtons();
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

  function initQuantityButtons() {
    document.querySelectorAll('.qty-btn--minus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var input = this.closest('.product-form-3d__qty').querySelector('input');
        var val = parseInt(input.value) || 1;
        if (val > 1) input.value = val - 1;
      });
    });
    document.querySelectorAll('.qty-btn--plus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var input = this.closest('.product-form-3d__qty').querySelector('input');
        var val = parseInt(input.value) || 1;
        input.value = val + 1;
      });
    });

    document.querySelectorAll('.product-form-3d__option-value').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var name = this.dataset.optionName;
        var value = this.dataset.optionValue;
        var form = this.closest('.product-form-3d');
        form.querySelectorAll('.product-form-3d__option-value').forEach(function(b) {
          if (b.dataset.optionName === name) b.classList.remove('is-selected');
        });
        this.classList.add('is-selected');
      });
    });
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

    document.querySelectorAll('[data-animate], [data-animate-fade], [data-animate-scale], [data-animate-3d]').forEach(function(el) {
      obs.observe(el);
    });
  }

})();
