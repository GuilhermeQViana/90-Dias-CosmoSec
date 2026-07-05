# 90 Dias · CosmoSec

Lead magnet jogavel de governanca cyber. O jogador e um Guardiao que enfrenta o
vilao 90 Dias e prova a postura de seguranca da sua organizacao em um duelo de
cartas cosmico, estruturado pelos cinco verbos da metodologia CosmoSec:
Diagnosticar, Planejar, Operar, Monitorar e Demonstrar.

Sem overclaim: normas como SOC 2 e ISO 27001 aparecem sempre como cobertura de
crosswalk ou em andamento, nunca como certificado obtido.

## Comecar (clone e rodar)

Pre requisito: Node 20 ou superior.

```bash
git clone https://github.com/GuilhermeQViana/90-Dias-CosmoSec.git
cd 90-Dias-CosmoSec
npm install        # ou npm ci para instalar exatamente do lockfile
npm run dev        # abre em http://localhost:5173
```

O jogo roda de cara, sem backend: a captura de lead usa um mock por padrao.
Para ligar a captura real (Supabase + Resend), veja docs/setup-backend.md e o
arquivo .env.example.

## Stack

- Build: Vite + TypeScript strict.
- UI e jogo: React 18 + Tailwind, com tokens da marca CosmoSec v2.0.
- Fundo cosmico: three.js (starfield procedural, nebulosas, parallax).
- Backend de lead: Supabase Edge Function (Deno) + Resend, regiao sa-east-1.
- Testes: Vitest. CI: typecheck, lint, testes e build no GitHub Actions.

## Scripts

```bash
npm run dev        # ambiente de desenvolvimento
npm run build      # typecheck + build de producao
npm run preview    # serve o build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint, zero warnings
npm test           # vitest
```

## Estrutura

```
src/
  brand/        tokens de cor e tipografia, fonte unica de verdade
  lead/         captura de lead: tipos, validacao pura, cliente mock e http
  game/
    engine/     motor do duelo: estado, turnos, recursos, score, balance
    cards/      catalogo de cartas, baralho e mao
    villain/    IA, baralho e escalonamento do vilao 90 Dias
    scenario/   narrativa dos cinco verbos (campanha e engine de faixas)
    journey/    orquestracao dos atos da jornada
    modes.ts    os tres modos (arenas) e suas regras
  ui/
    cosmic/     fundo three.js
    journey/    o jogo em si: JourneyGame e as cartas em HTML
    scenario/   HUD cosmico: gauge, stepper, constelacao, tela final, cartao
    screens/    menu, criador de personagem, como jogar
    components/  botao, campo de formulario, logo e wordmark
  styles/       Tailwind e animacoes
  App.tsx       shell: fundo cosmico e roteamento de telas
  main.tsx      entry React
supabase/
  migrations/   schema da tabela leads (aplicado manualmente)
  functions/    Edge Function capture-lead
docs/
  security/     threat model STRIDE, LGPD, schema e RLS (Gate G0)
  setup-backend.md   passo a passo do backend de lead
.github/workflows/   CI
```

## Backend de lead (opcional)

Por padrao o cliente usa o mock e o jogo funciona sem nenhuma configuracao.
Para ligar o real:

1. Criar um projeto Supabase em sa-east-1 e aplicar a migration da tabela leads.
2. Fazer deploy da Edge Function capture-lead e configurar os secrets (Resend).
3. Preencher .env.local com as chaves e VITE_CAPTURE_LEAD=http.

Detalhes em docs/setup-backend.md. Nenhuma migration roda sem revisao humana.

## Estado das missoes

Plano de missoes na secao 13 do prompt mestre.

- M-00 a M-03 seguranca, scaffolding, menu e criador, captura de lead. Feitas.
- M-04 a M-06 motor de duelo, sistema de cartas, vilao 90 Dias. Feitas.
- M-07 Modo 1 Auditoria Externa, regra prova selada vale dobrado. Feita.
- Jogo unificado: duelo de cartas pelos cinco verbos no visual cosmico. Feito.
- Proximas: M-08 e M-09 (modos Regulador e RFP, com Campos de framework),
  M-11 audio, M-13 narrativa e cartao compartilhavel, M-14 polimento e QA.

## Regras do projeto

Ver secao 14 do prompt mestre. Em resumo: branches cortadas de main, nenhuma
migration sem revisao humana, nenhum overclaim de conformidade, sem travessoes
em nenhuma string ou copy, e gate humano para mudancas na logica de score.

## Uso

Projeto proprietario da CosmoSec, material de marketing. Nao ha licenca aberta.
