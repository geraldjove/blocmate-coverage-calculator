# Blocmate CORE100 — Coverage Calculator

A refreshed, upgraded rebuild of the Blocmate CORE100 coverage calculator. Estimates how
much CORE100 penetrating concrete sealer a project needs, either **by area** (how much
product to buy) or **by volume** (how much area a given amount of product covers).

Same brand identity as the original (brand red `#dc3947`, off-white canvas, Montserrat),
redesigned with a cleaner layout and a much deeper feature set.

- **Live:** https://blocmate-coverage-calculator.vercel.app
- **Source:** https://github.com/geraldjove/blocmate-coverage-calculator

## Features

- **Dimension input** — pick a shape (Rectangle / Circle / L-shape) and enter real
  measurements; area is computed for you. Deduct openings (doors, drains, garden beds).
- **Multi-surface projects** — add as many surfaces as the job has; each carries its own
  shape, coats and porosity, and they roll up into one combined buy list.
- **Surface porosity** — Smooth / Medium / Porous adjusts the coverage rate
  (6 / 5 / 4 m² per litre per coat) for a realistic estimate.
- **Cost estimation** — enter your own per-container prices (saved locally) to see total
  cost and cost per m², shown on every container option.
- **Smart SKU recommendation** — picks the container mix with the least leftover.
- **Share & print** — the whole project lives in the URL (copy a link), copy a text
  summary, or print / save a clean PDF quote.
- **Installable PWA** — works offline and installs to a phone home screen.
- **Buy CTA** — carries the recommended SKU + quantity through to the store.

## Tech stack

React 18 · Vite 5 · Tailwind CSS 3 · lucide-react · vite-plugin-pwa

## Getting started

```bash
npm install
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Regenerate the brand app icons (only needed if you change the icon design):

```bash
node scripts/gen-icons.mjs
```

## How the maths works

Constants live in [`src/lib/config.js`](src/lib/config.js):

- **Coverage rate:** 6 / 5 / 4 m² per litre per coat (smooth / medium / porous)
- **Container sizes (SKUs):** 1 L, 4.5 L, 22 L
- **Gallon conversion:** 1 US gallon = 3.78541 L

**By Area** — each surface contributes `area × coats ÷ coverageRate(porosity)` litres;
surfaces are summed and a global safety buffer is applied. The app then sizes every
container SKU and recommends the least-wasteful option.

**By Volume** — `coverage = (containerSize × count × coverageRate(porosity)) ÷ coats`.

## Project structure

```
src/
  App.jsx                    # header, mode switcher, state + URL-share/persist
  lib/
    config.js                # product facts, pricing, links — tweak here
    geometry.js              # shapes → net area
    calc.js                  # coverage, SKU recommendation, cost
    share.js                 # URL encode/decode + text summary
  components/
    primitives.jsx           # Card, Segmented, Stepper, Slider, NumberField, ChoiceGroup
    SurfaceCard.jsx          # one editable surface
    AreaCalculator.jsx       # "By Area" project
    VolumeCalculator.jsx     # "By Volume" mode
    CostSettings.jsx         # prices + currency
    ResultsPanel.jsx         # recommendation + options + cost
    BuyButton.jsx / ShareBar.jsx / PrintSummary.jsx
scripts/gen-icons.mjs        # generates /public app icons
```

## Notes

- The "Order CORE100" button points at `BUY_URL` in `src/lib/config.js` — update it to the
  real store URL (it appends `sku` + `qty` query params).
- The brand logo is served locally from `public/core100-logo.png`, with a styled wordmark
  fallback.
- `_reference/` holds the extracted original bundle, kept for reference and git-ignored.
