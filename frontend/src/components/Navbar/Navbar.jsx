import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';

const LOGO_URL = 'https://res.cloudinary.com/q2uo4xk0/image/upload/v1785232560/EDU_PAY_khxzp6.jpg';

const Navbar = () => {
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
          <img src={LOGO_URL} alt="EduPay Logo" className={styles.logoImg} />
          <span className={styles.logoText}>
            Edu<span className={styles.logoSub}>Pay</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <Link to="/" className={styles.homeGlossyBtn}>
            <FiHome /> Home
          </Link>
          <Link to="/about" className={styles.link}>
            About
          </Link>
          <Link to="/contact" className={styles.link}>
            Contact
          </Link>

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
                <Button variant="secondary" size="small">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="small">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
