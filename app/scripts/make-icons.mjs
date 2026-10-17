// Gera os ícones do app a partir do conceito de logo escolhido (design/logo-concepts/conceito-4-selo.png).
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dataUrl = `data:image/png;base64,${readFileSync(fileURLToPath(new URL('../design/logo-concepts/conceito-4-selo.png', import.meta.url))).toString('base64')}`

// [arquivo, tamanho, fundo, proporção do selo dentro do quadro]
const targets = [
  ['logo-mark.png', 144, 'transparent', 1],
  ['favicon-64.png', 64, 'transparent', 1],
  ['apple-touch-icon.png', 180, '#006d77', 0.78],
  ['icon-192.png', 192, 'transparent', 1],
  ['icon-512.png', 512, 'transparent', 1],
  ['icon-maskable-512.png', 512, '#006d77', 0.62],
]

const browser = await chromium.launch()
for (const [name, size, background, scale] of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(
    `<body style="margin:0;display:grid;place-items:center;width:${size}px;height:${size}px;background:${background}">
       <img src="${dataUrl}" style="width:${size * scale}px;height:${size * scale}px;object-fit:contain">
     </body>`,
  )
  await page.screenshot({ path: fileURLToPath(new URL(`../public/${name}`, import.meta.url)), omitBackground: background === 'transparent' })
  await page.close()
}
await browser.close()
console.log('ícones gerados:', targets.map(([n]) => n).join(', '))
