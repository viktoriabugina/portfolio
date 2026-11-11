/* Home: the timeline plays through the eras and swaps the statue. */
(function(){
  // Journeys across time: choosing an era swaps the statue
  const img = document.getElementById('era-img');
  const ol = document.getElementById('eras'); if (!img || !ol) return;
  const REDUCE = window.REDUCE || matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the red line grows down to the chosen era; while nobody touches it, the eras play through on their own
  const btns = [...ol.querySelectorAll('button')];
  let fill = ol.querySelector('.tl__fill'); if (!fill) { fill = document.createElement('span'); fill.className = 'tl__fill'; fill.setAttribute('aria-hidden', 'true'); ol.prepend(fill); }
  const setFill = li => { const h = ol.clientHeight - 16; fill.style.transform = 'scaleY(' + Math.min(1, Math.max(0, (li.offsetTop + 15 - 8) / h)) + ')'; };
  let cur = 0, timer = null, touched = false;
  const play = () => { if (REDUCE || touched || timer) return; timer = setInterval(() => { cur = (cur + 1) % btns.length; btns[cur].dispatchEvent(new CustomEvent('pick')); }, 3200); };
  const stop = () => { clearInterval(timer); timer = null; };
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? play() : stop()), {threshold:.45}).observe(ol);
  btns.forEach((b, i) => b.addEventListener('click', () => { touched = true; stop(); cur = i; }));
  requestAnimationFrame(() => setFill(btns[0].parentElement)); addEventListener('resize', () => setFill(btns[cur].parentElement));
  btns.forEach(b => ['click', 'pick'].forEach(ev => b.addEventListener(ev, () => {
    setFill(b.parentElement);
    document.querySelectorAll('#eras li').forEach(li => li.classList.toggle('on', li === b.parentElement));
    document.querySelectorAll('#eras button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    if (img.getAttribute('src') === b.dataset.img) return;
    img.classList.add('swap');
    setTimeout(() => { img.src = b.dataset.img; img.width = +b.dataset.w; img.height = +b.dataset.h; img.alt = b.dataset.alt; img.onload = () => img.classList.remove('swap'); }, REDUCE ? 0 : 250);
  })));
})();
