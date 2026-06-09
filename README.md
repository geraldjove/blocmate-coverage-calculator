# Blocmate CORE100 — Coverage Calculator

A refreshed rebuild of the Blocmate CORE100 coverage calculator. Estimates how much
CORE100 penetrating concrete sealer a project needs, either **by area** (how much
product to buy) or **by volume** (how much area a given amount of product covers).

Same brand identity as the original (brand red `#dc3947`, off-white canvas, Montserrat),
redesigned with a cleaner layout, clearer hierarchy, and a more polished result card.

## Tech stack

- React 18 + Vite 5
- Tailwind CSS 3
- lucide-react icons

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## How the maths works

All figures come from a single set of constants in [`src/lib/calc.js`](src/lib/calc.js),
preserved from the original app:

- **Coverage rate:** 6 m² per litre, per coat
- **Container sizes (SKUs):** 1 L, 4.5 L, 22 L
- **Gallon conversion:** 1 US gallon = 3.78541 L

**By Area** — `litres = (area × coats / 6) × (1 + buffer%)`. The app then sizes each
container, picks the option with the least leftover (ignoring impractical quantities of
small tins), and lists every option for comparison.

**By Volume** — `coverage = (containerSize × count × 6) / coats`.

## Project structure

```
src/
  App.jsx                      # header, brand wordmark, mode switcher
  lib/calc.js                  # all calculation logic + constants
  components/
    primitives.jsx             # Card, Segmented, Stepper, Slider
    AreaCalculator.jsx         # "By Area" mode
    VolumeCalculator.jsx       # "By Volume" mode
  index.css                    # Tailwind layers + base styles
```

## Notes

- The brand logo loads from the original source (`craftbar.ph/CORE100-01.png`) and
  gracefully falls back to a styled `CORE100 / Blocmate` wordmark if unavailable.
- The original's "Close Window" button (it was built to open as a popup) was dropped in
  favour of a standalone-friendly footer.
- `_reference/` contains the extracted original bundle, kept for reference and ignored by
  git. Safe to delete.
