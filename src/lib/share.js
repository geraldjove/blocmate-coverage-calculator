// ---------------------------------------------------------------------------
// Shareable state — encode the whole project into the URL, and build a plain
// text summary for copying / pasting into a quote.
// ---------------------------------------------------------------------------
import { netArea, grossArea } from './geometry'
import { surfaceLitres } from './calc'
import { POROSITY, SHAPES } from './config'

/** Encode a JS object to a URL-safe base64 string (handles unicode). */
export function encodeState(state) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(state))))
  } catch {
    return ''
  }
}

/** Decode a URL-safe base64 string back to an object, or null on failure. */
export function decodeState(str) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(str))))
  } catch {
    return null
  }
}

/** Read the shared project from the current URL hash (#p=…), if present. */
export function readSharedState() {
  if (typeof window === 'undefined') return null
  const m = window.location.hash.match(/p=([^&]+)/)
  return m ? decodeState(m[1]) : null
}

/** Write the project into the URL hash without adding a history entry. */
export function writeSharedState(state) {
  if (typeof window === 'undefined') return
  const hash = `#p=${encodeState(state)}`
  window.history.replaceState(null, '', hash)
}

const r1 = (n) => (Math.round(n * 10) / 10).toFixed(1)

/** Human-readable dimension string for a surface. */
function dimsText(s) {
  const d = s.dims || {}
  if (s.shape === 'area') return `${d.area} m²`
  if (s.shape === 'circle') return `⌀ ${d.diameter} m`
  if (s.shape === 'lshape')
    return `${d.lengthA}×${d.widthA} m + ${d.lengthB}×${d.widthB} m`
  return `${d.length} × ${d.width} m`
}

/**
 * Build a plain-text project summary suitable for copying into a message,
 * email or quote.
 */
export function buildSummary({ surfaces, buffer, result, currency }) {
  const lines = []
  lines.push('Blocmate CORE100 — Coverage Estimate')
  lines.push('===================================')
  surfaces.forEach((s, i) => {
    lines.push(
      `${i + 1}. ${s.name} — ${(SHAPES[s.shape]?.label ?? 'Area')} ${dimsText(s)}` +
        (grossArea(s) !== netArea(s) ? ` (less openings)` : ''),
    )
    lines.push(
      `   Area ${r1(netArea(s))} m² · ${s.coats} coat(s) · ${POROSITY[s.porosity].label} · ${r1(surfaceLitres(s))} L`,
    )
  })
  lines.push('-----------------------------------')
  lines.push(`Total area:    ${r1(result.totalArea)} m²`)
  if (buffer > 0) lines.push(`Buffer:        +${buffer}%`)
  lines.push(`Product needed: ${r1(result.litersNeeded)} L (${result.gallonsNeeded.toFixed(2)} gal)`)
  lines.push(
    `Recommended:   ${result.recommended.units} × ${result.recommended.label}` +
      ` (${r1(result.recommended.totalLiters)} L, ${r1(result.recommended.leftover)} L spare)`,
  )
  if (result.totalCost != null) {
    lines.push(`Estimated cost: ${currency}${result.totalCost.toLocaleString()}`)
  }
  lines.push('')
  lines.push('Estimates only — coverage varies with surface condition.')
  return lines.join('\n')
}
