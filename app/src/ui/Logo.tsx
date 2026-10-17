export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#006d77" />
      <path d="M32 11c-6 8.5-14 16.2-14 25a14 14 0 0 0 28 0c0-8.8-8-16.5-14-25z" fill="#70f8e8" />
      <path d="M25 38a7 7 0 0 0 7 7" fill="none" stroke="#006d77" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export function Logo() {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      <LogoMark />
      <span className="text-xl font-extrabold tracking-tight text-brand-deep">
        DH <span className="font-bold text-brand">Gestão</span>
      </span>
    </div>
  )
}
