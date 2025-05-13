import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasswordField from '../components/PasswordField';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token is missing');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (/[а-яА-ЯёЁ]/.test(newPassword)) {
      setError('Password must not contain Cyrillic characters');
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        newPassword,
      });

      toast.success('Password has been reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed.');
    }
  };

  return (
    <div className="card form-container">
      <h2>Reset Password</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          validateLatinOnly
          matchValue={confirmPassword}
          showMatchWarning
        />
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          validateLatinOnly
          matchValue={newPassword}
          showMatchWarning
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
