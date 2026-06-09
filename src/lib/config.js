// ---------------------------------------------------------------------------
// App-wide configuration. Tweak product facts, pricing defaults and links here.
// ---------------------------------------------------------------------------

/** Litres in one US gallon (for the gallon read-out). */
export const LITRES_PER_GALLON = 3.78541

/** Available product container sizes (SKUs). */
export const CONTAINERS = [
  { label: '1L', liters: 1 },
  { label: '4.5L', liters: 4.5 },
  { label: '22L', liters: 22 },
]

/**
 * Effective coverage (m² per litre, per coat) by surface porosity.
 * Smooth/sealed concrete drinks less; rough/porous concrete drinks more.
 */
export const POROSITY = {
  smooth: { label: 'Smooth', hint: 'Sealed / dense', rate: 6 },
  medium: { label: 'Medium', hint: 'Typical', rate: 5 },
  porous: { label: 'Porous', hint: 'Rough / old', rate: 4 },
}

export const POROSITY_KEYS = ['smooth', 'medium', 'porous']

/** Surface shapes the area calculator understands. */
export const SHAPES = {
  rect: { label: 'Rectangle' },
  circle: { label: 'Circle' },
  lshape: { label: 'L-Shape' },
}

/** Currencies offered in the cost estimator. */
export const CURRENCIES = ['₱', '$', '€', '£', 'A$']

/** Default (placeholder) per-container prices — users edit these to their own. */
export const DEFAULT_PRICES = { '1L': '', '4.5L': '', '22L': '' }
export const DEFAULT_CURRENCY = '₱'

/** Where the "Order CORE100" button sends people. Update to the real store URL. */
export const BUY_URL = 'https://craftbar.ph/'
