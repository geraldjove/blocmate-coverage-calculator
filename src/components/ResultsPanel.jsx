import { Sparkles } from 'lucide-react'
import { Card, SectionLabel } from './primitives'

const r1 = (n) => (Math.round(n * 10) / 10).toFixed(1)
const money = (currency, n) =>
  `${currency}${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`

export default function ResultsPanel({ result, currency }) {
  const { recommended, skuEstimates, litersNeeded, gallonsNeeded, totalArea, totalCost, costPerSqm } =
    result

  return (
    <div className="space-y-5">
      {/* Headline figure */}
      <Card className="p-6 text-center">
        <SectionLabel>You'll Need Approximately</SectionLabel>
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold tracking-tight text-neutral-900">
            {r1(litersNeeded)} L
          </span>
          <span className="mt-1 text-lg text-neutral-400">
            ({gallonsNeeded.toFixed(2)} gal) · {r1(totalArea)} m²
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
            <Tile label="Container" value={recommended.label} />
            <Tile
              label="Quantity"
              value={recommended.units}
              unit={recommended.units === 1 ? 'unit' : 'units'}
            />
          </div>

          <div className="space-y-2 rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
            <Row label="Total product volume" value={`${r1(recommended.totalLiters)} L`} />
            <Row label="Estimated excess" value={`${r1(recommended.leftover)} L`} />
            {totalCost != null && (
              <>
                <div className="my-1 h-px bg-white/20" />
                <Row label="Estimated cost" value={money(currency, totalCost)} strong />
                {costPerSqm != null && (
                  <Row label="Cost per m²" value={money(currency, costPerSqm)} />
                )}
              </>
            )}
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
                      Total {r1(sku.totalLiters)} L · {r1(sku.leftover)} L spare
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    {sku.cost != null ? (
                      <>
                        <p className="text-sm font-bold text-neutral-800">
                          {money(currency, sku.cost)}
                        </p>
                        {isBest && (
                          <p className="text-[10px] font-bold uppercase tracking-wide text-brand">
                            Best value
                          </p>
                        )}
                      </>
                    ) : (
                      isBest && (
                        <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          Best
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function Tile({ label, value, unit }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">{label}</p>
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="text-3xl font-extrabold text-white">{value}</span>
        {unit && <span className="text-sm font-medium text-white/80">{unit}</span>}
      </div>
    </div>
  )
}

function Row({ label, value, strong }) {
  return (
    <p className="flex items-center justify-between text-sm text-white/90">
      <span className="font-light">{label}</span>
      <span className={`text-white ${strong ? 'text-base font-extrabold' : 'font-bold'}`}>
        {value}
      </span>
    </p>
  )
}
