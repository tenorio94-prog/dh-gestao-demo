import { Minus, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { saoPauloTime } from '../domain/dates'
import { formatBRL, formatBRLShort, isValidPlate, normalizePlate } from '../domain/format'
import { useStore } from '../store/useStore'
import { Button } from '../ui/Button'
import { PlateBadge } from '../ui/PlateBadge'
import { Sheet } from '../ui/Sheet'

const POPULAR = ['Onix', 'HB20', 'Corolla', 'Compass', 'Gol', 'Strada']
const COLORS: { name: string; swatch: string }[] = [
  { name: 'Branco', swatch: '#ffffff' },
  { name: 'Preto', swatch: '#1f2937' },
  { name: 'Prata', swatch: '#cbd5e1' },
  { name: 'Cinza', swatch: '#6b7280' },
  { name: 'Vermelho', swatch: '#dc2626' },
  { name: 'Azul', swatch: '#1d4ed8' },
]

const chip = (active: boolean) =>
  `min-h-12 rounded-full px-4 text-sm font-bold ${active ? 'bg-brand text-white' : 'bg-card text-ink-soft ring-1 ring-line'}`

export function NewAppointmentSheet({ onClose, onDone }: { onClose: () => void; onDone: (message: string) => void }) {
  const services = useStore((s) => s.services)
  const add = useStore((s) => s.addAppointment)

  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('Prata')
  const [serviceId, setServiceId] = useState(services[1]?.id ?? services[0].id)
  const [time, setTime] = useState(saoPauloTime())
  const [phone, setPhone] = useState('')
  const service = services.find((s) => s.id === serviceId)!
  const [valueCents, setValueCents] = useState(service.priceCents)
  const [touched, setTouched] = useState(false)
  const plateRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<HTMLInputElement>(null)

  const plateOk = isValidPlate(plate)
  const modelOk = model.trim().length > 0

  function chooseService(id: string) {
    setServiceId(id)
    setValueCents(services.find((s) => s.id === id)!.priceCents)
  }

  function adjust(delta: number) {
    setValueCents((v) => Math.max(0, v + delta))
  }

  function submit() {
    setTouched(true)
    if (!plateOk) return plateRef.current?.focus()
    if (!modelOk) return modelRef.current?.focus()
    add({
      plate,
      model: model.trim(),
      color,
      serviceId,
      time,
      valueCents,
      customerPhone: phone.trim() || undefined,
    })
    onDone(`${plate} agendado · ${formatBRL(valueCents)}`)
    onClose()
  }

  return (
    <Sheet title="Novo agendamento" onClose={onClose}>
      <div className="space-y-4 pb-2">
        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="plate" className="text-xs font-extrabold uppercase tracking-wide text-muted">
            1. Placa do veículo
          </label>
          <input
            id="plate"
            ref={plateRef}
            value={plate}
            onChange={(e) => setPlate(normalizePlate(e.target.value))}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="BRA2E19"
            aria-invalid={touched && !plateOk}
            aria-describedby="plate-help"
            className="mt-2 min-h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-center font-mono text-2xl font-extrabold uppercase tracking-[0.15em] focus:border-brand"
          />
          <p id="plate-help" className={`mt-2 text-sm ${touched && !plateOk ? 'font-bold text-danger' : 'text-muted'}`}>
            {touched && !plateOk ? 'Digite a placa completa, com 7 letras e números.' : 'Padrão antigo (ABC1234) ou Mercosul (ABC1D23).'}
          </p>
          {plateOk && (
            <div className="mt-2 flex justify-center">
              <PlateBadge plate={plate} large />
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="model" className="text-xs font-extrabold uppercase tracking-wide text-muted">
            2. Modelo e cor
          </label>
          <input
            id="model"
            ref={modelRef}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Ex.: Jeep Compass"
            autoComplete="off"
            aria-invalid={touched && !modelOk}
            className="mt-2 min-h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-lg font-bold focus:border-brand"
          />
          {touched && !modelOk && <p className="mt-2 text-sm font-bold text-danger">Informe o modelo do carro.</p>}
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Modelos populares">
            {POPULAR.map((name) => (
              <button key={name} type="button" onClick={() => setModel(name)} className={chip(model === name)}>
                {name}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Cor do carro">
            {COLORS.map(({ name, swatch }) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={color === name}
                onClick={() => setColor(name)}
                className={`flex min-h-12 items-center gap-2 rounded-full px-3 text-sm font-bold ${
                  color === name ? 'bg-brand text-white' : 'bg-card text-ink-soft ring-1 ring-line'
                }`}
              >
                <span className="size-5 rounded-full ring-1 ring-black/20" style={{ background: swatch }} />
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <h3 className="text-xs font-extrabold uppercase tracking-wide text-muted">3. Serviço</h3>
          <div className="mt-2 space-y-2" role="radiogroup" aria-label="Serviço">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={serviceId === s.id}
                onClick={() => chooseService(s.id)}
                className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl p-3 text-left ${
                  serviceId === s.id ? 'bg-aqua-wash ring-2 ring-brand' : 'bg-canvas ring-1 ring-line'
                }`}
              >
                <span>
                  <span className="block font-bold text-ink">{s.name}</span>
                  <span className="block text-sm text-muted">
                    {s.description} · ~{s.minutes} min
                  </span>
                </span>
                <span className="shrink-0 text-lg font-extrabold text-brand-deep">{formatBRLShort(s.priceCents)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="time" className="text-xs font-extrabold uppercase tracking-wide text-muted">
            4. Horário
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="min-h-14 flex-1 rounded-2xl border border-line bg-canvas px-4 text-lg font-bold focus:border-brand"
            />
            <button type="button" onClick={() => setTime(saoPauloTime())} className={chip(false)}>
              Agora
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <h3 className="text-xs font-extrabold uppercase tracking-wide text-muted">5. Valor cobrado</h3>
          <div className="mt-2 flex items-center justify-between rounded-2xl bg-aqua-wash p-2">
            <button
              type="button"
              aria-label="Diminuir R$ 5"
              onClick={() => adjust(-500)}
              className="grid size-14 place-items-center rounded-xl bg-card text-brand-deep shadow-rest"
            >
              <Minus />
            </button>
            <output aria-live="polite" className="text-3xl font-extrabold text-brand-deep">
              {formatBRL(valueCents)}
            </output>
            <button
              type="button"
              aria-label="Aumentar R$ 5"
              onClick={() => adjust(500)}
              className="grid size-14 place-items-center rounded-xl bg-brand text-white"
            >
              <Plus />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => adjust(-1000)} className={chip(false)}>
              − R$ 10 desconto
            </button>
            <button type="button" onClick={() => setValueCents(service.priceCents)} className={chip(false)}>
              Preço da tabela
            </button>
            <button type="button" onClick={() => adjust(1500)} className={chip(false)}>
              + R$ 15 extra
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-rest">
          <label htmlFor="phone" className="text-xs font-extrabold uppercase tracking-wide text-muted">
            6. WhatsApp do cliente (opcional)
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="off"
            placeholder="(11) 98765-4321"
            className="mt-2 min-h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-lg focus:border-brand"
          />
          <p className="mt-2 text-sm text-muted">Com o número, o botão "Avisar" já abre a conversa com o cliente.</p>
        </section>

        <div className="sticky bottom-0 -mx-5 bg-canvas/95 px-5 pb-1 pt-2">
        <Button variant="primary" big className="w-full" onClick={submit}>
          Confirmar agendamento · {formatBRL(valueCents)}
        </Button>
        </div>
      </div>
    </Sheet>
  )
}
