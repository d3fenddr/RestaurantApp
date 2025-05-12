import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { changePassword } from '../services/adminService';
import './css/Profile.css';
import Select from 'react-select';

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

  const [address, setAddress] = useState({
    street: '',
    postalCode: ''
  });
  const [addressMsg, setAddressMsg] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ label: string; value: string } | null>(null);
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`/api/address/${user.id}`, { withCredentials: true });
        if (res.data) {
          setAddress({
            street: res.data.street || '',
            postalCode: res.data.postalCode || ''
          });
          setSelectedCountry({ label: res.data.country, value: res.data.country });
          setSelectedCity({ label: res.data.city, value: res.data.city });
        }
      } catch {
        console.log("No saved address");
      }
    };
    fetchAddress();
  }, [user]);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await axios.get('https://countriesnow.space/api/v0.1/countries');
      const countryOptions = res.data.data.map((c: any) => ({
        label: c.country,
        value: c.country
      }));
      setCountries(countryOptions);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) return;
      try {
        const res = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
          country: selectedCountry.value
        });
        const cityOptions = res.data.data.map((c: string) => ({
          label: c,
          value: c
        }));
        setCities(cityOptions);
      } catch {
        setCities([]);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    if (!user || !selectedCountry || !selectedCity) return;
    try {
      await axios.post('/api/address', {
        userId: user.id,
        country: selectedCountry.value,
        city: selectedCity.value,
        street: address.street,
        postalCode: address.postalCode
      }, { withCredentials: true });
      setAddressMsg("Address saved successfully!");
    } catch {
      setAddressMsg("Failed to save address.");
    }
  };

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

      <h2>Delivery Address</h2>
      <div className="profile-info">
        <div className="form-group">
          <label>Country</label>
          <Select
            options={countries}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Select country"
            isClearable
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <Select
            options={cities}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Select city"
            isClearable
          />
        </div>

        <div className="form-group">
          <label>Street</label>
          <input name="street" value={address.street} onChange={handleAddressChange} />
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <input name="postalCode" value={address.postalCode} onChange={handleAddressChange} />
        </div>

        <button onClick={saveAddress}>Save Address</button>
        {addressMsg && <p className="success">{addressMsg}</p>}
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
