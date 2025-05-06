<?php
/**
 * Файл для настройки подключения к базе данных PostgreSQL.
 * 
 * Этот файл создает объект PDO для взаимодействия с базой данных.
 * В случае ошибки подключения скрипт завершает выполнение с сообщением об ошибке.
 */

/**
 * @var string $host Хост базы данных.
 * @var string $db Имя базы данных.
 * @var string $user Имя пользователя базы данных.
 * @var string $pass Пароль пользователя базы данных.
 * @var string $port Порт для подключения к базе данных.
 */
$host = 'localhost';
$db   = 'news-app';
$user = 'php_library';
$pass = 'php';
$port = '5432';

/**
 * @var PDO $pdo Объект PDO для взаимодействия с базой данных.
 * @throws PDOException Если не удается подключиться к базе данных.
 */
try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Ошибка подключения к БД: " . $e->getMessage());
}
?>
