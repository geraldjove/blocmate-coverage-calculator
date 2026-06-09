import { useEffect, useRef, useState } from 'react'
import { LayoutGrid, Beaker } from 'lucide-react'
import AreaCalculator from './components/AreaCalculator'
import VolumeCalculator from './components/VolumeCalculator'
import { newSurface } from './lib/geometry'
import { readSharedState, writeSharedState } from './lib/share'
import { DEFAULT_PRICES, DEFAULT_CURRENCY } from './lib/config'

const TABS = [
  { key: 'area', label: 'By Area', icon: LayoutGrid },
  { key: 'volume', label: 'By Volume', icon: Beaker },
]

const PRICES_KEY = 'core100.prices'
const CURRENCY_KEY = 'core100.currency'
const DEFAULT_VOL = { containerIndex: 0, count: 1, coats: 1, porosity: 'medium' }

// Pull any shared project out of the URL once, before first render.
const shared = readSharedState()

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [mode, setMode] = useState(shared?.mode || 'area')
  const [surfaces, setSurfaces] = useState(
    shared?.surfaces?.length ? shared.surfaces : [newSurface(0)],
  )
  const [buffer, setBuffer] = useState(shared?.buffer ?? 0)
  const [prices, setPrices] = useState(
    shared?.prices || loadLocal(PRICES_KEY, DEFAULT_PRICES),
  )
  const [currency, setCurrency] = useState(
    shared?.currency || loadLocal(CURRENCY_KEY, DEFAULT_CURRENCY),
  )
  const [vol, setVol] = useState({ ...DEFAULT_VOL, ...(shared?.vol || {}) })

  // Keep the URL hash and local settings in sync with state.
  const first = useRef(true)
  useEffect(() => {
    writeSharedState({ mode, surfaces, buffer, prices, currency, vol })
    try {
      localStorage.setItem(PRICES_KEY, JSON.stringify(prices))
      localStorage.setItem(CURRENCY_KEY, JSON.stringify(currency))
    } catch {
      /* storage unavailable — non-fatal */
    }
    first.current = false
  }, [mode, surfaces, buffer, prices, currency, vol])

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-lg px-5 pb-10 pt-8">
        {/* Header */}
        <header className="mb-6 text-center">
          <Wordmark />
          <h1 className="mt-4 text-[30px] font-bold leading-none tracking-tight text-neutral-900">
            Coverage Calculator
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm font-light text-neutral-500">
            Estimate how much CORE100 penetrating sealer your project needs.
          </p>
        </header>

        {/* Mode switcher */}
        <div className="mb-5 flex rounded-2xl bg-white p-1 shadow-card print:hidden">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const active = mode === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-bold transition-all duration-200 ${
                  active
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Active calculator */}
        {mode === 'area' ? (
          <AreaCalculator
            surfaces={surfaces}
            setSurfaces={setSurfaces}
            buffer={buffer}
            setBuffer={setBuffer}
            prices={prices}
            setPrices={setPrices}
            currency={currency}
            setCurrency={setCurrency}
          />
        ) : (
          <VolumeCalculator vol={vol} setVol={setVol} />
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs font-light text-neutral-400">
          Blocmate CORE100 · Penetrating Concrete Sealer
        </footer>
      </div>
    </div>
  )
}

/** Brand wordmark — uses the official logo, falling back to styled type. */
function Wordmark() {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="inline-flex flex-col items-center">
        <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
          CORE<span className="text-brand">100</span>
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-neutral-400">
          Blocmate
        </span>
      </div>
    )
  }

  return (
    <img
      src="/core100-logo.png"
      alt="Blocmate CORE100"
      className="mx-auto h-auto w-full max-w-[280px] select-none"
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
