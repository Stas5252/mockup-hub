<?php
// REG.RU's local mail transport is configured by the hosting account.
// No SMTP password, arbitrary recipient, or customer data in URLs.
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');

const CONSENT_VERSION = '2026-10-14-mail';
const RECIPIENT = 'dom196@list.ru';
const SENDER = 'info@remontekt.ru';

function respond(int $status, array $data): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function fail(int $status, string $message): never {
    respond($status, ['ok' => false, 'message' => $message]);
}
function saveJson(string $path, array $data): void {
    $tmp = $path . '.tmp';
    $written = file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);
    if ($written === false || !rename($tmp, $path)) {
        throw new RuntimeException('Private record write failed');
    }
    chmod($path, 0600);
}
function textField(array $data, string $key, int $limit, bool $singleLine = false): string {
    $value = $data[$key] ?? '';
    if (!is_string($value) || !preg_match('//u', $value) || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
        fail(422, 'Проверьте заполнение полей формы.');
    }
    if ($singleLine && preg_match('/[\r\n]/', $value)) {
        fail(422, 'Проверьте заполнение полей формы.');
    }
    $value = trim($value);
    if (preg_match_all('/./us', $value) > $limit) {
        fail(422, 'Слишком длинное значение в поле формы.');
    }
    return $value;
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if (!in_array($method, ['GET', 'POST'], true)) {
        header('Allow: GET, POST');
        fail(405, 'Этот способ запроса не поддерживается.');
    }
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $allowedOrigin = 'https://remontekt.ru';
    if (preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/D', $host)) {
        $allowedOrigin = 'http://' . $host;
    } elseif ($host !== 'remontekt.ru' && $host !== 'remontekt.ru:443') {
        fail(403, 'Откройте форму на remontekt.ru.');
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (($method === 'POST' || $origin !== '') && $origin !== $allowedOrigin) {
        fail(403, 'Обновите страницу и отправьте заявку с сайта.');
    }
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') {
        fail(403, 'Отправка доступна только с сайта.');
    }

    // The production release lives three levels below the hosting account's data.
    $storage = getenv('REMONTEKT_FORM_DATA_DIR') ?: dirname(__DIR__, 3) . '/.remontekt-requests';
    umask(0077);
    if (!is_dir($storage) && !mkdir($storage, 0700, true) && !is_dir($storage)) {
        throw new RuntimeException('Private storage unavailable');
    }
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__);
    $realStorage = realpath($storage);
    if (!$realStorage || ($root && ($realStorage === $root || str_starts_with($realStorage, $root . '/')))) {
        throw new RuntimeException('Storage must be outside document root');
    }
    chmod($storage, 0700);
    $lock = fopen($storage . '/state.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('Private lock unavailable');
    }
    $keyFile = $storage . '/token.key';
    if (!is_file($keyFile)) {
        if (file_put_contents($keyFile, bin2hex(random_bytes(32)), LOCK_EX) !== 64) {
            throw new RuntimeException('Token initialization failed');
        }
        chmod($keyFile, 0600);
    }
    $key = file_get_contents($keyFile);
    if (!$key || strlen($key) !== 64) {
        throw new RuntimeException('Token key unavailable');
    }
    $now = time();
    $client = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? '', $key);
    if ($method === 'GET') {
        $id = bin2hex(random_bytes(16));
        $payload = $id . '.' . $now;
        $token = $payload . '.' . hash_hmac('sha256', $payload . '.' . $client, $key);
        respond(200, ['token' => $token, 'requestId' => $id, 'consentVersion' => CONSENT_VERSION]);
    }

    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
        fail(413, 'Заявка слишком большая. Сократите комментарий.');
    }
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        fail(415, 'Обновите страницу и повторите отправку.');
    }
    $raw = file_get_contents('php://input', false, null, 0, 16385);
    if ($raw === false || strlen($raw) > 16384) {
        fail(413, 'Заявка слишком большая.');
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || array_is_list($data)) {
        fail(400, 'Не удалось прочитать заявку.');
    }
    if (($data['consent'] ?? false) !== true || ($data['consentVersion'] ?? '') !== CONSENT_VERSION) {
        fail(422, 'Для отправки необходимо отдельное согласие на обработку данных.');
    }
    $token = $data['token'] ?? '';
    $id = $data['requestId'] ?? '';
    if (!is_string($token) || !is_string($id) || !preg_match('/^[a-f0-9]{32}$/D', $id)) {
        fail(403, 'Обновите форму и повторите отправку.');
    }
    $parts = explode('.', $token);
    if (count($parts) !== 3 || $parts[0] !== $id || !ctype_digit($parts[1]) || !hash_equals(hash_hmac('sha256', $parts[0] . '.' . $parts[1] . '.' . $client, $key), $parts[2])) {
        fail(403, 'Обновите форму и повторите отправку.');
    }
    if ($now - (int) $parts[1] < 2 || $now - (int) $parts[1] > 3600) {
        fail(403, 'Подождите немного или обновите форму и повторите отправку.');
    }
    if (($data['website'] ?? '') !== '') {
        fail(422, 'Не удалось подтвердить отправку формы.');
    }
    $name = textField($data, 'name', 80, true);
    $contact = textField($data, 'contact', 120, true);
    $type = textField($data, 'type', 40, true);
    $area = textField($data, 'area', 10, true);
    $message = textField($data, 'message', 2000);
    $isEmail = (bool) filter_var($contact, FILTER_VALIDATE_EMAIL);
    $isPhone = preg_match('/^[+\d() .-]{7,30}$/D', $contact) && preg_match('/^\d{7,15}$/D', preg_replace('/\D/', '', $contact));
    if ($name === '' || (!$isEmail && !$isPhone) || !in_array($type, ['Квартира', 'Новостройка', 'Частный дом', 'Коммерческое помещение'], true)) {
        fail(422, 'Укажите имя и действующий телефон или email.');
    }
    if ($area !== '' && (!preg_match('/^\d+(\.\d{1,2})?$/D', $area) || (float) $area < 1 || (float) $area > 10000)) {
        fail(422, 'Площадь должна быть от 1 до 10 000 м².');
    }
    $consentFile = __DIR__ . '/consent-' . CONSENT_VERSION . '.html';
    $consentHash = hash_file('sha256', $consentFile);
    if (!$consentHash) {
        throw new RuntimeException('Consent document unavailable');
    }
    $fieldsHash = hash('sha256', json_encode([$name, $contact, $type, $area, $message, CONSENT_VERSION], JSON_UNESCAPED_UNICODE));
    $recordPath = $storage . '/request-' . $id . '.json';
    if (is_file($recordPath)) {
        $previous = json_decode(file_get_contents($recordPath), true);
        if (($previous['fieldsHash'] ?? '') !== $fieldsHash) {
            fail(409, 'Эта заявка уже обработана. Откройте новую форму.');
        }
        if (($previous['status'] ?? '') === 'queued') {
            respond(200, ['ok' => true, 'requestId' => $id, 'message' => 'Заявка отправлена.']);
        }
        if (($previous['status'] ?? '') === 'attempting') {
            fail(503, 'Статус отправки не подтверждён. Свяжитесь с нами по телефону или почте.');
        }
    }
    foreach (glob($storage . '/request-*.json') ?: [] as $file) {
        if (filemtime($file) < $now - 30 * 86400) {
            unlink($file);
        }
    }
    $rateFile = $storage . '/rate.json';
    $rate = is_file($rateFile) ? json_decode(file_get_contents($rateFile), true) : [];
    $rate = is_array($rate) ? $rate : [];
    foreach ($rate as $k => $timestamps) {
        $rate[$k] = array_values(array_filter($timestamps, fn ($t) => $t > $now - 86400));
        if (!$rate[$k]) {
            unset($rate[$k]);
        }
    }
    $times = $rate[$client] ?? [];
    $global = $rate['global'] ?? [];
    if (count($times) >= 10 || count($global) >= 150 || count(array_filter($times, fn ($t) => $t > $now - 3600)) >= 5 || count(array_filter($times, fn ($t) => $t > $now - 60)) >= 1) {
        header('Retry-After: 60');
        fail(429, 'Слишком частая отправка. Повторите позже или свяжитесь с нами напрямую.');
    }
    $rate[$client][] = $now;
    $rate['global'][] = $now;
    saveJson($rateFile, $rate);
    $acceptedAt = gmdate('c', $now);
    $body = "Новая заявка с https://remontekt.ru/\n\nИмя: $name\nКонтакт: $contact\nПомещение: $type\nПлощадь: " . ($area !== '' ? "$area м²" : 'не указана') . "\nКомментарий:\n$message\n\nПодтверждение отдельного согласия:\nОператор: ИП Мягков Евгений Игоревич, ИНН 741304668607.\nЦель: ответ на обращение и подготовка предложения по ремонту.\nCheckbox согласия отмечен посетителем перед отправкой.\nРедакция: " . CONSENT_VERSION . "\nДокумент: https://remontekt.ru/consent-" . CONSENT_VERSION . ".html\nSHA-256 документа: $consentHash\nВремя принятия сервером (UTC): $acceptedAt\nНомер заявки: $id\n\nСохраните это письмо вместе с обращением. Рекламное согласие не запрашивалось.\n";
    $body = str_replace(["\r\n", "\r"], "\n", $body);
    $receipt = ['requestId' => $id, 'acceptedAt' => $acceptedAt, 'consentVersion' => CONSENT_VERSION, 'consentHash' => $consentHash, 'fieldsHash' => $fieldsHash, 'mailHash' => hash('sha256', $body), 'status' => 'attempting'];
    // Persist the attempt before the mail call; ambiguous retries cannot duplicate mail.
    saveJson($recordPath, $receipt);
    $subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта РЕМОНТ-ЕКТ') . '?=';
    $headers = "From: REMONT-EKT <" . SENDER . ">\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\nMessage-ID: <$id@remontekt.ru>";
    if ($isEmail) {
        $headers .= "\r\nReply-To: $contact";
    }
    $sent = mail(RECIPIENT, $subject, quoted_printable_encode(str_replace("\n", "\r\n", $body)), $headers);
    $receipt['status'] = $sent ? 'queued' : 'failed';
    saveJson($recordPath, $receipt);
    if (!$sent) {
        fail(503, 'Не удалось отправить заявку. Попробуйте позже или напишите на dom196@list.ru.');
    }
    respond(200, ['ok' => true, 'requestId' => $id, 'message' => 'Заявка отправлена.']);
} catch (Throwable $error) {
    // Never include form data, internal paths, or diagnostic exceptions in the response.
    error_log('REMONTEKT form: request processing failed');
    fail(503, 'Отправка временно недоступна. Напишите на dom196@list.ru или позвоните нам.');
}
