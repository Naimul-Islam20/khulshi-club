# FIGMA AI PROMPT — Chittagong Khulshi Club Limited (CKCL) Website Redesign

---

## 0. ROLE & OBJECTIVE

Act as the lead product designer at a boutique studio that specialises in premium hospitality and private-members-club digital identities. You are producing a complete, production-ready UI design file for a full website redesign — not a moodboard, not a landing page.

Build the entire design in **light theme only**. There is no dark mode. Do not generate one.

Deliver every screen at **three breakpoints**: Desktop (1440 px), Tablet (834 px), Mobile (390 px). Every screen must exist at all three sizes. Use Figma auto-layout, constraints, variables, and component variants throughout so the file is handoff-ready for a developer.

The client is **Chittagong Khulshi Club Limited (CKCL)** — a private social and recreational club founded in 2013 in Khulshi, Chattogram, Bangladesh. Trade License No. 89056. It is a real, operating club with an existing website that looks a decade old: crowded carousels, tiny type, boxy grey cards, no hierarchy. The redesign must feel like a modern luxury club — calm, spacious, confident, and unmistakably premium — while keeping every piece of functional content the current site carries.

Audience: affluent Chattogram business owners, professionals and their families, aged 30–60, plus prospective members evaluating whether to apply. Many members read Bangla as their first language. The site's single most important job is to make the club look worth joining, and to make **Become a Member** and **Member Login** effortless.

---

## 1. DESIGN DIRECTION

**Aesthetic:** Modern glassmorphism layered over a light, airy, editorial base. Frosted translucent surfaces floating above soft photographic and gradient backdrops. Generous white space. Large confident typography. Rounded but not bubbly geometry. Subtle depth through blur and layered shadow rather than heavy borders.

**Restraint rule:** Glass is the accent, not the wallpaper. Roughly 20–30% of surfaces should be glass; the rest are solid white or off-white cards. Overusing glass makes text illegible and the design cheap. Glass belongs on: the navigation bar, hero-overlapping cards, stat/quick-info strips, image overlays, the media lightbox, modals, sticky action bars, and the membership card motif. Glass does **not** belong on long-form article bodies, dense data tables, or form input backgrounds.

**Signature element — the Frosted Membership Card.** This is the one thing the site is remembered by. Design a recurring glass card component shaped like a physical club membership card (aspect ratio ~1.586:1, i.e. a credit-card ratio, radius 20 px): frosted white translucent fill, a hairline light border, a soft red glow bleeding from one corner, the CKCL monogram embossed at low opacity in the background, and a thin brass hairline along one edge. Reuse this exact object as: the hero's floating "Membership at a glance" card, each member's directory card, the Become-a-Member CTA block, the logged-in member's dues card, and the tier cards on the Membership Process page. It ties the glassmorphism to something real about the subject rather than being decoration.

**One deliberate risk (keep it):** the hero does not use a slideshow. The current site has an eight-slide carousel that nobody watches. Replace it with a single, still, cinematic full-bleed photograph of the club, cropped tall, with a slow gentle Ken Burns scale on load only, and the glass membership card overlapping its lower-left corner. Stillness reads as confidence; carousels read as 2013.

**Avoid these clichés:** cream-and-terracotta palettes, purple-blue gradient meshes, glowing neon-on-dark panels, 3D blob shapes, generic "01 / 02 / 03" numbered feature markers unless the content is genuinely sequential, and stock-looking icon-in-a-circle rows.

---

## 2. DESIGN TOKENS (create these as Figma Variables)

### Colour — Brand

| Token | Hex | Use |
|---|---|---|
| `brand/red-600` | **#E10B17** | Primary brand (from logo). CTAs, active states, focus rings, key accents. |
| `brand/red-700` | #B70813 | Hover / pressed on primary buttons. |
| `brand/red-500` | #F2333D | Gradient partner, decorative glows only. |
| `brand/red-50` | #FFF1F2 | Tinted section backgrounds, badges, subtle fills. |

### Colour — Neutrals & Support

| Token | Hex | Use |
|---|---|---|
| `ink/900` | #0E1116 | Headlines, primary text. |
| `ink/700` | #2A3039 | Body text. |
| `ink/500` | #5C6673 | Secondary text, captions, metadata. |
| `ink/300` | #A8B0BB | Placeholder text, disabled, dividers on dark. |
| `surface/0` | #FFFFFF | Cards, sheets. |
| `surface/50` | #F7F8FA | Page background. |
| `surface/100` | #EEF1F5 | Alternating section bands, input fills. |
| `line/200` | #E2E6EC | Hairline borders, table rules. |
| `brass/500` | #B98B43 | Heritage accent — hairlines on the membership card, "Founding Member" tier, award/est.-2013 marks. Use sparingly, under 5% of surface area. |
| `success/500` | #15803D | Paid dues, confirmations. |
| `warn/500` | #B45309 | Overdue dues, deadlines. |

Red is a signal colour, not a background colour. Never set body text in red. Never place red text on glass. Do not tint whole sections red — use `brand/red-50` when a warm band is needed.

### Glass tokens

- `glass/fill-strong` — #FFFFFF at 72% opacity, background blur 32, border 1 px #FFFFFF at 70%
- `glass/fill-medium` — #FFFFFF at 55% opacity, background blur 24, border 1 px #FFFFFF at 60%
- `glass/fill-subtle` — #FFFFFF at 38% opacity, background blur 16, border 1 px #FFFFFF at 45%
- `glass/fill-tinted` — #E10B17 at 8% opacity, background blur 24, border 1 px #FFFFFF at 50% (for red-accented glass only)
- `glass/inner-highlight` — a 1 px inner top edge stroke, #FFFFFF at 85%, to give the lip of light that makes glass read as glass
- `glass/shadow` — Y 16, blur 48, spread −8, #0E1116 at 10%, plus a second Y 2, blur 6, #0E1116 at 6%

Every glass surface must sit over either a photograph, a soft coloured blur, or a coloured section — never over flat white, because glass over white looks like nothing. Where a glass card must sit on a plain area, place two soft blurred radial shapes behind it: one `brand/red-500` at 12% opacity, one `brass/500` at 8%, blur 120.

**Legibility hard rule:** any text on glass must be `ink/900` or `ink/700` and must pass 4.5:1 contrast against the *lightest* pixel behind it. If it doesn't, add a white-to-transparent scrim behind the text or switch that card to `surface/0`.

### Typography

- **Display face:** `Fraunces` — weights 500 and 600, optical size high, slight negative tracking on large sizes. Used for page titles, hero headline, section headings. Characterful, warm, slightly editorial, gives the heritage-club feeling without looking like a wedding invitation.
- **Body face:** `Plus Jakarta Sans` — 400, 500, 600, 700. All body copy, UI labels, buttons, forms, tables.
- **Utility face:** `IBM Plex Mono` — 500, uppercase, letter-spacing 0.12em, 11–12 px. Eyebrows, dates, member IDs, dues amounts, notice reference numbers, "EST. 2013".
- **Bangla faces (mandatory — the site publishes notices in Bangla):** `Hind Siliguri` for Bangla body and UI, `Noto Serif Bengali` 600 for Bangla headings. Every text style must have a Bangla counterpart style. Bangla glyphs need more vertical breathing room: set Bangla line-height 8–10% looser than the Latin equivalent, and never set Bangla in all-caps or tight tracking.

**Type scale (desktop → tablet → mobile):**

- Display XL — Fraunces 600, 72 / 60 / 40 px, line-height 1.05, tracking −2%
- Display L — Fraunces 600, 56 / 44 / 32 px, line-height 1.1, tracking −1.5%
- Heading 1 — Fraunces 600, 40 / 34 / 27 px, line-height 1.15
- Heading 2 — Fraunces 500, 30 / 26 / 22 px, line-height 1.25
- Heading 3 — Plus Jakarta Sans 700, 22 / 20 / 18 px, line-height 1.3
- Body L — Plus Jakarta Sans 400, 18 / 17 / 16 px, line-height 1.65
- Body M — Plus Jakarta Sans 400, 16 / 16 / 15 px, line-height 1.6
- Body S — Plus Jakarta Sans 400, 14 px, line-height 1.55
- Label — Plus Jakarta Sans 600, 14 px, line-height 1.2
- Eyebrow — IBM Plex Mono 500, 12 px, uppercase, tracking 0.12em
- Caption — Plus Jakarta Sans 400, 13 px, `ink/500`

Body copy measure: max 68 characters per line. Never let long-form text run the full 1440 width.

### Spacing, radius, elevation

- Spacing scale (8 px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160
- Section vertical padding: 128 desktop / 88 tablet / 64 mobile
- Radius: `sm` 8, `md` 12, `lg` 20, `xl` 28, `pill` 999. Cards use `lg`. The navbar uses `pill` on desktop and `xl` on mobile. Nothing is fully square except tables and image edges that meet the viewport.
- Shadows: `e1` Y2 blur8 4%; `e2` Y8 blur24 8%; `e3` Y16 blur48 10%; `e-glow` Y0 blur40 `brand/red-600` at 18% (hover on primary CTAs only).

### Grid

- **Desktop 1440:** 12 columns, 80 px margins, 24 px gutters, content max-width 1280, inner reading width 1120.
- **Tablet 834:** 8 columns, 40 px margins, 20 px gutters.
- **Mobile 390:** 4 columns, 20 px margins, 16 px gutters.

Touch targets minimum 44 × 44. Body text never below 15 px on mobile.

---

## 3. THE NAVBAR — CROPPED, FLOATING, GLASS (build this first, it sets the tone)

This is the client's explicit requirement. Build it as a component set with variants.

### Desktop — default state (page at scroll position 0)

A **detached, cropped, floating bar** — it does not touch any edge of the viewport.

- Width 1280 px, centred, inset 20 px from the top of the viewport and 80 px from each side. It is visibly a floating object with page content sliding underneath it.
- Height 72 px, radius `pill` (999).
- Fill `glass/fill-medium`, background blur 24, 1 px border #FFFFFF at 60%, `glass/inner-highlight` on the top edge, shadow `e3`.
- Layout: CKCL logo left (height 40 px), primary nav links centre, actions right.
- Nav links (Label style, `ink/700`): Home · About · Facilities · Membership · Media · Resources · Contact — each with a 12 px chevron where a dropdown exists.
- Actions right: a ghost pill button **Member Login** (transparent fill, 1 px `ink/300` border, `ink/900` text) and a solid pill button **Become a Member** (`brand/red-600` fill, white text).
- Above the floating bar on desktop only, add a slim utility row inside the hero image area (not a separate bar): phone `+880 1988 896 906`, email `info@ckclbd.com`, and small social icons, set in Caption style in white at 80% opacity. It disappears on scroll.

### Desktop — scrolled state (after 80 px of scroll)

The bar **crops inward and compresses** — this is the "cropped hovering" behaviour:

- Width shrinks 1280 → 1080 px, still centred.
- Height 72 → 58 px.
- Top inset 20 → 12 px.
- Fill switches to `glass/fill-strong` (72% white, blur 32) so text stays readable over any content.
- Shadow deepens to `e3` plus a 1 px bottom hairline `line/200` at 60%.
- Logo swaps from full wordmark to the compact CKCL monogram.
- Transition: 240 ms, ease-out, all properties animating together.

Document both states as separate frames side by side, labelled `Navbar / Desktop / Rest` and `Navbar / Desktop / Scrolled`, with an annotation describing the transition.

### Link states

- Default: `ink/700`.
- Hover: `ink/900` text, plus a 2 px `brand/red-600` underline that grows from the centre outward, 160 ms; the link's own pill-shaped hover background fades in at `brand/red-50` 60%.
- Active/current page: `ink/900` 600 weight with a persistent 2 px `brand/red-600` underline.
- Focus-visible: 2 px `brand/red-600` ring, 2 px offset, radius pill.

### Dropdowns — glass mega-panels

The current site has grouped multi-column menus. Keep that structure, modernise the surface.

- Panel detaches from the bar with a 10 px gap, radius `xl` (28), fill `glass/fill-strong`, blur 32, shadow `e3`, padding 32.
- Enter: fade in + translate Y from −8 px to 0, scale 0.98 → 1, 180 ms ease-out. Exit 120 ms.
- Column headings in Eyebrow style, `ink/500`; items in Body M, `ink/700`, each row 40 px tall with a hover fill `brand/red-50` and radius `md`.
- **About** panel — two columns: *About CKCL* (About Club, Mission, Vision, Terms & Conditions, Refund & Return Policy) and *Committees & Forums* (Founding Executive Committee, Executive Committee).
- **Facilities** panel — three columns: *CKCL Facilities* (Swimming Pool, Guest House, Coffee Shop, Convention Hall, Salon, Bar, Card Room), *Affiliated Clubs* (Dhaka Club), and a third column holding a single 240 × 180 image card with radius `lg` showing the swimming pool, captioned "Members-only, open daily".
- **Membership** panel — one column: Member List, Membership Process, Become a Member, Member Login.
- **Media** panel — one column: Notices, News & Events, Photo Gallery, Video Gallery.
- **Resources** panel — one column: Annual Reports, Club Dues.
- Contact and Home have no dropdown.

### Tablet 834

Floating bar, width = viewport − 80 px, height 64 px, radius `pill`. Logo left, hamburger right, **Become a Member** pill retained; Member Login moves into the drawer.

### Mobile 390

- Floating bar, width = viewport − 32 px, inset 12 px from top, height 60 px, radius `xl` (28). Logo left, hamburger right only.
- Tapping the hamburger opens a **full-height glass drawer** sliding from the right: fill `glass/fill-strong` over a blurred dim scrim (`ink/900` at 45%, blur 8). Radius 28 on the left corners.
- Drawer contains: a search field at top, accordion sections matching the desktop dropdown groups (chevron rotates 180° on expand), then a divider, then the two auth buttons stacked full-width — **Become a Member** solid red, **Member Login** ghost — then contact details and social icons in the footer of the drawer.
- Also design a **bottom sticky glass action bar** for mobile only, 64 px tall, `glass/fill-strong`, radius 20, inset 12 px from the bottom and sides, containing two 50/50 buttons: **Call Club** and **Become a Member**. Visible on all pages except forms.
