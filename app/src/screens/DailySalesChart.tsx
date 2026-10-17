import { dayLabel, monthLabel } from '../domain/dates'
import { formatBRL } from '../domain/format'
import type { DailySale } from '../domain/rules'

export function DailySalesChart({ days }: { days: DailySale[] }) {
  const peak = days.reduce<DailySale | undefined>(
    (best, day) => !best || day.soldCents > best.soldCents ? day : best,
    undefined,
  )

  if (!peak || peak.soldCents === 0) {
    return <p className="mt-2 text-sm text-muted">Sem vendas neste mês.</p>
  }

  const month = monthLabel(peak.date.slice(0, 7))
  const peakDay = Number(peak.date.slice(8))

  return (
    <>
      <p className="mt-2 text-sm text-muted">
        Maior dia: {dayLabel(peak.date).split(', ')[1]} · {formatBRL(peak.soldCents)}
      </p>
      <div
        role="img"
        aria-label={`Vendido por dia em ${month}: maior dia ${peakDay}, ${formatBRL(peak.soldCents)}`}
        className="mt-3"
      >
        <div aria-hidden="true" className="flex h-[140px] items-end gap-px">
          {days.map((day, index) => (
            <div key={day.date} className="flex h-full min-w-0 flex-1 items-end">
              <div
                className={`w-full rounded-t-sm ${day.soldCents === 0 ? 'bg-line' : index === days.length - 1 ? 'bg-aqua' : 'bg-brand'}`}
                style={{ height: day.soldCents > 0 ? Math.max(2, day.soldCents / peak.soldCents * 140) : 1 }}
              />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="mt-1 flex gap-px text-xs text-muted">
          {days.map((day, index) => {
            const number = Number(day.date.slice(8))
            return (
              <span key={day.date} className="min-w-0 flex-1 text-center">
                {index === 0 || number % 5 === 0 ? number : '\u00a0'}
              </span>
            )
          })}
        </div>
      </div>
      <div className="sr-only"><table>
        <caption>Vendido por dia em {month}</caption>
        <thead>
          <tr>
            <th scope="col">Dia</th>
            <th scope="col">Vendido</th>
            <th scope="col">Recebido</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row">{dayLabel(day.date)}</th>
              <td>{formatBRL(day.soldCents)}</td>
              <td>{formatBRL(day.receivedCents)}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  )
}
