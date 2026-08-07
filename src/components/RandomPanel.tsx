import { useState } from 'react'
import { randomBytes, uuidV4 } from '../lib/crypto'
import { bytesToHex, bytesToBase64 } from '../lib/codec'
import { generatePassword, estimateStrength, type PasswordOpts } from '../lib/password'
import { Digest } from './Digest'

export function RandomPanel() {
  // random bytes
  const [n, setN] = useState(16)
  const [rndHex, setRndHex] = useState('')
  const [rndB64, setRndB64] = useState('')
  const genBytes = () => {
    const b = randomBytes(Math.max(1, Math.min(1024, n)))
    setRndHex(bytesToHex(b))
    setRndB64(bytesToBase64(b))
  }

  // uuid
  const [uuids, setUuids] = useState<string[]>([])
  const genUuids = () => setUuids(Array.from({ length: 5 }, () => uuidV4()))

  // password
  const [opts, setOpts] = useState<PasswordOpts>({ length: 20, lower: true, upper: true, digits: true, symbols: true, noAmbiguous: false })
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState('')
  const genPw = () => {
    setPwErr('')
    try { setPw(generatePassword(opts)) } catch (e) { setPw(''); setPwErr(e instanceof Error ? e.message : 'error') }
  }
  const strength = pw ? estimateStrength(pw) : null

  const [ai, setAi] = useState<{ state: 'idle' | 'think' | 'done'; text: string }>({ state: 'idle', text: '' })
  const assess = async () => {
    if (!pw) return
    setAi({ state: 'think', text: '' })
    try {
      const { complete } = await import('@chirag127/oz-ai')
      // Never send the real secret. Describe the PATTERN only.
      const pattern = `length ${pw.length}, sets: ${[opts.lower && 'lower', opts.upper && 'upper', opts.digits && 'digits', opts.symbols && 'symbols'].filter(Boolean).join('+')}, ~${estimateStrength(pw).bits} bits entropy`
      const out = await complete(
        `Assess this password PATTERN (the actual password is NOT shared): ${pattern}. Is it strong enough for a bank login vs a throwaway account? 2 sentences.`,
        { system: 'Concise security advisor. Never ask for the actual password.' },
      )
      setAi({ state: 'done', text: out })
    } catch {
      setAi({ state: 'done', text: 'AI unavailable. Guide: ≥60 bits fine for most accounts, ≥90 bits for high-value (bank, email). Use a manager + unique per site.' })
    }
  }

  return (
    <section className="safe" aria-labelledby="rnd-h">
      <h2 id="rnd-h">Random · bytes / UUID / password</h2>

      <div className="grid2">
        <div>
          <div className="field">
            <label htmlFor="rnd-n">Random bytes ({n})</label>
            <input id="rnd-n" type="number" min={1} max={1024} value={n} onChange={(e) => setN(Number(e.target.value))} />
          </div>
          <button type="button" className="btn" onClick={genBytes}>generate bytes</button>
          <Digest label="hex" value={rndHex} />
          <Digest label="base64" value={rndB64} />
        </div>
        <div>
          <div className="field"><label>UUID v4</label></div>
          <button type="button" className="btn" onClick={genUuids}>generate 5 UUIDs</button>
          {uuids.length > 0 && (
            <div className="digest">
              <div className="lbl"><span>uuid v4 ×5</span></div>
              {uuids.map((u) => <code key={u}>{u}</code>)}
            </div>
          )}
        </div>
      </div>

      <hr style={{ border: 0, borderTop: '1px solid var(--oz-border)', margin: 'var(--oz-space-6) 0' }} />

      <div className="field">
        <label htmlFor="pw-len">Password length ({opts.length})</label>
        <input id="pw-len" type="range" min={4} max={64} value={opts.length} onChange={(e) => setOpts({ ...opts, length: Number(e.target.value) })} />
      </div>
      <div className="row" style={{ marginBottom: 'var(--oz-space-4)', gap: 'var(--oz-space-4)' }}>
        {(['lower', 'upper', 'digits', 'symbols'] as const).map((k) => (
          <label key={k} className="chk">
            <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} />{k}
          </label>
        ))}
        <label className="chk">
          <input type="checkbox" checked={!!opts.noAmbiguous} onChange={(e) => setOpts({ ...opts, noAmbiguous: e.target.checked })} />no look-alikes
        </label>
      </div>
      <div className="row between">
        <button type="button" className="btn" onClick={genPw}>generate password</button>
        {pw && <button type="button" className="btn ghost" onClick={assess}>assess (AI)</button>}
      </div>
      {pwErr && <p className="err">{pwErr}</p>}
      {pw && (
        <>
          <Digest label="password" value={pw} />
          {strength && (
            <>
              <div className="meter" data-score={strength.score} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => <span key={i} />)}
              </div>
              <p className="hint">{strength.label} · ~{strength.bits} bits entropy</p>
            </>
          )}
        </>
      )}
      {ai.state !== 'idle' && (
        <div className="ai-box">{ai.state === 'think' ? <span className="thinking">thinking…</span> : ai.text}</div>
      )}
      <p className="hint warn" style={{ marginTop: 'var(--oz-space-3)' }}>AI assess sends only the pattern (length + entropy), never the actual password.</p>
    </section>
  )
}
