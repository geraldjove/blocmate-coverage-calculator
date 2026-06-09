// Generates the brand app-icon set into /public using sharp.
// Run with: node scripts/gen-icons.mjs
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const RED = '#dc3947'
const RED_DARK = '#c62a38'

// A white sealer droplet on the brand red. `maskable` adds safe-zone padding
// and drops the corner rounding (the platform supplies the mask).
function iconSvg(size, { maskable = false } = {}) {
  const pad = maskable ? size * 0.16 : 0
  const radius = maskable ? 0 : size * 0.22
  const scale = (size - pad * 2) / 512
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${RED}"/>
      <stop offset="1" stop-color="${RED_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
  <g transform="translate(${pad},${pad}) scale(${scale})">
    <path d="M256 72 C256 72 150 234 150 326 C150 389 197 438 256 438 C315 438 362 389 362 326 C362 234 256 72 256 72 Z" fill="#ffffff"/>
  </g>
</svg>`
}

const png = (size, opts) => sharp(Buffer.from(iconSvg(size, opts))).png()

await Promise.all([
  png(192).toFile(join(PUBLIC, 'pwa-192x192.png')),
  png(512).toFile(join(PUBLIC, 'pwa-512x512.png')),
  png(512, { maskable: true }).toFile(join(PUBLIC, 'pwa-maskable-512x512.png')),
  png(180, { maskable: true }).toFile(join(PUBLIC, 'apple-touch-icon.png')),
  png(32).toFile(join(PUBLIC, 'favicon-32x32.png')),
])

writeFileSync(join(PUBLIC, 'favicon.svg'), iconSvg(64))

console.log('Icons written to /public')
