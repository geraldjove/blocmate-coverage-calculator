import { useMemo } from 'react'
import { Ruler } from 'lucide-react'
import { calcByVolume } from '../lib/calc'
import { CONTAINERS, POROSITY, POROSITY_KEYS } from '../lib/config'
import { Card, SectionLabel, Segmented, Stepper, ChoiceGroup, Disclaimer } from './primitives'
import BuyButton from './BuyButton'

const CONTAINER_OPTIONS = CONTAINERS.map((c, i) => ({ value: i, label: c.label }))
const COAT_OPTIONS = [1, 2, 3].map((n) => ({ value: n, label: String(n) }))
const POROSITY_OPTIONS = POROSITY_KEYS.map((value) => ({
  value,
  label: POROSITY[value].label,
  hint: POROSITY[value].hint,
}))

export default function VolumeCalculator({ vol, setVol }) {
  const { containerIndex, count, coats, porosity } = vol
  const set = (patch) => setVol((v) => ({ ...v, ...patch }))

  const result = useMemo(
    () => calcByVolume(containerIndex, count, coats, porosity),
    [containerIndex, count, coats, porosity],
  )
  const { totalLiters, gallonsTotal, coverage } = result
  const rate = POROSITY[porosity].rate

  return (
    <div className="space-y-5">
      <Card>
        <SectionLabel>Container Size</SectionLabel>
        <Segmented
          options={CONTAINER_OPTIONS}
          value={containerIndex}
          onChange={(containerIndex) => set({ containerIndex })}
        />
      </Card>

      <Card>
        <SectionLabel>Number of Containers</SectionLabel>
        <Stepper value={count} onChange={(fn) => set({ count: typeof fn === 'function' ? fn(count) : fn })} />
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Card>
          <SectionLabel>Coats</SectionLabel>
          <Segmented options={COAT_OPTIONS} value={coats} onChange={(coats) => set({ coats })} size="sm" />
        </Card>
        <Card>
          <SectionLabel>Surface Porosity</SectionLabel>
          <ChoiceGroup
            options={POROSITY_OPTIONS}
            value={porosity}
            onChange={(porosity) => set({ porosity })}
          />
        </Card>
      </div>

      {/* Results */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand p-6 shadow-brand">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="mb-5 flex items-center justify-center gap-2">
            <Ruler className="h-4 w-4 text-white/80" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
              Results
            </span>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                Total Volume
              </p>
              <div className="text-3xl font-extrabold text-white">{totalLiters} L</div>
              <div className="mt-1 text-xs text-white/70">({gallonsTotal.toFixed(2)} gal)</div>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                Approx Coverage
              </p>
              <div className="text-4xl font-extrabold text-white">{coverage.toFixed(1)}</div>
              <div className="mt-1 text-xs text-white/70">m²</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/15 p-4 text-center text-sm font-light text-white/90 backdrop-blur-sm">
            Based on {coats} coat{coats > 1 ? 's' : ''} at {rate} m² per litre per coat
            ({POROSITY[porosity].label.toLowerCase()} surface).
          </div>
        </div>
      </div>

      <BuyButton recommended={{ label: CONTAINERS[containerIndex].label, units: parseInt(count) || 1 }} />

      <Disclaimer />
    </div>
  )
}
