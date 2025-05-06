import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingComments, moderateComment } from '../store/admin/adminActions';

export default function AdminComments() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { pendingComments, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (token) dispatch(fetchPendingComments(token));
  }, [dispatch, token]);

  const handleModeration = (id, action) => {
    dispatch(moderateComment(id, action, token));
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🛠️ Модерация комментариев</h1>

      {loading && <p className="text-blue-500">Загрузка...</p>}
      {pendingComments.length === 0 && <p>Нет комментариев на модерации.</p>}

      <ul className="space-y-4">
        {pendingComments.map((c) => (
          <li key={c.id} className="p-4 bg-white rounded shadow border">
            <p className="text-gray-700 mb-2">
              <strong>{c.username}</strong> к статье <em>“{c.news_title}”</em>:
            </p>
            <p className="text-gray-800">{c.content}</p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleModeration(c.id, 'approve')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Одобрить
              </button>
              <button
                onClick={() => handleModeration(c.id, 'reject')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Отклонить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
