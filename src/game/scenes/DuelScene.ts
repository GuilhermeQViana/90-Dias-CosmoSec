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
import type { CartaInstancia } from '@/game/cards/types'

// Resultado emitido para o React ao fim do duelo.
export interface DuelFim {
  resultado: 'vitoria' | 'derrota'
  posture: number
  modo: ModeId
}

export interface DuelSceneData {
  modo: ModeId
  onFim: (fim: DuelFim) => void
}

const LARGURA_CARTA = 120
const ALTURA_CARTA = 168

// Cena de duelo da M-05. Render do HUD, mao e campo, com jogar por arraste.
// Logica vem do controlador puro; aqui so desenha e captura input. FX e som
// entram na M-10 e M-11.
export class DuelScene extends Phaser.Scene {
  private estado!: EstadoJogo
  private modo!: ModeId
  private onFim!: (fim: DuelFim) => void

  private camadaMao!: Phaser.GameObjects.Container
  private camadaCampo!: Phaser.GameObjects.Container
  private cartasCampo: Array<{ uid: string; obj: Phaser.GameObjects.Container }> = []
  private zonaCampo!: Phaser.Geom.Rectangle

  private hudDias!: Phaser.GameObjects.Text
  private hudPosture!: Phaser.GameObjects.Text
  private hudEnergia!: Phaser.GameObjects.Text
  private hudTurno!: Phaser.GameObjects.Text
  private barraPosture!: Phaser.GameObjects.Rectangle
  private toast!: Phaser.GameObjects.Text
  private ampulheta!: Phaser.GameObjects.Container
  private pulseTween?: Phaser.Tweens.Tween
  private eventosTxt!: Phaser.GameObjects.Text
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
    this.montarHud()

    this.camadaCampo = this.add.container(0, 0)
    this.camadaMao = this.add.container(0, 0)

    this.configurarArraste()
    this.scale.on('resize', this.renderizar, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.renderizar, this)
    })

    this.renderizar()
  }

  private montarHud(): void {
    const mode = findMode(this.modo)
    this.add
      .text(24, 20, `Arena: ${mode.titulo}`, {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '16px',
        color: '#F8FAFC',
      })
      .setName('titulo')

    this.hudTurno = this.add.text(24, 46, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: '#94A3B8',
    })

    this.hudDias = this.add.text(0, 20, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '18px',
      color: '#22D3EE',
    })
    this.hudEnergia = this.add.text(0, 46, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: '#3B82F6',
    })

    // Barra de Postura.
    this.add.text(24, 78, 'Posture', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      color: '#94A3B8',
    })
    this.add.rectangle(24, 96, 220, 10, colorsHex.blue900).setOrigin(0, 0.5)
    this.barraPosture = this.add.rectangle(24, 96, 0, 10, colorsHex.cyan).setOrigin(0, 0.5)
    this.hudPosture = this.add.text(252, 90, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: '#22D3EE',
    })

    // Ampulheta do vilao 90 Dias no topo. Pulsa mais rapido quando o tempo aperta.
    this.criarAmpulheta()

    // Log dos ataques do vilao no ultimo turno.
    this.eventosTxt = this.add.text(24, 116, '', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      color: '#94A3B8',
      lineSpacing: 3,
      wordWrap: { width: 260 },
    })

    // Botao encerrar turno.
    this.criarBotao('Encerrar turno', () => this.aoEncerrarTurno())

    // Toast de aviso.
    this.toast = this.add
      .text(0, 0, '', {
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        color: '#FBBF24',
      })
      .setOrigin(0.5)
      .setAlpha(0)
  }

  private criarBotao(rotulo: string, aoClicar: () => void): void {
    const largura = 150
    const altura = 40
    const x = this.scale.width - largura - 24
    const y = this.scale.height - altura - 24
    const cont = this.add.container(x, y)
    const fundo = this.add
      .rectangle(0, 0, largura, altura, colorsHex.blue500, 1)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
    const txt = this.add
      .text(largura / 2, altura / 2, rotulo, {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '13px',
        color: '#F8FAFC',
      })
      .setOrigin(0.5)
    cont.add([fundo, txt])
    cont.setName('btn-encerrar')
    fundo.on('pointerdown', aoClicar)
  }

  private criarAmpulheta(): void {
    const topo = this.add
      .triangle(0, 0, 0, -22, 22, 22, -22, 22, colorsHex.blue500, 0.2)
      .setStrokeStyle(2, colorsHex.cyan, 0.85)
    const base = this.add
      .triangle(0, 0, 0, 22, 22, -22, -22, -22, colorsHex.blue500, 0.2)
      .setStrokeStyle(2, colorsHex.cyan, 0.85)
    this.ampulheta = this.add.container(this.scale.width / 2, 46, [topo, base])
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

  // A ampulheta pulsa mais rapido conforme os Dias caem. A tensao cresce de proposito.
  private atualizarAmpulheta(dias: number): void {
    this.ampulheta.setX(this.scale.width / 2)
    if (this.pulseTween) {
      this.pulseTween.timeScale = dias < 20 ? 2.4 : dias < 40 ? 1.6 : 1
    }
  }

  private mostrarToast(msg: string): void {
    this.toast.setText(msg)
    this.toast.setPosition(this.scale.width / 2, this.scale.height * 0.42)
    this.toast.setAlpha(1)
    this.tweens.add({ targets: this.toast, alpha: 0, duration: 1600, delay: 600 })
  }

  // ----- Render -----

  private renderizar(): void {
    const { width, height } = this.scale
    const mode = findMode(this.modo)
    const r = this.estado.duelo.recursos

    this.hudTurno.setText(`Turno ${this.estado.duelo.turno}. Selados ${this.estado.duelo.controlesSelados}/${mode.minControlesSelados}.`)
    this.hudDias.setText(`${r.dias} dias`).setPosition(width - this.hudDias.width - 24, 20)
    this.hudEnergia.setText(`Energia ${r.energia}/${r.energiaMax}`).setPosition(width - 150, 46)
    this.hudPosture.setText(`${r.posture}/${mode.alvoPostura}`)
    this.barraPosture.width = 220 * Phaser.Math.Clamp(r.posture / 100, 0, 1)
    this.atualizarAmpulheta(r.dias)

    // Zona de campo no centro.
    this.zonaCampo = new Phaser.Geom.Rectangle(width * 0.1, height * 0.28, width * 0.8, height * 0.32)

    this.desenharCampo()
    this.desenharMao()
  }

  private desenharCampo(): void {
    this.camadaCampo.removeAll(true)
    this.cartasCampo = []

    // Contorno da zona de campo.
    const borda = this.add
      .rectangle(this.zonaCampo.x, this.zonaCampo.y, this.zonaCampo.width, this.zonaCampo.height)
      .setOrigin(0, 0)
      .setStrokeStyle(1, colorsHex.blue500, 0.3)
    this.camadaCampo.add(borda)

    const inicioX = this.zonaCampo.x + 20
    const y = this.zonaCampo.y + this.zonaCampo.height / 2 - ALTURA_CARTA / 2
    this.estado.cartas.campo.forEach((inst, i) => {
      const x = inicioX + i * (LARGURA_CARTA + 16)
      const obj = this.criarCarta(inst, x, y, true)
      this.camadaCampo.add(obj)
      this.cartasCampo.push({ uid: inst.uid, obj })
    })
  }

  private desenharMao(): void {
    this.camadaMao.removeAll(true)
    const { width, height } = this.scale
    const mao = this.estado.cartas.mao
    const total = mao.length
    const espaco = Math.min(LARGURA_CARTA + 12, (width - 80) / Math.max(total, 1))
    const larguraTotal = espaco * (total - 1)
    const inicioX = width / 2 - larguraTotal / 2 - LARGURA_CARTA / 2
    const y = height - ALTURA_CARTA - 16

    mao.forEach((inst, i) => {
      const x = inicioX + i * espaco
      const obj = this.criarCarta(inst, x, y, false)
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

  private criarCarta(
    inst: CartaInstancia,
    x: number,
    y: number,
    noCampo: boolean,
  ): Phaser.GameObjects.Container {
    const cont = this.add.container(x, y)
    const corBorda = inst.selado ? colorsHex.cyan : colorsHex.blue500
    const fundo = this.add
      .rectangle(0, 0, LARGURA_CARTA, ALTURA_CARTA, colorsHex.blue900, 0.95)
      .setOrigin(0, 0)
      .setStrokeStyle(inst.selado ? 2 : 1, corBorda, inst.selado ? 0.9 : 0.5)

    const nome = this.add.text(8, 8, inst.carta.nome, {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '12px',
      color: '#F8FAFC',
      wordWrap: { width: LARGURA_CARTA - 16 },
    })

    const custo = this.add.text(8, ALTURA_CARTA - 40, `E ${inst.carta.custoEnergia}  D ${inst.carta.custoDias}`, {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      color: '#22D3EE',
    })

    const tipo = this.add.text(8, ALTURA_CARTA - 22, inst.carta.tipo, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      color: '#94A3B8',
    })

    cont.add([fundo, nome, custo, tipo])

    if (inst.carta.tipo === 'controle') {
      const def = this.add.text(LARGURA_CARTA - 30, 8, `Def ${inst.carta.defesa}`, {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        color: '#3B82F6',
      })
      cont.add(def)
    }
    if (inst.selado) {
      const selo = this.add.text(8, ALTURA_CARTA / 2, 'prova selada', {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '10px',
        color: '#22D3EE',
      })
      cont.add(selo)
    }
    if (noCampo) {
      cont.setData('campo', true)
    }
    return cont
  }

  // ----- Arraste -----

  private configurarArraste(): void {
    this.input.on(
      'dragstart',
      (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container) => {
        this.camadaMao.bringToTop(obj)
        obj.setScale(1.04)
      },
    )
    this.input.on(
      'drag',
      (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container, dragX: number, dragY: number) => {
        obj.setPosition(dragX, dragY)
      },
    )
    this.input.on('dragend', (p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container) => {
      obj.setScale(1)
      this.resolverSolta(p, obj)
    })
  }

  private controleSob(p: Phaser.Input.Pointer): string | null {
    for (const { uid, obj } of this.cartasCampo) {
      const b = obj.getBounds()
      if (b.contains(p.x, p.y)) {
        return uid
      }
    }
    return null
  }

  private resolverSolta(p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Container): void {
    const uid = obj.getData('uid') as string
    const efeito = obj.getData('efeito') as string
    const tipo = obj.getData('tipo') as string
    const noCampo = Phaser.Geom.Rectangle.Contains(this.zonaCampo, p.x, p.y)

    let novo = this.estado
    let agiu = false

    if (tipo === 'controle' && noCampo) {
      novo = jogarControle(this.estado, uid)
      agiu = novo !== this.estado
      if (!agiu) this.mostrarToast('Sem energia ou dias para esse controle.')
    } else if (efeito === 'lacre') {
      const alvo = this.controleSob(p)
      if (alvo) {
        novo = selarComLacre(this.estado, uid, alvo)
        agiu = novo !== this.estado
        if (!agiu) this.mostrarToast('Nao deu para selar. Cheque energia, dias ou se ja esta selado.')
      } else {
        this.mostrarToast('Solte o Lacre sobre um controle em campo.')
      }
    } else if (efeito === 'politica') {
      const alvo = this.controleSob(p)
      if (alvo) {
        novo = aplicarPolitica(this.estado, uid, alvo)
        agiu = novo !== this.estado
        if (!agiu) this.mostrarToast('Politica precisa de um controle ja selado.')
      } else {
        this.mostrarToast('Solte a Politica sobre um controle selado.')
      }
    } else if (efeito === 'demonstrar') {
      if (podePublicar(this.estado, uid)) {
        novo = publicarTrustCenter(this.estado, uid)
        agiu = novo !== this.estado
      } else {
        this.mostrarToast('Trust Center exige o alvo batido e o turno minimo.')
      }
    } else {
      this.mostrarToast('Essa carta ganha efeito na proxima missao.')
    }

    if (agiu) {
      this.estado = novo
      this.renderizar()
      this.checarFim()
    } else {
      // Volta a carta ao lugar.
      this.renderizar()
    }
  }

  private aoEncerrarTurno(): void {
    if (this.estado.duelo.resultado !== 'em-andamento') {
      return
    }
    this.estado = encerrarTurno(this.estado)
    this.eventosTxt.setText(this.estado.ultimosEventos.slice(0, 5).join('\n'))
    this.renderizar()
    this.checarFim()
  }

  private checarFim(): void {
    const res = this.estado.duelo.resultado
    if (res === 'em-andamento' || this.encerrado) {
      return
    }
    this.encerrado = true
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, colorsHex.ink, 0.82)
      .setOrigin(0, 0)
    const titulo = res === 'vitoria' ? 'A constelacao acende' : 'O 90 Dias prevaleceu'
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 20, titulo, {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '28px',
        color: res === 'vitoria' ? '#22D3EE' : '#F87171',
      })
      .setOrigin(0.5)
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 18, `Posture final ${this.estado.duelo.recursos.posture}`, {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '14px',
        color: '#94A3B8',
      })
      .setOrigin(0.5)
    overlay.setInteractive()

    this.time.delayedCall(900, () => {
      this.onFim({
        resultado: res,
        posture: this.estado.duelo.recursos.posture,
        modo: this.modo,
      })
    })
  }
}
