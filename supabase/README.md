# Supabase · 90 Dias

Backend de captura de lead: tabela `leads` e Edge Function `capture-lead`.

## Gate G1 antes de aplicar

Nada aqui roda sozinho. Conforme a secao 14 do prompt mestre:

- Nenhuma migration roda sem revisao humana. Guilherme aplica manualmente.
- Nenhum `supabase link` ou `supabase push` sem confirmacao explicita.
- Sem conexao a banco remoto pelo agente.

A migration em `migrations/20260617000000_create_leads.sql` e proposta para o
Gate G1. So aplique depois de revisar o schema e as politicas RLS em
`docs/security/M-00-leads-schema-rls.md`.

## Estrutura

```
supabase/
  migrations/
    20260617000000_create_leads.sql   tabela leads, CHECKs e RLS (negacao por padrao)
  functions/
    capture-lead/
      index.ts                        orquestra captura e resultado
      deno.json
    _shared/
      validation.ts                   validacao server-side autoritativa
      rateLimit.ts                    rate limit por IP, best-effort
      turnstile.ts                    verificacao opcional do Cloudflare Turnstile
      email.ts                        envio via Resend para contato@cosmosec.com.br
      cors.ts
    .env.example                      secrets da funcao
```

## Como aplicar, manual (voce, apos o G1)

1. Revisar a migration e este README.
2. Aplicar a migration no projeto sa-east-1, pelo metodo que voce preferir
   (SQL editor do painel ou CLI com confirmacao explicita).
3. Configurar os secrets da funcao a partir de `functions/.env.example`:
   `RESEND_API_KEY`, `RESEND_FROM`, `ALLOWED_ORIGIN` e, se for usar, `TURNSTILE_SECRET`.
   `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` o Supabase injeta sozinho.
4. Fazer deploy da funcao `capture-lead` quando autorizar.
5. No cliente, preencher `.env.local` com `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   e `VITE_CAPTURE_LEAD=http` para sair do mock.

## Contrato da funcao

POST captura:

```json
{ "nome": "...", "email": "...", "genero": "Feminino|Masculino|Outro|null",
  "cargo": "CISO", "consentimento": true, "honeypot": "", "turnstileToken": null }
```

POST resultado, ao fim da partida:

```json
{ "tipo": "resultado", "leadId": "uuid", "modoJogado": "auditoria", "scoreFinal": 72 }
```

Resposta sempre opaca: `{ "ok": true|false, "leadId": "uuid|null" }`. Sem detalhe de erro.

## Notas de seguranca

- `origem` e forcada para `jogo-90dias` no servidor. O cliente nao decide.
- `consentimento` so e gravado quando chega `true`. CHECK no banco reforca.
- Rate limit em memoria e best-effort. Limite global duravel fica para a M-14.
- Email falho nao bloqueia: o lead ja foi persistido antes do envio.
