import { addDays, monthOf } from './dates'
import type { Appointment, Cents, PayMethod, Product, Service, Status, StockLevel } from './types'

export const STATUS_ORDER: Status[] = ['aguardando', 'lavando', 'pronto', 'pago']
export const CRITICAL_DAYS = 5
export const ATTENTION_DAYS = 10
export const BOX_COUNT = 3

export function nextStatus(status: Status): Status | null {
  const index = STATUS_ORDER.indexOf(status)
  return index < STATUS_ORDER.length - 1 ? STATUS_ORDER[index + 1] : null
}

/** Valor já cobrado em carros prontos ou pagos conta como "vendido". */
function isSold(a: Appointment): boolean {
  return a.status === 'pronto' || a.status === 'pago'
}

export interface DaySummary {
  count: number
  byStatus: Record<Status, number>
  expectedCents: Cents
  receivedCents: Cents
  pendingCents: Cents
}

export function daySummary(appointments: Appointment[], date: string): DaySummary {
  const byStatus: Record<Status, number> = { aguardando: 0, lavando: 0, pronto: 0, pago: 0 }
  let expectedCents = 0
  let receivedCents = 0
  let count = 0
  for (const a of appointments) {
    if (a.date !== date) continue
    count++
    byStatus[a.status]++
    expectedCents += a.valueCents
    if (a.status === 'pago') receivedCents += a.valueCents
  }
  return { count, byStatus, expectedCents, receivedCents, pendingCents: expectedCents - receivedCents }
}

export function nextFreeBox(appointments: Appointment[], date: string): number | null {
  const used = new Set(
    appointments.filter((a) => a.date === date && a.status === 'lavando' && a.box).map((a) => a.box),
  )
  for (let box = 1; box <= BOX_COUNT; box++) if (!used.has(box)) return box
  return null
}

/** Estoque que a lavagem gasta; soma por produto e nunca fica negativo. */
export function deductStock(products: Product[], service: Service): Product[] {
  return products.map((p) => {
    const used = service.usage[p.id] ?? 0
    return used ? { ...p, stockMl: Math.max(0, p.stockMl - used) } : p
  })
}

export function startWash(a: Appointment, box: number | null): Appointment {
  if (a.status !== 'aguardando') return a
  return { ...a, status: 'lavando', box: box ?? undefined }
}

export function finishWash(a: Appointment, today: string): Appointment {
  if (a.status !== 'lavando') return a
  return { ...a, status: 'pronto', finishedDate: today, box: undefined }
}

export function payAppointment(a: Appointment, method: PayMethod): Appointment {
  if (a.status !== 'pronto') return a
  return { ...a, status: 'pago', payMethod: method }
}

/** ml de um produto consumidos por lavagens prontas entre `from` e `to` (inclusive). */
export function consumedMl(
  appointments: Appointment[],
  services: Service[],
  productId: string,
  from: string,
  to: string,
): number {
  const byId = new Map(services.map((s) => [s.id, s]))
  let total = 0
  for (const a of appointments) {
    if (!a.finishedDate || a.finishedDate < from || a.finishedDate > to) continue
    total += byId.get(a.serviceId)?.usage[productId] ?? 0
  }
  return total
}

/** Média diária dos últimos 7 dias (hoje incluído). */
export function averageDailyMl(
  appointments: Appointment[],
  services: Service[],
  productId: string,
  today: string,
): number {
  return consumedMl(appointments, services, productId, addDays(today, -6), today) / 7
}

/** Dias inteiros até acabar; null quando não há consumo recente. */
export function daysRemaining(stockMl: number, avgDailyMl: number): number | null {
  if (avgDailyMl <= 0) return null
  return Math.floor(stockMl / avgDailyMl)
}

export function stockLevel(days: number | null): StockLevel {
  if (days === null) return 'ok'
  if (days <= CRITICAL_DAYS) return 'critico'
  if (days <= ATTENTION_DAYS) return 'atencao'
  return 'ok'
}

export function stockPercent(p: Product): number {
  return Math.max(0, Math.min(100, Math.round((p.stockMl / p.fullMl) * 100)))
}

export interface ProductStatus {
  product: Product
  avgDailyMl: number
  days: number | null
  level: StockLevel
  percent: number
}

export function productStatuses(
  products: Product[],
  appointments: Appointment[],
  services: Service[],
  today: string,
): ProductStatus[] {
  return products.map((product) => {
    const avgDailyMl = averageDailyMl(appointments, services, product.id, today)
    const days = daysRemaining(product.stockMl, avgDailyMl)
    return { product, avgDailyMl, days, level: stockLevel(days), percent: stockPercent(product) }
  })
}

/** Quantos galões levam o estoque de volta ao "cheio", no mínimo 1. */
export function suggestedContainers(p: Product): number {
  return Math.max(1, Math.round((p.fullMl - p.stockMl) / p.containerMl))
}

export function restockTotalCents(p: Product, containers: number): Cents {
  return p.costCentsPerContainer * containers
}

export function restockMessage(p: Product, containers: number): string {
  const litros = (p.containerMl / 1000).toString().replace('.', ',')
  return `Olá! Gostaria de pedir reposição de ${containers}x ${p.name} (galão de ${litros} L). Pode me passar o prazo de entrega?`
}

export interface MonthSummary {
  month: string
  count: number
  soldCents: Cents
  receivedCents: Cents
  receivableCents: Cents
  topServices: { serviceId: string; count: number }[]
  consumption: { productId: string; ml: number }[]
}

export function monthSummary(
  appointments: Appointment[],
  services: Service[],
  products: Product[],
  month: string,
): MonthSummary {
  const counts = new Map<string, number>()
  let count = 0
  let soldCents = 0
  let receivedCents = 0
  for (const a of appointments) {
    if (monthOf(a.date) !== month || !isSold(a)) continue
    count++
    soldCents += a.valueCents
    if (a.status === 'pago') receivedCents += a.valueCents
    counts.set(a.serviceId, (counts.get(a.serviceId) ?? 0) + 1)
  }
  const topServices = [...counts]
    .map(([serviceId, n]) => ({ serviceId, count: n }))
    .sort((x, y) => y.count - x.count || x.serviceId.localeCompare(y.serviceId))
    .slice(0, 3)
  const consumption = products.map((p) => {
    const monthDays = appointments.filter((a) => a.finishedDate && monthOf(a.finishedDate) === month)
    return {
      productId: p.id,
      ml: consumedMl(monthDays, services, p.id, `${month}-01`, `${month}-31`),
    }
  })
  return { month, count, soldCents, receivedCents, receivableCents: soldCents - receivedCents, topServices, consumption }
}
