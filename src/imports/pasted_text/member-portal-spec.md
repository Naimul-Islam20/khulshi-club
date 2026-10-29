## A. WHAT THIS AREA IS
 
Once a member logs in with their Membership No (format `FM0001`) they enter a self-service portal. It is not a marketing surface — it is a small financial and administrative tool. Members come here to do four things: **check what they owe, pay it, get a receipt or statement, and update their details.** Everything else is secondary.
 
Design accordingly: this section is **quieter than the public site**. Reduce glass usage to roughly 10–15% of surfaces here — glass belongs on the sidebar, the membership card, the sticky payment summary and modals only. Tables, forms and statements sit on solid `surface/0` with `line/200` rules, because financial data must be unambiguous and blur behind numbers is a legibility failure, not a style.
 
Retain the public site's floating cropped navbar at the top of every portal page, but add a logged-in variant (see §C).
 
---
 
## B. WHAT'S WRONG WITH THE CURRENT PORTAL (fix all of these)
 
The existing member area is a Bootstrap admin skin bolted onto the public template. Concretely:
 
1. **The page title on every single portal page says "Profile"** with a breadcrumb reading `Profile / data`. Every page — dashboard, statement, invoice, bank list, helpdesk, password — has the same title. The user never knows where they are. **Fix:** each page gets its own title and a true breadcrumb.
2. **A giant empty red band** sits between the content and the footer on every page, sometimes 200 px tall, containing nothing. **Fix:** delete it.
3. **The sidebar is a grey gradient list from 2012** with chevron bullets and no icons. **Fix:** redesign per §D.
4. **Tables render as solid red headers with white text** — heavy, dated, and the red-on-red with the page banner is oppressive. **Fix:** light table headers per §F.
5. **Empty tables just say "No Data Found"** centred in a lone row. **Fix:** proper empty states with an explanation and an action.
6. **Button colours are inconsistent** — "Pay Now" is blue, "Save" is blue, "Save as Draft" is cyan, "Next" and "Update" are red, "Get Report" is red. Three different accent colours in one product. **Fix:** one system — red primary, ink-outline secondary, ghost tertiary. Nothing is blue or cyan.
7. **The dashboard alert says `warning Please check your notice section regularly`** with a literal yellow "warning" label pasted in front of the sentence. **Fix:** a real alert component, and rewrite the copy.
8. **A raw Facebook page embed** occupies a third of the dashboard, complete with its own scrollbar and a video player. It is slow, off-brand and unstyled. **Fix:** replace with a native "Club updates" panel; if the club insists on the Facebook feed, confine it to a single styled card below the fold.
9. **The status chip just says "Active"** in a red box next to a Logout link. **Fix:** proper membership status component.
10. **No mobile design exists** for the portal at all. **Fix:** design all portal pages at 390 px.
11. **The Personal Information form is a 4-step wizard whose steps are numbered `1 2 3 4` as bare blue squares** with no labels, and "Save as Draft" appears twice on one screen (top-right and bottom-right). **Fix:** labelled progress steps, one save control.
12. **The footer payment-logo strip crams ~35 tiny bank and MFS logos into one unreadable row.** **Fix:** show 6 primary marks plus a "+29 more" affordance, or move the full list to the payment page where it's actually relevant.
---
 
## C. PORTAL SHELL (applies to every page in this section)
 
### Top navigation — logged-in variant
 
Same floating cropped glass navbar as the public site, with these changes to the right-hand action area:
- The **Become a Member** and **Member Login** buttons are replaced by: a notification bell icon button with a `brand/red-600` dot badge when unread; a message/inbox icon button; and an **avatar menu** — a 36 px circular member photo with a `brass/500` ring and a chevron.
- Avatar menu opens a glass dropdown panel (radius `xl`, `glass/fill-strong`) containing: the member's name in Heading 3, membership number in IBM Plex Mono, a membership-status chip, a divider, then links — My dashboard, Personal information, Account statement, Change password — a divider, then **Log out** in `brand/red-700`.
- On mobile the avatar sits in the floating bar and the portal navigation lives in the drawer.
### Page header (replaces the current red banner)
 
- Height 180 px desktop / 150 tablet / 120 mobile. Background `surface/100` with two soft blurred radial glows (`brand/red-500` 10%, `brass/500` 8%) — the same treatment as public inner pages, but shorter.
- Breadcrumb in Eyebrow style with real values: `Home / My account / Account statement`.
- Page title in Heading 1 — **the true page name**, never "Profile".
- Optional right-aligned page action (e.g. **Download PDF** on the statement page).
- No red fill. No decorative circles.
### Two-column layout
 
- Desktop: sidebar 280 px fixed left, content column fluid right, 32 px gap, both starting below the page header. Sidebar is sticky at 120 px offset.
- Tablet: sidebar collapses to 72 px icon-only rail with tooltips on hover.
- Mobile: sidebar becomes a horizontally scrollable chip row pinned under the page header, plus the full menu in the drawer.
### Footer
 
Same global footer as the public site, but **remove the empty red band above it entirely** and collapse the payment-logo strip to 6 marks + "+29 more".
 
---
 
## D. SIDEBAR NAVIGATION
 
A single glass card (`glass/fill-medium`, radius `lg`, padding 8) sitting over a subtle backdrop, containing two stacked blocks.
 
**Block 1 — member identity card.** Reuse the **Frosted Membership Card** component in a new compact vertical variant, 264 × 220:
- Member photo, 88 px square with radius `md` and a `brass/500` 1 px frame (the current site uses an odd portrait crop — constrain to a square with a face-safe crop area).
- Name in Heading 3, `ink/900`.
- Membership number in IBM Plex Mono, `ink/500` — e.g. `FM0001`.
- A tier chip: **Founding Member** uses a `brass/500` outline chip; **Life Member** uses `brand/red-50` fill with `brand/red-700` text; **General Member** uses a neutral `surface/100` chip.
- A status chip: **Active** in green, **Suspended** in amber, **Expired** in red — each with a small dot glyph, never colour alone.
**Block 2 — nav list.** Rows 44 px tall, radius `md`, Label type, `ink/700`, each with a 20 px icon. Hover: `brand/red-50` fill. Active: `surface/0` fill, `ink/900` 600 weight, a 3 px `brand/red-600` left bar inset 4 px, and shadow `e1`.
 
Items, in this exact order (matching the live portal):
 
1. **Dashboard** — home icon
2. **Personal information** — user icon
3. **Payments** — wallet icon, expandable, chevron rotates 180° when open, children indented 16 px with a 1 px `line/200` left guide rail:
   - Account statement
   - Payment history
   - Invoices
4. **Bank list** — bank icon
5. **Change request** — edit icon
6. **Online helpdesk** — headset icon
7. **Change password** — lock icon
8. **Log out** — separated above by a 1 px `line/200` divider and 8 px gap; text in `brand/red-700`; opens a confirmation modal ("Log out of your account?" with **Cancel** and **Log out").
Rename in the UI: "Online Helpdesk" → **Online helpdesk**, "Invoice" → **Invoices** (it's a list), "Bank List" → **Bank accounts** (clearer — these are the club's accounts you pay into, not a list of banks). Use sentence case throughout the portal.