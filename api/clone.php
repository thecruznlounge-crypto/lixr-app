<?php
/**
 * Lixr AI proxy — keeps your Anthropic API key on the server.
 * POST JSON { action: "menu" | "photo" | "describe", query?: string, image?: base64 JPEG, mocktailOnly?: bool }
 * Returns   { recipes: [ ... ], message?: string }
 * Works on any cPanel host with PHP 7.4+ and cURL.
 */
declare(strict_types=1);
if (!function_exists('mb_substr')) { function mb_substr($s, $a, $l = null) { return $l === null ? substr($s, $a) : substr($s, $a, $l); } }
if (!function_exists('mb_strlen')) { function mb_strlen($s) { return strlen($s); } }
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$cfgFile = __DIR__ . '/config.php';
if (!file_exists($cfgFile)) fail(503, 'AI cloning is not configured on the server yet. Copy api/config.sample.php to api/config.php and add your key.');
$cfg = require $cfgFile;

// ---- CORS: only your own site (the Play Store app loads your site, so it counts) ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && !in_array($origin, $cfg['allowed_origins'] ?? [], true)) fail(403, 'Origin not allowed.');
if ($origin) { header("Access-Control-Allow-Origin: $origin"); header('Vary: Origin'); }
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { header('Access-Control-Allow-Methods: POST'); header('Access-Control-Allow-Headers: Content-Type'); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail(405, 'Use POST.');

$raw = file_get_contents('php://input', false, null, 0, 7000000);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) fail(400, 'Send a JSON body.');

rateLimit((int)($cfg['requests_per_hour'] ?? 30));

$action = (string)($in['action'] ?? '');
$query = trim(mb_substr((string)($in['query'] ?? ''), 0, 400));
$image = (string)($in['image'] ?? '');
$mocktailOnly = !empty($in['mocktailOnly']);

if (!in_array($action, ['menu', 'photo', 'describe'], true)) fail(400, 'Unknown action.');
if ($action === 'describe' && mb_strlen($query) < 3) fail(400, 'Describe the drink in a few words.');
if ($action !== 'describe') {
    if ($image === '') fail(400, 'Add a photo first.');
    if (strlen($image) > 6500000 || !preg_match('/^[A-Za-z0-9+\/=]+$/', $image)) fail(400, 'That photo is too large or not a JPEG.');
}

// ---- Prompt ----
$rules = "You are Lixr, a drink-cloning assistant. You write recipes people can make at home that taste as close as possible to the original.\n"
  . "Rules:\n"
  . "- Only handle drinks (cocktails, mocktails, coffee drinks, boba/tea, smoothies, sodas). If the input is not a drink, return an empty recipes list and a short friendly message.\n"
  . "- Never put a brand or trademark in a recipe name. Use the drink's own name from the menu, or a descriptive generic name. In ingredients, use generic product types (\"cognac\", \"coffee liqueur\"), not brands.\n"
  . "- Use US fluid ounces (unit \"oz\") for liquids where it makes sense; otherwise tsp, tbsp, cup, dash, pinch, shots, or an empty unit for counts. Amounts are numbers (0.5, not \"1/2\"). Use amt null for \"to taste\" items like ice.\n"
  . "- 3 to 8 ingredients and 3 to 7 short, clear steps. Recipes serve 1 unless the drink is a pitcher or punch.\n"
  . "- match: \"Exact match\" only for a well-known standard drink you are sure of, \"Close match\" when you are fairly confident, \"Inspired by\" when you are guessing.\n"
  . "- glass, garnish, color and color2 drive the illustration: pick values that look like the real drink. color is the top of the liquid, color2 the bottom, both #RRGGBB.\n"
  . "- Never include unsafe practices, non-food ingredients, or dangerous amounts of alcohol. No more than 3 oz of spirits per serving.\n"
  . ($mocktailOnly
      ? "- The user only wants non-alcoholic drinks. Every recipe must be alcohol-free; set cat to \"mocktail\" (or coffee/boba) and leave out the mocktail field. If the original has alcohol, make the best non-alcoholic version.\n"
      : "- For every alcoholic recipe, also fill the mocktail field with a non-alcoholic version that keeps the same flavor.\n");

$content = [];
if ($action !== 'describe') {
    $content[] = ['type' => 'image', 'source' => ['type' => 'base64', 'media_type' => 'image/jpeg', 'data' => $image]];
}
if ($action === 'menu') {
    $content[] = ['type' => 'text', 'text' => "This is a photo of a drink menu. Read the drinks on it (up to 8, in menu order) and clone each one from its name and listed ingredients. Keep each drink's menu name. If you can't read a menu, return an empty list and a message asking for a closer, brighter photo." . ($query ? "\nUser note: $query" : '')];
} elseif ($action === 'photo') {
    $content[] = ['type' => 'text', 'text' => "This is a photo of a drink. Work out what it most likely is from its color, glass, garnish and any visible label or setting, and clone it as one recipe." . ($query ? "\nUser note: $query" : '')];
} else {
    $content[] = ['type' => 'text', 'text' => "Clone this drink as one recipe. The user's description:\n\"\"\"\n$query\n\"\"\""];
}

$ingredient = ['type' => 'object', 'properties' => [
    'amt' => ['type' => ['number', 'null']], 'unit' => ['type' => 'string'], 'item' => ['type' => 'string']
], 'required' => ['amt', 'unit', 'item']];
$parts = [
    'ingredients' => ['type' => 'array', 'items' => $ingredient],
    'steps' => ['type' => 'array', 'items' => ['type' => 'string']]
];
$recipe = ['type' => 'object', 'properties' => array_merge([
    'name' => ['type' => 'string'],
    'desc' => ['type' => 'string', 'description' => 'One sentence about the taste.'],
    'cat' => ['type' => 'string', 'enum' => ['cocktail', 'mocktail', 'coffee', 'boba']],
    'glass' => ['type' => 'string', 'enum' => ['rocks', 'highball', 'coupe', 'martini', 'hurricane', 'mug']],
    'garnish' => ['type' => 'string', 'enum' => ['pineapple', 'lime', 'strawberry', 'blackberry', 'mint', 'cream', 'beans', 'dragonfruit', 'orange', 'cherry', 'boba', 'none']],
    'color' => ['type' => 'string'], 'color2' => ['type' => 'string'],
    'match' => ['type' => 'string', 'enum' => ['Exact match', 'Close match', 'Inspired by']],
    'serves' => ['type' => 'integer'],
    'tags' => ['type' => 'array', 'items' => ['type' => 'string']],
    'mocktail' => ['type' => 'object', 'properties' => array_merge($parts, ['desc' => ['type' => 'string'], 'color' => ['type' => 'string'], 'color2' => ['type' => 'string']]), 'required' => ['ingredients', 'steps']]
], $parts), 'required' => ['name', 'desc', 'cat', 'glass', 'garnish', 'color', 'color2', 'match', 'serves', 'ingredients', 'steps']];

$payload = [
    'model' => $cfg['model'] ?? 'claude-sonnet-5-5',
    'max_tokens' => $action === 'menu' ? 6000 : 2000,
    'system' => $rules,
    'tools' => [[
        'name' => 'return_drinks',
        'description' => 'Return the cloned drink recipes.',
        'input_schema' => ['type' => 'object', 'properties' => [
            'recipes' => ['type' => 'array', 'items' => $recipe],
            'message' => ['type' => 'string', 'description' => 'Short note for the user, only when recipes is empty.']
        ], 'required' => ['recipes']]
    ]],
    'tool_choice' => ['type' => 'tool', 'name' => 'return_drinks'],
    'messages' => [['role' => 'user', 'content' => $content]]
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 55,
    CURLOPT_HTTPHEADER => [
        'content-type: application/json',
        'x-api-key: ' . ($cfg['anthropic_api_key'] ?? ''),
        'anthropic-version: 2023-06-01'
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);
$resp = curl_exec($ch);
$code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
if (PHP_VERSION_ID < 80000) curl_close($ch);

if ($resp === false) fail(502, 'The clone service is unreachable right now. Try again in a moment.');
$data = json_decode($resp, true);
if ($code !== 200) {
    error_log('Lixr AI error ' . $code . ': ' . substr((string)$resp, 0, 500) . ' ' . $err);
    fail($code === 429 ? 429 : 502, $code === 429 ? 'Lixr is busy. Try again in a minute.' : 'The clone service had a problem. Try again in a moment.');
}
$out = null;
foreach (($data['content'] ?? []) as $block) {
    if (($block['type'] ?? '') === 'tool_use' && ($block['name'] ?? '') === 'return_drinks') { $out = $block['input']; break; }
}
if (!is_array($out)) fail(502, 'The clone service returned something unexpected. Try again.');
$recipes = array_slice(is_array($out['recipes'] ?? null) ? $out['recipes'] : [], 0, 8);
echo json_encode(['recipes' => $recipes, 'message' => (string)($out['message'] ?? '')], JSON_UNESCAPED_UNICODE);

// ---------- helpers ----------
function fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

function rateLimit(int $perHour): void {
    $dir = __DIR__ . '/.ratelimit';
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'x';
    $file = $dir . '/' . hash('sha256', $ip . date('YmdH'));
    $n = (int)@file_get_contents($file);
    if ($n >= $perHour) fail(429, 'You\'ve cloned a lot this hour. Try again a little later.');
    @file_put_contents($file, (string)($n + 1), LOCK_EX);
    // Tidy up old counters now and then.
    if (mt_rand(1, 50) === 1) foreach (glob($dir . '/*') ?: [] as $f) if (filemtime($f) < time() - 7200) @unlink($f);
}
