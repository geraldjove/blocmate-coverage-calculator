import { Minus, Plus } from 'lucide-react'

/** A white rounded surface used for every input/result block. */
export function Card({ className = '', children }) {
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-card ${className}`}>{children}</div>
  )
}

/** Compact labelled numeric field with an optional unit suffix. */
export function NumberField({ label, value, onChange, unit, min = 0, step = 0.1 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-neutral-500">{label}</span>
      <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 focus-within:border-brand focus-within:bg-white">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 text-lg font-semibold text-neutral-900 outline-none"
        />
        {unit && <span className="pl-1 text-sm text-neutral-400">{unit}</span>}
      </div>
    </label>
  )
}

/** Pill group where each option can carry a small hint line (shape, porosity). */
export function ChoiceGroup({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
              selected
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300'
            }`}
          >
            <span className="block text-sm font-bold leading-tight">{opt.label}</span>
            {opt.hint && (
              <span
                className={`mt-0.5 block text-[10px] leading-tight ${selected ? 'text-white/70' : 'text-neutral-400'}`}
              >
                {opt.hint}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Small uppercase caption above a control. */
export function SectionLabel({ children, className = '' }) {
  return <p className={`label-caps mb-3 text-center ${className}`}>{children}</p>
}

/** Segmented pill selector (Container Size / Coats). */
export function Segmented({ options, value, onChange, size = 'md' }) {
  const height = size === 'sm' ? 'h-11 text-sm' : 'h-14 text-base'
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 ${height} rounded-xl font-bold transition-all duration-200 ${
              selected
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** Big number with minus / plus steppers (Area, Number of Containers). */
export function Stepper({ value, onChange, onCommit, suffix, min = 1 }) {
  const step = (delta) => onChange((v) => Math.max(min, (parseInt(v) || min) + delta))
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => step(-1)}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-transform hover:bg-neutral-200 active:scale-95"
        aria-label="Decrease"
      >
        <Minus className="h-5 w-5" />
      </button>

      <div className="flex items-baseline gap-1">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            if (e.target.value === '' || parseInt(e.target.value) < min) {
              onChange(min)
              onCommit?.()
            }
          }}
          className="w-40 bg-transparent text-center text-6xl font-light text-neutral-900 outline-none"
        />
        {suffix && (
          <span className="text-lg font-medium text-neutral-400">{suffix}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => step(1)}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-transform hover:bg-neutral-200 active:scale-95"
        aria-label="Increase"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}

/** Brand-styled range slider for the buffer percentage. */
export function Slider({ value, onChange, min = 0, max = 20, step = 1 }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none
        [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:shadow-md
        [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110
        [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-neutral-900"
      style={{
        background: `linear-gradient(to right, #dc3947 0%, #dc3947 ${pct}%, #e5e5e5 ${pct}%, #e5e5e5 100%)`,
      }}
    />
  )
}

/** Standard estimation disclaimer shown under each calculator. */
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
