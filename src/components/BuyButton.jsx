import { ShoppingCart } from 'lucide-react'
import { BUY_URL } from '../lib/config'

/** Call-to-action that carries the recommended SKU + quantity to the store. */
export default function BuyButton({ recommended }) {
  const url = new URL(BUY_URL)
  if (recommended) {
    url.searchParams.set('sku', `CORE100-${recommended.label}`)
    url.searchParams.set('qty', String(recommended.units))
  }

  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 text-base font-bold text-white shadow-card-lg transition-colors hover:bg-neutral-800 print:hidden"
    >
      <ShoppingCart className="h-5 w-5" />
      {recommended
        ? `Order ${recommended.units} × ${recommended.label}`
        : 'Order CORE100'}
    </a>
  )
}
