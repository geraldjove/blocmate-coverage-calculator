# Blocmate CORE100 Coverage Calculator

A standalone calculator that estimates how much **Blocmate CORE100 Penetrating Concrete Sealer** a project needs, by area or by volume.

It started as a [Base44](https://base44.com) app and has been stripped down to a plain **React + Vite + Tailwind** single‑page app with no backend — it builds to static files and can be hosted anywhere.

## Features

- **By Area** — enter area (m²), number of coats (1–3) and an optional buffer (0–20%); get the litres/gallons required, a recommended container, and a full breakdown of all container options.
- **By Volume** — pick a container size and quantity to see the total volume and the area it covers.
- Coverage is calculated at **6 m² per litre per coat** (smooth, horizontal surfaces).

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deployment

This is a static Vite SPA. On **Vercel**, the framework preset is auto‑detected:

- Build command: `npm run build`
- Output directory: `dist`

No environment variables are required.

## Tech

React 18 · Vite · Tailwind CSS · Radix UI · lucide-react
