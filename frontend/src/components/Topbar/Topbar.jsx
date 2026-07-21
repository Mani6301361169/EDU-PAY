import React from 'react';
import styles from './Topbar.module.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiMenu, FiMoon, FiSun, FiBell, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Topbar = ({ onMenuToggle }) => {
  const { user, notifications } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`${styles.topbar} glass-panel`}>
      <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle Menu">
        <FiMenu />
      </button>

      <div className={styles.roleBadgeWrapper}>
        <span className={`${styles.roleBadge} ${styles[user?.role]}`}>
          {user?.role ? user.role.toUpperCase() : 'USER'}
        </span>
      </div>

      <div className={styles.actions}>
        <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle Theme">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <Link to={user?.role === 'student' ? '/student/notifications' : '/admin/dashboard'} className={styles.notificationWrapper}>
          <FiBell className={styles.actionIcon} />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </Link>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <FiUser />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user?.name}</span>
            <span className={styles.email}>{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
