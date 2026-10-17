import { Minus, Plus, Send } from 'lucide-react'
import { useState } from 'react'
import { formatBRL, formatLiters, whatsappLink } from '../domain/format'
import { restockMessage, restockTotalCents, suggestedContainers, type ProductStatus } from '../domain/rules'
import { useStore } from '../store/useStore'
import { Sheet } from '../ui/Sheet'

export function RestockSheet({ status, onClose }: { status: ProductStatus; onClose: () => void }) {
  const { product, days } = status
  const supplierPhone = useStore((s) => s.supplierPhone)
  const setSupplierPhone = useStore((s) => s.setSupplierPhone)
  const orderRestock = useStore((s) => s.orderRestock)
  const [containers, setContainers] = useState(suggestedContainers(product))

  const message = restockMessage(product, containers)
  const link = whatsappLink(supplierPhone, message)

  return (
    <Sheet title="Pedir reposição" onClose={onClose}>
      <div className="space-y-4 pb-2">
        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <p className="text-sm font-semibold text-muted">{product.category}</p>
          <h3 className="text-xl font-extrabold text-ink">{product.name}</h3>
          <p className="mt-1 text-sm text-muted">
            Restam {formatLiters(product.stockMl)}
            {days !== null && ` · acaba em ${days} ${days === 1 ? 'dia' : 'dias'}`}
          </p>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-ink">Quantidade</h3>
            <span className="rounded-full bg-aqua-wash px-3 py-1 text-xs font-extrabold text-brand-deep">
              Galão de {formatLiters(product.containerMl)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-aqua-wash p-2">
            <button
              type="button"
              aria-label="Menos um galão"
              disabled={containers <= 1}
              onClick={() => setContainers((n) => Math.max(1, n - 1))}
              className="grid size-14 place-items-center rounded-xl bg-card text-brand-deep shadow-rest disabled:opacity-40"
            >
              <Minus />
            </button>
            <output aria-live="polite" className="text-center">
              <span className="block text-3xl font-extrabold text-brand-deep">
                {containers} {containers === 1 ? 'galão' : 'galões'}
              </span>
              <span className="block text-sm text-muted">{formatLiters(containers * product.containerMl)}</span>
            </output>
            <button
              type="button"
              aria-label="Mais um galão"
              onClick={() => setContainers((n) => n + 1)}
              className="grid size-14 place-items-center rounded-xl bg-brand text-white"
            >
              <Plus />
            </button>
          </div>
          <p className="mt-3 flex items-baseline justify-between rounded-2xl bg-canvas px-4 py-3">
            <span className="font-semibold text-muted">Total estimado</span>
            <span className="text-2xl font-extrabold text-brand-deep">
              {formatBRL(restockTotalCents(product, containers))}
            </span>
          </p>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="supplier" className="font-extrabold text-ink">
            WhatsApp do fornecedor
          </label>
          <input
            id="supplier"
            value={supplierPhone}
            onChange={(e) => setSupplierPhone(e.target.value)}
            inputMode="tel"
            autoComplete="off"
            placeholder="(11) 4002-8922"
            className="mt-2 min-h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-lg focus:border-brand"
          />
          <p className="mt-2 text-sm text-muted">Sem número, o WhatsApp abre para você escolher o contato.</p>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <h3 className="text-sm font-semibold text-muted">Mensagem pronta</h3>
          <p className="mt-2 rounded-2xl bg-canvas p-3 text-ink-soft">{message}</p>
        </section>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            orderRestock(product.id, containers)
            onClose()
          }}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-base font-bold text-white active:bg-brand-deep"
        >
          <Send aria-hidden="true" /> Enviar pedido via WhatsApp
        </a>
        <p className="text-center text-sm text-muted">
          O estoque só sobe quando você tocar em “Registrar chegada”, depois que o produto chegar.
        </p>
      </div>
    </Sheet>
  )
}
