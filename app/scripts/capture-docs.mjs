// Gera as capturas de tela para a documentação (docs/capturas/): celular e computador.
// Uso: npm run build && node scripts/capture-docs.mjs
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'

const out = fileURLToPath(new URL('../../docs/capturas/', import.meta.url))
mkdirSync(out, { recursive: true })

const server = await preview({ preview: { port: 4176, strictPort: true } })
const base = 'http://localhost:4176'

const phone = { width: 390, height: 844 }
const desk = { width: 1440, height: 900 }
const shots = [
  ['landing-desktop', '/', desk, true],
  ['landing-celular', '/', phone, true],
  ['app-hoje-desktop', '/app', desk, false],
  ['app-estoque-desktop', '/app/estoque', desk, false],
  ['app-mes-desktop', '/app/mes', desk, false],
  ['app-hoje-celular', '/app', phone, false],
  ['app-estoque-celular', '/app/estoque', phone, false],
  ['app-mes-celular', '/app/mes', phone, false],
]

const browser = await chromium.launch()
try {
  for (const [name, route, viewport, fullPage] of shots) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: viewport.width < 600 ? 2 : 1,
      locale: 'pt-BR',
      timezoneId: 'America/Sao_Paulo',
    })
    const page = await context.newPage()
    await page.goto(base + route)
    await page.getByRole('heading', { level: 1 }).first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    if (fullPage) {
      // percorre a página para carregar as imagens preguiçosas antes de fotografar
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 120))
        }
        window.scrollTo(0, 0)
      })
    }
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${out}${name}.png`, fullPage })
    await context.close()
    console.log('capturado', name)
  }

  // Painel de novo agendamento no computador (painel lateral).
  const context = await browser.newContext({ viewport: desk, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' })
  const page = await context.newPage()
  await page.goto(base + '/app')
  await page.getByRole('button', { name: /Novo agendamento/ }).click()
  await page.getByRole('dialog').waitFor()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}app-novo-agendamento-desktop.png` })
  await context.close()
  console.log('capturado app-novo-agendamento-desktop')
} finally {
  await browser.close()
  await server.close()
}
