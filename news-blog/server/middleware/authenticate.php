<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
function authenticate(): ?array {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["error" => "Authorization header missing"]);
        exit;
    }

    $authHeader = $headers['Authorization'];
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid authorization header"]);
        exit;
    }

    $jwt = $matches[1];
    try {
        global $secretKey;
        $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid or expired token"]);
        exit;
    }
}

function getUserDetails() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with($authHeader, 'Bearer ')) {
        $token = explode(' ', $authHeader)[1];
        global $secretKey;

        try {
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

            return [
                'sub' => $decoded->sub,
                'role' => $decoded->role ?? 'user',
                'email' => $decoded->email ?? '',
                'id' => $user->id ?? '',
                'username' => $decoded->username ?? '',
            ];
        } catch (Exception $e) {
            // просто игнорируем — пользователь останется null
        }
    }

    return null;
}
