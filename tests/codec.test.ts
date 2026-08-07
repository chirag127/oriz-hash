import { describe, expect, it } from 'vitest'
import {
  bytesToHex, hexToBytes, textToBase64, base64ToText,
  bytesToBase64, base64ToBytes, textToBytes, bytesToText,
} from '../src/lib/codec'

describe('hex', () => {
  it('roundtrips', () => {
    const b = new Uint8Array([0, 1, 15, 16, 255])
    expect(bytesToHex(b)).toBe('00010f10ff')
    expect([...hexToBytes('00010f10ff')]).toEqual([0, 1, 15, 16, 255])
  })
  it('rejects odd length', () => expect(() => hexToBytes('abc')).toThrow())
  it('rejects non-hex', () => expect(() => hexToBytes('zz')).toThrow())
  it('ignores whitespace', () => expect([...hexToBytes('de ad')]).toEqual([0xde, 0xad]))
})

describe('base64', () => {
  it('roundtrips text', () => {
    expect(textToBase64('hello')).toBe('aGVsbG8=')
    expect(base64ToText('aGVsbG8=')).toBe('hello')
  })
  it('handles unicode', () => {
    const s = 'héllo ✓ 日本'
    expect(base64ToText(textToBase64(s))).toBe(s)
  })
  it('url-safe drops padding + swaps chars', () => {
    const b = new Uint8Array([251, 255, 191])
    const std = bytesToBase64(b)
    const url = bytesToBase64(b, true)
    expect(url).not.toContain('=')
    expect(url).not.toContain('+')
    expect(url).not.toContain('/')
    expect([...base64ToBytes(url)]).toEqual([...base64ToBytes(std)])
  })
  it('bytes roundtrip via text codec', () => {
    const b = textToBytes('data')
    expect(bytesToText(base64ToBytes(bytesToBase64(b)))).toBe('data')
  })
})
