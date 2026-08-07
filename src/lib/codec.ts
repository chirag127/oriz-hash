/**
 * Pure byte <-> text codecs. No crypto here — just encoding.
 * Runs in browser + node (vitest) since TextEncoder/atob/btoa are universal
 * in node 22 and the DOM.
 */

const HEX = '0123456789abcdef'

export function bytesToHex(bytes: Uint8Array): string {
  let out = ''
  for (const b of bytes) out += HEX[b >> 4] + HEX[b & 15]
  return out
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, '').toLowerCase()
  if (clean.length % 2 !== 0) throw new Error('hex length must be even')
  if (!/^[0-9a-f]*$/.test(clean)) throw new Error('invalid hex character')
  const out = new Uint8Array(clean.length / 2)
  for (let i = 0; i < out.length; i++)
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  return out
}

export function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

export function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

/** Base64 encode raw bytes. url:true → RFC 4648 URL-safe, no padding. */
export function bytesToBase64(bytes: Uint8Array, url = false): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  const b64 = btoa(bin)
  return url ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64
}

export function base64ToBytes(b64: string): Uint8Array {
  let s = b64.trim().replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  if (pad) s += '='.repeat(4 - pad)
  const bin = atob(s)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export function textToBase64(text: string, url = false): string {
  return bytesToBase64(textToBytes(text), url)
}

export function base64ToText(b64: string): string {
  return bytesToText(base64ToBytes(b64))
}
