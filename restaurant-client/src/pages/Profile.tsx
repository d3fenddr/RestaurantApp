import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/adminService';

const Profile: React.FC = () => {
  const { user } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return <div className="container">Please log in to view your profile.</div>;
  }

  const handleChangePassword = async () => {
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setMessage('Password successfully changed.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error changing password.');
    }
  };

  return (
    <div className="container">
      <h1>Your Profile</h1>
      <p><strong>Full Name:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <h2>Change Password</h2>

      <div className="form-container">
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
          />
        </div>

        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;
