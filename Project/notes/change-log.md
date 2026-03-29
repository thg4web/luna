# Luna Project — Change Log

Running log of all significant decisions, milestones, and changes.

---

## 2026-03-29

### Project Initialized
- Project folder structure created under `/Project/`
- `CLAUDE.md` written with team definitions and working norms
- Team assembled: Richard, Rebecca, Lila, Terry, Sherlock, Dr. Elena Vasquez, Pam
- Initial site audit queued as first order of business

### Team Decisions
- Dr. Elena Vasquez hired as Lunar Science Advisor — project requires a dedicated science voice given the specialized USGS content
- Terry carried over from OTW project as Lila's assistant
- Sherlock carried over from OTW project as security expert

---

## 2026-03-29 — First Work Session

### Team Additions
- **Tom** hired as Data Analyst — role documented in `Project/roles/tom-data-analyst.md`

### Protocol Adopted
- **Agent Truth & Uncertainty Protocol** read and acknowledged by all team members (`Project/notes/agent-truth-uncertainty-protocol.md`)

### Design Direction Confirmed
- "Spacey, beautiful, easy to use" — dark space palette, Moon as hero, glowing quadrant highlights on hover, modal detail view
- Font: Space Grotesk (Google Fonts)

### Files Created / Modified
| File | Action | Owner |
|------|--------|-------|
| `index.html` | Full rewrite — HTML5 structure, 4 naming errors corrected, security fixes, modal wiring | Lila + Sherlock |
| `style.css` | New — space theme CSS | Lila + Terry |
| `moon-map.js` | New — starfield, hover glow overlay, responsive map coords, modal | Terry |
| `Project/assets/quadrangles.json` | New — structured data for all 44 quadrangles (LAC numbers/descriptions pending Dr. Vasquez) | Tom + Dr. Vasquez |
| `Project/roles/tom-data-analyst.md` | New — Tom's role document | Rebecca |

### Naming Errors Corrected (Dr. Vasquez audit)
| Was | Now |
|-----|-----|
| Julius Caeser | Julius Caesar |
| Mare Varprum | Mare Vaporum |
| Mare Underum | Mare Undarum |
| Sinus Iiridium | Sinus Iridium |

### Security Fixes Applied (Sherlock)
- All `target="_blank"` links now carry `rel="noopener noreferrer"`

### Open Items
- LAC numbers for all 44 quadrangles — Dr. Vasquez to verify against `lac_reference_from_LPI.pdf`
- Scientific descriptions for all 44 quadrangles — Dr. Vasquez + Tom
- `rupes_Altai_quad_color.jpg` filename has capital A — may cause issues on case-sensitive servers; flagged for Sherlock/Lila review

---
*Maintained by Pam — Project Admin*
