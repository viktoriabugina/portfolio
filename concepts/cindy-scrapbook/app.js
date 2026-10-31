/* Scrapbook concept: one orchestrated hero drop, soft parallax, draggable stickers.
   Everything is visible without JS or GSAP. */
(function () {
  'use strict';
  var toggle = document.querySelector('[data-toggle]'), nav = document.querySelector('[data-nav]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var o = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', o);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false); } });
  }
  document.querySelectorAll('[data-waitlist]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = f.querySelector('[data-msg]'), i = f.querySelector('input');
      m.textContent = i.checkValidity() && i.value ? "you're on the list, first dibs are yours :)" : 'add your email so I can find you :)';
    });
  });
  if (typeof gsap === 'undefined') return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  gsap.registerPlugin(ScrollTrigger); if (window.Draggable) gsap.registerPlugin(Draggable);

  // stickers can be dragged, they just stay where you drop them
  if (window.Draggable) Draggable.create('.topics .sticker', { type: 'x,y', edgeResistance: .6, onPress: function () { gsap.to(this.target, { scale: 1.08, rotation: 0, duration: .2 }); }, onRelease: function () { gsap.to(this.target, { scale: 1, duration: .3 }); } });
  if (reduce) return;

  var h1 = document.querySelector('[data-h1]');
  if (h1) {
    // split text nodes into words without touching child elements
    (function split(el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t.trim()) { f.appendChild(document.createTextNode(t)); return; }
            var o = document.createElement('span'); o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em';
            var i = document.createElement('span'); i.className = 'w'; i.style.display = 'inline-block'; i.textContent = t; o.appendChild(i); f.appendChild(o);
          });
          el.replaceChild(f, n);
        } else if (n.nodeType === 1) split(n);
      });
    })(h1);
  }
  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('[data-h1] .w', { yPercent: 115, duration: 1, stagger: .07 }, .1)
    .from('[data-in]', { y: 22, opacity: 0, duration: .8, stagger: .1 }, .35);
  // one memorable moment: the photos get dropped on the page and taped down
  tl.from('.hero .polaroid--main', { y: -140, rotation: -10, opacity: 0, duration: 1.1, ease: 'back.out(1.5)' }, .3)
    .from('.hero .polaroid--sub', { y: -160, rotation: 14, opacity: 0, duration: 1.1, ease: 'back.out(1.5)' }, .55)
    .from('.hero .stamp', { scale: 0, rotation: -40, duration: .8, ease: 'back.out(2.2)' }, 1.1)
    .from('.hero .star', { scale: 0, rotation: 90, duration: .7, stagger: .15, ease: 'back.out(2)' }, 1.2);
  if (!document.querySelector('.hero')) {
    gsap.from('.polaroid', { y: -60, rotation: -6, opacity: 0, duration: 1, ease: 'back.out(1.4)', delay: .4 });
  }

  // soft parallax: layers drift at different speeds
  document.querySelectorAll('[data-layer]').forEach(function (el, i) {
    gsap.to(el, { yPercent: [-9, 7, -14][i] || -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  });
  var art = document.querySelector('[data-art]');
  if (art && fine) {
    var qx = gsap.quickTo(art, 'x', { duration: 1.2, ease: 'power3' }), qy = gsap.quickTo(art, 'y', { duration: 1.2, ease: 'power3' });
    addEventListener('pointermove', function (e) { qx((e.clientX / innerWidth - .5) * -18); qy((e.clientY / innerHeight - .5) * -12); }, { passive: true });
  }
  // photos straighten a little as they arrive
  gsap.utils.toArray('[data-tilt]').forEach(function (el) {
    gsap.from(el, { rotation: '+=6', y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  ScrollTrigger.batch('[data-guide]', { start: 'top 88%', once: true, onEnter: function (b) { gsap.from(b, { y: 50, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out', clearProps: 'opacity' }); } });
  gsap.from('.topics .sticker', { scale: .6, opacity: 0, duration: .5, stagger: .04, ease: 'back.out(2)', scrollTrigger: { trigger: '.topics', start: 'top 85%', once: true } });
})();
