import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchComments, addComment } from '../store/comments/commentsActions';

function CommentsSection({ newsId }) {
  const dispatch = useDispatch();
  const { list, error } = useSelector((state) => state.comments);
  const { user, token } = useSelector((state) => state.auth);

  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(fetchComments(newsId));
  }, [dispatch, newsId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(addComment(newsId, content, token));
      setContent('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">💬 Комментарии</h3>

      {list.length === 0 && <p className="text-gray-500">Комментариев пока нет.</p>}

      <ul className="space-y-4 mt-4">
        {list.map((c) => (
          <li key={c.id} className="bg-gray-50 p-3 rounded shadow-sm">
            <div className="text-sm text-gray-800 mb-1 font-semibold">{c.username}</div>
            <div className="text-gray-700 text-sm">{c.content}</div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {user ? (
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-3 border rounded resize-none"
              rows="3"
              placeholder="Ваш комментарий..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Отправить
            </button>
          </form>
        ) : (
          <p className="text-gray-600">Войдите, чтобы оставить комментарий.</p>
        )}
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export default CommentsSection;
