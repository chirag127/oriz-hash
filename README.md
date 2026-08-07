# oriz-hash — the vault

- **Live app:** https://hash.oriz.in
- **About / info:** https://chirag127.github.io/oriz-hash/
- **llms.txt:** https://hash.oriz.in/llms.txt

Client-side crypto & hash toolkit: SHA-1/256/384/512, HMAC, base64/hex, cryptographically secure random bytes, a password generator with strength meter, and UUID v4.

**100% client-side, no upload, no signup, free.** Every byte is processed in your browser with the native Web Crypto API. Nothing is ever sent to a server.

## Features

- **Hash** — SHA-1, SHA-256, SHA-384, SHA-512 of text or any dropped file. Hex or base64 output.
- **HMAC** — keyed MAC over a message; key as text/hex/base64, any SHA algorithm.
- **Base64 / Hex** — encode & decode both ways, incl. hex to base64 and URL-safe base64.
- **Random bytes** — cryptographically secure (`crypto.getRandomValues`), hex + base64.
- **Password generator** — CSPRNG, tunable sets, no-look-alike option, live entropy-based strength meter.
- **UUID v4** — via `crypto.randomUUID`.
- **AI polish (optional)** — explains hash-algorithm choice and assesses a password *pattern* (never the secret itself) via `@chirag127/oz-ai` (g4f, no key, multi-provider failover). Core tools work even if AI is down.

## Tech

Astro (static) + React 19 islands + Tailwind v4. Zero external crypto deps — native `crypto.subtle` / `crypto.getRandomValues` / `crypto.randomUUID`. Shared `@chirag127/oz-*` packages for chrome, tokens, file utils, and AI. PWA-installable, offline-capable. Big libs are lazy-imported only on demand.

Two surfaces: the live app runs on Cloudflare Pages (hash.oriz.in); a separate static info page about the project is published to GitHub Pages (chirag127.github.io/oriz-hash) from `gh-info/`.

## Develop

```bash
npm install --legacy-peer-deps
npm run dev      # local
npm test         # vitest — codec, password, crypto vectors
npm run build    # static dist/
npm run deploy   # build + wrangler pages deploy
```

## License

MIT (c) 2026 Chirag Singhal
