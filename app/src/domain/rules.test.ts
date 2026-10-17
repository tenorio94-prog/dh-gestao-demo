import { describe, expect, it } from 'vitest'
import { services } from '../data/seed'
import { addDays, addMonths, dayLabel, monthLabel, saoPauloDay } from './dates'
import { formatBRL, isValidPlate, normalizePlate, whatsappLink, whatsappNumber } from './format'
import {
  daySummary,
  daysRemaining,
  deductStock,
  finishWash,
  monthSummary,
  nextFreeBox,
  payAppointment,
  priorityOrder,
  startWash,
  stockLevel,
  suggestedContainers,
} from './rules'
import type { Appointment, Product } from './types'

const car = (over: Partial<Appointment> = {}): Appointment => ({
  id: 'a',
  plate: 'ABC1D23',
  model: 'Gol',
  color: 'Prata',
  serviceId: 'simples',
  date: '2026-10-17',
  time: '09:00',
  valueCents: 5000,
  status: 'aguardando',
  ...over,
})

const shampoo: Product = {
  id: 'shampoo',
  name: 'Shampoo',
  category: 'x',
  containerMl: 5000,
  fullMl: 10000,
  stockMl: 1000,
  costCentsPerContainer: 6900,
}

describe('datas', () => {
  it('usa o dia de São Paulo mesmo quando em UTC já virou o dia', () => {
    expect(saoPauloDay(new Date('2026-10-18T01:30:00Z'))).toBe('2026-10-17')
  })
  it('soma dias e meses atravessando virada de ano', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addMonths('2026-12', 1)).toBe('2027-01')
    expect(addMonths('2026-01', -1)).toBe('2025-12')
  })
  it('escreve rótulos em português', () => {
    expect(monthLabel('2026-10')).toBe('Outubro de 2026')
    expect(dayLabel('2026-10-17')).toBe('sábado, 17 de outubro')
  })
})

describe('formatação', () => {
  it('formata centavos em reais', () => {
    expect(formatBRL(8500).replace(/\s/g, ' ')).toBe('R$ 85,00')
    expect(formatBRL(5)).toContain('0,05')
  })
  it('normaliza e valida placa antiga e Mercosul', () => {
    expect(normalizePlate('bra-2e19x')).toBe('BRA2E19')
    expect(isValidPlate('BRA2E19')).toBe(true)
    expect(isValidPlate('ABC1234')).toBe(true)
    expect(isValidPlate('AB12345')).toBe(false)
  })
  it('monta link do WhatsApp com 55 e texto codificado', () => {
    expect(whatsappNumber('(11) 98765-4321')).toBe('5511987654321')
    expect(whatsappNumber('123')).toBe('')
    expect(whatsappLink('11987654321', 'Olá & tudo')).toBe('https://wa.me/5511987654321?text=Ol%C3%A1%20%26%20tudo')
    expect(whatsappLink('', 'oi')).toBe('https://wa.me/?text=oi')
  })
})

describe('resumo do dia', () => {
  it('soma previsto, recebido e a receber a partir dos carros', () => {
    const list = [
      car({ id: '1', valueCents: 5000, status: 'pago' }),
      car({ id: '2', valueCents: 8500, status: 'pronto' }),
      car({ id: '3', valueCents: 13000, status: 'aguardando' }),
      car({ id: '4', date: '2026-10-16', valueCents: 99999, status: 'pago' }),
    ]
    const s = daySummary(list, '2026-10-17')
    expect(s.count).toBe(3)
    expect(s.expectedCents).toBe(26500)
    expect(s.receivedCents).toBe(5000)
    expect(s.toCollectCents).toBe(8500)
    expect(s.pendingCents).toBe(21500)
    expect(s.byStatus).toEqual({ aguardando: 1, lavando: 0, pronto: 1, pago: 1 })
  })

  it('soma apenas carros prontos do dia, incluindo zero quando não há cobranças', () => {
    const list = [
      car({ id: '1', status: 'pronto', valueCents: 2000 }),
      car({ id: '2', status: 'pronto', valueCents: 3000 }),
      car({ id: '3', status: 'lavando', valueCents: 4000 }),
      car({ id: '4', status: 'aguardando', valueCents: 5000 }),
      car({ id: '5', status: 'pago', valueCents: 6000 }),
      car({ id: '6', date: '2026-10-16', status: 'pronto', valueCents: 7000 }),
    ]
    expect(daySummary(list, '2026-10-17').toCollectCents).toBe(5000)
    expect(daySummary(list.filter((a) => a.status !== 'pronto'), '2026-10-17').toCollectCents).toBe(0)
  })
})

describe('ordenação por prioridade', () => {
  it('prioriza o estado e desempata por horário e id', () => {
    const list = [
      car({ id: 'pago', status: 'pago', time: '08:00' }),
      car({ id: 'aguardando', status: 'aguardando', time: '08:00' }),
      car({ id: 'pronto', status: 'pronto', time: '08:00' }),
      car({ id: 'lavando-b', status: 'lavando', time: '10:00' }),
      car({ id: 'lavando-z', status: 'lavando', time: '09:00' }),
      car({ id: 'lavando-a', status: 'lavando', time: '09:00' }),
    ]
    expect(list.sort(priorityOrder).map((a) => a.id)).toEqual([
      'lavando-a', 'lavando-z', 'lavando-b', 'pronto', 'aguardando', 'pago',
    ])
  })
})

describe('fluxo do carro', () => {
  it('avança aguardando → lavando → pronto → pago, sem pular etapa', () => {
    let a = car()
    a = payAppointment(a, 'pix')
    expect(a.status).toBe('aguardando')
    a = startWash(a, 2)
    expect(a).toMatchObject({ status: 'lavando', box: 2 })
    a = finishWash(a, '2026-10-17')
    expect(a).toMatchObject({ status: 'pronto', finishedDate: '2026-10-17' })
    expect(a.box).toBeUndefined()
    a = payAppointment(a, 'cartao')
    expect(a).toMatchObject({ status: 'pago', payMethod: 'cartao' })
  })
  it('escolhe o primeiro box livre e devolve null com tudo ocupado', () => {
    const busy = [1, 2, 3].map((box) => car({ id: `b${box}`, status: 'lavando', box }))
    expect(nextFreeBox([], '2026-10-17')).toBe(1)
    expect(nextFreeBox(busy.slice(0, 1), '2026-10-17')).toBe(2)
    expect(nextFreeBox(busy, '2026-10-17')).toBeNull()
  })
})

describe('estoque', () => {
  it('baixa o consumo do serviço e nunca fica negativo', () => {
    const simples = services.find((s) => s.id === 'simples')!
    const [after] = deductStock([shampoo], simples)
    expect(after.stockMl).toBe(920)
    const [empty] = deductStock([{ ...shampoo, stockMl: 50 }], simples)
    expect(empty.stockMl).toBe(0)
  })
  it('calcula dias restantes e nível de alerta', () => {
    expect(daysRemaining(1000, 250)).toBe(4)
    expect(daysRemaining(1000, 0)).toBeNull()
    expect(stockLevel(4)).toBe('critico')
    expect(stockLevel(5)).toBe('critico')
    expect(stockLevel(6)).toBe('atencao')
    expect(stockLevel(10)).toBe('atencao')
    expect(stockLevel(11)).toBe('ok')
    expect(stockLevel(null)).toBe('ok')
  })
  it('sugere galões até o estoque cheio, no mínimo um', () => {
    expect(suggestedContainers(shampoo)).toBe(2)
    expect(suggestedContainers({ ...shampoo, stockMl: 9900 })).toBe(1)
  })
})

describe('meu mês', () => {
  it('conta só carros prontos ou pagos do mês e soma o consumo', () => {
    const list = [
      car({ id: '1', date: '2026-10-02', status: 'pago', valueCents: 5000, finishedDate: '2026-10-02' }),
      car({ id: '2', date: '2026-10-03', status: 'pronto', valueCents: 8500, serviceId: 'completa', finishedDate: '2026-10-03' }),
      car({ id: '3', date: '2026-10-04', status: 'aguardando', valueCents: 99900 }),
      car({ id: '4', date: '2026-09-30', status: 'pago', valueCents: 7000, finishedDate: '2026-09-30' }),
    ]
    const m = monthSummary(list, services, [shampoo], '2026-10')
    expect(m.count).toBe(2)
    expect(m.soldCents).toBe(13500)
    expect(m.receivedCents).toBe(5000)
    expect(m.receivableCents).toBe(8500)
    expect(m.topServices[0].count).toBe(1)
    expect(m.consumption[0]).toEqual({ productId: 'shampoo', ml: 200 })
  })
})
