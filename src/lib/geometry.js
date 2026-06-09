// ---------------------------------------------------------------------------
// Surface geometry — turn human dimensions into a net area to seal.
// All dimensions are in metres.
// ---------------------------------------------------------------------------

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** Gross area of a surface, before deducting openings. */
export function grossArea(surface) {
  const d = surface.dims || {}
  switch (surface.shape) {
    case 'area':
      // Simplified mode — the user enters a total area directly.
      return num(d.area)
    case 'circle':
      return Math.PI * Math.pow(num(d.diameter) / 2, 2)
    case 'lshape':
      // Two rectangles (Section A + Section B) — covers L / T / stepped slabs.
      return num(d.lengthA) * num(d.widthA) + num(d.lengthB) * num(d.widthB)
    case 'rect':
    default:
      return num(d.length) * num(d.width)
  }
}

/** Total area of the rectangular openings to subtract (doors, beds, drains…). */
export function openingsArea(surface) {
  return (surface.openings || []).reduce(
    (sum, o) => sum + num(o.length) * num(o.width),
    0,
  )
}

/** Net area to seal = gross − openings (never below zero). */
export function netArea(surface) {
  return Math.max(0, grossArea(surface) - openingsArea(surface))
}

/** A blank surface with sensible defaults. */
export function newSurface(index = 0) {
  return {
    id: `s${index}-${Math.floor(performance.now())}`,
    name: `Surface ${index + 1}`,
    shape: 'rect',
    dims: { length: 5, width: 4, diameter: 4, lengthA: 4, widthA: 3, lengthB: 2, widthB: 2 },
    openings: [],
    coats: 1,
    porosity: 'medium',
  }
}

/** A single direct-area surface for the simplified calculator. */
export function newSimpleSurface() {
  return {
    id: 'simple',
    name: 'Project area',
    shape: 'area',
    dims: { area: 20 },
    openings: [],
    coats: 1,
    porosity: 'medium',
  }
}
