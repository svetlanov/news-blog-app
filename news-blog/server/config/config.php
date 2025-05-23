<?php
/**
 * Файл конфигурации приложения.
 * 
 * Этот файл содержит глобальные настройки, такие как секретный ключ
 * для подписи JWT-токенов.
 */

/**
 * @var string $secretKey Секретный ключ для подписи JWT-токенов.
 * Рекомендуется хранить этот ключ в переменных окружения для повышения безопасности.
 */
$secretKey = 'super_secret_key';
