import { surfaceLitres } from '../lib/calc'
import { netArea } from '../lib/geometry'
import { SHAPES, POROSITY } from '../lib/config'

const r1 = (n) => (Math.round(n * 10) / 10).toFixed(1)
const money = (currency, n) =>
  `${currency}${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`

function dims(s) {
  const d = s.dims || {}
  if (s.shape === 'area') return `${d.area} m²`
  if (s.shape === 'circle') return `⌀ ${d.diameter} m`
  if (s.shape === 'lshape') return `${d.lengthA}×${d.widthA} + ${d.lengthB}×${d.widthB} m`
  return `${d.length} × ${d.width} m`
}

/** Clean, paper-friendly estimate — only shown when printing. */
export default function PrintSummary({ surfaces, buffer, result, currency }) {
  return (
    <div className="hidden print:block">
      <h2 className="text-xl font-bold">Blocmate CORE100 — Coverage Estimate</h2>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-400 text-left">
            <th className="py-1 pr-2">Surface</th>
            <th className="py-1 pr-2">Shape / Size</th>
            <th className="py-1 pr-2">Area</th>
            <th className="py-1 pr-2">Coats</th>
            <th className="py-1 pr-2">Porosity</th>
            <th className="py-1 text-right">Litres</th>
          </tr>
        </thead>
        <tbody>
          {surfaces.map((s, i) => (
            <tr key={s.id} className="border-b border-neutral-200">
              <td className="py-1 pr-2">{s.name}</td>
              <td className="py-1 pr-2">
                {(SHAPES[s.shape]?.label ?? 'Area')} {dims(s)}
              </td>
              <td className="py-1 pr-2">{r1(netArea(s))} m²</td>
              <td className="py-1 pr-2">{s.coats}</td>
              <td className="py-1 pr-2">{POROSITY[s.porosity].label}</td>
              <td className="py-1 text-right">{r1(surfaceLitres(s))} L</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 space-y-1 text-sm">
        <p>
          <strong>Total area:</strong> {r1(result.totalArea)} m²
          {buffer > 0 ? `  ·  Buffer +${buffer}%` : ''}
        </p>
        <p>
          <strong>Product needed:</strong> {r1(result.litersNeeded)} L (
          {result.gallonsNeeded.toFixed(2)} gal)
        </p>
        <p>
          <strong>Recommended:</strong> {result.recommended.units} × {result.recommended.label} (
          {r1(result.recommended.totalLiters)} L total, {r1(result.recommended.leftover)} L spare)
        </p>
        {result.totalCost != null && (
          <p>
            <strong>Estimated cost:</strong> {money(currency, result.totalCost)}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        Estimates only — actual coverage varies with the condition and absorbency of the
        concrete.
      </p>
    </div>
  )
}
