import { useRef, useState } from 'react'
import { ALGOS, type Algo, type Encoding, hashBytes, hashText, encodeDigest } from '../lib/crypto'
import { formatBytes } from '@chirag127/oz-file'
import { Digest } from './Digest'

const encoders: Encoding[] = ['hex', 'base64']

export function HashPanel() {
  const [text, setText] = useState('')
  const [enc, setEnc] = useState<Encoding>('hex')
  const [digests, setDigests] = useState<Record<string, string>>({})
  const [fileInfo, setFileInfo] = useState<string>('')
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [ai, setAi] = useState<{ state: 'idle' | 'think' | 'done'; text: string }>({ state: 'idle', text: '' })
  const inputRef = useRef<HTMLInputElement>(null)

  const runText = async (v: string, e: Encoding) => {
    setErr('')
    setFileInfo('')
    if (!v) return setDigests({})
    const out: Record<string, string> = {}
    for (const a of ALGOS) out[a.id] = await hashText(v, a.id, e)
    setDigests(out)
  }

  const onText = (v: string) => {
    setText(v)
    runText(v, enc)
  }
  const onEnc = (e: Encoding) => {
    setEnc(e)
    if (text) runText(text, e)
  }

  const hashFile = async (file: File) => {
    setErr('')
    setBusy(true)
    setText('')
    try {
      const buf = new Uint8Array(await file.arrayBuffer())
      const out: Record<string, string> = {}
      for (const a of ALGOS) out[a.id] = encodeDigest(await hashBytes(buf, a.id as Algo), enc)
      setDigests(out)
      setFileInfo(`${file.name} · ${formatBytes(file.size)}`)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed to read file')
    } finally {
      setBusy(false)
    }
  }

  const explain = async () => {
    setAi({ state: 'think', text: '' })
    try {
      const { complete } = await import('@chirag127/oz-ai')
      const out = await complete(
        'In 3 short sentences, which of SHA-1, SHA-256, SHA-384, SHA-512 should I pick for a general integrity checksum today, and why avoid SHA-1?',
        { system: 'You are a concise cryptography advisor. Plain text, no markdown headings.' },
      )
      setAi({ state: 'done', text: out })
    } catch {
      setAi({ state: 'done', text: 'AI unavailable right now. Rule of thumb: SHA-256 for general use; SHA-512/384 for speed on 64-bit; never SHA-1 for security (collisions are practical).' })
    }
  }

  return (
    <section className="safe" aria-labelledby="hash-h">
      <h2 id="hash-h">Hash · SHA-1 / 256 / 384 / 512</h2>
      <div className="field">
        <label htmlFor="hash-in">Message</label>
        <textarea id="hash-in" rows={3} value={text} placeholder="Type text to hash, or drop a file below" onChange={(e) => onText(e.target.value)} />
      </div>

      <div
        className={`dropzone${over ? ' over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) hashFile(f) }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      >
        {busy ? 'hashing…' : fileInfo || 'Drop a file or click to hash bytes (never uploaded)'}
        <input ref={inputRef} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) hashFile(f) }} />
      </div>

      <div className="row between" style={{ marginTop: 'var(--oz-space-4)' }}>
        <div className="seg" role="group" aria-label="encoding">
          {encoders.map((e) => (
            <button key={e} type="button" aria-pressed={enc === e} onClick={() => onEnc(e)}>{e}</button>
          ))}
        </div>
        <button type="button" className="btn ghost" onClick={explain}>explain choice (AI)</button>
      </div>

      {err && <p className="err">{err}</p>}

      {ALGOS.map((a) => (
        <Digest key={a.id} label={a.label} value={digests[a.id] ?? ''} />
      ))}

      {ai.state !== 'idle' && (
        <div className="ai-box">
          {ai.state === 'think' ? <span className="thinking">thinking…</span> : ai.text}
        </div>
      )}
    </section>
  )
}
