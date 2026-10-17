import { Banknote, CreditCard, Plus, QrCode } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { dayLabel, saoPauloDay } from '../domain/dates'
import { formatBRL } from '../domain/format'
import { BOX_COUNT, STATUS_ORDER, daySummary, priorityOrder } from '../domain/rules'
import type { Appointment, PayMethod, Status } from '../domain/types'
import { useStore } from '../store/useStore'
import { Button } from '../ui/Button'
import { Money } from '../ui/Money'
import { PlateBadge } from '../ui/PlateBadge'
import { Sheet } from '../ui/Sheet'
import { STATUS_ACCENT, STATUS_LABEL } from '../ui/status'
import { useDesktop } from '../ui/useMediaQuery'
import { CarCard } from './CarCard'
import { NewAppointmentSheet } from './NewAppointmentSheet'

type Filter = 'todos' | Status
const FILTERS: Filter[] = ['todos', ...STATUS_ORDER]
const EMPTY_COLUMN: Record<Status, string> = {
  aguardando: 'Nenhum carro esperando',
  lavando: 'Nenhum carro nos boxes',
  pronto: 'Nada para cobrar agora',
  pago: 'Nenhum pagamento ainda',
}

export function Today() {
  const desktop = useDesktop()
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
  const todays = useMemo(() => appointments.filter((a) => a.date === today).sort(priorityOrder), [appointments, today])
  const list = filter === 'todos' ? todays : todays.filter((a) => a.status === filter)
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? 'Serviço'

  function say(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 4000)
  }

  function start(a: Appointment) {
    if (!startWash(a.id)) say(`Os ${BOX_COUNT} boxes estão ocupados. Finalize uma lavagem antes de iniciar outra.`)
  }

  function charge(method: PayMethod) {
    if (!charging) return
    pay(charging.id, method)
    setCharging(null)
  }

  const card = (a: Appointment, column = false) => (
    <CarCard
      a={a}
      column={column}
      service={serviceName(a.serviceId)}
      onStart={() => start(a)}
      onFinish={() => finishWash(a.id)}
      onCharge={() => setCharging(a)}
    />
  )

  const noticeBox = notice && (
    <p role="status" className="rounded-2xl bg-aqua-wash px-4 py-3 text-sm font-bold text-brand-deep">
      {notice}
    </p>
  )

  return (
    <>
      {desktop ? (
        <div className="space-y-6">
          <header className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-brand-deep">Hoje</h1>
              <p className="text-muted first-letter:uppercase">{dayLabel(today)}</p>
            </div>
            <Button variant="primary" big onClick={() => setCreating(true)}>
              <Plus aria-hidden="true" /> Novo agendamento
            </Button>
          </header>

          <dl className="grid grid-cols-4 gap-4">
            <Tile label="Previsto no dia" note={`${summary.count} ${summary.count === 1 ? 'carro' : 'carros'}`}>
              <Money cents={summary.expectedCents} />
            </Tile>
            <Tile label="Recebido" note="só o que já foi pago">
              <Money cents={summary.receivedCents} />
            </Tile>
            <Tile label="A cobrar" note="carros prontos sem pagamento" alert={summary.toCollectCents > 0}>
              <Money cents={summary.toCollectCents} />
            </Tile>
            <Tile label="Boxes em uso" note={`de ${BOX_COUNT} boxes`}>
              {summary.byStatus.lavando}
            </Tile>
          </dl>

          {noticeBox}

          {summary.count === 0 ? (
            <Empty title="Nenhum carro hoje ainda" text='Clique em “Novo agendamento” para registrar o primeiro.' />
          ) : (
            <div className="grid grid-cols-2 items-start gap-4 xl:grid-cols-4" role="group" aria-label="Quadro do dia">
              {STATUS_ORDER.map((status) => {
                const column = todays.filter((a) => a.status === status)
                const total = column.reduce((sum, a) => sum + a.valueCents, 0)
                return (
                  <section
                    key={status}
                    aria-label={STATUS_LABEL[status]}
                    className={`rounded-3xl border-t-4 bg-aqua-wash/70 p-3 ${STATUS_ACCENT[status]}`}
                  >
                    <header className="mb-3 flex items-baseline justify-between px-1">
                      <h2 className="text-base font-extrabold text-ink">
                        {STATUS_LABEL[status]} <span className="text-muted">{column.length}</span>
                      </h2>
                      <span className="text-sm font-bold text-muted">{formatBRL(total)}</span>
                    </header>
                    {column.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
                        {EMPTY_COLUMN[status]}
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {column.map((a) => (
                          <li key={a.id}>{card(a, true)}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <section
            aria-labelledby="day-title"
            className="relative isolate overflow-hidden rounded-3xl bg-brand-deep p-5 text-white shadow-rest"
          >
            <Waves />
            <p className="text-sm font-bold text-aqua-soft first-letter:uppercase">{dayLabel(today)}</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <h1 id="day-title" className="text-3xl font-extrabold">
                {summary.count} {summary.count === 1 ? 'carro' : 'carros'}
              </h1>
              <div className="text-right">
                <p className="text-xs font-bold text-aqua-soft">Previsto</p>
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

          {noticeBox}

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
            <Empty
              title={summary.count === 0 ? 'Nenhum carro hoje ainda' : 'Nenhum carro neste filtro'}
              text={summary.count === 0 ? 'Toque em “Novo agendamento” para registrar o primeiro.' : 'Escolha outro status acima.'}
            />
          ) : (
            <ul className="space-y-3">
              {list.map((a) => (
                <li key={a.id}>{card(a)}</li>
              ))}
            </ul>
          )}
        </div>
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
    </>
  )
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-card p-6 text-center shadow-rest">
      <p className="text-lg font-extrabold text-brand-deep">{title}</p>
      <p className="mt-1 text-muted">{text}</p>
    </div>
  )
}

function Tile({ label, note, alert = false, children }: { label: string; note: string; alert?: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-2xl bg-card p-4 shadow-rest ${alert ? 'ring-2 ring-cta' : 'ring-1 ring-line'}`}>
      <dt className="text-sm font-semibold text-muted">{label}</dt>
      <dd className={`mt-1 text-3xl font-extrabold ${alert ? 'text-cta' : 'text-brand-deep'}`}>
        {children}
        <span className="mt-1 block text-sm font-normal text-muted">{note}</span>
      </dd>
    </div>
  )
}

function Waves() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full w-full opacity-30"
    >
      <path d="M0 70 C60 40 120 100 200 70 S340 40 400 70 V120 H0 Z" fill="#2ec4b6" opacity="0.35" />
      <path d="M0 90 C70 65 130 112 210 88 S340 66 400 92 V120 H0 Z" fill="#70f8e8" opacity="0.25" />
    </svg>
  )
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 px-2 py-2">
      <dt className="text-[11px] font-bold text-aqua-soft">{label}</dt>
      <dd className="text-lg font-extrabold">{value}</dd>
    </div>
  )
}
