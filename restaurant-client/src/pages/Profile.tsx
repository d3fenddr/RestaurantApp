import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { changePassword } from '../services/adminService';
import './css/Profile.css';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return <div className="container">Please log in to view your profile.</div>;
  }

  const handleResendVerification = async () => {
    try {
      await axios.post('/api/auth/resend-verification', { email: user.email });
      setEmailStatusMsg('Verification email sent!');
    } catch {
      setEmailStatusMsg('Failed to send verification email.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put('/api/auth/update-profile', {
        id: user.id,
        fullName
      });

      const updatedUser = { ...user, fullName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaveMsg('Changes saved successfully!');
    } catch {
      setSaveMsg('Failed to save changes.');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMsg('Password successfully changed.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowModal(false);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Error changing password.');
    }
  };

  return (
    <div className="container">
      <h1>Your Profile</h1>

      <div className="profile-info">
        <div className="form-group">
          <label>Full Name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email (not editable)</label>
          <input value={user.email} disabled />
        </div>

        {user.role === 'Admin' && (
          <div className="form-group">
            <label>Role</label>
            <input value="Admin" disabled />
          </div>
        )}

        {user.isEmailConfirmed ? (
          <p className="profile-email-status">
            <strong>Email Status:</strong>{' '}
            <span className="confirmed">Confirmed ✅</span>
          </p>
        ) : (
          <>
            <p className="profile-email-status">
              <strong>Email Status:</strong>{' '}
              <span className="not-confirmed">Not confirmed ❌</span>
            </p>
            <button onClick={handleResendVerification} className="profile-btn">
              Send Email Verification
            </button>
            {emailStatusMsg && <p>{emailStatusMsg}</p>}
          </>
        )}

        <button onClick={handleSaveChanges}>Save Changes</button>
        {saveMsg && <p className="success">{saveMsg}</p>}
      </div>

      <h2>Password</h2>
      <button onClick={() => setShowModal(true)}>Change Password</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {passwordMsg && <p className="success">{passwordMsg}</p>}
            {passwordError && <p className="error">{passwordError}</p>}

            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>

            <div className="modal-buttons">
              <button onClick={handleChangePassword}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
