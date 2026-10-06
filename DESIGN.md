---
name: Elyra Odontologia
description: Ficha de Planejamento do Sorriso. A premium dental clinic drawn as a numbered planning sheet, with gold guide lines, dimension marks and figure callouts.
colors:
  paper: "#F7F5F0"
  paper-2: "#EEEAE2"
  paper-3: "#E4DFD4"
  green: "#163C35"
  green-deep: "#0F2C27"
  gold: "#B89565"
  gold-ink: "#7A5E36"
  gold-soft: "#D2B78F"
  gold-guide: "#E7D3B0"
  ink: "#17201D"
  ink-2: "#5F6764"
  ink-2-tint: "#545C59"
  parchment: "#EDE6DA"
  night: "#111816"
  white: "#FFFFFF"
  line: "rgba(23, 32, 29, .14)"
  line-strong: "rgba(23, 32, 29, .32)"
  green-line: "rgba(237, 230, 218, .16)"
  error: "#A23B2A"
  placeholder: "#6B726F"
  scrollbar: "#C9C1B2"
  map-park: "#DCE0D6"
typography:
  display-hero:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.9rem, 4.7vw, 5.25rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.35rem, 4.6vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.022em"
  numeral:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(3rem, 5.4vw, 5.25rem)"
    fontWeight: 200
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  headline:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Spectral, Iowan Old Style, Georgia, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "\"ss01\" 1"
  lead:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
    fontFeature: "\"tnum\" 1"
  label-sm:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
  small:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  ui:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 500
    lineHeight: 1.55
  body-sm:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  none: "0px"
  sm: "2px"
spacing:
  gutter: "clamp(20px, 4.2vw, 72px)"
  gap: "clamp(16px, 2vw, 32px)"
  section: "clamp(96px, 13vw, 200px)"
  sheet: "clamp(48px, 6vw, 88px)"
  header: "84px"
  container: "1480px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 28px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.green-deep}"
    textColor: "{colors.paper}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.green}"
    rounded: "{rounded.sm}"
    padding: "0 36px"
    height: "64px"
  button-light-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.green}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 28px"
    height: "54px"
  button-ghost-hover:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
  button-sm:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-square:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "52px"
  button-square-hover:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
  input-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 2px"
    height: "52px"
  choice-segment:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "48px"
  choice-segment-selected:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
  booking-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(28px, 3.4vw, 48px)"
  viewer:
    backgroundColor: "{colors.green-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  compare-label:
    backgroundColor: "rgba(23, 32, 29, .5)"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "6px 10px"
---

# Design System: Elyra Odontologia

## Overview

**Creative North Star: "The Smile Planning Sheet"**

The whole site is drawn as a dentist's planning dossier. Four chapters carry a numbered sheet strip on off-white paper: Folha 01 Tecnologia, 02 Resultados, 03 Processo, 04 Contato (the planning story and the site plan); the other sections open straight on their heading so the strip keeps its weight. Figures are numbered once through the whole page (Fig. 01 to Fig. 10). Gold hairlines, dimension ticks, crop marks and figure numbers annotate photographs and headlines the way a digital smile design annotates a face. Precision is shown, never claimed: the hero portrait is measured by gold guide lines as it loads, the technology sheet runs a live point-cloud scan of an upper arch, and the before/after slider carries a millimetre scale on its handle.

The density is editorial and slow. Light Spectral headlines sit on a 12-column grid, set asymmetrically (heading in columns 1 to 7, lead in 9 to 12) with wide gutters and very tall section padding. Two dark fields of deep clinical green (Odontologia digital, and the booking CTA) take whole sections, and a near-black footer closes the dossier. Depth comes only from planes overlapping: a paper tag sliding over the edge of a photo, a paper booking sheet on a green field, a photo dropping below a dark viewer. The build rejects the template clinic: no rounded cards, no medical blue, no generic icon grid, no heavy gradients or shadows.

**Key Characteristics:**
- Paper, green and gold only. Gold is a 1px line, a tick or a numeral, never a fill.
- Square corners everywhere (2px on buttons, 0 elsewhere).
- Every section opens with a ruled sheet strip that gives the sheet number, name and a count.
- Figures are numbered to their sheet (Fig. 04.1) and framed with gold crop marks.
- Spectral 200/300 for display, with italic emphasis lines. Manrope for text, with tabular numerals.
- Motion draws: rules scale in from the left, images unmask from the bottom, guide lines stroke themselves on.

## Colors

A warm paper-and-ink palette with one deep green identity colour and a champagne gold that only ever draws lines.

### Primary
- **Clinical Forest Green** (green): the identity colour. Primary buttons, italic emphasis words in display headlines on paper, active states (selected segment, active case, lit process node), full-section dark fields (Tecnologia, CTA), the map pin. Also used for text selection.
- **Deep Forest** (green-deep): the hover wipe inside primary buttons, the viewer screen sitting on the green field, the WhatsApp float on hover.

### Secondary
- **Champagne Gold** (gold): the drawing line. Annotation ticks, crop marks, nav underline, the 3px marker on the booking sheet and active tech mode, star ratings, the viewer status dot and progress meter. Never a text colour on paper, because it fails AA there; for the same reason focus rings are 2px green on paper and 2px gold-soft on the green and night fields.
- **Gold Ink** (gold-ink): gold strong enough for text on paper (AA). Sheet numbers, figure numbers, treatment codes (T.01), principle and step numerals, spec-list terms, CRO lines.
- **Soft Gold** (gold-soft): gold for text on green (AA). Italic emphasis in dark-field headlines, sheet numbers and mode numbers on green, footer credit link.
- **Guide Gold** (gold-guide): the pale gold of guide strokes drawn over photography (interpupillary line, midline, smile curve), light enough to read on skin and hair.

### Neutral
- **Paper** (paper): page background, booking sheet, hero tag, light button, mobile menu.
- **Paper Fold** (paper-2): tinted sheets (Especialistas, Processo), image placeholders, map ground, ghost button hover.
- **Paper Shadow** (paper-3): doctor portrait placeholder only.
- **Ink** (ink): headings and body text.
- **Graphite** (ink-2): secondary text, leads, labels, captions. On paper-2 sheets it darkens to **Graphite Deep** (ink-2-tint) to hold AA.
- **Parchment** (parchment): the cream used for text and lines on green, always at an opacity step: .78 for leads, .62 to .7 for secondary text and sheet metadata, .55 for HUD keys, .16 to .3 for rules.
- **Night** (night): footer field only.
- **White** (white): hover state of the light button, main road on the map.
- **Hairline** (line) and **Strong Hairline** (line-strong): every divider, list rule, field underline and ruler tick. Lists are separated by top rules, with a closing bottom rule on the last item.
- **Signal Red** (error): field error underline and message only.

### Named Rules
**The Gold Draws, Never Fills Rule.** Gold appears as a 1px line, a 3px marker, a tick, a dot or a numeral. No gold backgrounds, no gold buttons, no gold body text on paper.

**The Three Golds Rule.** Use the gold that fits the ground: gold for lines, gold-ink for text on paper, gold-soft for text on green, gold-guide for strokes over photos. Each exists because the others fail contrast in that context.

**The Whole Field Rule.** Green arrives as an entire section, edge to edge, never as a tinted card on paper. Inside a green field, text drops to parchment at an opacity step, and paper returns only as a sheet laid on top (the booking form, the light button).

## Typography

**Display Font:** Spectral (with Iowan Old Style, Georgia)
**Body Font:** Manrope (with Segoe UI, system-ui)

**Character:** A light, slightly calligraphic text serif set very thin (200 to 300) and tightly tracked, against a calm geometric sans that does all labelling in small tracked capitals with tabular figures. It reads as a measured technical document written by a careful hand.

### Hierarchy
- **Display Hero** (300, clamp(2.9rem, 4.7vw, 5.25rem), 1.0): the H1 only, set in three masked lines that rise in on load. The CTA title uses the same voice at clamp(2.8rem, 5.6vw, 5.5rem).
- **Display** (300, clamp(2.35rem, 4.6vw, 4.5rem), 1.04): every section H2. Two lines: a roman statement, then an italic 200 emphasis line in green (gold-soft on green). Balanced wrapping.
- **Numeral** (200, clamp(3rem, 5.4vw, 5.25rem), 0.95, tabular lining): ruler stats in green. Step numbers (clamp(2.6rem, 3.6vw, 3.5rem)) use gold-ink, and the hero tag figure is 44px.
- **Headline** (300, clamp(1.6rem, 2.5vw, 2.4rem), 1.1): treatment names in the index list. Pull quotes in testimonials sit at clamp(1.6rem, 2.6vw, 2.5rem) with 1.3 leading.
- **Title** (400, 26 to 28px, 1.15 to 1.2): principle names, doctor names, step names, booking title (300).
- **Body** (400, 16px, 1.65; 15.5px under 600px): running text. Leads run 17 to 18.5px at 1.7 to 1.75 in graphite, capped near 26 to 34em.
- **Label** (600, 10.5 to 12px, 0.12 to 0.16em, uppercase, tabular): sheet strips, form labels, figure numbers, HUD keys, compare tags, ruler captions.
- **Caption** (400, 12px, 0.02em): figure captions after the gold figure number.

### Named Rules
**The Italic Second Line Rule.** A display heading is a statement followed by an italic emphasis line at weight 200, in the identity colour for its ground. The italic carries the feeling and the roman carries the fact.

**The Tabular Rule.** Any number that could be compared (stats, codes, phone, hours, CRO, HUD values, counters) is set with tabular numerals.

## Layout

A 12-column grid with gap clamp(16px, 2vw, 32px) inside a 1480px container with gutter clamp(20px, 4.2vw, 72px). Section padding is clamp(96px, 13vw, 200px) top and bottom. The sheet strip sits clamp(48px, 6vw, 88px) above the section content.

The standard section head is asymmetric: heading spans columns 1 to 7 (or 8), the lead sits in columns 9 to 12 aligned to the baseline (`align-items: end`). Bodies continue the asymmetry: the philosophy photo takes columns 1 to 7 while the principles drop into 9 to 12 with a large top offset. The team portraits stagger vertically (0, 96px, 48px). The clinic gallery is a broken grid of six frames at different aspect ratios (4:3, 3:5, 16:10, 4:5, 3:4) with percentage top offsets and a text note in the last open cell.

The hero breaks the container: copy in columns 1 to 6 aligned to the container edge, portrait in columns 7 to 12 bleeding to the top and right edges of the viewport, with the paper tag overlapping the photo's left edge by 38% of its width.

Responsive behaviour:
- **≤1279px:** the hero guide text labels hide and the lines remain.
- **≤1180px:** the nav collapses to a MENU toggle with a full-screen paper menu (numbered display links). Treatment rows drop the description column.
- **≤960px:** every split head stacks. The hero portrait goes full-bleed at 4:5 below the copy, with the tag hanging off its bottom edge. Treatments show inline 88×110 thumbnails instead of the sticky preview. The team becomes a horizontal snap carousel. Process steps turn vertical with the rule running down the left. The header drops to 72px.
- **≤600px:** primary buttons go full width, the sheet-strip metadata wraps to its own line, the viewer goes square, mode descriptions hide, and the compare goes 1:1.

**The Asymmetric Head Rule.** Section heads never centre. The heading takes the left seven or eight columns, and the lead or control list takes the right four.

## Elevation & Depth

Flat. No shadows on surfaces. Depth is conveyed by overlapping planes and by tonal shifts between paper, paper-2, green and night. The hero tag overlaps the photograph, the booking sheet lies on the green field, the scanner photo drops 56px below the viewer, and the doctor card's paper strip slides up over the portrait on hover. Hairline separation uses `box-shadow: 0 1px 0 var(--line)` (the scrolled header) or an inset 1px ring (ghost button, square button, choice group), which are borders by other means, not elevation. The scrolled header adds a paper glass (`rgba(247,245,240,.82)` with `blur(10px) saturate(1.1)`) so content reads as passing under the sheet.

### Named Rules
**The Overlap, Not Shadow Rule.** To lift something, overlap it onto another plane or change its ground. Never add a drop shadow.

## Shapes

Square and drafted. Buttons and the square controls take a 2px radius, which reads as square. Every frame, card, field, viewer, tag and form is 0. The only circles are functional dots: the viewer status dot, the button spinner, the map pin, the guide-line dots on the hero. Fields are a single underline with no box. Segmented choices are one inset-ringed rectangle divided by 1px rules.

The recurring geometry is the drafting mark: a 1px rule ending in a 9px vertical tick (sheet strips, annotation ticks, the treatment-preview dimension line); 22px L-shaped crop marks in gold at opposite corners of a photo (top-left and bottom-right only); 3px gold markers at the top-left of a plane (booking sheet, active tech mode); and a ruler band with 80px major ticks and 8px minor ticks.

## Components

### Buttons
Solid, square, confident. A darker tone wipes up from the bottom on hover. Every hover treatment on the page (button wipes, link underlines, nav rule, treatment row, square buttons, footer links, WhatsApp float) also fires on `:focus-visible`, so keyboard users see the same affordance as the mouse.
- **Shape:** near-square (2px), min-height 54px, padding 0 28px, 14.5px Manrope 600.
- **Primary:** green ground, paper text. Hover: a green-deep layer scales up from the bottom over 480ms on the house ease. Active: translateY(1px) scale(.99). Loading: the label fades and a 18px ring spinner shows.
- **Light:** paper on green fields, hover wipe to white. Large size 64px tall, 0 36px, 16px.
- **Ghost:** transparent with a 1px inset strong-hairline ring, hover wipe to paper-2.
- **Small:** 44px, 0 20px, 13px. Used in the header and on the map.
- **Square (sq-btn):** 52×52, inset ring, hover fills green. For prev/next arrows.
- **Focus:** 2px gold outline, 3px offset (global).

### Text Links (link-arrow)
- 14.5px Manrope 600 in ink with a 1px arrow icon. Hover: an underline scales in from the left (origin switches right to left) and the arrow nudges 4px right.

### Sheet Strip (signature)
- Only at the four dossier chapters (Tecnologia, Resultados, Processo, Contato), numbered 01 to 04. Do not add it back to every section: repeated on all ten it became wallpaper.
The title block of each sheet. It is a full-width flex row: gold-ink sheet number ("Folha 05"), ink sheet name, a flexible strong-hairline rule ending in a 9px tick, then a graphite count or meta ("6 especialidades", "Antes · Depois"). Label type, 11.5px, 0.14em, uppercase, tabular. On reveal the rule draws from the left over 1.2s. The dark variant uses gold-soft, paper and parchment at .62. Exactly one per section. It replaces any eyebrow over the H2.

### Figure Caption
- "Fig. 07.4" in gold-ink 11px label caps, then a 12px graphite caption. The figure number is the sheet number plus the index. The light variant on green uses gold-soft and parchment at .7.

### Photo Frame
- Paper-2 placeholder ground, `overflow: hidden`, gold crop marks at top-left and bottom-right inset 14px. Unmasks bottom-up (`clip-path` inset over 1.25s, ease-io) and may carry a subtle scroll parallax (5 to 8%, image oversized to 112 to 116%).

### Team Portraits
Natural colour, soft studio or daylight light, light neutral backgrounds, subject facing the camera from head to waist, cropped 4:5. The set shares one gentle warm grade (red ×1.02, blue ×0.955, saturation 0.92) so cool studio greys sit with the paper palette; no grayscale filters and no dramatic low-key light. Hover only scales the photo and slides the paper strip up. Medical blue (scrubs, gloves) stays out of every photograph, as the brief asks.

### Index Lists
Treatments, principles, cases, spec rows and the mobile menu all use the same form: rows divided by 1px top hairlines with a closing bottom hairline, a gold-ink code in the first column (T.01, 01, Caso 01, Endereço), the name in Spectral, and graphite detail. Treatment hover: a green underline draws across the row, the name shifts 12px right and turns green, and the arrow fades in. The active case shows a 48px green tick at the right.

### Inputs / Fields
- **Style:** underline only. 52px tall, transparent, 1px strong-hairline bottom border, 16px text, placeholder #8E9491. Labels are label caps in graphite above the field. The select uses a drawn 8px chevron.
- **Hover:** underline darkens to graphite. **Focus:** underline turns green and doubles with `0 1px 0` green, with no outline box.
- **Error:** underline and 13px message in signal red. The message is announced politely and linked via aria-describedby.
- **Choice segment:** three equal cells in one inset-ringed rectangle, 48px tall. The selected cell fills green with paper text. Focus shows a gold outline inset 4px.

### Navigation
- Fixed header, 84px (72px ≤960px), transparent over the hero. After 24px of scroll it gets the paper glass and a hairline. Links are 14.5px Manrope 500 in ink, and the hover, keyboard-focus and current state is a 1px gold underline scaling in from the left. Brand is a drawn line mark plus "ELYRA" in Spectral 400 tracked .26em, over "ODONTOLOGIA" at 8.5px tracked .42em.
- **Mobile:** MENU/FECHAR text toggle with two bars that cross. The full-screen paper menu unmasks top-down (clip-path, .7s). Links are numbered (01 to 06 in gold-ink) display-size Spectral rows that rise in with 50ms staggers, followed by primary and ghost block buttons and hours.

### Digital Studio Viewer (signature)
An instrument screen on the green field: green-deep panel with a 1px green-line border, a 44px top bar (pulsing gold dot, "Elyra · Estúdio digital", filename in parchment .5), and a canvas holding a procedural point cloud of an upper arch in parchment and gold. Four modes (scan sweep, smile planning with dashed midline and mm dimensions, x-ray with roots, layer-by-layer 3D print) auto-cycle every 8s until the user picks one. A tablist of four mode cells below has 3px gold progress markers. HUD corners use label-sm keys and 14.5px values. The canvas carries a 40px measurement grid at parchment 5% (see Do's and Don'ts). Drag rotates. With reduced motion it renders static and complete.

### Before/After Compare
Full-width frame (16:8, 4:3 ≤960px, 1:1 ≤600px), 1px paper handle with a 9px millimetre scale running down it, a 52px square paper grip with a drawn double chevron, and dark translucent "ANTES / DEPOIS" tags. A visually hidden range input drives it for keyboard use. On first view it sweeps once to show it can be dragged. Case tabs sit in the section head as an index list.

### Hero Tag
Paper plane with a 1px hairline border and a 28px gold top-left marker, overlapping the portrait edge. It holds a Spectral 300 numeral (44px, green) beside a two-line label-caps caption.

### WhatsApp Float
52px green square (2px), fixed bottom-right. It enters after 60% of a viewport of scroll and flips to paper while over the green and night fields. The tooltip is an ink plate that slides in from the left.

## Do's and Don'ts

### Do:
- **Do** open every section with one sheet strip: number in gold-ink, name in ink, a rule ending in a 9px tick, and a count.
- **Do** number figures to their sheet ("Fig. 03.1") and frame photographs with paired gold crop marks (top-left and bottom-right).
- **Do** set display headings in Spectral 300 as a roman line plus an italic 200 emphasis line in green (gold-soft on green fields).
- **Do** keep gold to 1px lines, 3px markers, ticks, dots and numerals. Use gold-ink for any gold text on paper and gold-soft on green.
- **Do** separate list rows with 1px hairlines (line, rgba(23,32,29,.14)) and close the last row with a bottom rule.
- **Do** create depth by overlapping planes (a paper tag on a photo, a paper sheet on green), never by shadow.
- **Do** animate by drawing: rules scale from the left, images unmask bottom-up with cubic-bezier(.65,0,.35,1), and content rises 26px over .9s on cubic-bezier(.16,1,.3,1). Honour prefers-reduced-motion with static, complete states.
- **Do** use tabular numerals for every stat, code, phone number, hour and HUD value.

### Don't:
- **Don't** round corners beyond 2px. No pill buttons, no rounded cards.
- **Don't** use medical blue, gradients as decoration, or drop shadows on surfaces.
- **Don't** build generic icon-card grids. Services are an index list with codes, not tiles.
- **Don't** put a free-standing uppercase label above a headline. The sheet strip is the section's only title block, and the hero annotation label is a recorded exception, not a pattern.
- **Don't** use gold (#B89565) for text on paper or as a fill.
- **Don't** centre section heads. Keep the asymmetric 7+4 split.
- **Don't** extend the viewer's measurement grid to paper sections. It belongs to the instrument screen only.

### Open decisions (recorded, unresolved)
- **Hero label above the H1.** The "Odontologia contemporânea" annotation (gold tick plus gold-ink label caps) is kept because the brief requires it. It is an eyebrow, so it stays a single exception. Don't reuse the annotation style above other headings.
- **Results comparator (Atual / Planejado).** One untouched photograph per case. The handle reveals a planning layer (an SVG with the same viewBox as the photo, `preserveAspectRatio="xMidYMid slice"` so it registers with `object-fit: cover` at every aspect ratio), drawn in guide gold `#E7D3B0` with a soft dark drop-shadow for legibility over teeth and skin: tooth outlines, incisal curve, midline (dashed), dimension marks and, for whitening, a shade-tab scale. No recolouring of the photo; "Imagem ilustrativa · planejamento simulado" sits inside the frame. Overlay coordinates are hand-registered per photo and must be redrawn if a photo changes.
- **Viewer measurement grid.** The 40px grid at parchment 5% behind the point cloud is kept on purpose as the instrument-screen material. It is scoped to the viewer canvas.
