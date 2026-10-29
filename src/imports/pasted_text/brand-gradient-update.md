## A. WHAT IS CHANGING, AND WHAT IS NOT
 
The brand colour `#E10B17` is not being replaced. It is being given depth. The new gradient is that same hue at three lightness levels, so every existing screen stays on-brand — surfaces gain dimension, nothing shifts colour.
 
**The single most important rule in this document: gradients go on large surfaces only.** A gradient on a 20 px chip or a 2 px underline does not read as a gradient — it reads as a muddy, slightly-wrong red. Roughly 8–12 elements in the entire design should carry a gradient. Everything else keeps the flat `#E10B17` it already has.
 
If you are unsure whether an element is large enough, it isn't. Leave it solid.
 
---
 
## B. NEW GRADIENT DEFINITIONS
 
**Figma mechanics note:** Figma colour *variables* hold solid fills only — gradients must be created as **paint styles**. Create the styles below under a `Gradient/` group, and keep the existing solid colour variables exactly as they are. Both systems coexist.
 
### `Gradient/Brand Radial` — large surfaces
 
Matches the reference image. Radial gradient:
- Focal point at **58% horizontal, 100% vertical** (bottom-centre, just right of middle)
- Ellipse sized to roughly 140% of the container width
- Stops: `0% #E10B17` → `55% #B80A14` → `100% #88070E`
Use for: hero overlays, the membership CTA band, the page-header wash on portal pages, the dashboard dues-card accent, full-width section bands.
 
### `Gradient/Brand Button` — interactive surfaces
 
Linear, **135°** (top-left to bottom-right):
- `0% #E10B17` → `100% #A80912`
A shorter range than the radial. Buttons are small enough that the full three-stop ramp turns to sludge. Two stops, one hue, mild travel.
 
### `Gradient/Brand Button Hover`
 
Linear 135°: `0% #F0141F` → `100% #B80A14`
(Both ends lifted about 4% lightness — the button gets brighter on hover, not darker.)
 
### `Gradient/Brand Button Pressed`
 
Linear 135°: `0% #C00A15` → `100% #8E080F`
 
### `Gradient/Brand Subtle` — tinted bands
 
Linear 160°: `0% #FFF1F2` → `100% #FFE4E6`
Replaces flat `brand/red-50` on large tinted sections only. Small `red-50` fills (chip backgrounds, hover states, icon circles) stay flat.
 
### `Gradient/Brand Vertical` — strips and bars
 
Linear 180°: `0% #E10B17` → `100% #9C0911`
For horizontal bars wider than roughly 600 px where a 135° angle would be so shallow it looks like a rendering error.
 
---
 
## C. APPLY THE GRADIENT TO THESE — AND ONLY THESE
 
Work through this list. If an element is not on it, it keeps its current flat colour.
 
**Buttons**
1. Primary button, all sizes (sm/md/lg) — `Gradient/Brand Button`
2. Primary button hover — `Gradient/Brand Button Hover`, plus keep the existing `e-glow` shadow
3. Primary button pressed — `Gradient/Brand Button Pressed`
4. Destructive button — same three states as primary
5. Primary button **disabled** — **no gradient**. Flat `surface/100` fill with `ink/300` text, as now.
6. Primary button **loading** — keeps the default gradient, spinner in white
**Large surfaces**
7. Membership CTA band on the home page — `Gradient/Brand Radial` as an overlay on the photograph at 78% opacity, replacing the current flat `ink/900` 60% overlay
8. Public inner-page header wash — swap one of the two blurred radial glows to `Gradient/Brand Radial` at 12% opacity
9. Portal page header wash — same treatment at 10% opacity
10. Dashboard dues card top edge — the 2 px accent becomes 4 px and takes `Gradient/Brand Vertical`
11. Mobile bottom sticky action bar's primary button — `Gradient/Brand Button`
12. The 404 page's oversized "404" numeral — `Gradient/Brand Radial` as a text fill
 
**Membership card**
13. The corner glow bleeding into the Frosted Membership Card — currently a soft `brand/red-500` blur; change to a radial fade from `#E10B17` at 22% opacity to transparent. Keep it soft. This is the one place a gradient is allowed to be subtle to the point of near-invisibility.
 
**Section dividers**
14. The thin brand rule above the footer — `Gradient/Brand Vertical` rotated to horizontal, fading to 40% opacity at both ends
 
---
 
## D. THESE STAY FLAT `#E10B17` — DO NOT TOUCH
 
Explicitly leave these as solid fills. Applying a gradient to any of them is a regression.
 
- Focus rings (all of them — a gradient focus ring is an accessibility problem, not a style choice)
- Nav link underlines and the growing-underline hover animation
- The 3 px active-state left bar on sidebar items
- All chips, tags, badges and pills — including tier chips, status chips, category chips, file-type pills
- Icon fills and icon-button strokes
- Inline text links and their underlines
- List bullets and custom checkmarks
- Table sort-indicator active state
- Pagination current-page indicator
- Form field focus borders
- The red left bar on callout boxes and alerts
- Progress-bar fills under 8 px tall
- Stepper node fills and connector rails
- The dot badge on the notification bell
- Any element smaller than roughly 44 × 44 px
Rule of thumb to hand the AI: **if it's smaller than a button, it stays solid.**
 
---
 
## E. TECHNICAL CONSTRAINTS
 
**Angle consistency.** Every linear gradient on an interactive element uses 135°. Not 130°, not 140°, not "diagonal". A row of three buttons with slightly different gradient angles looks broken in a way people notice without being able to name.
 
**Banding.** On any gradient surface larger than about 400 × 400 px, add a noise overlay at 2–3% opacity in overlay blend mode. Wide, low-contrast red ramps band badly on ordinary monitors, and this is the standard fix.
 
**Text contrast is safe.** White text on the brightest point of the gradient (`#E10B17`) measures 4.93:1, which clears WCAG AA for normal text. Every darker stop is safer still. So: all text on any brand gradient is pure white, `#FFFFFF`, at full opacity. Never grey, never white-at-80%, never `ink` tones.
 
**Gradient behind glass.** Where a glass panel sits over a gradient surface, the perceived tint shifts across the panel. Keep `glass/fill-tinted` derived from the flat `#E10B17` as it is now — do not make the glass fill itself a gradient. Blur plus gradient plus translucency compounds into an unpredictable muddy result.
 
**Gradient borders.** Do not attempt gradient strokes. Where a red border is needed, use flat `#E10B17`. Figma's gradient strokes export unreliably and developers will have to reimplement them as a background-clip hack.
 
**Text fills.** The only text permitted to carry a gradient fill is the 404 numeral. Body copy, headings, labels and numbers never do.
 
---
 
## F. DEVELOPER HANDOFF VALUES
 
Include these as an annotation frame in the file so the front-end team has the exact CSS:
 
```css
--brand-red:            #E10B17;  /* unchanged, still the token */
--brand-red-mid:        #B80A14;
--brand-red-deep:       #88070E;
 
--gradient-brand-radial:
  radial-gradient(ellipse 140% 120% at 58% 100%,
    #E10B17 0%, #B80A14 55%, #88070E 100%);
 
--gradient-brand-button:
  linear-gradient(135deg, #E10B17 0%, #A80912 100%);
 
--gradient-brand-button-hover:
  linear-gradient(135deg, #F0141F 0%, #B80A14 100%);
 
--gradient-brand-button-pressed:
  linear-gradient(135deg, #C00A15 0%, #8E080F 100%);
 
--gradient-brand-vertical:
  linear-gradient(180deg, #E10B17 0%, #9C0911 100%);
 
--gradient-brand-subtle:
  linear-gradient(160deg, #FFF1F2 0%, #FFE4E6 100%);
```
 
Note for the developer: gradients do not transition in CSS. Animating between the default and hover gradients requires either a pseudo-element cross-fade or a `background-position` shift on an oversized gradient. Specify the pseudo-element approach — it's more predictable.
 
---
 
## G. VERIFICATION PASS
 
After applying, check these five things and report anything that fails:
 
1. No element under 44 px carries a gradient.
2. Every primary button in the file uses the same 135° angle.
3. All text sitting on a gradient is pure white.
4. Focus rings are still flat `#E10B17` everywhere.
5. The disabled button state has no gradient at all.