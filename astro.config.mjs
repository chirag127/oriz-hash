// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import AstroPWA from '@vite-pwa/astro'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://hash.oriz.in',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      manifest: {
        name: 'oriz Hash',
        short_name: 'Hash',
        id: '/',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        lang: 'en',
        dir: 'ltr',
        description: 'Client-side crypto & hash toolkit — SHA, HMAC, base64/hex, random bytes, password generator, UUID. Nothing leaves your browser.',
        categories: ['tools'],
        background_color: '#0b0e0f',
        theme_color: '#c6ff35',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-256.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        screenshots: [
          { src: '/screenshots/desktop.png', sizes: '1280x800', type: 'image/png', form_factor: 'wide', label: 'Vault — desktop' },
          { src: '/screenshots/mobile.png', sizes: '390x844', type: 'image/png', label: 'Vault — mobile' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,svg,png,ico,webmanifest,woff,woff2}'],
        navigateFallback: '/',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /g4f\.dev|pollinations\.ai/.test(url.hostname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ai-calls',
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
