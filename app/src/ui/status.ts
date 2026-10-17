import type { PayMethod, Status } from '../domain/types'

export const STATUS_LABEL: Record<Status, string> = {
  aguardando: 'Aguardando',
  lavando: 'Lavando',
  pronto: 'Pronto',
  pago: 'Pago',
}

export const METHOD_LABEL: Record<PayMethod, string> = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' }

/** Cor de destaque de cada status (faixa do topo das colunas do quadro). */
export const STATUS_ACCENT: Record<Status, string> = {
  aguardando: 'border-t-[#d97706]',
  lavando: 'border-t-[#0284c7]',
  pronto: 'border-t-[#059669]',
  pago: 'border-t-[#4338ca]',
}
