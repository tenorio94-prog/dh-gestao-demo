import type { Appointment, PayMethod, Service, Status } from './types'

export interface Visits {
  count: number
  last: Appointment
}

/** Lavagens anteriores da mesma placa (qualquer dia); a última é a mais recente por data e hora. */
export function visitsOf(appointments: Appointment[], plate: string): Visits | null {
  const mine = appointments.filter((a) => a.plate === plate)
  if (mine.length === 0) return null
  const last = [...mine].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).at(-1)!
  return { count: mine.length, last }
}

const STATUS_TEXT: Record<Status, string> = { aguardando: 'Aguardando', lavando: 'Lavando', pronto: 'Pronto', pago: 'Pago' }
const METHOD_TEXT: Record<PayMethod, string> = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' }

const cell = (value: string) => (/[;"\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

/** Planilha para Excel em português: separador ";", valor com vírgula e BOM para os acentos. */
export function appointmentsCsv(appointments: Appointment[], services: Service[]): string {
  const rows = [['Data', 'Hora', 'Placa', 'Modelo', 'Cor', 'Serviço', 'Valor (R$)', 'Situação', 'Pagamento']]
  const sorted = [...appointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
  for (const a of sorted) {
    rows.push([
      a.date.split('-').reverse().join('/'),
      a.time,
      a.plate,
      a.model,
      a.color,
      services.find((s) => s.id === a.serviceId)?.name ?? a.serviceId,
      (a.valueCents / 100).toFixed(2).replace('.', ','),
      STATUS_TEXT[a.status],
      a.payMethod ? METHOD_TEXT[a.payMethod] : '',
    ])
  }
  return '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n') + '\r\n'
}
