(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const burger = document.querySelector('.burger');
  const setMenu = open => { document.body.classList.toggle('menu-open', open); burger && burger.setAttribute('aria-expanded', String(open)); burger && (burger.textContent = open ? 'Close' : 'Menu'); };
  burger && burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  const hdr = document.querySelector('.hdr');
  const onS = () => hdr && hdr.classList.toggle('scrolled', scrollY > 8); addEventListener('scroll', onS, {passive:true}); onS();
  window.reveal = () => {
    const els = document.querySelectorAll('[data-reveal]:not(.in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -6% 0px'});
    els.forEach((e, i) => { e.style.transitionDelay = (i % 3) * .08 + 's'; io.observe(e); });
  };
  if (window.Lenis && !reduce) {
    const lenis = new Lenis({lerp:.1}); window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
})();
