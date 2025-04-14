import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import DishesList from './pages/DishesList';
import Profile from './pages/Profile';

// Simple helper to read a cookie by name.
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const Navigation: React.FC<{ user: any; setUser: (user: any) => void }> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      {user ? (
        <>
          <Link to="/profile" style={{ marginRight: '1rem' }}>{user.fullName}</Link>
          {user.role === 'Admin' && (
            <Link to="/admin" style={{ marginRight: '1rem' }}>Admin Panel</Link>
          )}
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Optionally, you can still restore a user state from localStorage.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
        setUser(null);
      }
    }

    // Read the refresh token expiration from the cookie.
    const expireString = getCookie("refreshTokenExpire");
    if (expireString) {
      const expirationDate = new Date(expireString);
      const now = new Date();
      if (now >= expirationDate) {
        // Already expired.
        localStorage.removeItem('user');
        setUser(null);
      } else {
        const timeout = expirationDate.getTime() - now.getTime();
        // Schedule logout when the refresh token cookie expires.
        const logoutTimer = setTimeout(() => {
          localStorage.removeItem('user');
          setUser(null);
          // Optionally, redirect to login.
          window.location.href = "/login";
        }, timeout);

        // Clean up the timer on unmount.
        return () => clearTimeout(logoutTimer);
      }
    }
  }, []);

  return (
    <Router>
      <Navigation user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<DishesList />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
