import { Banknote, CheckCircle2, MessageCircle, Play, Receipt } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatBRL, whatsappLink } from '../domain/format'
import type { Appointment } from '../domain/types'
import { Button } from '../ui/Button'
import { PlateBadge } from '../ui/PlateBadge'
import { METHOD_LABEL } from '../ui/status'
import { StatusChip } from '../ui/StatusChip'

interface Props {
  a: Appointment
  service: string
  /** No quadro do computador a coluna já diz o status; o cartão fica mais compacto. */
  column?: boolean
  onStart: () => void
  onFinish: () => void
  onCharge: () => void
}

const linkButton = (tall: boolean) =>
  `inline-flex ${tall ? 'min-h-14' : 'min-h-12'} flex-1 items-center justify-center gap-2 rounded-2xl bg-aqua-wash px-4 font-bold text-brand-deep`

export function CarCard({ a, service, column = false, onStart, onFinish, onCharge }: Props) {
  const notifyText = `Olá! Seu ${a.model} (${a.plate}) está pronto para retirada. Valor: ${formatBRL(a.valueCents)}.`
  const receiptText = `Recibo: ${service} no ${a.model} (${a.plate}), ${formatBRL(a.valueCents)}, pago via ${
    a.payMethod ? METHOD_LABEL[a.payMethod] : '—'
  }. Obrigado pela preferência!`
  const big = !column

  let action: ReactNode
  if (a.status === 'aguardando') {
    action = (
      <Button variant="brand" big={big} className="flex-1" onClick={onStart} aria-label="Iniciar lavagem">
        <Play aria-hidden="true" /> {column ? 'Iniciar' : 'Iniciar lavagem'}
      </Button>
    )
  } else if (a.status === 'lavando') {
    action = (
      <Button variant="brand" big={big} className="flex-1" onClick={onFinish}>
        <CheckCircle2 aria-hidden="true" /> Finalizar
      </Button>
    )
  } else if (a.status === 'pronto') {
    action = (
      <>
        <Button variant="primary" big={big} className="flex-1" onClick={onCharge}>
          <Banknote aria-hidden="true" /> Cobrar
        </Button>
        <a href={whatsappLink(a.customerPhone ?? '', notifyText)} target="_blank" rel="noreferrer" className={linkButton(big)}>
          <MessageCircle aria-hidden="true" /> Avisar
        </a>
      </>
    )
  } else {
    action = (
      <a href={whatsappLink(a.customerPhone ?? '', receiptText)} target="_blank" rel="noreferrer" className={linkButton(false)}>
        <Receipt aria-hidden="true" /> Enviar recibo
      </a>
    )
  }

  return (
    <article
      aria-label={`${a.plate}, ${a.model}`}
      className={`rounded-3xl bg-card shadow-rest ${column ? 'p-3' : 'p-4'} ${a.status === 'lavando' ? 'beam' : 'ring-1 ring-line'}`}
      data-status={a.status}
    >
      <div className="flex items-start justify-between gap-3">
        <PlateBadge plate={a.plate} />
        <div className="flex flex-col items-end gap-1.5">
          {!column && <StatusChip status={a.status} />}
          <span className="text-sm font-bold text-muted">
            {!column && a.box ? `Box ${String(a.box).padStart(2, '0')} · ` : ''}
            {a.time}
          </span>
          {column && a.box && (
            <span className="whitespace-nowrap rounded-full bg-aqua-wash px-2 py-0.5 text-xs font-extrabold text-brand-deep">
              Box {String(a.box).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
      <div className={`mt-3 flex justify-between gap-3 ${column ? 'flex-col' : 'items-end'}`}>
        <div className="min-w-0">
          <p className={`font-extrabold leading-snug text-ink ${column ? 'text-base' : 'text-lg'}`}>
            {a.model} {a.color}
          </p>
          <p className="text-sm font-semibold text-brand">{service}</p>
        </div>
        <div className={`shrink-0 ${column ? 'flex items-baseline gap-2' : 'text-right'}`}>
          <p className={`font-extrabold text-brand-deep ${column ? 'text-lg' : 'text-xl'}`}>{formatBRL(a.valueCents)}</p>
          {a.payMethod && <p className="text-xs font-bold text-muted">via {METHOD_LABEL[a.payMethod]}</p>}
        </div>
      </div>
      <div className={`mt-3 flex gap-2 ${column ? 'flex-col' : ''}`}>{action}</div>
    </article>
  )
}
