<?php
/**
 * Маршрут для загрузки файлов.
 * 
 * Этот файл обрабатывает запросы на загрузку изображений, сохраняет их
 * в указанной директории и возвращает URL загруженного файла.
 */

$targetDir = __DIR__ . '/../uploads/';
if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);

if ($uri === '/api/upload' && $method === 'POST') {
    /**
     * Загрузка изображения.
     * 
     * @method POST
     * @endpoint /api/upload
     * @param array $_FILES['image'] Данные загружаемого файла.
     * @return void Возвращает JSON с URL загруженного файла или ошибку.
     */

    if ($_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmp = $_FILES['image']['tmp_name'];
        $name = basename($_FILES['image']['name']);
        $safeName = time() . '-' . preg_replace('/[^a-zA-Z0-9\.\-_]/', '', $name);
        $target = $targetDir . $safeName;

        if (move_uploaded_file($tmp, $target)) {
            $url = "/uploads/$safeName";
            echo json_encode(['url' => $url]);
            exit;
        }
    }

    http_response_code(400);
    echo json_encode(['error' => 'Ошибка загрузки']);
    exit;
}