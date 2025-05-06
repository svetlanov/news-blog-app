
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setToken, setUser, logout, setAuthError } from './authSlice';

const API = 'http://localhost:8000/api';

export const loginUser = (email, password, navigate) => async (dispatch) => {
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка входа');

      localStorage.setItem('token', data.token);
  
      const decoded = jwtDecode(data.token);
      dispatch(setToken(data.token));
      dispatch(setUser(decoded));
  
      navigate('/');
    } catch (err) {
      dispatch(setAuthError(err.message));
    }
  };

export const registerUser = (data, navigate) => async (dispatch) => {
  try {
    await axios.post(`${API}/register`, data);
    navigate('/login');
  } catch (err) {
    dispatch(setAuthError(err.response?.data?.error || 'Ошибка регистрации'));
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logout());
};

export const restoreAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');

  if (token) {
    const decoded = jwtDecode(token); // 📥 расшифровываем JWT
    dispatch(setToken(token));
    dispatch(setUser(decoded));
  }
};