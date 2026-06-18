import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string | undefined
  warning?: string | undefined
  hint?: string | undefined
  children: ReactNode
}

// Wrapper de campo: label, conteudo, e mensagem de erro ou aviso.
// Erro tem prioridade sobre aviso na exibicao.
export function Field({
  label,
  htmlFor,
  required = false,
  error,
  warning,
  hint,
  children,
}: FieldProps): JSX.Element {
  const describedBy = error ? `${htmlFor}-error` : warning ? `${htmlFor}-warning` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-body text-sm font-medium text-white/90">
        {label}
        {required ? <span className="ml-1 text-cyan">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="font-body text-xs text-white/45">{hint}</p> : null}
      {error ? (
        <p id={describedBy} role="alert" className="font-body text-xs text-danger">
          {error}
        </p>
      ) : warning ? (
        <p id={describedBy} className="font-body text-xs text-warn">
          {warning}
        </p>
      ) : null}
    </div>
  )
}

export const inputClass =
  'pointer-events-auto w-full rounded-lg border border-white/15 bg-ink/60 px-3 py-2.5 font-body text-sm text-white placeholder:text-white/30 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/60'
