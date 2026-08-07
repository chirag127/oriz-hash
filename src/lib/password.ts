/**
 * Password generation (CSPRNG) + entropy-based strength. Pure logic.
 * crypto.getRandomValues is global in node 22 + all browsers.
 */

export interface PasswordOpts {
  length: number
  lower: boolean
  upper: boolean
  digits: boolean
  symbols: boolean
  /** Drop look-alike glyphs (O0Il1|). */
  noAmbiguous?: boolean
}

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: "!#$%&()*+,-./:;<=>?@[]^_{|}~",
}
const AMBIGUOUS = new Set('O0Il1|'.split(''))

export function buildPool(opts: PasswordOpts): string {
  let pool = ''
  if (opts.lower) pool += SETS.lower
  if (opts.upper) pool += SETS.upper
  if (opts.digits) pool += SETS.digits
  if (opts.symbols) pool += SETS.symbols
  if (opts.noAmbiguous)
    pool = [...pool].filter((c) => !AMBIGUOUS.has(c)).join('')
  return pool
}

/** Uniform, bias-free index into 0..max via rejection sampling. */
function randIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  let x: number
  do {
    crypto.getRandomValues(buf)
    x = buf[0]
  } while (x >= limit)
  return x % max
}

export function generatePassword(opts: PasswordOpts): string {
  const pool = buildPool(opts)
  if (!pool) throw new Error('select at least one character set')
  if (opts.length < 1) throw new Error('length must be >= 1')
  let out = ''
  for (let i = 0; i < opts.length; i++) out += pool[randIndex(pool.length)]
  return out
}

export interface Strength {
  /** Shannon-style entropy in bits, from pool size × length. */
  bits: number
  /** 0..4 bucket. */
  score: 0 | 1 | 2 | 3 | 4
  label: 'very weak' | 'weak' | 'fair' | 'strong' | 'very strong'
}

/** Effective pool size actually present in the string. */
function observedPool(pw: string): number {
  let n = 0
  if (/[a-z]/.test(pw)) n += 26
  if (/[A-Z]/.test(pw)) n += 26
  if (/[0-9]/.test(pw)) n += 10
  if (/[^a-zA-Z0-9]/.test(pw)) n += 33
  return n || 1
}

export function estimateStrength(pw: string): Strength {
  if (!pw) return { bits: 0, score: 0, label: 'very weak' }
  const unique = new Set(pw).size
  // penalize low variety: use min(length, unique*1.5) as effective length
  const effLen = Math.min(pw.length, unique * 1.5)
  const bits = Math.round(effLen * Math.log2(observedPool(pw)))
  const score: Strength['score'] =
    bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 90 ? 3 : 4
  const label = (['very weak', 'weak', 'fair', 'strong', 'very strong'] as const)[
    score
  ]
  return { bits, score, label }
}
