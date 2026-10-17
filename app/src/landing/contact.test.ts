import { describe, expect, it } from 'vitest'
import { calcMessage, contactLink, revenueAtRisk } from './contact'

describe('contato da landing', () => {
  it('abre o WhatsApp do número público com o texto codificado', () => {
    expect(contactLink('Olá')).toBe('https://wa.me/5581999476189?text=Ol%C3%A1')
  })

  it('calcula o faturamento em risco em centavos', () => {
    expect(revenueAtRisk(12, 60, 2)).toBe(144000)
    expect(revenueAtRisk(0, 60, 2)).toBe(0)
  })

  it('resume a conta feita na calculadora', () => {
    const text = calcMessage({ liters: 5, washes: 12, mlPerWash: 100, days: 4, ticket: 60, daysWithoutProduct: 2 })
    expect(text).toContain('5 L')
    expect(text).toContain('cerca de 4 dias')
    expect(text).toContain('2 dias')
    expect(text).toMatch(/1\.440,00/)
  })

  it('não quebra quando a duração não existe', () => {
    const text = calcMessage({ liters: 5, washes: 0, mlPerWash: 100, days: null, ticket: 60, daysWithoutProduct: 1 })
    expect(text).toContain('não consegui calcular')
    expect(text).toContain('1 dia ')
  })
})
