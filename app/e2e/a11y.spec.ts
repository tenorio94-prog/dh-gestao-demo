import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function audit(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}x ${v.nodes[0]?.target.join(' ')} — ${v.help}`)
}

test('acessibilidade (axe, WCAG 2.2 AA) em cada tela e painel', async ({ page }) => {
  // Janela alta: o axe só mede o que está visível, e o painel rolável cortaria itens (falso positivo).
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 2000 })
  const found: Record<string, string[]> = {}
  const check = async (name: string) => {
    const issues = await audit(page)
    if (issues.length) found[name] = issues
  }
  await page.goto('/app')
  await page.getByRole('heading', { level: 1 }).waitFor()
  await check('Hoje')
  await page.getByRole('button', { name: /Novo agendamento/ }).click()
  await check('Novo agendamento')
  await page.keyboard.press('Escape')
  await page.getByRole('article', { name: /RIO4A82/ }).getByRole('button', { name: /Cobrar/ }).click()
  await check('Cobrar')
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: 'Estoque' }).click()
  await check('Estoque')
  await page.getByRole('button', { name: /Pedir reposição/ }).first().click()
  await check('Pedir reposição')
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: 'Meu mês' }).click()
  await check('Meu mês')
  console.log(JSON.stringify(found, null, 2))
  expect(found).toEqual({})
})

test('acessibilidade (axe, WCAG 2.2 AA) na landing', async ({ page }) => {
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 2000 })
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  const issues = await audit(page)
  console.log(JSON.stringify(issues, null, 2))
  expect(issues).toEqual([])
})

test('acessibilidade (axe, WCAG 2.2 AA) nos primeiros passos com dados próprios', async ({ page }) => {
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 2000 })
  const found: Record<string, string[]> = {}
  const check = async (name: string) => {
    const issues = await audit(page)
    if (issues.length) found[name] = issues
  }
  await page.goto('/app')
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.getByRole('button', { name: /Começar com os meus dados/ }).click()
  await check('Escolha da dor')
  await page.getByRole('button', { name: /Saber quando o produto acaba/ }).click()
  await check('Primeiros passos')
  await page.getByRole('button', { name: 'Cadastrar meu produto' }).click()
  await check('Cadastrar produto')
  console.log(JSON.stringify(found, null, 2))
  expect(found).toEqual({})
})
