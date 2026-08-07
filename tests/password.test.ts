import { describe, expect, it } from 'vitest'
import { buildPool, generatePassword, estimateStrength, type PasswordOpts } from '../src/lib/password'

const base: PasswordOpts = { length: 20, lower: true, upper: true, digits: true, symbols: true }

describe('buildPool', () => {
  it('includes selected sets only', () => {
    const pool = buildPool({ length: 1, lower: true, upper: false, digits: true, symbols: false })
    expect(pool).toContain('a')
    expect(pool).toContain('9')
    expect(pool).not.toContain('A')
    expect(pool).not.toContain('!')
  })
  it('drops ambiguous glyphs', () => {
    const pool = buildPool({ ...base, noAmbiguous: true })
    for (const c of 'O0Il1|') expect(pool).not.toContain(c)
  })
})

describe('generatePassword', () => {
  it('honors length', () => expect(generatePassword({ ...base, length: 32 })).toHaveLength(32))
  it('uses only pool chars', () => {
    const opts: PasswordOpts = { length: 200, lower: true, upper: false, digits: false, symbols: false }
    expect(generatePassword(opts)).toMatch(/^[a-z]+$/)
  })
  it('throws with empty pool', () =>
    expect(() => generatePassword({ length: 8, lower: false, upper: false, digits: false, symbols: false })).toThrow())
  it('produces distinct outputs', () => {
    expect(generatePassword(base)).not.toBe(generatePassword(base))
  })
})

describe('estimateStrength', () => {
  it('empty is very weak', () => expect(estimateStrength('').score).toBe(0))
  it('short lowercase is weak', () => expect(estimateStrength('abcde').score).toBeLessThanOrEqual(1))
  it('long mixed is strong', () => {
    const s = estimateStrength('Xk9#mQ2!vLp8@rTz4&Bn')
    expect(s.score).toBeGreaterThanOrEqual(3)
    expect(s.bits).toBeGreaterThan(80)
  })
  it('penalizes repetition', () => {
    expect(estimateStrength('aaaaaaaaaaaaaaaaaaaa').bits).toBeLessThan(estimateStrength('abcdefghijklmnopqrst').bits)
  })
})
