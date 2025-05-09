import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        newPassword: password
      });
      setSuccess('Пароль успешно изменён');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при сбросе пароля');
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Токен отсутствует');
    }
  }, [token]);

  return (
    <div className="card form-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Сброс пароля</h1>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleReset}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Новый пароль:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Повторите пароль:</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>
        <button type="submit">Сменить пароль</button>
      </form>
    </div>
  );
};

export default ResetPassword;
