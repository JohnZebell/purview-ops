# Purview Ops — Build Instructions

For Claude Code. Copy lives in `purview_homepage_copy.md`. Layout reference is `purview-home-v2.html`. Build against that, not the earlier wireframe.

**This is the original build spec, kept as written.** Three of its decisions have been superseded since the site shipped. Each is annotated in place below rather than removed, so the reasoning that produced it stays readable. They are the page list in section 1, the chat widget ban in section 2, and the single CTA rule in section 4. Everything else still holds.

---

## 1. Stack

Next.js on Vercel. Static, no CMS, no database, no auth. Six pages, though only the first two are required to ship.

```
/            Home
/audit       The RevOps Audit
/work        What we build, by stage
/method      How the diagnosis works
/about       First person, who this is
/notes       Writing. Build last, only with three posts in hand.
```

Ship at home and /audit if needed. Do not scaffold /notes until there is content for it.

**Superseded in part.** The list above is missing `/timing`, which shipped as a sixth page per `purview_site_restructure.md` line 81. `/notes` is still correctly unbuilt. The live six are `/`, `/audit`, `/work`, `/timing`, `/method` and `/about`.

---

## 2. Design system

### Color

| Token | Value | Use |
|---|---|---|
| base | `#FAF8F5` | Page background. Warm near white. Never pure white, never grey |
| surface | `#FFFFFF` | Card and panel backgrounds only |
| ink | `#141613` | Body and headline text |
| muted | `#5C605A` | Secondary text, labels, card body |
| rule | `#DDD8D0` | All hairlines and borders |
| green | `#22402F` | Accent. Deep, muted forest |
| green-soft | `#E8EDE9` | One callout panel background. Nowhere else |

**Set `color-scheme: light` on `:root`.** Required, not optional. Without it, devices in dark mode invert the palette. Do not build a dark theme.

**Green appears in exactly five places.** The wordmark's second word, the correct value in the hero diagram, the step numerals, link text, and the solid buttons. Never a gradient, never a section background, never a large fill.

### Type

- Headlines: **Fraunces**, weight 400, letter-spacing -0.02em, line-height 1.1
- Body: **Inter**, weight 400, 17px base, line-height 1.6
- Labels, figures, prices, step numbers: **JetBrains Mono**

Fluid scale. `h1: clamp(2.4rem, 6.5vw, 4.2rem)`, `h2: clamp(1.6rem, 3.4vw, 2.4rem)`.

Section labels are mono, 0.72rem, uppercase, 0.14em letter-spacing, muted.

Headlines get an explicit `max-width` in `ch` so they wrap where they should rather than running the full column. Roughly 16-22ch depending on the line.

### Layout, and this is the part that matters most

**Nothing is centered.** The single biggest failure mode here is a narrow text column floating in the middle of a wide screen. It reads as unfinished.

The structure is a two column grid on every section.

```
.shell  max-width 76rem, margin auto, padding 0 2rem
.row    grid-template-columns: 9rem 1fr  (at >=56rem)
        gap 3rem
        collapses to single column below 56rem
```

Left column holds the mono section label. Right column holds all content. Content starts at a fixed left edge and the right side stays open. That open right margin is deliberate.

Paragraphs get `max-width: 60ch` so the reading line stays short even though the container is wide. This is what replaces centering.

Section padding 5rem mobile, 6rem at 56rem and up. Every section separated by a 1px `rule` top border. No background color changes between sections.

### Visual moments

The page needs structure, not just text. Three non-paragraph elements carry it.

**1. Hero diagram.** A bordered panel beside the headline, two column on desktop at `1.15fr 1fr`, stacked on mobile. Shows one metric computed two ways with two different answers. The wrong one is muted with a strikethrough, the right one is green. A mono caption underneath. This is the thesis in one glance.

**2. Symptom list.** The enemy section's four symptoms are separate rows with hairline dividers, not a paragraph. They scan rather than read.

**3. Process strip.** Three steps in the audit section, mono numerals, three columns on desktop and stacked below 56rem. Top border only, no boxes.

Plus the numbered fact rows in the differentiator section, which use a `2.25rem 1fr` grid with mono numerals in green and hairline dividers.

### What not to do

- **Do not center content.** See above. This is the rule everything else depends on.
- **Cards only in the stage selector.** Everywhere else use rules, spacing, and type hierarchy. A page of boxes is the strongest tell of generated UI.
- **Border radius maximum 2px.** Not 8, not 12.
- **No shadows.** Borders only.
- No gradients, glassmorphism, emoji, or icon badges.
- No scroll animations, parallax, count-up numbers, or motion that does not explain something.
- No chat widget, exit popup, or countdown. **Superseded** by `purview_assistant_spec.md`. The assistant widget ships, bottom right and closed by default. Exit popups and countdowns stay out.
- No stock photography, no team photos, no logo wall.

---

## 3. Responsive

Mobile first. Test at 320, 375, 768, 1024, 1440.

| | Base | `48rem` | `56rem` | `72rem` |
|---|---|---|---|---|
| Section rows | 1 col | 1 col | `9rem 1fr` | same |
| Stage cards | stacked | 2 col | 2 col | 4 col |
| Hero | stacked | stacked | stacked | `1.15fr 1fr` |
| Process strip | stacked | stacked | 3 col | same |
| Section padding | 5rem | 5rem | 6rem | 6rem |

Requirements.

- **No horizontal overflow at 320px.** Test explicitly.
- **Tap targets minimum 44px.** Header CTA, all buttons, all card links.
- **Any table on /method or /work becomes stacked key-value pairs below 48rem.** Never a horizontally scrolling table.
- Header is sticky with a `base` background and a bottom rule so it does not float over content.
- Stage cards use `display:flex; flex-direction:column` with the link pushed down by `margin-top:auto`, so links align across a row regardless of copy length.

---

## 4. Home page structure

Section order. Copy is in `purview_homepage_copy.md`. Visual reference is `purview-home-v2.html`.

1. **Header.** Sticky. Wordmark left, solid green CTA button right. Bottom rule.
2. **Hero.** No top border. Two column at 64rem and up. Left is headline, one line subhead, one button. Right is the diagram panel. Stacked below that.
3. **Enemy.** Label left. Headline, one paragraph, the four symptom rows, then two closing lines. Last line bold.
4. **Differentiator.** Label left. Headline, four numbered fact rows with hairline dividers. Not cards.
5. **Stage selector.** Label row on top, then four cards full width of the shell. Each links to its anchor on /work.
6. **Audit.** Label left. Headline, mono price bar with top and bottom rules, three step process strip, the three engines paragraph, the check list, a soft green callout, then the button.
7. **Boundary.** Label left, two short paragraphs.
8. **Close.** Empty label column, headline, one line, button.
9. **Footer.** Wordmark line and location. Nothing else.

**Check list markers** are a 0.6rem green horizontal rule positioned absolutely, not a bullet or checkmark. Each item separated by a hairline.

**One CTA, repeated.** Same label and destination in the header, hero, audit section, and close. No second action anywhere on the page.

**Superseded** by `purview_copy_pass.md` lines 20 to 25. The audit section button now reads "See what we check" and points at `/audit`, and the boundary section gained "How the diagnosis works" pointing at `/method`. Three audit CTAs remain, in the header, hero and close.

**Hero diagram numbers are placeholders.** Replace with real figures when available.

## 5. Wordmark

Text only. "Purview" in ink, "Ops" in green, set in Fraunces at 1.3rem. No icon, no mark, no abstract shape. Do not generate a logo.

---

## 6. Order of work

1. Home page, complete and responsive.
2. `/audit` as the full offer page. This is where anyone arriving from a recorded walkthrough lands.
3. `/work` with four anchored sections matching the stage selector.
4. `/method`.
5. `/about`, first person.
6. `/notes` only when three posts exist.

---

## 7. Acceptance checks

- Renders correctly with the OS set to dark mode. The palette must not invert.
- No horizontal scroll at 320px.
- Lighthouse performance above 95. There is no reason for this site to be slow.
- Every heading level in order, no skipped levels.
- Contrast passes AA on `muted` text against `base`.
- Fonts self-hosted or preloaded. No layout shift on load.
- Three font families, no more. No images.

Page weight is no longer a numbered gate. The original 200KB figure was
arbitrary, and fonts and JS cache across pages, so only the first page a
visitor lands on pays for them. The constraints that remain are the two above.

Do not hand-subset Inter to buy back kilobytes. Note also that pinning Inter to
static weights in `next/font` saves nothing, since Google ships it only as a
variable font and returns the same 47.3KB file either way.
