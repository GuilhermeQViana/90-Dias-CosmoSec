import Phaser from 'phaser'
import { colorsHex } from '@/brand/tokens'
import { findMode, type ModeId } from '@/game/modes'
import {
  aplicarPolitica,
  encerrarTurno,
  iniciarDuelo,
  jogarControle,
  podePublicar,
  publicarTrustCenter,
  selarComLacre,
  type EstadoJogo,
} from '@/game/engine/duelController'
import type { CartaInstancia, TipoCarta } from '@/game/cards/types'

export interface DuelFim {
  resultado: 'vitoria' | 'derrota'
  posture: number
  modo: ModeId
}

export interface DuelSceneData {
  modo: ModeId
  onFim: (fim: DuelFim) => void
}

const LARGURA_CARTA = 118
const ALTURA_CARTA = 166
const RAIO = 12

// Cor de acento por tipo de carta, na paleta v2.0.
const COR_TIPO: Record<TipoCarta, number> = {
  controle: colorsHex.blue500,
  evidencia: colorsHex.cyan,
  framework: colorsHex.blue300,
  aliado: colorsHex.ok,
  jornada: colorsHex.warn,
}

// Hash curto estilo SHA-256 para a copy do selo. So estetico, em mono.
function hashCurto(semente: string): string {
  let h = 2166136261
  for (let i = 0; i < semente.length; i += 1) {
    h ^= semente.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const hex = (h >>> 0).toString(16).padStart(8, '0')
  return `${hex}${hex.split('').reverse().join('').slice(0, 4)}`
}

// Cena de duelo com a direcao de marca v2.0 e juice: invocar, selar com anel
// ciano e hash, combo de crosswalk, screen shake no ataque do vilao.
export class DuelScene extends Phaser.Scene {
  private estado!: EstadoJogo
  private modo!: ModeId
  private onFim!: (fim: DuelFim) => void

  private camadaCampo!: Phaser.GameObjects.Container
  private camadaMao!: Phaser.GameObjects.Container
  private camadaFx!: Phaser.GameObjects.Container
  private cartasCampo: Array<{ uid: string; obj: Phaser.GameObjects.Container }> = []
  private zonaCampo!: Phaser.Geom.Rectangle

  private hudDias!: Phaser.GameObjects.Text
  private hudPosture!: Phaser.GameObjects.Text
  private hudEnergia!: Phaser.GameObjects.Text
  private hudTurno!: Phaser.GameObjects.Text
  private barraPosture!: Phaser.GameObjects.Rectangle
  private barraFundo!: Phaser.GameObjects.Rectangle
  private ampulheta!: Phaser.GameObjects.Container
  private pulseTween?: Phaser.Tweens.Tween
  private eventosTxt!: Phaser.GameObjects.Text
  private toast!: Phaser.GameObjects.Text
  private encerrado = false

  constructor() {
    super('Duel')
  }

  init(data: DuelSceneData): void {
    this.modo = data.modo
    this.onFim = data.onFim
    this.estado = iniciarDuelo(data.modo)
    this.encerrado = false
    this.cartasCampo = []
  }

  create(): void {
    this.cameras.main.setBackgroundColor(colorsHex.ink)
    this.desenharFundo()
    this.montarHud()

    this.camadaCampo = this.add.container(0, 0)
    this.camadaMao = this.add.container(0, 0)
    this.camadaFx = this.add.container(0, 0)

    this.configurarArraste()
    this.scale.on('resize', this.renderizar, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.renderizar, this))

    this.renderizar()
  }

  // Fundo deep-space com glow radial e grid sutil.
  private desenharFundo(): void {
    const { width, height } = this.scale
    const g = this.add.graphics()
    g.fillStyle(colorsHex.blue900, 0.5)
    g.fillCircle(width / 2, -height * 0.2, width * 0.9)
    g.lineStyle(1, colorsHex.blue500, 0.05)
    for (let x = 0; x < width; x += 48) g.lineBetween(x, 0, x, height)
    for (let y = 0; y < height; y += 48) g.lineBetween(0, y, width, y)
  }

  private montarHud(): void {
    const mode = findMode(this.modo)
    this.add.text(58, 18, `Arena: ${mode.titulo}`, {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '15px',
      color: '#F6F8FB',
    })
    // Marca do simbolo no canto.
    this.desenharSimbolo(30, 30, 16)

    this.hudTurno = this.add.text(58, 40, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      color: '#8FCBFF',
    })

    this.hudDias = this.add.text(0, 18, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '20px',
      color: '#22D3EE',
    })
    this.hudEnergia = this.add.text(0, 46, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: '#3B82F6',
    })

    this.add.text(58, 70, 'POSTURE', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      color: '#8FCBFF',
    })
    this.barraFundo = this.add.rectangle(58, 90, 230, 12, colorsHex.blue900).setOrigin(0, 0.5)
    this.barraFundo.setStrokeStyle(1, colorsHex.line, 0.15)
    this.barraPosture = this.add.rectangle(58, 90, 0, 12, colorsHex.cyan).setOrigin(0, 0.5)
    this.hudPosture = this.add.text(296, 84, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: '#F6F8FB',
    })

    this.criarAmpulheta()

    this.eventosTxt = this.add.text(58, 110, '', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      color: '#8FCBFF',
      lineSpacing: 3,
      wordWrap: { width: 280 },
    })

    this.criarBotao('Encerrar turno', () => this.aoEncerrarTurno())

    this.toast = this.add
      .text(0, 0, '', { fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F59E0B' })
      .setOrigin(0.5)
      .setAlpha(0)
  }

  private desenharSimbolo(cx: number, cy: number, r: number): void {
    const g = this.add.graphics({ x: cx, y: cy })
    g.lineStyle(2, colorsHex.cyan, 0.6)
    g.strokeCircle(0, 0, r)
    g.fillStyle(colorsHex.blue500, 1)
    const pts: Phaser.Types.Math.Vector2Like[] = []
    for (let i = 0; i < 12; i += 1) {
      const ang = (Math.PI / 6) * i - Math.PI / 2
      const rad = i % 2 === 0 ? r * 0.7 : r * 0.3
      pts.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad })
    }
    g.fillPoints(pts as Phaser.Geom.Point[], true)
    g.fillStyle(colorsHex.white, 1)
    g.fillCircle(0, 0, r * 0.14)
  }

  private criarBotao(rotulo: string, aoClicar: () => void): void {
    const largura = 156
    const altura = 42
    const x = this.scale.width - largura - 24
    const y = this.scale.height - altura - 22
    const g = this.add.graphics({ x, y })
    g.fillStyle(colorsHex.blue500, 1)
    g.fillRoundedRect(0, 0, largura, altura, 10)
    g.lineStyle(1, colorsHex.cyan, 0.5)
    g.strokeRoundedRect(0, 0, largura, altura, 10)
    g.setInteractive(new Phaser.Geom.Rectangle(0, 0, largura, altura), Phaser.Geom.Rectangle.Contains)
    g.on('pointerover', () => this.input.setDefaultCursor('pointer'))
    g.on('pointerout', () => this.input.setDefaultCursor('default'))
    g.on('pointerdown', aoClicar)
    this.add
      .text(x + largura / 2, y + altura / 2, rotulo, {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '13px',
        color: '#F6F8FB',
      })
      .setOrigin(0.5)
  }

  private criarAmpulheta(): void {
    const halo = this.add.circle(0, 0, 30, colorsHex.blue500, 0.12)
    const topo = this.add
      .triangle(0, 0, 0, -22, 22, 22, -22, 22, colorsHex.blue700, 0.5)
      .setStrokeStyle(2, colorsHex.cyan, 0.9)
    const base = this.add
      .triangle(0, 0, 0, 22, 22, -22, -22, -22, colorsHex.blue700, 0.5)
      .setStrokeStyle(2, colorsHex.cyan, 0.9)
    this.ampulheta = this.add.container(this.scale.width / 2, 50, [halo, topo, base])
    this.pulseTween = this.tweens.add({
      targets: this.ampulheta,
      scaleX: 1.08,
      scaleY: 0.92,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  private atualizarAmpulheta(dias: number): void {
    this.ampulheta.setX(this.scale.width / 2)
    if (this.pulseTween) {
      this.pulseTween.timeScale = dias < 20 ? 2.4 : dias < 40 ? 1.6 : 1
    }
  }

  // ----- Render -----

  private renderizar(): void {
    const { width, height } = this.scale
    const mode = findMode(this.modo)
    const r = this.estado.duelo.recursos

    this.hudTurno.setText(`Turno ${this.estado.duelo.turno} . Selados ${this.estado.duelo.controlesSelados}/${mode.minControlesSelados}`)
    this.hudDias.setText(`${r.dias} dias`).setPosition(width - this.hudDias.width - 24, 18)
    this.hudDias.setColor(r.dias < 20 ? '#EF4444' : r.dias < 40 ? '#F59E0B' : '#22D3EE')
    this.hudEnergia.setText(`Energia ${r.energia}/${r.energiaMax}`).setPosition(width - 156, 48)
    this.hudPosture.setText(`${r.posture}/${mode.alvoPostura}`)

    const frac = Phaser.Math.Clamp(r.posture / 100, 0, 1)
    this.barraPosture.width = 230 * frac
    const corBarra = r.posture >= mode.alvoPostura ? colorsHex.ok : r.posture < 20 ? colorsHex.warn : colorsHex.cyan
    this.barraPosture.setFillStyle(corBarra)

    this.atualizarAmpulheta(r.dias)

    this.zonaCampo = new Phaser.Geom.Rectangle(width * 0.08, height * 0.34, width * 0.84, height * 0.3)
    this.desenharCampo()
    this.desenharMao()
  }

  private desenharCampo(): void {
    this.camadaCampo.removeAll(true)
    this.cartasCampo = []

    const g = this.add.graphics()
    g.lineStyle(1, colorsHex.blue500, 0.25)
    g.strokeRoundedRect(this.zonaCampo.x, this.zonaCampo.y, this.zonaCampo.width, this.zonaCampo.height, 14)
    this.camadaCampo.add(g)
    const rotulo = this.add.text(this.zonaCampo.x + 12, this.zonaCampo.y + 8, 'CAMPO', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      color: '#1A3A8C',
    })
    this.camadaCampo.add(rotulo)

    const y = this.zonaCampo.y + this.zonaCampo.height / 2 - ALTURA_CARTA / 2
    const inicioX = this.zonaCampo.x + 24
    this.estado.cartas.campo.forEach((inst, i) => {
      const x = inicioX + i * (LARGURA_CARTA + 16)
      const obj = this.criarCarta(inst, x, y)
      this.camadaCampo.add(obj)
      this.cartasCampo.push({ uid: inst.uid, obj })
    })
  }

  private desenharMao(): void {
    this.camadaMao.removeAll(true)
    const { width, height } = this.scale
    const mao = this.estado.cartas.mao
    const total = mao.length
    const espaco = Math.min(LARGURA_CARTA + 14, (width - 80) / Math.max(total, 1))
    const inicioX = width / 2 - (espaco * (total - 1)) / 2 - LARGURA_CARTA / 2
    const y = height - ALTURA_CARTA - 14

    mao.forEach((inst, i) => {
      const x = inicioX + i * espaco
      const obj = this.criarCarta(inst, x, y)
      obj.setData('origemX', x)
      obj.setData('origemY', y)
      obj.setData('uid', inst.uid)
      obj.setData('efeito', inst.carta.efeito)
      obj.setData('tipo', inst.carta.tipo)
      obj.setSize(LARGURA_CARTA, ALTURA_CARTA)
      obj.setInteractive(
        new Phaser.Geom.Rectangle(LARGURA_CARTA / 2, ALTURA_CARTA / 2, LARGURA_CARTA, ALTURA_CARTA),
        Phaser.Geom.Rectangle.Contains,
      )
      this.input.setDraggable(obj)
      this.camadaMao.add(obj)
    })
  }

  private criarCarta(inst: CartaInstancia, x: number, y: number): Phaser.GameObjects.Container {
    const cont = this.add.container(x, y)
    const corTipo = COR_TIPO[inst.carta.tipo]
    const g = this.add.graphics()

    // Fundo arredondado.
    g.fillStyle(colorsHex.blue900, 0.97)
    g.fillRoundedRect(0, 0, LARGURA_CARTA, ALTURA_CARTA, RAIO)
    // Faixa de tipo no topo.
    g.fillStyle(corTipo, inst.selado ? 1 : 0.85)
    g.fillRoundedRect(0, 0, LARGURA_CARTA, 6, { tl: RAIO, tr: RAIO, bl: 0, br: 0 })
    // Borda. Selado ganha contorno ciano forte.
    g.lineStyle(inst.selado ? 2 : 1, inst.selado ? colorsHex.cyan : corTipo, inst.selado ? 0.95 : 0.5)
    g.strokeRoundedRect(0, 0, LARGURA_CARTA, ALTURA_CARTA, RAIO)
    cont.add(g)

    cont.add(
      this.add.text(9, 14, inst.carta.nome, {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '12px',
        color: '#F6F8FB',
        wordWrap: { width: LARGURA_CARTA - 18 },
      }),
    )
    cont.add(
      this.add.text(9, ALTURA_CARTA - 38, `E ${inst.carta.custoEnergia}   D ${inst.carta.custoDias}`, {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        color: '#22D3EE',
      }),
    )
    cont.add(
      this.add.text(9, ALTURA_CARTA - 21, inst.carta.tipo, {
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        color: '#8FCBFF',
      }),
    )

    if (inst.carta.tipo === 'controle') {
      cont.add(
        this.add.text(LARGURA_CARTA - 36, 14, `Def ${inst.carta.defesa}`, {
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: '#3B82F6',
        }),
      )
      // Pontinhos de cobertura de normas (combo de crosswalk visivel).
      inst.carta.cobertura.forEach((_, k) => {
        cont.add(this.add.circle(12 + k * 9, ALTURA_CARTA / 2 + 10, 3, colorsHex.cyan, 0.9))
      })
    }
    if (inst.selado) {
      cont.add(
        this.add.text(9, ALTURA_CARTA / 2 - 8, hashCurto(inst.uid), {
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px',
          color: '#22D3EE',
        }),
      )
    }
    return cont
  }

  // ----- Efeitos (juice) -----

  private efeitoInvocar(x: number, y: number): void {
    const flash = this.add.circle(x + LARGURA_CARTA / 2, y + ALTURA_CARTA / 2, 12, colorsHex.white, 0.8)
    this.camadaFx.add(flash)
    this.tweens.add({
      targets: flash,
      scale: 5,
      alpha: 0,
      duration: 320,
      ease: 'Cubic.out',
      onComplete: () => flash.destroy(),
    })
  }

  private efeitoSelar(obj: Phaser.GameObjects.Container, inst: CartaInstancia): void {
    const cx = obj.x + LARGURA_CARTA / 2
    const cy = obj.y + ALTURA_CARTA / 2
    const anel = this.add.circle(cx, cy, ALTURA_CARTA / 2, undefined, 0).setStrokeStyle(3, colorsHex.cyan, 1)
    this.camadaFx.add(anel)
    anel.setScale(1.3)
    this.tweens.add({ targets: anel, scale: 0.9, alpha: 0, duration: 500, ease: 'Cubic.out', onComplete: () => anel.destroy() })

    const bloom = this.add.circle(cx, cy, 20, colorsHex.cyan, 0.5)
    this.camadaFx.add(bloom)
    this.tweens.add({ targets: bloom, scale: 3, alpha: 0, duration: 600, onComplete: () => bloom.destroy() })

    // Combo de crosswalk: o controle cobre varias normas de uma vez.
    const n = inst.carta.cobertura.length
    if (n >= 2) {
      this.cameras.main.shake(180, 0.004)
      const txt = this.add
        .text(cx, cy - ALTURA_CARTA / 2 - 16, `Crosswalk x${n}`, {
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '20px',
          color: '#22D3EE',
        })
        .setOrigin(0.5)
        .setScale(0.6)
      this.camadaFx.add(txt)
      this.tweens.add({ targets: txt, scale: 1.1, duration: 260, yoyo: true, hold: 320, onComplete: () => txt.destroy() })
    }
  }

  private efeitoAtaqueVilao(): void {
    this.cameras.main.shake(260, 0.006)
    const flash = this.add.rectangle(0, 0, this.scale.width, this.scale.height, colorsHex.danger, 0.16).setOrigin(0, 0)
    this.camadaFx.add(flash)
    this.tweens.add({ targets: flash, alpha: 0, duration: 380, onComplete: () => flash.destroy() })
  }

  private mostrarToast(msg: string): void {
    this.toast.setText(msg).setPosition(this.scale.width / 2, this.scale.height * 0.46).setAlpha(1)
    this.tweens.add({ targets: this.toast, alpha: 0, duration: 1600, delay: 600 })
  }

  // ----- Arraste -----

  private configurarArraste(): void {
    this.input.on('dragstart', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container) => {
      this.camadaMao.bringToTop(obj)
      obj.setScale(1.05)
    })
    this.input.on('drag', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container, dx: number, dy: number) => {
      obj.setPosition(dx, dy)
    })
    this.input.on('dragend', (p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container) => {
      obj.setScale(1)
      this.resolverSolta(p, obj)
    })
  }

  private controleSob(p: Phaser.Input.Pointer): string | null {
    for (const { uid, obj } of this.cartasCampo) {
      if (obj.getBounds().contains(p.x, p.y)) return uid
    }
    return null
  }

  private resolverSolta(p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container): void {
    const uid = obj.getData('uid') as string
    const efeito = obj.getData('efeito') as string
    const tipo = obj.getData('tipo') as string
    const noCampo = Phaser.Geom.Rectangle.Contains(this.zonaCampo, p.x, p.y)

    let novo = this.estado
    let acao: 'invocar' | 'selar' | 'nada' = 'nada'
    let alvoSelado: string | null = null

    if (tipo === 'controle' && noCampo) {
      novo = jogarControle(this.estado, uid)
      if (novo !== this.estado) acao = 'invocar'
      else this.mostrarToast('Sem energia ou dias para esse controle.')
    } else if (efeito === 'lacre') {
      const alvo = this.controleSob(p)
      if (alvo) {
        novo = selarComLacre(this.estado, uid, alvo)
        if (novo !== this.estado) {
          acao = 'selar'
          alvoSelado = alvo
        } else this.mostrarToast('Nao deu para selar. Cheque energia, dias ou se ja esta selado.')
      } else this.mostrarToast('Solte o Lacre sobre um controle em campo.')
    } else if (efeito === 'politica') {
      const alvo = this.controleSob(p)
      if (alvo) {
        novo = aplicarPolitica(this.estado, uid, alvo)
        if (novo !== this.estado) acao = 'invocar'
        else this.mostrarToast('Politica precisa de um controle ja selado.')
      } else this.mostrarToast('Solte a Politica sobre um controle selado.')
    } else if (efeito === 'demonstrar') {
      if (podePublicar(this.estado, uid)) {
        novo = publicarTrustCenter(this.estado, uid)
        if (novo !== this.estado) acao = 'invocar'
      } else this.mostrarToast('Trust Center exige o alvo batido e o turno minimo.')
    } else {
      this.mostrarToast('Essa carta ganha efeito na proxima missao.')
    }

    if (novo !== this.estado) {
      const alvoUid = alvoSelado
      const inst = alvoUid ? novo.cartas.campo.find((c) => c.uid === alvoUid) : null
      this.estado = novo
      this.renderizar()
      if (acao === 'selar' && inst) {
        const ref = this.cartasCampo.find((c) => c.uid === inst.uid)
        if (ref) this.efeitoSelar(ref.obj, inst)
      } else if (acao === 'invocar') {
        this.efeitoInvocar(obj.x, obj.y)
      }
      this.checarFim()
    } else {
      this.renderizar()
    }
  }

  private aoEncerrarTurno(): void {
    if (this.estado.duelo.resultado !== 'em-andamento') return
    const postureAntes = this.estado.duelo.recursos.posture
    this.estado = encerrarTurno(this.estado)
    this.eventosTxt.setText(this.estado.ultimosEventos.slice(0, 5).join('\n'))
    this.renderizar()
    if (this.estado.duelo.recursos.posture < postureAntes) {
      this.efeitoAtaqueVilao()
    }
    this.checarFim()
  }

  private checarFim(): void {
    const res = this.estado.duelo.resultado
    if (res === 'em-andamento' || this.encerrado) return
    this.encerrado = true

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, colorsHex.ink, 0.84).setOrigin(0, 0).setInteractive()
    const venceu = res === 'vitoria'
    if (venceu) {
      for (let i = 0; i < 24; i += 1) {
        const star = this.add.circle(
          Phaser.Math.Between(0, this.scale.width),
          Phaser.Math.Between(0, this.scale.height),
          Phaser.Math.FloatBetween(1, 2.5),
          colorsHex.cyan,
          0,
        )
        this.tweens.add({ targets: star, alpha: 1, duration: 400, delay: i * 30, yoyo: true })
      }
    }
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 20, venceu ? 'A constelacao acende' : 'O 90 Dias prevaleceu', {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '30px',
        color: venceu ? '#22D3EE' : '#EF4444',
      })
      .setOrigin(0.5)
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 20, `Posture final ${this.estado.duelo.recursos.posture}`, {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '14px',
        color: '#8FCBFF',
      })
      .setOrigin(0.5)

    this.time.delayedCall(950, () =>
      this.onFim({ resultado: res, posture: this.estado.duelo.recursos.posture, modo: this.modo }),
    )
  }
}
