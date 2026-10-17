import { expect, test, type Page } from '@playwright/test'

const money = (value: string) => new RegExp(`R\\$\\s*${value.replace('.', '\\.')}`)

async function open(page: Page, hash = '') {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(`/#/${hash}`)
  await page.getByRole('heading', { level: 1 }).waitFor()
  return errors
}

async function noHorizontalScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

test.describe('Hoje', () => {
  test('mostra o resumo do dia calculado a partir dos 8 carros de exemplo', async ({ page }, info) => {
    const errors = await open(page)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('8 carros')
    const summary = page.locator('section[aria-labelledby="day-title"]')
    await expect(summary).toContainText(money('670,00'))
    const toCollect = summary.getByText('A cobrar', { exact: true }).locator('..')
    await expect(toCollect).toContainText(money('50,00'))
    await expect(page.getByRole('article')).toHaveCount(8)
    await noHorizontalScroll(page)
    await page.screenshot({ path: `e2e/.shots/hoje-${info.project.name}.png`, fullPage: true })
    expect(errors).toEqual([])
  })

  test('fluxo completo: iniciar, finalizar, cobrar e o estoque baixa', async ({ page }) => {
    await open(page)
    const gol = page.getByRole('article', { name: /QWE5F67/ })
    await gol.getByRole('button', { name: /Iniciar lavagem/ }).click()
    await expect(gol).toHaveAttribute('data-status', 'lavando')
    await expect(gol).toContainText('Box 03')

    await gol.getByRole('button', { name: /Finalizar/ }).click()
    await expect(gol).toHaveAttribute('data-status', 'pronto')

    await gol.getByRole('button', { name: /Cobrar/ }).click()
    await page.getByRole('dialog', { name: 'Cobrar' }).getByRole('button', { name: /Pix/ }).click()
    await expect(gol).toHaveAttribute('data-status', 'pago')
    await expect(page.getByRole('status').filter({ hasText: 'pago via Pix' })).toBeVisible()
    const received = page.locator('section[aria-labelledby="day-title"]').getByText('Recebido', { exact: true }).locator('..')
    await expect(received).toContainText(money('100,00'))
  })

  test('os carros que pedem ação vêm primeiro', async ({ page }) => {
    await open(page)
    const cars = page.getByRole('article')
    await expect(cars.nth(0)).toHaveAttribute('data-status', 'lavando')
    await expect(cars.nth(1)).toHaveAttribute('data-status', 'lavando')
    await expect(cars.last()).toHaveAttribute('data-status', 'pago')
  })

  test('avisa quando os 3 boxes estão ocupados', async ({ page }) => {
    await open(page)
    await page.getByRole('article', { name: /QWE5F67/ }).getByRole('button', { name: /Iniciar lavagem/ }).click()
    await page.getByRole('article', { name: /PLX9J44/ }).getByRole('button', { name: /Iniciar lavagem/ }).click()
    await expect(page.getByText('Os 3 boxes estão ocupados')).toBeVisible()
    await expect(page.getByRole('article', { name: /PLX9J44/ })).toHaveAttribute('data-status', 'aguardando')
  })

  test('desfazer reverte a última ação, inclusive a baixa do estoque', async ({ page }) => {
    await open(page, 'estoque')
    const level = async () =>
      page.locator('article', { hasText: 'Shampoo Automotivo Neutro' }).getByRole('progressbar').getAttribute('aria-valuenow')
    const before = await level()
    await page.getByRole('link', { name: 'Hoje' }).click()
    const carro = page.getByRole('article', { name: /BRA2E19/ })
    await carro.getByRole('button', { name: /Finalizar/ }).click()
    await expect(carro).toHaveAttribute('data-status', 'pronto')
    await page.getByRole('button', { name: /Desfazer/ }).click()
    await expect(carro).toHaveAttribute('data-status', 'lavando')
    await expect(page.getByRole('button', { name: /Desfazer/ })).toHaveCount(0)
    await page.getByRole('link', { name: 'Estoque' }).click()
    expect(await level()).toBe(before)
  })

  test('filtra por status e mostra estado vazio', async ({ page }) => {
    await open(page)
    await page.getByRole('button', { name: /^Lavando/ }).click()
    await expect(page.getByRole('article')).toHaveCount(2)
    await page.getByRole('button', { name: /^Pago/ }).click()
    await expect(page.getByRole('article')).toHaveCount(1)
  })

  test('novo agendamento valida a placa e adiciona o carro', async ({ page }, info) => {
    await open(page)
    await page.getByRole('button', { name: /Novo agendamento/ }).click()
    const sheet = page.getByRole('dialog', { name: 'Novo agendamento' })
    await sheet.getByRole('button', { name: /Confirmar agendamento/ }).click()
    await expect(sheet).toContainText('Digite a placa completa')
    await expect(sheet).toContainText('Informe o modelo do carro')
    await page.screenshot({ path: `e2e/.shots/novo-${info.project.name}.png` })

    await sheet.getByLabel(/Placa do veículo/).fill('zzz9y88')
    await sheet.getByRole('button', { name: 'Corolla' }).click()
    await sheet.getByRole('radio', { name: /Polimento/ }).click()
    await sheet.getByRole('button', { name: /Confirmar agendamento · R\$\s*160,00/ }).click()

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('9 carros')
    const novo = page.getByRole('article', { name: /ZZZ9Y88/ })
    await expect(novo).toContainText('Corolla')
    await expect(novo).toHaveAttribute('data-status', 'aguardando')
  })

  test('os dados persistem ao recarregar e "Restaurar" volta ao exemplo', async ({ page }) => {
    await open(page)
    await page.getByRole('article', { name: /QWE5F67/ }).getByRole('button', { name: /Iniciar lavagem/ }).click()
    await page.reload()
    await expect(page.getByRole('article', { name: /QWE5F67/ })).toHaveAttribute('data-status', 'lavando')
    page.once('dialog', (d) => d.accept())
    await page.getByRole('button', { name: /Restaurar/ }).click()
    await expect(page.getByRole('article', { name: /QWE5F67/ })).toHaveAttribute('data-status', 'aguardando')
  })
})

test.describe('Estoque', () => {
  test('mostra alertas coerentes e o pedido de reposição fecha o ciclo', async ({ page, context }, info) => {
    await open(page, 'estoque')
    await expect(page.getByRole('alert')).toContainText('1 produto precisa de reposição urgente')
    const shampoo = page.locator('article', { hasText: 'Shampoo Automotivo Neutro' })
    await expect(shampoo).toHaveAttribute('data-level', 'critico')
    await expect(page.locator('article', { hasText: 'Pretinho para Pneus' })).toHaveAttribute('data-level', 'atencao')
    await expect(page.locator('article', { hasText: 'Cera Líquida' })).toHaveAttribute('data-level', 'ok')
    await noHorizontalScroll(page)
    await page.screenshot({ path: `e2e/.shots/estoque-${info.project.name}.png`, fullPage: true })

    await context.route('https://wa.me/**', (route) => route.fulfill({ body: 'ok' }))
    await shampoo.getByRole('button', { name: /Pedir reposição/ }).click()
    const sheet = page.getByRole('dialog', { name: 'Pedir reposição' })
    await expect(sheet).toContainText(/Total estimado/)
    await sheet.getByLabel('WhatsApp do fornecedor').fill('(11) 4002-8922')
    const link = sheet.getByRole('link', { name: /Enviar pedido via WhatsApp/ })
    await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\/551140028922\?text=.+Shampoo/)
    await page.screenshot({ path: `e2e/.shots/reposicao-${info.project.name}.png` })
    const popup = page.waitForEvent('popup')
    await link.click()
    await popup

    await expect(shampoo).toContainText(/Pedido de \d+ galões? enviado/)
    const before = await shampoo.getByRole('progressbar').getAttribute('aria-valuenow')
    await shampoo.getByRole('button', { name: /Registrar chegada/ }).click()
    const after = await shampoo.getByRole('progressbar').getAttribute('aria-valuenow')
    expect(Number(after)).toBeGreaterThan(Number(before))
    await expect(shampoo).not.toHaveAttribute('data-level', 'critico')
  })

  test('finalizar uma lavagem baixa o estoque do produto', async ({ page }) => {
    await open(page, 'estoque')
    const shampoo = page.locator('article', { hasText: 'Shampoo Automotivo Neutro' })
    const before = Number(await shampoo.getByRole('progressbar').getAttribute('aria-valuenow'))
    await page.getByRole('link', { name: 'Hoje' }).click()
    await page.getByRole('article', { name: /BRA2E19/ }).getByRole('button', { name: /Finalizar/ }).click()
    await page.getByRole('link', { name: 'Estoque' }).click()
    const after = Number(await shampoo.getByRole('progressbar').getAttribute('aria-valuenow'))
    expect(after).toBeLessThan(before)
  })

  test('ajustar saldo e consumo por serviço', async ({ page }) => {
    await open(page, 'estoque')
    const cera = page.locator('article', { hasText: 'Cera Líquida' })
    await cera.getByRole('button', { name: /Ajustar/ }).click()
    const sheet = page.getByRole('dialog', { name: 'Ajustar produto' })
    await sheet.getByLabel('Saldo atual (litros)').fill('0,5')
    await sheet.getByRole('button', { name: 'Salvar' }).click()
    await expect(cera.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10')
    await cera.getByRole('button', { name: /Ajustar/ }).click()
    await page.getByLabel('Saldo atual (litros)').fill('abc')
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })
})

test.describe('Meu mês', () => {
  test('mostra totais, ranking e consumo; navega para o mês anterior', async ({ page }, info) => {
    const errors = await open(page, 'mes')
    await expect(page.getByText('Recebido', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'O que mais sai' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Produto consumido no mês' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Próximo mês' })).toBeDisabled()
    await noHorizontalScroll(page)
    await page.screenshot({ path: `e2e/.shots/mes-${info.project.name}.png`, fullPage: true })
    await page.getByRole('button', { name: 'Mês anterior' }).click()
    await expect(page.getByRole('button', { name: 'Próximo mês' })).toBeEnabled()
    expect(errors).toEqual([])
  })
})

test('navegação por abas e sem rolagem horizontal em todas as telas', async ({ page }) => {
  await open(page)
  for (const name of ['Estoque', 'Meu mês', 'Hoje']) {
    await page.getByRole('link', { name }).click()
    await noHorizontalScroll(page)
  }
})
