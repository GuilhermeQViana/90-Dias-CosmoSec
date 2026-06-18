import type { CartaVilao } from '@/game/villain/types'

// Baralho do vilao 90 Dias, fiel a secao 9. Ameacas, Decadencia e Pressao.
// Sem travessoes na copy.

export const CATALOGO_VILAO: readonly CartaVilao[] = [
  // Ameacas
  {
    id: 'phishing',
    nome: 'Phishing',
    categoria: 'ameaca',
    efeito: 'phishing',
    texto: 'Dano a Postura se voce nao tem MFA. Com MFA, absorvido.',
  },
  {
    id: 'ransomware',
    nome: 'Ransomware',
    categoria: 'ameaca',
    efeito: 'ransomware',
    texto: 'Destroi um controle nao protegido por Backup Imutavel.',
  },
  {
    id: 'vazamento-fornecedor',
    nome: 'Vazamento de Fornecedor',
    categoria: 'ameaca',
    efeito: 'vazamento-fornecedor',
    texto: 'Dano se voce nao governa o acesso de terceiros.',
  },
  {
    id: 'insider',
    nome: 'Insider',
    categoria: 'ameaca',
    efeito: 'insider',
    texto: 'Dano reduzido por Segregacao de Funcoes.',
  },
  {
    id: 'ddos',
    nome: 'DDoS',
    categoria: 'ameaca',
    efeito: 'ddos',
    texto: 'Bloqueia uma carta sua por 1 turno.',
  },

  // Decadencia, o tema da staleness
  {
    id: 'evidencia-vencida',
    nome: 'Evidencia Vencida',
    categoria: 'decadencia',
    efeito: 'evidencia-vencida',
    texto: 'Vence um selo antigo e remove a Postura dele, a menos que fresco.',
  },
  {
    id: 'prazo-apertado',
    nome: 'Prazo Apertado',
    categoria: 'decadencia',
    efeito: 'prazo-apertado',
    texto: 'Acelera o relogio, reduz Dias.',
  },
  {
    id: 'lacuna',
    nome: 'Lacuna',
    categoria: 'decadencia',
    efeito: 'lacuna',
    texto: 'Cria um gap nao coberto e cobra Postura.',
  },

  // Pressao
  {
    id: 'auditoria-surpresa',
    nome: 'Auditoria Surpresa',
    categoria: 'pressao',
    efeito: 'auditoria-surpresa',
    texto: 'Exige prova agora. Sem Trilha de Auditoria, perde Postura.',
  },
  {
    id: 'achado-critico',
    nome: 'Achado Critico',
    categoria: 'pressao',
    efeito: 'achado-critico',
    texto: 'Vira risco estrategico e cobra Postura.',
  },
] as const
