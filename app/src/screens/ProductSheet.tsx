import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Button } from '../ui/Button'
import { Sheet } from '../ui/Sheet'

/** "2,5" ou "2.5" → número; null se vazio ou inválido. */
function toNumber(text: string): number | null {
  const value = Number(text.replace(',', '.'))
  return text.trim() !== '' && Number.isFinite(value) && value >= 0 ? value : null
}

const field = 'mt-2 min-h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-xl font-bold focus:border-brand'

export function ProductSheet({ onClose }: { onClose: () => void }) {
  const addProduct = useStore((s) => s.addProduct)
  const [name, setName] = useState('')
  const [container, setContainer] = useState('5')
  const [stock, setStock] = useState('')
  const [price, setPrice] = useState('')
  const [usage, setUsage] = useState('100')

  const containerL = toNumber(container)
  const stockL = toNumber(stock)
  const priceReais = price.trim() === '' ? 0 : toNumber(price)
  const usageMl = toNumber(usage)
  const canSave =
    name.trim() !== '' && containerL !== null && containerL > 0 && stockL !== null && priceReais !== null && usageMl !== null && usageMl > 0

  function save() {
    if (!canSave) return
    addProduct({
      name: name.trim(),
      containerMl: Math.round(containerL * 1000),
      stockMl: Math.round(stockL * 1000),
      costCentsPerContainer: Math.round(priceReais * 100),
      usageMl: Math.round(usageMl),
    })
    onClose()
  }

  return (
    <Sheet title="Cadastrar produto" onClose={onClose}>
      <div className="space-y-4 pb-2">
        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="p-name" className="font-extrabold text-ink">
            Nome do produto
          </label>
          <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Shampoo automotivo" className={field} />
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="p-stock" className="font-extrabold text-ink">
            Quanto tem no estoque agora (litros)
          </label>
          <input id="p-stock" value={stock} onChange={(e) => setStock(e.target.value)} inputMode="decimal" placeholder="Ex.: 8,5" className={field} />
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="p-usage" className="font-extrabold text-ink">
            Quanto gasta em uma lavagem (ml)
          </label>
          <input id="p-usage" value={usage} onChange={(e) => setUsage(e.target.value)} inputMode="numeric" className={field} />
          <p className="mt-2 text-sm text-muted">Pode ser um valor aproximado. Depois você ajusta por serviço em Estoque.</p>
        </section>

        <section className="grid grid-cols-2 gap-3 rounded-2xl bg-card p-4 shadow-rest">
          <div>
            <label htmlFor="p-container" className="font-extrabold text-ink">
              Galão (litros)
            </label>
            <input id="p-container" value={container} onChange={(e) => setContainer(e.target.value)} inputMode="decimal" className={field} />
          </div>
          <div>
            <label htmlFor="p-price" className="font-extrabold text-ink">
              Preço do galão (R$)
            </label>
            <input id="p-price" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="Opcional" className={field} />
          </div>
        </section>

        <Button variant="brand" big className="w-full" disabled={!canSave} onClick={save}>
          Salvar produto
        </Button>
      </div>
    </Sheet>
  )
}
