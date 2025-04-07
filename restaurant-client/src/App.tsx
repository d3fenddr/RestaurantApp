// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import DishesList from './pages/DishesList';
import Profile from './pages/Profile';

const Navigation: React.FC<{ user: any; setUser: (user: any) => void }> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate("/"); // Перенаправление на главную страницу после выхода
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      {user ? (
        <>
          <Link to="/profile" style={{ marginRight: '1rem' }}>
            {user.fullName}
          </Link>
          {user.role === 'Admin' && (
            <Link to="/admin" style={{ marginRight: '1rem' }}>
              Admin Panel
            </Link>
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
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
        setUser(null);
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
