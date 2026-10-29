## J. PAGE 5 — BANK ACCOUNTS (currently "Bank List")
 
Page title **Bank accounts**, with a Body M subtitle: "Transfer dues to any of these club accounts, then upload your deposit slip through Change request."
 
This is currently a wide table with a logo column — it works poorly on mobile and the logos are inconsistent sizes. Redesign as a **card grid**: 2 across desktop, 2 tablet, 1 mobile.
 
Each card: `surface/0`, radius `lg`, 1 px `line/200`, padding 24.
- Bank logo top-left in a fixed 96 × 32 container with `object-fit: contain` so the wildly varying logo aspect ratios all sit on one baseline. Annotate this constraint — it's the main reason the current table looks untidy.
- Bank name in Heading 3, branch in Caption `ink/500`.
- A definition list: Account name, Account no., Routing no. — the two numbers in IBM Plex Mono, `ink/900`, with a **copy** icon button beside each that shows a "Copied" toast.
- The account name is the same on all five ("Chittagong Khulshi Club Limited") — set it once at the top of the grid as a note rather than repeating it in every card, or keep it small and `ink/500`.
Populate with the club's five accounts: Exim Bank Limited (Khulshi Branch), One Bank Limited (CDA Avenue Branch), BRAC Bank Limited (CDA Avenue Branch), Eastern Bank Limited (Jamal Khan), Prime Bank Limited (Jubilee Road Branch). **Use dummy digits for account and routing numbers in the design file** — do not put the club's live account numbers into a shared Figma file.
 
Below the grid, an info callout: *"Always include your membership number in the transfer reference."*
 
---
 
## K. PAGE 6 — PERSONAL INFORMATION (4-step form)
 
Page title **Personal information**. This is the largest form in the portal and currently the worst-designed screen.
 
**Progress indicator:** replace the bare blue `1 2 3 4` squares with a labelled horizontal stepper — 4 nodes joined by a 2 px rail, completed nodes solid `brand/red-600` with a check, current node outlined red with a red dot, upcoming nodes `line/200`. Each node has a Label beneath it. Step 1 is **Personal**; label steps 2–4 once the client confirms their content (see §N).
 
**Save controls:** one set only, in a sticky footer bar at the bottom of the form card — **Save as draft** (ghost) left, **Back** (secondary) and **Next** (solid red) right. Remove the duplicate top-right button. Final step's primary reads **Submit changes**. Add a Caption line: "Changes are reviewed by the club office before they take effect."
 
**Step 1 field layout** — three columns desktop, two tablet, one mobile, using the form components already defined:
 
Row 1: Given name · Surname · Father's name
Row 2: Mother's name · Marital status (radio: Single / Married) · Anniversary (date, shown only when Married is selected — annotate this conditional)
Row 3: Spouse name (conditional on Married) · Profession · Date of birth (date)
Row 4: Place · Cell no. · Tel.
Row 5: E-mail · Nationality · National ID no.
Row 6: Passport no. · Blood group (select) · Educational qualifications
Row 7: Institution name · e-TIN no.
 
**Locked fields.** Given name, Surname, Cell no. and E-mail are read-only on the live site (grey fill, not editable). Design a proper **locked field variant**: `surface/100` fill, `ink/700` text, a small lock glyph on the right, and helper text below reading *"Contact the club office to change this."* Right now they just look like a differently-coloured input, which reads as a bug.
 
**Sensitive fields.** National ID, passport and e-TIN are identity numbers. Set them in IBM Plex Mono, mask all but the last four characters by default with a show/hide eye toggle, and add helper text *"Visible only to you and the club office."*
 
Design every state: empty, filled, focused, error (with real messages — "Enter a valid 10, 13 or 17-digit NID number"), disabled, and the whole form's saved-toast ("Draft saved" with a check glyph).
 
---
 
## L. PAGE 7 — ONLINE HELPDESK
 
Page title **Online helpdesk**. The current page is three bare fields and a blue Save button, with no way to see past tickets.
 
Redesign as two parts:
 
**Left (7 cols) — My requests.** A list of ticket cards: ticket ID in mono, subject in Heading 3, topic chip, a two-line excerpt, submitted date, and a status chip (Open amber / Answered blue-neutral / Closed green). Clicking one opens a thread view — a modal on desktop, full page on mobile — showing the original message, club replies in `brand/red-50` bubbles, member messages in `surface/100` bubbles, and a reply composer at the bottom. Empty state: *"You haven't raised any requests. Use the form to get in touch with the club office."*
 
**Right (5 cols) — New request.** A sticky card: Topic (select, required, with a red asterisk and options such as Membership, Payments & dues, Facility booking, Guest house, Complaint, Other), Subject (text), Message (textarea, 6 rows, with a character counter), an attachment upload zone, and a solid red **Send request** button. Replace "Save" — the action is sending a message, not saving a record. Success state: a green toast plus the new ticket appearing at the top of the left list.
 
Above both, a small callout: *"For urgent matters call +880 1988 896 906, 10:00 AM – 6:00 PM."*
 
---
 
## M. PAGE 8 — CHANGE PASSWORD
 
Page title **Change password**. Keep it narrow — a single 560 px centred card, not a full-width one.
 
Fields stacked (the current side-by-side label/input at 60/40 wastes the width and looks unbalanced): Current password · New password · Confirm new password, each with a show/hide eye toggle.
 
Add what's missing: a **password strength meter** (a 4-segment bar going `warn/500` → `success/500`) and a live requirements checklist beneath the new-password field — at least 8 characters, one uppercase, one number, one symbol — each item switching from an `ink/300` dot to a `success/500` check as it's satisfied. Mismatch between the two new-password fields shows an inline error immediately, not on submit.
 
Buttons: **Cancel** ghost, **Update password** solid red. Success: a full-card confirmation state with a green check, "Password updated", and a Caption line "You'll stay signed in on this device."