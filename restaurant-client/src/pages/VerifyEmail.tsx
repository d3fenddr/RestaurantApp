import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [message, setMessage] = useState('Подтверждение...');
  const token = params.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get(`/api/auth/verify-email?token=${token}`)
        .then(() => {
          setMessage('Email успешно подтверждён!');
          setTimeout(() => navigate('/login'), 3000);
        })
        .catch(() => setMessage('Ошибка: токен недействителен или истёк.'));
    }
  }, [token]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
