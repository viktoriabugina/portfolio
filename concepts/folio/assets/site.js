(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.REDUCE = reduce;

  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({lerp:.1}); window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

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

  // gentle entrance for blocks; content stays visible without JS or with reduced motion
  window.inView = (sel, opts) => {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.utils.toArray(sel).forEach((el, i) => gsap.from(el, Object.assign({y:36, opacity:0, duration:.9, ease:'power3.out', delay:(i % 3) * .07, clearProps:'opacity,transform',
      scrollTrigger:{trigger:el, start:'top 92%', once:true}}, opts || {})));
  };
  // headline lines rise in
  window.riseIn = sel => { if (!reduce && window.gsap) gsap.from(sel, {yPercent:105, duration:1.1, stagger:.09, ease:'expo.out', delay:.1}); };

  window.esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
})();
