import { useState } from 'react'
import { ALGOS, type Algo, type Encoding, hmac } from '../lib/crypto'
import { textToBytes, hexToBytes, base64ToBytes } from '../lib/codec'
import { Digest } from './Digest'

type KeyFmt = 'text' | 'hex' | 'base64'

function keyBytes(v: string, fmt: KeyFmt): Uint8Array {
  if (fmt === 'hex') return hexToBytes(v)
  if (fmt === 'base64') return base64ToBytes(v)
  return textToBytes(v)
}

export function HmacPanel() {
  const [msg, setMsg] = useState('')
  const [key, setKey] = useState('')
  const [keyFmt, setKeyFmt] = useState<KeyFmt>('text')
  const [algo, setAlgo] = useState<Algo>('SHA-256')
  const [enc, setEnc] = useState<Encoding>('hex')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')

  const run = async () => {
    setErr('')
    setOut('')
    try {
      const sig = await hmac(textToBytes(msg), keyBytes(key, keyFmt), algo, enc)
      setOut(sig)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'HMAC failed')
    }
  }

  return (
    <section className="safe" aria-labelledby="hmac-h">
      <h2 id="hmac-h">HMAC</h2>
      <div className="field">
        <label htmlFor="hmac-msg">Message</label>
        <textarea id="hmac-msg" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="hmac-key">Secret key</label>
        <input id="hmac-key" type="text" value={key} onChange={(e) => setKey(e.target.value)} />
      </div>
      <div className="row" style={{ marginBottom: 'var(--oz-space-4)' }}>
        <div className="seg" role="group" aria-label="key format">
          {(['text', 'hex', 'base64'] as KeyFmt[]).map((f) => (
            <button key={f} type="button" aria-pressed={keyFmt === f} onClick={() => setKeyFmt(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="row between" style={{ marginBottom: 'var(--oz-space-4)' }}>
        <label className="hint">algo{' '}
          <select value={algo} onChange={(e) => setAlgo(e.target.value as Algo)}>
            {ALGOS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </label>
        <div className="seg" role="group" aria-label="encoding">
          {(['hex', 'base64'] as Encoding[]).map((e) => (
            <button key={e} type="button" aria-pressed={enc === e} onClick={() => setEnc(e)}>{e}</button>
          ))}
        </div>
      </div>
      <button type="button" className="btn" onClick={run} disabled={!key}>compute HMAC</button>
      {err && <p className="err">{err}</p>}
      <Digest label={`HMAC-${algo}`} value={out} />
    </section>
  )
}
