/**
 * Lixr "Report this result" for Cloudflare Pages Functions.
 * Route: POST /api/report
 * Stores each report in the KV namespace bound as LIXR_KV (key "report:<time>"), if bound.
 * Without KV, reports still show up in the Functions log (Pages → lixr → Functions → Logs).
 */
export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean);
  if (origin && allowed.length && !allowed.includes(origin)) return new Response('{"error":"Origin not allowed."}', { status: 403 });
  let input;
  try { input = await request.json(); } catch (e) { return new Response('{"error":"Send a JSON body."}', { status: 400 }); }
  const entry = {
    at: new Date().toISOString(),
    name: String(input.name || '').slice(0, 80),
    reason: String(input.reason || '').slice(0, 60),
    note: String(input.note || '').slice(0, 300),
    recipe: input.recipe || null
  };
  const line = JSON.stringify(entry).slice(0, 40000);
  if (env.LIXR_KV) await env.LIXR_KV.put('report:' + entry.at + ':' + Math.random().toString(36).slice(2, 6), line);
  console.log('Lixr report', line);
  return new Response('{"ok":true}', { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
