<?php
/**
 * Файл для обработки авторизации пользователя.
 * 
 * Этот скрипт принимает email и пароль пользователя, проверяет их в базе данных,
 * и в случае успешной проверки генерирует JWT-токен для авторизации.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/** @var string $secretKey Секретный ключ для подписи JWT. */
$secretKey = 'super_secret_key'; // Позже вынести в env

/**
 * Получение данных из входящего JSON-запроса.
 * 
 * @var array $data Ассоциативный массив с данными запроса.
 * @var string $email Email пользователя, переданный в запросе.
 * @var string $password Пароль пользователя, переданный в запросе.
 */
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

/**
 * Проверка существования пользователя с указанным email.
 * 
 * @var PDOStatement $stmt Подготовленный запрос для поиска пользователя.
 * @var array|false $user Данные пользователя или false, если пользователь не найден.
 */
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

/**
 * Если пользователь не найден или пароль неверный, возвращается HTTP-код 401
 * и сообщение об ошибке.
 */
if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Неверный email или пароль."]);
    exit;
}

/**
 * Генерация JWT-токена для авторизации.
 * 
 * @var array $payload Данные, которые будут включены в токен.
 * @var string $jwt Сгенерированный JWT-токен.
 */
$payload = [
    "sub" => $user['id'],          // Идентификатор пользователя
    "username" => $user['username'], // Имя пользователя
    "role" => $user['role'],        // Роль пользователя
    "id" => $user['id'],            // Дублирующий идентификатор
    "exp" => time() + 3600          // Время истечения токена (1 час)
];

$jwt = JWT::encode($payload, $secretKey, 'HS256');

/**
 * Возврат успешного ответа с JWT-токеном.
 */
echo json_encode(["token" => $jwt]);
