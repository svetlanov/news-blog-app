<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = 'super_secret_key'; // Позже вынести в env

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Неверный email или пароль."]);
    exit;
}

// Генерация JWT
$payload = [
    "sub" => $user['id'],
    "username" => $user['username'],
    "role" => $user['role'],
    "id" => $user['id'],
    "exp" => time() + 3600 // 1 час
];

$jwt = JWT::encode($payload, $secretKey, 'HS256');

echo json_encode(["token" => $jwt]);
