import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../store/news/newsActions';
import { Link } from 'react-router-dom';
import NewsFilters from '../components/NewsFilter';

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.news);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Новости</h1>
      <NewsFilters />
      {loading && <p className="text-gray-500 text-center">Загрузка...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((news) => (
          <div key={news.id} className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              {news.title}
            </h2>
            <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-2 items-center">
              <span>
                🗓 {new Date(news.created_at).toLocaleDateString('ru-RU')}
              </span>

              {news.tags && news.tags.trim() && (
                <div className="flex flex-wrap gap-2">
                  {news.tags.split(',').map((tag, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {isAdmin && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${news.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}
              >
                {news.status === 'published' ? 'опубликовано' : 'черновик'}
              </span>
            )}
            <p className="text-gray-600 mt-1 line-clamp-2">{news.content}</p>
            <div className="text-sm text-gray-400 mt-2">Категория: {news.category}</div>
            <Link
              to={`/news/${news.id}`}
              className="inline-block mt-3 text-blue-600 hover:underline"
            >
              Читать →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
