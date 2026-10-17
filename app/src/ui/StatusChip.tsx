import type { Status } from '../domain/types'
import { STATUS_LABEL } from './status'

const STYLE: Record<Status, string> = {
  aguardando: 'bg-st-wait-wash text-st-wait',
  lavando: 'bg-st-wash-wash text-st-wash',
  pronto: 'bg-st-done-wash text-st-done',
  pago: 'bg-st-paid-wash text-st-paid',
}

export function StatusChip({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${STYLE[status]}`}>
      <span className={`size-2 rounded-full bg-current ${status === 'lavando' ? 'animate-pulse' : ''}`} />
      {STATUS_LABEL[status]}
    </span>
  )
}
