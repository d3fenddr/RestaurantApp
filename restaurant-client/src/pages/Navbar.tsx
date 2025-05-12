import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './css/Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/terms">Terms</Link>
      </div>

      <div className="navbar-right">
        <Link to="/cart" className="cart-link">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/profile">{isAdmin ? 'Admin User' : 'Profile'}</Link>
            {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
            <button onClick={handleLogout} title="Logout" className="logout-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#fff">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M13 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c2.22 0 4.26-.82 5.82-2.18l-1.42-1.42C16.33 18.13 14.74 19 13 19c-3.87 0-7-3.13-7-7s3.13-7 7-7c1.74 0 3.33.87 4.4 2.18l1.42-1.42C17.26 3.82 15.22 3 13 3zm-1 8h8v2h-8v3l-4-4 4-4v3z" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
