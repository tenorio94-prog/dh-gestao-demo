// Dinheiro sempre em centavos inteiros. Datas como 'YYYY-MM-DD' no fuso de São Paulo.
export type Cents = number

export type Status = 'aguardando' | 'lavando' | 'pronto' | 'pago'
export type PayMethod = 'pix' | 'cartao' | 'dinheiro'

export interface Service {
  id: string
  name: string
  description: string
  priceCents: Cents
  minutes: number
  /** ml de cada produto gasto por lavagem. */
  usage: Record<string, number>
}

export interface Product {
  id: string
  name: string
  category: string
  /** Tamanho de um galão/frasco comprado. */
  containerMl: number
  /** Quantidade de estoque considerada "cheio". */
  fullMl: number
  stockMl: number
  costCentsPerContainer: Cents
  pendingOrder?: { containers: number; date: string }
}

export interface Appointment {
  id: string
  plate: string
  model: string
  color: string
  serviceId: string
  date: string
  time: string
  valueCents: Cents
  status: Status
  box?: number
  payMethod?: PayMethod
  /** Dia em que a lavagem ficou pronta; base do consumo de produto. */
  finishedDate?: string
  customerPhone?: string
}

export type StockLevel = 'critico' | 'atencao' | 'ok'
