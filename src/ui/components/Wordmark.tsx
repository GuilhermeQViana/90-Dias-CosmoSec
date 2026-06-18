import { StarCompass } from '@/ui/components/StarCompass'

interface WordmarkProps {
  // fundo escuro deixa o Sec em branco; fundo claro deixa o Sec em ink
  variante?: 'escuro' | 'claro'
  tamanho?: number
  comSimbolo?: boolean
}

// Wordmark CosmoSec do guia v2.0: Cosmo em gradiente azul para cyan, Sec solido.
// Use o wordmark sempre que o espaco permitir; o simbolo fica para avatar e favicon.
export function Wordmark({
  variante = 'escuro',
  tamanho = 28,
  comSimbolo = true,
}: WordmarkProps): JSX.Element {
  return (
    <span className="inline-flex items-center gap-2.5">
      {comSimbolo ? <StarCompass size={tamanho * 1.5} orbita /> : null}
      <span className="font-display font-bold tracking-tight" style={{ fontSize: tamanho }}>
        <span className="bg-gradient-to-r from-blue500 to-cyan bg-clip-text text-transparent">Cosmo</span>
        <span className={variante === 'escuro' ? 'text-white' : 'text-ink'}>Sec</span>
      </span>
    </span>
  )
}
