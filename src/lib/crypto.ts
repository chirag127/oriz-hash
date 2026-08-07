/**
 * Hash + HMAC + random via native WebCrypto. Browser-only entry
 * (crypto.subtle). Pure metadata (ALGOS) is safe to import anywhere.
 */
import { bytesToBase64, bytesToHex, textToBytes } from './codec'

export type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export const ALGOS: { id: Algo; label: string; bits: number; note: string }[] = [
  {
    id: 'SHA-256',
    label: 'SHA-256',
    bits: 256,
    note: 'Default choice. Fast, collision-resistant, ubiquitous.',
  },
  {
    id: 'SHA-512',
    label: 'SHA-512',
    bits: 512,
    note: 'Wider digest; faster than SHA-256 on 64-bit CPUs.',
  },
  {
    id: 'SHA-384',
    label: 'SHA-384',
    bits: 384,
    note: 'SHA-512 truncated; resists length-extension attacks.',
  },
  {
    id: 'SHA-1',
    label: 'SHA-1',
    bits: 160,
    note: 'Broken for collisions. Legacy checksums only — never for security.',
  },
]

export type Encoding = 'hex' | 'base64'

export function encodeDigest(buf: ArrayBuffer, enc: Encoding): string {
  const bytes = new Uint8Array(buf)
  return enc === 'hex' ? bytesToHex(bytes) : bytesToBase64(bytes)
}

export async function hashBytes(
  data: Uint8Array,
  algo: Algo,
): Promise<ArrayBuffer> {
  return crypto.subtle.digest(algo, data as unknown as BufferSource)
}

export async function hashText(
  text: string,
  algo: Algo,
  enc: Encoding = 'hex',
): Promise<string> {
  return encodeDigest(await hashBytes(textToBytes(text), algo), enc)
}

export async function hmac(
  message: Uint8Array,
  key: Uint8Array,
  algo: Algo,
  enc: Encoding = 'hex',
): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as unknown as BufferSource,
    { name: 'HMAC', hash: algo },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    message as unknown as BufferSource,
  )
  return encodeDigest(sig, enc)
}

export function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n)
  crypto.getRandomValues(out)
  return out
}

export function uuidV4(): string {
  return crypto.randomUUID()
}
