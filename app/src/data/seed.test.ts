import { describe, expect, it } from 'vitest'
import { productStatuses, daySummary } from '../domain/rules'
import { buildSeed } from './seed'

const TODAY = '2026-10-17'

describe('seed', () => {
  const seed = buildSeed(TODAY)

  it('é determinístico para o mesmo dia e muda para outro dia', () => {
    expect(buildSeed(TODAY)).toEqual(seed)
    expect(buildSeed('2026-10-18').appointments[0].plate).not.toBe(seed.appointments[0].plate)
  })

  it('tem 8 carros hoje em estados variados e ids únicos', () => {
    const today = seed.appointments.filter((a) => a.date === TODAY)
    expect(today).toHaveLength(8)
    expect(new Set(today.map((a) => a.status))).toEqual(new Set(['aguardando', 'lavando', 'pronto', 'pago']))
    const ids = seed.appointments.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('tem 30 dias de histórico, todo pago, com placa e serviço válidos', () => {
    const past = seed.appointments.filter((a) => a.date < TODAY)
    expect(new Set(past.map((a) => a.date)).size).toBe(30)
    const serviceIds = new Set(seed.services.map((s) => s.id))
    for (const a of past) {
      expect(a.status).toBe('pago')
      expect(a.plate).toMatch(/^[A-Z]{3}\d[A-Z]\d{2}$/)
      expect(serviceIds.has(a.serviceId)).toBe(true)
    }
  })

  it('só o carro lavando ocupa box, e nunca dois no mesmo', () => {
    const boxes = seed.appointments.filter((a) => a.date === TODAY && a.box).map((a) => a.box)
    expect(boxes).toEqual([1, 2])
  })

  it('o resumo de hoje bate com a soma dos carros', () => {
    const s = daySummary(seed.appointments, TODAY)
    const manual = seed.appointments.filter((a) => a.date === TODAY).reduce((n, a) => n + a.valueCents, 0)
    expect(s.expectedCents).toBe(manual)
    expect(s.receivedCents).toBe(5000)
    expect(s.toCollectCents).toBe(5000)
  })

  it('os alertas de estoque saem como planejado: shampoo e pretinho pedem atenção', () => {
    const levels = Object.fromEntries(
      productStatuses(seed.products, seed.appointments, seed.services, TODAY).map((s) => [s.product.id, s.level]),
    )
    expect(levels).toEqual({ shampoo: 'critico', pretinho: 'atencao', cera: 'ok', desengraxante: 'ok' })
  })
})
