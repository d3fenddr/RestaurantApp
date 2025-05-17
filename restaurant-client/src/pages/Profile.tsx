import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './css/Profile.css';
import AddressPicker from '../components/AddressPicker';
import ChangePasswordModal from '../components/ChangePasswordModal';
import Avatar from '../components/ui/Avatar';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';
import { FaUpload, FaTrash } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [emailStatusMsg, ] = useState<string | null>(null);
  const [saveMsg, ] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [location, setLocation] = useState<google.maps.LatLngLiteral>({ lat: 40.415002, lng: 49.853308 });
  const [addressMsg, ] = useState<string | null>(null);
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
      toast.success('Changes saved successfully!');
    } catch {
      toast.error('Failed to save changes.');
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    try {
      await axios.post('/api/auth/resend-verification', { email: user.email });
      toast.success('Verification email sent!');
    } catch {
      toast.error('Failed to send verification email.');
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
      await axios.post('/api/address', {
        userId: user.id,
        country: 'Azerbaijan',
        city: 'Baku',
        street: address,
        postalCode: '',
        latitude: location.lat,
        longitude: location.lng,
      }, { withCredentials: true });

      toast.success('Address saved successfully!');
    } catch {
      toast.error('Failed to save address.');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/imageupload/user-avatar', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = { ...user, avatarUrl: res.data.imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Avatar uploaded!');
    } catch {
      toast.error('Failed to upload avatar.');
    }
  };

  const handleAvatarDelete = async () => {
    if (!user?.avatarUrl) return;

    try {
      await axios.delete('/api/imageupload/user-avatar', {
        params: { imageUrl: user.avatarUrl },
        withCredentials: true,
      });

      const updatedUser = { ...user, avatarUrl: undefined };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Avatar deleted!');
    } catch {
      toast.error('Failed to delete avatar.');
    } finally {
      setConfirmOpen(false);
    }
  };

  if (!user) {
    return <div className="container">Please log in to view your profile.</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>Your Profile</h1>

      <div className="profile-avatar-center">
        <Avatar imageUrl={user.avatarUrl} fullName={user.fullName} size={120} />
        <div className="avatar-buttons-center">
          <label className="icon-button">
            <FaUpload />
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </label>
          {user.avatarUrl && (
            <button className="icon-button danger" onClick={() => setConfirmOpen(true)}>
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      <div className="profile-info">
        <div className="form-group">
          <label>Full Name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={user.email} disabled />
        </div>

        {user.isEmailConfirmed ? (
          <p className="profile-email-status">
            <strong>Email Status:</strong> <span className="confirmed">Confirmed</span>
          </p>
        ) : (
          <>
            <p className="profile-email-status">
              <strong>Email Status:</strong> <span className="not-confirmed">Not confirmed</span>
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

      <h2>Password</h2>
      <div className="profile-info">
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input type="password" value="********" disabled style={{ flex: 1 }} />
          <button className="profile-btn" onClick={() => setShowModal(true)}>Change Password</button>
        </div>
      </div>

      <h2>Delivery Address</h2>
      <div className="profile-info">
        <div className="address-picker-wrapper">
          <AddressPicker
            initialAddress={address}
            initialLocation={location}
            onSelect={handleSelectAddress}
          />
        </div>
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

      <ChangePasswordModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={confirmOpen}
        message="Are you sure you want to delete your avatar?"
        onConfirm={handleAvatarDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Profile;
