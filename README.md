# Luna — Geologic Atlas of the Moon

Interactive near-side lunar map: the **44 quadrangles of the USGS Geologic Atlas
of the Moon** (1:1,000,000, Apollo era), drawn over a photographic full Moon.
Hover a quadrangle to identify it; click to open its geological map.

Live at **luna.thgnetworks.com** (GitHub Pages, `thg4web/luna`).

## How the grid is placed

- Base image: `images/moon-base.jpg` — a NASA full-Moon image (730×730, 2026-01-03);
  disc measured at centre (365.5, 364.5) px, radius 346 px.
- Each quadrangle is stored as its **lat/lon limits** (`data/quads-ortho.json`),
  derived from *The Lunar Cartographic Dossier* (Defense Mapping Agency,
  NASA-CR 1464000, 1973), LAC 1:1,000,000 sheet scheme — the dossier is in `docs/`.
- Those limits are **orthographically projected** in the browser onto the disc:
  sub-earth 0.1° N, 7.6° E; position angle −0.3°; plus a small screen-space grid
  nudge. All of it lives in `DEFAULTS` at the top of `js/moon-map.js` — retune
  there if the base image changes.

## Display panel

| Control | Default |
|---|---|
| Labels | on |
| Fills | off |
| Dim base image | off |
| Measured disc ring | off |
| Grid opacity | 0.70 |

## Layout

```
index.html            the page
css/style.css          space theme + display panel
js/moon-map.js          starfield · projection · overlay · panel · modal
data/quads-ortho.json   44 quads: name, geological-map href, LAC number, lat/lon box
images/moon-base.jpg     NASA full-Moon base, 730×730
images/quads/*.jpg        the 44 USGS geological maps (~1 GB)
docs/*.pdf               the LAC dossier (grid provenance)
CNAME                    luna.thgnetworks.com
```

## Run locally

```
python3 -m http.server 8030
# http://127.0.0.1:8030/
```

Serve over http — the page `fetch`es `data/quads-ortho.json` and won't work from `file://`.
