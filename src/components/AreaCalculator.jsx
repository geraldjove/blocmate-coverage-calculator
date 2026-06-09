import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Card, SectionLabel, Slider, Disclaimer } from './primitives'
import SurfaceCard from './SurfaceCard'
import CostSettings from './CostSettings'
import ResultsPanel from './ResultsPanel'
import BuyButton from './BuyButton'
import ShareBar from './ShareBar'
import PrintSummary from './PrintSummary'
import { calcProject } from '../lib/calc'
import { newSurface } from '../lib/geometry'
import { buildSummary } from '../lib/share'

export default function AreaCalculator({
  surfaces,
  setSurfaces,
  buffer,
  setBuffer,
  prices,
  setPrices,
  currency,
  setCurrency,
  getShareUrl,
}) {
  const result = useMemo(
    () => calcProject(surfaces, buffer, prices),
    [surfaces, buffer, prices],
  )
  const hasPrices = Object.values(prices).some((p) => parseFloat(p) > 0)

  const updateSurface = (id, next) =>
    setSurfaces((list) => list.map((s) => (s.id === id ? next : s)))
  const removeSurface = (id) => setSurfaces((list) => list.filter((s) => s.id !== id))
  const addSurface = () => setSurfaces((list) => [...list, newSurface(list.length)])

  return (
    <div className="space-y-5">
      {/* Surfaces */}
      <div className="space-y-4">
        {surfaces.map((surface, i) => (
          <SurfaceCard
            key={surface.id}
            surface={surface}
            index={i}
            canRemove={surfaces.length > 1}
            onChange={(next) => updateSurface(surface.id, next)}
            onRemove={() => removeSurface(surface.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addSurface}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 py-3.5 text-sm font-bold text-neutral-500 transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="h-5 w-5" /> Add another surface
      </button>

      {/* Global buffer */}
      <Card>
        <SectionLabel className="mb-2">Safety Buffer</SectionLabel>
        <div className="mb-3 text-center text-2xl font-light text-neutral-900">{buffer}%</div>
        <Slider value={buffer} onChange={setBuffer} min={0} max={20} step={1} />
        <p className="mt-3 text-center text-xs text-neutral-400">
          Extra allowance for waste, spills and uneven absorption.
        </p>
      </Card>

      {/* Pricing */}
      <CostSettings
        prices={prices}
        currency={currency}
        onPrices={setPrices}
        onCurrency={setCurrency}
        hasPrices={hasPrices}
      />

      {/* Results */}
      <ResultsPanel result={result} currency={currency} />

      {/* Actions */}
      <BuyButton recommended={result.recommended} />
      <ShareBar
        getShareUrl={getShareUrl}
        getSummary={() => buildSummary({ surfaces, buffer, result, currency })}
      />

      <Disclaimer />

      <PrintSummary surfaces={surfaces} buffer={buffer} result={result} currency={currency} />
    </div>
  )
}
