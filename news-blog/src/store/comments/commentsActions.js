import axios from 'axios';
import { setComments, setCommentError } from './commentsSlice';

export const fetchComments = (newsId) => async (dispatch) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/comments/news/${newsId}`);
    dispatch(setComments(res.data));
  } catch {
    dispatch(setCommentError('Ошибка загрузки комментариев'));
  }
};

export const addComment = (newsId, content, token) => async (dispatch) => {
  try {
    await axios.post(
      'http://localhost:8000/api/comments',
      { news_id: newsId, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Комментарий отправлен на модерацию');
    dispatch(fetchComments(newsId)); // перезагрузка только одобренных
  } catch {
    dispatch(setCommentError('Ошибка при отправке комментария'));
  }
};
