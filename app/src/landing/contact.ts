import { formatBRL, whatsappLink } from '../domain/format'

/** WhatsApp que recebe os pedidos de conversa vindos da landing (número público, autorizado pelo dono do projeto). */
export const CONTACT_PHONE = '81999476189'
export const CONTACT_PHONE_LABEL = '(81) 99947-6189'

export function contactLink(message: string): string {
  return whatsappLink(CONTACT_PHONE, message)
}

export const GENERIC_MESSAGE = 'Olá! Vi a demonstração do DH Gestão e quero conversar.'

/** Centavos que deixam de entrar se o produto acabar e as lavagens pararem nos dias sem produto. `ticket` em reais. */
export function revenueAtRisk(washesPerDay: number, ticket: number, daysWithoutProduct: number): number {
  return Math.round(washesPerDay * ticket * daysWithoutProduct * 100)
}

export type CalcSummary = {
  liters: number
  washes: number
  mlPerWash: number
  days: number | null
  ticket: number
  daysWithoutProduct: number
}

export function calcMessage(s: CalcSummary): string {
  const duration = s.days === null ? 'não consegui calcular a duração' : `o produto dura cerca de ${s.days} ${s.days === 1 ? 'dia' : 'dias'}`
  const risk = revenueAtRisk(s.washes, s.ticket, s.daysWithoutProduct)
  return (
    `Olá! Fiz a conta no DH Gestão: ${s.liters} L em estoque, ${s.washes} lavagens por dia e ${s.mlPerWash} ml por lavagem, ` +
    `então ${duration}. Se o produto faltar por ${s.daysWithoutProduct} ${s.daysWithoutProduct === 1 ? 'dia' : 'dias'} no mês, ` +
    `deixo de faturar cerca de ${formatBRL(risk)}. Quero conversar.`
  )
}
