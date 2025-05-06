<?php
/**
 * Маршруты для операций аутентификации и авторизации.
 * 
 * Этот файл обрабатывает запросы, связанные с регистрацией, входом в систему,
 * восстановлением пароля и сбросом пароля.
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

/**
 * Регистрация пользователя.
 * 
 * @method POST
 * @endpoint /api/register
 * @require ../auth/register.php
 */
if ($uri === '/api/register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . '/../auth/register.php';
    exit;
}

/**
 * Авторизация пользователя.
 * 
 * @method POST
 * @endpoint /api/login
 * @require ../auth/login.php
 */
if ($uri === '/api/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . '/../auth/login.php';
    exit;
}

/**
 * Запрос на восстановление пароля.
 * 
 * @method POST
 * @endpoint /api/forgot-password
 * @require ../auth/forgot-password.php
 */
if ($uri === '/api/forgot-password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . '/../auth/forgot-password.php';
    exit;
}

/**
 * Сброс пароля пользователя.
 * 
 * @method POST
 * @endpoint /api/reset-password
 * @require ../auth/reset-password.php
 */
if ($uri === '/api/reset-password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . '/../auth/reset-password.php';
    exit;
}
