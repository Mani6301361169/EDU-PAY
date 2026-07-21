import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FiMenu, FiX, FiMoon, FiSun, FiBookOpen } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (!user) return;
    navigate(`/${user.role}/dashboard`);
  };

  return (
    <nav className={`${styles.navbar} glass-panel`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <FiBookOpen className={styles.logoIcon} />
          <span className={styles.logoText}>Edu<span className={styles.logoSub}>Pay</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.navLinks}>
          <Link to="/" className={styles.link}>Home</Link>
          <a href="#about" className={styles.link}>About</a>
          <a href="#contact" className={styles.link}>Contact</a>
          
          <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle Theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {user ? (
            <div className={styles.authGroup}>
              <Button onClick={handleDashboardRedirect} variant="secondary" size="small">
                Dashboard
              </Button>
              <Button onClick={logout} variant="outline" size="small">
                Logout
              </Button>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <Link to="/login">
                <Button variant="secondary" size="small">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="small">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className={styles.mobileRight}>
          <button onClick={toggleTheme} className={styles.themeBtnMobile} aria-label="Toggle Theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={`${styles.mobileMenu} glass-panel`}>
          <Link to="/" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#about" className={styles.mobileLink} onClick={() => setIsOpen(false)}>About</a>
          <a href="#contact" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Contact</a>
          
          {user ? (
            <div className={styles.mobileAuthGroup}>
              <Button onClick={() => { handleDashboardRedirect(); setIsOpen(false); }} variant="secondary" fullWidth>
                Dashboard
              </Button>
              <Button onClick={() => { logout(); setIsOpen(false); }} variant="outline" fullWidth>
                Logout
              </Button>
            </div>
          ) : (
            <div className={styles.mobileAuthGroup}>
              <Link to="/login" className={styles.fullWidth} onClick={() => setIsOpen(false)}>
                <Button variant="secondary" fullWidth>Login</Button>
              </Link>
              <Link to="/register" className={styles.fullWidth} onClick={() => setIsOpen(false)}>
                <Button variant="primary" fullWidth>Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
