<?php

/**
 * Маршруты для операций с новостями.
 * 
 * Этот файл обрабатывает запросы, связанные с добавлением, получением,
 * обновлением и удалением новостей.
 */

require_once __DIR__ . '/../utils/withErrorHandler.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if (strpos($uri, '/api/news') === 0) {
    require_once __DIR__ . '/../config/db.php';
    require_once __DIR__ . '/../middleware/authenticate.php';

    /**
     * Получение списка новостей с фильтрацией.
     * 
     * @method GET
     * @endpoint /api/news
     * @query string $q Ключевое слово для поиска в заголовке или контенте.
     * @query string $category Категория новостей.
     * @query string $status Статус новостей (только для администраторов).
     * @query string $from Дата начала публикации.
     * @query string $to Дата окончания публикации.
     * @query string $sort Порядок сортировки (asc/desc).
     * @return void Возвращает JSON с отфильтрованными новостями.
     */
    if ($uri === '/api/news' && $method === 'GET') {
        $user = getUserDetails();

        withErrorHandler(function () use ($pdo, $user) {
            $query = "SELECT news.*, users.username AS author, users.id AS author_id
                    FROM news
                    JOIN users ON users.id = news.author_id
                    WHERE 1=1";
            
            $params = [];
        
            // Фильтрация по ключевому слову
            if (!empty($_GET['q'])) {
                $query .= " AND (title ILIKE :q OR content ILIKE :q)";
                $params['q'] = '%' . $_GET['q'] . '%';
            }

            // Фильтрация по категории
            if (!empty($_GET['category'])) {
                $query .= " AND category = :category";
                $params['category'] = $_GET['category'];
            }

            $isAdmin = isset($user['role']) && $user['role'] === 'admin';

            if (!$isAdmin) {
                $query .= " AND status = 'published'";
            } else {
                // Фильтрация по статусу (только для администраторов)
                if (!empty($_GET['status'])) {
                    $query .= " AND status = :status";
                    $params['status'] = $_GET['status'];
                }
            }

            // Фильтрация по дате публикации (начало/конец)
            if (!empty($_GET['from'])) {
                $query .= " AND created_at >= :from";
                $params['from'] = $_GET['from'];
            }
            if (!empty($_GET['to'])) {
                $query .= " AND created_at <= :to";
                $params['to'] = $_GET['to'];
            }
        
            $sort = $_GET['sort'] ?? 'desc';
            $sort = strtolower($sort) === 'asc' ? 'ASC' : 'DESC';

            $query .= " ORDER BY created_at $sort";
        
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            echo json_encode($results);
        });
        exit;
    }

    /**
     * Добавление новой новости.
     * 
     * @method POST
     * @endpoint /api/news
     * @require ../middleware/authenticate.php
     * @param string $title Заголовок новости.
     * @param string $content Контент новости.
     * @param string $category Категория новости.
     * @param string $image_url URL изображения.
     * @param string $status Статус новости (draft/published).
     * @param string $tags Теги новости.
     * @return void Возвращает сообщение об успешном добавлении новости.
     */
    if ($uri === '/api/news' && $method === 'POST') {
        $user = authenticate();
        $data = json_decode(file_get_contents("php://input"), true);

        $title = trim($data['title'] ?? '');
        $content = trim($data['content'] ?? '');
        $category = trim($data['category'] ?? '');
        $image = trim($data['image_url'] ?? '');
        $status = trim($data['status'] ?? 'draft');

        if (!$isAdmin) {
            $status = 'draft'; // обычным пользователям запрещено публиковать напрямую
        }

        $tags = trim($data['tags'] ?? '');

        if (!$title || !$content) {
            http_response_code(400);
            echo json_encode(["error" => "Заголовок и контент обязательны"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO news (title, content, category, image_url, status, tags, author_id) VALUES (:title, :content, :category, :image_url, :status, :tags, :author_id)");

        $stmt->execute([
            'title' => $title,
            'content' => $content,
            'category' => $category,
            'image_url' => $image,
            'status' => $status,
            'tags' => $tags,
            'author_id' => $user['sub'],
        ]);

        echo json_encode(["message" => "Новость добавлена"]);
        exit;
    }

    /**
     * Получение, обновление или удаление конкретной новости.
     * 
     * @endpoint /api/news/{id}
     */
    if (preg_match('#^/api/news/(\d+)$#', $uri, $matches)) {
        $newsId = $matches[1];

        /**
         * Получение конкретной новости.
         * 
         * @method GET
         * @param int $id ID новости.
         * @return void Возвращает JSON с данными новости.
         */
        if ($method === 'GET') {
            $stmt = $pdo->prepare("SELECT news.*, users.username AS author FROM news JOIN users ON users.id = news.author_id WHERE news.id = :id");
            $stmt->execute(['id' => $newsId]);
            $news = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($news) {
                echo json_encode($news);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Новость не найдена"]);
            }
            exit;
        }

        /**
         * Обновление новости.
         * 
         * @method PUT
         * @param int $id ID новости.
         * @param array $data Данные для обновления (title, content, category, image_url, status, tags).
         * @return void Возвращает сообщение об успешном обновлении.
         */
        if ($method === 'PUT') {
            $user = authenticate();
            $data = json_decode(file_get_contents("php://input"), true);
        
            $stmt = $pdo->prepare("
                UPDATE news 
                SET title = :title, 
                    content = :content, 
                    category = :category, 
                    image_url = :image_url, 
                    status = :status, 
                    tags = :tags
                WHERE id = :id AND author_id = :author_id
            ");
        
            $stmt->execute([
                'title'      => $data['title'] ?? '',
                'content'    => $data['content'] ?? '',
                'category'   => $data['category'] ?? '',
                'image_url'  => $data['image_url'] ?? '',
                'status'     => $data['status'] ?? 'draft',
                'tags'       => trim($data['tags'] ?? ''),
                'id'         => $newsId,
                'author_id'  => $user['sub']
            ]);
        
            echo json_encode(['message' => 'Новость обновлена']);
            exit;
        }

        /**
         * Удаление новости.
         * 
         * @method DELETE
         * @param int $id ID новости.
         * @return void Возвращает сообщение об успешном удалении.
         */
        if ($method === 'DELETE') {
            $user = authenticate();
        
            if ($user['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(["error" => "Удаление разрешено только администраторам"]);
                exit;
            }
        
            $stmt = $pdo->prepare("DELETE FROM news WHERE id = :id");
            $stmt->execute(['id' => $newsId]);
        
            echo json_encode(["message" => "Новость удалена"]);
            exit;
        }
    }
}
