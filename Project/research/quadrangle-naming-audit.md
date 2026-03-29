# Quadrangle Naming Accuracy Audit
**Author:** Dr. Elena Vasquez (Lunar Science Advisor)
**Date:** 2026-03-29
**Source:** USGS Geologic Atlas of the Moon — LAC Series

---

## Overview
Initial pass through all 44 quadrangle entries in `index.html`. Checking `alt`, `title`, and `href` values against the official USGS LAC quadrangle designations.

## Confirmed Errors

| # | Current (HTML) | Correct | Notes |
|---|---|---|---|
| 1 | `Julius Caeser` | `Julius Caesar` | Misspelled in both `alt` and `title` |
| 2 | `Mare Varprum` | `Mare Vaporum` | Misspelled — "Sea of Vapors" |
| 3 | `Mare Underum` | `Mare Undarum` | Misspelled — "Sea of Waves" |
| 4 | `Sinus Iiridium` | `Sinus Iridium` | Double-i in `title` attribute — "Bay of Rainbows" |

## Verified Correct
All other 40 quadrangle names match official USGS LAC designations.

## Notes on the LAC System
The Lunar Aeronautical Chart (LAC) system divides the near side of the Moon into 44 quadrangles. The USGS Geologic Atlas of the Moon produced 1:1,000,000-scale geologic maps for each. This site presents the color versions of those maps, which were produced for NASA primarily in the 1960s–1970s as part of the Apollo preparation effort.

The `lac_reference_from_LPI.pdf` in the repo appears to be the LPI (Lunar and Planetary Institute) reference index — useful as the authoritative cross-reference for quadrangle names and numbers.

## Recommended Fixes
All four naming errors should be corrected in `index.html` — both the display attributes (`alt`, `title`) and the `href` filenames where applicable. The JPG filenames in the repo should also be audited against these corrections.

---
*Research notes by Dr. Elena Vasquez — Lunar Science Advisor*
