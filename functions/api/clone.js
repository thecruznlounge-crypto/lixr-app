/**
 * Lixr AI proxy for Cloudflare Pages Functions (same job as api/clone.php on cPanel).
 * Route: POST /api/clone
 * Set these in Cloudflare → Pages → lixr → Settings → Variables and Secrets:
 *   ANTHROPIC_API_KEY  (secret, required)
 *   LIXR_MODEL         (optional, default claude-sonnet-5-5)
 *   ANTHROPIC_WORKSPACE_ID (optional, needed only for keys not scoped to a workspace)
 *   ALLOWED_ORIGINS    (optional, comma-separated, e.g. https://lixr.app,https://www.lixr.app)
 *   REQUESTS_PER_HOUR  (optional, default 30; needs a KV binding named LIXR_KV to enforce)
 */
const GLASSES = ['rocks', 'highball', 'coupe', 'martini', 'hurricane', 'mug'];
const GARNISHES = ['pineapple', 'lime', 'strawberry', 'blackberry', 'mint', 'cream', 'beans', 'dragonfruit', 'orange', 'cherry', 'boba', 'none'];

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}

export async function onRequestOptions({ request, env }) {
  const origin = request.headers.get('origin') || '';
  return new Response(null, { headers: { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type', vary: 'origin' } });
}

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'AI cloning is not configured yet. Add ANTHROPIC_API_KEY in Cloudflare Pages settings.' }, 503);
  const origin = request.headers.get('origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (origin && allowed.length && !allowed.includes(origin)) return json({ error: 'Origin not allowed.' }, 403);
  const cors = origin ? { 'access-control-allow-origin': origin, vary: 'origin' } : {};

  // Rate limit (only when a KV namespace is bound as LIXR_KV).
  if (env.LIXR_KV) {
    const ip = request.headers.get('cf-connecting-ip') || 'x';
    const hour = new Date().toISOString().slice(0, 13);
    const key = 'rl:' + ip + ':' + hour;
    const n = parseInt((await env.LIXR_KV.get(key)) || '0', 10);
    if (n >= parseInt(env.REQUESTS_PER_HOUR || '30', 10)) return json({ error: 'You’ve cloned a lot this hour. Try again a little later.' }, 429, cors);
    await env.LIXR_KV.put(key, String(n + 1), { expirationTtl: 7200 });
  }

  let input;
  try { input = await request.json(); } catch (e) { return json({ error: 'Send a JSON body.' }, 400, cors); }
  const action = String(input.action || '');
  const query = String(input.query || '').trim().slice(0, 400);
  const image = String(input.image || '');
  const mocktailOnly = !!input.mocktailOnly;
  if (!['menu', 'photo', 'describe'].includes(action)) return json({ error: 'Unknown action.' }, 400, cors);
  if (action === 'describe' && query.length < 3) return json({ error: 'Describe the drink in a few words.' }, 400, cors);
  if (action !== 'describe' && (!image || image.length > 6500000 || !/^[A-Za-z0-9+/=]+$/.test(image))) return json({ error: 'That photo is too large or not a JPEG.' }, 400, cors);

  const rules = [
    'You are Lixr, a drink-cloning assistant. You write recipes people can make at home that taste as close as possible to the original.',
    'Rules:',
    '- Only handle drinks (cocktails, mocktails, coffee drinks, boba/tea, smoothies, sodas). If the input is not a drink, return an empty recipes list and a short friendly message.',
    '- Never put a brand or trademark in a recipe name. Use the drink\'s own name from the menu, or a descriptive generic name. In ingredients, use generic product types ("cognac", "coffee liqueur"), not brands.',
    '- Use US fluid ounces (unit "oz") for liquids where it makes sense; otherwise tsp, tbsp, cup, dash, pinch, shots, or an empty unit for counts. Amounts are numbers (0.5, not "1/2"). Use amt null for "to taste" items like ice.',
    '- 3 to 8 ingredients and 3 to 7 short, clear steps. Recipes serve 1 unless the drink is a pitcher or punch.',
    '- match: "Exact match" only for a well-known standard drink you are sure of, "Close match" when you are fairly confident, "Inspired by" when you are guessing.',
    '- glass, garnish, color and color2 drive the illustration: pick values that look like the real drink. color is the top of the liquid, color2 the bottom, both #RRGGBB.',
    '- Never include unsafe practices, non-food ingredients, or dangerous amounts of alcohol. No more than 3 oz of spirits per serving.',
    mocktailOnly
      ? '- The user only wants non-alcoholic drinks. Every recipe must be alcohol-free; set cat to "mocktail" (or coffee/boba) and leave out the mocktail field. If the original has alcohol, make the best non-alcoholic version.'
      : '- For every alcoholic recipe, also fill the mocktail field with a non-alcoholic version that keeps the same flavor.'
  ].join('\n');

  const content = [];
  if (action !== 'describe') content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } });
  if (action === 'menu') content.push({ type: 'text', text: 'This is a photo of a drink menu. Read the drinks on it (up to 8, in menu order) and clone each one from its name and listed ingredients. Keep each drink\'s menu name. If you can\'t read a menu, return an empty list and a message asking for a closer, brighter photo.' + (query ? '\nUser note: ' + query : '') });
  else if (action === 'photo') content.push({ type: 'text', text: 'This is a photo of a drink. Work out what it most likely is from its color, glass, garnish and any visible label or setting, and clone it as one recipe.' + (query ? '\nUser note: ' + query : '') });
  else content.push({ type: 'text', text: 'Clone this drink as one recipe. The user\'s description:\n"""\n' + query + '\n"""' });

  const ingredient = { type: 'object', properties: { amt: { type: ['number', 'null'] }, unit: { type: 'string' }, item: { type: 'string' } }, required: ['amt', 'unit', 'item'] };
  const parts = { ingredients: { type: 'array', items: ingredient }, steps: { type: 'array', items: { type: 'string' } } };
  const recipe = {
    type: 'object',
    properties: {
      name: { type: 'string' }, desc: { type: 'string', description: 'One sentence about the taste.' },
      cat: { type: 'string', enum: ['cocktail', 'mocktail', 'coffee', 'boba'] },
      glass: { type: 'string', enum: GLASSES }, garnish: { type: 'string', enum: GARNISHES },
      color: { type: 'string' }, color2: { type: 'string' },
      match: { type: 'string', enum: ['Exact match', 'Close match', 'Inspired by'] },
      serves: { type: 'integer' }, tags: { type: 'array', items: { type: 'string' } },
      mocktail: { type: 'object', properties: { ...parts, desc: { type: 'string' }, color: { type: 'string' }, color2: { type: 'string' } }, required: ['ingredients', 'steps'] },
      ...parts
    },
    required: ['name', 'desc', 'cat', 'glass', 'garnish', 'color', 'color2', 'match', 'serves', 'ingredients', 'steps']
  };

  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: Object.assign({ 'content-type': 'application/json', 'x-api-key': String(env.ANTHROPIC_API_KEY).trim(), 'anthropic-version': '2023-06-01' }, env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': String(env.ANTHROPIC_WORKSPACE_ID).trim() } : {}),
      body: JSON.stringify({
        model: env.LIXR_MODEL || 'claude-sonnet-5-5',
        max_tokens: action === 'menu' ? 6000 : 2000,
        system: rules,
        tools: [{ name: 'return_drinks', description: 'Return the cloned drink recipes.', input_schema: { type: 'object', properties: { recipes: { type: 'array', items: recipe }, message: { type: 'string', description: 'Short note for the user, only when recipes is empty.' } }, required: ['recipes'] } }],
        tool_choice: { type: 'tool', name: 'return_drinks' },
        messages: [{ role: 'user', content }]
      })
    });
  } catch (e) {
    return json({ error: 'The clone service is unreachable right now. Try again in a moment.' }, 502, cors);
  }
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 500);
    console.log('Lixr AI error', res.status, detail);
    const msg = res.status === 401 ? 'The AI key was rejected (401). Check ANTHROPIC_API_KEY is the full key, pasted as-is, and hasn’t expired.'
      : res.status === 403 ? 'The AI key isn’t allowed to do this (403). Check the key’s workspace in the Anthropic Console.'
      : res.status === 400 && /credit|billing|balance/i.test(detail) ? 'Your Anthropic account is out of credits (400). Add credits under Billing in the Console.'
      : /workspace/i.test(detail) ? 'This key needs a workspace (' + res.status + '). Add ANTHROPIC_WORKSPACE_ID in Cloudflare with the Workspace ID from the Console.'
      : res.status === 404 ? 'The AI model wasn’t found (404). Set LIXR_MODEL to a current model name.'
      : res.status === 429 ? 'Lixr is busy. Try again in a minute.'
      : 'The clone service had a problem (' + res.status + '). Try again in a moment.';
    return json({ error: msg }, res.status === 429 ? 429 : 502, cors);
  }
  const data = await res.json();
  const block = (data.content || []).find(b => b.type === 'tool_use' && b.name === 'return_drinks');
  if (!block) return json({ error: 'The clone service returned something unexpected. Try again.' }, 502, cors);
  const recipes = Array.isArray(block.input.recipes) ? block.input.recipes.slice(0, 8) : [];
  return json({ recipes, message: String(block.input.message || '') }, 200, cors);
}
