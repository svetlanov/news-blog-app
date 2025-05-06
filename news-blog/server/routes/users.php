<?php
/**
 * Маршруты для управления пользователями.
 * 
 * Этот файл обрабатывает запросы, связанные с получением списка пользователей
 * и обновлением их ролей. Доступ к маршрутам ограничен только администраторами.
 */

if ($uri === '/api/users' && $method === 'GET') {
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Получение списка всех пользователей.
     * 
     * @method GET
     * @endpoint /api/users
     * @require ../middleware/authenticate.php
     * @return void Возвращает JSON с данными пользователей.
     * @throws Exception Если пользователь не является администратором.
     */
    $user = authenticate();

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Только для админов']);
        exit;
    }

    $stmt = $pdo->query("SELECT id, username, email, role FROM users ORDER BY id ASC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
    exit;
}

if (preg_match('#^/api/users/(\d+)/role$#', $uri, $matches) && $method === 'PUT') {
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Обновление роли пользователя.
     * 
     * @method PUT
     * @endpoint /api/users/{id}/role
     * @require ../middleware/authenticate.php
     * @param int $id ID пользователя, чья роль обновляется.
     * @param string $role Новая роль пользователя (admin или user).
     * @return void Возвращает сообщение об успешном обновлении роли.
     * @throws Exception Если пользователь не является администратором.
     */
    $auth = authenticate();
    if ($auth['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Только для админов']);
        exit;
    }

    $userId = $matches[1];
    $data = json_decode(file_get_contents("php://input"), true);
    $role = $data['role'] ?? '';

    if (!in_array($role, ['user', 'admin'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Недопустимая роль']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE users SET role = :role WHERE id = :id");
    $stmt->execute(['role' => $role, 'id' => $userId]);

    echo json_encode(['message' => 'Роль обновлена']);
    exit;
}
