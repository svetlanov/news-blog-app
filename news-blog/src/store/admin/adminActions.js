// store/admin/adminActions.js
import axios from 'axios';
import { setUsers, setLoading, setError, setPendingCount, setPendingComments } from './adminSlice';

export const fetchUsers = (token) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get('http://localhost:8000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUsers(res.data));
  } catch (err) {
    dispatch(setError('Ошибка загрузки пользователей'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateUserRole = (id, role, token) => async (dispatch) => {
  try {
    await axios.post(`http://localhost:8000/api/admin/users/${id}/role`, { role }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchUsers(token)); // обновляем список
  } catch (err) {
    alert('Ошибка изменения роли');
  }
};

export const fetchPendingComments = (token) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get('http://localhost:8000/api/comments/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setPendingComments(res.data));
    } catch {
      dispatch(setError('Ошибка загрузки комментариев'));
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  export const moderateComment = (id, action, token) => async (dispatch) => {
    try {
      await axios.put(`http://localhost:8000/api/comments/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchPendingComments(token));
    } catch {
      alert('Ошибка при модерации');
    }
  };

  export const fetchPendingCount = (token) => async (dispatch) => {
    try {
      const res = await axios.get('http://localhost:8000/api/comments/pending/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setPendingCount(res.data.count));
    } catch {
      dispatch(setPendingCount(0)); // fallback
    }
  };