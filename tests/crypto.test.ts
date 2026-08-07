import { describe, expect, it } from 'vitest'
import { hashText, hmac } from '../src/lib/crypto'
import { textToBytes } from '../src/lib/codec'

// Known NIST/RFC vectors.
describe('hashText', () => {
  it('SHA-256 of empty string', async () => {
    expect(await hashText('', 'SHA-256')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    )
  })
  it('SHA-1 of "abc"', async () => {
    expect(await hashText('abc', 'SHA-1')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })
  it('SHA-512 of "abc"', async () => {
    expect(await hashText('abc', 'SHA-512')).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    )
  })
  it('base64 encoding differs from hex', async () => {
    const h = await hashText('abc', 'SHA-256', 'hex')
    const b = await hashText('abc', 'SHA-256', 'base64')
    expect(b).not.toBe(h)
    expect(b).toContain('=')
  })
})

describe('hmac', () => {
  it('RFC 4231 HMAC-SHA-256 test case 1', async () => {
    const key = new Uint8Array(20).fill(0x0b)
    const msg = textToBytes('Hi There')
    expect(await hmac(msg, key, 'SHA-256')).toBe(
      'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7',
    )
  })
})
