<?php
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$username || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Все поля обязательны."]);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);

// Проверка на существование пользователя
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR username = :username");
$stmt->execute(['email' => $email, 'username' => $username]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "Пользователь с таким email или username уже существует."]);
    exit;
}

// Вставка нового пользователя
$stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
$stmt->execute([
    'username' => $username,
    'email' => $email,
    'password' => $hash
]);

echo json_encode(["message" => "Регистрация успешна."]);
