// Cabecalhos CORS compartilhados. A origem permitida vem de env para nao
// liberar geral. Em dev pode ser http://localhost:5173.
export function corsHeaders(origin: string): Record<string, string> {
  const allowed = Deno.env.get('ALLOWED_ORIGIN') ?? ''
  const allowOrigin = allowed === '' || allowed === origin ? origin : allowed
  return {
    'Access-Control-Allow-Origin': allowOrigin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  }
}
