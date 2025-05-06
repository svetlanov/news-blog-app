<?php
// Настройки подключения к PostgreSQL
$host = 'localhost';
$db   = 'news-app';
$user = 'php_library';
$pass = 'php';
$port = '5432';

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Ошибка подключения к БД: " . $e->getMessage());
}
?>
