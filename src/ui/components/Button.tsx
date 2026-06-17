import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const base =
  'pointer-events-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-display text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-40'

const variants: Record<Variant, string> = {
  primary:
    'bg-blue500 text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:bg-blue500/90 hover:shadow-[0_0_32px_rgba(34,211,238,0.45)]',
  ghost: 'border border-white/15 bg-white/5 text-white hover:border-cyan/50 hover:text-cyan',
}

export function Button({ variant = 'primary', children, className = '', ...rest }: ButtonProps): JSX.Element {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
