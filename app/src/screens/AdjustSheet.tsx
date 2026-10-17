import { useState } from 'react'
import type { Product } from '../domain/types'
import { useStore } from '../store/useStore'
import { Button } from '../ui/Button'
import { Sheet } from '../ui/Sheet'

/** "2,5" ou "2.5" em litros → ml inteiros; null se não for número válido. */
function litersToMl(text: string): number | null {
  const value = Number(text.replace(',', '.'))
  return text.trim() !== '' && Number.isFinite(value) && value >= 0 ? Math.round(value * 1000) : null
}

function mlToLiters(ml: number): string {
  return String(ml / 1000).replace('.', ',')
}

export function AdjustSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const services = useStore((s) => s.services)
  const setStock = useStore((s) => s.setStock)
  const setUsage = useStore((s) => s.setUsage)

  const [liters, setLiters] = useState(mlToLiters(product.stockMl))
  const [usage, setUsageDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(services.map((s) => [s.id, String(s.usage[product.id] ?? 0)])),
  )

  const ml = litersToMl(liters)
  const usageValid = Object.values(usage).every((v) => v.trim() !== '' && Number.isInteger(Number(v)) && Number(v) >= 0)
  const canSave = ml !== null && usageValid

  function save() {
    if (!canSave) return
    setStock(product.id, ml)
    for (const s of services) setUsage(s.id, product.id, Number(usage[s.id]))
    onClose()
  }

  return (
    <Sheet title="Ajustar produto" onClose={onClose}>
      <div className="space-y-4 pb-2">
        <h3 className="text-xl font-extrabold text-ink">{product.name}</h3>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="stock" className="font-extrabold text-ink">
            Saldo atual (litros)
          </label>
          <input
            id="stock"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            inputMode="decimal"
            aria-invalid={ml === null}
            className="mt-2 min-h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-2xl font-extrabold focus:border-brand"
          />
          {ml === null && <p className="mt-2 text-sm font-bold text-danger">Digite um número, como 2,5.</p>}
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <h3 className="font-extrabold text-ink">Quanto cada serviço gasta (ml)</h3>
          <ul className="mt-2 space-y-2">
            {services.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3">
                <label htmlFor={`use-${s.id}`} className="min-w-0 flex-1 text-sm font-semibold text-ink-soft">
                  {s.name}
                </label>
                <input
                  id={`use-${s.id}`}
                  value={usage[s.id]}
                  onChange={(e) => setUsageDraft((d) => ({ ...d, [s.id]: e.target.value }))}
                  inputMode="numeric"
                  className="min-h-12 w-24 rounded-xl border border-line bg-canvas px-3 text-right text-lg font-bold focus:border-brand"
                />
              </li>
            ))}
          </ul>
        </section>

        <Button variant="brand" big className="w-full" disabled={!canSave} onClick={save}>
          Salvar
        </Button>
      </div>
    </Sheet>
  )
}
