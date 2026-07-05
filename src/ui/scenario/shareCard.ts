// Gera o cartao compartilhavel do resultado, estetica deep-space, pronto para
// LinkedIn. Desenha em canvas e dispara o download de um PNG. Sem overclaim.

interface CartaoOpts {
  score: number
  modoLabel: string
  veredito: string
}

function fundo(g: CanvasRenderingContext2D, w: number, h: number): void {
  const lin = g.createLinearGradient(0, 0, 0, h)
  lin.addColorStop(0, '#0A1530')
  lin.addColorStop(0.55, '#0B1220')
  lin.addColorStop(1, '#060B16')
  g.fillStyle = lin
  g.fillRect(0, 0, w, h)

  const glow = g.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.1, w * 0.6)
  glow.addColorStop(0, 'rgba(34,211,238,0.12)')
  glow.addColorStop(1, 'rgba(34,211,238,0)')
  g.fillStyle = glow
  g.fillRect(0, 0, w, h)
}

function estrelas(g: CanvasRenderingContext2D, w: number, h: number): void {
  for (let i = 0; i < 90; i += 1) {
    const x = (i * 97.13) % w
    const y = (i * 53.7) % (h * 0.9)
    const r = ((i * 7) % 10) / 8 + 0.3
    g.fillStyle = `rgba(190,210,245,${0.2 + ((i * 13) % 10) / 18})`
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
  }
}

function constelacao(g: CanvasRenderingContext2D, w: number, y: number, score: number): void {
  const N = 12
  const lit = Math.round((N * Math.max(0, Math.min(100, score))) / 100)
  const x0 = w * 0.18
  const x1 = w * 0.82
  const pts: Array<[number, number]> = []
  for (let i = 0; i < N; i += 1) {
    const x = x0 + (x1 - x0) * (i / (N - 1))
    pts.push([x, y + Math.sin(i * 1.6) * 16])
  }
  g.strokeStyle = 'rgba(42,74,134,0.5)'
  g.lineWidth = 1.5
  g.beginPath()
  pts.forEach(([x, yy], i) => (i === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy)))
  g.stroke()
  pts.forEach(([x, yy], i) => {
    const aceso = i < lit
    g.fillStyle = aceso ? '#22D3EE' : '#16306b'
    g.beginPath()
    g.arc(x, yy, aceso ? 6 : 4, 0, Math.PI * 2)
    g.fill()
  })
}

export async function gerarCartaoCompartilhavel(opts: CartaoOpts): Promise<void> {
  if ('fonts' in document) {
    try {
      await document.fonts.ready
    } catch {
      // segue com fallback de fonte do sistema
    }
  }

  const w = 1200
  const h = 630
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const g = canvas.getContext('2d')
  if (!g) return

  fundo(g, w, h)
  estrelas(g, w, h)

  g.textAlign = 'center'

  g.fillStyle = '#22D3EE'
  g.font = '600 22px "JetBrains Mono", monospace'
  g.fillText('C O S M O S E C', w / 2, 92)

  g.fillStyle = '#F6F8FB'
  g.font = '700 72px "Space Grotesk", sans-serif'
  g.fillText('90 DIAS', w / 2, 168)

  g.fillStyle = '#8FCBFF'
  g.font = '400 20px "Inter", sans-serif'
  g.fillText(opts.modoLabel, w / 2, 210)

  // Score em destaque, com leve gradiente.
  const grad = g.createLinearGradient(w / 2 - 160, 0, w / 2 + 160, 0)
  grad.addColorStop(0, '#3B82F6')
  grad.addColorStop(1, '#22D3EE')
  g.fillStyle = grad
  g.font = '700 150px "Space Grotesk", sans-serif'
  g.fillText(String(Math.round(opts.score)), w / 2, 360)
  g.fillStyle = '#8FA3C4'
  g.font = '400 30px "JetBrains Mono", monospace'
  g.fillText('Posture Score, honesto, de 0 a 100', w / 2, 400)

  constelacao(g, w, 460, opts.score)

  // Veredito, quebrado em linhas.
  g.fillStyle = '#DCE6F5'
  g.font = '400 22px "Inter", sans-serif'
  const palavras = opts.veredito.split(' ')
  let linha = ''
  let yy = 520
  for (const p of palavras) {
    const teste = linha ? `${linha} ${p}` : p
    if (g.measureText(teste).width > w * 0.8 && linha) {
      g.fillText(linha, w / 2, yy)
      linha = p
      yy += 30
    } else {
      linha = teste
    }
  }
  if (linha) g.fillText(linha, w / 2, yy)

  g.fillStyle = '#5E7196'
  g.font = '500 18px "JetBrains Mono", monospace'
  g.fillText('cosmosec.com.br', w / 2, h - 34)

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = '90-dias-cosmosec.png'
  a.click()
}
