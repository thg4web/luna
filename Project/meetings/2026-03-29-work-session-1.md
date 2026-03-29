# Meeting Minutes — Work Session 1
**Date:** 2026-03-29
**Chaired by:** Richard (Project Manager)
**Recorded by:** Pam (Project Admin)
**Attendees:** Richard, Rebecca, Lila, Terry, Sherlock, Dr. Elena Vasquez, Tom, Pam

---

## Agenda

1. Onboard Tom as Data Analyst
2. Adopt Agent Truth & Uncertainty Protocol
3. Begin first sprint — site redesign and data foundation

---

## Protocol Adoption

Richard directed all team members to read `Project/notes/agent-truth-uncertainty-protocol.md`.
All members acknowledged and committed. Protocol is now active as a standing directive.

---

## Design Brief (Richard)

Direction: *"cool and spacey, easy to use, beautiful."*

Interpreted by Lila as:
- Dark space palette, Moon as hero
- Space Grotesk typography
- Glowing polygon highlight on quadrant hover (canvas overlay)
- Modal detail viewer replacing raw JPG navigation
- Responsive — image map coords rescale to any viewport

---

## Work Completed This Session

### HTML (Lila + Sherlock)
- Full rewrite of `index.html` to valid HTML5
- Fixed malformed document structure (`<center>` tags, `<body>` in wrong position, `<style>` outside `<head>`)
- Corrected all 4 naming errors identified by Dr. Vasquez
- Added `rel="noopener noreferrer"` to all `target="_blank"` links
- Added `data-name` attributes to all `<area>` elements
- Wired up external `style.css` and `moon-map.js`

### CSS (Lila + Terry)
- Created `style.css` from scratch — space theme
- CSS custom properties for full palette consistency
- Responsive layout, modal styles, accessibility focus states

### JavaScript (Terry)
- Created `moon-map.js` with four modules:
  1. Animated starfield (canvas, twinkling)
  2. Responsive image map (coords rescale on resize)
  3. Hover glow overlay (canvas polygon highlight)
  4. Modal (focus trap, keyboard nav, Escape to close)

### Data (Tom + Dr. Vasquez)
- Created `Project/assets/quadrangles.json` — skeleton for all 44 quadrangles
- LAC numbers and scientific descriptions marked as UNCERTAIN — AWAITING APPROVAL
- 4 naming corrections noted in data file
- 1 filename anomaly flagged: `rupes_Altai_quad_color.jpg` (capital A)

### HR (Rebecca)
- Tom onboarded; role document filed at `Project/roles/tom-data-analyst.md`

---

## Open Action Items

| # | Owner | Item |
|---|-------|------|
| 1 | Dr. Vasquez | Verify LAC numbers for all 44 quadrangles against `lac_reference_from_LPI.pdf` |
| 2 | Dr. Vasquez + Tom | Write scientific descriptions for all 44 quadrangles |
| 3 | Sherlock | Review `rupes_Altai_quad_color.jpg` filename case issue |
| 4 | Lila | Test site in browser — confirm image map, hover, modal all work |
| 5 | Terry | Cross-browser and mobile testing |

---

*Minutes recorded by Pam — Project Admin*
