---
name: 城大搵食指南 CityU Eats
description: 溫暖食誌風的校園飯堂菜單與評論站 — 奶油紙底、整片色域、印章判定
colors:
  paper: "#FBF2DF"
  paper-2: "#F5E8CC"
  card: "#FFFDF4"
  ink: "#2B1A0E"
  ink-70: "rgba(43, 26, 14, 0.7)"
  ink-55: "rgba(43, 26, 14, 0.55)"
  ink-25: "rgba(43, 26, 14, 0.25)"
  ink-14: "rgba(43, 26, 14, 0.14)"
  muted: "#6E5637"
  red: "#C93A1D"
  red-deep: "#A32B12"
  red-tint: "#F7DFD3"
  butter: "#FFF3DC"
  yolk: "#F2B21B"
  yolk-deep: "#C8880A"
  mint: "#2E7D6B"
  mint-deep: "#1F5C4D"
  dark: "#241608"
  ac1: "#C93A1D"
  ac2: "#DD9A08"
  ac3: "#2E7D6B"
typography:
  display:
    fontFamily: "Noto Serif TC, Songti TC, serif"
    fontSize: "clamp(2.625rem, 5.6vw, 4.75rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Noto Serif TC, Songti TC, serif"
    fontSize: "clamp(1.625rem, 3vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 1.25
  title:
    fontFamily: "Noto Sans TC, PingFang TC, system-ui, sans-serif"
    fontSize: "0.969rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Noto Sans TC, PingFang TC, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Bricolage Grotesque, Noto Sans TC, sans-serif"
    fontSize: "0.813rem"
    fontWeight: 700
    letterSpacing: "0.17em"
rounded:
  sm: "8px"
  md: "14px"
  lg: "18px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "18px"
  lg: "30px"
  xl: "clamp(44px, 7vw, 76px)"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.butter}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-secondary:
    backgroundColor: "{colors.butter}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  card-dish:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "13px 15px 15px"
  stamp-must:
    backgroundColor: "rgba(201, 58, 29, 0.07)"
    textColor: "{colors.red}"
    rounded: "{rounded.sm}"
    padding: "4px 11px"
---

# Design System: 城大搵食指南 CityU Eats

## Overview

**Creative North Star: 「貼在飯堂門口的熱門食誌」— a zine pinned to the canteen door**

The system reads like a warm Hong Kong food zine that happens to be a utility: a butter-eggshell paper ground on which whole regions of saturated color do the talking — a full-bleed char-siu-tomato hero band, a soy-ink avoid-list panel, a dark ink footer. Verdicts are stamped like real chop marks (slightly rotated, double-ringed), prices are egg-yolk stickers, and food photography is the protagonist everywhere else. Density is airy at the section level and tight inside cards; the mood is appetite first, scaffolding never.

Color commits at page scale. The ground carries warmth, but identity is carried by the region fields — if a screenshot reads as "cream page with accents", the strategy has failed.

**Key Characteristics:**
- Whole-region color fields (tomato hero, ink avoid band, per-canteen tint bands) on a warm paper ground
- Stamp/chop language for verdicts: 2–3° rotation, double ring (border + inset ring), uppercase-ish letter-spacing
- Egg-yolk price stickers and signature flags overlapping photos
- Editorial serif TC display against grotesque EN labels set inline with headings (never above them)
- One authored motion moment (the slot-roll + stamp slam); everything else decelerates smoothly

## Colors

A warm, food-forward palette: paper neutrals, one appetite-driving red family, an egg-yolk amber for stickers and stars, a mint-tile green as the secondary, and a soy-ink dark for the two anchoring bands.

### Primary
- **Char-siu Tomato** (#C93A1D): the hero band ground, primary buttons, the 必食 stamp, signature flags. Owns whole regions, not sprinkles. Deepened (#A32B12) for small text on paper (AA) and hover.
- **Butter Cream** (#FFF3DC): text and ghost-button borders on the red band; secondary button ground.

### Secondary
- **Egg Yolk** (#F2B21B): price stickers, star fill (deepened #C8880A for AA on paper), ranking numerals on dark, chip counts on ink. Always paired with ink text.
- **Mint Tile** (#2E7D6B): AC3's canteen accent, success/thanks banner. Deepened (#1F5C4D) for text use.

### Tertiary
- **Canteen Accents** — AC1 (#C93A1D), AC2 (#DD9A08, ink text on it), AC3 (#2E7D6B): used only inside canteen-scoped components (code chips, hover borders, band tints #F9E2D2 / #FBF0CE / #DFEEE6). Three canteens, three hues, equal billing.

### Neutral
- **Butter Paper** (#FBF2DF): page ground. **Card Cream** (#FFFDF4): cards and inputs. **Tan Panel** (#F5E8CC): photo fallbacks, bars, scrollbar track.
- **Soy Ink** (#2B1A0E): all text, primary filter chips, the avoid band and footer grounds (dark: #241608). Opacity steps (70/55/25/14%) for secondary text, borders, hairlines — never gray.
- **Muted Soy** (#6E5637): captions, meta rows.

### Named Rules
**The Region-Field Rule.** Saturated color owns whole page regions (hero, avoid band, footer); it is never reduced to scattered accents on naked ground.
**The Chop Rule.** A verdict is a stamp: `border: 2.2px solid currentColor` + `box-shadow: inset 0 0 0 1px` (must) + rotation −2.5°. No plain pills for verdicts.
**The Warm-Gray Ban.** Secondary text tints from ink (rgba soy), never from gray — the page must stay warm at every opacity.

## Typography

**Display Font:** Noto Serif TC (fallback Songti TC, serif) — weights 900/700
**Body Font:** Noto Sans TC (fallback PingFang TC, system-ui) — weights 400/500/700
**Label/Numeric Font:** Bricolage Grotesque (fallback Noto Sans TC) — weights 600–800

**Character:** A heavy editorial TC serif speaks; a contemporary grotesque annotates. English labels ride inline beside Chinese headings at baseline (never as eyebrows above), letter-spaced caps in deep red.

### Hierarchy
- **Display** (900, clamp(42px→76px), lh 1.1): hero headline only, one per page.
- **Headline** (900, 26→36px / 22px category heads, lh 1.25–1.3): section and category titles; EN label inline after, 12–13px caps +0.16–0.17em tracking.
- **Title** (700, 15.5px / 700–900, 24px): dish names on cards; canteen names (900).
- **Body** (400, 16px base, lh 1.65; card copy 14–14.5px): descriptions, reviews at 14.5px/1.75.
- **Label** (700, 12–13.5px, caps, +0.08–0.17em): Bricolage for EN labels, canteen codes, ranks, and all numerals (`font-variant-numeric: tabular-nums` on prices, ranks, counts).

### Named Rules
**The Inline-Label Rule.** English section labels sit on the same line as the Chinese heading, baseline-aligned, deep red — an eyebrow above a heading is a defect.
**The Tabular Price Rule.** Every repeating numeral (prices, ranks, star counts, distribution counts) is set in Bricolage with tabular figures.

## Layout

Single centered container, max 1200px, side padding clamp(18px, 4vw, 40px). Section rhythm: generous top, tighter bottom (`padding-block: clamp(44px,7vw,76px) → clamp(20px,3vw,32px)`); more space above a heading than below it. Grids: canteen cards 3-col (1-col ≤1020px); dish grids 3-col → 2-col ≤1020px → 2-col tight (10px gap) ≤480px; review wall 3→2→1. Hot-picks rail is a horizontal snap-scroll (`grid-auto-flow: column`, 225–240px columns). Sticky chrome: header 64px; the canteen filter bar sticks directly beneath it (top: 64px). Hero band is full-bleed red with a 1.15fr/0.85fr copy-photo split, collapsing to a single column ≤760px (photo cluster shrinks to two photos, third hidden).

## Elevation & Depth

Hybrid, restrained. Depth comes primarily from region-field contrast and 1.5px ink borders; shadows are soft, always offset with real blur (`--shadow-soft: 0 14px 30px rgba(43,26,14,.13)`, `--shadow-lift: 0 8px 18px rgba(43,26,14,.10)`), and appear on hover or on floating layers (hero polaroids, modals, buttons) — never as decoration at rest.

**Exception (committed ephemera):** exactly two hard-offset shadows survive as print-ephemera tokens — the red seal (`2px 3px 0`) and the price sticker (`1.5px 2.5px 0`). Nothing else may use a zero-blur offset shadow.

### Shadow Vocabulary
- **Soft field** (`0 14px 30px rgba(43,26,14,0.13)`): canteen/dish card hover lift.
- **Lift** (`0 8px 18px rgba(43,26,14,0.10)`): quote-card hover, band photo, static floating layers.
- **Button float** (`0 6px 16px rgba(43,26,14,0.20)`, deepens on hover): solid buttons.
- **Polaroid** (`0 18px 34px rgba(43,26,14,0.35)`): hero photo cluster only, on the red field.

## Shapes

Rounded but editorial: cards 14px, modals 18px, interactive pills (buttons, chips, stickers, scrollbar) 999px, stamps and small flags 8px. Borders are 1.5px ink at 25% opacity on light grounds; hairlines inside components are 1–1.5px ink at 14%; on the dark band, hairlines flip to butter at 16%. Rotation is part of the chop/sticker language — stamps −2.5°, code chips −2°, price stickers +3°, hero polaroids −5°/+4°/−2° — and nowhere else: photos in lists and detail views stay straight.

## Components

### Buttons
- **Shape:** full pill (999px), padding 12px 22px, font 600 15.5px.
- **Primary:** char-siu red ground, butter text, soft float shadow; hover deepens to #A32B12 and lifts −2px; disabled at 55% opacity with wait cursor.
- **Secondary (on red band):** butter ground with ink text, or 2px butter ghost; same geometry.
- **Focus:** 2.5px red outline, offset 2.5px (butter-context elements inherit the same system).

### Chips
- **Style:** 1.5px ink-25 border pill, min-height 44px, transparent ground, count in Bricolage 11.5px muted.
- **State:** selected = ink ground, paper text, yolk count. Filter chips scroll horizontally with hidden scrollbars; scope chips (randomizer) center.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** card cream (#FFFDF4) on paper ground.
- **Border:** 1.5px ink-25; hover shifts toward canteen accent (canteen cards) or ink-55 (dish cards).
- **Shadow Strategy:** appears on hover only (soft field).
- **Internal Padding:** 13–22px by component; dish-card media is a strict 4:3 crop (`flex:none; overflow:hidden`) with yolk price sticker top-right and 招牌 flag top-left.

### Inputs / Fields
- **Style:** 1.5px ink-25 stroke, card-cream ground, 10px radius, 11px 13px padding, red caret.
- **Focus:** red border + `0 0 0 3px rgba(201,58,29,.14)` ring. Placeholder ink at 70%.
- **Rating input:** 30px star glyphs, 7px hit padding (44px targets); verdict options are stamp-styled 44px-min toggles with per-verdict selected states.
- **Error / Success:** inline red-deep error text; success banner is mint-tint with mint border.

### Stamps (signature component)
- **必食 MUST / 普通 OK / 避雷 AVOID:** 2.2px currentColor border, 8px radius, 700 13px +0.08em, rotated −2.5°; 必食 carries the inset second ring; sizes down to 11.5px for card use. The randomizer slams a 今日之選 stamp with a scale 2.8→1 decelerating animation.

### Navigation
- Sticky paper header, 64px: red seal (食, rotated −3°, hard-offset shadow allowed) + serif masthead 23px; canteen quick-links as quiet 13.5px grotesque pills; 44px round language toggle; red pill CTA. Mobile: nav links drop, CTA collapses to icon.

## Do's and Don'ts

### Do:
- **Do** own whole regions with color — hero band, avoid band, footer are fields, not accents.
- **Do** stamp verdicts (border + inset ring + rotation) and set every numeral in Bricolage tabular figures.
- **Do** keep motion to one authored moment per view; everything else eases out exponentially (`cubic-bezier(.16,1,.3,1)`).
- **Do** tint secondary text from soy ink at 55–70%; keep photos straight except the hero cluster and chop ephemera.

### Don't:
- **Don't** put an English label (eyebrow) above a Chinese heading — inline, baseline, after.
- **Don't** use gray text or zero-blur offset shadows outside the seal/sticker exception.
- **Don't** fake material: no gradient text, no glass/blur decoration, no CSS bevels or faux-print textures — warmth comes from the palette and the stamps, not effects.
- **Don't** give one canteen more visual authority than another; accents are a three-way system.
