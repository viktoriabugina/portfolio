(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  window.REDUCE = reduce;

  // smooth scroll
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({lerp:.1}); window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

  // mobile menu (stops smooth scroll behind it)
  const burger = document.querySelector('.burger');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', String(open)); burger.textContent = open ? 'Close' : 'Menu'; }
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger && burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  matchMedia('(min-width:900px)').addEventListener('change', e => e.matches && setMenu(false));

  const hdr = document.querySelector('.hdr');
  const onS = () => hdr && hdr.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onS, {passive:true}); onS();

  // the two ink layers drift out of register with the cursor
  const inked = document.querySelectorAll('.inked[data-follow]');
  if (inked.length && fine && !reduce) {
    addEventListener('pointermove', e => {
      const x = (e.clientX / innerWidth - .5) * 2, y = (e.clientY / innerHeight - .5) * 2;
      inked.forEach(el => { el.style.setProperty('--mx', (6 + x * 14).toFixed(1) + 'px'); el.style.setProperty('--my', (4 + y * 10).toFixed(1) + 'px'); });
    }, {passive:true});
  }

  // entrance for blocks marked data-in: shown by default, animated only when JS + motion are available
  window.inView = (sel, opts) => {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.utils.toArray(sel).forEach((el, i) => gsap.from(el, Object.assign({y:40, opacity:0, duration:.9, ease:'power3.out', delay:(i % 3) * .06, clearProps:'opacity,transform',
      scrollTrigger:{trigger:el, start:'top 92%', once:true}}, opts || {})));
  };

  window.esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
})();
