import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './MobileBottomNav.module.css';
import {
  FiHome,
  FiInfo,
  FiMail,
  FiUser,
  FiSettings,
  FiFileText,
  FiCreditCard,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiLayers,
} from 'react-icons/fi';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavButtons = () => {
    if (!user) {
      // Visitor (not logged in) - Exactly 4 buttons: Home, About, Contact, Login
      return [
        { to: '/', exact: true, icon: FiHome, label: 'Home' },
        { to: '/about', exact: false, icon: FiInfo, label: 'About' },
        { to: '/contact', exact: false, icon: FiMail, label: 'Contact' },
        { to: '/login', exact: false, icon: FiUser, label: 'Login' },
      ];
    }

    switch (user.role) {
      case 'student':
        // Logged-in Student - 5 buttons including Fee Details
        return [
          { to: '/student/dashboard', exact: false, icon: FiHome, label: 'Home' },
          { to: '/student/fees', exact: false, icon: FiLayers, label: 'Fee Details' },
          { to: '/student/receipts', exact: false, icon: FiFileText, label: 'Receipts' },
          { to: '/student/settings', exact: false, icon: FiSettings, label: 'Settings' },
          { to: '/student/profile', exact: false, icon: FiUser, label: 'Profile' },
        ];
      case 'parent':
        // Logged-in Parent
        return [
          { to: '/parent/dashboard', exact: false, icon: FiHome, label: 'Home' },
          { to: '/parent/details', exact: false, icon: FiUser, label: 'Student Details' },
          { to: '/parent/payments', exact: false, icon: FiCreditCard, label: 'Payments' },
          { to: '/parent/receipts', exact: false, icon: FiFileText, label: 'Receipts' },
        ];
      case 'accountant':
        // Logged-in Accountant
        return [
          { to: '/accountant/dashboard', exact: false, icon: FiHome, label: 'Overview' },
          { to: '/admin/students', exact: false, icon: FiUsers, label: 'Student Records' },
          { to: '/admin/payments', exact: false, icon: FiClock, label: 'Ledger' },
          { to: '/admin/reports', exact: false, icon: FiTrendingUp, label: 'Reports' },
        ];
      case 'admin':
        // Logged-in Administrator
        return [
          { to: '/admin/dashboard', exact: false, icon: FiHome, label: 'Dashboard' },
          { to: '/admin/students', exact: false, icon: FiUsers, label: 'Users' },
          { to: '/admin/fees', exact: false, icon: FiLayers, label: 'Fees Config' },
          { to: '/admin/settings', exact: false, icon: FiSettings, label: 'Settings' },
        ];
      default:
        return [
          { to: '/', exact: true, icon: FiHome, label: 'Home' },
          { to: '/about', exact: false, icon: FiInfo, label: 'About' },
          { to: '/contact', exact: false, icon: FiMail, label: 'Contact' },
          { to: '/login', exact: false, icon: FiUser, label: 'Login' },
        ];
    }
  };

  const navButtons = getNavButtons();

  return (
    <nav className={styles.bottomNavContainer} aria-label="Mobile Bottom Navigation">
      {navButtons.map((btn) => {
        const Icon = btn.icon;
        const isCurrentActive = btn.exact
          ? location.pathname === btn.to
          : location.pathname.startsWith(btn.to);

        return (
          <NavLink
            key={btn.to}
            to={btn.to}
            end={btn.exact}
            className={() => `${styles.navBtn} ${isCurrentActive ? styles.activeBtn : ''}`}
            aria-label={btn.label}
          >
            <Icon />
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
