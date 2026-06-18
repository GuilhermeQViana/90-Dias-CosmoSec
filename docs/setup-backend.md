# Setup do backend de lead, passo a passo

Guia para conectar o banco e a Edge Function. Quem executa e o Guilherme.
O agente nao roda supabase link ou push, nem conecta em banco remoto (secao 14).

Pre requisitos: conta no Supabase e conta no Resend.

## Parte A, schema no banco (Gate G1)

1. Em app.supabase.com, criar projeto na regiao South America (Sao Paulo) sa-east-1.
2. Painel, SQL Editor, New query. Colar todo o conteudo de
   supabase/migrations/20260617000000_create_leads.sql e clicar Run.
3. Conferir:
   - Table Editor mostra a tabela leads.
   - Authentication, Policies mostra RLS ligada na leads e nenhuma policy.
     Negacao por padrao, e o esperado.

Checklist Parte A:
- [ ] Projeto criado em sa-east-1.
- [ ] Migration aplicada sem erro.
- [ ] Tabela leads visivel.
- [ ] RLS ligada, sem policies.

## Parte B, Edge Function e cliente

### B1. Chaves do projeto

Painel, Project Settings, API. Anotar:
- Project URL, exemplo https://abcxyz.supabase.co
- anon public, vai para o cliente, e publica.
- service_role, secreta, fica so no Supabase.

### B2. Email no Resend

1. Criar conta no Resend.
2. Verificar o dominio cosmosec.com.br, configurar SPF e DKIM no DNS.
3. Gerar uma API Key.
4. Definir o remetente, exemplo no-reply@cosmosec.com.br.

### B3. Instalar a CLI e dar deploy

```bash
npm i -g supabase
supabase login
supabase link --project-ref <ref-do-projeto>

# secrets da funcao. SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY o Supabase injeta sozinho.
supabase secrets set \
  RESEND_API_KEY=re_xxx \
  RESEND_FROM="Jogo 90 Dias <no-reply@cosmosec.com.br>" \
  ALLOWED_ORIGIN=http://localhost:5173

supabase functions deploy capture-lead
```

Para producao, trocar ALLOWED_ORIGIN pelo dominio real do jogo.
Turnstile e opcional: para ligar, adicionar TURNSTILE_SECRET aos secrets.

### B4. Ligar o cliente

No arquivo .env.local da raiz:

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public>
VITE_CAPTURE_LEAD=http
```

Reiniciar o npm run dev.

Checklist Parte B:
- [ ] Chaves anotadas.
- [ ] Dominio verificado no Resend, API Key gerada.
- [ ] Secrets setados na funcao.
- [ ] Funcao capture-lead com deploy feito.
- [ ] .env.local preenchido com VITE_CAPTURE_LEAD=http.

## Teste ponta a ponta

1. npm run dev, abrir o jogo.
2. Menu, Jogar, preencher a ficha, marcar o consentimento, Iniciar.
3. Conferir:
   - Table Editor, leads, o registro novo apareceu com origem jogo-90dias.
   - Email chegou em contato@cosmosec.com.br.

Se algo falhar, o jogo segue mesmo assim, de proposito. Olhe os Logs da funcao
no painel, em Edge Functions, capture-lead, para depurar.

## Pedido de titular (LGPD)

Para apagar ou anonimizar um lead a pedido, use o SQL Editor com a service role,
localizando por email com o indice leads_email_idx. Procedimento manual no MVP,
conforme docs/security/M-00-lgpd-privacy-model.md.
