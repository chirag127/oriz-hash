import { useState } from 'react'

export function Digest({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  if (!value) return null
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard blocked; user can select manually */
    }
  }
  return (
    <div className="digest">
      <div className="lbl">
        <span>{label}</span>
        <button type="button" className="copy" onClick={copy}>
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <code>{value}</code>
    </div>
  )
}
