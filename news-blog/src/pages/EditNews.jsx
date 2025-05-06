import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchNewsById,
  uploadImage,
} from '../store/news/newsActions';
import axios from 'axios';

const categories = [
  'Общество',
  'Политика',
  'Технологии',
  'Экономика',
  'Культура',
  'Спорт',
];

export default function EditNews() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selected: news, uploading, uploadUrl } = useSelector((state) => state.news);
  const { token } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState([]);
  const [image_url, setImageUrl] = useState('');

  const availableTags = ['политика', 'спорт', 'технологии', 'общество', 'культура'];

  useEffect(() => {
    dispatch(fetchNewsById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (news) {
      setTitle(news.title || '');
      setContent(news.content || '');
      setCategory(news.category || '');
      setStatus(news.status || 'draft');
      setTags(news?.tags ? news.tags.split(',') : '');
      setImageUrl(news.image_url || '');
    }
  }, [news]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(uploadImage(file));
  };

  useEffect(() => {
    if (uploadUrl) {
      setImageUrl(uploadUrl);
    }
  }, [uploadUrl]);

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(tags.join(','))
      await axios.put(
        `http://localhost:8000/api/news/${id}`,
        { title, content, category, status, tags: tags.join(','), image_url },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/news/${id}`);
    } catch (err) {
      alert('Ошибка при сохранении');
    }
  };

  if (!news) return <p className="text-center mt-10 text-gray-500">Загрузка...</p>;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-112px)] bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl p-8 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Редактировать новость</h2>
        <label className="block text-sm font-medium mb-1">Заголовок</label>
        <input
          type="text"
          placeholder="Заголовок"
          className="w-full mb-4 px-3 py-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block text-sm font-medium mb-1">Контент</label>
        <textarea
          placeholder="Контент"
          className="w-full mb-4 px-3 py-2 border rounded-md min-h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>

      <label className="block text-sm font-medium mb-1">Категория</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        required
      >
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

        <label className="block text-sm font-medium mb-1">Статус</label>
        <select
          className="w-full mb-4 px-3 py-2 border rounded-md"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
        </select>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Теги</label>
          <div className="flex flex-wrap gap-4 mt-1">
            {availableTags.map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span className="text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Новое изображение</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {image_url && (
            <img
              src={`http://localhost:8000${image_url}`}
              alt="Превью"
              className="mt-4 w-full max-h-64 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
