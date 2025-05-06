import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../store/news/newsActions';

export default function NewsFilters() {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(user?.role === 'admin' ? 'published' : '');
  const [sortOrder, setSortOrder] = useState('desc');


  useEffect(() => {
    const params = { q: query, category, status, sort: sortOrder };
    dispatch(fetchNews(params, token));
  }, [query, category, status, sortOrder, token]);

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <input
        type="text"
        placeholder="Поиск по заголовку..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border px-3 py-2 rounded w-60"
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Все категории</option>
        <option value="Общество">Общество</option>
        <option value="Технологии">Технологии</option>
        <option value="Политика">Политика</option>
        <option value="Экономика">Экономика</option>
        <option value="Спорт">Спорт</option>
        <option value="Культура">Культура</option>
      </select>

      {user?.role === 'admin' && (
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Все статусы</option>
          <option value="published">Опубликовано</option>
          <option value="draft">Черновики</option>
        </select>
      )}
      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="desc">Сначала новые</option>
        <option value="asc">Сначала старые</option>
      </select>
    </div>
  );
}
