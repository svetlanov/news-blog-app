import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewsById, updateNewsStatus, deleteNews } from '../store/news/newsActions';
import CommentsSection from '../components/CommentsSection';

export default function NewsDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: news, loading, error } = useSelector((state) => state.news);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchNewsById(id));
  }, [dispatch, id]);

  const handleToggleStatus = () => {
    const newStatus = news.status === 'published' ? 'draft' : 'published';
    dispatch(updateNewsStatus(id, newStatus, token));
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      dispatch(deleteNews(news.id, token));
      navigate('/');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Загрузка...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!news) return null;

  const isAdmin = user && user.role === 'admin'; // если есть роли

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {news.image_url && (
        <img
          src={`http://localhost:8000${news.image_url}`}
          alt={news.title}
          className="w-full max-h-[400px] object-cover rounded mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-4 text-gray-800">{news.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        Категория: {news.category || '—'} | Автор: {news.author} | Дата: {new Date(news.created_at).toLocaleDateString()}
      </div>

      <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">{news.content}</p>

      {(isAdmin) && (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Редактировать
          </button>

          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded text-white ${
              news.status === 'published' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {news.status === 'published' ? 'Скрыть' : 'Опубликовать'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Удалить новость
          </button>
        </div>
      )}
      <CommentsSection newsId={news?.id} />
    </div>
  );
}
