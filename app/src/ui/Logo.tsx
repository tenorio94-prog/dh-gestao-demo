export function LogoMark({ size = 40 }: { size?: number }) {
  return <img src="/logo-mark.png" width={size} height={size} alt="" className="shrink-0" />
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      <LogoMark />
      <span className={`text-xl font-extrabold tracking-tight ${onDark ? 'text-white' : 'text-brand-deep'}`}>
        DH <span className={`font-bold ${onDark ? 'text-aqua-soft' : 'text-brand'}`}>Gestão</span>
      </span>
    </div>
  )
}
