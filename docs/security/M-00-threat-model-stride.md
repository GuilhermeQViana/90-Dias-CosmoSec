# M-00 · Threat Model STRIDE · Fluxo de captura de lead

Status: proposta para revisão no Gate G0. Nenhuma migration ou código de feature aqui.
Escopo: o caminho do dado desde o criador de personagem até a persistência e o email para contato@cosmosec.com.br.

## 1. Ativos a proteger

- Dado pessoal do lead: nome, email corporativo, cargo, gênero (opcional). Sob LGPD.
- Registro de consentimento: prova de que o titular autorizou o contato.
- Integridade da tabela leads: ninguém de fora insere lixo, ninguém lê a base.
- Segredos: chave do Resend, service role key do Supabase. Nunca no cliente.
- Reputação de envio: o domínio que dispara email para contato@cosmosec.com.br não pode virar fonte de spam.

## 2. Fluxo de dados (DFD textual)

1. Navegador do usuário preenche a ficha do Guardião (React).
2. Cliente faz POST para a Edge Function capture-lead (Deno, sa-east-1).
3. A função valida, insere em leads via service role, dispara email via Resend.
4. Ao fim da partida, segundo POST atualiza modo_jogado e score_final.

Fronteiras de confiança:
- A: navegador para Edge Function (entrada não confiável, exposta à internet).
- B: Edge Function para Postgres (service role, dentro do Supabase).
- C: Edge Function para Resend (saída para terceiro).

## 3. Análise STRIDE por fronteira

### Fronteira A · Navegador para Edge Function

| Categoria | Ameaça | Mitigação proposta |
|---|---|---|
| Spoofing | Bot finge ser usuário e inunda a função com leads falsos. | Honeypot escondido, rate limit por IP, Cloudflare Turnstile opcional. Nenhum dado sensível confia só no cliente. |
| Tampering | Cliente envia origem, score ou consentimento forjados. | Servidor força origem para jogo-90dias, ignora qualquer origem vinda do cliente. Consentimento exige valor booleano explícito true, senão rejeita. Score validado por faixa 0 a 100. |
| Repudiation | Titular nega ter consentido. | Registrar created_at, user_agent e o booleano consentimento no insert. Consentimento só é gravado se chegou true no payload validado. |
| Information disclosure | Resposta da função vaza dados de outros leads ou stack traces. | Função responde apenas ok ou erro genérico. Nunca ecoa a base. Sem leitura anônima (ver RLS). |
| Denial of service | Flood de POST esgota a função ou a cota do Resend. | Rate limit por IP na função, Turnstile, limite de tamanho do payload, timeout curto. Falha de captura nunca bloqueia o jogo. |
| Elevation of privilege | Cliente tenta usar credencial de service role. | Service role só existe dentro da Edge Function como secret. O cliente usa apenas a anon key e só enxerga a função, nunca a tabela. |

### Fronteira B · Edge Function para Postgres

| Categoria | Ameaça | Mitigação proposta |
|---|---|---|
| Tampering | SQL injection via campos do lead. | Cliente Supabase parametrizado, sem concatenação de SQL. Validação de tipo e tamanho antes do insert. |
| Information disclosure | RLS mal configurada permite leitura anônima. | RLS habilitada, sem policy de select para anon ou authenticated. Leitura só para perfis internos. Ver doc de schema e RLS. |
| Elevation of privilege | Update do segundo POST sobrescreve registros de outros. | Update amarrado a um id de lead emitido no primeiro POST, validado pela função. Sem update livre a partir do cliente. |

### Fronteira C · Edge Function para Resend

| Categoria | Ameaça | Mitigação proposta |
|---|---|---|
| Spoofing | Email forjado em nome da CosmoSec. | Remetente fixo em domínio verificado no Resend, SPF, DKIM e DMARC configurados. Chave do Resend como secret. |
| Information disclosure | Conteúdo do email vaza dado além do necessário. | Email para contato@cosmosec.com.br traz só o mínimo do lead. Sem PII extra, sem o user_agent completo se não for necessário. |
| Denial of service | Abuso da função queima a cota e a reputação do Resend. | Mesmo rate limit da fronteira A. Reenvio em background com backoff, sem laço infinito. |

## 4. Decisões de design que caem do threat model

- O servidor é a fonte da verdade para origem, consentimento e faixa de score. O cliente nunca é confiado.
- Falha de captura degrada graciosamente: o jogo começa mesmo assim, a função tenta reenvio em background, o usuário nunca é bloqueado.
- Segredos só no Supabase. Repositório e bundle do cliente não contêm chave nenhuma.
- Resposta da função é opaca: ok ou erro genérico, sem detalhe que ajude um atacante.

## 5. Itens do Gate G0 (resolvido em 2026-06-17)

- user_agent: mantido para anti-abuso e suporte. Decisão em M-00-G0-decisoes.md.
- Em aberto para a M-03, não bloqueiam o G0: Turnstile já no MVP ou como flag, e a janela e o limite exatos do rate limit por IP. Definir junto com a Edge Function.

## 6. Critérios de aceite da M-00 (parte threat model)

- Todo campo de entrada do cliente tem uma linha de mitigação.
- Nenhum segredo aparece no cliente.
- O caminho de falha de captura está descrito e não bloqueia o jogador.
- As três fronteiras de confiança estão cobertas em todas as letras do STRIDE relevantes.
