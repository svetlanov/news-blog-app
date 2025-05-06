<?php
/**
 * Обёртка для обработки ошибок.
 * 
 * Эта функция выполняет переданный callback и обрабатывает исключения,
 * возвращая соответствующий HTTP-код и сообщение об ошибке.
 * 
 * @param callable $callback Функция, выполнение которой нужно обернуть в обработчик ошибок.
 * @return void Возвращает JSON с сообщением об ошибке в случае исключения.
 */
function withErrorHandler(callable $callback) {
    try {
        $callback();
    } catch (PDOException $e) {
        http_response_code(500);
        error_log("[DB ERROR] " . $e->getMessage());
        echo json_encode(["error" => "Ошибка базы данных"]);
    } catch (Exception $e) {
        http_response_code(500);
        error_log("[GENERAL ERROR] " . $e->getMessage());
        echo json_encode(["error" => "Произошла внутренняя ошибка"]);
    }
}
