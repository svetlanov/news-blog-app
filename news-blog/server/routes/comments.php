<?php
/**
 * Маршруты для операций с комментариями.
 * 
 * Этот файл обрабатывает запросы, связанные с добавлением, получением,
 * модерацией и подсчётом комментариев.
 */

require_once __DIR__ . '/../config/db.php';

if ($uri === '/api/comments' && $method === 'POST') {
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Добавление нового комментария.
     * 
     * @method POST
     * @endpoint /api/comments
     * @require ../middleware/authenticate.php
     * @param string $content Текст комментария.
     * @param int $newsId ID новости, к которой добавляется комментарий.
     * @return void Возвращает сообщение об успешной отправке комментария.
     */
    $user = authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    $content = trim($data['content'] ?? '');
    $newsId = $data['news_id'] ?? 0;

    if (!$content || !$newsId) {
        http_response_code(400);
        echo json_encode(['error' => 'Контент и ID новости обязательны']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO comments (news_id, user_id, content) VALUES (:news_id, :user_id, :content)");
    $stmt->execute([
        'news_id' => $newsId,
        'user_id' => $user['sub'],
        'content' => $content
    ]);

    echo json_encode(['message' => 'Комментарий отправлен на модерацию']);
    exit;
}

if (preg_match('#^/api/comments/news/(\d+)$#', $uri, $matches) && $method === 'GET') {
    /**
     * Получение списка одобренных комментариев для новости.
     * 
     * @method GET
     * @endpoint /api/comments/news/{newsId}
     * @param int $newsId ID новости.
     * @return void Возвращает JSON с одобренными комментариями.
     */
    $newsId = $matches[1];

    $stmt = $pdo->prepare("
        SELECT comments.*, users.username 
        FROM comments 
        JOIN users ON users.id = comments.user_id 
        WHERE news_id = :id AND status = 'approved'
        ORDER BY created_at ASC
    ");
    $stmt->execute(['id' => $newsId]);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($uri === '/api/comments/pending' && $method === 'GET') {
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Получение списка комментариев, ожидающих модерации.
     * 
     * @method GET
     * @endpoint /api/comments/pending
     * @require ../middleware/authenticate.php
     * @return void Возвращает JSON с комментариями, ожидающими модерации.
     */
    $user = authenticate();

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Доступ только для админа']);
        exit;
    }

    $stmt = $pdo->query("
        SELECT comments.*, users.username, news.title AS news_title
        FROM comments
        JOIN users ON users.id = comments.user_id
        JOIN news ON news.id = comments.news_id
        WHERE comments.status = 'pending'
        ORDER BY comments.created_at ASC
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if (preg_match('#^/api/comments/(\d+)/approve$#', $uri, $matches) && $method === 'PUT') {
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Одобрение комментария.
     * 
     * @method PUT
     * @endpoint /api/comments/{id}/approve
     * @require ../middleware/authenticate.php
     * @param int $id ID комментария.
     * @return void Возвращает сообщение об успешном одобрении комментария.
     */
    $user = authenticate();

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Только для админа']);
        exit;
    }

    $id = $matches[1];
    $stmt = $pdo->prepare("UPDATE comments SET status = 'approved' WHERE id = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(['message' => 'Комментарий одобрен']);
    exit;
}

if (preg_match('#^/api/comments/(\d+)/reject$#', $uri, $matches) && $method === 'PUT') {
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Отклонение комментария.
     * 
     * @method PUT
     * @endpoint /api/comments/{id}/reject
     * @require ../middleware/authenticate.php
     * @param int $id ID комментария.
     * @return void Возвращает сообщение об успешном отклонении комментария.
     */
    $user = authenticate();

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Только для админа']);
        exit;
    }

    $id = $matches[1];
    $stmt = $pdo->prepare("UPDATE comments SET status = 'rejected' WHERE id = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(['message' => 'Комментарий отклонён']);
    exit;
}

if ($uri === '/api/comments/pending/count' && $method === 'GET') {
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Получение количества комментариев, ожидающих модерации.
     * 
     * @method GET
     * @endpoint /api/comments/pending/count
     * @require ../middleware/authenticate.php
     * @return void Возвращает JSON с количеством ожидающих комментариев.
     */
    $user = authenticate();

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Доступ только для админа']);
        exit;
    }

    $stmt = $pdo->query("SELECT COUNT(*) FROM comments WHERE status = 'pending'");
    $count = $stmt->fetchColumn();

    echo json_encode(['count' => (int)$count]);
    exit;
}