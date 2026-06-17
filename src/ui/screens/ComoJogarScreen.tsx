import { Button } from '@/ui/components/Button'

interface ComoJogarScreenProps {
  onBack: () => void
}

const PASSOS: ReadonlyArray<{ titulo: string; texto: string }> = [
  {
    titulo: 'Acenda a constelacao',
    texto:
      'Sua postura de seguranca e uma constelacao que precisa acender antes do prazo. Suba o Posture Score ate o alvo do modo.',
  },
  {
    titulo: 'Jogue controles e sele evidencia',
    texto:
      'Controles dao Defesa. Selar a prova com Lacre SHA-256 vira Postura e bloqueia ataques. Prova lacrada vence o improviso.',
  },
  {
    titulo: 'Dispare o combo de crosswalk',
    texto:
      'Quando um unico controle satisfaz varios Campos de framework ao mesmo tempo, dispara o multiplicador. Avalie uma vez, prove em N normas.',
  },
  {
    titulo: 'Cuidado com o 90 Dias',
    texto:
      'O vilao reduz os Dias e ataca com Ameacas e Decadencia. A evidencia vence com o tempo, mantenha a prova fresca.',
  },
  {
    titulo: 'Demonstre',
    texto:
      'Com o alvo batido, Publicar Trust Center sela a postura e acende a constelacao inteira. Demonstrar e a arma de saida.',
  },
]

export function ComoJogarScreen({ onBack }: ComoJogarScreenProps): JSX.Element {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
      <header className="text-center">
        <h2 className="font-display text-3xl font-bold text-white">Como jogar</h2>
        <p className="mt-1 font-body text-sm text-blue500">A jornada do Guardiao em cinco passos.</p>
      </header>

      <ol className="flex flex-col gap-3">
        {PASSOS.map((passo, i) => (
          <li
            key={passo.titulo}
            className="pointer-events-auto flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <span className="font-mono text-lg font-medium text-cyan">{i + 1}</span>
            <div>
              <h3 className="font-display text-sm font-semibold text-white">{passo.titulo}</h3>
              <p className="mt-0.5 font-body text-sm text-white/70">{passo.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onBack}>
          Voltar ao menu
        </Button>
      </div>
    </div>
  )
}
