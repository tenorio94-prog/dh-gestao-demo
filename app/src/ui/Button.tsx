import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'brand' | 'soft' | 'ghost'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-cta text-white shadow-cta active:bg-cta-deep',
  brand: 'bg-brand text-white active:bg-brand-deep',
  soft: 'bg-aqua-wash text-brand-deep active:bg-aqua-soft/60',
  ghost: 'bg-transparent text-brand-deep active:bg-aqua-wash',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** 56 px para a ação principal do pátio; 48 px para as demais. */
  big?: boolean
}

export function Button({ variant = 'soft', big = false, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        big ? 'min-h-14' : 'min-h-12'
      } ${VARIANT[variant]} ${className}`}
    />
  )
}
