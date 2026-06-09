import { useMemo, useState } from 'react'
import { Package, Sparkles } from 'lucide-react'
import { calcByArea } from '../lib/calc'
import { Card, SectionLabel, Segmented, Stepper, Slider } from './primitives'

const COAT_OPTIONS = [1, 2, 3].map((n) => ({ value: n, label: String(n) }))

export default function AreaCalculator() {
  const [area, setArea] = useState(10)
  const [coats, setCoats] = useState(1)
  const [buffer, setBuffer] = useState(0)

  const result = useMemo(() => calcByArea(area, coats, buffer), [area, coats, buffer])
  const { litersNeeded, gallonsNeeded, skuEstimates, recommended } = result

  return (
    <div className="space-y-5">
      {/* Area */}
      <Card className="p-6">
        <SectionLabel className="mb-4">Area to Seal</SectionLabel>
        <Stepper value={area} onChange={setArea} suffix="m²" />
      </Card>

      {/* Coats + Buffer */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <SectionLabel>Coats</SectionLabel>
          <Segmented options={COAT_OPTIONS} value={coats} onChange={setCoats} size="sm" />
        </Card>
        <Card>
          <SectionLabel className="mb-2">Buffer</SectionLabel>
          <div className="mb-3 text-center text-2xl font-light text-neutral-900">
            {buffer}%
          </div>
          <Slider value={buffer} onChange={setBuffer} min={0} max={20} step={1} />
        </Card>
      </div>

      {/* Headline figure */}
      <Card className="p-6 text-center">
        <SectionLabel>You'll Need Approximately</SectionLabel>
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold tracking-tight text-neutral-900">
            {litersNeeded.toFixed(1)} L
          </span>
          <span className="mt-1 text-lg text-neutral-400">
            ({gallonsNeeded.toFixed(2)} gal)
          </span>
        </div>
      </Card>

      {/* Recommended SKU */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand p-6 shadow-brand">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="mb-5 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-white/80" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
              Recommended Purchase
            </span>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <ResultTile label="Container" value={recommended.label} />
            <ResultTile
              label="Quantity"
              value={recommended.units}
              unit={recommended.units === 1 ? 'unit' : 'units'}
            />
          </div>

          <div className="space-y-2 rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
            <SummaryRow
              label="Total product volume"
              value={`${recommended.totalLiters.toFixed(1)} L`}
            />
            <SummaryRow
              label="Estimated excess"
              value={`${recommended.leftover.toFixed(1)} L`}
            />
          </div>
        </div>
      </div>

      {/* All container options */}
      <Card>
        <SectionLabel className="mb-4">All Container Options</SectionLabel>
        <div className="space-y-3">
          {skuEstimates.map((sku) => {
            const isBest = sku.label === recommended.label
            return (
              <div
                key={sku.label}
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                  isBest
                    ? 'border-brand-200 bg-brand-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold ${
                      isBest
                        ? 'border-brand-200 bg-brand-100 text-brand-700'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {sku.label}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {sku.units} {sku.units === 1 ? 'unit' : 'units'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Total {sku.totalLiters.toFixed(1)} L
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs font-medium text-neutral-400">Leftover</p>
                    <p className="text-sm font-semibold text-neutral-700">
                      {sku.leftover.toFixed(1)} L
                    </p>
                  </div>
                  {isBest && (
                    <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Best
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Disclaimer />
    </div>
  )
}

function ResultTile({ label, value, unit }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="text-3xl font-extrabold text-white">{value}</span>
        {unit && <span className="text-sm font-medium text-white/80">{unit}</span>}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <p className="flex items-center justify-between text-sm text-white/90">
      <span className="font-light">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </p>
  )
}

export function Disclaimer() {
  return (
    <p className="px-2 text-sm font-light leading-relaxed text-neutral-500">
      Coverage rates are approximate and based on smooth, horizontal surfaces. Actual
      coverage will vary with the condition and absorbency of the concrete. These figures
      are for estimation purposes only. For optimal performance, up to three (3) coats may
      be applied.
    </p>
  )
}
