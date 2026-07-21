import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../../context/AuthContext';
import { 
  FiGrid, FiCreditCard, FiClock, FiFileText, 
  FiBell, FiUser, FiSettings, FiLogOut, 
  FiUsers, FiLayers, FiTrendingUp, FiBookOpen 
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onClose) onClose();
  };

  const getLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'student':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: FiGrid },
          { to: '/student/fees', label: 'Fee Details', icon: FiLayers },
          { to: '/student/payments', label: 'Payments', icon: FiCreditCard },
          { to: '/student/receipts', label: 'Receipts', icon: FiFileText },
          { to: '/student/notifications', label: 'Notifications', icon: FiBell },
          { to: '/student/profile', label: 'Profile', icon: FiUser },
          { to: '/student/settings', label: 'Settings', icon: FiSettings }
        ];
      case 'parent':
        return [
          { to: '/parent/dashboard', label: 'Dashboard', icon: FiGrid },
          { to: '/parent/details', label: 'Student Details', icon: FiUser },
          { to: '/parent/payments', label: 'Payments', icon: FiCreditCard },
          { to: '/parent/receipts', label: 'Receipts', icon: FiFileText }
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
          { to: '/admin/students', label: 'Students', icon: FiUsers },
          { to: '/admin/fees', label: 'Fees Config', icon: FiLayers },
          { to: '/admin/payments', label: 'Payments History', icon: FiClock },
          { to: '/admin/reports', label: 'Reports', icon: FiTrendingUp },
          { to: '/admin/notifications', label: 'Notifications', icon: FiBell },
          { to: '/admin/settings', label: 'Settings', icon: FiSettings }
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className={`${styles.sidebar} glass-panel ${isOpen ? styles.open : ''}`}>
      <div className={styles.logoWrapper}>
        <FiBookOpen className={styles.logoIcon} />
        <span className={styles.logoText}>EduPay</span>
      </div>

      <nav className={styles.nav}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <Icon className={styles.linkIcon} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        <FiLogOut className={styles.linkIcon} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
