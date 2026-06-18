import { useEffect, useMemo, useRef, useState } from 'react'
import { findMode, type ModeId } from '@/game/modes'
import {
  aplicarPolitica,
  cartasJogaveis,
  encerrarTurno,
  iniciarDuelo,
  jogarControle,
  podePublicar,
  publicarTrustCenter,
  selarComLacre,
  type EstadoJogo,
} from '@/game/engine/duelController'
import type { CartaInstancia } from '@/game/cards/types'
import { atoIndex, narrativaDoAto } from '@/game/journey/acts'
import { Stepper } from '@/ui/scenario/Stepper'
import { Gauge } from '@/ui/scenario/Gauge'
import { Constellation } from '@/ui/scenario/Constellation'
import { ScenarioCard } from '@/ui/scenario/ScenarioCard'
import { EndScreen } from '@/ui/scenario/EndScreen'
import { Wordmark } from '@/ui/components/Wordmark'
import { Button } from '@/ui/components/Button'
import { CardView } from '@/ui/journey/CardView'

interface JourneyGameProps {
  modo: ModeId
  modoLabel: string
  onConcluir: (score: number) => void
  onFalarCosmoSec: () => void
}

interface Selecao {
  uid: string
  efeito: 'lacre' | 'politica'
}

// Jogo unificado: duelo de cartas estruturado pelos cinco verbos, no visual
// cosmico. Cada ato deriva dos Dias gastos e abre com a narrativa do verbo.
export function JourneyGame({ modo, modoLabel, onConcluir, onFalarCosmoSec }: JourneyGameProps): JSX.Element {
  const [jogo, setJogo] = useState<EstadoJogo>(() => iniciarDuelo(modo))
  const [sel, setSel] = useState<Selecao | null>(null)
  const [toast, setToast] = useState('')
  const concluido = useRef(false)

  const prazo = findMode(modo).prazoDias
  const ato = atoIndex(prazo, jogo.duelo.recursos.dias)
  const narrativa = narrativaDoAto(ato)
  const r = jogo.duelo.recursos
  const acabou = jogo.duelo.resultado !== 'em-andamento'

  const jogaveis = useMemo(() => new Set(cartasJogaveis(jogo).map((c) => c.uid)), [jogo])
  const demonstrar = jogo.cartas.mao.find((c) => c.carta.efeito === 'demonstrar')
  const podePublicarTC = demonstrar ? podePublicar(jogo, demonstrar.uid) : false

  useEffect(() => {
    if (acabou && !concluido.current) {
      concluido.current = true
      onConcluir(jogo.duelo.recursos.posture)
    }
  }, [acabou, jogo.duelo.recursos.posture, onConcluir])

  function aviso(msg: string): void {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2200)
  }

  function clicarMao(inst: CartaInstancia): void {
    if (acabou) return
    const efeito = inst.carta.efeito
    if (efeito === 'lacre' || efeito === 'politica') {
      setSel((s) => (s?.uid === inst.uid ? null : { uid: inst.uid, efeito }))
      return
    }
    setSel(null)
    if (inst.carta.tipo === 'controle') {
      const novo = jogarControle(jogo, inst.uid)
      if (novo === jogo) aviso('Sem energia ou dias para esse controle.')
      else setJogo(novo)
      return
    }
    if (efeito === 'demonstrar') {
      if (podePublicar(jogo, inst.uid)) setJogo(publicarTrustCenter(jogo, inst.uid))
      else aviso('Trust Center exige o alvo de Postura batido e o ato Demonstrar.')
      return
    }
    aviso('Essa carta entra com efeito em uma proxima evolucao.')
  }

  function clicarCampo(inst: CartaInstancia): void {
    if (acabou || !sel) return
    if (sel.efeito === 'lacre') {
      if (inst.selado) return aviso('Esse controle ja esta selado.')
      const novo = selarComLacre(jogo, sel.uid, inst.uid)
      if (novo === jogo) aviso('Sem energia ou dias para selar agora.')
      else setJogo(novo)
    } else {
      if (!inst.selado) return aviso('A Politica anexa a um controle ja selado.')
      const novo = aplicarPolitica(jogo, sel.uid, inst.uid)
      if (novo === jogo) aviso('Sem recurso para a Politica agora.')
      else setJogo(novo)
    }
    setSel(null)
  }

  function encerrar(): void {
    if (acabou) return
    setSel(null)
    setJogo(encerrarTurno(jogo))
  }

  function jogarDeNovo(): void {
    concluido.current = false
    setSel(null)
    setJogo(iniciarDuelo(modo))
  }

  if (acabou) {
    return (
      <div className="pointer-events-auto w-full">
        <EndScreen
          score={r.posture}
          diasUsados={Math.max(0, prazo - r.dias)}
          modoLabel={modoLabel}
          onJogarDeNovo={jogarDeNovo}
          onFalarCosmoSec={onFalarCosmoSec}
        />
      </div>
    )
  }

  const alvoCampo = (inst: CartaInstancia): boolean =>
    sel !== null && (sel.efeito === 'lacre' ? !inst.selado : inst.selado)

  return (
    <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5">
      {/* HUD */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Wordmark variante="escuro" tamanho={18} comSimbolo />
        <div className="flex-1"><Stepper step={ato} /></div>
        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <div className="text-[10px] tracking-[0.16em] text-slate-400">AUDITORIA EM</div>
            <div className="font-display text-2xl font-bold tabular-nums text-white">
              {r.dias} <span className="text-xs font-normal text-slate-400">dias</span>
            </div>
            <div className="mt-1 text-[11px] text-blue300">
              Energia {r.energia}/{r.energiaMax} . Selados {jogo.duelo.controlesSelados}/{findMode(modo).minControlesSelados}
            </div>
          </div>
          <Gauge score={r.posture} />
        </div>
      </div>

      {/* Narrativa do ato */}
      <ScenarioCard rodada={narrativa} etapa={ato} />

      {/* Campo */}
      <div className="min-h-[160px] rounded-2xl border border-blue500/20 bg-blue900/20 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.16em] text-blue500">CAMPO</span>
          {sel ? <span className="font-mono text-[10px] text-cyan">escolha um controle alvo</span> : null}
        </div>
        {jogo.cartas.campo.length === 0 ? (
          <p className="py-6 text-center font-body text-xs text-slate-500">
            Invoque um controle da mao para o campo, depois sele com o Lacre para virar prova.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {jogo.cartas.campo.map((inst) => (
              <CardView
                key={inst.uid}
                inst={inst}
                contexto="campo"
                alvo={alvoCampo(inst)}
                onClick={sel ? () => clicarCampo(inst) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Acoes do vilao e turno */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 font-body text-[11px] leading-relaxed text-blue300">
          {jogo.ultimosEventos.length > 0 ? jogo.ultimosEventos.slice(0, 3).join(' . ') : 'O 90 Dias aguarda o seu turno.'}
        </div>
        <div className="flex items-center gap-2">
          {podePublicarTC && demonstrar ? (
            <Button variant="primary" onClick={() => clicarMao(demonstrar)}>
              Publicar Trust Center
            </Button>
          ) : null}
          <Button variant="ghost" onClick={encerrar}>
            Encerrar turno
          </Button>
        </div>
      </div>

      {toast ? <div className="text-center font-body text-xs text-warn">{toast}</div> : null}

      {/* Mao */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {jogo.cartas.mao.map((inst) => (
          <CardView
            key={inst.uid}
            inst={inst}
            contexto="mao"
            jogavel={jogaveis.has(inst.uid)}
            selecionada={sel?.uid === inst.uid}
            onClick={() => clicarMao(inst)}
          />
        ))}
      </div>

      {/* Constelacao */}
      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.16em] text-slate-500">CONSTELACAO DE POSTURE</span>
        <div className="h-7 flex-1"><Constellation score={r.posture} /></div>
      </div>
    </div>
  )
}
