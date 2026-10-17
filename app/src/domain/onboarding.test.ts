import { describe, expect, it } from 'vitest'
import { setupProgress } from './onboarding'
import type { Appointment, Product } from './types'

const product = { id: 'p' } as Product
const car = (over: Partial<Appointment> = {}) => ({ id: 'a', ...over }) as Appointment

describe('primeiros passos', () => {
  it('começa em 25% e pede o produto primeiro quando a dor é produto', () => {
    const p = setupProgress({ intent: 'produto', products: [], appointments: [] })
    expect(p.percent).toBe(25)
    expect(p.steps.map((s) => s.id)).toEqual(['produto', 'carro', 'finalizar'])
    expect(p.next?.id).toBe('produto')
  })

  it('pede o carro primeiro quando a dor é cobrança ou fila', () => {
    for (const intent of ['cobranca', 'fila'] as const) {
      expect(setupProgress({ intent, products: [], appointments: [] }).next?.id).toBe('carro')
    }
  })

  it('sem escolha, usa a ordem do produto', () => {
    expect(setupProgress({ intent: null, products: [], appointments: [] }).next?.id).toBe('produto')
  })

  it('avança com o uso e termina em 100% sem próximo passo', () => {
    const half = setupProgress({ intent: 'produto', products: [product], appointments: [car()] })
    expect(half.percent).toBe(75)
    expect(half.next?.id).toBe('finalizar')
    const all = setupProgress({ intent: 'produto', products: [product], appointments: [car({ finishedDate: '2026-10-17' })] })
    expect(all.percent).toBe(100)
    expect(all.next).toBeNull()
  })
})
