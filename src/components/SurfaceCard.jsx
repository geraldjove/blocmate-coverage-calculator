import { useState } from 'react'
import { Trash2, ChevronDown, Plus, X } from 'lucide-react'
import { Card, NumberField, Segmented, ChoiceGroup } from './primitives'
import { surfaceLitres } from '../lib/calc'
import { netArea, openingsArea } from '../lib/geometry'
import { SHAPES, POROSITY, POROSITY_KEYS } from '../lib/config'

const SHAPE_OPTIONS = Object.entries(SHAPES).map(([value, s]) => ({ value, label: s.label }))
const COAT_OPTIONS = [1, 2, 3].map((n) => ({ value: n, label: String(n) }))
const POROSITY_OPTIONS = POROSITY_KEYS.map((value) => ({
  value,
  label: POROSITY[value].label,
  hint: POROSITY[value].hint,
}))

const r1 = (n) => (Math.round(n * 10) / 10).toFixed(1)

export default function SurfaceCard({ surface, index, canRemove, onChange, onRemove }) {
  const [open, setOpen] = useState(true)
  const set = (patch) => onChange({ ...surface, ...patch })
  const setDim = (key, val) => set({ dims: { ...surface.dims, [key]: val } })

  const area = netArea(surface)
  const liters = surfaceLitres(surface)
  const hasOpenings = openingsArea(surface) > 0

  return (
    <Card className="p-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-4">
        <input
          value={surface.name}
          onChange={(e) => set({ name: e.target.value })}
          className="min-w-0 flex-1 rounded-lg bg-transparent px-1 py-1 text-base font-bold text-neutral-900 outline-none hover:bg-neutral-50 focus:bg-neutral-50"
          aria-label="Surface name"
        />
        <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
          {r1(liters)} L
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-brand-50 hover:text-brand"
            aria-label="Remove surface"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Collapsed summary */}
      {!open && (
        <p className="px-5 pb-4 pt-1 text-sm text-neutral-400">
          {SHAPES[surface.shape].label} · {r1(area)} m² · {surface.coats} coat
          {surface.coats > 1 ? 's' : ''} · {POROSITY[surface.porosity].label}
        </p>
      )}

      {open && (
        <div className="space-y-4 px-5 pb-5 pt-3">
          {/* Shape */}
          <div>
            <p className="label-caps mb-2">Shape</p>
            <Segmented
              options={SHAPE_OPTIONS}
              value={surface.shape}
              onChange={(shape) => set({ shape })}
              size="sm"
            />
          </div>

          {/* Dimensions */}
          <DimensionFields surface={surface} setDim={setDim} />

          {/* Openings */}
          <OpeningsEditor
            openings={surface.openings}
            onChange={(openings) => set({ openings })}
          />

          {/* Coats + Porosity */}
          <div>
            <p className="label-caps mb-2">Coats</p>
            <Segmented
              options={COAT_OPTIONS}
              value={surface.coats}
              onChange={(coats) => set({ coats })}
              size="sm"
            />
          </div>
          <div>
            <p className="label-caps mb-2">Surface Porosity</p>
            <ChoiceGroup
              options={POROSITY_OPTIONS}
              value={surface.porosity}
              onChange={(porosity) => set({ porosity })}
            />
          </div>

          {/* Per-surface totals */}
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 text-sm">
            <span className="text-neutral-500">
              Net area{hasOpenings ? ' (after openings)' : ''}
            </span>
            <span className="font-bold text-neutral-900">{r1(area)} m²</span>
          </div>
        </div>
      )}
    </Card>
  )
}

function DimensionFields({ surface, setDim }) {
  const d = surface.dims
  if (surface.shape === 'circle') {
    return (
      <NumberField
        label="Diameter"
        unit="m"
        value={d.diameter}
        onChange={(v) => setDim('diameter', v)}
      />
    )
  }
  if (surface.shape === 'lshape') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Section A length" unit="m" value={d.lengthA} onChange={(v) => setDim('lengthA', v)} />
          <NumberField label="Section A width" unit="m" value={d.widthA} onChange={(v) => setDim('widthA', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Section B length" unit="m" value={d.lengthB} onChange={(v) => setDim('lengthB', v)} />
          <NumberField label="Section B width" unit="m" value={d.widthB} onChange={(v) => setDim('widthB', v)} />
        </div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      <NumberField label="Length" unit="m" value={d.length} onChange={(v) => setDim('length', v)} />
      <NumberField label="Width" unit="m" value={d.width} onChange={(v) => setDim('width', v)} />
    </div>
  )
}

function OpeningsEditor({ openings, onChange }) {
  const add = () => onChange([...openings, { length: 1, width: 1 }])
  const update = (i, patch) =>
    onChange(openings.map((o, idx) => (idx === i ? { ...o, ...patch } : o)))
  const remove = (i) => onChange(openings.filter((_, idx) => idx !== i))

  return (
    <div className="rounded-xl border border-dashed border-neutral-200 p-3">
      <div className="flex items-center justify-between">
        <p className="label-caps">Subtract Openings</p>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-brand hover:bg-brand-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {openings.length === 0 ? (
        <p className="mt-1 text-xs text-neutral-400">
          Optional — deduct doors, drains, garden beds, etc.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {openings.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <NumberField label="" unit="m" value={o.length} onChange={(v) => update(i, { length: v })} />
              <span className="pt-1 text-neutral-400">×</span>
              <NumberField label="" unit="m" value={o.width} onChange={(v) => update(i, { width: v })} />
              <button
                type="button"
                onClick={() => remove(i)}
                className="mt-0.5 rounded-lg p-1.5 text-neutral-400 hover:bg-brand-50 hover:text-brand"
                aria-label="Remove opening"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
