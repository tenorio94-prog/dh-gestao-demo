import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildSeed } from '../data/seed'
import { saoPauloDay } from '../domain/dates'
import { formatBRL } from '../domain/format'
import {
  deductStock,
  finishWash as finishAppointment,
  nextFreeBox,
  payAppointment,
  startWash as startAppointment,
} from '../domain/rules'
import type { Appointment, PayMethod, Product, Service } from '../domain/types'

export interface NewAppointment {
  plate: string
  model: string
  color: string
  serviceId: string
  time: string
  valueCents: number
  customerPhone?: string
}

/** Foto do estado antes da última ação, para o botão "Desfazer". */
export interface UndoEntry {
  id: number
  message: string
  appointments: Appointment[]
  products: Product[]
}

const METHOD_LABEL: Record<PayMethod, string> = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' }

interface State {
  services: Service[]
  products: Product[]
  appointments: Appointment[]
  supplierPhone: string
  seedDate: string
  undo: UndoEntry | null
  addAppointment: (input: NewAppointment) => void
  /** false quando não há box livre. */
  startWash: (id: string) => boolean
  finishWash: (id: string) => void
  pay: (id: string, method: PayMethod) => void
  undoLast: () => void
  dismissUndo: () => void
  setStock: (productId: string, ml: number) => void
  setUsage: (serviceId: string, productId: string, ml: number) => void
  orderRestock: (productId: string, containers: number) => void
  receiveRestock: (productId: string) => void
  setSupplierPhone: (phone: string) => void
  reset: () => void
}

const fresh = () => ({ ...buildSeed(saoPauloDay()), undo: null })

const remember = (s: Pick<State, 'appointments' | 'products'>, message: string): UndoEntry => ({
  id: Date.now(),
  message,
  appointments: s.appointments,
  products: s.products,
})

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...fresh(),

      addAppointment: (input) =>
        set((s) => ({
          undo: remember(s, `${input.plate} agendado · ${formatBRL(input.valueCents)}`),
          appointments: [
            ...s.appointments,
            { ...input, id: `n-${Date.now()}`, date: saoPauloDay(), status: 'aguardando' },
          ],
        })),

      startWash: (id) => {
        const s = get()
        const target = s.appointments.find((a) => a.id === id)
        const box = nextFreeBox(s.appointments, saoPauloDay())
        if (!target || target.status !== 'aguardando' || box === null) return false
        set({
          undo: remember(s, `${target.plate} em lavagem · Box ${String(box).padStart(2, '0')}`),
          appointments: s.appointments.map((a) => (a.id === id ? startAppointment(a, box) : a)),
        })
        return true
      },

      finishWash: (id) =>
        set((s) => {
          const target = s.appointments.find((a) => a.id === id)
          if (!target || target.status !== 'lavando') return s
          const service = s.services.find((v) => v.id === target.serviceId)
          return {
            undo: remember(s, `${target.plate} pronto · estoque atualizado`),
            appointments: s.appointments.map((a) => (a.id === id ? finishAppointment(a, saoPauloDay()) : a)),
            products: service ? deductStock(s.products, service) : s.products,
          }
        }),

      pay: (id, method) =>
        set((s) => {
          const target = s.appointments.find((a) => a.id === id)
          if (!target || target.status !== 'pronto') return s
          return {
            undo: remember(s, `${target.plate} pago via ${METHOD_LABEL[method]} · ${formatBRL(target.valueCents)}`),
            appointments: s.appointments.map((a) => (a.id === id ? payAppointment(a, method) : a)),
          }
        }),

      undoLast: () =>
        set((s) => (s.undo ? { appointments: s.undo.appointments, products: s.undo.products, undo: null } : s)),

      dismissUndo: () => set({ undo: null }),

      setStock: (productId, ml) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === productId ? { ...p, stockMl: Math.max(0, Math.round(ml)) } : p)),
        })),

      setUsage: (serviceId, productId, ml) =>
        set((s) => ({
          services: s.services.map((v) => {
            if (v.id !== serviceId) return v
            const usage = { ...v.usage }
            if (ml > 0) usage[productId] = Math.round(ml)
            else delete usage[productId]
            return { ...v, usage }
          }),
        })),

      orderRestock: (productId, containers) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === productId ? { ...p, pendingOrder: { containers, date: saoPauloDay() } } : p,
          ),
        })),

      receiveRestock: (productId) =>
        set((s) => ({
          products: s.products.map((p) => {
            if (p.id !== productId || !p.pendingOrder) return p
            const { pendingOrder, ...rest } = p
            return { ...rest, stockMl: p.stockMl + pendingOrder.containers * p.containerMl }
          }),
        })),

      setSupplierPhone: (phone) => set({ supplierPhone: phone }),

      reset: () => set(fresh()),
    }),
    {
      name: 'dh-gestao.v1',
      // O "Desfazer" não sobrevive ao recarregar a página.
      partialize: ({ services, products, appointments, supplierPhone, seedDate }) => ({
        services,
        products,
        appointments,
        supplierPhone,
        seedDate,
      }),
      // Os dados de exemplo são relativos a "hoje": se o dia mudou, gera de novo.
      onRehydrateStorage: () => (state) => {
        if (state && state.seedDate !== saoPauloDay()) state.reset()
      },
    },
  ),
)
