import { Check, MessageCircle, Rocket } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatLiters } from '../domain/format'
import { setupProgress, type Intent } from '../domain/onboarding'
import { contactLink } from '../landing/contact'
import { useStore } from '../store/useStore'
import { Button } from '../ui/Button'
import { Sheet } from '../ui/Sheet'
import { ProductSheet } from './ProductSheet'

const CHOICES: { intent: Intent; title: string; text: string }[] = [
  { intent: 'produto', title: 'Saber quando o produto acaba', text: 'Começa pelo estoque e pelo pedido de reposição.' },
  { intent: 'cobranca', title: 'Não deixar carro sair sem pagar', text: 'Começa pelos carros e pela cobrança.' },
  { intent: 'fila', title: 'Organizar a fila do pátio', text: 'Começa pelos carros e pelos boxes.' },
]

/** Convite para sair dos exemplos e, depois, os primeiros passos até o primeiro valor com dados reais. */
export function SetupCard({ onNewAppointment }: { onNewAppointment: () => void }) {
  const personal = useStore((s) => s.personal)
  const intent = useStore((s) => s.intent)
  const celebrated = useStore((s) => s.celebrated)
  const products = useStore((s) => s.products)
  const appointments = useStore((s) => s.appointments)
  const startPersonal = useStore((s) => s.startPersonal)
  const dismissCelebration = useStore((s) => s.dismissCelebration)
  const [choosing, setChoosing] = useState(false)
  const [addingProduct, setAddingProduct] = useState(false)

  const progress = useMemo(() => setupProgress({ intent, products, appointments }), [intent, products, appointments])

  if (!personal) {
    return (
      <>
        <section aria-labelledby="setup-title" className="rounded-3xl bg-aqua-wash p-4 ring-1 ring-line">
          <h2 id="setup-title" className="text-lg font-extrabold text-brand-deep">
            Quer ver com os dados do seu lava jato?
          </h2>
          <p className="mt-1 text-ink-soft">Troque os exemplos pelos seus em 3 passos. Leva uns 5 minutos e fica salvo neste aparelho.</p>
          <Button variant="brand" big className="mt-3 w-full sm:w-auto" onClick={() => setChoosing(true)}>
            <Rocket aria-hidden="true" /> Começar com os meus dados
          </Button>
        </section>
        {choosing && (
          <Sheet title="Começar com os meus dados" onClose={() => setChoosing(false)}>
            <div className="space-y-3 pb-2">
              <p className="text-lg font-extrabold text-ink">O que você quer resolver primeiro?</p>
              <ul className="space-y-3">
                {CHOICES.map((c) => (
                  <li key={c.intent}>
                    <button
                      type="button"
                      onClick={() => {
                        startPersonal(c.intent)
                        setChoosing(false)
                      }}
                      className="block min-h-14 w-full rounded-2xl bg-card p-4 text-left shadow-rest ring-1 ring-line hover:ring-brand"
                    >
                      <span className="block font-extrabold text-ink">{c.title}</span>
                      <span className="block text-sm text-muted">{c.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted">Os carros de exemplo saem agora. Para voltar a eles, use Restaurar.</p>
            </div>
          </Sheet>
        )}
      </>
    )
  }

  if (progress.next === null) {
    if (celebrated) return null
    const first = products[0]
    return (
      <section aria-labelledby="setup-title" className="rounded-3xl bg-st-done-wash p-4 ring-1 ring-line">
        <h2 id="setup-title" className="text-lg font-extrabold text-st-done">
          Deu certo! Agenda, cobrança e estoque funcionando com os seus dados.
        </h2>
        {first && (
          <p className="mt-1 text-ink-soft">
            Depois da lavagem, {first.name} ficou com {formatLiters(first.stockMl)}. É assim que você vê o produto acabar antes de acontecer.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={contactLink('Olá! Usei o DH Gestão com os dados do meu lava jato e quero contar como foi.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-cta px-4 font-bold text-white shadow-cta hover:bg-cta-deep"
          >
            <MessageCircle size={20} aria-hidden="true" /> Contar como foi no WhatsApp
          </a>
          <Button variant="soft" onClick={dismissCelebration}>
            Entendi
          </Button>
        </div>
      </section>
    )
  }

  const next = progress.next
  return (
    <>
      <section aria-labelledby="setup-title" className="rounded-3xl bg-aqua-wash p-4 ring-1 ring-line">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="setup-title" className="text-lg font-extrabold text-brand-deep">
            Primeiros passos
          </h2>
          <span className="text-sm font-extrabold text-brand-deep">{progress.percent}%</span>
        </div>
        <div
          className="mt-2 h-3 overflow-hidden rounded-full bg-white"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso dos primeiros passos"
        >
          <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
        <ol className="mt-3 space-y-2">
          {progress.steps.map((step) => (
            <li key={step.id} className={`flex items-center gap-3 ${step.done ? 'text-muted' : 'font-bold text-ink'}`}>
              <span
                aria-hidden="true"
                className={`grid size-6 shrink-0 place-items-center rounded-full ${step.done ? 'bg-brand text-white' : 'bg-white ring-1 ring-line'}`}
              >
                {step.done && <Check size={14} strokeWidth={3} />}
              </span>
              <span className={step.done ? 'line-through' : ''}>{step.label}</span>
              {step.done && <span className="sr-only">(feito)</span>}
            </li>
          ))}
        </ol>
        {next.id === 'produto' && (
          <Button variant="primary" big className="mt-4 w-full sm:w-auto" onClick={() => setAddingProduct(true)}>
            Cadastrar meu produto
          </Button>
        )}
        {next.id === 'carro' && (
          <Button variant="primary" big className="mt-4 w-full sm:w-auto" onClick={onNewAppointment}>
            Registrar meu primeiro carro
          </Button>
        )}
        {next.id === 'finalizar' && (
          <p className="mt-4 font-bold text-brand-deep">
            No carro, toque em Iniciar lavagem e depois em Finalizar. O estoque baixa sozinho.
          </p>
        )}
      </section>
      {addingProduct && <ProductSheet onClose={() => setAddingProduct(false)} />}
    </>
  )
}
