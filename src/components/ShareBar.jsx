import { useState } from 'react'
import { Link2, ClipboardCopy, Printer, Check } from 'lucide-react'

/**
 * Action row: copy a shareable link, copy a text summary, or print / save PDF.
 * `getSummary` returns the plain-text summary on demand.
 */
export default function ShareBar({ getSummary }) {
  const [copied, setCopied] = useState(null) // 'link' | 'summary' | null

  const flash = (which) => {
    setCopied(which)
    window.setTimeout(() => setCopied((c) => (c === which ? null : c)), 1800)
  }

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text)
      flash(which)
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      flash(which)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2 print:hidden">
      <Action
        icon={copied === 'link' ? Check : Link2}
        label={copied === 'link' ? 'Copied!' : 'Copy link'}
        active={copied === 'link'}
        onClick={() => copy(window.location.href, 'link')}
      />
      <Action
        icon={copied === 'summary' ? Check : ClipboardCopy}
        label={copied === 'summary' ? 'Copied!' : 'Summary'}
        active={copied === 'summary'}
        onClick={() => copy(getSummary(), 'summary')}
      />
      <Action icon={Printer} label="Print / PDF" onClick={() => window.print()} />
    </div>
  )
}

function Action({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
        active
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{label}</span>
    </button>
  )
}
