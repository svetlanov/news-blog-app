import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole } from '../store/admin/adminActions';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const { token } = useSelector((state) => state.auth); // предполагается, что auth хранит токен

  useEffect(() => {
    if (token) dispatch(fetchUsers(token));
  }, [dispatch, token]);

  const handleRoleChange = (id, role) => {
    const newRole = role === 'user' ? 'admin' : 'user';
    dispatch(updateUserRole(id, newRole, token));
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">👥 Пользователи</h2>

      {loading && <p className="text-blue-500">Загрузка...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border">ID</th>
            <th className="px-3 py-2 border">Имя</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">Роль</th>
            <th className="px-3 py-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 border">{u.id}</td>
              <td className="px-3 py-2 border">{u.username}</td>
              <td className="px-3 py-2 border">{u.email}</td>
              <td className="px-3 py-2 border capitalize">{u.role}</td>
              <td className="px-3 py-2 border">
                <button
                  onClick={() => handleRoleChange(u.id, u.role)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                >
                  {u.role === 'user' ? 'Назначить админом' : 'Снять права'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
