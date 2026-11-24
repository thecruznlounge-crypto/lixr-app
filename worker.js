/**
 * Lixr Worker entry (used when the repo is deployed as a Cloudflare Worker).
 * Reuses the same handlers as Cloudflare Pages Functions in functions/api/.
 * Everything that isn't /api/* is served from the static files.
 */
import * as clone from './functions/api/clone.js';
import * as report from './functions/api/report.js';

const ROUTES = { '/api/clone': clone, '/api/report': report };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const mod = ROUTES[url.pathname.replace(/\.php$/, '')];
    if (mod) {
      const handler = request.method === 'POST' ? mod.onRequestPost : request.method === 'OPTIONS' ? mod.onRequestOptions : null;
      if (!handler) return new Response('{"error":"Use POST."}', { status: 405, headers: { 'content-type': 'application/json' } });
      return handler({ request, env, ctx });
    }
    if (url.pathname.startsWith('/api/')) return new Response('{"error":"Not found."}', { status: 404, headers: { 'content-type': 'application/json' } });
    return env.ASSETS.fetch(request);
  }
};
