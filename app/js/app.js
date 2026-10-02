/* 城大搵食指南 CityU Eats — 應用層：路由、畫面、評論、隨機器 */
(function () {
  'use strict';
  const DATA = window.CITYU_EATS_DATA;
  const I18N = window.I18N;
  const Reviews = window.CityuEatsReviews;
  const store = Reviews.store;

  const state = {
    reviews: [],
    stats: {},
    filters: {},          // canteenId → { cat, sort }
    route: { view: 'home', canteenId: null },
    modalReturnFocus: null,
  };

  /* ── 小工具 ─────────────────────────────── */

  const appEl = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');

  const dishById = (id) => DATA.dishes.find((d) => d.id === id);
  const canteenById = (id) => DATA.canteens.find((c) => c.id === id);
  const catById = (id) => DATA.categories.find((c) => c.id === id) || { zh: id, en: id };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function fmtPrice(p) {
    return '$' + (Number.isInteger(p) ? p : +p.toFixed(1));
  }
  function fmtDate(iso) {
    const d = new Date(iso);
    const zh = I18N.lang() === 'zh';
    return zh
      ? `${d.getMonth() + 1}月${d.getDate()}日`
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  /* ── 圖標（同一套 1.8 stroke）──────────────── */

  const ICONS = {
    star: '<path d="M12 2.8l2.9 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.8 3l1.1-6.4L2.7 9.5l6.4-.9z"/>',
    bolt: '<path d="M13 2.5L4.8 13.4h5.7L9.6 21.5l8.6-11.4h-5.9z"/>',
    pin: '<path d="M12 21.5s-7-5.6-7-11.2a7 7 0 1 1 14 0c0 5.6-7 11.2-7 11.2z"/><circle cx="12" cy="10" r="2.6"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.4 2.1"/>',
    dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.4" cy="8.4" r="1.35" class="dot"/><circle cx="15.6" cy="15.6" r="1.35" class="dot"/><circle cx="15.6" cy="8.4" r="1.35" class="dot"/><circle cx="8.4" cy="15.6" r="1.35" class="dot"/>',
    back: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    ext: '<path d="M13.5 5.5H18.5V10.5M18.5 5.5L11 13M17 13.5v5H5.5V7h5"/>',
    flame: '<path d="M12 2.5s4.8 4.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-1.9.9-3.6 1.9-4.9.3 1.1 1 2 1.9 2.5-.3-2.4 0-4.7 1-6.8z"/>',
    arrow: '<path d="M5 12h13.5M13 5.5L19.5 12 13 18.5"/>',
  };
  const FILLED = ['star', 'bolt', 'flame'];
  function icon(name, cls) {
    const fill = FILLED.includes(name) ? ' icn-fill' : '';
    return `<svg class="icn${fill} ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
  }

  /* ── 資料載入 ────────────────────────────── */

  async function loadReviews() {
    try {
      state.reviews = await store.list();
    } catch (e) {
      state.reviews = [];
    }
    state.stats = Reviews.aggregate(state.reviews);
  }

  function dishReviews(dishId) {
    return state.reviews
      .filter((r) => r.dishId === dishId)
      .sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  function hotPicks(n) {
    return DATA.dishes
      .map((d) => {
        const s = state.stats[d.id];
        if (!s || s.count < 1) return null;
        const score = (s.avg * s.count + 3.6 * 3) / (s.count + 3); // 貝葉斯平滑
        return { d, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map((x) => x.d);
  }

  function avoidList(n) {
    return DATA.dishes
      .map((d) => {
        const s = state.stats[d.id];
        if (!s || s.count < 2 || !(s.avoidRatio >= 0.34 || s.verdict === 'avoid')) return null;
        return { d, s };
      })
      .filter(Boolean)
      .sort((a, b) => b.s.avoidRatio - a.s.avoidRatio || a.s.avg - b.s.avg || b.s.count - a.s.count)
      .slice(0, n)
      .map((x) => x.d);
  }

  /* ── 共用元件 ────────────────────────────── */

  function reviewCountText(n) {
    return I18N.lang() === 'zh' ? `${n}則評論` : (n === 1 ? `${n} review` : `${n} reviews`);
  }

  function starsSvg(avg) {
    const pct = Math.max(0, Math.min(100, (avg / 5) * 100));
    const row = (cls) =>
      `<span class="${cls}">${icon('star')}${icon('star')}${icon('star')}${icon('star')}${icon('star')}</span>`;
    return `<span class="stars" aria-hidden="true">${row('stars-row')}<span class="stars-fill" style="width:${pct}%">${row('stars-row')}</span></span>`;
  }

  function ratingLine(dishId) {
    const s = state.stats[dishId];
    if (!s || !s.count) {
      return `<span class="rating-line muted">${esc(I18N.t('noReviewsYet'))}</span>`;
    }
    return `<span class="rating-line"><b class="avg">${s.avg.toFixed(1)}</b>${starsSvg(s.avg)}<span class="count">${reviewCountText(s.count)}</span></span>`;
  }

  function verdictTag(verdict) {
    if (!verdict) return '';
    const key = { must: 'verdictMust', ok: 'verdictOk', avoid: 'verdictAvoid' }[verdict];
    return `<span class="stamp stamp-${verdict}">${esc(I18N.t(key))}</span>`;
  }

  function priceTag(p) {
    return `<span class="price-tag" aria-label="${fmtPrice(p)}">${fmtPrice(p)}</span>`;
  }

  function dishPhoto(dish, cls) {
    if (dish.photo) {
      return `<img class="${cls}" src="${esc(dish.photo)}" alt="${esc(I18N.pick(dish))}" loading="lazy">`;
    }
    const cat = catById(dish.cat);
    const first = (I18N.pick(dish) || '?').trim().charAt(0);
    return `<span class="${cls} dish-ph dish-ph-${dish.cat}" role="img" aria-label="${esc(I18N.pick(dish))}">
      <span class="dish-ph-glyph">${esc(first)}</span>
      <span class="dish-ph-cat">${esc(I18N.pick(cat))}</span></span>`;
  }

  function dishCard(dish) {
    const s = state.stats[dish.id];
    return `
      <button class="dish-card reveal" data-action="open-dish" data-id="${dish.id}">
        <span class="dish-card-media">
          ${dishPhoto(dish, 'dish-card-img')}
          ${priceTag(dish.price)}
          ${dish.tags && dish.tags.includes('signature') ? `<span class="sig-flag">${esc(I18N.lang() === 'zh' ? '招牌' : 'SIGNATURE')}</span>` : ''}
        </span>
        <span class="dish-card-body">
          <span class="dish-card-name">${esc(I18N.pick(dish))}</span>
          <span class="dish-card-en">${esc(I18N.lang() === 'zh' ? dish.en : dish.zh)}</span>
          ${verdictTag(s && s.verdict)}
          ${ratingLine(dish.id)}
        </span>
      </button>`;
  }

  function sectionHead(zhKey, enKey, subKey) {
    return `
      <div class="section-head reveal">
        <h2 class="section-title">${esc(I18N.t(zhKey))}<span class="section-en">${esc(I18N.t(enKey))}</span></h2>
        ${subKey ? `<p class="section-sub">${esc(I18N.t(subKey))}</p>` : ''}
      </div>`;
  }

  /* ── 畫面：首頁 ──────────────────────────── */

  function heroPhotos() {
    const picks = [
      { src: 'assets/roast-pork-shop.jpg', alt: '燒味' },
      { src: 'assets/noodle-beef.jpg', alt: '牛肉麵' },
      { src: 'assets/pizza.jpg', alt: '披薩' },
    ];
    return `<div class="hero-photos" aria-hidden="true">
      <figure class="hero-photo hero-photo-a"><img src="${picks[0].src}" alt=""></figure>
      <figure class="hero-photo hero-photo-b"><img src="${picks[1].src}" alt=""></figure>
      <figure class="hero-photo hero-photo-c"><img src="${picks[2].src}" alt=""></figure>
      <span class="stamp stamp-must hero-stamp">${esc(I18N.t('verdictMust'))}</span>
    </div>`;
  }

  function canteenCard(c) {
    const dishes = DATA.dishes.filter((d) => d.canteenId === c.id);
    const rated = dishes.filter((d) => state.stats[d.id]);
    const avg = rated.length
      ? (rated.reduce((s, d) => s + state.stats[d.id].avg, 0) / rated.length)
      : 0;
    return `
      <a class="canteen-card canteen-${c.color} reveal" href="#/canteen/${c.id}">
        <span class="canteen-card-code">${esc(c.short)}</span>
        <span class="canteen-card-head">
          <h3 class="canteen-card-name">${esc(I18N.lang() === 'zh' ? c.zh : c.en)}</h3>
          <span class="canteen-card-bldg">${icon('pin')}${esc(I18N.lang() === 'zh' ? c.bldgZh : c.bldgEn)}</span>
        </span>
        <p class="canteen-card-fact">${esc(I18N.lang() === 'zh' ? c.factZh : c.factEn)}</p>
        <span class="canteen-card-meta">
          <span class="canteen-card-hours">${icon('clock')}${esc(I18N.lang() === 'zh' ? c.hoursZh : c.hoursEn)}</span>
        </span>
        <span class="canteen-card-stats">
          <span><b>${dishes.length}</b>${esc(I18N.t('dishesCount'))}</span>
          ${rated.length ? `<span>${starsSvg(avg)}<b class="avg">${avg.toFixed(1)}</b></span>` : ''}
        </span>
        ${c.orderUrl ? `<span class="canteen-card-order">${esc(I18N.t('officialOrdering'))}${icon('ext')}</span>` : ''}
      </a>`;
  }

  function latestReviewCards() {
    const list = [...state.reviews]
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 6);
    if (!list.length) return '';
    return `
      ${sectionHead('latestHeading', 'latestHeadingEn')}
      <div class="review-wall">
        ${list.map((r) => {
          const d = dishById(r.dishId);
          if (!d) return '';
          const c = canteenById(d.canteenId);
          return `
            <button class="quote-card reveal" data-action="open-dish" data-id="${d.id}">
              <span class="quote-mark" aria-hidden="true">「</span>
              <p class="quote-text">${esc(r.text)}</p>
              <span class="quote-meta">
                <span class="quote-stars">${starsSvg(r.rating)}</span>
                <span class="quote-dish">${esc(I18N.pick(d))}</span>
                <span class="quote-canteen">${esc(c ? c.short : '')}</span>
                ${r.sample ? `<span class="sample-flag">${esc(I18N.t('sampleTag'))}</span>` : ''}
                <span class="quote-nick">— ${esc(r.nickname)}・${fmtDate(r.created)}</span>
              </span>
            </button>`;
        }).join('')}
      </div>`;
  }

  function renderHome() {
    const hot = hotPicks(6);
    const avoid = avoidList(5);
    appEl.innerHTML = `
      <section class="hero">
        <div class="wrap hero-grid">
          <div class="hero-copy">
            <h1 class="hero-title">${esc(I18N.t('heroTitle'))}</h1>
            <p class="hero-sub">${esc(I18N.t('heroSub'))}</p>
            <div class="hero-actions">
              <a class="btn btn-butter" href="#canteens">${esc(I18N.t('heroCta1'))}</a>
              <button class="btn btn-ghost-butter" data-action="open-random">${icon('dice')}${esc(I18N.t('heroCta2'))}</button>
            </div>
          </div>
          ${heroPhotos()}
        </div>
      </section>

      <section class="section wrap" id="canteens">
        ${sectionHead('canteensHeading', 'canteensHeadingEn')}
        <div class="canteen-grid">
          ${DATA.canteens.map(canteenCard).join('')}
        </div>
      </section>

      ${hot.length ? `
      <section class="section wrap">
        ${sectionHead('hotHeading', 'hotHeadingEn', 'hotSub')}
        <div class="h-scroll">
          ${hot.map(dishCard).join('')}
        </div>
      </section>` : ''}

      ${avoid.length ? `
      <section class="avoid-band">
        <div class="wrap">
          ${sectionHead('avoidHeading', 'avoidHeadingEn', 'avoidSub')}
          <ol class="avoid-list">
            ${avoid.map((d, i) => {
              const c = canteenById(d.canteenId);
              const s = state.stats[d.id];
              const avoidVotes = Math.max(1, Math.round(s.count * s.avoidRatio));
              return `
              <li class="avoid-row reveal">
                <span class="avoid-rank" aria-hidden="true">${i + 1}</span>
                <button class="avoid-dish" data-action="open-dish" data-id="${d.id}">
                  <span class="avoid-dish-name">${esc(I18N.pick(d))}<span class="avoid-dish-en">${esc(d.en)}</span></span>
                  <span class="avoid-dish-meta">${esc(c ? c.short : '')}・${fmtPrice(d.price)}</span>
                </button>
                <span class="avoid-votes">${icon('bolt')}<b>${avoidVotes}</b><i>${esc(I18N.t('avoidVotes'))}</i></span>
              </li>`;
            }).join('')}
          </ol>
        </div>
      </section>` : ''}

      <section class="section wrap">${latestReviewCards()}</section>
      ${renderFooter()}`;
    bindReveals();
  }

  /* ── 畫面：飯堂頁 ────────────────────────── */

  function getFilter(canteenId) {
    if (!state.filters[canteenId]) state.filters[canteenId] = { cat: null, sort: 'popular' };
    return state.filters[canteenId];
  }

  function renderCanteen(canteenId) {
    const c = canteenById(canteenId);
    if (!c) { location.hash = '#/'; return; }
    const f = getFilter(canteenId);
    let dishes = DATA.dishes.filter((d) => d.canteenId === canteenId);
    if (f.cat) dishes = dishes.filter((d) => d.cat === f.cat);

    const stat = (d) => state.stats[d.id] || { count: 0, avg: 0 };
    if (f.sort === 'popular') dishes.sort((a, b) => stat(b).count - stat(a).count || stat(b).avg - stat(a).avg);
    else if (f.sort === 'rating') dishes.sort((a, b) => stat(b).avg - stat(a).avg || stat(b).count - stat(a).count);
    else if (f.sort === 'price') dishes.sort((a, b) => a.price - b.price);

    const chips = [{ id: null, zh: I18N.t('filterAll'), en: I18N.t('filterAll') }]
      .concat(DATA.categories)
      .map((cat) => {
        const n = DATA.dishes.filter((d) => d.canteenId === canteenId && (!cat.id || d.cat === cat.id)).length;
        if (cat.id && !n) return '';
        return `
          <button class="chip ${f.cat === cat.id ? 'chip-on' : ''}" data-action="set-cat" data-id="${cat.id || ''}">
            ${esc(I18N.pick(cat))}<i>${n}</i>
          </button>`;
      }).join('');

    const sorts = [
      { id: 'popular', key: 'sortPopular' },
      { id: 'rating', key: 'sortRating' },
      { id: 'price', key: 'sortPriceAsc' },
    ].map((s) => `<option value="${s.id}" ${f.sort === s.id ? 'selected' : ''}>${esc(I18N.t(s.key))}</option>`).join('');

    let gridHtml = '';
    if (!dishes.length) {
      gridHtml = `<p class="empty-note">${esc(I18N.t('noResult'))}</p>`;
    } else if (f.cat) {
      gridHtml = `<div class="dish-grid">${dishes.map(dishCard).join('')}</div>`;
    } else {
      gridHtml = DATA.categories.map((cat) => {
        const list = dishes.filter((d) => d.cat === cat.id);
        if (!list.length) return '';
        return `
          <div class="cat-group">
            <h3 class="cat-head">${esc(I18N.pick(cat))}<span class="cat-head-en">${esc(cat.en)}</span><i>${list.length}</i></h3>
            <div class="dish-grid">${list.map(dishCard).join('')}</div>
          </div>`;
      }).join('');
    }

    appEl.innerHTML = `
      <section class="canteen-band canteen-band-${c.color}">
        <div class="wrap">
          <a class="crumb" href="#/">${icon('back')}${esc(I18N.t('backHome'))}</a>
          <div class="canteen-band-grid">
            <div class="canteen-band-copy">
              <span class="canteen-code">${esc(c.short)}</span>
              <h1 class="canteen-name">${esc(I18N.lang() === 'zh' ? c.zh : c.en)}</h1>
              <p class="canteen-bldg">${icon('pin')}${esc(I18N.lang() === 'zh' ? c.bldgZh : c.bldgEn)}</p>
              <p class="canteen-hours">${icon('clock')}${esc(I18N.lang() === 'zh' ? c.hoursZh : c.hoursEn)}</p>
              ${c.orderUrl ? `<a class="order-link" href="${esc(c.orderUrl)}" target="_blank" rel="noopener">${esc(I18N.t('officialOrdering'))}${icon('ext')}</a>` : ''}
            </div>
            <figure class="canteen-band-photo"><img src="${esc(c.photo)}" alt="${esc(I18N.lang() === 'zh' ? c.zh : c.en)}"></figure>
          </div>
        </div>
      </section>

      <div class="filter-bar">
        <div class="wrap filter-bar-row">
          <div class="chips">${chips}</div>
          <label class="sort-box">
            <span>${esc(I18N.t('sortLabel'))}</span>
            <select data-action="set-sort">${sorts}</select>
          </label>
        </div>
      </div>

      <section class="section wrap">${gridHtml}</section>
      ${renderFooter()}`;
    bindReveals();
  }

  /* ── 頁尾 ──────────────────────────────── */

  function renderFooter() {
    const samplesHidden = !state.reviews.some((r) => r.sample);
    return `
      <footer class="footer">
        <div class="wrap footer-grid">
          <div>
            <p class="footer-brand"><span class="seal seal-sm" aria-hidden="true">食</span>${esc(I18N.t('siteName'))}</p>
            <p class="footer-note">${esc(I18N.t('footerNote'))}</p>
          </div>
          <div class="footer-links">
            <a href="https://www.cityu.edu.hk/zh-hk/directories/catering" target="_blank" rel="noopener">${esc(I18N.t('footerOfficial'))}${icon('ext')}</a>
            <button class="linklike" data-action="toggle-samples">${esc(I18N.t(samplesHidden ? 'footerSamplesShown' : 'footerSamplesHidden'))}</button>
            <span class="footer-storage">${esc(I18N.t(store.remoteAvailable() ? 'footerStorageCloud' : 'footerStorageLocal'))}</span>
          </div>
        </div>
      </footer>`;
  }

  /* ── 菜品詳情 modal ──────────────────────── */

  function openDish(dishId) {
    const d = dishById(dishId);
    if (!d) return;
    state.modalReturnFocus = document.activeElement;
    const c = canteenById(d.canteenId);
    const s = state.stats[d.id] || { count: 0, avg: 0, dist: [0, 0, 0, 0, 0], verdict: null };
    const rs = dishReviews(d.id);

    const distRows = [5, 4, 3, 2, 1].map((star) => {
      const n = s.dist[star - 1] || 0;
      const pct = s.count ? (n / s.count) * 100 : 0;
      return `
        <div class="dist-row">
          <span class="dist-star">${star}<i>${esc(I18N.t('starUnit'))}</i></span>
          <span class="dist-bar"><span style="width:${pct}%"></span></span>
          <span class="dist-n">${n}</span>
        </div>`;
    }).join('');

    const reviewList = rs.length ? rs.map((r) => `
      <li class="review-item">
        <div class="review-head">
          <span class="review-nick">${esc(r.nickname)}${r.sample ? `<i class="sample-flag">${esc(I18N.t('sampleTag'))}</i>` : ''}</span>
          <span class="review-date">${fmtDate(r.created)}</span>
        </div>
        <div class="review-stars">${starsSvg(r.rating)}${verdictTag(r.verdict)}</div>
        <p class="review-text">${esc(r.text)}</p>
      </li>`).join('')
      : `<li class="review-item review-empty">${esc(I18N.t('noReviewsYet'))}</li>`;

    modalRoot.innerHTML = `
      <div class="overlay" data-action="close-modal"></div>
      <div class="modal dish-modal" role="dialog" aria-modal="true" aria-label="${esc(I18N.pick(d))}">
        <button class="modal-close" data-action="close-modal" aria-label="${esc(I18N.t('close'))}">${icon('close')}</button>
        <div class="dish-modal-grid">
          <figure class="dish-modal-photo">
            ${dishPhoto(d, 'dish-modal-img')}
            ${priceTag(d.price)}
          </figure>
          <div class="dish-modal-info">
            <span class="dish-modal-canteen canteen-${c.color}">${esc(c.short)}・${esc(I18N.lang() === 'zh' ? c.zh : c.en)}</span>
            <h2 class="dish-modal-name">${esc(I18N.pick(d))}</h2>
            <p class="dish-modal-en">${esc(I18N.lang() === 'zh' ? d.en : d.zh)}</p>
            ${(d.descZh || d.descEn) ? `<p class="dish-modal-desc">${esc(I18N.lang() === 'zh' ? (d.descZh || d.descEn) : (d.descEn || d.descZh))}</p>` : ''}
            ${s.count ? `
            <div class="dish-modal-rating">
              <b class="avg">${s.avg.toFixed(1)}</b>
              <div>${starsSvg(s.avg)}<span class="count">${reviewCountText(s.count)}</span></div>
            </div>
            <div class="dist">${distRows}</div>` : ''}
          </div>
        </div>

        <div class="dish-modal-reviews">
          <h3 class="block-head">${esc(I18N.t('latestHeading'))}</h3>
          <ul class="review-list">${reviewList}</ul>
        </div>

        <form class="review-form" data-action="submit-review" data-dish="${d.id}" novalidate>
          <h3 class="block-head">${esc(I18N.t('formTitle'))}</h3>
          <p class="form-sub">${esc(I18N.t('formSub'))}</p>
          <fieldset class="star-field">
            <legend>${esc(I18N.t('formStars'))}</legend>
            <div class="star-input" role="radiogroup" aria-label="${esc(I18N.t('formStars'))}">
              ${[1, 2, 3, 4, 5].map((v) => `
                <button type="button" class="star-btn" role="radio" aria-checked="false" aria-label="${v}" data-value="${v}">${icon('star')}</button>`).join('')}
            </div>
          </fieldset>
          <fieldset class="verdict-field">
            <legend>${esc(I18N.t('formVerdict'))}</legend>
            <div class="verdict-input" role="radiogroup" aria-label="${esc(I18N.t('formVerdict'))}">
              <button type="button" class="verdict-opt verdict-opt-must" role="radio" aria-checked="false" data-value="must">${esc(I18N.t('verdictMust'))}</button>
              <button type="button" class="verdict-opt verdict-opt-ok" role="radio" aria-checked="false" data-value="ok">${esc(I18N.t('verdictOk'))}</button>
              <button type="button" class="verdict-opt verdict-opt-avoid" role="radio" aria-checked="false" data-value="avoid">${esc(I18N.t('verdictAvoid'))}</button>
            </div>
          </fieldset>
          <label class="nick-field">
            <span>${esc(I18N.t('formNickname'))}</span>
            <input type="text" name="nickname" maxlength="24" placeholder="${esc(I18N.t('formNicknamePlaceholder'))}">
          </label>
          <label class="text-field">
            <span>${esc(I18N.t('formText'))}</span>
            <textarea name="text" rows="3" maxlength="600" placeholder="${esc(I18N.t('formTextPlaceholder'))}" required></textarea>
          </label>
          <p class="form-error" hidden></p>
          <button class="btn btn-red" type="submit">${esc(I18N.t('formSubmit'))}</button>
        </form>
      </div>`;
    document.body.classList.add('modal-open');
    const closeBtn = modalRoot.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modalRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
    if (state.modalReturnFocus && document.contains(state.modalReturnFocus)) {
      state.modalReturnFocus.focus();
    }
    state.modalReturnFocus = null;
  }

  /* ── 今日食咩 modal ──────────────────────── */

  let rollToken = 0;

  function openRandom() {
    state.modalReturnFocus = document.activeElement;
    rollToken++;
    modalRoot.innerHTML = `
      <div class="overlay" data-action="close-modal"></div>
      <div class="modal random-modal" role="dialog" aria-modal="true" aria-label="${esc(I18N.t('randomTitle'))}">
        <button class="modal-close" data-action="close-modal" aria-label="${esc(I18N.t('close'))}">${icon('close')}</button>
        <h2 class="random-title">${esc(I18N.t('randomTitle'))}</h2>
        <p class="random-sub">${esc(I18N.t('randomSub'))}</p>
        <div class="random-scopes" role="radiogroup" aria-label="${esc(I18N.t('randomTitle'))}">
          <button class="chip chip-on" data-action="set-scope" data-id="">${esc(I18N.t('randomScopeAll'))}</button>
          ${DATA.canteens.map((c) => `<button class="chip" data-action="set-scope" data-id="${c.id}">${esc(c.short)}</button>`).join('')}
        </div>
        <div class="random-stage" aria-live="polite">
          <div class="random-dish" id="random-dish">
            <span class="random-flip">${esc(I18N.t('randomRoll'))}</span>
          </div>
          <span class="random-stamp-slot" id="random-stamp"></span>
        </div>
        <button class="btn btn-red btn-random" data-action="roll" id="roll-btn">${icon('dice')}${esc(I18N.t('randomRoll'))}</button>
        <div class="random-result-actions" id="random-actions"></div>
      </div>`;
    document.body.classList.add('modal-open');
    const closeBtn = modalRoot.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  async function roll() {
    const btn = document.getElementById('roll-btn');
    const flip = modalRoot.querySelector('.random-flip');
    const stage = document.getElementById('random-dish');
    const stampSlot = document.getElementById('random-stamp');
    const actions = document.getElementById('random-actions');
    if (!btn || !flip) return;

    const scope = modalRoot.querySelector('.random-scopes .chip-on');
    const scopeId = scope ? scope.getAttribute('data-id') : '';
    const pool = DATA.dishes.filter((d) => !scopeId || d.canteenId === scopeId);
    if (!pool.length) return;

    const token = ++rollToken;
    btn.disabled = true;
    btn.textContent = I18N.t('randomRolling');
    stage.classList.remove('landed');
    stampSlot.innerHTML = '';
    actions.innerHTML = '';

    const winner = pool[Math.floor(Math.random() * pool.length)];
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let t = 0;
    const duration = 1500;
    let i = 0;
    while (true) {
      const p = t / duration;
      if (p >= 1) break;
      const d = pool[i % pool.length];
      flip.textContent = I18N.pick(d);
      i++;
      const step = 55 + 320 * p * p;
      await delay(step);
      t += step;
    }
    if (token !== rollToken) return; // modal 已關

    flip.textContent = I18N.pick(winner);
    stage.classList.add('landed');
    stampSlot.innerHTML = `<span class="stamp stamp-must stamp-slam">${esc(I18N.t('randomPick'))}</span>`;
    btn.disabled = false;
    btn.innerHTML = `${ICONS.dice ? '<svg class="icn" viewBox="0 0 24 24" aria-hidden="true">' + ICONS.dice + '</svg>' : ''}${esc(I18N.t('randomAgain'))}`;
    actions.innerHTML = `
      <button class="linklike" data-action="open-dish" data-id="${winner.id}">${esc(I18N.t('randomView'))}${icon('arrow')}</button>`;
  }

  /* ── reveal 動效 ─────────────────────────── */

  let observer = null;
  function bindReveals() {
    const els = appEl.querySelectorAll('.reveal');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.remove('reveal-armed'));
      return;
    }
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { en.target.classList.add('in'); observer.unobserve(en.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    const effBottom = window.innerHeight * 0.92;
    const inRange = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < effBottom && r.bottom > 0;
    };
    els.forEach((el) => {
      if (inRange(el)) {
        el.classList.add('in'); // 首屏可見的內容永不隱藏
      } else {
        el.classList.add('reveal-armed');
        observer.observe(el);
      }
    });
    // 字體交換會令版面位移把元素帶入視口；IO 不一定重估，定時補漏
    setTimeout(() => {
      els.forEach((el) => {
        if (el.classList.contains('reveal-armed') && !el.classList.contains('in') && inRange(el)) {
          el.classList.add('in');
        }
      });
    }, 1400);
  }

  /* ── 路由 ──────────────────────────────── */

  function parseRoute() {
    const hash = location.hash || '#/';
    const m = hash.match(/^#\/canteen\/([\w-]+)/);
    if (m) state.route = { view: 'canteen', canteenId: m[1] };
    else state.route = { view: 'home', canteenId: null };
  }

  function render() {
    parseRoute();
    closeModal();
    if (state.route.view === 'canteen') renderCanteen(state.route.canteenId);
    else renderHome();
  }

  /* ── 事件 ──────────────────────────────── */

  function setStarInput(form, value) {
    form.querySelectorAll('.star-btn').forEach((b) => {
      const on = Number(b.getAttribute('data-value')) <= value;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', Number(b.getAttribute('data-value')) === value ? 'true' : 'false');
    });
  }

  document.addEventListener('click', async (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');

    if (action === 'open-dish') {
      e.preventDefault();
      openDish(actionEl.getAttribute('data-id'));
    } else if (action === 'close-modal') {
      if (e.target === actionEl || actionEl.classList.contains('modal-close') || actionEl.classList.contains('overlay')) closeModal();
    } else if (action === 'open-random') {
      openRandom();
    } else if (action === 'roll') {
      roll();
    } else if (action === 'set-scope') {
      modalRoot.querySelectorAll('.random-scopes .chip').forEach((c) => c.classList.remove('chip-on'));
      actionEl.classList.add('chip-on');
    } else if (action === 'set-cat') {
      const canteenId = state.route.canteenId;
      const f = getFilter(canteenId);
      f.cat = actionEl.getAttribute('data-id') || null;
      renderCanteen(canteenId);
    } else if (action === 'toggle-samples') {
      Reviews.toggleSamples();
      await loadReviews();
      render();
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('select[data-action="set-sort"]')) {
      const f = getFilter(state.route.canteenId);
      f.sort = e.target.value;
      renderCanteen(state.route.canteenId);
    }
  });

  document.addEventListener('click', (e) => {
    const starBtn = e.target.closest('.star-btn');
    if (starBtn) {
      const form = starBtn.closest('form');
      setStarInput(form, Number(starBtn.getAttribute('data-value')));
      return;
    }
    const verdictOpt = e.target.closest('.verdict-opt');
    if (verdictOpt) {
      verdictOpt.closest('.verdict-input').querySelectorAll('.verdict-opt').forEach((b) => {
        const on = b === verdictOpt;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-action="submit-review"]');
    if (!form) return;
    e.preventDefault();
    const errEl = form.querySelector('.form-error');
    const dishId = form.getAttribute('data-dish');
    const stars = form.querySelectorAll('.star-btn');
    const rating = (() => {
      let picked = 0;
      stars.forEach((b) => { if (b.classList.contains('on')) picked = Math.max(picked, Number(b.getAttribute('data-value'))); });
      return picked;
    })();
    const verdictBtn = form.querySelector('.verdict-opt.on');
    const text = form.querySelector('textarea[name="text"]').value;
    const nickname = form.querySelector('input[name="nickname"]').value;

    const fail = (msgKey) => {
      errEl.textContent = I18N.t(msgKey);
      errEl.hidden = false;
    };
    if (!rating) return fail('errNeedRating');
    if (!text || text.trim().length < 2) return fail('errNeedText');
    errEl.hidden = true;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = I18N.t('formSubmitting');
    try {
      await store.add({
        dishId, rating, verdict: verdictBtn ? verdictBtn.getAttribute('data-value') : 'ok',
        nickname, text,
      });
      await loadReviews();
      // 重開 modal 顯示新評論
      const canteenId = dishById(dishId).canteenId;
      if (state.route.view === 'canteen') renderCanteen(canteenId);
      else renderHome();
      openDish(dishId);
      const banner = document.createElement('p');
      banner.className = 'form-thanks';
      banner.textContent = I18N.t('formThanks');
      const reopenedForm = modalRoot.querySelector('.review-form');
      if (reopenedForm) reopenedForm.prepend(banner);
    } catch (err) {
      errEl.textContent = I18N.t('errNetwork');
      errEl.hidden = false;
      btn.disabled = false;
      btn.textContent = orig;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalRoot.innerHTML) closeModal();
    if (e.key === 'Tab' && modalRoot.innerHTML) {
      const focusables = modalRoot.querySelectorAll('button, input, textarea, select, a[href]');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener('hashchange', render);
  I18N.onChange(() => { renderHeader(); render(); });

  /* ── 頁首 ──────────────────────────────── */

  function renderHeader() {
    const header = document.getElementById('site-header');
    header.innerHTML = `
      <div class="wrap header-row">
        <a class="masthead" href="#/">
          <span class="seal" aria-hidden="true">食</span>
          <span class="masthead-name">${esc(I18N.t('siteName'))}</span>
        </a>
        <nav class="header-nav" aria-label="${esc(I18N.t('navCanteens'))}">
          ${DATA.canteens.map((c) => `<a class="header-link" href="#/canteen/${c.id}">${esc(c.short)}</a>`).join('')}
        </nav>
        <div class="header-actions">
          <button class="lang-btn" data-action-lang aria-label="${esc(I18N.t('langBtnLabel'))}">${esc(I18N.t('langBtn'))}</button>
          <button class="btn btn-red btn-random-header" data-action="open-random">${icon('dice')}<span>${esc(I18N.t('navRandom'))}</span></button>
        </div>
      </div>`;
    header.querySelector('[data-action-lang]').addEventListener('click', () => I18N.toggle());
  }

  /* ── 啟動 ──────────────────────────────── */

  async function boot() {
    renderHeader();
    await loadReviews();
    render();
  }
  boot();
})();
