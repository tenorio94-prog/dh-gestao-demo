import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { addMonths, monthLabel, monthOf, saoPauloDay } from '../domain/dates'
import { formatBRL, formatLiters } from '../domain/format'
import { monthSummary } from '../domain/rules'
import { useStore } from '../store/useStore'

export function Month() {
  const current = monthOf(saoPauloDay())
  const [month, setMonth] = useState(current)
  const appointments = useStore((s) => s.appointments)
  const services = useStore((s) => s.services)
  const products = useStore((s) => s.products)

  const summary = useMemo(
    () => monthSummary(appointments, services, products, month),
    [appointments, services, products, month],
  )
  const name = (id: string) => services.find((s) => s.id === id)?.name ?? id
  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? id
  const prev = addMonths(month, -1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Mês anterior"
          onClick={() => setMonth(prev)}
          className="grid size-12 place-items-center rounded-full bg-card shadow-rest"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-center text-2xl font-extrabold text-brand-deep">{monthLabel(month)}</h1>
        <button
          type="button"
          aria-label="Próximo mês"
          disabled={month >= current}
          onClick={() => setMonth(addMonths(month, 1))}
          className="grid size-12 place-items-center rounded-full bg-card shadow-rest disabled:opacity-40"
        >
          <ChevronRight />
        </button>
      </div>

      {summary.count === 0 ? (
        <div className="rounded-3xl bg-card p-6 text-center shadow-rest">
          <p className="text-lg font-extrabold text-brand-deep">Nenhuma lavagem neste mês</p>
          <p className="mt-1 text-muted">Quando os carros ficarem prontos, o resumo aparece aqui.</p>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3">
            <Tile label="Recebido" value={formatBRL(summary.receivedCents)} note="só o que já foi pago" tone="green" />
            <Tile label="A receber" value={formatBRL(summary.receivableCents)} note="prontos ainda sem pagar" tone="amber" />
            <Tile label="Vendido" value={formatBRL(summary.soldCents)} note="soma dos carros prontos" />
            <Tile label="Carros" value={String(summary.count)} note="lavagens concluídas" />
          </dl>

          <section className="rounded-3xl bg-card p-4 shadow-rest ring-1 ring-line">
            <h2 className="text-lg font-extrabold text-brand-deep">O que mais sai</h2>
            <ol className="mt-2 space-y-2">
              {summary.topServices.map((t, i) => (
                <li key={t.serviceId} className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-aqua-wash text-sm font-extrabold text-brand-deep">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-semibold">{name(t.serviceId)}</span>
                  <span className="font-extrabold text-brand-deep">{t.count}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-3xl bg-card p-4 shadow-rest ring-1 ring-line">
            <h2 className="text-lg font-extrabold text-brand-deep">Produto consumido no mês</h2>
            <ul className="mt-2 space-y-2">
              {summary.consumption.map((c) => (
                <li key={c.productId} className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{productName(c.productId)}</span>
                  <span className="font-extrabold text-brand-deep">{formatLiters(c.ml)}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}

function Tile({ label, value, note, tone }: { label: string; value: string; note: string; tone?: 'green' | 'amber' }) {
  const color = tone === 'green' ? 'text-st-done' : tone === 'amber' ? 'text-st-wait' : 'text-brand-deep'
  return (
    <div className="rounded-3xl bg-card p-4 shadow-rest ring-1 ring-line">
      <dt className="text-xs font-extrabold uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`mt-1 text-2xl font-extrabold ${color}`}>
        {value}
        <span className="mt-1 block text-xs text-muted">{note}</span>
      </dd>
    </div>
  )
}
