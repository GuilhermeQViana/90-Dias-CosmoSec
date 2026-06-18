import { useEffect, useRef, useState } from 'react'
import {
  continuar,
  escolher,
  estadoInicial,
  rodadaAtual,
  totalRodadas,
} from '@/game/scenario/engine'
import type { Escolha } from '@/game/scenario/types'
import { Stepper } from '@/ui/scenario/Stepper'
import { Gauge } from '@/ui/scenario/Gauge'
import { Constellation } from '@/ui/scenario/Constellation'
import { ScenarioCard } from '@/ui/scenario/ScenarioCard'
import { ChoiceCard } from '@/ui/scenario/ChoiceCard'
import { OutcomePanel } from '@/ui/scenario/OutcomePanel'
import { EndScreen } from '@/ui/scenario/EndScreen'
import { Wordmark } from '@/ui/components/Wordmark'

interface ScenarioGameProps {
  // Chamado uma vez ao concluir a campanha, para o segundo POST do lead.
  onConcluir: (score: number) => void
  onFalarCosmoSec: () => void
}

// Orquestra o jogo de cenarios: HUD, rodadas, resultado e tela final.
export function ScenarioGame({ onConcluir, onFalarCosmoSec }: ScenarioGameProps): JSX.Element {
  const [estado, setEstado] = useState(estadoInicial)
  const concluido = useRef(false)

  useEffect(() => {
    if (estado.fase === 'fim' && !concluido.current) {
      concluido.current = true
      onConcluir(estado.score)
    }
  }, [estado.fase, estado.score, onConcluir])

  function aoEscolher(e: Escolha): void {
    setEstado((s) => escolher(s, e))
  }
  function aoContinuar(): void {
    setEstado((s) => continuar(s))
  }
  function jogarDeNovo(): void {
    concluido.current = false
    setEstado(estadoInicial())
  }

  if (estado.fase === 'fim') {
    return (
      <div className="pointer-events-auto w-full">
        <EndScreen
          score={estado.score}
          diasUsados={Math.max(0, 90 - estado.days)}
          onJogarDeNovo={jogarDeNovo}
          onFalarCosmoSec={onFalarCosmoSec}
        />
      </div>
    )
  }

  const rodada = rodadaAtual(estado)
  const ultima = estado.step >= totalRodadas() - 1

  return (
    <div className="pointer-events-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-6">
      {/* HUD */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Wordmark variante="escuro" tamanho={18} comSimbolo />
        <div className="flex-1">
          <Stepper step={estado.step} />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-[0.16em] text-slate-400">AUDITORIA EM</div>
            <div className="font-display text-2xl font-bold tabular-nums text-white">
              {estado.days} <span className="font-mono text-xs font-normal text-slate-400">dias</span>
            </div>
          </div>
          <Gauge score={estado.score} />
        </div>
      </div>

      {/* Stage */}
      <div className="flex flex-col gap-4">
        {estado.fase === 'escolha' && rodada ? (
          <>
            <ScenarioCard rodada={rodada} etapa={estado.step} />
            <div className="grid gap-3.5 sm:grid-cols-3">
              {rodada.escolhas.map((e, i) => (
                <ChoiceCard key={e.id} escolha={e} index={i} onEscolher={aoEscolher} />
              ))}
            </div>
          </>
        ) : null}

        {estado.fase === 'resultado' && estado.ultimaEscolha && rodada ? (
          <OutcomePanel
            escolha={estado.ultimaEscolha}
            verbo={rodada.verbo}
            ultima={ultima}
            onContinuar={aoContinuar}
          />
        ) : null}
      </div>

      {/* Constelacao de postura */}
      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.16em] text-slate-500">
          CONSTELACAO DE POSTURE
        </span>
        <div className="h-8 flex-1">
          <Constellation score={estado.score} />
        </div>
      </div>
    </div>
  )
}
