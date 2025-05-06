<?php
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$token = trim($data['token'] ?? '');
$newPassword = trim($data['password'] ?? '');

if (!$token || !$newPassword) {
    http_response_code(400);
    echo json_encode(["error" => "Все поля обязательны"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM password_resets WHERE token = :token AND expires_at > NOW()");
$stmt->execute(['token' => $token]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(400);
    echo json_encode(["error" => "Токен недействителен или устарел"]);
    exit;
}

$hash = password_hash($newPassword, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("UPDATE users SET password_hash = :password WHERE id = :id");
$stmt->execute([
    'password' => $hash,
    'id' => $row['user_id']
]);

// Удаляем использованный токен
$pdo->prepare("DELETE FROM password_resets WHERE id = :id")->execute(['id' => $row['id']]);

echo json_encode(["message" => "Пароль успешно обновлён"]);
