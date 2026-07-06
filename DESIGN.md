# Rotaract Club of Coimbatore Gaalaxy — Website Redesign Specification

A complete restructure of rotaractcbegaalaxy.org into a premium, modern, interactive experience.
Design language derived from the FeedForge reference (feed-forge.integritas.agency); content sourced
verbatim from the existing site (Vite/React bundle mined 2026-07-06).

---

## 1. Reference Analysis (FeedForge)

### Core design DNA
- **Visual language**: "warm near-black with candy accents." Alternating full-bleed bands — white / warm chocolate-black `#180703` / light gray `#F3F3F3` — punctuated by an accent trio (butter yellow `#FFF96C`, sky blue `#8CC9FA`, periwinkle `#9893F4`), each paired with a dark text tone for contrast (`#604B01`, `#143E7C`, `#400A38`).
- **Typography**: one family (Plus Jakarta Sans), pushed to ExtraBold 800 at huge display sizes (140px contact hero, 116px stat numerals, 100px about hero, 82px home hero, 42px section H2) against modest 17px/500 body at 60–70% opacity. Identity from weight + scale contrast, not letter-spacing. Lowercase eyebrow/labels as a stylistic device.
- **Layout**: 1300px container (64px side padding → 1172px content), desktop-first with named breakpoints (phone ≤767 / tablet 768–1024 / pc ≥1025). Big asymmetric section paddings (72/100/140/207px). Full-bleed breakout trick: `w-screen + pl-[calc((100vw-100%)/2)] + ml-[calc((100vw-100%)/-2)]`.
- **Radius system**: 24px media cards / 14–16px surface cards / 8–9px buttons & chips / 4–6px inner tiles / full pills.
- **Motion stack**: Lenis smooth scroll (duration 1.6, expo-out) + hand-rolled rAF scroll-jacking (sticky section inside tall spacer div) + IntersectionObserver reveals. No GSAP. Everything transform/opacity only, `prefers-reduced-motion` respected.
- **Signature moves**:
  - Split-line headline reveal: lines masked in overflow-hidden wrappers, `translateY(100%+0.25em) → 0`, 1.5s `cubic-bezier(0.23,1,0.32,1)`, 0.14s stagger; inline images pop in `scale 0→1` after lines settle.
  - Jelly CTA hover: `scale 1→1.06` over 0.42s `cubic-bezier(0.34,2.8,0.64,1)` (huge overshoot), exit squash to 0.975.
  - Sliding nav highlight pill that springs between links (0.32s back-ease).
  - Scroll-jacked horizontal card strip (hero work showcase, team slider) with slow-fast-slow piecewise ease.
  - Stats "odometer tape": pinned section, 116px numerals slot-machine through a masked band, 200px scroll per stat, 0.65 hysteresis.
  - Rotated photo-card fan (±4–8°) with cursor-velocity fling physics (impulse + spring back, friction 0.91/0.78).
  - Auto-advancing progress tabs (9s clip-path fill wipe, click-to-select) — "What sets us apart."
  - Testimonial "browser-tab" cards (white chrome bar + favicon + quote body + icon footer) with per-column parallax drift (-40/0/-18px).
  - Footer curtain: giant 6%-opacity SVG wordmark band slides up from behind link band as page bottoms out, with a mouse-chasing blurred radial spotlight masked inside letterforms.
  - Preloader: solid dark overlay, waits for fonts, fades 600ms, header stagger-fades in.
- **CTA philosophy**: exactly one loud pill (yellow, rounded-full, header) per viewport; quiet rectangular "Learn more" buttons elsewhere; one dedicated CTA banner before footer.
- **Page shapes**: Home = hero + work strip + services + testimonials + stats + CTA banner. Service = hero + video deck + slider + progress tabs + CTA. About = 100px hero + rotated photo fan + services + horizontal team slider + testimonials. Ready (contact) = one giant 140px headline + two-column contact row + footer. 

## 2. Existing Site Analysis (rotaractcbegaalaxy.org)

- **Tech**: Vite + React SPA, client-routed, no SSR (bad SEO — content invisible without JS). Framer Motion + CountUp already used. Theme color `#17458f`.
- **IA**: Home / About Us (Our Story, Members) / Our Assets (Newsletter, Scrapbook) / Our Projects (5 avenue pages) / Contact Us; Join Us + Blood Donor reachable only via homepage CTA cards.
- **Weaknesses**: long single-scroll homepage with 12 stacked sections, generic card grids, "Our Assets" is org-speak, Join/Blood-Donor buried, no unified project browsing, prayer/4-way-test presented as static text blocks, no storytelling arc.

### Content inventory (verbatim, reuse in rebuild)

**Identity**
- Name: Rotaract Club of Coimbatore Gaalaxy ("Gaalaxy" double-a is intentional; domain rotaractcbegaalaxy.org)
- Family of Rotary Club of Coimbatore Gaalaxy — Club ID: 87596 | Group 1 | RI District 3206
- Chartered 30 November 2009, Charter President Rtr. Jagadeesan
- Footer tagline: "Every spark begins with a question. Every change begins with a choice. At Gaalaxy, we don't just serve — we lead, we learn, and we lift others as we rise. We are the force behind change."
- Stats: DUAL MEMBERSHIP 2 · DISTRICT TRAINERS 5 · PROJECTS 500+ · MEMBERS 42 · YEARS OF SERVICE 15+
- Story highlights: annual budget ₹10–15 Lakhs, CSR collaborators; "A force that educates. A force that empowers. A force that breaks barriers."
- Contact: +91 82200 04424 · gaalaxy.socials@gmail.com
- Socials: instagram.com/raccoimbatoregaalaxy · facebook.com/RACGAALAXY (profile.php?id=61578119250015) · linkedin.com/company/rotaract-club-of-coimbatore-gaalaxy · x.com/Rac_Gaalaxy · youtube.com/@rac_gaalaxy
- Rotaract Prayer (full text on current home) + The Four-Way Test (4 questions)

**Flagship / featured**
- VANCHI — flagship since 2019–20; tribal community upliftment (Irula tribe, Sadivayal & Karamadai, 30+ beneficiaries/phase); transitioning into a RYLA experience.
- IPCL 2.0 — national para-athlete cricket tournament, 5–7 Sep 2025, 22 Yards Coimbatore; 60+ players, 14 states + 1 UT; champions Rotary Downtown Tigers Mumbai.
- AASAN — teacher-honouring, VLB Janakiammal College, RSAMDIO "Gurukkul", 50+ teachers.
- SAYBOO — Halloween event w/ RC Covai User Group, 1 Dec 2024, The Farmstead, 227 registrations.
- PETTI KADAI — shop setup for differently-abled couple (Mrs. Viji & Mr. Therasanathan), 14 Jul 2024, Sulur.
- ROTA-LIN — year-long insulin-needle initiative w/ RC of TNAU (4 phases).

**Projects by avenue (2025–26)**
- Club Service (24): Gaala Kudumbam (1–3), Chill & Skill, Chaat & Chat, Yatra, Turf Rush, Solitaire, Desandhiri, Aravam, Ctrl + S, Echoes, Picklympics, Ace, Arena, The One, Illuminate, Pitch & Catch, Connect (DRR visit), Gaala Genesis (17th Charter Day, Party Hub Saravanampatti), Thera Ulaa, Ilamai Itho Itho 2.0 (7 clubs), Field & Friends, Ho Ho Homies.
- Community Service (15): Kuruthi (blood drive w/ parent Rotary), Gaalaxy Unavagam, Anna Poorani grocery drive (St. Joseph's Old Age Home, Podanur, 1 Jul), Malarum Thaaimai I & II (pregnancy kits ₹7,000 → 30+ mothers; breastfeeding awareness), Rota-lin I–IV (Marudham/Madhuram Diabetes & Thyroid Centre, Kalapatti; Rtn. Dr. Krishnan Swaminathan), Veppam (blanket drive), Bubble Up (Global Handwashing Day, GHSS Pichanur), Purple Pinkie (Global Polio Day), Bake the Smoke Away, Beyond the Ribbon (education for 17 children affected by AIDS), Kaapaan (10 first-aid kits in traffic booths), Giggles (special-school outreach).
- Professional Service (8): Rotaract 360, The Inner Compass (w/ RC HICET), Ennangalil Ethirkaalam (Int'l Youth Day), Patriots Play Fest, Spotlight (national short-film contest w/ JCI Coimbatore Indcity), Pinktober, Aviate & Gear Up (World Interact Week, GHSS Sundakkamuthur / Kulathupalayam).
- International Service (16): Visionova (w/ RC Salem Gugai, D2982, Ms. Preethi Govindan, 100+), Rooted in Rotaract (Thaagam Foundation), Inningsight (₹20,000 cricket kit → TN Blind Cricket Team, Thunder Hope Foundation), Saaral & child-safety at CBM School (My Body is My Body, 70+ students each), Yaazh Muthu (Indo-Lankan exchange, RC Ratnapura D3220), Gauravi (w/ RC Rising Ranchi D3250), Peshwas to Palms (IDYE, D3131), sign-language session (RC Pune Sinhagad Road, 20+), cultural exchange (Pune Metro/Royal), World Post Day letters, World Food Day (RC RSCOE D313), cyber-safety (RC VISTAS + 10 clubs D3234, 90+), Children's Day (Malumichampatti Panchayat School), Rotaract Moments 2025.
- District Priority (8): Mythiri (movie screening, Helping Hearts, DPP DREAM/e-Embrace), Mind Matters (DPP MannShakti), Annam (10kg rice), Save the Stray (reflective collars, DPP Embrace), IPCL 2.0, The Healing Hour (w/ RC SKASC), NutriSense (Dreamz Trust, Hi5), Classics and Companions (Reach Out + Annapoorani).

**Board 2025–26 ("Stars of Gaalaxy")**
Rtr. SRIVARSHAN R R — President · Rtr. IPP. SAMYUKTHA — Immediate Past President · Rtr. SUSANNA — Secretary Administration · Rtr. YUVARAJ CR — Secretary Communication · Rtn. Rtr. JAYA KISHORE — Vice President · Rtr. SHRUTHINAYA — Chair, All Avenues · Rtr. MITUN — Treasurer · Rtr. VIPPINSAGAR — Sergeant at Arms · Rtr. KARTHICK SUNDAR — Director, Club Service · Rtr. SANJAI T N — Director, Community Service · Rtr. JANANI K S — Director, Professional Service · Rtr. VIJAYA RAGAVAN — Director, International Service · Rtr. HARI KARTHIK — Director, District Priority Project · Rtr. NAVEEN — RYLC & Chair, Partners in Service · Rtr. BARATH KUMAR — Club Editor · Rtr. KAAVYA SHRI — Chair, Public Affairs & Outreach · Rtr. PP. SANJAI — Rotaract Learning Facilitator · Rtr. DHARSHAN — Chair, District Initiatives · Rtr. SWATHI — Chair, TRF · Rtr. GANESH BALAJI — Chair, Membership Growth & Retention · Rtr. PP. KARTHICK MR — Club Advisor · Rtn. Rtr. MPHF. VIJAY VIGNESH — Club Mentor · Rtr. PP. SHRUTHI — Chair, Campus Ambassador · Rtr. RAGESH RAM — Chair, Blood Donor Cell
General members (18): Adhithan A, Ajith Kumar R, PP Jaishree G V, Kabilesh K, Nikesh S, Niveda K, Raghav Somasundaram P L, Sree Pranesh J, Ritesh P R, Rithanya C, Sabarish L, Sakthi Prasanna R, PP Sakthi Sridevi N, Sriee Aswanth A C, Thaqib Rehman Z, Vidhya Hanumath K, Vivegananth R, PP Yuvaraj C U.

**Leadership voices (testimonials)**
- Rtr. SRIVARSHAN R R (President): "With immense pride and gratitude, I step into this year as the President of our club…"
- Rtr. IPP. SAMYUKTHA: "As an Immediate Past President… honored to have been part of a journey that brought people together…"
- Rtr. PP. YUVARAJ CU: "They say Rotaract builds leaders — for me, it built bridges… kickstarting Coimbatore's first para-sports fest, welcoming our first transgender member…"

**Publications**
- Newsletters ("Gaalaxy Newsletter", monthly): July → May editions, 11 PDFs with cover images.
- Scrapbooks (annual): ODYSSEY 20-21, EVOLVE 21-22, REFLECTION 23-24, REVELATION 24-25, GOD MODE 25-26 — 5 PDFs with covers.

**Forms (Google Apps Script endpoints — keep)**
- Contact: name, phone, email, message → `script.google.com/macros/s/AKfycbwcyrxQIkGgFXSeLFoOKnihH0zEWx0sr4pbzZ8vYoJlb7nqiKvxQdGitzmhGF32X69Nbw/exec`
- Join Us: fullName, dob, gender, phone, email, city, occupation, institution, reason, hearAbout, consent → `…AKfycbzRW3jTEs-4Su_GdsoqPOPT88vZoa-OecjrcMvJAvkZsJqwpzwnfRFrmLriT-Qqinc6VA/exec`
- Blood Donor: fullName, email, contactNumber, rotaractorStatus, dob, gender, weight, bloodGroup, city, willingToDonate, donatedBefore, consent → `…AKfycbwTz4QewjWnwZoJUGtguKCaqeH5yJEybUhVs42C206l7mNWojNu4v970w2r5JrlUSR_qQ/exec`
- All use a `_honeypot` hidden field for spam protection. Join & Blood Donor pages are `noindex, nofollow`.

**Key images (current site, reusable)**: group photo, club logo, logo set, about tilt image, prayer logo, 4-way-test logo, 25 member portraits (M-01-xx) + 17 general-member portraits (NM-01-xx), 5 social cards, project photo library (60+ images across avenue chunks), newsletter/scrapbook covers, og-banner.jpg.

---

## 3. Improved Sitemap

Rationale: flatten "Our Assets" org-speak, unify projects into one browsable index, promote Join to a
persistent CTA, give Team its own page (it's the club's best asset), give Blood Donor a clear home.

```
/                → Home (storytelling one-pager)
/about           → Our Story (history, timeline, prayer, four-way test, affiliation)
/team            → Stars of Gaalaxy (board 2025–26 + general members + voices)
/projects        → Unified project index, filterable by 5 avenues (68 projects)
/publications    → Newsletter + Scrapbook shelves (was "Our Assets")
/join            → Become a Member (form)
/blood-donor     → Blood Donor Registry (form)
/contact         → Say Hello (form + details)
```

Header nav: **Home · About · Team · Projects · Publications · Contact** + gold pill CTA **Join Us**.
Blood Donor linked from: home CTA banner, footer "Get involved" column, /join cross-link.
Every page ends with the CTA banner + curtain footer (except /join, /blood-donor, /contact which end with footer only — contact IS the CTA).

---

## 4. Visual Direction — "Deep Space, Warm Stars"

FeedForge's structure, recast for a galaxy-named service club: the warm chocolate dark becomes a
deep-space navy-black; the butter-yellow CTA becomes starlight gold; the pastel accent trio maps to
the club's cosmic identity + Rotaract cranberry heritage.

### Palette
| Token | Hex | Role (mirrors FeedForge role) |
|---|---|---|
| `space` | `#0A0B14` | dark section bg, preloader, footer band 1 (≈ #180703) |
| `space-deep` | `#05060D` | footer band 2 gradient end (≈ #0D0401) |
| `ink` | `#0E1020` | text on light surfaces (≈ #170400) |
| `paper` | `#FFFFFF` | page bg |
| `mist` | `#F2F3F7` | light gray section bg (≈ #F3F3F3) |
| `starlight` | `#FFD84D` | primary CTA pill, accent tile 1 (≈ #FFF96C) |
| `starlight-ink` | `#5C4300` | text on starlight (≈ #604B01) |
| `nebula` | `#A79BFF` | accent tile 2 (≈ #9893F4) |
| `nebula-ink` | `#2B2166` | text on nebula |
| `comet` | `#8CC9FA` | accent tile 3, stats tile (kept from ref) |
| `comet-ink` | `#143E7C` | 116px stat numerals |
| `cranberry` | `#FD4F79` | Rotaract-heritage accent tile 4 / avenue dot (from #D41367, brightened for dark bg) |
| `cranberry-ink` | `#4A0A24` | text on cranberry |
| card-on-dark | `rgba(46,50,78,0.6)` | translucent panel on space bg (≈ rgba(58,43,40,.74)) |
| scrim | `linear-gradient(180deg, transparent, rgba(0,0,0,0.35))` | photo card overlay |

Section rhythm identical to reference: white hero → space dark band → mist light band → dark CTA gradient → space footer. Soft double shadows (`0 24px 50px -12px rgba(0,0,0,.18) + 0 8px 20px -8px rgba(0,0,0,.12)`) on media cards.

### Typography
- Family: **Plus Jakarta Sans** (200–800, self-hosted via `next/font`). Accent script (footer credit only): a handwriting font (e.g. Caveat).
- Scale: display-1 clamp(60px, 9vw, 140px)/800/110% · display-2 clamp(40px, 6.5vw, 100px) · hero-home clamp(40px, 5.8vw, 82px) · stat 116px/800 · h2 42px→32px/800 · card-title 28px→20px/800 · body 17px/500 @60–70% opacity · meta 14–15px.
- Devices: lowercase eyebrow labels ("our story", "get in touch"), inline star/logo image inside headlines (the FeedForge thumbs-up move — use the club's star mark ✦).

### Radius / spacing / grid
Same as reference: 1300px container, 64px→16px side padding; radii 24/14/9/4/full; section paddings 72–207px; breakpoints phone ≤767 / tablet 768–1024 / desktop ≥1025.

### CTA system
- Primary: **Join Us** — starlight gold rounded-full pill, 56px, `starlight-ink` text, jelly hover. Only saturated element in header.
- Secondary: "Explore →" rectangular 9px-radius, 42px, white-on-dark / space-on-light, leading curved-arrow icon.
- Tertiary: footer links with directional draw-through underline wipe.

---

## 5. Page-by-Page Structure + Motion Design

Global motion stack: **Lenis** smooth scroll (duration 1.6, expo-out) + **Framer Motion** for reveals/springs + custom `useScrollJack` hook (sticky-in-spacer pattern) for pinned sections. All animation transform/opacity only; `prefers-reduced-motion` disables reveals and scroll-jacks (content falls back to static stacked layout). Preloader on every page: solid `space` overlay, star-mark pulse, fades 600ms after fonts ready; header stagger-fades in.

### 5.1 Home `/`
1. **Header** — absolute transparent over hero; logo left; pill nav with sliding spring highlight (0.32s back-ease); gold Join Us pill. Mobile: MENU chip → dimmed backdrop + white bottom sheet (drag handle, lowercase chip links, iOS spring `cubic-bezier(0.32,0.72,0,1)`).
2. **Hero** — centered 82px ExtraBold: "We don't just serve. We lead ✦ we lift, we rise." (✦ = inline club star mark, pops in scale 0→1 after line reveal). Subline: "Rotaract Club of Coimbatore Gaalaxy · Family of Rotary Club of Coimbatore Gaalaxy · RI District 3206". *Motion*: masked split-line reveal (1.5s, 0.14s stagger); hero is sticky and shrink-fades (scale→0.88, opacity→0) over first 500px of scroll.
3. **Impact strip** — full-bleed horizontal scroll-jacked strip of six 312×440 rounded-24 photo cards (IPCL 2.0, VANCHI, SAYBOO, PETTI KADAI, ROTA-LIN, AASAN) with bottom scrim, project name + impact stat ("60+ para-athletes", "227 registrations"). *Motion*: pinned sticky, translateX driven by scroll with slow-fast-slow piecewise ease; card images subtle scale 1.05→1 as they enter.
4. **Avenues** — dark `space` band, H2 "Five avenues. One force." Five stacked full-width cards (translucent panel + right 52% accent tile: starlight/comet/nebula/cranberry/starlight): Club · Community · Professional · International · District Priority, each with dot-pill label, 28px title, 1-line description, project count, "Explore →". *Motion*: cards rise+inflate on intersect (translateY 60px + scale 0.82 → rest, 0.9s/0.6s staggered); accent tile illustration parallax-drifts ±12px inside card.
5. **Stats odometer** — mist band, pinned two-panel scrollytelling: left comet-blue square tile with 116px `comet-ink` numerals rolling through a masked tape — **500+ / 42 / 15+ / 5 / 2**; right white card swaps titles in sync (Projects Completed / Active Members / Years of Service / District Trainers / Dual Memberships), 200px scroll per stat, 0.65 hysteresis. Mobile: 2-col grid of colored stat tiles with CountUp on intersect.
6. **Flagship spotlight** — dark band, "Built to break barriers." Auto-advancing progress tabs (9s clip-path fill, click-to-select): VANCHI · IPCL · ROTA-LIN · PETTI KADAI; right panel crossfades project photo + description (±40px translateY crossfade).
7. **Four-Way Test** — mist band, editorial: eyebrow "of the things we think, say or do", the four questions as giant 42px lines. *Motion*: each line masked-reveals sequentially as user scrolls (IntersectionObserver stagger); key word (TRUTH / FAIR / GOODWILL / BENEFICIAL) highlighted with an animated starlight underline wipe.
8. **Voices** — "Loved by the people we serve with." 3-col "social-post" cards (white chrome bar with avatar-circle + platform label, quote body, icon footer) — President / IPP / PP quotes. *Motion*: per-column parallax drift (-40/0/-18px).
9. **Stars teaser** — dark band, "Meet the Stars of Gaalaxy" + horizontal scroll-jacked slider of 7 board portrait cards (270×380, r-24, scrim, name+role) → "View all stars →" to /team.
10. **CTA banner** — dark gradient band, inner rounded-14 card: star icon with gold glow, 42px "Every change begins with a choice.", two buttons: Join Us (gold pill) + Become a Blood Donor (white). *Motion*: card rises on intersect; icon has slow pulse glow.
11. **Footer** — band 1 (`space`): logo + 4 lowercase columns (pages / get involved / socials / less important) with underline-wipe links. Band 2 (gradient to `space-deep`): giant "gaalaxy" SVG wordmark at 6% white with mouse-chasing radial spotlight; tiny starfield dots (CSS, 3% opacity) as easter egg; copyright row. *Motion*: band 2 curtain-slides up from behind band 1 as page bottoms out. Mobile: accordion columns with rotating plus chips.

### 5.2 About `/about`
1. Hero — 100px "Fifteen years of ✦ force." + subline; below, a fan of 5 overlapping rotated photo cards (-8/4/8/-4°) from story images. *Motion*: line reveal; desktop cursor-velocity fling physics on cards (impulse + spring, friction 0.91/0.78); phone: cards fly up sequentially in a sticky 100dvh stage, 600px scroll each.
2. Story editorial — two-column: sticky left heading "Born 30 November 2009.", right flowing 17px text (charter, Rtr. Jagadeesan, growth, ₹10–15L budget, CSR partners). *Motion*: paragraphs fade-rise on intersect; pull-quote "We are not just a club — we are a force." scales in.
3. **Interactive timeline** — dark band, horizontal scroll-jacked: 2009 Charter → VANCHI 2019 → EVOLVE era → first para-sports fest → IPCL → GOD MODE 25-26. Each stop = year numeral (116px, 8% white) behind a photo card; progress line draws across as user scrolls; year numerals count up as stops pass center.
4. "A force that…" manifesto — three lines (educates / empowers / breaks barriers) reveal one per scroll beat, each with an accent-colored word (starlight/comet/cranberry).
5. Rotaract Prayer — mist band, centered max-w-700 italic serif-feel block with the Rotary mark; slow fade-in, letter-spacing eases from 0.02em→0 (breathing settle).
6. Four-Way Test — reuse home component (progress-tab variant here: 4 auto-advancing tabs).
7. Affiliation strip — logos: Rotary International / RI District 3206 / Rotary Club of Coimbatore Gaalaxy / Club ID 87596 — infinite marquee (pause on hover).
8. CTA banner + footer.

### 5.3 Team `/team`
1. Hero — 100px "Stars of ✦ Gaalaxy." + eyebrow "board members 2025–26".
2. Leadership row — President/IPP/Secretaries/VP as large cards (298×420) with rotated-fan entrance.
3. Board grid — remaining 20 board cards grouped by lowercase labels (avenue directors / chairs / advisors); portrait, scrim, name, role. *Motion*: grid items rise+inflate staggered by row; hover = photo scale 1.06 + card lift with spring, role chip slides up.
4. General members — "the constellation": 18 smaller circular portraits laid out as a loose constellation with faint connecting lines (SVG); hover enlarges node + shows name tooltip. Mobile: simple 3-col grid.
5. Voices — the 3 leadership quotes (social-post cards).
6. CTA banner ("Your name could be here.") + footer.

### 5.4 Projects `/projects`
1. Hero — 100px "500+ projects. ✦ Zero applause needed." + animated counter in eyebrow.
2. **Filter bar** — sticky (top-0, blur backdrop) pill row: All · Club · Community · Professional · International · District Priority, each with colored dot + count; sliding highlight pill springs to active. URL-synced (`?avenue=`).
3. Project grid — masonry-ish 3-col of cards: photo (r-24, scrim), 2-digit count numeral ghost (8% opacity, 116px, behind), title 28px, avenue dot-pill, description clamp-3. *Motion*: FLIP layout animation on filter change (Framer Motion `layout`); cards rise on intersect; hover = scrim deepens + description expands + arrow slides in.
4. Flagship rail — dark band between grid sections: VANCHI + IPCL as full-width split cards (52% photo) with rich descriptions.
5. CTA banner ("Have a project idea? Bring it.") + footer.

### 5.5 Publications `/publications`
1. Hero — 100px "Paper trails of ✦ impact."
2. **Newsletter shelf** — "gaalaxy newsletter — monthly" — horizontal scroll-jacked shelf of 11 covers (3D perspective tilt: `rotateY` eases 12°→0 as each cover passes center); click opens PDF. Month label 42px swaps in sync below.
3. **Scrapbook stack** — 5 annual scrapbooks (ODYSSEY / EVOLVE / REFLECTION / REVELATION / GOD MODE) as a stacked card deck: pinned section, each cover flies up and rests at a bespoke rotation (-6/3/-2/5/0°), 600px scroll per card; year + title crossfade at side. Hover: tilt-follow (rotateX/Y ±12°, scale 1.05 — the existing site's TiltedCard, upgraded).
4. Footer.

### 5.6 Join `/join`
1. One-big-thing hero (Ready-page pattern): 140px "Ready to ✦ rise?" (pt-230/pb varies) + 20px lowercase "join a force of 42 (and counting)".
2. Form card — white rounded-16 card on mist band; existing fields; inputs with focus ring in starlight; labels float; submit = gold jelly pill; success state = confetti-star burst (one-shot, reduced-motion safe). Keeps `_honeypot` + Apps Script POST.
3. Two-column contact row (email / phone) + footer.

### 5.7 Blood Donor `/blood-donor`
Same skeleton as /join, cranberry accent instead of gold: 140px "Every drop ✦ counts." + registry copy; form with blood-group select styled as chip grid (A+ A- B+ …, selected chip fills cranberry); consent checkbox custom. `noindex` retained.

### 5.8 Contact `/contact`
Ready-page clone: 140px "Say hello ✦" headline; mt-54 two-column row — left "we're always here to chat" + gaalaxy.socials@gmail.com + +91 82200 04424; right compact 4-field message form. Social chips row. Footer immediately (page IS the CTA).

---

## 6. Component Inventory (reusable)

`<Preloader>` · `<Header>` (sliding nav pill, bottom-sheet mobile menu) · `<SplitHeadline>` (masked line reveal + inline-icon pop) · `<JellyButton>` (primary pill / secondary rect) · `<ScrollJackSection>` (sticky-in-spacer, horizontal + vertical variants) · `<PhotoCard>` (24px radius, scrim, name+stat) · `<AvenueCard>` (split panel + accent tile) · `<StatsOdometer>` (tape + text carousel; mobile tile grid w/ CountUp) · `<ProgressTabs>` (9s clip-path autoplay) · `<PostCard>` (testimonial chrome-bar card) · `<TimelineRail>` · `<FilterPills>` · `<ProjectCard>` · `<CoverShelf>` / `<CardDeck>` (publications) · `<TiltCard>` · `<FormShell>` (honeypot + Apps Script POST + states) · `<CTABanner>` · `<CurtainFooter>` (wordmark + spotlight + accordions) · `<Marquee>`.

## 7. Technical Plan

- **Next.js 15 (App Router) + Tailwind CSS v4** + TypeScript. Static export or Vercel; every page SSG (fixes the current no-SSR SEO hole — content currently invisible to crawlers).
- Content as typed data modules (`/content/*.ts`): projects, members, publications, stats, quotes — mined content above drops straight in.
- Motion: `lenis` + `framer-motion` (`useScroll`/`useTransform` for scroll-jacks, `layout` for filter FLIP, `whileHover` springs). Custom hooks: `useScrollJack`, `useSplitLines`, `useSpotlight`.
- Images: `next/image`, download current site's asset library (URLs inventoried above) into `/public`, AVIF/WebP.
- Fonts: `next/font/local` or Google — Plus Jakarta Sans variable.
- Forms: client POST to existing Google Apps Script endpoints, honeypot preserved; `noindex` via metadata on /join + /blood-donor.
- SEO: per-page metadata (titles/descriptions reuse existing), OG banner, sitemap.xml, JSON-LD `Organization`.
- A11y: reduced-motion fallbacks everywhere, AA contrast on all accent/text pairs, keyboard-visible focus, semantic landmarks.

## 8. Open Questions

1. Palette: proposed "deep space navy + starlight gold + cranberry" — or stay closer to current royal-blue `#17458f` identity, or clone FeedForge's warm-brown literally?
2. VANCHI brochure PDF is broken on the live site (`/src/assets/...` dev path) — is a working copy available?
3. Photography: current library is mixed-quality event photos; OK to curate hard (fewer, larger, best-only)?
4. Any content additions wanted (e.g., awards, past presidents list, upcoming-events calendar), or 1:1 content parity?
