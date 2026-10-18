/* Itihasika concept: shared behaviour */
(function(){
  document.documentElement.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // paper grain overlay
  const g = document.createElement('div');
  g.className = 'grain'; g.setAttribute('aria-hidden','true');
  g.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .11  0 0 0 0 .13  0 0 0 0 .25  0 0 0 .09 0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>';
  document.body.appendChild(g);

  // menu
  const burger = document.querySelector('.burger');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger && burger.setAttribute('aria-expanded', String(open));
    burger && burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger && burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // reveal on scroll
  const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {rootMargin:'0px 0px -8% 0px'}) : null;
  document.querySelectorAll('.rv').forEach((el, i) => {
    if (el.dataset.d) el.style.transitionDelay = (+el.dataset.d * .09) + 's';
    io ? io.observe(el) : el.classList.add('in');
  });

  // mailing list form
  document.querySelectorAll('.jform').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const inp = f.querySelector('input'), msg = f.querySelector('.msg');
    if (!/^\S+@\S+\.\S+$/.test(inp.value.trim())) { msg.textContent = 'Enter an email like name@family.com.'; inp.focus(); return; }
    msg.textContent = 'Done. The chart is on its way, check your inbox. (Concept: the form is not connected yet.)';
    f.querySelector('button').textContent = 'Sent';
  }));

  // smooth scroll (optional)
  if (window.Lenis && !reduce) {
    const lenis = new Lenis({lerp:.1});
    window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
  }
})();
