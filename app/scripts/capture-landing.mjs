// Captura as telas reais do aplicativo para a landing e para a documentação.
// Uso: npm run build && node scripts/capture-landing.mjs
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'

const out = fileURLToPath(new URL('../public/landing/', import.meta.url))
mkdirSync(out, { recursive: true })

const server = await preview({ preview: { port: 4174, strictPort: true } })
const base = 'http://localhost:4174'

const shots = [
  // [arquivo, rota, viewport, escala]
  ['desktop-hoje.jpg', '/app', { width: 1440, height: 900 }, 1.25],
  ['desktop-mes.jpg', '/app/mes', { width: 1440, height: 900 }, 1.25],
  ['mobile-hoje.jpg', '/app', { width: 390, height: 844 }, 2],
  ['mobile-estoque.jpg', '/app/estoque', { width: 390, height: 844 }, 2],
  ['mobile-mes.jpg', '/app/mes', { width: 390, height: 844 }, 2],
]

const browser = await chromium.launch()
try {
  for (const [file, route, viewport, scale] of shots) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: scale,
      locale: 'pt-BR',
      timezoneId: 'America/Sao_Paulo',
      hasTouch: viewport.width < 600,
    })
    const page = await context.newPage()
    await page.goto(base + route)
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(700) // espera as animações de entrada terminarem
    await page.screenshot({ path: out + file, type: 'jpeg', quality: 82 })
    await context.close()
    console.log('capturado', file)
  }
} finally {
  await browser.close()
  await server.close()
}
