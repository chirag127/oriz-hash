import { useState } from 'react'
import {
  textToBase64, base64ToText, bytesToHex, hexToBytes,
  textToBytes, bytesToText, bytesToBase64, base64ToBytes,
} from '../lib/codec'
import { Digest } from './Digest'

type Op = 'b64enc' | 'b64dec' | 'hexenc' | 'hexdec' | 'hex2b64' | 'b642hex'

const OPS: { id: Op; label: string }[] = [
  { id: 'b64enc', label: 'text → base64' },
  { id: 'b64dec', label: 'base64 → text' },
  { id: 'hexenc', label: 'text → hex' },
  { id: 'hexdec', label: 'hex → text' },
  { id: 'hex2b64', label: 'hex → base64' },
  { id: 'b642hex', label: 'base64 → hex' },
]

function convert(op: Op, input: string, urlSafe: boolean): string {
  switch (op) {
    case 'b64enc': return textToBase64(input, urlSafe)
    case 'b64dec': return base64ToText(input)
    case 'hexenc': return bytesToHex(textToBytes(input))
    case 'hexdec': return bytesToText(hexToBytes(input))
    case 'hex2b64': return bytesToBase64(hexToBytes(input), urlSafe)
    case 'b642hex': return bytesToHex(base64ToBytes(input))
  }
}

export function CodecPanel() {
  const [op, setOp] = useState<Op>('b64enc')
  const [input, setInput] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')

  const run = (nextOp = op, nextInput = input, nextUrl = urlSafe) => {
    setErr('')
    if (!nextInput) return setOut('')
    try {
      setOut(convert(nextOp, nextInput, nextUrl))
    } catch (e) {
      setOut('')
      setErr(e instanceof Error ? e.message : 'conversion failed')
    }
  }

  const canUrl = op === 'b64enc' || op === 'hex2b64'

  return (
    <section className="safe" aria-labelledby="codec-h">
      <h2 id="codec-h">Base64 / Hex converter</h2>
      <div className="field">
        <label htmlFor="codec-op">Operation</label>
        <select id="codec-op" value={op} onChange={(e) => { const v = e.target.value as Op; setOp(v); run(v) }}>
          {OPS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="codec-in">Input</label>
        <textarea id="codec-in" rows={3} value={input} onChange={(e) => { setInput(e.target.value); run(op, e.target.value) }} />
      </div>
      {canUrl && (
        <label className="chk">
          <input type="checkbox" checked={urlSafe} onChange={(e) => { setUrlSafe(e.target.checked); run(op, input, e.target.checked) }} />
          URL-safe (no padding)
        </label>
      )}
      {err && <p className="err">{err}</p>}
      <Digest label="output" value={out} />
    </section>
  )
}
