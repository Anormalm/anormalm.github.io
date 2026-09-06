import { readArchive, recordSignal } from './signalStore.js';

const TRUSTED_ORIGINS = new Set([
  'https://anormalm.com',
  'https://www.anormalm.com',
  'https://anormalm.github.io',
]);

const isTrustedOrigin = (origin) => {
  if (!origin) return true;
  if (TRUSTED_ORIGINS.has(origin)) return true;
  return /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin);
};

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin && isTrustedOrigin(origin) ? origin : 'https://anormalm.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  Vary: 'Origin',
});

const json = (payload, status, origin) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    ...corsHeaders(origin),
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return isTrustedOrigin(origin)
        ? new Response(null, { status: 204, headers: corsHeaders(origin) })
        : new Response(null, { status: 403 });
    }

    if (url.pathname !== '/api/signals') {
      return json({ status: 'visitor signal archive online' }, 200, origin);
    }

    if (request.method === 'POST') {
      if (!isTrustedOrigin(origin)) return json({ error: 'origin not allowed' }, 403, origin);
      await recordSignal(env.DB, request);
      return json({ recorded: true }, 201, origin);
    }

    if (request.method === 'GET') {
      return json(await readArchive(env.DB), 200, origin);
    }

    return json({ error: 'method not allowed' }, 405, origin);
  },
};
