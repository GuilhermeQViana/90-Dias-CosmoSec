-- Migration: tabela leads do jogo 90 Dias.
-- Base: decisoes do Gate G0 em docs/security/M-00-G0-decisoes.md.
--
-- ATENCAO: NAO aplicar automaticamente. Guilherme aplica manualmente apos o
-- Gate G1. Nenhum supabase link, nenhum supabase push sem confirmacao explicita.
-- Residencia de dados: projeto na regiao sa-east-1.

create extension if not exists "pgcrypto"; -- para gen_random_uuid

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  nome          text not null,
  email         text not null,
  genero        text,
  cargo         text not null,
  consentimento boolean not null,
  origem        text not null default 'jogo-90dias',
  modo_jogado   text,
  score_final   integer,
  user_agent    text
);

comment on table public.leads is 'Leads capturados pelo jogo 90 Dias. Base legal: consentimento. Finalidade: contato sobre o jogo e produtos CosmoSec.';
comment on column public.leads.consentimento is 'Prova do consentimento LGPD. A Edge Function so insere com valor true.';
comment on column public.leads.genero is 'Opcional. Nulo equivale a nao informado.';

-- Constraints CHECK, defesa em profundidade alem da validacao na Edge Function.
alter table public.leads
  add constraint leads_score_range
  check (score_final is null or (score_final between 0 and 100));

alter table public.leads
  add constraint leads_genero_dominio
  check (genero is null or genero in ('Feminino', 'Masculino', 'Outro'));

alter table public.leads
  add constraint leads_cargo_dominio
  check (cargo in (
    'CISO',
    'Gerente de Segurança da Informação',
    'Analista de Segurança da Informação',
    'Gerente de Risco Operacional',
    'Analista de Risco Operacional',
    'Gerente de Compliance',
    'Analista de Compliance',
    'Outro'
  ));

alter table public.leads
  add constraint leads_consentimento_true
  check (consentimento = true);

-- Indice por email para localizar registros em pedidos de titular (LGPD).
create index if not exists leads_email_idx on public.leads (lower(email));

-- RLS: opcao (a) do G0, negacao por padrao.
-- Sem policy para anon nem authenticated. So a service role escreve e le,
-- de dentro da Edge Function ou de ferramenta interna autenticada.
alter table public.leads enable row level security;
alter table public.leads force row level security;

-- Nenhuma policy criada de proposito. RLS ligada sem policy nega tudo para
-- roles publicas. A service role contorna a RLS e e a unica via de acesso.
