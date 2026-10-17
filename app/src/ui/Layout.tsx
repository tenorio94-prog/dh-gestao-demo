import { ArrowLeft, CarFront, ChartColumn, Package, RotateCcw } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { saoPauloDay } from '../domain/dates'
import { daySummary, productStatuses } from '../domain/rules'
import { useStore } from '../store/useStore'
import { Logo } from './Logo'
import { UndoToast } from './UndoToast'
import { useDesktop } from './useMediaQuery'

const TABS = [
  { to: '/app', label: 'Hoje', Icon: CarFront },
  { to: '/app/estoque', label: 'Estoque', Icon: Package },
  { to: '/app/mes', label: 'Meu mês', Icon: ChartColumn },
]

const TITLES: Record<string, string> = { '/app': 'Hoje', '/app/estoque': 'Estoque', '/app/mes': 'Meu mês' }

function useRestore() {
  const reset = useStore((s) => s.reset)
  return () => {
    if (window.confirm('Voltar para os dados de exemplo? O que você mudou será apagado.')) reset()
  }
}

export function Layout() {
  const desktop = useDesktop()
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = `${TITLES[pathname.replace(/\/$/, '')] ?? 'Demonstração'} · DH Gestão`
  }, [pathname])

  return (
    <>
      {desktop ? <DesktopShell /> : <MobileShell />}
      <UndoToast />
    </>
  )
}

function MobileShell() {
  const restore = useRestore()
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-canvas/95 px-4 py-3 backdrop-blur">
        <Link to="/" aria-label="DH Gestão, página inicial">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={restore}
          className="inline-flex min-h-12 items-center gap-1.5 rounded-full bg-aqua-wash px-4 text-sm font-bold text-brand-deep"
        >
          <RotateCcw size={16} aria-hidden="true" /> Restaurar
        </button>
      </header>
      <p className="mx-4 rounded-full bg-aqua-wash px-3 py-1 text-center text-xs font-bold text-brand-deep">
        Demonstração com dados de exemplo
      </p>
      <main className="flex-1 px-4 pb-28 pt-1">
        <Outlet />
      </main>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="mx-auto flex max-w-lg gap-1 p-2">
          {TABS.map(({ to, label, Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-sm font-bold ${
                    isActive ? 'bg-aqua-wash text-brand-deep' : 'text-muted'
                  }`
                }
              >
                <Icon size={22} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function DesktopShell() {
  const restore = useRestore()
  const today = saoPauloDay()
  const appointments = useStore((s) => s.appointments)
  const products = useStore((s) => s.products)
  const services = useStore((s) => s.services)

  // Avisos na navegação: o que pede ação agora, sem precisar abrir cada tela.
  const toCollect = useMemo(() => daySummary(appointments, today).byStatus.pronto, [appointments, today])
  const critical = useMemo(
    () => productStatuses(products, appointments, services, today).filter((p) => p.level === 'critico').length,
    [products, appointments, services, today],
  )
  const badge: Record<string, number> = { '/app': toCollect, '/app/estoque': critical }

  return (
    <div className="grid min-h-dvh grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 flex h-dvh flex-col bg-brand-deep px-4 py-6 text-white">
        <Link to="/" aria-label="DH Gestão, página inicial" className="px-2">
          <Logo onDark />
        </Link>
        <nav aria-label="Navegação principal" className="mt-8">
          <ul className="space-y-1">
            {TABS.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    `flex min-h-12 items-center gap-3 rounded-2xl px-3 text-base font-bold ${
                      isActive ? 'bg-white/15 text-white' : 'text-aqua-soft hover:bg-white/10'
                    }`
                  }
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {badge[to] > 0 && (
                    <span
                      className="grid min-w-6 place-items-center rounded-full bg-coral px-1.5 text-xs font-extrabold text-ink"
                      aria-label={to === '/app' ? `${badge[to]} para cobrar` : `${badge[to]} em nível crítico`}
                    >
                      {badge[to]}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto space-y-3 rounded-2xl bg-white/10 p-4 text-sm">
          <p className="font-semibold text-aqua-soft">Demonstração com dados de exemplo, salvos só neste navegador.</p>
          <button
            type="button"
            onClick={restore}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/15 font-bold hover:bg-white/25"
          >
            <RotateCcw size={16} aria-hidden="true" /> Restaurar exemplo
          </button>
          <Link to="/" className="flex min-h-12 items-center justify-center gap-2 rounded-xl font-bold text-aqua-soft hover:bg-white/10">
            <ArrowLeft size={16} aria-hidden="true" /> Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="min-w-0 px-8 py-8">
        <div className="mx-auto max-w-[80rem]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
