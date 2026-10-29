## E. PAGE 1 — DASHBOARD (`/member/loggedMem`)
 
Page title: **Dashboard**. Add a greeting line above it in Body L, `ink/500`: "Welcome back, Mr. Elite." Breadcrumb `Home / My account / Dashboard`.
 
**Row 1 — Notice strip.** A full-width alert component, radius `md`, `brand/red-50` fill with a `brand/red-600` 3 px left bar, an info glyph, and rewritten copy: *"Two new notices were posted this month. Open the notice board to read them."* with a **View notices** text link on the right and a dismiss ×. If there are no new notices, this row does not render — design the without-alert variant too.
 
**Row 2 — three cards in a 5 / 4 / 3 split.**
 
- **Card A — Dues (the most important object on the page).** Solid `surface/0`, radius `lg`, shadow `e2`, `brand/red-600` 2 px top edge. Eyebrow `OUTSTANDING DUES`. The amount in **Fraunces 600 at Display L size**, `ink/900`, with the Taka symbol ৳ set slightly smaller and raised — e.g. `৳ 3,000`. Below: "as of 01 Sep 2026" in Caption. A status chip: **Paid in full** green / **Payment due** amber with the due date / **Overdue** red with days overdue. Then a full-width solid red **Pay now** button, and a Caption link "View account statement →".
  Design **three variants** of this card: zero balance (green check glyph, the amount reads `৳ 0.00`, button becomes a disabled ghost **Nothing to pay**), amount due, and overdue.
- **Card B — Membership.** The Frosted Membership Card in its personal variant, credit-card proportioned: CKCL monogram embossed at 8% opacity, member name, membership number in mono, tier, "Member since 2013", and a `brass/500` hairline along the bottom edge. A **Download card (PDF)** ghost button beneath.
- **Card C — Quick actions.** A 2 × 2 grid of tile buttons, each a 20 px icon over a Label: **Pay dues**, **Download statement**, **Raise a request**, **Contact helpdesk**. Tiles are `surface/100`, radius `md`, hover to `brand/red-50` with the icon turning `brand/red-600`.
**Row 3 — Personal information summary + Club updates, 7 / 5 split.**
 
- **Left — Your details.** A card with a header row: Heading 3 "Your details" and an **Edit** ghost button. Then a definition list, two columns on desktop and one on mobile, with labels in Label style `ink/500` and values in Body M `ink/900`: Name, Membership no., Membership type, Contact no., Email, Address. Use the club's real field labels. Values are truncated with ellipsis beyond one line, with a tooltip on hover. Include a variant showing an incomplete field — the current record has an address stored as `390, , 8,` which renders as fragments — so design a "Not provided" state in `ink/300` italic with a small **Add** link, and note in an annotation that empty address segments must not render as stray commas.
- **Right — Club updates.** Replace the raw Facebook embed. A card with Heading 3 "Club updates" and a segmented control: **Notices** / **News**. Beneath, four compact rows — each a `brand/red-50` date block, a title (Bangla titles in Hind Siliguri), a PDF/JPG pill, and a chevron. Footer link "Open the notice board →". Annotate: *if the Facebook feed must be retained, it appears as a single collapsed card below this one, styled to match, with a fixed 320 px height and its own internal scroll — never as a raw unstyled embed.*
**Mobile order:** greeting → dues card → quick actions (horizontal scroll rail) → membership card → your details → club updates. Plus the bottom sticky glass bar with a single full-width **Pay ৳ 3,000** button when a balance exists.
 
---
 
## F. TABLE SYSTEM (used by Statement, Payment history, Invoices, Bank accounts)
 
Define this once as a component; every portal table uses it.
 
- Container: `surface/0`, radius `lg`, 1 px `line/200` border, shadow `e1`, overflow hidden.
- Card header bar: 64 px tall, Heading 3 title left, filters/actions right, 1 px `line/200` bottom border. **Not red.**
- Column header row: `surface/100` fill, Label style at 13 px, `ink/700`, uppercase off, letter-spacing normal, 48 px tall, sortable columns get a chevron pair that activates in `brand/red-600`.
- Body rows: 56 px tall, Body M, 1 px `line/200` dividers, hover fill `surface/50`.
- **Numeric columns are right-aligned and set in IBM Plex Mono** — amounts, balances, account numbers, routing numbers, invoice IDs. This is non-negotiable for a financial table; the current site left-aligns everything and the columns don't scan.
- Currency format: `৳ 3,000.00` with thousands separators and two decimals in tables (the current mix of `3000 Balance` and `3,000` and `0.00` is inconsistent — normalise it).
- Total row: `surface/100` fill, 600 weight, a 2 px `ink/900` top border, pinned to the bottom of the table.
- Status cells use chips: Paid (green), Pending (amber), Overdue (red), Cancelled (neutral) — each with a glyph.
- Action cells use icon buttons (view, download) with tooltips, 36 px, not text links.
- **Empty state** (replacing "No Data Found"): 48 px illustration or icon in a `surface/100` circle, a Heading 3 line, a Body M explanation, and an action button. Write real copy per table — e.g. for invoices: *"No invoices yet. Invoices appear here once the club office raises a charge on your account."*
- **Loading state:** 5 skeleton rows with shimmer.
- **Mobile:** tables do not scroll horizontally. Each row becomes a stacked card — primary value (amount or bank name) in Heading 3, secondary fields as label/value pairs, status chip top-right, actions as a footer row. Design both the desktop table and the mobile card list.
