import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatBRL } from '../domain/format'
import { daysRemaining, stockLevel } from '../domain/rules'
import type { StockLevel } from '../domain/types'
import { Logo } from '../ui/Logo'
import { CONTACT_PHONE_LABEL, GENERIC_MESSAGE, calcMessage, contactLink, revenueAtRisk } from './contact'

const ctaSecondary =
  'inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-4 font-bold text-white underline decoration-aqua decoration-2 underline-offset-4 hover:bg-white/10'

const cta =
  'inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-cta px-6 text-base font-bold text-white shadow-cta transition-colors hover:bg-cta-deep'

export default function Landing() {
  useEffect(() => {
    document.title = 'DH Gestão · aviso de produto acabando para lava jato'
  }, [])

  return (
    <div className="bg-canvas text-ink">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-bold"
      >
        Pular para o conteúdo
      </a>
      <Hero />
      <main id="conteudo">
        <HowItWorks />
        <Calculator />
        <TwoScreens />
        <About />
      </main>
      <footer className="bg-brand-deep px-5 py-10 text-aqua-soft">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Logo onDark />
          <div className="max-w-md space-y-2 text-sm">
            <p>Projeto experimental. Todos os dados mostrados são fictícios e ficam salvos apenas no seu navegador.</p>
            <p>
              Dúvidas ou quer testar no seu lava jato?{' '}
              <a href={contactLink(GENERIC_MESSAGE)} target="_blank" rel="noreferrer" className="font-bold text-white underline underline-offset-4">
                WhatsApp {CONTACT_PHONE_LABEL}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ---------- Abertura ---------- */

function Hero() {
  return (
    <header className="relative isolate overflow-hidden bg-brand-deep text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo onDark />
        <nav aria-label="Seções da página" className="flex items-center gap-1 sm:gap-3">
          <a href="#como-funciona" className="hidden min-h-12 items-center rounded-xl px-3 font-bold text-aqua-soft hover:bg-white/10 md:inline-flex">
            Como funciona
          </a>
          <a href="#calculadora" className="hidden min-h-12 items-center rounded-xl px-3 font-bold text-aqua-soft hover:bg-white/10 md:inline-flex">
            Calculadora
          </a>
          <Link to="/app" className="inline-flex min-h-12 items-center whitespace-nowrap rounded-xl bg-white px-4 font-bold text-brand-deep hover:bg-aqua-soft">
            <span className="sm:hidden">Ver exemplo</span>
            <span className="hidden sm:inline">Ver com carros de exemplo</span>
          </Link>
        </nav>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-28 pt-8 lg:grid-cols-[1fr_1.1fr] lg:pb-36 lg:pt-14">
        <div className="hero-in">
          <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.85rem)] font-bold leading-[1.1] tracking-tight">
            Seu lava jato fica sem produto no meio do dia? O DH Gestão avisa antes de acabar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-aqua-soft">
            Mostra quantos dias de produto ainda restam, pede a reposição ao fornecedor pelo WhatsApp e ainda controla
            a fila de carros e quanto falta cobrar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/app" className={cta}>
              Ver com carros de exemplo <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <a href={contactLink(GENERIC_MESSAGE)} target="_blank" rel="noreferrer" className={ctaSecondary}>
              <MessageCircle size={20} aria-hidden="true" /> Falar no WhatsApp
            </a>
          </div>
          <p className="mt-5 text-sm text-aqua-soft/90">
            Leva 1 minuto, direto no celular. Sem cadastro, sem login e sem custo. Os dados são de exemplo.
          </p>
        </div>

        <div className="hero-in relative mx-auto w-full max-w-xl lg:max-w-none" style={{ animationDelay: '120ms' }}>
          <BrowserFrame src="/landing/desktop-hoje.jpg" alt="Quadro do dia no computador, com os carros divididos em Aguardando, Lavando, Pronto e Pago" priority />
          <div className="absolute -bottom-10 -left-3 w-[30%] min-w-[7.5rem] sm:-left-10">
            <PhoneFrame src="/landing/mobile-hoje.jpg" alt="Lista do dia no celular, com o carro que pede ação no topo" priority />
          </div>
        </div>
      </div>

      <Waterline />
    </header>
  )
}

function Waterline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 -z-10 h-14 w-full text-canvas sm:h-20"
    >
      <path fill="currentColor" d="M0 40 C180 80 300 0 480 28 S780 78 960 38 S1280 6 1440 40 V80 H0 Z" />
    </svg>
  )
}

/* ---------- Molduras de captura de tela ---------- */

function BrowserFrame({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-white/20">
      <div className="flex items-center gap-2 border-b border-line bg-aqua-wash px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 truncate rounded-full bg-white px-3 py-0.5 text-xs text-muted">dh-gestao / app</span>
      </div>
      <img
        src={src}
        alt={alt}
        width={1440}
        height={900}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full"
      />
    </figure>
  )
}

function PhoneFrame({ src, alt, className = '', priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <figure className={`overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] ${className}`}>
      <img src={src} alt={alt} width={390} height={844} loading={priority ? 'eager' : 'lazy'} decoding="async" className="block h-auto w-full rounded-[1.1rem]" />
    </figure>
  )
}

/* ---------- Como funciona ---------- */

function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
      <h2 id="como-titulo" className="max-w-2xl font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-extrabold leading-tight tracking-tight text-brand-deep">
        Um dia de lavagens, do primeiro carro ao último galão
      </h2>

      <div className="mt-14 space-y-20 lg:space-y-28">
        <Feature
          title="Cada carro no passo certo"
          visual={<PhoneFrame src="/landing/mobile-hoje.jpg" alt="Tela Hoje no celular" className="mx-auto w-56 sm:w-64" />}
        >
          <p>
            Cadastre o carro com a placa, o serviço e o horário. Ele passa por quatro etapas: aguardando, lavando,
            pronto e pago.
          </p>
          <p>
            Os carros que pedem uma ação aparecem primeiro, e os três boxes mostram quem está sendo lavado agora. Se
            tocar sem querer, o botão Desfazer devolve tudo, até a baixa do estoque.
          </p>
        </Feature>

        <Feature
          reverse
          title="Cobrança sem esquecer ninguém"
          visual={<BrowserFrame src="/landing/desktop-hoje.jpg" alt="Quadro do dia no computador, com a coluna Pronto destacando o valor a cobrar" />}
        >
          <p>
            O valor <strong>A cobrar</strong> soma só os carros que já ficaram prontos e ainda não pagaram. É o dinheiro
            que está parado na saída do pátio.
          </p>
          <p>Registre Pix, cartão ou dinheiro, e avise o cliente ou envie o recibo pelo WhatsApp com a mensagem pronta.</p>
        </Feature>

        <Feature
          title="Produto acabando? Você vê antes"
          visual={<PhoneFrame src="/landing/mobile-estoque.jpg" alt="Tela Estoque no celular, com o número de dias restantes de cada produto" className="mx-auto w-56 sm:w-64" />}
        >
          <p>
            Cada lavagem finalizada baixa os produtos que o serviço usa. O app mostra os <strong>dias restantes</strong>{' '}
            de cada um, calculados pelo consumo dos últimos sete dias.
          </p>
          <p>Quando o nível fica crítico, o pedido de reposição sai pelo WhatsApp e o saldo só sobe quando o produto chega.</p>
        </Feature>
      </div>
    </section>
  )
}

function Feature({ title, children, visual, reverse = false }: { title: string; children: ReactNode; visual: ReactNode; reverse?: boolean }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? 'lg:order-2' : ''}>
        <h3 className="font-display text-xl font-bold leading-snug text-brand-deep sm:text-2xl">{title}</h3>
        <div className="mt-4 max-w-prose space-y-4 text-lg leading-relaxed text-ink-soft">{children}</div>
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>{visual}</div>
    </article>
  )
}

/* ---------- Calculadora ---------- */

const LEVEL_TEXT: Record<StockLevel, { label: string; hint: string; chip: string; fill: string }> = {
  critico: { label: 'Nível crítico', hint: 'Está na hora de pedir reposição.', chip: 'bg-danger-wash text-danger', fill: 'bg-danger' },
  atencao: { label: 'Atenção', hint: 'Vale pedir nos próximos dias.', chip: 'bg-st-wait-wash text-st-wait', fill: 'bg-coral' },
  ok: { label: 'Estoque tranquilo', hint: 'Dá para esperar com folga.', chip: 'bg-st-done-wash text-st-done', fill: 'bg-aqua' },
}

function Calculator() {
  const [liters, setLiters] = useState(5)
  const [washes, setWashes] = useState(12)
  const [mlPerWash, setMlPerWash] = useState(100)
  const [ticket, setTicket] = useState(60)
  const [daysWithoutProduct, setDaysWithoutProduct] = useState(2)

  const days = daysRemaining(liters * 1000, washes * mlPerWash)
  const level = stockLevel(days)
  const text = LEVEL_TEXT[level]
  // Barra proporcional a 30 dias, só para dar noção visual.
  const fill = Math.min(100, Math.round(((days ?? 0) / 30) * 100))
  const atRisk = revenueAtRisk(washes, ticket, daysWithoutProduct)
  const message = calcMessage({ liters, washes, mlPerWash, days, ticket, daysWithoutProduct })

  return (
    <section id="calculadora" aria-labelledby="calc-titulo" className="bg-aqua-wash">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
        <div>
          <h2 id="calc-titulo" className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-extrabold leading-tight tracking-tight text-brand-deep">
            Quantos dias dura o seu produto? E quanto custa se ele acabar?
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            É a conta que o DH Gestão faz por você, o tempo todo: o estoque dividido pelo gasto médio por dia. Mexa nos
            números do seu pátio e veja o alerta mudar.
          </p>
          <p className="mt-4 max-w-md text-ink-soft">
            O valor em risco abaixo é uma estimativa simples: lavagens por dia × valor da lavagem × dias parados. Os
            números são seus, o app não inventa nenhum.
          </p>
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-rest ring-1 ring-line sm:p-8">
          <div className="space-y-6">
            <Slider label="Quanto tem no estoque" unit="litros" min={0.5} max={10} step={0.5} value={liters} onChange={setLiters} />
            <Slider label="Lavagens por dia" unit="carros" min={2} max={30} step={1} value={washes} onChange={setWashes} />
            <Slider label="Gasto de produto por lavagem" unit="ml" min={40} max={250} step={10} value={mlPerWash} onChange={setMlPerWash} />
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <p className="sr-only" aria-live="polite">
              Dura {days ?? 0} {days === 1 ? 'dia' : 'dias'}. {text.label}.
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="font-display text-5xl font-extrabold leading-none text-brand-deep">
                {days ?? 0}
                <span className="ml-2 text-xl font-bold text-ink-soft">{days === 1 ? 'dia' : 'dias'}</span>
              </p>
              <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${text.chip}`}>{text.label}</span>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-line" role="presentation">
              <div className={`h-full rounded-full transition-[width] duration-300 ${text.fill}`} style={{ width: `${fill}%` }} />
            </div>
            <p className="mt-3 text-ink-soft">{text.hint}</p>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h3 className="font-display text-lg font-bold text-brand-deep">E se o produto faltar?</h3>
            <div className="mt-4 space-y-6">
              <Slider label="Valor médio de uma lavagem" unit="reais" min={20} max={300} step={5} value={ticket} onChange={setTicket} />
              <Slider label="Dias parado por mês por falta de produto" unit="dias" min={1} max={10} step={1} value={daysWithoutProduct} onChange={setDaysWithoutProduct} />
            </div>
            <p className="mt-6 text-ink-soft" aria-live="polite">
              Você deixaria de faturar cerca de
            </p>
            <p className="font-display text-4xl font-extrabold leading-tight text-danger">{formatBRL(atRisk)} <span className="text-lg font-bold text-ink-soft">por mês</span></p>
            <a href={contactLink(message)} target="_blank" rel="noreferrer" className={`${cta} mt-6 w-full sm:w-auto`}>
              <MessageCircle size={20} aria-hidden="true" /> Levar essa conta para o WhatsApp
            </a>
            <p className="mt-3 text-sm text-muted">Abre o WhatsApp com a conta já escrita. Você só envia.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Slider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  unit: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}) {
  const id = useId()
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-bold text-ink">
          {label}
        </label>
        <output htmlFor={id} className="text-lg font-extrabold text-brand-deep">
          {new Intl.NumberFormat('pt-BR').format(value)} {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-10 w-full cursor-pointer accent-brand"
      />
    </div>
  )
}

/* ---------- Celular e computador ---------- */

function TwoScreens() {
  return (
    <section aria-labelledby="telas-titulo" className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <h2 id="telas-titulo" className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-extrabold leading-tight tracking-tight text-brand-deep">
            No pátio, o celular. No escritório, a tela grande.
          </h2>
          <div className="mt-5 max-w-md space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              No celular, uma lista feita para o polegar: botões grandes, o próximo passo de cada carro e nada que
              atrapalhe com a mão molhada.
            </p>
            <p>
              No computador, um quadro com todas as etapas do dia lado a lado, um painel lateral para agendar e o resumo
              do mês com as vendas dia a dia.
            </p>
          </div>
        </div>
        <div className="relative">
          <BrowserFrame src="/landing/desktop-mes.jpg" alt="Tela Meu mês no computador, com totais, vendas por dia e serviços mais vendidos" />
          <div className="absolute -bottom-8 -right-2 w-[26%] min-w-[6.5rem] sm:-right-6">
            <PhoneFrame src="/landing/mobile-mes.jpg" alt="Meu mês no celular, com o gráfico de vendas por dia" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Sobre a demonstração ---------- */

function About() {
  const points = [
    'Todos os dados são de exemplo. Nenhum cliente real aparece.',
    'Tudo fica salvo só no seu navegador. Nada é enviado para servidor nenhum.',
    'Pode mexer à vontade. O botão Restaurar volta ao começo.',
  ]
  return (
    <section aria-labelledby="sobre-titulo" className="bg-brand-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 id="sobre-titulo" className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-extrabold leading-tight tracking-tight">
            Ainda é um experimento, e dá para testar agora
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-aqua-soft">
            O DH Gestão está em fase de ideia. Não tem login, cadastro nem planos. Abra, use como se fosse o seu pátio e
            veja se faz sentido. Quer testar com os dados do seu lava jato? Fale com a gente.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/app" className={cta}>
              Ver com carros de exemplo <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <a href={contactLink(GENERIC_MESSAGE)} target="_blank" rel="noreferrer" className={ctaSecondary}>
              <MessageCircle size={20} aria-hidden="true" /> Falar no WhatsApp
            </a>
          </div>
        </div>
        <ul className="space-y-5 self-center">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-lg">
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-aqua-soft text-brand-deep">
                <Check size={16} strokeWidth={3} aria-hidden="true" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
