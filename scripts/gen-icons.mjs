import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
const iconsDir = join(dir, '..', 'public', 'icons')
const anySvg = readFileSync(join(iconsDir, 'icon.svg'))
const maskSvg = readFileSync(join(iconsDir, 'maskable.svg'))

const sizes = [192, 256, 384, 512]
for (const s of sizes) {
  await sharp(anySvg, { density: 384 })
    .resize(s, s)
    .png()
    .toFile(join(iconsDir, `icon-${s}.png`))
}
await sharp(maskSvg, { density: 384 })
  .resize(512, 512)
  .png()
  .toFile(join(iconsDir, 'maskable-512.png'))

console.log('icons generated:', [...sizes.map((s) => `icon-${s}.png`), 'maskable-512.png'].join(', '))
