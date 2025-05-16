import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './css/Navbar.css';
import Avatar from '../components/ui/Avatar';
import { FaShoppingCart, FaMoon, FaSun, FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';

  const languages = [
    { code: 'en', label: 'English', flag: '/flags/gb.svg' },
    { code: 'ru', label: 'Русский', flag: '/flags/ru.svg' },
    { code: 'az', label: 'Azərbaycan', flag: '/flags/az.svg' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">{t('home')}</Link>
        <Link to="/dishes">{t('menu')}</Link>
        <Link to="/about">{t('about')}</Link>
        <Link to="/contact">{t('contact')}</Link>
        <Link to="/terms">{t('terms')}</Link>
      </div>

      <div className="navbar-right">
        {/* Language Dropdown */}
        <div className="lang-dropdown" onClick={() => setLangMenuOpen(!langMenuOpen)}>
          <img src={currentLang.flag} alt={currentLang.label} className="lang-flag" />
          <FaChevronDown size={14} />
          {langMenuOpen && (
            <div className="lang-menu">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="lang-option"
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setLangMenuOpen(false);
                  }}
                >
                  <img src={lang.flag} alt={lang.label} className="lang-flag" />
                  {lang.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title="Toggle Theme"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {theme === 'dark' ? <FaSun size={20} color="#FFA500" /> : <FaMoon size={18} color="#555" />}
        </button>

        {/* Cart */}
        <Link to="/cart" className="cart-link">
          <FaShoppingCart size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {/* Auth */}
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="profile-link">
              <Avatar imageUrl={user.avatarUrl} fullName={user.fullName} size={32} />
              <span className="profile-name">{user.fullName}</span>
            </Link>
            {isAdmin && <Link to="/admin">{t('admin')}</Link>}
            <button onClick={handleLogout} title="Logout" className="logout-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#fff">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M13 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c2.22 0 4.26-.82 5.82-2.18l-1.42-1.42C16.33 18.13 14.74 19 13 19c-3.87 0-7-3.13-7-7s3.13-7 7-7c1.74 0 3.33.87 4.4 2.18l1.42-1.42C17.26 3.82 15.22 3 13 3zm-1 8h8v2h-8v3l-4-4 4-4v3z" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <Link to="/login">{t('login')}</Link>
            <Link to="/register">{t('register')}</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;