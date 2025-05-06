import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`/server/index.php/api/reset-password`, { token, password });
    setMsg(res.data.message || res.data.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Новый пароль</h2>
      <input
        type="password"
        placeholder="Введите новый пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Сбросить</button>
      <p>{msg}</p>
    </form>
  );
}
