# M-00 · Schema da tabela leads e políticas RLS

Status: Gate G0 fechado em 2026-06-17. Decisões em M-00-G0-decisoes.md.
Este documento NÃO é uma migration e NÃO deve ser executado.
A migration executável será criada na M-03 e aplicada manualmente pelo Guilherme após o Gate G1.
Nenhum banco remoto é tocado aqui. Sem supabase link, sem supabase push.

## 1. Schema final (vira migration na M-03)

```sql
-- BASE DA MIGRATION DA M-03. NÃO EXECUTAR AINDA.
create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  nome          text not null,
  email         text not null,
  genero        text,                         -- opcional: Feminino, Masculino, Outro (G0)
  cargo         text not null,
  consentimento boolean not null,             -- a função só insere com true
  origem        text not null default 'jogo-90dias',
  modo_jogado   text,                         -- preenchido no segundo POST, ao fim da partida
  score_final   integer,                      -- 0 a 100, preenchido no segundo POST
  user_agent    text                          -- mantido para anti-abuso e suporte (G0)
);
```

Notas de design:
- id uuid em vez de serial: não revela volume de leads nem permite enumeração.
- created_at com default now() no servidor, nunca vindo do cliente.
- origem com default jogo-90dias e forçada pela função. O cliente não decide origem.
- consentimento sem default: a função só faz insert quando o payload validado traz true. Assim o booleano nunca fica ambíguo.
- genero opcional: deixar nulo equivale a não informar. Não há opção Prefiro não informar pois o opcional já cobre o opt-out (G0).

## 2. Constraints CHECK (aprovadas no G0, defesa em profundidade)

```sql
-- Entram na migration da M-03 junto com a tabela.
alter table public.leads add constraint leads_score_range
  check (score_final is null or (score_final between 0 and 100));

alter table public.leads add constraint leads_genero_dominio
  check (genero is null or genero in ('Feminino','Masculino','Outro'));

alter table public.leads add constraint leads_cargo_dominio
  check (cargo in ('CISO','Gerente de Segurança da Informação','Analista de Segurança da Informação',
    'Gerente de Risco Operacional','Analista de Risco Operacional','Gerente de Compliance',
    'Analista de Compliance','Outro'));
```

A validação primária mora na Edge Function. O CHECK no banco é defesa em profundidade: mesmo que a função tenha um bug, o banco rejeita valor fora do domínio.

## 3. Políticas RLS (G0: opção a, negação por padrão)

Regra de ouro: insert e update apenas via Edge Function com service role. Nenhuma leitura anônima. Leitura só via service role em ferramenta interna autenticada.

```sql
-- BASE DA MIGRATION DA M-03. NÃO EXECUTAR AINDA.

-- 1. Liga a RLS. Sem policy, ninguém passa.
alter table public.leads enable row level security;

-- 2. Garante que nem o dono da tabela escapa da RLS por engano.
alter table public.leads force row level security;

-- 3. Nenhuma policy para anon nem para authenticated.
--    Resultado: cliente com anon key NÃO lê, NÃO insere, NÃO atualiza a tabela direto.
--    A Edge Function usa a service role, que por padrão contorna a RLS, e é a
--    única via de escrita. A leitura interna também passa pela service role,
--    dentro de ferramenta autenticada. Nenhuma claim de JWT exposta na tabela.
```

Por que a opção (a) e não a (b):
- Menor superfície de ataque: sem policy de select, não há regra de leitura para um atacante explorar nem claim de JWT para forjar.
- Negação por padrão é o estado mais seguro. Abrir leitura por role dedicada (opção b) fica para quando houver uma ferramenta interna multiusuário que justifique, e será mudança de RBAC sob gate humano (seção 14).
- force row level security evita o furo clássico de o owner da tabela ignorar a RLS.

## 4. O que o cliente pode e não pode

| Ação | anon key (cliente) | service role (Edge Function) |
|---|---|---|
| Inserir lead direto na tabela | Não | Sim, via função |
| Ler a tabela leads | Não | Sim, via ferramenta interna autenticada |
| Atualizar score ao fim da partida | Não direto | Sim, via função, amarrado ao id |

O cliente nunca fala com a tabela. Só com a função.

## 5. Gate G0 · resolvido em 2026-06-17

- [x] Colunas e tipos aprovados.
- [x] genero mantido. Domínio Feminino, Masculino, Outro. Opcional.
- [x] user_agent mantido para anti-abuso e suporte.
- [x] CHECK de faixa e domínio entram no banco.
- [x] Estratégia de leitura interna: opção (a), negação por padrão, só service role.
- [x] Retenção e descarte definidos no doc LGPD: revisão após 24 meses, revogação dispara descarte ou anonimização.
- [x] Confirmado: nenhuma migration roda antes da M-03 e da aprovação manual do Guilherme.

## 6. Critérios de aceite da M-00 (parte schema e RLS)

- RLS habilitada e forçada, negação por padrão.
- Nenhuma leitura anônima possível.
- Escrita só via Edge Function com service role.
- Schema reflete as decisões de minimização e do G0.
- Nada aqui executa: vira migration na M-03 sob Gate G1.
