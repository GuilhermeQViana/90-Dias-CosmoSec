# M-00 · Gate G0 · Registro de decisões

Decisões tomadas por Guilherme (controlador) em 2026-06-17. Fecham o Gate G0.
A migration executável nasce na M-03 com base nestas decisões e é aplicada
manualmente após o Gate G1. Nada roda no banco antes disso.

## Decisões

1. Campo genero: mantido. Domínio: Feminino, Masculino, Outro. Campo opcional,
   então deixar em branco equivale a não informar. Sem a opção Prefiro não informar,
   já que o opcional cobre o opt-out.
2. Campo user_agent: mantido. Justificativa: anti-abuso e suporte.
3. Constraints CHECK: entram no banco como defesa em profundidade, além da
   validação na Edge Function. Faixa de score, domínio de genero e domínio de cargo.
4. Estratégia de leitura interna: escolha delegada ao Claude com criterio de
   maior segurança. Decidido: opção (a), negação por padrão. Nenhuma policy de
   select para anon ou authenticated. Leitura só via service role dentro de
   ferramenta interna autenticada. Menor superfície de ataque, sem claim de JWT
   exposta. Ver doc de schema e RLS.
5. Retenção e descarte: seguir LGPD. Proposta aprovada: reter enquanto houver
   interesse de contato dentro da finalidade consentida; revisar leads sem
   interação após 24 meses para descarte ou anonimização; revogação de
   consentimento dispara descarte ou anonimização. Procedimento manual no MVP,
   via perfil interno. Ver doc LGPD.
6. Envio de email: destino único contato@cosmosec.com.br. O disparo é feito pela
   Edge Function do Supabase (server-side), chamando o provedor Resend com a chave
   como secret no Supabase. Remetente em domínio verificado. Transferência
   internacional do Resend registrada e tratada conforme LGPD (ver doc LGPD).
   Alternativa em aberto: trocar Resend por SMTP em região BR se quiser evitar a
   transferência internacional. Decisão pode ser revista na M-03.

## Efeito nas missões seguintes

- M-02: formulário do criador de personagem usa genero com três opções, mantém
  o consentimento obrigatório e o honeypot. Backend mockado.
- M-03: migration da tabela leads com os CHECK aprovados, RLS opção (a), e a
  Edge Function capture-lead enviando via Resend para contato@cosmosec.com.br.
  Gate G1 antes de aplicar a migration.
