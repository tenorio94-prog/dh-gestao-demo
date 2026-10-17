import { addDays, dayOfWeek } from '../domain/dates'
import { averageDailyMl } from '../domain/rules'
import type { Appointment, PayMethod, Product, Service } from '../domain/types'

export const services: Service[] = [
  {
    id: 'simples',
    name: 'Lavagem Simples',
    description: 'Ducha externa + aspiração leve',
    priceCents: 5000,
    minutes: 30,
    usage: { shampoo: 80, pretinho: 30 },
  },
  {
    id: 'completa',
    name: 'Lavagem Completa + Cera',
    description: 'Interna profunda + cera líquida alto brilho',
    priceCents: 8500,
    minutes: 50,
    usage: { shampoo: 120, cera: 60, pretinho: 40 },
  },
  {
    id: 'motor',
    name: 'Lavagem do Motor',
    description: 'Desengraxe e enxágue do cofre do motor',
    priceCents: 6000,
    minutes: 40,
    usage: { desengraxante: 150, shampoo: 40 },
  },
  {
    id: 'higienizacao',
    name: 'Higienização Interna',
    description: 'Bancos, teto e hidratação',
    priceCents: 13000,
    minutes: 90,
    usage: { shampoo: 60 },
  },
  {
    id: 'polimento',
    name: 'Polimento Comercial',
    description: 'Eliminação de micro-riscos',
    priceCents: 16000,
    minutes: 120,
    usage: { shampoo: 80, cera: 100 },
  },
]

const productBase: Omit<Product, 'stockMl'>[] = [
  { id: 'shampoo', name: 'Shampoo Automotivo Neutro', category: 'Química de lavagem', containerMl: 5000, fullMl: 10000, costCentsPerContainer: 6900 },
  { id: 'pretinho', name: 'Pretinho para Pneus', category: 'Acabamento', containerMl: 5000, fullMl: 5000, costCentsPerContainer: 8900 },
  { id: 'cera', name: 'Cera Líquida', category: 'Acabamento', containerMl: 5000, fullMl: 5000, costCentsPerContainer: 14900 },
  { id: 'desengraxante', name: 'Desengraxante', category: 'Química pesada', containerMl: 5000, fullMl: 5000, costCentsPerContainer: 7900 },
]

/** Dias que cada produto deve durar no estoque inicial (define os alertas da demo). */
const targetDays: Record<string, number> = { shampoo: 4, pretinho: 7, cera: 22, desengraxante: 35 }

const models: [string, string[]][] = [
  ['Chevrolet Onix', ['Branco', 'Prata', 'Preto']],
  ['Hyundai HB20', ['Vermelho', 'Branco', 'Cinza']],
  ['Volkswagen Gol', ['Prata', 'Branco']],
  ['Fiat Strada', ['Branca', 'Cinza']],
  ['Toyota Corolla', ['Preto', 'Prata']],
  ['Jeep Compass', ['Prata', 'Preto']],
  ['VW T-Cross', ['Cinza', 'Branco']],
  ['Renault Kwid', ['Branco', 'Vermelho']],
  ['Honda Civic', ['Preto', 'Prata']],
  ['Ford Ranger', ['Branca', 'Preto']],
]

// Gerador pseudoaleatório fixo: o mesmo "hoje" sempre gera os mesmos dados.
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function makePlate(rand: () => number): string {
  const letter = () => LETTERS[Math.floor(rand() * 26)]
  const digit = () => Math.floor(rand() * 10)
  return `${letter()}${letter()}${letter()}${digit()}${letter()}${digit()}${digit()}`
}

function pick<T>(rand: () => number, items: T[]): T {
  return items[Math.floor(rand() * items.length)]
}

const weights: [string, number][] = [
  ['simples', 5],
  ['completa', 4],
  ['motor', 1],
  ['higienizacao', 1],
  ['polimento', 1],
]

function pickService(rand: () => number): string {
  const total = weights.reduce((sum, [, w]) => sum + w, 0)
  let roll = rand() * total
  for (const [id, w] of weights) {
    roll -= w
    if (roll < 0) return id
  }
  return 'simples'
}

function seedFromDay(day: string): number {
  return Number(day.replaceAll('-', ''))
}

const history = (today: string): Appointment[] => {
  const rand = mulberry32(seedFromDay(today))
  const out: Appointment[] = []
  const methods: PayMethod[] = ['pix', 'pix', 'cartao', 'dinheiro']
  for (let back = 30; back >= 1; back--) {
    const date = addDays(today, -back)
    const weekday = dayOfWeek(date)
    const cars = weekday === 0 ? 3 + Math.floor(rand() * 2) : weekday === 6 ? 8 + Math.floor(rand() * 3) : 5 + Math.floor(rand() * 4)
    for (let i = 0; i < cars; i++) {
      const serviceId = pickService(rand)
      const service = services.find((s) => s.id === serviceId)!
      const [model, colors] = pick(rand, models)
      const hour = 8 + Math.floor((i * 9) / cars)
      out.push({
        id: `h-${date}-${i}`,
        plate: makePlate(rand),
        model,
        color: pick(rand, colors),
        serviceId,
        date,
        time: `${String(hour).padStart(2, '0')}:${rand() < 0.5 ? '00' : '30'}`,
        valueCents: service.priceCents,
        status: 'pago',
        payMethod: pick(rand, methods),
        finishedDate: date,
      })
    }
  }
  return out
}

interface TodaySpec {
  plate: string
  model: string
  color: string
  serviceId: string
  time: string
  status: Appointment['status']
  box?: number
  payMethod?: PayMethod
}

const todaySpecs: TodaySpec[] = [
  { plate: 'HYU8B15', model: 'Hyundai HB20', color: 'Vermelho', serviceId: 'simples', time: '08:00', status: 'pago', payMethod: 'pix' },
  { plate: 'RIO4A82', model: 'Chevrolet Onix', color: 'Branco', serviceId: 'simples', time: '09:00', status: 'pronto' },
  { plate: 'BRA2E19', model: 'Jeep Compass', color: 'Prata', serviceId: 'completa', time: '09:30', status: 'lavando', box: 1 },
  { plate: 'ABC1D23', model: 'Toyota Corolla', color: 'Preto', serviceId: 'polimento', time: '10:15', status: 'lavando', box: 2 },
  { plate: 'QWE5F67', model: 'Volkswagen Gol', color: 'Cinza', serviceId: 'simples', time: '10:45', status: 'aguardando' },
  { plate: 'PLX9J44', model: 'VW T-Cross', color: 'Cinza', serviceId: 'higienizacao', time: '11:30', status: 'aguardando' },
  { plate: 'MNB3K21', model: 'Ford Ranger', color: 'Branca', serviceId: 'completa', time: '13:00', status: 'aguardando' },
  { plate: 'DFG7H08', model: 'Hyundai Creta', color: 'Prata', serviceId: 'motor', time: '14:30', status: 'aguardando' },
]

export interface Seed {
  services: Service[]
  products: Product[]
  appointments: Appointment[]
  supplierPhone: string
  seedDate: string
}

export function buildSeed(today: string): Seed {
  const appointments = history(today)
  for (const [i, spec] of todaySpecs.entries()) {
    const service = services.find((s) => s.id === spec.serviceId)!
    appointments.push({
      id: `t-${today}-${i}`,
      plate: spec.plate,
      model: spec.model,
      color: spec.color,
      serviceId: spec.serviceId,
      date: today,
      time: spec.time,
      valueCents: service.priceCents,
      status: spec.status,
      box: spec.box,
      payMethod: spec.payMethod,
      finishedDate: spec.status === 'pronto' || spec.status === 'pago' ? today : undefined,
    })
  }
  // O estoque é calculado a partir do consumo real recente, para os alertas serem coerentes.
  const products: Product[] = productBase.map((base) => {
    const avg = averageDailyMl(appointments, services, base.id, today)
    const stockMl = Math.min(base.fullMl, Math.round((avg * targetDays[base.id] + avg * 0.4) / 10) * 10)
    return { ...base, stockMl }
  })
  return { services, products, appointments, supplierPhone: '', seedDate: today }
}
