(function () {
  'use strict';

  /* ---------- copy (EN / RU / UZ Latin) ---------- */
  var T = {
    en: {
      nav: ['Dashboard', 'Catalog', 'Requests (RFQ)', 'Offers', 'Contracts', 'Payments', 'Logistics', 'Analytics', 'Consulting'],
      verified: 'Verified company', search: 'Search', searchPh: 'Search requests, products, suppliers',
      hello: 'Good morning, Dilnoza',
      wait: function (n) { return n ? 'Today <b>' + n + (n === 1 ? ' thing is' : ' things are') + '</b> waiting on you.' : '<b>Nothing</b> is waiting on you. Nice work.'; },
      led: { review: 'Offers to review', sign: 'Contract to sign', pay: 'Payment due', transit: 'In transit' },
      ledS: { review: 'across 2 requests', sign: 'Ring spinning spare parts', pay: 'Escrow · due 8 Nov', transit: 'shipments to Andijan' },
      ledGo: { review: 'Compare offers', sign: 'Review and sign', pay: 'Fund escrow', transit: 'Track', done: 'Done' },
      requests: 'Requests for quotation', mine: 'My requests', incoming: 'Incoming', newReq: 'New request',
      cols: ['Request', 'Product', 'Quantity', 'Delivery to', 'Offers due', 'Offers', 'Best landed price', 'Status'],
      st: { new: 'New', offers: 'Offers received', nego: 'Negotiating', sign: 'Awaiting your signature', draft: 'Contract draft', signed: 'Signed', transit: 'In transit', sent: 'Offer sent', closed: 'Closed' },
      empty: 'No requests match your search.',
      units: { t: 't', pcs: 'pcs', m: 'm', sets: 'sets' }, days: 'days', perUnit: 'per',
      close: 'Close', compare: 'Compare offers', compareS: 'sorted by landed cost',
      fQty: 'Quantity', fTo: 'Delivery to', fDue: 'Offers due', fIn: 'Incoterms wanted',
      price: 'Price', landed: 'Landed cost', lead: 'Lead time', terms: 'Terms', rating: 'Rating',
      lgP: 'Supplier price', lgF: 'Estimated freight',
      bestTotal: 'Best total', lowest: 'Lowest price', verifiedS: 'Verified',
      landedNote: 'Freight to Andijan is estimated by the platform for EXW and FCA offers.',
      accept: 'Accept and draft contract', ask: 'Ask the supplier',
      approval: 'Contract approval', approvalS: 'who acts next is always shown',
      steps: ['Offer accepted', 'Contract drafted', 'Signed by supplier', 'Your signature', 'Escrow payment', 'Shipment'],
      stepS: ['28 Oct · Dilnoza K.', '29 Oct · platform template, RU/UZ', '31 Oct · Karaganda Mash Service', 'Waiting on you', 'Next: release on delivery', 'Next: CMR waybill and customs'],
      doc: 'Contract KMS-ATG-0471.pdf', docS: 'Bilingual RU / UZ · 6 pages · e-signature',
      signBtn: 'Sign contract', signedBtn: 'Signed',
      reqFrom: 'Request from', prepare: 'Prepare offer', sentOn: 'Offer sent on 1 Nov, awaiting buyer',
      tAccept: function (s) { return 'Offer from ' + s + ' accepted. Contract draft is on its way.'; },
      tSign: 'Contract signed. Escrow payment is your next step.',
      tNew: 'New request form opens here (not part of this concept).',
      tAsk: 'Message thread with the supplier opens here.',
      tPrep: 'Offer form opens here, prefilled from your catalog.', tOut: 'This module is outside the concept.', route: 'Kazakhstan → Uzbekistan', perNote: function (u) { return 'Prices per 1 ' + u + '.'; }, signedNow: 'Today · Dilnoza K.',
      tab: ['Home', 'Requests', 'Contracts', 'Payments', 'More']
    },
    ru: {
      nav: ['Главная', 'Каталог', 'Запросы (RFQ)', 'Предложения', 'Контракты', 'Платежи', 'Логистика', 'Аналитика', 'Консультации'],
      verified: 'Проверенная компания', search: 'Поиск', searchPh: 'Поиск по запросам, товарам, поставщикам',
      hello: 'Доброе утро, Дилноза',
      wait: function (n) { return n ? 'Сегодня вас ждут <b>' + n + ' ' + plRu(n, 'действие', 'действия', 'действий') + '</b>.' : '<b>Ничего</b> не ждёт вашего решения. Отличная работа.'; },
      led: { review: 'Предложения на рассмотрении', sign: 'Контракт на подпись', pay: 'Платёж к оплате', transit: 'В пути' },
      ledS: { review: 'по 2 запросам', sign: 'Запчасти для прядильных машин', pay: 'Эскроу · до 8 ноября', transit: 'поставки в Андижан' },
      ledGo: { review: 'Сравнить', sign: 'Проверить и подписать', pay: 'Пополнить эскроу', transit: 'Отследить', done: 'Готово' },
      requests: 'Запросы цен', mine: 'Мои запросы', incoming: 'Входящие', newReq: 'Новый запрос',
      cols: ['Запрос', 'Товар', 'Количество', 'Доставка в', 'Приём до', 'Предл.', 'Лучшая цена с доставкой', 'Статус'],
      st: { new: 'Новый', offers: 'Есть предложения', nego: 'Переговоры', sign: 'Ждёт вашей подписи', draft: 'Черновик контракта', signed: 'Подписан', transit: 'В пути', sent: 'Предложение отправлено', closed: 'Закрыт' },
      empty: 'По вашему запросу ничего не найдено.',
      units: { t: 'т', pcs: 'шт', m: 'м', sets: 'компл.' }, days: 'дн.', perUnit: 'за',
      close: 'Закрыть', compare: 'Сравнение предложений', compareS: 'по цене с доставкой',
      fQty: 'Количество', fTo: 'Доставка в', fDue: 'Приём до', fIn: 'Условия поставки',
      price: 'Цена', landed: 'С доставкой', lead: 'Срок поставки', terms: 'Условия', rating: 'Рейтинг',
      lgP: 'Цена поставщика', lgF: 'Оценка доставки',
      bestTotal: 'Лучшая итоговая', lowest: 'Самая низкая цена', verifiedS: 'Проверен',
      landedNote: 'Для предложений EXW и FCA платформа оценивает доставку до Андижана.',
      accept: 'Принять и подготовить контракт', ask: 'Задать вопрос',
      approval: 'Согласование контракта', approvalS: 'всегда видно, чей следующий шаг',
      steps: ['Предложение принято', 'Контракт подготовлен', 'Подписан поставщиком', 'Ваша подпись', 'Оплата через эскроу', 'Отгрузка'],
      stepS: ['28 окт · Дилноза К.', '29 окт · шаблон платформы, RU/UZ', '31 окт · Karaganda Mash Service', 'Ждёт вас', 'Далее: выплата после доставки', 'Далее: CMR и таможня'],
      doc: 'Контракт KMS-ATG-0471.pdf', docS: 'Двуязычный RU / UZ · 6 страниц · ЭЦП',
      signBtn: 'Подписать контракт', signedBtn: 'Подписан',
      reqFrom: 'Запрос от', prepare: 'Подготовить предложение', sentOn: 'Предложение отправлено 1 ноября, ждём покупателя',
      tAccept: function (s) { return 'Предложение ' + s + ' принято. Черновик контракта готовится.'; },
      tSign: 'Контракт подписан. Следующий шаг — оплата через эскроу.',
      tNew: 'Здесь откроется форма нового запроса (не входит в концепт).',
      tAsk: 'Здесь откроется переписка с поставщиком.',
      tPrep: 'Здесь откроется форма предложения, заполненная из вашего каталога.', tOut: 'Этот модуль не входит в концепт.', route: 'Казахстан → Узбекистан', perNote: function (u) { return 'Цены за 1 ' + u + '.'; }, signedNow: 'Сегодня · Дилноза К.',
      tab: ['Главная', 'Запросы', 'Контракты', 'Платежи', 'Ещё']
    },
    uz: {
      nav: ['Bosh sahifa', 'Katalog', 'Soʻrovlar (RFQ)', 'Takliflar', 'Shartnomalar', 'Toʻlovlar', 'Logistika', 'Tahlil', 'Maslahatlar'],
      verified: 'Tasdiqlangan kompaniya', search: 'Qidirish', searchPh: 'Soʻrovlar, mahsulotlar, yetkazib beruvchilarni qidirish',
      hello: 'Xayrli tong, Dilnoza',
      wait: function (n) { return n ? 'Bugun sizni <b>' + n + ' ta vazifa</b> kutmoqda.' : 'Hozircha <b>hech narsa</b> sizni kutmayapti. Ajoyib.'; },
      led: { review: 'Koʻrib chiqiladigan takliflar', sign: 'Imzolanadigan shartnoma', pay: 'Toʻlov muddati', transit: 'Yoʻlda' },
      ledS: { review: '2 ta soʻrov boʻyicha', sign: 'Yigiruv mashinalari ehtiyot qismlari', pay: 'Eskrou · 8-noyabrgacha', transit: 'Andijonga yuklar' },
      ledGo: { review: 'Solishtirish', sign: 'Koʻrib chiqish va imzolash', pay: 'Eskrouni toʻldirish', transit: 'Kuzatish', done: 'Bajarildi' },
      requests: 'Narx soʻrovlari', mine: 'Mening soʻrovlarim', incoming: 'Kiruvchi', newReq: 'Yangi soʻrov',
      cols: ['Soʻrov', 'Mahsulot', 'Miqdor', 'Manzil', 'Muddat', 'Taklif', 'Yetkazish bilan eng yaxshi narx', 'Holat'],
      st: { new: 'Yangi', offers: 'Takliflar keldi', nego: 'Muzokaralar', sign: 'Imzoingiz kutilmoqda', draft: 'Shartnoma loyihasi', signed: 'Imzolangan', transit: 'Yoʻlda', sent: 'Taklif yuborildi', closed: 'Yopilgan' },
      empty: 'Soʻrovingiz boʻyicha hech narsa topilmadi.',
      units: { t: 't', pcs: 'dona', m: 'm', sets: 'toʻplam' }, days: 'kun', perUnit: 'har',
      close: 'Yopish', compare: 'Takliflarni solishtirish', compareS: 'yetkazish bilan narx boʻyicha',
      fQty: 'Miqdor', fTo: 'Manzil', fDue: 'Muddat', fIn: 'Yetkazish shartlari',
      price: 'Narx', landed: 'Yetkazish bilan', lead: 'Yetkazish muddati', terms: 'Shartlar', rating: 'Reyting',
      lgP: 'Yetkazib beruvchi narxi', lgF: 'Taxminiy tashish',
      bestTotal: 'Eng yaxshi umumiy', lowest: 'Eng past narx', verifiedS: 'Tasdiqlangan',
      landedNote: 'EXW va FCA takliflari uchun Andijongacha tashish narxini platforma hisoblaydi.',
      accept: 'Qabul qilish va shartnoma tuzish', ask: 'Savol berish',
      approval: 'Shartnomani tasdiqlash', approvalS: 'keyingi qadam kimda ekani doim koʻrinadi',
      steps: ['Taklif qabul qilindi', 'Shartnoma tayyorlandi', 'Yetkazib beruvchi imzoladi', 'Sizning imzoingiz', 'Eskrou orqali toʻlov', 'Joʻnatish'],
      stepS: ['28-okt · Dilnoza K.', '29-okt · platforma shabloni, RU/UZ', '31-okt · Karaganda Mash Service', 'Sizni kutmoqda', 'Keyin: yetkazilgach toʻlanadi', 'Keyin: CMR va bojxona'],
      doc: 'Shartnoma KMS-ATG-0471.pdf', docS: 'Ikki tilda RU / UZ · 6 bet · elektron imzo',
      signBtn: 'Shartnomani imzolash', signedBtn: 'Imzolandi',
      reqFrom: 'Soʻrov egasi', prepare: 'Taklif tayyorlash', sentOn: 'Taklif 1-noyabrda yuborildi, xaridor javobi kutilmoqda',
      tAccept: function (s) { return s + ' taklifi qabul qilindi. Shartnoma loyihasi tayyorlanmoqda.'; },
      tSign: 'Shartnoma imzolandi. Keyingi qadam — eskrou orqali toʻlov.',
      tNew: 'Bu yerda yangi soʻrov shakli ochiladi (konsepsiyaga kirmaydi).',
      tAsk: 'Bu yerda yetkazib beruvchi bilan yozishma ochiladi.',
      tPrep: 'Bu yerda katalogingizdan toʻldirilgan taklif shakli ochiladi.', tOut: 'Bu modul konsepsiyaga kirmaydi.', route: 'Qozogʻiston → Oʻzbekiston', perNote: function (u) { return 'Narxlar 1 ' + u + ' uchun.'; }, signedNow: 'Bugun · Dilnoza K.',
      tab: ['Bosh', 'Soʻrovlar', 'Shartnoma', 'Toʻlov', 'Yana']
    }
  };
  function plRu(n, a, b, c) { var m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return a; if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b; return c; }

  var MONTHS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']
  };
  var RATE = 12650; // sample rate, UZS per USD

  var CITY = { andijan: { en: 'Andijan', ru: 'Андижан', uz: 'Andijon' }, tashkent: { en: 'Tashkent', ru: 'Ташкент', uz: 'Toshkent' }, almaty: { en: 'Almaty', ru: 'Алматы', uz: 'Olmaota' }, astana: { en: 'Astana', ru: 'Астана', uz: 'Astana' } };

  /* ---------- sample data ---------- */
  var MINE = [
    { id: 'RFQ-2611-014', p: { en: 'Polyester yarn 150D', ru: 'Полиэфирная нить 150D', uz: 'Poliefir ip 150D' }, sub: 'Kazakhstan → Uzbekistan', qty: 24, u: 't', to: 'andijan', due: [6, 11], st: 'offers', inco: 'DAP',
      offers: [
        { s: 'Almaty PolyFiber LLP', c: 'almaty', price: 1180, fr: 0, lead: 12, terms: 'DAP Andijan', r: 4.8 },
        { s: 'Turkistan Yarn Co.', c: 'almaty', price: 1215, fr: 0, lead: 9, terms: 'DAP Andijan', r: 4.6 },
        { s: 'Steppe Fibers LLP', c: 'astana', price: 1150, fr: 86, lead: 21, terms: 'EXW Shymkent', r: 4.4 }
      ] },
    { id: 'RFQ-2611-011', p: { en: 'Reactive dyes, mixed shades', ru: 'Активные красители, ассорти', uz: 'Faol boʻyoqlar, turli ranglar' }, sub: 'Kazakhstan → Uzbekistan', qty: 3.5, u: 't', to: 'andijan', due: [5, 11], st: 'nego', inco: 'CPT',
      offers: [
        { s: 'Shymkent Chem Trade', c: 'almaty', price: 6420, fr: 0, lead: 10, terms: 'CPT Andijan', r: 4.7 },
        { s: 'Qazaq Colour LLP', c: 'astana', price: 6150, fr: 310, lead: 14, terms: 'FCA Almaty', r: 4.5 }
      ] },
    { id: 'RFQ-2610-097', p: { en: 'Ring spinning spare parts', ru: 'Запчасти для прядильных машин', uz: 'Yigiruv mashinalari ehtiyot qismlari' }, sub: 'Karaganda Mash Service', qty: 140, u: 'pcs', to: 'andijan', due: [24, 10], st: 'sign', inco: 'DAP', best: 304, contract: true },
    { id: 'RFQ-2611-016', p: { en: 'Caustic soda flakes 99%', ru: 'Каустическая сода, чешуя 99%', uz: 'Kaustik soda, parcha 99%' }, sub: 'Kazakhstan → Uzbekistan', qty: 18, u: 't', to: 'andijan', due: [12, 11], st: 'new', inco: 'DAP', offers: [] },
    { id: 'RFQ-2610-090', p: { en: 'Corrugated shipping boxes', ru: 'Гофрокоробы', uz: 'Gofrokarton qutilar' }, sub: 'Aktobe Pack LLP', qty: 60000, u: 'pcs', to: 'tashkent', due: [14, 10], st: 'transit', inco: 'DAP', best: 0.42 },
    { id: 'RFQ-2610-082', p: { en: 'Industrial sewing needles', ru: 'Промышленные швейные иглы', uz: 'Sanoat tikuv ignalari' }, sub: 'Turan Industrial Supply', qty: 400000, u: 'pcs', to: 'andijan', due: [2, 10], st: 'signed', inco: 'DAP', best: 0.031 }
  ];
  var INC = [
    { id: 'IN-2611-203', p: { en: 'Cotton knit fabric 180 gsm', ru: 'Хлопковое трикотажное полотно 180 г/м²', uz: 'Paxta trikotaj mato 180 g/m²' }, sub: 'Nomad Apparel LLP', qty: 12000, u: 'm', to: 'almaty', due: [9, 11], st: 'new', inco: 'DAP', buyer: 'Nomad Apparel LLP' },
    { id: 'IN-2611-198', p: { en: 'Bed linen sets, hospital grade', ru: 'Комплекты постельного белья для больниц', uz: 'Kasalxona uchun choyshab toʻplamlari' }, sub: 'Astana MedSupply', qty: 3000, u: 'sets', to: 'astana', due: [7, 11], st: 'sent', inco: 'CPT', best: 14.6, buyer: 'Astana MedSupply' }
  ];

  var state = { lang: 'en', cur: 'USD', tab: 'mine', q: '', signed: false, accepted: {}, paid: false };
  try { var sv = JSON.parse(localStorage.getItem('karvon-pref') || '{}'); if (T[sv.lang]) state.lang = sv.lang; if (sv.cur === 'UZS') state.cur = 'UZS'; } catch (e) {}

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var t = function () { return T[state.lang]; };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function grp(n, dec) {
    var sep = state.lang === 'en' ? ',' : ' ', ds = state.lang === 'en' ? '.' : ',';
    var parts = n.toFixed(dec).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return parts.join(ds);
  }
  function qty(n, u) { return grp(n, n % 1 ? 1 : 0) + ' ' + t().units[u]; }
  function money(usd) {
    if (state.cur === 'UZS') {
      var v = usd * RATE, suf = state.lang === 'ru' ? 'сум' : 'soʻm';
      if (v >= 1e6) return grp(v / 1e6, 1) + ' ' + (state.lang === 'en' ? 'M ' : state.lang === 'ru' ? 'млн ' : 'mln ') + suf;
      return grp(Math.round(v), 0) + ' ' + suf;
    }
    var d = usd < 1 ? 3 : (usd % 1 ? 2 : 0);
    return '$' + grp(usd, d);
  }
  function date(d) {
    var m = MONTHS[state.lang][d[1] - 1];
    return state.lang === 'uz' ? d[0] + '-' + m : d[0] + ' ' + m;
  }
  function sub(r) { return r.sub === 'Kazakhstan → Uzbekistan' ? t().route : r.sub; }
  function city(c) { return CITY[c][state.lang]; }
  function landed(o) { return o.price + o.fr; }
  function bestOf(r) {
    if (r.offers && r.offers.length) return Math.min.apply(null, r.offers.map(landed));
    return r.best;
  }
  function status(r) {
    if (r.id === 'RFQ-2610-097' && state.signed) return 'signed';
    if (state.accepted[r.id]) return 'draft';
    return r.st;
  }

  var ICON = {
    home: '<path d="M3 9.5L10 4l7 5.5V17H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    grid: '<rect x="3" y="3" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="11" y="3" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="11" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="11" y="11" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    rfq: '<path d="M4 3h9l3 3v11H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 9h6M7 12h6M7 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    offer: '<path d="M3 10l7-7h7v7l-7 7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="13.5" cy="6.5" r="1.3" fill="currentColor"/>',
    contract: '<path d="M5 3h10v14H5z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 13l2 2 3-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    pay: '<rect x="2.5" y="5" width="15" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 8.5h15" stroke="currentColor" stroke-width="1.6"/>',
    truck: '<path d="M2 5h10v8H2zM12 8h3.5L18 11v2h-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="5.5" cy="14.5" r="1.6" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/><circle cx="14.5" cy="14.5" r="1.6" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/>',
    chart: '<path d="M3 17h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 14V9M10 14V5M14 14v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    talk: '<path d="M3 4h14v9H8l-4 3v-3H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    more: '<circle cx="5" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 20 20" aria-hidden="true">' + ICON[k] + '</svg>'; }

  function reviewCount() {
    var n = 0;
    MINE.forEach(function (r) { if (r.offers && !state.accepted[r.id] && (r.st === 'offers' || r.st === 'nego')) n += r.offers.length; });
    return n;
  }

  /* ---------- render ---------- */
  function renderNav() {
    var keys = ['home', 'grid', 'rfq', 'offer', 'contract', 'pay', 'truck', 'chart', 'talk'];
    var badges = { 2: 1, 3: reviewCount(), 4: state.signed ? 0 : 1 };
    $('#nav').innerHTML = keys.map(function (k, i) {
      var b = badges[i] ? '<span class="badge" aria-label="' + badges[i] + '">' + badges[i] + '</span>' : '';
      return '<li><a href="#top"' + (i === 2 ? ' aria-current="page"' : '') + ' title="' + esc(t().nav[i]) + '">' + svg(k) + '<span>' + esc(t().nav[i]) + '</span>' + b + '</a></li>';
    }).join('');
    var tk = ['home', 'rfq', 'contract', 'pay', 'more'], tb = { 1: reviewCount(), 2: state.signed ? 0 : 1 };
    $('#tabbar').innerHTML = tk.map(function (k, i) {
      return '<a href="#top"' + (i === 1 ? ' aria-current="page"' : '') + '>' + svg(k) + '<span>' + esc(t().tab[i]) + '</span>' + (tb[i] ? '<i class="badge">' + tb[i] + '</i>' : '') + '</a>';
    }).join('');
  }

  function renderLedger() {
    var L = t(), rc = reviewCount();
    var items = [
      { k: 'review', c: 'var(--tq)', v: rc, s: L.ledS.review, done: rc === 0, open: 'RFQ-2611-014' },
      { k: 'sign', c: 'var(--saffron)', v: state.signed ? 0 : 1, s: L.ledS.sign, done: state.signed, open: 'RFQ-2610-097' },
      { k: 'pay', c: 'var(--lapis)', v: money(42600), s: L.ledS.pay, done: false, raw: true },
      { k: 'transit', c: 'var(--leaf)', v: 2, s: L.ledS.transit, done: false }
    ];
    $('#ledger').innerHTML = items.map(function (it) {
      return '<button type="button" class="led' + (it.done ? ' led--done' : '') + '" style="--c:' + it.c + '"' + (it.open ? ' data-open="' + it.open + '"' : ' data-toast="1"') + '>' +
        '<span class="led__k">' + esc(L.led[it.k]) + '</span>' +
        '<span class="led__v">' + esc(String(it.v)) + '</span>' +
        '<span class="led__s">' + esc(it.s) + '</span>' +
        '<span class="led__go">' + esc(it.done ? L.ledGo.done : L.ledGo[it.k]) + ' →</span></button>';
    }).join('');
    var waiting = (rc ? 1 : 0) + (state.signed ? 0 : 1) + 1;
    $('#waitLine').innerHTML = L.wait(waiting);
  }

  function chip(st) { return '<span class="chip chip--' + st + (st === 'sign' ? ' chip--me' : '') + '">' + esc(t().st[st]) + '</span>'; }

  function renderTable() {
    var L = t(), rows = state.tab === 'mine' ? MINE : INC, q = state.q.trim().toLowerCase();
    $('#thead').innerHTML = L.cols.map(function (c) { return '<span role="columnheader">' + esc(c) + '</span>'; }).join('').replace('<span role="columnheader">' + esc(L.cols[3]) + '</span>', '<span role="columnheader" class="c-dest">' + esc(L.cols[3]) + '</span>');
    var list = rows.filter(function (r) {
      if (!q) return true;
      return (r.id + ' ' + r.p.en + ' ' + r.p.ru + ' ' + r.p.uz + ' ' + r.sub + ' ' + (r.offers || []).map(function (o) { return o.s; }).join(' ')).toLowerCase().indexOf(q) > -1;
    });
    $('#tbody').innerHTML = list.map(function (r) {
      var st = status(r), n = r.offers ? r.offers.length : (r.contract ? 1 : 0), b = bestOf(r);
      var dots = r.offers ? r.offers.map(function () { return '<i></i>'; }).join('') + (n < 3 ? new Array(3 - n + 1).join('<i class="o"></i>') : '') : '';
      var soon = r.due[1] === 11 && r.due[0] <= 6 && (st === 'offers' || st === 'nego' || st === 'new');
      var bestTxt = b ? money(b) + ' <small style="color:var(--mute);font-weight:400">/ ' + esc(L.units[r.u].replace(/\.$/, '')) + '</small>' : '<span style="color:var(--mute)">—</span>';
      return '<button type="button" class="tr" role="row" data-open="' + r.id + '">' +
        '<span role="cell" class="id c-id">' + r.id + '</span>' +
        '<span role="cell" class="prod">' + esc(r.p[state.lang]) + '<small>' + esc(sub(r)) + '</small></span>' +
        '<span role="cell" class="num c-qty">' + qty(r.qty, r.u) + '</span>' +
        '<span role="cell" class="c-dest">' + esc(city(r.to)) + '</span>' +
        '<span role="cell" class="c-due' + (soon ? ' soon' : '') + '">' + date(r.due) + '</span>' +
        '<span role="cell" class="c-off">' + (r.offers ? '<span class="offers">' + dots + '<span>' + n + '</span></span>' : '<span style="color:var(--mute)">—</span>') + '</span>' +
        '<span role="cell" class="num c-best">' + bestTxt + '</span>' +
        '<span role="cell" class="c-st">' + chip(st) + '</span>' +
        '<span class="meta" aria-hidden="true"><span>' + r.id + '</span><span>' + qty(r.qty, r.u) + '</span><span>→ ' + esc(city(r.to)) + '</span>' + (b ? '<span><b>' + money(b) + '</b></span>' : '') + '</span>' +
        '</button>';
    }).join('');
    $('#empty').hidden = list.length > 0;
    $('#cMine').textContent = MINE.length;
    $('#cIn').textContent = INC.length;
  }

  function renderStatic() {
    var L = t();
    document.documentElement.lang = state.lang === 'uz' ? 'uz-Latn' : state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = L[el.getAttribute('data-i18n')]; });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = L[el.getAttribute('data-i18n-ph')]; });
    document.querySelectorAll('#lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)); });
    document.querySelectorAll('#cur button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cur === state.cur)); });
  }

  function renderAll() { renderStatic(); renderNav(); renderLedger(); renderTable(); if (openId) renderDrawer(openId); }

  /* ---------- drawer ---------- */
  var openId = null, lastFocus = null;
  function find(id) { return MINE.concat(INC).filter(function (r) { return r.id === id; })[0]; }

  function renderDrawer(id) {
    var r = find(id), L = t(), st = status(r), h = '';
    h += '<div class="d-top"><div><span class="id">' + r.id + ' · ' + esc(sub(r)) + '</span><h2 id="dTitle">' + esc(r.p[state.lang]) + '</h2><div style="margin-top:8px">' + chip(st) + '</div></div>' +
      '<button type="button" class="x" data-close aria-label="' + esc(L.close) + '"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>';
    h += '<dl class="facts"><div><dt>' + esc(L.fQty) + '</dt><dd>' + qty(r.qty, r.u) + '</dd></div><div><dt>' + esc(L.fTo) + '</dt><dd>' + esc(city(r.to)) + '</dd></div><div><dt>' + esc(L.fDue) + '</dt><dd>' + date(r.due) + '</dd></div><div><dt>' + esc(L.fIn) + '</dt><dd>' + r.inco + '</dd></div></dl>';

    if (r.contract) {
      h += '<h3 class="d-h">' + esc(L.approval) + ' <small>' + esc(L.approvalS) + '</small></h3>';
      h += '<div class="doc"><svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true">' + ICON.contract + '</svg><div><b>' + esc(L.doc) + '</b><small>' + esc(L.docS) + ' · ' + money(r.best * r.qty) + '</small></div></div>';
      h += '<ol class="path">' + L.steps.map(function (s, i) {
        var cls = i < 3 || (i === 3 && state.signed) ? 'done' : (i === 3 || (i === 4 && state.signed)) ? 'now' : '';
        var sub = L.stepS[i];
        if (i === 3 && state.signed) sub = L.signedNow;
        if (i === 4 && state.signed) sub = L.stepS[3];
        return '<li class="' + cls + '"><span class="dot">' + (cls === 'done' ? '✓' : i + 1) + '</span><span><b>' + esc(s) + '</b><small>' + esc(sub) + '</small></span></li>';
      }).join('') + '</ol>';
      h += '<div class="d-actions"><button type="button" class="btn btn--tq" data-sign' + (state.signed ? ' disabled' : '') + '>' + esc(state.signed ? L.signedBtn : L.signBtn) + '</button><button type="button" class="btn" data-ask>' + esc(L.ask) + '</button></div>';
    } else if (r.buyer) {
      h += '<h3 class="d-h">' + esc(L.reqFrom) + ' ' + esc(r.buyer) + '</h3>';
      if (r.st === 'sent') h += '<p class="note" style="font-size:14px">' + esc(L.sentOn) + ' · ' + money(r.best) + ' / ' + esc(L.units[r.u]) + '</p>';
      else h += '<div class="d-actions"><button type="button" class="btn btn--tq" data-prep>' + esc(L.prepare) + '</button><button type="button" class="btn" data-ask>' + esc(L.ask) + '</button></div>';
    } else if (r.offers && r.offers.length) {
      var offers = r.offers.slice().sort(function (a, b) { return landed(a) - landed(b); });
      var max = Math.max.apply(null, offers.map(landed)), minP = Math.min.apply(null, offers.map(function (o) { return o.price; }));
      h += '<h3 class="d-h">' + esc(L.compare) + ' <small>' + esc(L.compareS) + '</small></h3>';
      h += '<div class="legend"><span>' + esc(L.lgP) + '</span><span>' + esc(L.lgF) + '</span></div>';
      h += offers.map(function (o, i) {
        var best = i === 0, low = o.price === minP && !best, acc = state.accepted[r.id] === o.s;
        var pw = (o.price / max * 100).toFixed(1), fw = (o.fr / max * 100).toFixed(1);
        return '<div class="offer' + (best ? ' best' : '') + '"><div class="offer__row"><span class="offer__name">' + esc(o.s) + '<small>' + esc(city(o.c)) + ' · ★ ' + o.r.toFixed(1) + ' · ' + esc(L.verifiedS) + '</small></span><span class="offer__tags">' +
          (best ? '<span class="tag tag--best">' + esc(L.bestTotal) + '</span>' : '') + (low ? '<span class="tag tag--low">' + esc(L.lowest) + '</span>' : '') + '<span class="tag">' + esc(o.terms) + '</span></span></div>' +
          '<div class="bar" aria-hidden="true"><i class="p" style="width:' + pw + '%"></i><i class="f" style="width:' + fw + '%;transition-delay:.15s"></i></div>' +
          '<div class="offer__nums"><span>' + esc(L.price) + '<b>' + money(o.price) + '</b></span><span>' + esc(L.landed) + '<b>' + money(landed(o)) + '</b></span><span>' + esc(L.lead) + '<b>' + o.lead + ' ' + esc(L.days) + '</b></span><span>' + esc(L.rating) + '<b>★ ' + o.r.toFixed(1) + '</b></span></div>' +
          (acc ? '<p class="note" style="color:var(--leaf);font-weight:600">✓ ' + esc(L.st.draft) + '</p>' : '') + '</div>';
      }).join('');
      h += '<p class="note">' + esc(L.landedNote) + ' ' + esc(L.perNote(L.units[r.u])) + '</p>';
      h += '<div class="d-actions"><button type="button" class="btn btn--tq" data-accept="' + esc(offers[0].s) + '"' + (state.accepted[r.id] ? ' disabled' : '') + '>' + esc(L.accept) + '</button><button type="button" class="btn" data-ask>' + esc(L.ask) + '</button></div>';
    } else {
      h += '<p class="note" style="font-size:14px">' + esc(L.st.new) + ' · 0 ' + esc(L.cols[5].toLowerCase()) + '</p>';
    }
    var body = $('#dBody');
    body.innerHTML = h;
  }

  function openDrawer(id) {
    openId = id; lastFocus = document.activeElement;
    var d = $('#drawer'), s = $('#scrim');
    renderDrawer(id);
    d.hidden = false; s.hidden = false;
    d.classList.remove('on'); void d.offsetWidth;
    requestAnimationFrame(function () { d.classList.add('on'); s.classList.add('on'); });
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var x = d.querySelector('.x'); if (x) x.focus(); }, 30);
  }
  function closeDrawer() {
    if (!openId) return;
    openId = null;
    var d = $('#drawer'), s = $('#scrim');
    d.classList.remove('on'); s.classList.remove('on');
    document.body.style.overflow = '';
    setTimeout(function () { if (!openId) { d.hidden = true; s.hidden = true; } }, 450);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  var tt;
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 3200);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var el;
    if ((el = e.target.closest('[data-lang]'))) { state.lang = el.dataset.lang; save(); renderAll(); return; }
    if ((el = e.target.closest('[data-cur]'))) { state.cur = el.dataset.cur; save(); renderAll(); return; }
    if ((el = e.target.closest('[data-tab]'))) {
      state.tab = el.dataset.tab;
      document.querySelectorAll('#tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b === el)); });
      renderTable(); return;
    }
    if ((el = e.target.closest('[data-close]')) || e.target.id === 'scrim') { closeDrawer(); return; }
    if ((el = e.target.closest('[data-accept]'))) {
      state.accepted[openId] = el.dataset.accept; toast(t().tAccept(el.dataset.accept));
      renderAll(); return;
    }
    if ((el = e.target.closest('[data-sign]'))) { state.signed = true; toast(t().tSign); renderAll(); return; }
    if (e.target.closest('[data-ask]')) { toast(t().tAsk); return; }
    if (e.target.closest('[data-prep]')) { toast(t().tPrep); return; }
    if (e.target.closest('#newRfq')) { toast(t().tNew); return; }
    if ((el = e.target.closest('[data-open]'))) { openDrawer(el.dataset.open); return; }
    if (e.target.closest('[data-toast]')) { toast(t().tOut); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (!openId) return;
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (e.key === 'Tab') {
      var f = $('#drawer').querySelectorAll('button:not([disabled]),a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('#q').addEventListener('input', function (e) { state.q = e.target.value; renderTable(); });
  // tablist arrow keys
  $('#tabs').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var b = [].slice.call(this.querySelectorAll('button')), i = b.indexOf(document.activeElement);
    var n = b[(i + (e.key === 'ArrowRight' ? 1 : -1) + b.length) % b.length]; n.focus(); n.click();
  });
  function save() { try { localStorage.setItem('karvon-pref', JSON.stringify({ lang: state.lang, cur: state.cur })); } catch (e) {} }

  renderAll();
})();
