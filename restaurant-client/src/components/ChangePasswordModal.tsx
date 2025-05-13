import React, { useState } from 'react';
import PasswordField from './PasswordField';
import { changePassword } from '../services/adminService';
import '../pages/css/Profile.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (/[\u0400-\u04FF]/.test(newPassword)) {
      setErrorMsg('Password must not contain Cyrillic characters.');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setSuccessMsg('Password successfully changed.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Change Password</h3>

        {successMsg && <p className="success">{successMsg}</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}

        <PasswordField
          label="Old Password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
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
          label="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          validateLatinOnly
          matchValue={newPassword}
          showMatchWarning
        />

        <div className="modal-buttons">
        <button
            className="modal-button primary"
            onClick={handleSubmit}
        >
            Save
        </button>
        <button
            className="modal-button"
            onClick={onClose}
        >
            Cancel
        </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;