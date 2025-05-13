import React, { useState } from 'react';
import axios from 'axios';
import PasswordField from '../components/PasswordField';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (/[а-яА-ЯёЁ]/.test(password)) {
      setError('Password must not contain Cyrillic characters');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/auth/register', { fullName, email, password }, { withCredentials: true });
      setSuccessMessage('Registration successful, please log in.');
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Register</h1>
      {error && <p className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      {successMessage && <p className="success" style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Full Name:</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <PasswordField
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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
          matchValue={password}
          showMatchWarning
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
