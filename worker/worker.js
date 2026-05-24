const ALLOWED_ORIGINS = [
  'https://justforphishing.com',
  'https://www.justforphishing.com',
  'http://localhost:8080',
  'http://localhost:3000',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400, origin);
    }

    const email = (body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return json({ error: 'Invalid email address' }, 400, origin);
    }

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify({ email, listIds: [3], updateEnabled: true }),
    });

    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return json({ ok: true }, 200, origin);
    }

    const err = await brevoRes.json().catch(() => ({}));
    return json({ error: err.message || 'Subscription failed' }, 502, origin);
  },
};
