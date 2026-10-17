import { Banknote, CheckCircle2, CreditCard, MessageCircle, Play, Plus, QrCode, Receipt } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { dayLabel, saoPauloDay } from '../domain/dates'
import { formatBRL, whatsappLink } from '../domain/format'
import { daySummary, priorityOrder } from '../domain/rules'
import type { Appointment, PayMethod, Status } from '../domain/types'
import { useStore } from '../store/useStore'
import { Button } from '../ui/Button'
import { PlateBadge } from '../ui/PlateBadge'
import { Money } from '../ui/Money'
import { Sheet } from '../ui/Sheet'
import { STATUS_LABEL } from '../ui/status'
import { StatusChip } from '../ui/StatusChip'
import { NewAppointmentSheet } from './NewAppointmentSheet'

type Filter = 'todos' | Status
const FILTERS: Filter[] = ['todos', 'aguardando', 'lavando', 'pronto', 'pago']
const METHOD_LABEL: Record<PayMethod, string> = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' }

export function Today() {
  const today = saoPauloDay()
  const appointments = useStore((s) => s.appointments)
  const services = useStore((s) => s.services)
  const startWash = useStore((s) => s.startWash)
  const finishWash = useStore((s) => s.finishWash)
  const pay = useStore((s) => s.pay)

  const [filter, setFilter] = useState<Filter>('todos')
  const [creating, setCreating] = useState(false)
  const [charging, setCharging] = useState<Appointment | null>(null)
  const [notice, setNotice] = useState('')

  const summary = useMemo(() => daySummary(appointments, today), [appointments, today])
  const list = useMemo(
    () =>
      appointments
        .filter((a) => a.date === today && (filter === 'todos' || a.status === filter))
        .sort(priorityOrder),
    [appointments, today, filter],
  )
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? 'Serviço'

  function say(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 4000)
  }

  function start(a: Appointment) {
    if (!startWash(a.id)) say('Os 3 boxes estão ocupados. Finalize uma lavagem antes de iniciar outra.')
  }

  function charge(method: PayMethod) {
    if (!charging) return
    pay(charging.id, method)
    setCharging(null)
  }

  return (
    <div className="space-y-4">
      <section aria-labelledby="day-title" className="relative isolate overflow-hidden rounded-3xl bg-brand-deep p-5 text-white shadow-rest">
        <Waves />
        <p className="text-sm font-bold text-aqua-soft first-letter:uppercase">{dayLabel(today)}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1 id="day-title" className="text-3xl font-extrabold">
            {summary.count} {summary.count === 1 ? 'carro' : 'carros'}
          </h1>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-aqua-soft">Previsto</p>
            <p className="text-2xl font-extrabold">
              <Money cents={summary.expectedCents} />
            </p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Recebido" value={<Money cents={summary.receivedCents} />} />
          <Stat label="A cobrar" value={<Money cents={summary.toCollectCents} />} />
          <Stat label="Em box" value={`${summary.byStatus.lavando}`} />
        </dl>
      </section>

      <Button variant="primary" big className="w-full" onClick={() => setCreating(true)}>
        <Plus aria-hidden="true" /> Novo agendamento
      </Button>

      {notice && (
        <p role="status" className="rounded-2xl bg-aqua-wash px-4 py-3 text-sm font-bold text-brand-deep">
          {notice}
        </p>
      )}

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar por status">
        {FILTERS.map((f) => {
          const count = f === 'todos' ? summary.count : summary.byStatus[f]
          return (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-bold ${
                filter === f ? 'bg-brand text-white' : 'bg-card text-ink-soft ring-1 ring-line'
              }`}
            >
              {f === 'todos' ? 'Todos' : STATUS_LABEL[f]} <span className="opacity-80">{count}</span>
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <div className="rounded-3xl bg-card p-6 text-center shadow-rest">
          <p className="text-lg font-extrabold text-brand-deep">
            {summary.count === 0 ? 'Nenhum carro hoje ainda' : 'Nenhum carro neste filtro'}
          </p>
          <p className="mt-1 text-muted">
            {summary.count === 0 ? 'Toque em "Novo agendamento" para registrar o primeiro.' : 'Escolha outro status acima.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id}>
              <CarCard
                a={a}
                service={serviceName(a.serviceId)}
                onStart={() => start(a)}
                onFinish={() => finishWash(a.id)}
                onCharge={() => setCharging(a)}
              />
            </li>
          ))}
        </ul>
      )}

      {creating && <NewAppointmentSheet onClose={() => setCreating(false)} />}
      {charging && (
        <Sheet title="Cobrar" onClose={() => setCharging(null)}>
          <div className="space-y-4 pb-2">
            <div className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-rest">
              <PlateBadge plate={charging.plate} />
              <span className="text-3xl font-extrabold text-brand-deep">{formatBRL(charging.valueCents)}</span>
            </div>
            <p className="font-bold text-ink-soft">Como o cliente pagou?</p>
            <div className="grid gap-3">
              <Button variant="brand" big onClick={() => charge('pix')}>
                <QrCode aria-hidden="true" /> Pix
              </Button>
              <Button variant="soft" big onClick={() => charge('cartao')}>
                <CreditCard aria-hidden="true" /> Cartão
              </Button>
              <Button variant="soft" big onClick={() => charge('dinheiro')}>
                <Banknote aria-hidden="true" /> Dinheiro
              </Button>
            </div>
          </div>
        </Sheet>
      )}
    </div>
  )
}

function Waves() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 120" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full w-full opacity-30">
      <path d="M0 70 C60 40 120 100 200 70 S340 40 400 70 V120 H0 Z" fill="#2ec4b6" opacity="0.35" />
      <path d="M0 90 C70 65 130 112 210 88 S340 66 400 92 V120 H0 Z" fill="#70f8e8" opacity="0.25" />
    </svg>
  )
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 px-2 py-2">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-aqua-soft">{label}</dt>
      <dd className="text-lg font-extrabold">{value}</dd>
    </div>
  )
}

interface CardProps {
  a: Appointment
  service: string
  onStart: () => void
  onFinish: () => void
  onCharge: () => void
}

function CarCard({ a, service, onStart, onFinish, onCharge }: CardProps) {
  const notifyText = `Olá! Seu ${a.model} (${a.plate}) está pronto para retirada. Valor: ${formatBRL(a.valueCents)}.`
  const receiptText = `Recibo: ${service} no ${a.model} (${a.plate}), ${formatBRL(a.valueCents)}, pago via ${
    a.payMethod ? METHOD_LABEL[a.payMethod] : '—'
  }. Obrigado pela preferência!`

  let action: ReactNode = null
  if (a.status === 'aguardando') {
    action = (
      <Button variant="brand" big className="flex-1" onClick={onStart}>
        <Play aria-hidden="true" /> Iniciar lavagem
      </Button>
    )
  } else if (a.status === 'lavando') {
    action = (
      <Button variant="brand" big className="flex-1" onClick={onFinish}>
        <CheckCircle2 aria-hidden="true" /> Finalizar
      </Button>
    )
  } else if (a.status === 'pronto') {
    action = (
      <>
        <Button variant="primary" big className="flex-1" onClick={onCharge}>
          <Banknote aria-hidden="true" /> Cobrar
        </Button>
        <a
          href={whatsappLink(a.customerPhone ?? '', notifyText)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-aqua-wash px-4 font-bold text-brand-deep"
        >
          <MessageCircle aria-hidden="true" /> Avisar
        </a>
      </>
    )
  } else {
    action = (
      <a
        href={whatsappLink(a.customerPhone ?? '', receiptText)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-aqua-wash px-4 font-bold text-brand-deep"
      >
        <Receipt aria-hidden="true" /> Enviar recibo
      </a>
    )
  }

  return (
    <article
      aria-label={`${a.plate}, ${a.model}`}
      className={`rounded-3xl bg-card p-4 shadow-rest ${a.status === 'lavando' ? 'beam' : 'ring-1 ring-line'}`}
      data-status={a.status}
    >
      <div className="flex items-start justify-between gap-3">
        <PlateBadge plate={a.plate} />
        <div className="flex flex-col items-end gap-1.5">
          <StatusChip status={a.status} />
          <span className="text-sm font-bold text-muted">
            {a.box ? `Box ${String(a.box).padStart(2, '0')} · ` : ''}
            {a.time}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-extrabold leading-snug text-ink">
            {a.model} {a.color}
          </p>
          <p className="text-sm font-semibold text-brand">{service}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-extrabold text-brand-deep">{formatBRL(a.valueCents)}</p>
          {a.payMethod && <p className="text-xs font-bold text-muted">via {METHOD_LABEL[a.payMethod]}</p>}
        </div>
      </div>
      <div className="mt-3 flex gap-2">{action}</div>
    </article>
  )
}
