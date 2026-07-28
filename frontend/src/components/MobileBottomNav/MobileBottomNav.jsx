import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './MobileBottomNav.module.css';
import { FiHome, FiInfo, FiUser } from 'react-icons/fi';

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className={styles.bottomNavContainer} aria-label="Mobile Navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.activeBtn : ''}`
        }
        aria-label="Home"
      >
        <FiHome />
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.activeBtn : ''}`
        }
        aria-label="About"
      >
        <FiInfo />
      </NavLink>

      <NavLink
        to="/login"
        className={() => {
          const isAuthPage = ['/login', '/register', '/student/dashboard', '/parent/dashboard', '/accountant/dashboard', '/admin/dashboard'].some(path => location.pathname.startsWith(path));
          return `${styles.navBtn} ${isAuthPage ? styles.activeBtn : ''}`;
        }}
        aria-label="Login or Account"
      >
        <FiUser />
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
