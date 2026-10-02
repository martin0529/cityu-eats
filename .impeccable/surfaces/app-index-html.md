---
version: 1
slug: "app-index-html"
primary_target: "app/index.html"
related_targets: []
---

# Surface brief — CityU Eats (single-page app, hash-routed views)

## Scope & visitor mode
One static SPA: home (#/), canteen menu views (#/canteen/:id), dish detail modal, 隨機器 modal, bilingual zh-Hant/EN. Mode: **Operate** — the visitor's job is to decide what and where to eat in seconds; expression may never obscure task, state, or price. The home hero carries warm Persuade energy per the pinned direction, but every list state optimizes scanability.

## Audience / job / action / proof / constraints
- Audience: CityU students (local + non-local), mobile-first, short bursts between classes.
- Job: pick a canteen and a dish they will not regret; know what to avoid.
- Actions: switch language; pick a canteen card; filter by category; sort by rating; open dish; read verdicts; submit review (stars + 必食/普通/避雷 + nickname + text); use 隨機器; scan 避雷排行榜.
- Proof: per-dish verdict stamps with review counts; rating distributions; canteen facts (building, floor, hours) from verified research; sample reviews visibly labeled 範例.
- Constraints: static site, no backend day one; no photo uploads; reviews per-browser (localStorage) with Supabase adapter dormant; placeholder photos user-replaceable; WCAG AA; 390–1440px.

## Chosen direction & memorable moment
User-pinned (2026-10-02, chosen from three presented options): **溫暖食誌風** — warm HK food-zine. Committed rendition: butter/eggshell ground with color owned by whole regions (deep tomato-vermilion hero band, soy-ink 避雷榜 panel, footer); char-siu red stamp badges (必食) slightly rotated like real chops; egg-yolk price stickers; per-canteen accent hues (AC1 tomato / AC2 egg-yolk / AC3 mint-tile). Type: Noto Serif TC 900 display + Noto Sans TC body (zh); Bricolage Grotesque display/labels (en); WenKai-style accent if CDN verified. Memorable moment: 「今日食咩」slot-roll — names flip like a cha chaan teng board then a red 必食-style stamp slams onto the result.

## Direction contract
THESIS: 三個飯堂一份食誌 — the site reads like a warm campus food zine that happens to be a utility; refuse the neutral SaaS directory look (gray ground, icon cards, infinite grid) and refuse timid beige-with-accent where color fields could carry regions.

OWN-WORLD: butter-eggshell paper ground; whole-region color fields in deep tomato-vermilion, soy-brown ink, egg-yolk; char-siu red chop stamps (2° rotation, rough edge) for verdicts; egg-yolk oval price stickers; mint-tile green as AC3/secondary; heavy serif TC display against grotesque EN labels set inline with headings (no eyebrows above headings); photos cropped square with slight rotation in hero cluster only, straight in lists.

STORY: visitor lands, reads 今日，食咩好？, sees all three canteens equally billed with real facts, scans hot picks and the ink-black 避雷排行榜, opens a canteen, filters by craving, opens a dish, trusts the stamp verdicts because counts and distributions are visible, leaves their own review in under 30 seconds.

FIRST VIEWPORT (desktop 1440): top bar 64px — masthead 城大搵食指南 in Serif TC 900 (~34px) with red seal square "CityU Eats" at its left; right: 中/EN toggle + red pill button 今日食咩. Below, full-bleed tomato-vermilion hero band (~440px): left column headline 今日，食咩好？ (Serif TC 900, ~72px, butter text) + supporting line naming the three canteens + two actions (睇三個飯堂 primary-butter / 今日食咩 ghost); right: cluster of three rotated food photos (square, ~200px) with one red stamp overlay. Hero bottom edge straight, no gradient. Below the band begins the 三飯堂 strip (three content-rich cards) cut at the fold.

FORM: user-pinned 溫暖食誌風 from a three-option structured round (preview approved); no concept-seed key — pinned direction beats the roll. Code-led build (no image generation in this environment); FIRST VIEWPORT block plus the slot-roll signature interaction carry the ambition, audited at finish.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions
Real stall/dish names pending scrape of AC1 ordering site (fallback: clearly representative seed data in one editable file). Whether WenKai TC CDN font is reachable (checked in browser; fallback = Noto Serif TC italic weights). Supabase keys await user project creation.
