(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 15 16 5l12 10v12H4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 27v-8h8v8" fill="none" stroke="#B88A4A" stroke-width="2.2"/></svg>';
  document.querySelectorAll('[data-logo]').forEach(el => el.insertAdjacentHTML('afterbegin', LOGO));

  const burger = document.querySelector('.burger');
  const setMenu = open => { document.body.classList.toggle('menu-open', open); burger && burger.setAttribute('aria-expanded', String(open)); };
  burger && burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  const hdr = document.querySelector('.hdr');
  const onS = () => hdr && hdr.classList.toggle('scrolled', scrollY > 8); addEventListener('scroll', onS, {passive:true}); onS();

  window.reveal = root => {
    const els = (root || document).querySelectorAll('[data-reveal]:not(.in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -6% 0px'});
    els.forEach((e, i) => { e.style.transitionDelay = (i % 3) * 0.08 + 's'; io.observe(e); });
  };

  // simple validated forms
  document.querySelectorAll('form[data-validate]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    f.querySelectorAll('[required]').forEach(inp => {
      const fld = inp.closest('.field'), m = fld.querySelector('.msg'); let msg = '';
      if (!inp.value.trim()) msg = 'Fill in this field.';
      else if (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value)) msg = 'Enter an email like name@mail.com.';
      else if (inp.type === 'tel' && inp.value.replace(/\D/g, '').length < 9) msg = 'Enter a phone number with the country code.';
      fld.classList.toggle('err', !!msg); if (m) m.textContent = msg; if (msg) ok = false;
    });
    if (!ok) { f.querySelector('.err [required]').focus(); return; }
    f.querySelector('.note-ok').classList.add('on');
    f.querySelector('button[type=submit]').textContent = 'Request sent';
  }));

  if (window.Lenis && !reduce) {
    const lenis = new Lenis({lerp:.1}); window.__lenis = lenis;
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
})();
