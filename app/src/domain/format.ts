import type { Cents } from './types'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBRL(cents: Cents): string {
  return brl.format(cents / 100)
}

/** Parte inteira sem centavos quando for valor redondo ("R$ 85"), útil em botões. */
export function formatBRLShort(cents: Cents): string {
  return cents % 100 === 0 ? brl.format(cents / 100).replace(/,00$/, '') : brl.format(cents / 100)
}

export function formatLiters(ml: number): string {
  const liters = ml / 1000
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(liters)} L`
}

/** Placa em maiúsculas, só letras e números, no máximo 7 caracteres. */
export function normalizePlate(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
}

/** Aceita o padrão antigo (ABC1234) e o Mercosul (ABC1D23). */
export function isValidPlate(plate: string): boolean {
  return /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(plate)
}

/** Número de WhatsApp para wa.me (só dígitos, com 55). Vazio se não parecer um telefone. */
export function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return digits
  return ''
}

export function whatsappLink(phone: string, text: string): string {
  const number = whatsappNumber(phone)
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
