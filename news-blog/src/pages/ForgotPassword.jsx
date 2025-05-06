import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/server/index.php/api/forgot-password', { email });
    setMessage(res.data.message || res.data.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Забыли пароль?</h2>
      <input
        type="email"
        value={email}
        placeholder="Введите email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Отправить ссылку</button>
      <p>{message}</p>
    </form>
  );
}
