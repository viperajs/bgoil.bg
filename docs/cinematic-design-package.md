# BG OIL — Design Package (cinematic scroll site)

Tier 1, one continuous 6 second shot, scroll-scrubbed. Written before any generation.
Every line of copy here ships verbatim. Band ranges are starting points, validated by the flick test.

Deploy folder: `bgoil-cinematic/` (index.html + assets/). Raws and review frames: `review/` (outside deploy).

---

## 1. The brand premise

One word: **светло** (lit). Everything on the road at night is dark and closed. BG OIL is the one place
still lit, and the light is not decoration, it is the promise: fuel, coffee, a toilet, a mechanic, a bed,
at any hour on the clock. The whole page teaches that single idea. The 0-24 sign is the brand's own number,
so the page carries a live hour rail that proves it while the visitor reads.

Facts (from the project, all real): BG OIL, гр. Враца 3000, бул. Мито Орозов 34. 24/7.
Станция +359 878 618 640 · Хотел 087 8618625 · Сервиз +359 87 714 1742 · bgoil_3000@abv.bg ·
autoservice_1313@abv.bg · maps: https://maps.app.goo.gl/8KYkuhrDv4fAZLbn8 · слоган: Качеството над всичко.

**Claims to confirm with the owner before deploy:** current fuel prices, the 0.10 лв/л card discount,
"безплатен и охраняван паркинг", room availability without booking, truck parking space.

## 2. The palette as CSS tokens

Sampled from `public/fuel-station-reference.png`: night sky #03286E / #101F60, neon #C0333F / #C54C51,
warm canopy ceiling #857065 / #7A6D56.

```css
:root{
  --canvas:#060A18;         /* night sky, driven dark. never pure black */
  --canvas-deep:#04060F;    /* the well below the fold */
  --panel:#0E1428;          /* cards, raised surfaces */
  --panel-2:#141B33;
  --accent:#FF3A32;         /* neon red, text and glow (4.6:1 on canvas) */
  --accent-deep:#E01018;    /* CTA background, white label = 4.9:1 */
  --accent-hover:#FF5A4E;
  --accent-muted:rgba(255,58,50,.18);   /* borders, particles, whisper glow */
  --canopy:#FFE7C4;         /* the warm ceiling light */
  --text-primary:#EEF2FF;
  --text-secondary:#8E9BBF; /* 6.7:1 on canvas */
  --line:rgba(142,155,191,.16);
  --line-strong:rgba(142,155,191,.34);  /* interactive borders, 3:1 */
}
```

Accent doses only: the CTA, the hour marker, the price highlight, focus rings, the drop mark.

## 3. The type trio

All three carry Cyrillic, which is non-negotiable for Bulgarian.

- **Display: Oswald 500/600.** Condensed signage. It is the typography of road price boards and totems,
  which is exactly this brand's world. Uppercase headlines, tight tracking.
- **Body: Manrope 400/500/700.** Quiet, warm, geometric. Excellent Cyrillic.
- **Mono: JetBrains Mono 400/500.** Prices, litres, hours, small labels, the 0-24 chips.

## 4. The band map

Hero height 520vh, so the scroll range is 420vh and 0.02 of progress is 8.4vh.
**Deviation, said out loud:** the skill's ramp constant (0.02) would give 7vh ramps on a hero this short,
against the intended ~20vh. So the ramp is computed as `f = Math.min(0.055, (b - a) / 3)` here, which lands
ramps at ~23vh and keeps plateaus at ~90 to 110vh, inside the 80 to 130vh standard.

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 – 0.31 | high in the black sky, falling, station is a pinprick far below | BG: «Тъмно е.» / «Всичко е затворено.» · EN: "It is dark." / "Everything is closed." | **Drift-down**, word by word, echoing the fall. Band 1 opens settled via the one-time load ramp. |
| 2 | 0.35 – 0.66 | through the mist layer, light climbing the frame, canopy taking shape | BG: «Освен едно място.» · EN: "Except one place." | **Blur-to-sharp**, two stacked copies, echoing the mist clearing. |
| 3 | 0.71 – 1.00 | at rest under the lit canopy, wet asphalt, light steady | BG headline: «СВЕТЛО Е. ВИНАГИ.» sub: «Гориво, магазин, сервиз, легло и топло кафе. Във Враца, бул. Мито Орозов 34. Всеки час от денонощието.» CTA: «Обади се сега» / «Виж маршрута» · EN headline: "THE LIGHT IS ON. ALWAYS." | **Word-by-word rise into a staged settle**: headline words rise, then the subline at k>0.66, then the CTA row at k>0.78. |

Action lane: the canopy sits centre-low through the shot, so bands 1 and 2 live in the upper third
(sky, empty by design) and band 3 settles centre with the subject spread wide and low behind it.

## 5. The mobile decision (revised after the build, at the owner's request)

The journey runs on **every** screen, not just desktop. The only gate left is reduced motion,
which still gets the composed still hero and downloads no media at all.

- **Landscape and desktop:** full-bleed `cover`, as designed.
- **Portrait phones and tablets:** the frame is a 4:3 crop pinned across the top of the stage with its
  top and bottom edges feathered by a CSS mask, and the caption bands sit in the space beneath it.
  A tall screen filled edge to edge would crop this wide aerial to a narrow strip and destroy the
  premise (one small light in a large dark world), so the picture is placed rather than cropped.
- **A lighter cut for small screens:** `hero-scrub-mobile.mp4`, 960px wide, 570KB against the
  desktop file's 2.0MB, chosen at `(max-width: 900px)`.
- Verified: worst-pixel contrast 13.0, 18.0 and 14.7 to 1 on the phone layout; every beat reaches
  full opacity at 300, 500 and 700px swipes with none skippable; no sideways scroll at any width.

## 6. The static-hero copy block (reduced motion)

Over the ending frame:

- Kicker (mono): «ВРАЦА · 0-24»
- Headline: «СВЕТЛО Е. ВИНАГИ.» / "THE LIGHT IS ON. ALWAYS."
- Subline: «Гориво, магазин, сервиз, легло и топло кафе. Бул. Мито Орозов 34, Враца. Отворено по всяко време.»
- CTA: «Обади се сега» (tel) + «Виж маршрута» (maps)

## 7. The below-fold outline

Every section funnels to one anchor: **#контакт**, and the one action is **обади се**.
No two adjacent sections share a skeleton (price board → hold interaction → icon grid → split image →
split image reversed with bullets → three standards → accordion → contact slab).

**S1 · Цени — the price board.** Kicker «ЦЕНИ ТАЗИ ВЕЧЕР».
Headline: «Цената я виждаш преди да спреш.» / "You see the price before you pull in."
Lede: «Без изненади на колонката. С картата на BG OIL плащаш 10 стотинки по-малко на литър. Всеки литър, по всяко време.»
Rows (confirm before deploy): Дизел · Бензин А95 · Г П Б · AdBlue, each with a standard price and a card price.
Honest note: «Ориентировъчни цени. Актуалните светят на таблото при входа.»

**S2 · The one interactive moment — «Дръж, за да заредиш».**
Headline: «Дръж и виж разликата.» / "Hold and see the difference."
Microcopy: «Задръж бутона. Литрите текат. Отляво плащаш без карта, отдясно с карта.»
Press and hold: litres count up, two totals race apart, releasing early eases back down, never snaps.
Complete state: «50 литра. 5.00 лв. разлика. Всеки път.» then the card line lights up:
«Картата се взема на място за нула лева.» Reduced motion gets the finished state with no hold.

**S3 · Услуги — «Спираш веднъж. Готово е всичко.»** / "Stop once. Everything is done."
Six equal cards, each a hand-drawn SVG mark (equal treatment, no photo asymmetry):
- «Магазин 0-24» — «Кафе, храна, цигари, всичко за път. Не затваряме.»
- «EasyPay каса» — «Ток, вода, телефон, данъци. Плащаш ги тук, по всяко време.»
- «Автосервиз и части» — «Бърза диагностика, оригинални и алтернативни части.»
- «Гуми и джанти» — «Смяна, баланс и машинно изправяне на изкривени джанти.»
- «Автомивка на самообслужване» — «Ти държиш пистолета. Плащаш само колкото ползваш.»
- «Автобои и камера под наем» — «За професионалисти, които искат сами да контролират резултата.»

**S4 · Хотел** (generated still, image left / text right).
Kicker «ХОТЕЛ». Headline: «Легло на 30 крачки от камиона.» / "A bed thirty steps from your truck."
Copy: «Климатик, черни завеси, тишина. Спиш, когато ти трябва сън, дори по обед. Паркингът е пред прозореца, а колата ти се вижда от леглото.»
CTA: «Стая тази вечер: 087 8618625»

**S5 · Сервиз** (generated still, reversed: text left / image right, with bullets).
Kicker «АВТОСЕРВИЗ». Headline: «Цената я казваме, преди да пипнем колата.» / "We tell you the price before we touch the car."
Copy: «Тук 140 не стават 270. Първо диагностика, после цена, после твоето „да“, чак тогава работа. Старата част ти я показваме в ръката си.»
Bullets: «Ти избираш оригинална или алтернативна част» · «Гуми, баланс и изправяне на джанти» · «Автобои и камера за боядисване под наем» · «Автомивка на самообслужване за финала»
CTA: «Сервиз: +359 87 714 1742»

**S6 · Нощната смяна — three standards, not testimonials.** No invented quotes anywhere on this page.
Headline: «Малките неща, заради които се връщат.» / "The small things people come back for."
- «Чисти тоалетни. По всяко време.»
- «Истинско кафе в три сутринта.»
- «Светъл паркинг, на който оставяш колата спокойно.»

**S7 · Въпроси (FAQ, the real objections from research).**
- «Наистина ли сте отворени 24 часа?» → «Да. Колонките, магазинът и EasyPay работят без прекъсване, включително на празници.»
- «По-скъпо ли е при вас?» → «Не. Цените ни вървят с тези на големите вериги, а с нашата карта плащаш 10 ст. по-малко на литър.»
- «Безплатен ли е паркингът?» → «Да, за клиенти, и е осветен цяла нощ. Има място и за камион.»
- «Мога ли да взема стая без резервация?» → «Обикновено да. Обади се на 087 8618625 и ти казваме веднага дали има свободна.»
- «Качествено ли е горивото?» → «Работим с доказани доставчици и държим на качеството. Ако имаш въпрос за конкретна доставка, питай на място.»

**S8 · Контакт — the single CTA anchor.**
Headline: «Светло е. Заповядай.» / "The light is on. Come in."
Address, «Отворено 0-24», three phone buttons (станция, хотел, сервиз), email, «Виж маршрута» (maps).
Form (mailto to bgoil_3000@abv.bg): labels «Име», «Телефон», «Какво ти трябва?», button «Изпрати запитване»,
success state «Готово. Отваря се пощата ти с попълнено съобщение. Ако бързаш, звънни на +359 878 618 640.»
**Form handling, stated honestly to the user:** static site, no backend, so the form opens the visitor's own
mail app addressed to the station. The phone buttons are the real conversion path.

**Footer.** BG OIL · «Качеството над всичко» · address · 0-24 · phones · © current year.
No fictional-brand disclosure (real business) and no AI-imagery note (owner's decision).

**Language.** Bulgarian is default. A BG/EN switch in the nav swaps every viewer-facing string
(`data-bg` / `data-en`), sets `<html lang>`, and remembers the choice in localStorage.

## 8. The vector layer plan

- **The signature: the 0-24 hour rail.** A fixed vertical rail on the left edge, 25 tick marks for the hours,
  drawn in SVG. A red marker glides down it with scroll progress, and the visitor's **real current hour** is lit
  from the first paint, with the line «СЕГА Е HH:MM · ОТВОРЕНО». Remove it and the page loses its argument,
  which is the loudness test passed. Hidden under 1024px and on short screens; the mobile layout carries the
  live hour in the static hero kicker instead.
- **The drop.** The droplet counter-shape from the logo, redrawn as a hand-authored SVG path, used as
  the section divider: it draws itself along a hairline as each section enters.
- **Whisper particles.** 14 slow motes drifting inside the canopy-light glow, `--accent-muted` and `--canopy`,
  transform and opacity only, paused off-screen and on hidden tabs.
- **The fixed environment layer.** One page-wide background: a slow radial red glow low centre over a deep
  blue field, drifting on a 90 second cycle, so the whole page reads as one night.
- Reduced motion: rail marker pinned to the live hour, dividers drawn, particles stopped, holds completed.

## 9. The engineering list

Blob fetch with poster-first paint and the loading ring (streamed if over ~8MB, with the 20s watchdog);
dt-normalised lerp in a rAF loop that rests; gated seeks with the error-path deadlock escape; delta-gated
DOM writes; band pacing with the flick test at 120/240/360px; the four-layer legibility system (global scrim,
per-band scrim riding `--k`, three-layer text shadow token, chip scrim for mono labels) audited at the worst
frame to 3.5:1 minimum; the reduced-motion gate matched character-for-character in CSS and JS and kept
live with a change listener; complete-without-video; `overflow-x: clip` on html and body; reduced motion
honoured live in both directions; the whole-site-animated standard.

## 10. The copy gate

Every viewer-facing line above ships verbatim. Before anyone sees the build it must pass the grep gate:
zero em dashes, zero stock words (leverage, seamless, empower, unlock, robust, actionable, data-driven,
solutions), plus the body-copy sweep for AI tells. The deliberate devices here (the «Тъмно е. / Всичко е
затворено. / Освен едно място.» triplet, the staccato «Спираш веднъж. Готово е всичко.») are craft and stay.
