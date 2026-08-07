# oriz-hash — the vault

**Live: https://hash.oriz.in**

Client-side crypto & hash toolkit. **100% client-side, no upload, no signup** — every byte is processed in your browser with the native Web Crypto API. Nothing is ever sent to a server.

## Features

- **Hash** — SHA-1, SHA-256, SHA-384, SHA-512 of text or any dropped file. Hex or base64 output.
- **HMAC** — keyed MAC over a message; key as text/hex/base64, any SHA algorithm.
- **Base64 / Hex** — encode & decode both ways, incl. hex↔base64 and URL-safe base64.
- **Random bytes** — cryptographically secure (`crypto.getRandomValues`), hex + base64.
- **Password generator** — CSPRNG, tunable sets, no-look-alike option, live entropy-based strength meter.
- **UUID v4** — via `crypto.randomUUID`.
- **AI polish (optional)** — explains hash-algorithm choice and assesses a password *pattern* (never the secret itself) via `@chirag127/oz-ai` (g4f, no key, multi-provider failover). Core tools work even if AI is down.

## Stack

Astro (static) + React 19 islands + Tailwind v4. Zero external crypto deps — native `crypto.subtle` / `crypto.getRandomValues` / `crypto.randomUUID`. Shared `@chirag127/oz-*` packages for chrome, tokens, file utils, and AI. Big libs are lazy-imported only on demand.

## Develop

```bash
npm install --legacy-peer-deps
npm run dev      # local
npm test         # vitest — codec, password, crypto vectors
npm run build    # static dist/
npm run deploy   # build + wrangler pages deploy
```

## License

MIT © 2026 Chirag Singhal
