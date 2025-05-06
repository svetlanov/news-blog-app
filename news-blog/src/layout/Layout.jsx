import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/auth/authActions';

export default function Layout() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user && user.role === 'admin'; // если есть роли

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Фиксированный хэдер */}
      <header className="bg-blue-600 text-white fixed top-0 left-0 right-0 z-50 shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold">📰 News Blog</Link>
          <nav className="space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="hover:underline">Войти</Link>
                <Link to="/register" className="hover:underline">Регистрация</Link>
              </>
            ) : (
              <>
                <Link to="/add-news" className="hover:underline">Добавить</Link>
                { isAdmin && <Link to="/admin" className="hover:underline">Админка</Link> }
                <button onClick={handleLogout} className="hover:underline">Выйти</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Контент */}
      <main className="flex-grow pt-[64px] pb-[48px] bg-gray-100">
        <Outlet />
      </main>

      {/* Фиксированный футер */}
      <footer className="bg-white text-center text-sm text-gray-500 border-t fixed bottom-0 left-0 right-0 h-12 flex items-center justify-center">
        © 2025 News Blog
      </footer>
    </div>
  );
}
