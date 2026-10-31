/* Kettle & Ember — motion layer.
   Parallax, a draggable slider, scroll-linked process. Degrades to a plain page. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var track = document.querySelector('[data-track]');
  var viewport = document.querySelector('[data-viewport]');
  var rail = document.querySelector('[data-rail]');
  var prev = document.querySelector('[data-prev]');
  var next = document.querySelector('[data-next]');

  /* ---------- fallback: no GSAP, everything static but readable ---------- */
  if (!hasGsap) {
    document.querySelectorAll('.menu li').forEach(function (el) { el.style.opacity = 1; });
    document.querySelectorAll('.stage').forEach(function (el) {
      el.style.position = 'relative'; el.style.opacity = 1; el.style.marginBottom = '40px';
    });
    if (viewport) { viewport.style.overflowX = 'auto'; viewport.style.cursor = 'auto'; }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.Draggable) gsap.registerPlugin(Draggable);

  /* ================= slider =================
     Drag or arrows; snaps to each card. Works with reduced motion too,
     it just moves without the easing flourish. */
  var index = 0;

  function step() {
    if (!slides[1]) return slides[0] ? slides[0].offsetWidth : 0;
    return slides[1].offsetLeft - slides[0].offsetLeft;
  }
  function maxIndex() {
    if (!track || !viewport) return 0;
    var hidden = Math.max(0, track.scrollWidth - viewport.clientWidth);
    return step() ? Math.min(slides.length - 1, Math.round(hidden / step())) : 0;
  }
  function goTo(i, instant) {
    index = Math.max(0, Math.min(maxIndex(), i));
    gsap.to(track, { x: -index * step(), duration: instant || reduce ? 0 : .8, ease: 'power3.out', overwrite: true });
    if (rail) gsap.to(rail, { scaleX: (index + 1) / (maxIndex() + 1), duration: .5, ease: 'power3.out' });
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === maxIndex();
  }

  if (track && viewport) {
    if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
    if (next) next.addEventListener('click', function () { goTo(index + 1); });

    if (window.Draggable) {
      Draggable.create(track, {
        type: 'x',
        inertia: false,
        bounds: { minX: function () { return -maxIndex() * step(); }, maxX: 0 },
        onDragEnd: function () {
          // snap to whichever card the drag landed nearest
          goTo(Math.round(-this.x / step()));
        }
      });
    }
    window.addEventListener('resize', function () { goTo(index, true); });
    goTo(0, true);
  }

  /* ---------- menu rows and process stages still need to be visible ---------- */
  function revealStatic() {
    document.querySelectorAll('.hero h1 .w, .menu li').forEach(function (el) { el.style.opacity = 1; });
    document.querySelectorAll('.stage').forEach(function (el, i) {
      if (i === 0) el.style.opacity = 1;
      else { el.style.position = 'relative'; el.style.opacity = 1; el.style.marginBottom = '34px'; }
    });
  }
  if (reduce) { revealStatic(); return; }

  /* ================= hero ================= */
  gsap.set('.hero h1 .w', { opacity: 1 });
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.hero h1 .w', { yPercent: 112, duration: 1.15, stagger: .07 }, .1)
    .from('.hero__eyebrow, .hero__sub, .hero__cta', { y: 26, opacity: 0, duration: .9, stagger: .1 }, .55)
    .from('.shot__frame', { yPercent: 14, opacity: 0, duration: 1.3, clipPath: 'inset(100% 0 0 0)' }, .3)
    .from('.shot__chip', { y: 24, opacity: 0, duration: .7 }, 1.1);

  /* ---------- parallax: three layers at three speeds ---------- */
  // 1. the photo drifts inside its frame
  gsap.to('.shot__frame img', {
    yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .4 }
  });
  // 2. the frame itself lags behind the text
  gsap.to('.shot', {
    yPercent: 9, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 }
  });
  // 3. the copy leaves a touch faster, and fades
  gsap.to('.hero__copy', {
    yPercent: -16, opacity: .25, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
  });

  // hero photo leans a few degrees toward the pointer
  if (fine) {
    var shot = document.querySelector('.shot');
    if (shot) {
      gsap.set(shot, { transformPerspective: 1200 });
      var ry = gsap.quickTo(shot, 'rotationY', { duration: 1, ease: 'power3' });
      var rx = gsap.quickTo(shot, 'rotationX', { duration: 1, ease: 'power3' });
      window.addEventListener('pointermove', function (e) {
        ry(((e.clientX / window.innerWidth) - .5) * 9);
        rx(-((e.clientY / window.innerHeight) - .5) * 6);
      }, { passive: true });
    }
  }

  /* ================= menu ================= */
  ScrollTrigger.batch('.menu li', {
    start: 'top 86%', once: true,
    onEnter: function (b) { gsap.fromTo(b, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .1 }); }
  });

  /* ================= pinned process =================
     Three stages crossfade with their photos as the section is held in place. */
  var stages = gsap.utils.toArray('[data-stage]');
  var shots = gsap.utils.toArray('[data-stage-img]');
  if (stages.length) {
    gsap.set(stages[0], { opacity: 1 });
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.process', start: 'top top', end: '+=190%', pin: true, scrub: .6,
        onUpdate: function (self) {
          gsap.to('[data-bar]', { scaleX: self.progress, duration: .2, overwrite: true });
          var active = Math.min(shots.length - 1, Math.floor(self.progress * shots.length));
          shots.forEach(function (img, i) { img.classList.toggle('is-on', i === active); });
        }
      }
    });
    stages.forEach(function (s, i) {
      if (i === 0) return;
      tl.to(stages[i - 1], { opacity: 0, y: -28, duration: 1 }, i - .5)
        .fromTo(s, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1 }, i - .5);
    });
    // the photo creeps as the stages change, so the panel never feels frozen
    tl.fromTo('.process__art', { scale: 1.06 }, { scale: 1, ease: 'none', duration: stages.length }, 0);
  }

  /* ================= quote and slider ================= */
  gsap.from('[data-lines]', {
    yPercent: 24, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.quote', start: 'top 80%', once: true }
  });
  gsap.from('.slide', {
    y: 40, opacity: 0, duration: .8, ease: 'power3.out', stagger: .1,
    scrollTrigger: { trigger: '.slider', start: 'top 78%', once: true }
  });

  /* ================= magnetic buttons ================= */
  if (fine) {
    document.querySelectorAll('.btn, .arrow').forEach(function (el) {
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
