# M-00 · Modelagem de privacidade LGPD · Captura de lead

Status: proposta para revisão no Gate G0. Nenhuma migration ou código de feature aqui.

## 1. Papéis

- Controlador: CosmoSec, que decide a finalidade e os meios do tratamento.
- Operadores: Supabase (persistência, sa-east-1) e Resend (envio de email), que tratam dados em nome do controlador.
- Titular: o jogador que preenche a ficha do Guardião.

## 2. Finalidade e base legal

- Finalidade única e declarada: entrar em contato sobre o jogo 90 Dias e os produtos da CosmoSec.
- Base legal: consentimento do titular, coletado por checkbox obrigatório e desmarcado por padrão. Sem o checkbox, o botão Iniciar fica desabilitado.
- O consentimento é específico para essa finalidade. Nada de uso para finalidade nova sem novo consentimento.

## 3. Dados coletados e minimização

| Campo | Necessário | Sensível | Justificativa de minimização |
|---|---|---|---|
| nome | Sim | Não | Identifica o Guardião e personaliza o contato. |
| email | Sim | Não | Canal de contato B2B. É o dado central da finalidade. |
| cargo | Sim | Não | Qualifica o lead de GRC. Baixo risco. |
| genero | Não | Pode ser sensível | Baixo valor para lead B2B. Mantido como pedido, opcional, com Prefiro não informar. Recomendação registrada de remover numa versão futura. |
| consentimento | Sim | Não | Prova da base legal. Obrigatório true. |
| user_agent | A confirmar | Não | Útil para anti-abuso e suporte, mas é dado de navegação. Avaliar no G0 se fica ou sai por minimização. |
| modo_jogado, score_final | Não pessoal | Não | Dado de jogo, não identifica o titular sozinho. |

Princípio: coletar o mínimo. Gênero e user_agent são os dois pontos de atrito com a minimização. Decisão fica com o humano no G0.

## 4. Direitos do titular

A política de privacidade linkada no criador de personagem deve cobrir:
- Confirmação de existência de tratamento e acesso aos dados.
- Correção de dados incompletos ou desatualizados.
- Eliminação dos dados tratados com base no consentimento.
- Revogação do consentimento a qualquer momento, de forma tão fácil quanto consentir.
- Canal do encarregado para exercer os direitos.

Implicação técnica: a base precisa permitir localizar por email e apagar ou anonimizar um registro sob pedido. Operação manual no MVP, via perfil interno. Documentar o procedimento.

## 5. Retenção e descarte

- Reter enquanto houver relação comercial ativa ou interesse de contato, dentro da finalidade consentida.
- Definir um prazo de revisão. Proposta inicial: revisar leads sem interação após 24 meses, com descarte ou anonimização. Confirmar no G0.
- Revogação de consentimento dispara descarte ou anonimização do registro.

## 6. Segurança do dado

- Em trânsito: HTTPS em todas as fronteiras.
- Em repouso: Postgres gerenciado do Supabase, sa-east-1 (residência no Brasil).
- Acesso restrito: RLS sem leitura anônima, leitura só para perfis internos. Ver doc de schema e RLS.
- Segredos fora do cliente. Ver threat model.

## 7. Transferência internacional

- Resend pode processar fora do Brasil. Tratar como transferência internacional: registrar o operador, garantir cláusulas adequadas e mencionar na política de privacidade. Confirmar a região do Resend no G0.

## 8. Transparência e consentimento (texto da UI)

- Checkbox, obrigatório, desmarcado por padrão: autorizo a CosmoSec a entrar em contato sobre o jogo e seus produtos. Meus dados são tratados conforme a LGPD.
- Link visível para a política de privacidade.
- Sem overclaim de privacidade. Não afirmar conformidade com a ANPD nem certificação. Nada de aprovado pela ANPD.

## 9. Itens que dependem do Gate G0

- Manter ou remover genero já no MVP.
- Manter ou remover user_agent por minimização.
- Prazo de retenção e gatilho de revisão.
- Confirmar região e cláusulas do Resend para a transferência internacional.
- Texto final e URL da política de privacidade.

## 10. Critérios de aceite da M-00 (parte LGPD)

- Toda coluna pessoal tem finalidade e justificativa de minimização.
- Base legal é consentimento, registrado e revogável.
- Direitos do titular mapeados para um procedimento, ainda que manual.
- Residência sa-east-1 e transferência internacional do Resend tratadas.
- Nenhum overclaim de privacidade na copy.
