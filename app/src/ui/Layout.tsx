import { CarFront, ChartColumn, Package, RotateCcw } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Logo } from './Logo'
import { UndoToast } from './UndoToast'

const TABS = [
  { to: '/', label: 'Hoje', Icon: CarFront },
  { to: '/estoque', label: 'Estoque', Icon: Package },
  { to: '/mes', label: 'Meu mês', Icon: ChartColumn },
]

export function Layout() {
  const reset = useStore((s) => s.reset)
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-canvas/95 px-4 py-3 backdrop-blur">
        <Logo />
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Voltar para os dados de exemplo? O que você mudou será apagado.')) reset()
          }}
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
      <UndoToast />
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
