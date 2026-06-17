# M-00 · Schema proposto da tabela leads e políticas RLS

Status: proposta para revisão no Gate G0. Este documento NÃO é uma migration e NÃO deve ser executado.
A migration executável será criada na M-03 e aplicada manualmente pelo Guilherme após o Gate G1.
Nenhum banco remoto é tocado aqui. Sem supabase link, sem supabase push.

## 1. Schema proposto

```sql
-- PROPOSTA PARA REVISÃO. NÃO EXECUTAR. Vira migration na M-03.
create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  nome          text not null,
  email         text not null,
  genero        text,                         -- opcional, ver doc LGPD, candidato a remoção futura
  cargo         text not null,
  consentimento boolean not null,             -- a função só insere com true
  origem        text not null default 'jogo-90dias',
  modo_jogado   text,                         -- preenchido no segundo POST, ao fim da partida
  score_final   integer,                      -- 0 a 100, preenchido no segundo POST
  user_agent    text                          -- a confirmar no G0 por minimização
);
```

Notas de design:
- id uuid em vez de serial: não revela volume de leads nem permite enumeração.
- created_at com default now() no servidor, nunca vindo do cliente.
- origem com default jogo-90dias e forçada pela função. O cliente não decide origem.
- consentimento sem default: a função só faz insert quando o payload validado traz true. Assim o booleano nunca fica ambíguo.
- score_final como integer. A faixa 0 a 100 é validada na função e pode ganhar um CHECK (ver abaixo, decisão do G0).

## 2. Constraints opcionais para o G0 decidir

```sql
-- Candidatas, sujeitas a aprovação humana:
-- alter table public.leads add constraint leads_score_range
--   check (score_final is null or (score_final between 0 and 100));
-- alter table public.leads add constraint leads_genero_dominio
--   check (genero is null or genero in ('Masculino','Feminino','Outro','Prefiro não informar'));
-- alter table public.leads add constraint leads_cargo_dominio
--   check (cargo in ('CISO','Gerente de Segurança da Informação','Analista de Segurança da Informação',
--     'Gerente de Risco Operacional','Analista de Risco Operacional','Gerente de Compliance',
--     'Analista de Compliance','Outro'));
```

A validação primária mora na Edge Function. O CHECK no banco é defesa em profundidade. Decidir no G0 se entra já no MVP.

## 3. Políticas RLS propostas

Regra de ouro: insert e update apenas via Edge Function com service role. Nenhuma leitura anônima. Leitura só para perfis internos.

```sql
-- PROPOSTA PARA REVISÃO. NÃO EXECUTAR.

-- 1. Liga a RLS. Sem policy, ninguém passa.
alter table public.leads enable row level security;

-- 2. Garante que nem o dono da tabela escapa da RLS por engano.
alter table public.leads force row level security;

-- 3. Sem policy para anon e sem policy para authenticated.
--    Resultado: cliente com anon key NÃO lê, NÃO insere, NÃO atualiza a tabela direto.
--    A Edge Function usa a service role, que por padrão contorna a RLS, e é a única via de escrita.

-- 4. Leitura para perfis internos.
--    Modelar conforme a estratégia de acesso interno definida no G0. Duas opções:
--    a) Acesso via service role em ferramenta interna autenticada (sem policy de select para roles públicas).
--    b) Role interna dedicada com policy de select explícita. Exemplo a validar:
-- create policy leads_select_interno on public.leads
--   for select to authenticated
--   using ( (auth.jwt() ->> 'role') = 'cosmosec_interno' );
```

Por que assim:
- force row level security evita o furo clássico de o owner da tabela ignorar a RLS.
- Ausência de policy de insert e select para anon é proposital: nega por padrão.
- A service role contorna a RLS e fica só dentro da Edge Function. Essa é a única porta de escrita.
- Qualquer policy de leitura interna é mudança sensível de RBAC e passa por gate humano (seção 14).

## 4. O que o cliente pode e não pode

| Ação | anon key (cliente) | service role (Edge Function) |
|---|---|---|
| Inserir lead direto na tabela | Não | Sim, via função |
| Ler a tabela leads | Não | Sim, controlado |
| Atualizar score ao fim da partida | Não direto | Sim, via função, amarrado ao id |

O cliente nunca fala com a tabela. Só com a função.

## 5. Checklist do Gate G0 (humano aprova antes de virar migration na M-03)

- [ ] Colunas e tipos aprovados.
- [ ] Decisão sobre genero: mantém no MVP ou já remove.
- [ ] Decisão sobre user_agent: mantém ou remove por minimização.
- [ ] Decisão sobre os CHECK de faixa e domínio.
- [ ] Estratégia de leitura interna escolhida (a ou b) e, se b, a claim do JWT aprovada.
- [ ] Prazo de retenção e procedimento de descarte ou anonimização definidos.
- [ ] Confirmado: nenhuma migration roda antes da M-03 e da aprovação manual do Guilherme.

## 6. Critérios de aceite da M-00 (parte schema e RLS)

- RLS habilitada e forçada, negação por padrão.
- Nenhuma leitura anônima possível.
- Escrita só via Edge Function com service role.
- Schema reflete as decisões de minimização do doc LGPD.
- Nada aqui executa: é proposta para o G0, vira migration na M-03.
