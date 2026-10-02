# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static vanilla HTML/CSS/JS, no build step, served with `python -m http.server`. User confirmed via approved plan (2026-10-02). Matches their existing workflow (study-cafe-timer project). Reviews persist via a storage-adapter layer: localStorage by default, Supabase adapter included but dormant until the user supplies keys in `js/config.js` (SQL setup script provided).

## Users

Primary: CityU HK students (local and non-local) deciding where and what to eat among the campus's three canteens, usually on mobile between classes or before the lunch rush. Secondary: staff and visitors. Confirmed need: only AC1 has an official online menu; AC2 and AC3 have none, so students risk arriving and finding nothing they want. Users also want honest peer signals on what is good and what to avoid (避雷).

## Product Purpose

One site that shows all three canteens' dishes, organized by canteen and by dish category, with a star-rating review system per dish carrying 必食／普通／避雷 verdicts. Success: a student decides what to eat in under a minute, trusts the verdicts, and AC2/AC3 get menu visibility equal to AC1's.

## Positioning

The only place all three CityU canteens' menus sit side by side with student verdicts. The official campus site covers AC1 (and is an ordering platform, not a browsing/review experience); nothing covers AC2/AC3 at all. A neighbour could copy the menu list, but not the aggregated 必食/避雷 verdict layer over all three canteens.

## Operating Context

Browsed on phones (dominant) and laptops, in short bursts (lift rides, before class). Bilingual audience: Traditional Chinese primary, full English toggle confirmed. Runs as a purely static site day one: menu data lives in one hand-editable JS file (`js/menu-data.js`); reviews made in-browser persist to localStorage (per-browser, not shared) until the owner switches on the included Supabase adapter for shared cloud reviews. No login in v1 — reviewers type a nickname or stay anonymous.

## Capabilities and Constraints

Confirmed v1 scope:
- Browse dishes grouped by canteen (AC1 城大食坊／康樂樓 5F, AC2 Canteen／李達三葉耀珍學術樓 3F, AC3 Bistro／劉鳴煒學術樓 7F, 週日休) and filter by dish category (中式／粉麵／西式／日韓／東南亞／小食／飲品甜品)
- Dish detail with price, stall, rating distribution, review list, review form (1–5 stars, 必食/普通/避雷 verdict, optional nickname, text)
- 避雷排行榜 (avoid-list ranking) and hot/top-rated sections on home
- 「今日食咩」random dish picker, optionally scoped to one canteen
- Full 中/EN interface toggle
- Responsive 390px–1440px

Constraints: no backend on day one; no photo uploads in v1; reviews are per-browser until Supabase is configured; sample seed reviews must be visibly labeled as 範例 (synthetic) and deletable.

Open decisions (explicitly deferred): real menu data collection per stall (seed data is representative, user will edit `menu-data.js`); user creating a Supabase project and supplying keys; dish photos to be replaced with real photos by the user.

## Brand Commitments

Name: 「城大搵食指南」/ "CityU Eats". Visual direction pinned by user (2026-10-02, chosen from three presented options): 溫暖食誌風 — warm food-zine feel, large display type, food photography as the visual protagonist, appetite-forward palette (warm cream/butter ground, tomato/char-siu red accent, egg-yolk yellow, ink text). Bilingual UI is a product commitment, not an afterthought.

## Evidence on Hand

Verified facts (2026-10-02 web research): AC1 = 城大食坊 City Express, 5/F Amenities Building 康樂樓, official online ordering at csd.order.place/home/store/112870, known for 車仔麵. AC2 Canteen = 3/F Li Dak Sum Yip Yio Chin Academic Building 李達三葉耀珍學術樓, 07:30–21:00 Mon–Sun, food court ~860 seats, famous for HK$30 雙餸飯 and 凍芒果蝦沙律. AC3 Bistro = 7/F Lau Ming Wai Academic Building 劉鳴煒學術樓, 07:30–21:00, closed Sundays & public holidays, known for 吞拿魚披薩. Official directory: cityu.edu.hk/zh-hk/directories/catering.

Absences future work must not fabricate: no real stall menus for AC2/AC3 (per-stall lists unverified); no real dish photography (placeholder stock photos, to be replaced); no real review content (seed reviews are synthetic and labeled); prices are representative approximations in HKD.

## Product Principles

1. 冇 menu 唔好靠估 — a student should never walk to a canteen and be disappointed; show what exists honestly, including what is not available.
2. Verdicts beat raw stars — 必食/普通/避雷 must be readable at a glance from any list view, not buried in detail pages.
3. 三個飯堂平起平坐 — AC2 and AC3 get equal visual billing with AC1; the site exists because they were invisible.
4. 十秒決策 — open to decision in seconds: scan, filter, decide. Expression never obscures the task.
5. Sample content is labeled, never passed off as real — synthetic reviews and placeholder photos are marked and replaceable in one file.

## Accessibility & Inclusion

Bilingual zh-Hant/EN throughout; non-local students are first-class users. WCAG AA contrast on text, semantic HTML landmarks, keyboard-reachable review form, visible focus states, touch targets ≥ 44px, ratings not conveyed by colour alone.
