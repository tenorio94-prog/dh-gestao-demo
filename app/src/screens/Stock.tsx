import { PackageCheck, ShoppingCart, SlidersHorizontal, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { saoPauloDay } from '../domain/dates'
import { formatLiters } from '../domain/format'
import { productStatuses, type ProductStatus } from '../domain/rules'
import type { StockLevel } from '../domain/types'
import { useStore } from '../store/useStore'
import { Button } from '../ui/Button'
import { AdjustSheet } from './AdjustSheet'
import { RestockSheet } from './RestockSheet'

const LEVEL_ORDER: Record<StockLevel, number> = { critico: 0, atencao: 1, ok: 2 }
const LEVEL_STYLE: Record<StockLevel, { chip: string; bar: string; label: string }> = {
  critico: { chip: 'bg-danger-wash text-danger', bar: 'bg-danger', label: 'Nível crítico' },
  atencao: { chip: 'bg-st-wait-wash text-st-wait', bar: 'bg-coral', label: 'Atenção' },
  ok: { chip: 'bg-st-done-wash text-st-done', bar: 'bg-aqua', label: 'Estoque ok' },
}

function daysText(days: number | null): string {
  if (days === null) return 'Sem consumo recente'
  if (days === 0) return 'Acaba hoje'
  return days === 1 ? 'Acaba em 1 dia' : `Acaba em ${days} dias`
}

export function Stock() {
  const today = saoPauloDay()
  const products = useStore((s) => s.products)
  const appointments = useStore((s) => s.appointments)
  const services = useStore((s) => s.services)
  const receiveRestock = useStore((s) => s.receiveRestock)
  const [restocking, setRestocking] = useState<string | null>(null)
  const [adjusting, setAdjusting] = useState<string | null>(null)

  const statuses = useMemo(
    () =>
      productStatuses(products, appointments, services, today).sort(
        (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || (a.days ?? 999) - (b.days ?? 999),
      ),
    [products, appointments, services, today],
  )
  const urgent = statuses.filter((s) => s.level === 'critico' && !s.product.pendingOrder).length
  const restockTarget = statuses.find((s) => s.product.id === restocking)
  const adjustTarget = statuses.find((s) => s.product.id === adjusting)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-deep">Estoque de produtos</h1>
        <p className="text-muted">Baixa automática a cada lavagem finalizada.</p>
      </div>

      {urgent > 0 && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl bg-danger-wash p-4 text-danger">
          <TriangleAlert aria-hidden="true" className="mt-0.5 shrink-0" />
          <p className="font-bold">
            {urgent === 1 ? '1 produto precisa' : `${urgent} produtos precisam`} de reposição urgente para não parar a
            operação.
          </p>
        </div>
      )}

      {statuses.length === 0 && (
        <div className="rounded-3xl bg-card p-6 text-center shadow-rest">
          <p className="text-lg font-extrabold text-brand-deep">Nenhum produto cadastrado</p>
        </div>
      )}

      <ul className="space-y-3">
        {statuses.map((s) => (
          <li key={s.product.id}>
            <ProductCard
              s={s}
              onRestock={() => setRestocking(s.product.id)}
              onAdjust={() => setAdjusting(s.product.id)}
              onReceive={() => receiveRestock(s.product.id)}
            />
          </li>
        ))}
      </ul>

      {restockTarget && <RestockSheet status={restockTarget} onClose={() => setRestocking(null)} />}
      {adjustTarget && <AdjustSheet product={adjustTarget.product} onClose={() => setAdjusting(null)} />}
    </div>
  )
}

interface CardProps {
  s: ProductStatus
  onRestock: () => void
  onAdjust: () => void
  onReceive: () => void
}

function ProductCard({ s, onRestock, onAdjust, onReceive }: CardProps) {
  const { product, level, percent, days, avgDailyMl } = s
  const style = LEVEL_STYLE[level]
  const pending = product.pendingOrder
  return (
    <article className="rounded-3xl bg-card p-4 shadow-rest ring-1 ring-line" data-level={level}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-wide text-muted">{product.category}</p>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${style.chip}`}>{daysText(days)}</span>
      </div>
      <h2 className="mt-1 text-lg font-extrabold leading-snug text-ink">{product.name}</h2>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-muted">
          {style.label} · restam {formatLiters(product.stockMl)} · {percent}%
        </span>
        <div className="shrink-0 text-right">
          <span className="text-3xl font-extrabold text-ink">{days ?? '—'}</span>
          <span className="block text-xs text-muted">
            {days === null ? 'sem consumo recente' : days === 1 ? 'dia restante' : 'dias restantes'}
          </span>
        </div>
      </div>
      <div
        className="mt-1 h-3 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Nível de ${product.name}`}
      >
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">
        Gasto médio: {Math.round(avgDailyMl)} ml por dia (últimos 7 dias).
      </p>

      {pending ? (
        <div className="mt-3 rounded-2xl bg-aqua-wash p-3">
          <p className="text-sm font-bold text-brand-deep">
            Pedido de {pending.containers} {pending.containers === 1 ? 'galão' : 'galões'} enviado em{' '}
            {pending.date.split('-').reverse().slice(0, 2).join('/')}.
          </p>
          <Button variant="brand" className="mt-2 w-full" onClick={onReceive}>
            <PackageCheck aria-hidden="true" /> Registrar chegada
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <Button variant={level === 'critico' ? 'primary' : 'brand'} big className="flex-1 whitespace-nowrap" onClick={onRestock}>
            <ShoppingCart aria-hidden="true" /> Pedir reposição
          </Button>
          <Button variant="soft" big aria-label={`Ajustar ${product.name}`} onClick={onAdjust} className="w-14 px-0">
            <SlidersHorizontal aria-hidden="true" />
          </Button>
        </div>
      )}
      {pending && (
        <Button variant="ghost" className="mt-1 w-full" onClick={onAdjust}>
          <SlidersHorizontal aria-hidden="true" /> Ajustar saldo e consumo
        </Button>
      )}
    </article>
  )
}
