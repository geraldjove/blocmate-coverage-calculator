import { useMemo } from 'react'
import { Card, SectionLabel, Segmented, ChoiceGroup, Disclaimer } from './primitives'
import ResultsPanel from './ResultsPanel'
import BuyButton from './BuyButton'
import ShareBar from './ShareBar'
import PrintSummary from './PrintSummary'
import { calcProject } from '../lib/calc'
import { buildSummary } from '../lib/share'
import { POROSITY, POROSITY_KEYS } from '../lib/config'

const COAT_OPTIONS = [1, 2, 3].map((n) => ({ value: n, label: String(n) }))
const POROSITY_OPTIONS = POROSITY_KEYS.map((value) => ({
  value,
  label: POROSITY[value].label,
  hint: POROSITY[value].hint,
}))

/**
 * Streamlined area calculator — one total-area input plus coats and porosity.
 * Mirrors the classic single-field calculator while reusing the shared
 * results / cost / share / print pipeline via a single `area` surface.
 */
export default function SimpleAreaCalculator({ surface, setSurface, prices, currency }) {
  const surfaces = useMemo(() => [surface], [surface])
  const result = useMemo(() => calcProject(surfaces, 0, prices), [surfaces, prices])

  const set = (patch) => setSurface({ ...surface, ...patch })
  const setArea = (area) => setSurface({ ...surface, dims: { ...surface.dims, area } })

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <SectionLabel className="mb-4">Total Area To Seal</SectionLabel>
        <div className="flex items-baseline justify-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={surface.dims.area}
            onChange={(e) => setArea(e.target.value)}
            className="w-44 bg-transparent text-center text-6xl font-light text-neutral-900 outline-none"
            aria-label="Total area in square metres"
          />
          <span className="text-lg font-medium text-neutral-400">m²</span>
        </div>

        <div className="mt-6">
          <p className="label-caps mb-2">Coats</p>
          <Segmented
            options={COAT_OPTIONS}
            value={surface.coats}
            onChange={(coats) => set({ coats })}
            size="sm"
          />
        </div>

        <div className="mt-4">
          <p className="label-caps mb-2">Surface Porosity</p>
          <ChoiceGroup
            options={POROSITY_OPTIONS}
            value={surface.porosity}
            onChange={(porosity) => set({ porosity })}
          />
        </div>
      </Card>

      {/* Results */}
      <ResultsPanel result={result} currency={currency} />

      {/* Actions */}
      <BuyButton recommended={result.recommended} />
      <ShareBar
        getSummary={() => buildSummary({ surfaces, buffer: 0, result, currency })}
      />

      <Disclaimer />

      <PrintSummary surfaces={surfaces} buffer={0} result={result} currency={currency} />
    </div>
  )
}
