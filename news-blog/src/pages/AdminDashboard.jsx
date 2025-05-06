import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPendingCount } from '../store/admin/adminActions';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { pendingCount } = useSelector((state) => state.admin);

  useEffect(() => {
    if (token) dispatch(fetchPendingCount(token));
  }, [dispatch, token]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🛡️ Админ-панель</h1>
      <ul className="space-y-4">
        <li>
          <Link to="/admin/users" className="text-blue-600 hover:underline">
            👥 Управление пользователями
          </Link>
        </li>
        <li>
          <Link to="/admin/comments" className="text-blue-600 hover:underline flex items-center gap-2">
            💬 Модерация комментариев
            {pendingCount > 0 && (
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </div>
  );
}
