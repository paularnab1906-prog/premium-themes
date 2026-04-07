// Lumina Theme Scripts

(function() {
  'use strict';

  // Cart Drawer / Cart Update
  document.addEventListener('DOMContentLoaded', function() {
    initCartCount();
    initParallax();
  });

  function initCartCount() {
    var cartCountEl = document.querySelector('[data-cart-count]');
    if (!cartCountEl) return;

    window.fetchCartCount = function() {
      fetch('/cart.js')
        .then(function(r) { return r.json(); })
        .then(function(cart) {
          var count = cart.items ? cart.items.length : 0;
          cartCountEl.textContent = count;
          cartCountEl.style.display = count > 0 ? 'flex' : 'none';
        })
        .catch(function() {});
    };

    // Initial fetch
    if (window.fetchCartCount) window.fetchCartCount();
  }

  function initParallax() {
    var els = document.querySelectorAll('[data-enable-parallax]');
    if (!els.length) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var scrollY = window.pageYOffset;
          els.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            var inView = rect.bottom > 0 && rect.top < window.innerHeight;
            if (!inView) return;
            var speed = 0.15;
            var img = el.querySelector('.hero-cinematic__image');
            if (img) {
              img.style.transform = 'scale(1.05) translateY(' + (scrollY * speed) + 'px)';
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Quick Add to Cart (AJAX)
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.product-card__quick-add');
    if (!btn) return;

    e.preventDefault();
    var productId = btn.dataset.productId;
    if (!productId) return;

    var formData = {
      items: [{ id: parseInt(productId), quantity: 1 }]
    };

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(function(r) { return r.json(); })
    .then(function() {
      btn.textContent = 'Added!';
      btn.style.backgroundColor = 'var(--color-accent)';
      if (window.fetchCartCount) window.fetchCartCount();
      setTimeout(function() {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg><span>Quick Add</span>';
        btn.style.backgroundColor = '';
      }, 2000);
    })
    .catch(function(err) {
      btn.textContent = 'Error';
      setTimeout(function() {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg><span>Quick Add</span>';
      }, 2000);
    });
  });

  // Intersection Observer for scroll-driven animations
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate], [data-animate-fade], [data-animate-scale]').forEach(function(el) {
      observer.observe(el);
    });
  }

})();
