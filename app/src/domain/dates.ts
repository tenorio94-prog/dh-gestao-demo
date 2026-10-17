const TIME_ZONE = 'America/Sao_Paulo'
const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Dia civil em São Paulo ('YYYY-MM-DD'), independente do fuso do aparelho. */
export function saoPauloDay(now: Date = new Date()): string {
  return dayFormatter.format(now)
}

export function addDays(day: string, delta: number): string {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

export function monthOf(day: string): string {
  return day.slice(0, 7)
}

export function daysInMonth(month: string): number {
  const [year, mon] = month.split('-').map(Number)
  return new Date(Date.UTC(year, mon, 0)).getUTCDate()
}

export function addMonths(month: string, delta: number): string {
  const [year, mon] = month.split('-').map(Number)
  const index = year * 12 + (mon - 1) + delta
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const weekdayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']

export function monthLabel(month: string): string {
  const [year, mon] = month.split('-').map(Number)
  return `${monthNames[mon - 1]} de ${year}`
}

export function dayLabel(day: string): string {
  const date = new Date(`${day}T00:00:00Z`)
  const [, mon, dd] = day.split('-').map(Number)
  return `${weekdayNames[date.getUTCDay()]}, ${dd} de ${monthNames[mon - 1].toLowerCase()}`
}

export function dayOfWeek(day: string): number {
  return new Date(`${day}T00:00:00Z`).getUTCDay()
}

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** Hora atual em São Paulo ('HH:mm'). */
export function saoPauloTime(now: Date = new Date()): string {
  return timeFormatter.format(now)
}
