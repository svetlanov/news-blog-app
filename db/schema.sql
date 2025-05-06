-- =====================
-- Таблица пользователей
-- =====================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- ================
-- Таблица новостей
-- ================
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    tags TEXT DEFAULT '', -- Тэги через запятую: "php,react,новости"
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Таблица комментариев
-- =====================
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 👤 Тестовые пользователи
INSERT INTO users (username, email, password, role) VALUES
  ('admin', 'admin@example.com', '$2y$12$AyG8n9RK9NLeRinw5eCA7O3f4T7/eUjel1ahM7xMNE5rhSu8ty5f6', 'admin'), -- пароль: test
  ('user1', 'user1@example.com', '$2y$12$AyG8n9RK9NLeRinw5eCA7O3f4T7/eUjel1ahM7xMNE5rhSu8ty5f6', 'user'),
  ('user2', 'user2@example.com', '$2y$12$AyG8n9RK9NLeRinw5eCA7O3f4T7/eUjel1ahM7xMNE5rhSu8ty5f6', 'user');

-- 📰 Тестовые новости
INSERT INTO news (title, content, category, image_url, status, tags, author_id) VALUES
  ('Первая новость', 'Содержимое первой новости', 'Технологии', '', 'published', 'react,js,новости', 1),
  ('Черновик новости', 'Это черновик статьи', 'Общество', '', 'draft', 'draft,test', 1),
  ('Вторая новость', 'Описание второй новости', 'Развлечения', '', 'published', 'humor,games', 2);

-- 💬 Тестовые комментарии
INSERT INTO comments (news_id, user_id, content, status) VALUES
  (1, 2, 'Классная статья, спасибо!', 'approved'),
  (1, 3, 'Согласен, очень полезно.', 'pending'),
  (3, 2, 'Добавьте больше примеров.', 'approved');
