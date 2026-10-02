/* 城大搵食指南 CityU Eats — 中英雙語
 * I18N.t(key) 取字；I18N.lang() 現在語言；I18N.set(lang) 切換並廣播 'langchange'。
 */
(function () {
  'use strict';
  const CFG = window.CITYU_EATS_CONFIG;

  const DICT = {
    /* 頁首 */
    siteName: { zh: '城大搵食指南', en: 'CityU Eats' },
    navCanteens: { zh: '三個飯堂', en: 'Canteens' },
    navAvoid: { zh: '避雷榜', en: 'Avoid List' },
    navRandom: { zh: '今日食咩', en: 'What to Eat Today' },
    langBtn: { zh: 'EN', en: '中' },
    langBtnLabel: { zh: '切換至英文', en: 'Switch to Chinese' },

    /* 首頁 hero */
    heroTitle: { zh: '今日，食咩好？', en: 'What to eat today?' },
    heroSub: {
      zh: 'AC1、AC2、AC3 三個飯堂嘅菜單同真實評價，一站式睇晒，唔使再靠估。',
      en: 'Menus and honest student reviews for all three canteens — AC1, AC2 and AC3 — in one place. No more guessing.',
    },
    heroCta1: { zh: '睇三個飯堂', en: 'Browse canteens' },
    heroCta2: { zh: '幫我揮：今日食咩', en: 'Pick for me: what to eat' },

    /* 飯堂卡 */
    canteensHeading: { zh: '三個飯堂', en: 'Three canteens' },
    canteensHeadingEn: { zh: 'CANTEENS', en: 'CANTEENS' },
    dishesCount: { zh: '道菜', en: ' dishes' },
    openNow: { zh: '營業中', en: 'Open now' },
    closedNow: { zh: '休息中', en: 'Closed now' },
    officialOrdering: { zh: '官方網上點餐', en: 'Official online ordering' },

    /* 熱門 */
    hotHeading: { zh: '今日熱門', en: 'Hot picks' },
    hotHeadingEn: { zh: 'HOT PICKS', en: 'HOT PICKS' },
    hotSub: { zh: '評價最多、評分最高嘅菜品', en: 'Most reviewed, highest rated' },
    latestHeading: { zh: '最新評論', en: 'Latest reviews' },
    latestHeadingEn: { zh: 'LATEST', en: 'LATEST' },
    sampleTag: { zh: '範例', en: 'Sample' },
    yourTag: { zh: '你', en: 'You' },

    /* 避雷榜 */
    avoidHeading: { zh: '避雷排行榜', en: 'Avoid list' },
    avoidHeadingEn: { zh: 'AVOID LIST', en: 'AVOID LIST' },
    avoidSub: { zh: '同學親測後勸你三思嘅菜品——慳返啲飯錢。', en: 'Dishes reviewers say to think twice about — save your lunch money.' },
    avoidEmpty: { zh: '暫時冇菜入榜，即管放心試。', en: 'Nothing to avoid yet — go ahead and try.' },
    avoidVotes: { zh: '人勸退', en: ' votes to avoid' },

    /* 隨機器 */
    randomTitle: { zh: '今日食咩？', en: 'What to eat today?' },
    randomSub: { zh: '揀個範圍，㩒紅掣，交畀天意。', en: 'Choose a scope, hit the red button, leave it to fate.' },
    randomScopeAll: { zh: '三個飯堂', en: 'All canteens' },
    randomRoll: { zh: '開滾！', en: 'Roll!' },
    randomRolling: { zh: '揀緊…', en: 'Rolling…' },
    randomAgain: { zh: '再滾一次', en: 'Roll again' },
    randomView: { zh: '睇呢道菜', en: 'View this dish' },
    randomPick: { zh: '今日之選', en: "TODAY'S PICK" },

    /* 飯堂頁 */
    backHome: { zh: '回首頁', en: 'Home' },
    filterAll: { zh: '全部', en: 'All' },
    sortLabel: { zh: '排序', en: 'Sort' },
    sortPopular: { zh: '最多評論', en: 'Most reviewed' },
    sortRating: { zh: '最高評分', en: 'Top rated' },
    sortPriceAsc: { zh: '最平先', en: 'Price: low first' },
    noResult: { zh: '呢個分類暫時冇菜。', en: 'No dishes in this category yet.' },
    reviewsCountSuffix: { zh: '則評論', en: ' reviews' },
    noReviewsYet: { zh: '未有評論——做第一個講真話嘅人。', en: 'No reviews yet — be the first to tell the truth.' },

    /* 判定 */
    verdictMust: { zh: '必食', en: 'MUST EAT' },
    verdictOk: { zh: '普通', en: 'OK' },
    verdictAvoid: { zh: '避雷', en: 'AVOID' },
    ratingDistribution: { zh: '評分分佈', en: 'Rating breakdown' },
    avgRating: { zh: '平均', en: 'avg' },

    /* 評論表單 */
    formTitle: { zh: '寫評論', en: 'Write a review' },
    formSub: { zh: '你嘅一句話，幫到成個 campus 搵食。', en: 'Your one line helps the whole campus eat better.' },
    formStars: { zh: '評分', en: 'Rating' },
    formVerdict: { zh: '你會點講？', en: 'Your verdict' },
    formNickname: { zh: '暱稱（可留空＝匿名同學）', en: 'Nickname (leave blank to stay anonymous)' },
    formNicknamePlaceholder: { zh: '匿名同學', en: 'Anonymous student' },
    formText: { zh: '評語', en: 'Your review' },
    formTextPlaceholder: {
      zh: '講吓份量、味道、等幾耐、抵唔抵……',
      en: 'Portion, taste, wait time, value for money…',
    },
    formSubmit: { zh: '出評論', en: 'Post review' },
    formSubmitting: { zh: '出緊…', en: 'Posting…' },
    errNeedRating: { zh: '請先㩒星評分。', en: 'Please tap a star rating first.' },
    errNeedText: { zh: '寫低至少幾隻字先出得。', en: 'Write at least a few words before posting.' },
    errNetwork: { zh: '出唔到評論，請再試一次。', en: 'Could not post the review, please try again.' },
    formThanks: { zh: '已出！多謝你餵靚資料。', en: 'Posted — thanks for feeding the campus.' },

    /* 頁尾 */
    footerNote: {
      zh: '學生自製網站，非官方。AC1 菜單於 2026-10-02 從官方點餐站抄錄，AC2／AC3 為代表性資料；價錢以飯堂現場為準。',
      en: 'A student-built, unofficial site. AC1 menu copied from the official ordering site on 2026-10-02; AC2/AC3 entries are representative — prices at the counter apply.',
    },
    footerSamplesHidden: { zh: '隱藏範例評論', en: 'Hide sample reviews' },
    footerSamplesShown: { zh: '顯示範例評論', en: 'Show sample reviews' },
    footerStorageLocal: { zh: '評論暫存於你的瀏覽器', en: 'Reviews stored in your browser' },
    footerStorageCloud: { zh: '評論已雲端共享（Supabase）', en: 'Reviews shared via Supabase' },
    footerOfficial: { zh: '官方餐廳資訊', en: 'Official catering info' },

    /* 通用 */
    close: { zh: '關閉', en: 'Close' },
    starUnit: { zh: '星', en: 'star' },
    pricePrefix: { zh: '$', en: '$' },

    /* 標籤 */
    tagSignature: { zh: '招牌', en: 'SIGNATURE' },
    tagSpicy: { zh: '辣', en: 'Spicy' },
    tagValue: { zh: '抵食', en: 'Value' },
    tagSweet: { zh: '甜', en: 'Sweet' },
  };

  let current = 'zh';
  try {
    const saved = localStorage.getItem(CFG.LANG_KEY);
    if (saved === 'en' || saved === 'zh') current = saved;
    else if (navigator.language && /^en/i.test(navigator.language)) current = 'en';
  } catch (e) { /* 預設繁中 */ }

  const listeners = [];

  window.I18N = {
    t(key) {
      const entry = DICT[key];
      if (!entry) return key;
      return entry[current] || entry.zh || key;
    },
    pick(obj) {
      if (!obj) return '';
      return current === 'en' ? (obj.en ?? obj.zh ?? '') : (obj.zh ?? obj.en ?? '');
    },
    lang() { return current; },
    set(lang) {
      if (lang !== 'zh' && lang !== 'en') return;
      current = lang;
      try { localStorage.setItem(CFG.LANG_KEY, lang); } catch (e) { /* ignore */ }
      document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
      for (const fn of listeners) fn(lang);
    },
    toggle() { this.set(current === 'zh' ? 'en' : 'zh'); },
    onChange(fn) { listeners.push(fn); },
  };
  document.documentElement.lang = current === 'zh' ? 'zh-Hant' : 'en';
})();
