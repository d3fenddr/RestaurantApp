import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const token = params.get('token');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    if (token) {
      axios
        .get(`/api/auth/verify-email?token=${token}`)
        .then(res => {
          const { user } = res.data;

          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);

          setMessage('Email verified successfully!');
          toast.success('Email verified successfully!');
          setTimeout(() => navigate('/'), 3000);
        })
        .catch(() => {
          setMessage('Error: Invalid or expired token.');
          toast.error('Invalid or expired token');
        });
    }
  }, [token]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;