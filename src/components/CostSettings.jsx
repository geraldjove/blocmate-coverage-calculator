import { useState } from 'react'
import { ChevronDown, Wallet } from 'lucide-react'
import { Card } from './primitives'
import { CONTAINERS, CURRENCIES } from '../lib/config'

/** Editable per-container prices + currency. Collapsed by default. */
export default function CostSettings({ prices, currency, onPrices, onCurrency, hasPrices }) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <Wallet className="h-5 w-5 text-neutral-400" />
        <span className="flex-1 text-sm font-bold text-neutral-700">
          Pricing
          <span className="ml-2 font-normal text-neutral-400">
            {hasPrices ? 'set' : 'optional — add to estimate cost'}
          </span>
        </span>
        <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="space-y-4 px-5 pb-5">
          <div>
            <p className="label-caps mb-2">Currency</p>
            <div className="flex flex-wrap gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCurrency(c)}
                  className={`h-9 min-w-[44px] rounded-lg px-3 text-sm font-bold transition-all ${
                    currency === c
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label-caps mb-2">Price per container</p>
            <div className="space-y-2">
              {CONTAINERS.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-bold text-neutral-600">{c.label}</span>
                  <div className="flex flex-1 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 focus-within:border-brand focus-within:bg-white">
                    <span className="text-sm text-neutral-400">{currency}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      placeholder="0.00"
                      value={prices[c.label]}
                      onChange={(e) => onPrices({ ...prices, [c.label]: e.target.value })}
                      className="w-full bg-transparent py-2.5 pl-2 text-base font-semibold text-neutral-900 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
