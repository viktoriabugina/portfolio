(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  const root = document.documentElement;
  const isGroup = (el) => {
    if (el.children.length < 2) return false;
    const d = getComputedStyle(el).display;
    return d === 'grid' || d === 'flex' || d === 'inline-flex';
  };
  const targets = [];
  // Hero intro
  const hc = document.querySelector('.hero__content');
  if (hc) [...hc.children].forEach((el, i) => { el.dataset.moIntro = ''; el.style.setProperty('--mo-i', i); });
  const hv = document.querySelector('.hero__visual, .hero__media, .hero__image');
  if (hv) { hv.dataset.moFade = ''; hv.dataset.moPar = ''; }
  // Section reveals
  document.querySelectorAll('.section, .contact').forEach((sec) => {
    const wrap = sec.querySelector(':scope > .container') || sec;
    [...wrap.children].forEach((child) => {
      if (isGroup(child) && !child.matches('.section__head--row')) {
        [...child.children].forEach((c, i) => { c.dataset.moReveal = ''; c.dataset.moCard = ''; c.style.setProperty('--mo-i', Math.min(i, 5)); targets.push(c); });
      } else {
        child.dataset.moReveal = ''; targets.push(child);
      }
    });
  });
  root.classList.add('mo-js');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  targets.forEach((t) => io.observe(t));
  setTimeout(() => targets.forEach((t) => t.classList.add('is-in')), 4000); // safety net
  // Soft parallax on the hero visual
  if (hv) {
    let ticking = false;
    const run = () => { ticking = false; const y = Math.min(scrollY, 700); hv.style.translate = `0 ${(y * -0.06).toFixed(1)}px`; };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  }
})();
