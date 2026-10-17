'use strict';

// ===== Apartment data (would come from a CRM/API in production) =====
const APARTMENTS = [
  { id: 'A-104', rooms: 1, area: 38.4, floor: 3, building: 'A', price: 52000, tag: 'Garden view' },
  { id: 'B-212', rooms: 1, area: 42.1, floor: 6, building: 'B', price: 57500 },
  { id: 'A-301', rooms: 2, area: 61.7, floor: 5, building: 'A', price: 81000, tag: 'Corner' },
  { id: 'C-405', rooms: 2, area: 68.2, floor: 4, building: 'C', price: 89500 },
  { id: 'B-907', rooms: 2, area: 72.5, floor: 9, building: 'B', price: 97000, tag: 'Forest view' },
  { id: 'C-118', rooms: 1, area: 40.6, floor: 1, building: 'C', price: 54000, tag: 'Terrace' },
  { id: 'C-603', rooms: 3, area: 88.9, floor: 6, building: 'C', price: 116500 },
  { id: 'A-702', rooms: 3, area: 94.3, floor: 7, building: 'A', price: 124000 },
  { id: 'B-1201', rooms: 3, area: 112.8, floor: 12, building: 'B', price: 168000, tag: 'Penthouse' },
];

// Simple floor plans drawn as SVG — walls in dark green, rooms labelled
const PLANS = {
  1: [[10, 10, 180, 130, 'Living'], [190, 10, 100, 80, 'Bed'], [190, 90, 100, 50, 'Bath'], [10, 140, 280, 50, 'Kitchen']],
  2: [[10, 10, 160, 110, 'Living'], [170, 10, 120, 90, 'Bed'], [170, 100, 120, 90, 'Bed'], [10, 120, 90, 70, 'Kitchen'], [100, 120, 70, 70, 'Bath']],
  3: [[10, 10, 130, 100, 'Living'], [140, 10, 150, 80, 'Master'], [140, 90, 80, 100, 'Bed'], [220, 90, 70, 100, 'Bed'], [10, 110, 80, 80, 'Kitchen'], [90, 110, 50, 80, 'Bath']],
};

const planSVG = (rooms) => {
  const rects = PLANS[rooms].map(([x, y, w, h, label]) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFDF9" stroke="#2F4A3A" stroke-width="3"/>
    <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#6E7068">${label}</text>`).join('');
  return `<svg viewBox="0 0 300 200" role="img" aria-label="${rooms}-room floor plan">
    <rect x="10" y="10" width="280" height="180" fill="none" stroke="#2F4A3A" stroke-width="6"/>${rects}
    <rect x="40" y="187" width="40" height="6" fill="#B8794B"/></svg>`;
};

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const roomWord = (n) => (n === 1 ? '1-room' : `${n}-room`);

function renderApartments(filter = 'all') {
  const list = document.getElementById('apartments-list');
  const items = APARTMENTS.filter((a) => filter === 'all' || String(a.rooms) === filter);
  list.innerHTML = items.map((a, i) => `
    <article class="apt" style="animation-delay:${i * 60}ms">
      <div class="apt__plan">${planSVG(a.rooms)}</div>
      <div class="apt__body">
        <div class="apt__top">
          <h3 class="apt__title">${roomWord(a.rooms)} · ${a.area} m²</h3>
          ${a.tag ? `<span class="apt__tag">${a.tag}</span>` : ''}
        </div>
        <p class="apt__meta"><span>Building ${a.building}</span><span>Floor ${a.floor}</span><span>№ ${a.id}</span></p>
        <div class="apt__bottom">
          <p class="apt__price">${money(a.price)}<small>${money(a.price / a.area)} / m²</small></p>
          <button class="btn btn--small btn--outline" data-modal-open data-apt="${a.id}">Book</button>
        </div>
      </div>
    </article>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // ----- Mobile menu -----
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // ----- Apartments + filter -----
  renderApartments();
  const filterBtns = document.querySelectorAll('.filter__btn');
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
    renderApartments(btn.dataset.rooms);
  }));

  // ----- Instalment calculator -----
  const price = document.getElementById('price');
  const down = document.getElementById('down');
  const term = document.getElementById('term');
  const paint = (input) => {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--fill', pct + '%');
  };
  const calc = () => {
    const p = Number(price.value);
    const d = Number(down.value);
    const t = Number(term.value);
    const upfront = (p * d) / 100;
    document.getElementById('price-out').textContent = money(p);
    document.getElementById('down-out').textContent = d + '%';
    document.getElementById('term-out').textContent = t + ' months';
    document.getElementById('upfront').textContent = money(upfront);
    document.getElementById('monthly').textContent = money((p - upfront) / t);
    [price, down, term].forEach(paint);
  };
  [price, down, term].forEach((el) => el.addEventListener('input', calc));
  calc();

  // ----- Phone mask: +38 (0XX) XXX-XX-XX -----
  document.querySelectorAll('[data-phone]').forEach((input) => {
    input.addEventListener('input', () => {
      let digits = input.value.replace(/\D/g, '');
      if (digits.startsWith('38')) digits = digits.slice(2);
      if (digits && digits[0] !== '0') digits = '0' + digits;
      digits = digits.slice(0, 10);
      const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
      let out = '+38';
      if (parts[0]) out += ' (' + parts[0];
      if (parts[0].length === 3) out += ')';
      if (parts[1]) out += ' ' + parts[1];
      if (parts[2]) out += '-' + parts[2];
      if (parts[3]) out += '-' + parts[3];
      input.value = digits ? out : '';
    });
  });

  // ----- Form validation -----
  document.querySelectorAll('[data-form]').forEach((form) => {
    const check = (input) => {
      const err = input.parentElement.querySelector('.form__error');
      let msg = '';
      const v = input.value.trim();
      if (input.name === 'name' && v.length < 2) msg = 'Please enter your name';
      if (input.name === 'phone' && v.replace(/\D/g, '').length !== 12) msg = 'Enter a full phone number';
      err.textContent = msg;
      input.classList.toggle('is-invalid', Boolean(msg));
      return !msg;
    };
    const inputs = form.querySelectorAll('input');
    inputs.forEach((i) => i.addEventListener('blur', () => i.value && check(i)));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = [...inputs].map(check).every(Boolean);
      if (!ok) { form.querySelector('.is-invalid').focus(); return; }
      form.querySelector('.form__success').hidden = false;
      form.reset();
    });
  });

  // ----- Modal -----
  const modal = document.getElementById('modal');
  const modalSub = document.getElementById('modal-sub');
  let lastFocus = null;
  const openModal = (trigger) => {
    lastFocus = trigger;
    modalSub.textContent = trigger && trigger.dataset.apt
      ? `Apartment № ${trigger.dataset.apt} — we'll reserve it for 3 days while you decide.`
      : 'Choose a time to see the show apartment.';
    modal.hidden = false;
    document.body.classList.add('is-locked');
    modal.querySelector('input').focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    modal.querySelectorAll('.form__success').forEach((s) => { s.hidden = true; });
    if (lastFocus) lastFocus.focus();
  };
  // delegation: works for apartment cards rendered later
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) { openModal(opener); return; }
    if (e.target.closest('[data-modal-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (!modal.hidden) closeModal(); setMenu(false); }
  });

  // ----- Progress bars animate on scroll -----
  const bars = document.querySelectorAll('.bar');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    }), { threshold: 0.5 });
    bars.forEach((b) => io.observe(b));
  } else {
    bars.forEach((b) => b.classList.add('is-visible'));
  }
});
