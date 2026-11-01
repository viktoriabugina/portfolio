/* Skog Studio — motion layer. One big moment: the hero photo shrinks into a frame.
   Without GSAP the page is a plain, readable scroll. */
(function () {
  'use strict';
  var menu = document.querySelector('[data-menu]'), overlay = document.querySelector('[data-overlay]');
  function setMenu(open) { overlay.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', open); menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  menu.addEventListener('click', function () { setMenu(!overlay.classList.contains('is-open')); });
  overlay.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var label = document.querySelector('[data-label]');
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
    document.querySelectorAll('.reveal .w').forEach(function (w) { w.style.opacity = 1; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function initLabels() {
  // current-section label in the pill
    function setLabel(t) { if (label && label.textContent !== t) label.textContent = t; }
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom 40%', onToggle: function (s) { if (s.isActive) setLabel('Home'); } });
    document.querySelectorAll('[data-section]').forEach(function (s) {
      ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: function (st) { if (st.isActive) setLabel(s.dataset.section); } });
    });
  }

  // counters
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', o = { v: 0 };
    if (reduce) { el.textContent = end + suf; return; }
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () {
      gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v) + suf; } });
    } });
  });

  // word-by-word reveal tied to scroll
  var rev = document.querySelector('[data-reveal]');
  if (rev) {
    var words = rev.textContent.trim().split(/\s+/);
    rev.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    if (reduce) rev.querySelectorAll('.w').forEach(function (w) { w.style.opacity = 1; });
    else gsap.to(rev.querySelectorAll('.w'), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: rev, start: 'top 78%', end: 'bottom 42%', scrub: .4 } });
  }

  if (reduce) { initLabels(); return; }

  // intro: words rise, photo settles
  var img = document.querySelector('[data-img]');
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from(img, { scale: 1.25, duration: 2.2 }, 0)
    .from('[data-title] em', { yPercent: 110, duration: 1.4, stagger: .14 }, .25)
    .from('[data-sub], [data-scroll], .hero__top', { opacity: 0, y: 16, duration: 1, stagger: .12 }, 1)
    .add(function () { document.querySelectorAll('[data-title] span').forEach(function (s) { s.style.overflow = 'visible'; }); }, 1.9);

  // THE moment: pinned hero, photo shrinks into a rounded frame, words drift apart
  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () { hero({ x: '26vw', y: '17svh' }, 22); },
    '(max-width: 767.98px)': function () { hero({ x: '9vw', y: '22svh' }, 18); }
  });
  function hero(inset, radius) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=140%', pin: true, scrub: .7 } });
    tl.to('[data-media]', { clipPath: 'inset(' + inset.y + ' ' + inset.x + ' ' + inset.y + ' ' + inset.x + ' round ' + radius + 'px)', ease: 'power2.inOut', duration: 1 }, 0)
      .to(img, { scale: 1.02, ease: 'none', duration: 1 }, 0)
      .to('[data-title] span:nth-child(1) em', { xPercent: -4, ease: 'none', duration: 1 }, 0)
      .to('[data-title] span:nth-child(3) em', { xPercent: 4, ease: 'none', duration: 1 }, 0)
      .to('[data-title] span:nth-child(2) em', { opacity: .15, ease: 'none', duration: 1 }, 0)
      .to('[data-sub], [data-scroll]', { opacity: 0, duration: .3 }, 0)
      .to('.hero__top', { opacity: 0, duration: .3 }, .6);
  }

  // slow drift of the showroom photo
  var par = document.querySelector('[data-parallax]');
  if (par) gsap.fromTo(par, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '[data-frame]', start: 'top bottom', end: 'bottom top', scrub: .5 } });

  // (houses gallery below)
  // horizontal houses gallery (desktop), native swipe on phones
  ScrollTrigger.matchMedia({ '(min-width: 768px)': function () {
    var track = document.querySelector('[data-track]');
    if (!track) return;
    var dist = function () { return track.scrollWidth - innerWidth + 40; };
    gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.houses', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
  } });
  initLabels();
  ScrollTrigger.refresh();
})();
