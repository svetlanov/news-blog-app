<?php
/**
 * Файл для обработки запроса на восстановление пароля.
 * 
 * Этот скрипт принимает email пользователя, проверяет его наличие в базе данных,
 * генерирует токен для сброса пароля и сохраняет его в таблице `password_resets`.
 * Затем отправляет ссылку для сброса пароля (в данном случае сохраняет в файл).
 */

require_once __DIR__ . '/../config/db.php';

/**
 * Получение данных из входящего JSON-запроса.
 * 
 * @var array $data Ассоциативный массив с данными запроса.
 * @var string $email Email пользователя, переданный в запросе.
 */
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

/**
 * Проверка наличия email в запросе.
 * Если email отсутствует, возвращается HTTP-код 400 и сообщение об ошибке.
 */
if (!$email) {
    http_response_code(400);
    echo json_encode(["error" => "Email обязателен"]);
    exit;
}

/**
 * Проверка существования пользователя с указанным email.
 * 
 * @var PDOStatement $stmt Подготовленный запрос для поиска пользователя.
 * @var array|false $user Данные пользователя или false, если пользователь не найден.
 */
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

/**
 * Если пользователь не найден, возвращается сообщение, что ссылка отправлена,
 * чтобы не раскрывать информацию о существовании email.
 */
if (!$user) {
    echo json_encode(["message" => "Если пользователь существует, ссылка отправлена"]);
    exit;
}

/**
 * Генерация токена для сброса пароля.
 * 
 * @var string $token Случайно сгенерированный токен.
 * @var string $expires Дата и время истечения срока действия токена (через 1 час).
 */
$token = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + 3600); // 1 час

/**
 * Сохранение токена в таблице `password_resets`.
 * 
 * @var PDOStatement $stmt Подготовленный запрос для вставки данных.
 */
$stmt = $pdo->prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)");
$stmt->execute([
    'user_id' => $user['id'],
    'token' => $token,
    'expires_at' => $expires
]);

/**
 * Генерация ссылки для сброса пароля.
 * В реальном проекте здесь должна быть отправка email пользователю.
 * 
 * @var string $link Ссылка для сброса пароля.
 */
$link = "http://localhost:5173/reset-password/$token";
file_put_contents(__DIR__ . '/../temp_link.txt', $link);

/**
 * Возврат успешного ответа.
 */
echo json_encode(["message" => "Ссылка для восстановления пароля отправлена"]);
