// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { changePassword } from '../services/adminService';
import './css/Profile.css';
import AddressPicker from '../components/AddressPicker';

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

  const [address, setAddress] = useState<string>('');
  const [location, setLocation] = useState<google.maps.LatLngLiteral>({ lat: 40.415002, lng: 49.853308 });
  const [addressMsg, setAddressMsg] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axios.get(`/api/address/${user.id}`, { withCredentials: true });
        if (res.data) {
          setAddress(res.data.street || '');
          setLocation({
            lat: res.data.latitude || 40.415002,
            lng: res.data.longitude || 49.853308,
          });
        }
      } catch {
        console.log('No saved address');
      }
    })();
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    try {
      await axios.put('/api/auth/update-profile', { id: user.id, fullName });
      const updatedUser = { ...user, fullName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaveMsg('Changes saved successfully!');
    } catch {
      setSaveMsg('Failed to save changes.');
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    try {
      await axios.post('/api/auth/resend-verification', { email: user.email });
      setEmailStatusMsg('Verification email sent!');
    } catch {
      setEmailStatusMsg('Failed to send verification email.');
    }
  };

  const handleSelectAddress = (addr: string, loc: google.maps.LatLngLiteral) => {
    setAddress(addr);
    setLocation(loc);
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    setAddressLoading(true);
    try {
      await axios.post(
        '/api/address',
        {
          userId: user.id,
          country: 'Azerbaijan',
          city: 'Baku',
          street: address,
          postalCode: '',
          latitude: location.lat,
          longitude: location.lng,
        },
        { withCredentials: true }
      );
      setAddressMsg('Address saved successfully!');
    } catch {
      setAddressMsg('Failed to save address.');
    } finally {
      setAddressLoading(false);
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

  if (!user) {
    return <div className="container">Please log in to view your profile.</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
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

        {user.isEmailConfirmed ? (
          <p className="profile-email-status">
            <strong>Email Status:</strong> <span className="confirmed">Confirmed ✅</span>
          </p>
        ) : (
          <>
            <p className="profile-email-status">
              <strong>Email Status:</strong> <span className="not-confirmed">Not confirmed ❌</span>
            </p>
            <button className="profile-btn" onClick={handleResendVerification}>
              Send Verification Email
            </button>
            {emailStatusMsg && <p>{emailStatusMsg}</p>}
          </>
        )}

        <button className="profile-btn" onClick={handleSaveChanges}>Save Changes</button>
        {saveMsg && <p className="success">{saveMsg}</p>}
      </div>

      <h2>Delivery Address</h2>
      <div className="profile-info">
        <AddressPicker
          initialAddress={address}
          initialLocation={location}
          onSelect={handleSelectAddress}
        />
        {address && (
          <p>
            <strong>Selected Address:</strong> {address}
          </p>
        )}
        <button
          className="profile-btn"
          onClick={handleSaveAddress}
          disabled={addressLoading}
        >
          {addressLoading ? 'Saving…' : 'Save Address'}
        </button>
        {addressMsg && <p className="success">{addressMsg}</p>}
      </div>

      <h2>Password</h2>
      <button className="profile-btn" onClick={() => setShowModal(true)}>
        Change Password
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {passwordMsg && <p className="success">{passwordMsg}</p>}
            {passwordError && <p className="error">{passwordError}</p>}

            <div className="form-group">
              <label>Old Password</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>

            <div className="modal-buttons">
              <button className="profile-btn" onClick={handleChangePassword}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
