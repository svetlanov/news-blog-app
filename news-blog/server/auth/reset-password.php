<?php
/**
 * Файл для обработки сброса пароля пользователя.
 * 
 * Этот скрипт принимает токен сброса пароля и новый пароль пользователя,
 * проверяет валидность токена, обновляет пароль пользователя в базе данных
 * и удаляет использованный токен.
 */

require_once __DIR__ . '/../config/db.php';

/**
 * Получение данных из входящего JSON-запроса.
 * 
 * @var array $data Ассоциативный массив с данными запроса.
 * @var string $token Токен сброса пароля, переданный в запросе.
 * @var string $newPassword Новый пароль пользователя, переданный в запросе.
 */
$data = json_decode(file_get_contents("php://input"), true);
$token = trim($data['token'] ?? '');
$newPassword = trim($data['password'] ?? '');

/**
 * Проверка обязательных полей.
 * Если одно из полей не заполнено, возвращается HTTP-код 400 и сообщение об ошибке.
 */
if (!$token || !$newPassword) {
    http_response_code(400);
    echo json_encode(["error" => "Все поля обязательны"]);
    exit;
}

/**
 * Проверка валидности токена сброса пароля.
 * 
 * @var PDOStatement $stmt Подготовленный запрос для проверки токена.
 * @var array|false $row Данные токена или false, если токен недействителен.
 */
$stmt = $pdo->prepare("SELECT * FROM password_resets WHERE token = :token AND expires_at > NOW()");
$stmt->execute(['token' => $token]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

/**
 * Если токен недействителен или устарел, возвращается HTTP-код 400 и сообщение об ошибке.
 */
if (!$row) {
    http_response_code(400);
    echo json_encode(["error" => "Токен недействителен или устарел"]);
    exit;
}

/**
 * Хэширование нового пароля пользователя.
 * 
 * @var string $hash Хэшированный новый пароль.
 */
$hash = password_hash($newPassword, PASSWORD_BCRYPT);

/**
 * Обновление пароля пользователя в базе данных.
 * 
 * @var PDOStatement $stmt Подготовленный запрос для обновления пароля.
 */
$stmt = $pdo->prepare("UPDATE users SET password_hash = :password WHERE id = :id");
$stmt->execute([
    'password' => $hash,
    'id' => $row['user_id']
]);

/**
 * Удаление использованного токена сброса пароля.
 */
$pdo->prepare("DELETE FROM password_resets WHERE id = :id")->execute(['id' => $row['id']]);

/**
 * Возврат успешного ответа.
 */
echo json_encode(["message" => "Пароль успешно обновлён"]);
