import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
const out = join(dir, '..', 'public', 'screenshots')
const url = 'https://hash.oriz.in'
const args = ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']

const browser = await chromium.launch({ args })

const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const dp = await desktop.newPage()
await dp.goto(url, { waitUntil: 'networkidle' })
await dp.screenshot({ path: join(out, 'desktop.png') })
await desktop.close()

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const mp = await mobile.newPage()
await mp.goto(url, { waitUntil: 'networkidle' })
await mp.screenshot({ path: join(out, 'mobile.png') })
await mobile.close()

await browser.close()
console.log('screenshots: desktop.png (1280x800), mobile.png (390x844)')
