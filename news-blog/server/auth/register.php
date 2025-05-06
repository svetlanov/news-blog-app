<?php
/**
 * Файл для обработки регистрации пользователя.
 * 
 * Этот скрипт принимает данные пользователя (username, email, password),
 * проверяет их корректность, проверяет наличие пользователя в базе данных
 * и регистрирует нового пользователя, если все проверки пройдены.
 */

require_once __DIR__ . '/../config/db.php';

/**
 * Получение данных из входящего JSON-запроса.
 * 
 * @var array $data Ассоциативный массив с данными запроса.
 * @var string $username Имя пользователя, переданное в запросе.
 * @var string $email Email пользователя, переданный в запросе.
 * @var string $password Пароль пользователя, переданный в запросе.
 */
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

/**
 * Проверка обязательных полей.
 * Если одно из полей не заполнено, возвращается HTTP-код 400 и сообщение об ошибке.
 */
if (!$username || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Все поля обязательны."]);
    exit;
}

/**
 * Хэширование пароля пользователя.
 * 
 * @var string $hash Хэшированный пароль.
 */
$hash = password_hash($password, PASSWORD_BCRYPT);

/**
 * Проверка на существование пользователя с указанным email или username.
 * 
 * @var PDOStatement $stmt Подготовленный запрос для проверки существования пользователя.
 */
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR username = :username");
$stmt->execute(['email' => $email, 'username' => $username]);

/**
 * Если пользователь с таким email или username уже существует,
 * возвращается HTTP-код 409 и сообщение об ошибке.
 */
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "Пользователь с таким email или username уже существует."]);
    exit;
}

/**
 * Вставка нового пользователя в базу данных.
 * 
 * @var PDOStatement $stmt Подготовленный запрос для вставки нового пользователя.
 */
$stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
$stmt->execute([
    'username' => $username,
    'email' => $email,
    'password' => $hash
]);

/**
 * Возврат успешного ответа.
 */
echo json_encode(["message" => "Регистрация успешна."]);
