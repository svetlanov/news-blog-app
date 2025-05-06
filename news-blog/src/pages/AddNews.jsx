import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNews, uploadImage } from '../store/news/newsActions';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Общество',
  'Политика',
  'Технологии',
  'Экономика',
  'Культура',
  'Спорт',
];


export default function AddNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const {
    uploading,
    uploadUrl,
    uploadError,
    error: newsError,
  } = useSelector((state) => state.news);

  const isAdmin = user?.role === 'admin';

  const availableTags = ['политика', 'спорт', 'технологии', 'общество', 'культура'];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadImage(file));
    }
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addNews(
        {
          title,
          content,
          category,
          image_url: uploadUrl,
          status,
          tags: tags.join(','),
        },
        token,
        () => navigate('/')
      )
    );
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-112px)] bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl p-8 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Добавить новость</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Заголовок</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Контент</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md min-h-[150px] resize-y focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium mb-1">Категория</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>


          <div>
            <label className="block mb-1 text-sm text-gray-700">Статус</label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Черновик</option>
              <option disabled={!isAdmin} value="published">Опубликовано</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm text-gray-700">Изображение</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2"
            onChange={handleFileChange}
          />
          {uploading && <p className="text-sm text-blue-500 mt-2">Загрузка...</p>}
          {uploadUrl && (
            <img
              src={`http://localhost:8000${uploadUrl}`}
              alt="Превью"
              className="mt-4 w-full max-h-64 object-cover rounded border"
            />
          )}
          {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm text-gray-700">Теги</label>
          <div className="flex flex-wrap gap-4 mt-1">
            {availableTags.map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={tag}
                  checked={tags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span className="text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {newsError && (
          <p className="text-red-500 text-sm text-center mb-4">{newsError}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Создать новость
        </button>
      </form>
    </div>
  );
}
