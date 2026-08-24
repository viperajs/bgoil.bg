<?php
declare(strict_types=1);

/* Малкият сървър зад админ панела: вход, смяна на паролата и запис на data/content.json.
   Нищо друго не прави и нищо друго не пипа. */

session_name('bgoiladm');
session_set_cookie_params([
  'httponly' => true,
  'samesite' => 'Strict',
  'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$CONFIG = __DIR__ . '/config.php';
$DATA   = __DIR__ . '/../data/content.json';

function out(array $a, int $code = 200): void {
  http_response_code($code);
  echo json_encode($a, JSON_UNESCAPED_UNICODE);
  exit;
}
function loadCfg(string $p): array {
  $c = @include $p;
  return is_array($c) ? $c : ['password_hash' => ''];
}
function saveCfg(string $p, string $hash): bool {
  $php = "<?php\n// Паролата се задава от админ панела. Тук се пази само защитен отпечатък.\nreturn ['password_hash' => " . var_export($hash, true) . "];\n";
  $tmp = $p . '.tmp';
  if (@file_put_contents($tmp, $php, LOCK_EX) === false) return false;
  if (!@rename($tmp, $p)) { @unlink($tmp); return false; }
  return true;
}

$cfg  = loadCfg($CONFIG);
$body = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $raw  = file_get_contents('php://input');
  $body = json_decode((string)$raw, true);
  if (!is_array($body)) out(['ok' => false, 'error' => 'bad_request'], 400);
}
$action = (string)($body['action'] ?? $_GET['action'] ?? '');
$isSetup = ($cfg['password_hash'] === '');

if ($action === 'status') {
  out([
    'ok'       => true,
    'php'      => true,
    'setup'    => $isSetup,
    'auth'     => !empty($_SESSION['auth']),
    'csrf'     => $_SESSION['csrf'] ?? null,
    'writable' => is_writable(dirname($DATA)) && (!file_exists($DATA) || is_writable($DATA)),
  ]);
}

if ($action === 'setup') {
  if (!$isSetup) out(['ok' => false, 'error' => 'already_set'], 409);
  $pw = (string)($body['password'] ?? '');
  if (mb_strlen($pw) < 8) out(['ok' => false, 'error' => 'too_short'], 400);
  $hash = password_hash($pw, PASSWORD_DEFAULT);
  if (!saveCfg($CONFIG, $hash)) out(['ok' => false, 'error' => 'config_not_writable'], 500);
  session_regenerate_id(true);
  $_SESSION['auth'] = true;
  $_SESSION['csrf'] = bin2hex(random_bytes(16));
  out(['ok' => true, 'csrf' => $_SESSION['csrf']]);
}

if ($action === 'login') {
  usleep(400000);                       // забавя опитите за налучкване
  $pw = (string)($body['password'] ?? '');
  if ($isSetup || $pw === '' || !password_verify($pw, (string)$cfg['password_hash'])) {
    out(['ok' => false, 'error' => 'bad_password'], 401);
  }
  session_regenerate_id(true);
  $_SESSION['auth'] = true;
  $_SESSION['csrf'] = bin2hex(random_bytes(16));
  out(['ok' => true, 'csrf' => $_SESSION['csrf']]);
}

/* всичко оттук нататък иска вход и валиден токен */
function requireAuth(array $body): void {
  if (empty($_SESSION['auth'])) out(['ok' => false, 'error' => 'not_logged_in'], 401);
  if (!hash_equals((string)($_SESSION['csrf'] ?? ''), (string)($body['csrf'] ?? ''))) {
    out(['ok' => false, 'error' => 'bad_token'], 403);
  }
}

if ($action === 'logout') { $_SESSION = []; session_destroy(); out(['ok' => true]); }

if ($action === 'chpass') {
  requireAuth($body);
  $old = (string)($body['old'] ?? '');
  $new = (string)($body['password'] ?? '');
  if (!password_verify($old, (string)$cfg['password_hash'])) out(['ok' => false, 'error' => 'bad_password'], 401);
  if (mb_strlen($new) < 8) out(['ok' => false, 'error' => 'too_short'], 400);
  if (!saveCfg($CONFIG, password_hash($new, PASSWORD_DEFAULT))) out(['ok' => false, 'error' => 'config_not_writable'], 500);
  out(['ok' => true]);
}

if ($action === 'save') {
  requireAuth($body);
  $in = $body['content'] ?? null;
  if (!is_array($in)) out(['ok' => false, 'error' => 'bad_content'], 400);

  $txt = function ($v, int $max = 200): string {
    // само текст: без тагове и без ъглови скоби, за всеки случай
    $v = strip_tags((string)$v);
    $v = str_replace(['<', '>'], '', $v);
    return mb_substr(trim($v), 0, $max);
  };

  $fuels = [];
  foreach ((array)($in['fuels'] ?? []) as $f) {
    if (!is_array($f)) continue;
    $price = (float)($f['price'] ?? 0);
    if ($price < 0) $price = 0;
    if ($price > 99) $price = 99;
    $fuels[] = ['bg' => $txt($f['bg'] ?? '', 40), 'en' => $txt($f['en'] ?? '', 40), 'price' => round($price, 2)];
    if (count($fuels) >= 12) break;
  }
  $disc = (float)($in['discount'] ?? 0.10);
  if ($disc < 0) $disc = 0;
  if ($disc > 5) $disc = 5;

  $c = (array)($in['contacts'] ?? []);
  $clean = [
    'updated'  => gmdate('Y-m-d H:i') . ' UTC',
    'discount' => round($disc, 2),
    'fuels'    => $fuels,
    'contacts' => [
      'station'      => $txt($c['station'] ?? '', 40),
      'hotel'        => $txt($c['hotel'] ?? '', 40),
      'service'      => $txt($c['service'] ?? '', 40),
      'email'        => $txt($c['email'] ?? '', 80),
      'emailService' => $txt($c['emailService'] ?? '', 80),
      'addressBg'    => $txt($c['addressBg'] ?? '', 160),
      'addressEn'    => $txt($c['addressEn'] ?? '', 160),
      'hoursBg'      => $txt($c['hoursBg'] ?? '', 120),
      'hoursEn'      => $txt($c['hoursEn'] ?? '', 120),
    ],
    'hotel' => ['available' => !empty($in['hotel']['available'])],
    'promo' => [
      'enabled' => !empty($in['promo']['enabled']),
      'bg'      => $txt($in['promo']['bg'] ?? '', 160),
      'en'      => $txt($in['promo']['en'] ?? '', 160),
    ],
  ];

  $json = json_encode($clean, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($json === false) out(['ok' => false, 'error' => 'encode_failed'], 500);

  $dir = dirname($DATA);
  if (!is_dir($dir) && !@mkdir($dir, 0755, true)) out(['ok' => false, 'error' => 'no_data_dir'], 500);
  $tmp = $DATA . '.tmp';
  if (@file_put_contents($tmp, $json, LOCK_EX) === false) out(['ok' => false, 'error' => 'write_failed'], 500);
  if (!@rename($tmp, $DATA)) { @unlink($tmp); out(['ok' => false, 'error' => 'rename_failed'], 500); }

  out(['ok' => true, 'updated' => $clean['updated'], 'content' => $clean]);
}

out(['ok' => false, 'error' => 'unknown_action'], 400);
