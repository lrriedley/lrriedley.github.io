## Content fundamentals

Write like a menu, not a memo: short, confident nouns and verbs, no filler adjectives ("robust," "seamless," "world-class"). Prefer the specific over the general — a case study says what shipped and what it moved, not that it was "a great experience." Address the reader as "you" only in interface copy (buttons, form hints); everywhere else, write in first person about the work ("I led," "we shipped"), never third person or a royal "we" for a one-person site. No emoji, anywhere. Section eyebrows and nav items are set in `label` and read as menu categories — short, two to four words, title case ("Selected Work," "About," "Now"). Numerals are set as numerals (24, not twenty-four) except at the start of a sentence.

## Visual foundations

**Surfaces.** `surface-100` is the page ground — nearly everything sits on it. Raise a nav bar, a card or a form field onto `surface-200`; sink a footer or a full-width divider band onto `surface-300`. Never stack more than these three at once, and never introduce a fourth surface tone.

**Text.** Set primary text and every heading in `ink`. Drop to `ink-muted` for captions, form hints and meta rows — never for a heading, and never below 14px, so it clears 4.5:1 on both `surface-100` and `surface-200`.

**The accent.** `brass` and `brass-strong` are the same idea at two strengths, and they are not interchangeable. `brass` is decorative only — icon strokes, hairline-adjacent flourishes, a rule, or a headline set 24px or larger; at 3.7:1 on `surface-100` it is not legible enough for a sentence. `brass-strong` is the text-safe version: every link, every active nav or tab state, every focus ring, and the fill behind any button or tag that carries a label — always paired with `on-brass` for the text or icon that sits on it. When in doubt, pick `brass-strong`.

**Borders, not shadows.** This system has no shadow token, on purpose — depth comes from a hairline, not a drop shadow. Edge a card or panel with a 1px `hairline` rule; reach for `border-strong` only on an interactive control (an input, a select) that needs to read as a boundary you can click into. Never add a box-shadow to simulate elevation.

**Type.** `display-xl`, `display-lg` and `display-md` are set in the serif and carry the editorial voice — a name, a section head, a card title. Everything a reader actually reads at length — `body-lg`, `body` and `body-sm` — is set in the sans, because a serif this warm gets fussy in long paragraphs. `label` is the menu voice: uppercase or small caps, letter-spaced, used for nav items, section eyebrows and tag text, never for a sentence. `meta` sits beside a title for a date or a role, in `ink-muted`.

**Spacing and radius.** Space by the scale, not by eye: `space-3` between related elements, `space-4` under a heading, `space-5` between cards, `space-6` for page gutters and the gap between sections. Corners stay close to square — `radius-sm` on buttons and inputs, `radius-md` on cards and images — except a tag or the eyebrow's leading dot, which takes `radius-pill` and reads as a period, not a bubble.

**Loading the type.** Both families are hosted, not shipped as files: load `Fraunces` (weights 400, 500, 600) and `Work Sans` (weights 400, 500, 600) from Google Fonts before `tokens.css`, or the serif and sans fall back to Georgia and system-ui.

**Imagery.** Use real photography for work samples and case-study headers, never an icon or an illustration standing in for a screenshot. Crop to `radius-md`, never full-bleed rounded circles. Where no photograph exists yet, leave the frame in plain `surface-200` with a `label`-styled caption naming what belongs there — don't fill it with a placeholder icon.

## Iconography

No icon set is defined yet. Where a glyph is unavoidable (an external-link mark, a chevron), draw it as a single-weight hairline stroke in `ink` or `brass` at 3.7:1 or better against its ground, never filled and never a generic dashboard-icon-pack chevron-in-a-circle. Prefer a text label over an icon by default — this is a menu, and menus mostly use words.
