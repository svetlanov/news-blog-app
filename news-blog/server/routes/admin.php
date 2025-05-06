<?php
/**
 * Маршруты для административных операций.
 * 
 * Этот файл обрабатывает запросы, связанные с управлением пользователями,
 * включая получение списка пользователей, обновление их ролей и удаление.
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if (strpos($uri, '/api/admin/users') === 0) {
    require_once __DIR__ . '/../config/db.php';
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Аутентификация пользователя.
     * 
     * @var array $user Данные аутентифицированного пользователя.
     * @throws Exception Если пользователь не является администратором.
     */
    $user = authenticate();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Доступ запрещён"]);
        exit;
    }

    /**
     * Получение списка всех пользователей, кроме текущего администратора.
     * 
     * @method GET
     * @endpoint /api/admin/users
     * @return void Возвращает JSON с данными пользователей.
     */
    if ($uri === '/api/admin/users' && $method === 'GET') {
        $stmt = $pdo->prepare("SELECT id, username, email, role, created_at FROM users WHERE id != :id ORDER BY created_at DESC");
        $stmt->execute(['id' => $user['id']]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    /**
     * Обновление роли пользователя (admin/user).
     * 
     * @method POST
     * @endpoint /api/admin/users/{id}/role
     * @param int $userId Идентификатор пользователя, чья роль обновляется.
     * @param string $role Новая роль пользователя (admin или user).
     * @return void Возвращает JSON с сообщением об успешном обновлении.
     */
    if (preg_match('#^/api/admin/users/(\d+)/role$#', $uri, $matches) && $method === 'POST') {
        $userId = $matches[1];
        $data = json_decode(file_get_contents("php://input"), true);
        $role = $data['role'];

        if (!in_array($role, ['admin', 'user'])) {
            http_response_code(400);
            echo json_encode(["error" => "Недопустимая роль"]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE users SET role = :role WHERE id = :id");
        $stmt->execute(['role' => $role, 'id' => $userId]);
        echo json_encode(["message" => "Роль пользователя обновлена"]);
        exit;
    }

    /**
     * Удаление пользователя.
     * 
     * @method DELETE
     * @endpoint /api/admin/users/{id}
     * @param int $userId Идентификатор пользователя, который будет удалён.
     * @return void Возвращает JSON с сообщением об успешном удалении.
     */
    if (preg_match('#^/api/admin/users/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
        $userId = $matches[1];
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute(['id' => $userId]);
        echo json_encode(["message" => "Пользователь удалён"]);
        exit;
    }
}
