import type { Appointment, Product } from './types'

/** O que o dono quer resolver primeiro; define a ordem dos primeiros passos. */
export type Intent = 'produto' | 'cobranca' | 'fila'
export type StepId = 'produto' | 'carro' | 'finalizar'

export interface SetupStep {
  id: StepId
  label: string
  done: boolean
}

export interface SetupProgress {
  steps: SetupStep[]
  next: SetupStep | null
  /** Começa em 25%: abrir o app já conta como o primeiro passo. */
  percent: number
}

const LABEL: Record<StepId, string> = {
  produto: 'Cadastrar o seu produto',
  carro: 'Registrar o primeiro carro',
  finalizar: 'Finalizar uma lavagem e ver o estoque baixar',
}

const ORDER: Record<Intent, StepId[]> = {
  produto: ['produto', 'carro', 'finalizar'],
  cobranca: ['carro', 'finalizar', 'produto'],
  fila: ['carro', 'finalizar', 'produto'],
}

export function setupProgress(input: {
  intent: Intent | null
  products: Product[]
  appointments: Appointment[]
}): SetupProgress {
  const done: Record<StepId, boolean> = {
    produto: input.products.length > 0,
    carro: input.appointments.length > 0,
    finalizar: input.appointments.some((a) => a.finishedDate !== undefined),
  }
  const steps = ORDER[input.intent ?? 'produto'].map((id) => ({ id, label: LABEL[id], done: done[id] }))
  const completed = steps.filter((s) => s.done).length
  return {
    steps,
    next: steps.find((s) => !s.done) ?? null,
    percent: Math.round(((1 + completed) / (1 + steps.length)) * 100),
  }
}
