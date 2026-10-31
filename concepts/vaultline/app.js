/* Vaultline — motion layer.
   Everything here is progressive: the page reads fine with no JS and with no GSAP. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- accordion: plain JS, always works ---------- */
  document.querySelectorAll('.qa').forEach(function (item) {
    var btn = item.querySelector('.qa__q');
    var panel = item.querySelector('.qa__a');
    panel.style.transition = 'height .5s cubic-bezier(.22,1,.36,1)';

    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      panel.style.height = open ? panel.scrollHeight + 'px' : '0px';
      if (open && hasGsap && window.ScrollTrigger) {
        setTimeout(function () { ScrollTrigger.refresh(); }, 520);
      }
    });
  });

  /* ---------- sticky nav ---------- */
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- no GSAP: reveal everything, stop here ---------- */
  function showAll() {
    document.querySelectorAll('.hero .w, .step, .shelf__item').forEach(function (el) { el.style.opacity = 1; });
  }
  if (!hasGsap) { showAll(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- counters: run for everyone, just instant when motion is off ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = end.toLocaleString('en-US') + suffix; return; }
    var obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString('en-US') + suffix; }
    });
  });

  if (reduce) { showAll(); return; }

  /* ---------- hero: words rise, cards deal out ---------- */
  gsap.set('.hero .w', { opacity: 1 });

  var cards = gsap.utils.toArray('[data-card]');
  // resting fan: left card back, centre forward, right card back
  var rest = [
    { x: '-52%', y: '-4%', rot: -13, z: -140, s: .9 },
    { x: '0%',   y: '-9%', rot: 0,   z: 60,   s: 1 },
    { x: '52%',  y: '-2%', rot: 13,  z: -140, s: .9 }
  ];

  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro.from('.hero .w', { yPercent: 115, duration: 1.15, stagger: .08 }, .15)
       .from('.hero__eyebrow, .hero__sub, .hero__cta, .hero__meta',
             { y: 26, opacity: 0, duration: .9, stagger: .09 }, .55);

  cards.forEach(function (card, i) {
    var r = rest[i];
    gsap.set(card, { transformPerspective: 1100 });
    intro.fromTo(card,
      { xPercent: -10, yPercent: 40, rotation: 0, z: -400, scale: .7, opacity: 0 },
      { xPercent: parseFloat(r.x), yPercent: parseFloat(r.y), rotation: r.rot, z: r.z,
        scale: r.s, opacity: 1, duration: 1.25, ease: 'power3.out' },
      .35 + i * 0.1);
  });

  /* pointer tilt: the whole fan leans, each card by its own depth */
  var fan = document.querySelector('[data-fan]');
  if (fan && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var setters = cards.map(function (card, i) {
      return {
        rx: gsap.quickTo(card, 'rotationX', { duration: .9, ease: 'power3' }),
        ry: gsap.quickTo(card, 'rotationY', { duration: .9, ease: 'power3' }),
        px: gsap.quickTo(card, 'xPercent', { duration: 1.1, ease: 'power3' }),
        base: parseFloat(rest[i].x),
        depth: parseFloat(card.dataset.depth || 1)
      };
    });
    window.addEventListener('pointermove', function (e) {
      var nx = (e.clientX / window.innerWidth) - .5;
      var ny = (e.clientY / window.innerHeight) - .5;
      setters.forEach(function (s) {
        s.ry(nx * 22 * s.depth);
        s.rx(-ny * 16 * s.depth);
        s.px(s.base + nx * 6 * s.depth);
      });
    }, { passive: true });
  }

  /* card hover lifts that card to the front */
  cards.forEach(function (card, i) {
    card.addEventListener('pointerenter', function () {
      gsap.to(card, { z: 220, scale: rest[i].s + .07, duration: .5, ease: 'power3.out' });
    });
    card.addEventListener('pointerleave', function () {
      gsap.to(card, { z: rest[i].z, scale: rest[i].s, duration: .7, ease: 'power3.out' });
    });
  });

  /* ---------- ghost wordmark drifts against the scroll ---------- */
  gsap.to('[data-ghost]', {
    yPercent: -26, xPercent: -6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
  });

  /* ---------- step cards ---------- */
  ScrollTrigger.batch('.step', {
    start: 'top 86%', once: true,
    onEnter: function (batch) {
      gsap.fromTo(batch, { y: 54, opacity: 0 },
        { y: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .1 });
    }
  });

  /* ---------- shelf: pinned, scrolls sideways ---------- */
  var row = document.querySelector('[data-shelf-row]');
  if (row) {
    gsap.set('.shelf__item', { opacity: 1 });
    var distance = function () { return Math.max(0, row.scrollWidth - window.innerWidth + 48); };
    gsap.to(row, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: '.shelf',
        start: 'top top',
        end: function () { return '+=' + (distance() + window.innerHeight * .6); },
        pin: true,
        scrub: .6,
        invalidateOnRefresh: true
      }
    });
    gsap.from('.shelf__item', {
      y: 70, opacity: 0, duration: .9, ease: 'power3.out', stagger: .09,
      scrollTrigger: { trigger: '.shelf', start: 'top 70%', once: true }
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('[data-magnet]').forEach(function (el) {
      var qx = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
      var qy = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * .34);
        qy((e.clientY - r.top - r.height / 2) * .5);
      });
      el.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  }
})();
