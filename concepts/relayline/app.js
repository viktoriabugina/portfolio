/* Relayline — motion layer.
   Progressive: the page reads fine with no JS and with no GSAP. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- sticky nav ---------- */
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 30); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- cursor glow inside feature cards (CSS vars, no GSAP needed) ---------- */
  if (fine) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  function showAll() {
    document.querySelectorAll('.hero .w, .feat, .stat, .log__row').forEach(function (el) { el.style.opacity = 1; });
  }
  if (!hasGsap) { showAll(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- counters ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var whole = end >= 100;
    if (reduce) { el.textContent = (whole ? end.toLocaleString('en-US') : end) + suffix; return; }
    var obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: function () {
        el.textContent = (whole ? Math.round(obj.v).toLocaleString('en-US') : obj.v.toFixed(1)) + suffix;
      }
    });
  });

  if (reduce) { showAll(); return; }

  /* ---------- aurora: ribbons drift and breathe, forever ---------- */
  gsap.utils.toArray('[data-ribbon]').forEach(function (path, i) {
    gsap.to(path, {
      attr: { 'stroke-width': 40 + i * 30 },
      duration: 7 + i * 2, ease: 'sine.inOut', yoyo: true, repeat: -1
    });
    gsap.to(path, {
      xPercent: i % 2 ? 5 : -5, yPercent: i % 2 ? -4 : 5,
      duration: 11 + i * 3, ease: 'sine.inOut', yoyo: true, repeat: -1
    });
  });
  // the whole light field slides as you scroll past the hero
  gsap.to('.aurora', {
    yPercent: 16, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
  });

  /* ---------- hero intro ---------- */
  gsap.set('.hero .w', { opacity: 1 });
  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro.from('.hero__kicker', { y: 16, opacity: 0, duration: .7 }, .1)
       .from('.hero .w', { yPercent: 112, duration: 1.1, stagger: .045 }, .2)
       .from('.hero__sub, .hero__cta', { y: 22, opacity: 0, duration: .85, stagger: .1 }, .7)
       .from('[data-frame]', { y: 70, opacity: 0, scale: .97, duration: 1.2 }, .8)
       .fromTo('.log__row', { opacity: 0, x: -18 },
               { opacity: 1, x: 0, duration: .5, stagger: .11, ease: 'power2.out' }, 1.25);

  /* mockup tips toward the pointer, and straightens as it scrolls away */
  var frame = document.querySelector('[data-frame]');
  if (frame) {
    gsap.set(frame, { transformPerspective: 1400, rotateX: 8 });
    gsap.to(frame, {
      rotateX: 0, ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top 85%', end: 'top 35%', scrub: .5 }
    });
    // the court photo drifts behind the slot list
    gsap.fromTo('.frame__photo', { yPercent: -8, scale: 1.12 }, {
      yPercent: 8, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: .6 }
    });
    if (fine) {
      var ry = gsap.quickTo(frame, 'rotateY', { duration: .9, ease: 'power3' });
      window.addEventListener('pointermove', function (e) {
        ry(((e.clientX / window.innerWidth) - .5) * 7);
      }, { passive: true });
    }
  }

  /* ---------- customer names fade up once ---------- */
  gsap.from('.strip__row li', {
    y: 14, opacity: 0, duration: .7, ease: 'power3.out', stagger: .07,
    scrollTrigger: { trigger: '.strip', start: 'top 92%', once: true }
  });

  /* ---------- feature cards ---------- */
  ScrollTrigger.batch('.feat', {
    start: 'top 86%', once: true,
    onEnter: function (b) { gsap.fromTo(b, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .11 }); }
  });

  /* ---------- isometric chart grows from the baseline ---------- */
  gsap.utils.toArray('[data-bar]').forEach(function (bar, i) {
    gsap.fromTo(bar, { scaleY: 0, opacity: .25 }, {
      scaleY: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: i * .08,
      scrollTrigger: { trigger: '.chart', start: 'top 82%', once: true }
    });
  });
  gsap.fromTo('.stat', { y: 26, opacity: 0 }, {
    y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1,
    scrollTrigger: { trigger: '.stats', start: 'top 90%', once: true }
  });

  /* ---------- the lime block rises and squares off as it enters ---------- */
  gsap.fromTo('[data-cta]',
    { yPercent: 8, scale: .94, borderRadius: '60px' },
    { yPercent: 0, scale: 1, borderRadius: '18px', ease: 'none',
      scrollTrigger: { trigger: '[data-cta]', start: 'top 95%', end: 'top 45%', scrub: .6 } });

  /* ---------- magnetic buttons ---------- */
  if (fine) {
    document.querySelectorAll('[data-magnet]').forEach(function (el) {
      var qx = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
      var qy = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * .3);
        qy((e.clientY - r.top - r.height / 2) * .45);
      });
      el.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  }
})();
