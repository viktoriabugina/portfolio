'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Work filter
  const buttons = document.querySelectorAll('.tabs__btn');
  const works = document.querySelectorAll('.work');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
    works.forEach((w) => w.classList.toggle('is-hidden', btn.dataset.filter !== 'all' && w.dataset.type !== btn.dataset.filter));
  }));

  // Reveal on scroll
  const els = document.querySelectorAll('.work, .service, .process li, .about__text, .section__title');
  if ('IntersectionObserver' in window) {
    els.forEach((el) => el.setAttribute('data-reveal', ''));
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    }), { threshold: 0.15 });
    els.forEach((el) => io.observe(el));

    // Hero skills stack — one staggered reveal, not a running line
    const stack = document.querySelector('[data-reveal-stack]');
    if (stack) {
      const stackIo = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); stackIo.unobserve(en.target); }
      }), { threshold: 0.3 });
      stackIo.observe(stack);
    }
  }

  // Header hides on scroll down, reappears on scroll up (skip near the very top)
  const header = document.querySelector('.header');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 160) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  document.getElementById('year').textContent = new Date().getFullYear();
});
