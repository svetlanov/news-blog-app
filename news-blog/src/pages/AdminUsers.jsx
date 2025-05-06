import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole } from '../store/admin/adminActions';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (token) dispatch(fetchUsers(token));
  }, [dispatch, token]);

  const handleRoleChange = (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    dispatch(updateUserRole(id, newRole, token));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          👥 Управление пользователями
        </h1>

        {loading && <p className="text-blue-500">Загрузка...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-600">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Имя</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Роль</th>
                <th className="px-4 py-2 border">Действие</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="text-sm border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{u.id}</td>
                  <td className="px-4 py-2 border">{u.username || '—'}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border capitalize font-medium">
                    {u.role}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      disabled={u.id === user.id}
                      onClick={() => handleRoleChange(u.id, u.role)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Сделать {u.role === 'admin' ? 'пользователем' : 'админом'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
