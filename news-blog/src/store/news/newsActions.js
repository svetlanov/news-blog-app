import axios from 'axios';
import {
	setNews,
	newsError,
	setLoading,
	setSelectedNews,
	setUploading,
	setUploadUrl,
	uploadError,
} from './newsSlice';

const API = 'http://localhost:8000/api';

export const fetchNews =
	(filters = {}) =>
	async (dispatch, getState) => {
		dispatch(setLoading(true));

        const token = getState().auth.token;

		try {
			const params = new URLSearchParams(filters).toString();
            const headers = {}
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

			const res = await axios.get(`${API}/news?${params}`, { headers });
			dispatch(setNews(res.data));
		} catch (err) {
			dispatch(newsError('Ошибка загрузки новостей'));
		} finally {
			dispatch(setLoading(false));
		}
	};

export const deleteNews = (id, token) => async (dispatch) => {
	try {
		await axios.delete(`${API}/news/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(fetchNews());
	} catch (err) {
		dispatch(newsError('Ошибка при удалении'));
	}
};

export const addNews = (data, token, onSuccess) => async (dispatch) => {
	try {
		await axios.post(`${API}/news`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(fetchNews());
		if (onSuccess) onSuccess();
	} catch (err) {
		dispatch(newsError('Ошибка при добавлении новости'));
	}
};

export const fetchNewsById = (id) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.get(`${API}/news/${id}`);
		dispatch(setSelectedNews(res.data));
	} catch (err) {
		dispatch(newsError('Новость не найдена'));
	} finally {
		dispatch(setLoading(false));
	}
};

export const uploadImage = (file) => async (dispatch) => {
	dispatch(setUploading(true));
	try {
		const formData = new FormData();
		formData.append('image', file);

		const res = await axios.post(
			'http://localhost:8000/api/upload',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);

		dispatch(setUploadUrl(res.data.url));
	} catch (err) {
		dispatch(uploadError('Ошибка при загрузке изображения'));
	} finally {
		dispatch(setUploading(false));
	}
};


export const updateNewsStatus = (id, newStatus, token) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
        const currentNews = getState().news.selected;

        await axios.put(
          `${API}/news/${id}`,
          {
            ...currentNews,
            status: newStatus,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      // Повторно загружаем новость
      const res = await axios.get(`${API}/news/${id}`);
      dispatch(setSelectedNews(res.data));
    } catch (err) {
      dispatch(newsError('Ошибка при обновлении статуса'));
    } finally {
      dispatch(setLoading(false));
    }
  };