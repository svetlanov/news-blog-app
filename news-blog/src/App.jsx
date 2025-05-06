import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Layout from './layout/Layout';
import AddNews from './pages/AddNews';
import NewsDetails from './pages/NewsDetails';
import EditNews from './pages/EditNews';
import AdminUsers from './pages/AdminUsers';
import AdminComments from './pages/AdminComments';    
import { useEffect } from 'react';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import { restoreAuth } from './store/auth/authActions';

const isLoggedIn = !!localStorage.getItem('token');

export default function App() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Публичные маршруты */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/edit/:id" element={<EditNews />} />
        {/* Защищённые маршруты */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminUsers />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/comments"
          element={
            <ProtectedAdminRoute>
              <AdminComments />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/add-news"
          element={token ? <AddNews /> : <Navigate to="/login" />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
