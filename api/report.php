<?php
/**
 * Lixr — "Report this result" for AI clones (a Google Play requirement for AI-generated content).
 * Appends each report as one JSON line to api/reports.log, which .htaccess blocks from the web.
 * Optionally emails you if report_email is set in config.php.
 */
declare(strict_types=1);
if (!function_exists('mb_substr')) { function mb_substr($s, $a, $l = null) { return $l === null ? substr($s, $a) : substr($s, $a, $l); } }
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$cfg = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && !empty($cfg['allowed_origins']) && !in_array($origin, $cfg['allowed_origins'], true)) { http_response_code(403); exit('{"error":"Origin not allowed."}'); }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); exit('{"error":"Use POST."}'); }

$in = json_decode((string)file_get_contents('php://input', false, null, 0, 60000), true);
if (!is_array($in)) { http_response_code(400); exit('{"error":"Send a JSON body."}'); }

// Simple per-IP limit: 20 reports per hour.
$dir = __DIR__ . '/.ratelimit';
if (!is_dir($dir)) @mkdir($dir, 0700, true);
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'x';
$f = $dir . '/r' . hash('sha256', $ip . date('YmdH'));
$n = (int)@file_get_contents($f);
if ($n >= 20) { http_response_code(429); exit('{"error":"Too many reports. Try later."}'); }
@file_put_contents($f, (string)($n + 1), LOCK_EX);

$entry = [
    'at' => gmdate('c'),
    'name' => mb_substr((string)($in['name'] ?? ''), 0, 80),
    'reason' => mb_substr((string)($in['reason'] ?? ''), 0, 60),
    'note' => mb_substr((string)($in['note'] ?? ''), 0, 300),
    'recipe' => $in['recipe'] ?? null
];
$line = json_encode($entry, JSON_UNESCAPED_UNICODE);
if (strlen($line) > 40000) $line = json_encode(array_merge($entry, ['recipe' => '[too large]']));
file_put_contents(__DIR__ . '/reports.log', $line . "\n", FILE_APPEND | LOCK_EX);

if (!empty($cfg['report_email'])) {
    @mail($cfg['report_email'], 'Lixr report: ' . $entry['reason'], "Drink: {$entry['name']}\nReason: {$entry['reason']}\nNote: {$entry['note']}\n");
}
echo '{"ok":true}';
