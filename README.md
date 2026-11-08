# Ridgeline Roofing — static site

Plain HTML/CSS/JS, no build step. Open `index.html` or serve the folder (`python -m http.server`).

## Replace before launch
- **Business name** "Ridgeline Roofing" and the logo mark (placeholder).
- **Phone** `(555) 014-2290` / `tel:+15550142290` (appears in header, hero, storm band, form, action bar).
- **Email** `hello@ridgeline.example`, hours, service area, licence number.
- **Reviews** are marked samples. Swap in real Google reviews and delete `.placeholder-note`.
- **Photos** are hotlinked from Unsplash. Download your own job photos into `assets/` and update the `src`s.
- **Form**: no backend is wired. Set `FORM_ENDPOINT` in `script.js` (e.g. a Formspree URL) or the success message shows without sending anything.

## Design
Dark: wet slate `#0e1012` ground, zinc grey `#98a0a6` secondary text, chalk `#e9e6e0` text, one hi-vis brass accent `#e2b13c`. Archivo (variable width) for everything, condensed for headings.
Signature: big edges are cut at a roof pitch (hero bottom, storm band, footer top, service photo).
Hero is a full-bleed photo with a postcode box that carries the postcode into the full form.
Services: sticky photo swaps as you hover or scroll the list. Materials: tabs re-roof a drawn house in each material.
Work photos scroll sideways with arrow buttons. `index.prev.html` is the previous layout, delete it when happy.
On phones a call / free-inspection bar stays pinned to the bottom of the screen.
