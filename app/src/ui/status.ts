import type { Status } from '../domain/types'

export const STATUS_LABEL: Record<Status, string> = {
  aguardando: 'Aguardando',
  lavando: 'Lavando',
  pronto: 'Pronto',
  pago: 'Pago',
}
