<?php
/**
 * Главный файл маршрутизации для серверной части приложения.
 * 
 * Этот файл обрабатывает все входящие HTTP-запросы, включая маршруты для аутентификации,
 * работы с новостями, комментариями, загрузкой файлов и административными операциями.
 * Также поддерживает отдачу статических файлов из директории `/uploads`.
 */

// Установка заголовков для CORS и обработки JSON.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

/**
 * Обработка preflight-запросов (OPTIONS).
 * 
 * @return void Завершает выполнение скрипта с HTTP-кодом 200.
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Получение URI и метода запроса.
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

/**
 * Отдача статических файлов из директории `/uploads`.
 * 
 * @param string $uri Путь к запрашиваемому файлу.
 * @return void Если файл существует, возвращает его содержимое и завершает выполнение скрипта.
 */
$publicPath = __DIR__ . $uri;

if (file_exists($publicPath) && is_file($publicPath)) {
    $mime = mime_content_type($publicPath);
    header("Content-Type: $mime");
    readfile($publicPath);
    exit;
}

// Подключение маршрутов.
require_once __DIR__ . '/routes/auth.php';
require_once __DIR__ . '/routes/news.php';
require_once __DIR__ . '/routes/admin.php';
require_once __DIR__ . '/routes/upload.php';
require_once __DIR__ . '/routes/users.php';
require_once __DIR__ . '/routes/comments.php';

/**
 * Обработка неизвестных маршрутов.
 * 
 * @return void Возвращает HTTP-код 404 и сообщение об ошибке в формате JSON.
 */
http_response_code(404);
echo json_encode(["error" => "Route not found"]);
