/* Itihasika concept: shared behaviour */
(function(){
  document.documentElement.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.REDUCE = reduce;

  // smooth scroll
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({lerp:.1}); window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

  // mobile menu
  const burger = document.querySelector('.burger');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger && burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width:1180px)').addEventListener('change', e => e.matches && setMenu(false));

  // header turns solid after the hero starts scrolling
  const hdr = document.querySelector('.hdr');
  const onScroll = () => hdr && hdr.classList.toggle('scrolled', scrollY > 60);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  // expose the header height for sticky bars below it
  const setH = () => hdr && document.documentElement.style.setProperty('--hdr', hdr.offsetHeight + 'px');
  if (hdr && 'ResizeObserver' in window) new ResizeObserver(setH).observe(hdr); setH();

  // reveal on scroll
  const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {rootMargin:'0px 0px -6% 0px'}) : null;
  document.querySelectorAll('.rv').forEach(el => {
    if (el.dataset.d) el.style.transitionDelay = (+el.dataset.d * .09) + 's';
    io ? io.observe(el) : el.classList.add('in');
  });

  // mailing list form
  document.querySelectorAll('.jform').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const inp = f.querySelector('input'), msg = f.querySelector('.msg');
    if (!/^\S+@\S+\.\S+$/.test(inp.value.trim())) { msg.textContent = 'Enter an email like name@family.com.'; inp.focus(); return; }
    msg.textContent = 'Done! The chart is on its way to your inbox. (Concept: the form is not connected yet.)';
    f.querySelector('button').textContent = 'Sent';
  }));


  // rails: dots for the swipe sliders (tablet and phone)
  document.querySelectorAll('.rail').forEach(r => {
    const d = r.nextElementSibling; if (!d || !d.classList.contains('dots')) return;
    const items = [...r.children];
    const padL = () => parseFloat(getComputedStyle(r).paddingLeft) || 0;
    items.forEach((it, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show item ' + (i + 1) + ' of ' + items.length);
      b.addEventListener('click', () => r.scrollTo({left: r.scrollLeft + it.getBoundingClientRect().left - r.getBoundingClientRect().left - padL(), behavior: reduce ? 'auto' : 'smooth'})); d.appendChild(b); });
    const upd = () => { const rl = r.getBoundingClientRect().left + padL(); let best = 0, bd = 1e9;
      items.forEach((it, i) => { const dd = Math.abs(it.getBoundingClientRect().left - rl); if (dd < bd) { bd = dd; best = i; } });
      if (r.scrollLeft + r.clientWidth >= r.scrollWidth - 4) best = items.length - 1;
      [...d.children].forEach((b, i) => b.setAttribute('aria-current', String(i === best))); };
    r.addEventListener('scroll', upd, {passive:true}); addEventListener('resize', upd); upd();
  });


  // plan switch
  document.querySelectorAll('.plan').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    g.querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', String(x === b)));
  })));


  // phone footer: each link group opens like a dropdown
  document.querySelectorAll('.foot__top h4').forEach((h, i) => {
    const ul = h.nextElementSibling; if (!ul) return; ul.id = ul.id || 'foot-links-' + i;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'foot__tog'; b.textContent = h.textContent;
    b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', ul.id); h.textContent = ''; h.appendChild(b);
    b.addEventListener('click', () => { const open = !h.parentElement.classList.contains('open'); h.parentElement.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open)); });
  });

  // hero headline reveal shared by all pages
  if (window.gsap && !reduce) {
    gsap.from('.hero h1 .ln>span', {yPercent:110, duration:1.1, stagger:.1, ease:'expo.out', delay:.1});
    gsap.from('.hero .lead, .hero__cta, .hero .stats', {y:24, opacity:0, duration:.9, stagger:.12, delay:.45, ease:'power3.out'});
    gsap.from('.hdr', {y:-30, opacity:0, duration:.9, ease:'power3.out'});
  }
})();
