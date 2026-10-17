'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ----- Sticky header shadow -----
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ----- Mobile menu -----
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const toggleMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => toggleMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

  // ----- Tabs -----
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const buttons = tabs.querySelectorAll('.tabs__btn');
    const panels = tabs.querySelectorAll('.tabs__panel');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.tab);
        buttons.forEach((b, j) => {
          b.classList.toggle('is-active', j === i);
          b.setAttribute('aria-selected', String(j === i));
        });
        panels.forEach((p, j) => p.classList.toggle('is-active', j === i));
      });
    });
  });

  // ----- Pricing toggle -----
  const billing = document.querySelector('[data-billing]');
  if (billing) {
    const sw = billing.querySelector('.toggle__switch');
    const labels = billing.querySelectorAll('.toggle__label');
    const amounts = document.querySelectorAll('.plan__amount');
    sw.addEventListener('click', () => {
      const yearly = sw.getAttribute('aria-pressed') !== 'true';
      sw.setAttribute('aria-pressed', String(yearly));
      sw.setAttribute('aria-label', yearly ? 'Switch to monthly billing' : 'Switch to yearly billing');
      labels.forEach((l) => l.classList.toggle('is-active', (l.dataset.period === 'yearly') === yearly));
      amounts.forEach((a) => {
        const value = Number(yearly ? a.dataset.yearly : a.dataset.monthly);
        a.textContent = '$' + (Number.isInteger(value) ? value : value.toFixed(1));
      });
    });
  }

  // ----- Accordion: keep one open -----
  const items = document.querySelectorAll('.accordion__item');
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) items.forEach((other) => { if (other !== item) other.open = false; });
    });
  });

  // ----- Form validation -----
  const form = document.getElementById('signup');
  if (form) {
    const input = form.querySelector('input[type="email"]');
    const error = form.querySelector('.form__error');
    const success = form.querySelector('.form__success');
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const validate = () => {
      const v = input.value.trim();
      let msg = '';
      if (!v) msg = 'Please enter your work email';
      else if (!isEmail(v)) msg = 'This email doesn’t look right';
      error.textContent = msg;
      input.classList.toggle('is-invalid', Boolean(msg));
      return !msg;
    };
    input.addEventListener('input', () => { if (input.classList.contains('is-invalid')) validate(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) { input.focus(); return; }
      success.hidden = false;
      form.reset();
    });
  }

  // ----- Reveal on scroll -----
  const revealEls = document.querySelectorAll('.section__head, .feature, .plan, .tabs, .quote, .accordion, .cta');
  if ('IntersectionObserver' in window) {
    revealEls.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  }
});
