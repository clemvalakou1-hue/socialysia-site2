'use strict';
(() => {
  const quote = document.querySelector('.approche .bourdieu-quote');
  if (!quote || !('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    quote.classList.add('quote-arrived');
    observer.disconnect();
  }, { rootMargin: '0px 0px -16% 0px' });
  observer.observe(quote.querySelector('.word-reveal') || quote);
})();
