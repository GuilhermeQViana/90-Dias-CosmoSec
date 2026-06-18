import { useMemo, useState } from 'react'
import { CARGOS, GENEROS, emptyGuardianForm, type GuardianForm } from '@/lead/types'
import { validateForm } from '@/lead/validation'
import { findMode, type ModeId } from '@/game/modes'
import { Button } from '@/ui/components/Button'
import { Field, inputClass } from '@/ui/components/Field'

interface CharacterCreatorScreenProps {
  modeId: ModeId
  onBack: () => void
  onStart: (form: GuardianForm) => void
}

// URL da politica de privacidade. Placeholder ate a M-03 definir a final.
const POLITICA_URL = 'https://cosmosec.com.br/privacidade'

export function CharacterCreatorScreen({
  modeId,
  onBack,
  onStart,
}: CharacterCreatorScreenProps): JSX.Element {
  const mode = findMode(modeId)
  const [form, setForm] = useState<GuardianForm>(emptyGuardianForm)
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(() => validateForm(form), [form])
  // So mostra erro depois da primeira tentativa de iniciar, para nao gritar de cara.
  const showErrors = submitted

  function update<K extends keyof GuardianForm>(key: K, value: GuardianForm[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault()
    setSubmitted(true)
    if (result.valid) {
      onStart(form)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pointer-events-auto flex w-full max-w-lg flex-col gap-5 px-6 py-10"
      noValidate
    >
      <header className="text-center">
        <h2 className="font-display text-3xl font-bold text-white">Ficha do Guardiao</h2>
        <p className="mt-1 font-body text-sm text-blue500">
          Arena: {mode.titulo}. Postura {mode.alvoPostura} em {mode.prazoDias} dias.
        </p>
      </header>

      <Field
        label="Nome do Guardiao"
        htmlFor="nome"
        required
        error={showErrors ? result.errors.nome : undefined}
      >
        <input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          className={inputClass}
          value={form.nome}
          onChange={(e) => update('nome', e.target.value)}
          placeholder="Como o Conselho deve chamar voce"
        />
      </Field>

      <Field
        label="Email corporativo"
        htmlFor="email"
        required
        error={showErrors ? result.errors.email : undefined}
        warning={showErrors ? undefined : result.warnings.email}
      >
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="voce@suaempresa.com.br"
        />
      </Field>

      <Field
        label="Cargo"
        htmlFor="cargo"
        required
        error={showErrors ? result.errors.cargo : undefined}
      >
        <select
          id="cargo"
          name="cargo"
          className={inputClass}
          value={form.cargo}
          onChange={(e) => update('cargo', e.target.value as GuardianForm['cargo'])}
        >
          <option value="" disabled>
            Selecione o seu cargo
          </option>
          {CARGOS.map((cargo) => (
            <option key={cargo} value={cargo}>
              {cargo}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Genero" htmlFor="genero" hint="Opcional. Deixe em branco se preferir nao informar.">
        <select
          id="genero"
          name="genero"
          className={inputClass}
          value={form.genero}
          onChange={(e) => update('genero', e.target.value as GuardianForm['genero'])}
        >
          <option value="">Prefiro nao informar</option>
          {GENEROS.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </select>
      </Field>

      {/* Honeypot. Escondido de humanos, atrai bots. Nunca deve ser preenchido. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Nao preencha este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="pointer-events-auto flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-cyan"
            checked={form.consentimento}
            onChange={(e) => update('consentimento', e.target.checked)}
          />
          <span className="font-body text-xs leading-relaxed text-white/75">
            Autorizo a CosmoSec a entrar em contato sobre o jogo e seus produtos. Meus dados sao
            tratados conforme a LGPD. Veja a{' '}
            <a
              href={POLITICA_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-cyan underline underline-offset-2"
            >
              politica de privacidade
            </a>
            .
          </span>
        </label>
        {showErrors && result.errors.consentimento ? (
          <p role="alert" className="font-body text-xs text-danger">
            {result.errors.consentimento}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" variant="primary" disabled={!form.consentimento}>
          Iniciar
        </Button>
      </div>
    </form>
  )
}
