# 90 Dias · CosmoSec

Card game cosmico de governanca cyber. O jogador e um Guardiao que enfrenta o vilao 90 Dias enquanto prova a postura de seguranca da sua organizacao.

## Stack

- Build: Vite + TypeScript strict.
- Shell, menu e criador de personagem: React 18.
- Cenas de duelo e efeitos: Phaser 3.
- Estilo: Tailwind + tokens da marca.
- Backend de lead: Supabase Edge Function + Resend (a partir da M-03).

## Scripts

```bash
npm install     # instala dependencias
npm run dev     # ambiente de desenvolvimento em http://localhost:5173
npm run build   # typecheck + build de producao
npm run preview # serve o build
npm run typecheck
npm run lint
npm test        # vitest
```

## Estrutura

```
src/
  brand/      tokens de cor e tipografia, fonte unica de verdade
  game/       integracao Phaser, config e cenas
    scenes/   cenas do duelo (BootScene no MVP tecnico)
  styles/     Tailwind e estilos globais
  App.tsx     shell React que compoe a UI sobre o canvas Phaser
  main.tsx    entry React
docs/
  security/   threat model, LGPD, schema e RLS (M-00)
.github/
  workflows/  CI: typecheck, lint, testes, build
```

## Estado das missoes

- M-00 documentacao de seguranca e privacidade, Gate G0. Em revisao na branch m00-threat-model-lgpd.
- M-01 scaffolding Vite + TS + React + Phaser + CI. Esta branch.
- M-02 em diante: ver docs/security e a secao 13 do prompt mestre.

## Regras do projeto

Ver secao 14 do prompt mestre. Em resumo: branches cortadas de main, nenhuma
migration sem revisao humana, nenhum overclaim de conformidade, sem travessoes
em nenhuma string ou copy.
