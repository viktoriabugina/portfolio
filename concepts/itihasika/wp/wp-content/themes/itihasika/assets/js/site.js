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
    const inp = f.querySelector('input[type=email]'), msg = f.querySelector('.msg'), btn = f.querySelector('button');
    if (!/^\S+@\S+\.\S+$/.test(inp.value.trim())) { msg.textContent = 'Enter an email like name@family.com.'; inp.focus(); return; }
    if (!window.ITIHASIKA) return;
    const body = new FormData(f); body.append('action', 'itihasika_join'); body.append('nonce', ITIHASIKA.nonce);
    btn.disabled = true;
    fetch(ITIHASIKA.ajax, {method:'POST', body, credentials:'same-origin'})
      .then(r => r.json()).then(r => {
        msg.textContent = (r.data && r.data.message) || '';
        if (r.success) { btn.textContent = btn.dataset.done || 'Sent'; inp.value = ''; } else { btn.disabled = false; inp.focus(); }
      }).catch(() => { msg.textContent = 'Something went wrong. Please try again.'; btn.disabled = false; });
  }));


  // rails: dots for the swipe sliders (tablet and phone)
  document.querySelectorAll('.rail, [data-dots]').forEach(r => {
    const d = r.dataset.dots ? document.getElementById(r.dataset.dots) : r.nextElementSibling; if (!d || !d.classList.contains('dots')) return;
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
// background videos stay still for people who turn motion off; the trailer plays in place
(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('video[autoplay]').forEach(v => { if (rm.matches) { v.removeAttribute('autoplay'); v.pause(); } });
  document.querySelectorAll('.trailer').forEach(t => {
    const v = t.querySelector('video'), b = t.querySelector('.btn'); if (!v || !b) return;
    b.addEventListener('click', () => { t.classList.add('playing'); v.controls = true; v.play(); });
    v.addEventListener('ended', () => { t.classList.remove('playing'); v.controls = false; v.load(); });
  });
})();
// hero background and the tablet under "Why Itihasika": make sure the clips really play on phones
// (iOS can hold back autoplay until the page is touched), and rest them while off-screen
(() => {
  const clips = [...document.querySelectorAll('.hero__bg video, .why__screen')];
  if (!clips.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const kick = v => { v.muted = true; v.defaultMuted = true; v.setAttribute('playsinline', ''); const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const seen = new Set();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { seen.add(e.target); kick(e.target); } else { seen.delete(e.target); e.target.pause(); }
  }), {threshold: .15}) : null;
  clips.forEach(v => { v.preload = 'auto'; io ? io.observe(v) : kick(v); });
  const retry = () => clips.forEach(v => { if (v.paused && (!io || seen.has(v))) kick(v); });
  ['touchstart', 'pointerdown', 'scroll', 'keydown'].forEach(t => addEventListener(t, retry, {once: true, passive: true}));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) retry(); });
})();
// "Buy" on tablet and phone: a bottom sheet with the book's stores, one more tap to Amazon
(() => {
  const btns = document.querySelectorAll('.bk__btn'); if (!btns.length || !window.HTMLDialogElement) return;
  const d = document.createElement('dialog'); d.className = 'buy-sheet'; d.setAttribute('aria-labelledby', 'buySheetTitle');
  d.innerHTML = '<div class="buy-sheet__in"><span class="buy-sheet__grip" aria-hidden="true"></span><div class="buy-sheet__hd"><img alt=""><div><b id="buySheetTitle"></b><small>Choose where to buy</small></div><button type="button" class="buy-sheet__x" aria-label="Close">×</button></div><div class="stores"></div></div>';
  document.body.appendChild(d);
  const close = () => { d.classList.remove('show'); setTimeout(() => d.open && d.close(), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300); };
  d.querySelector('.buy-sheet__x').addEventListener('click', close);
  d.addEventListener('click', e => { if (e.target === d) close(); });
  d.addEventListener('cancel', e => { e.preventDefault(); close(); });
  btns.forEach(b => b.addEventListener('click', e => {
    const card = b.closest('.bk'), st = card && card.querySelector('.stores'); if (!st) return;
    e.preventDefault();
    d.querySelector('#buySheetTitle').textContent = card.querySelector('h3').textContent.trim();
    const im = card.querySelector('.bk__cover img'); d.querySelector('.buy-sheet__hd img').src = im ? im.currentSrc || im.src : '';
    d.querySelector('.stores').innerHTML = st.innerHTML;
    d.showModal(); requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('show')));
  }));
})();
