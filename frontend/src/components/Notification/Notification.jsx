import React, { useEffect } from 'react';
import styles from './Notification.module.css';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';

const Notification = ({ type = 'success', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <FiCheckCircle className={styles.iconSuccess} />;
      case 'warning': return <FiAlertTriangle className={styles.iconWarning} />;
      case 'error': return <FiXCircle className={styles.iconError} />;
      default: return null;
    }
  };

  return (
    <div className={`${styles.notification} glass-panel ${styles[type]}`}>
      {getIcon()}
      <p className={styles.message}>{message}</p>
      <button onClick={onClose} className={styles.closeBtn}>
        <FiX />
      </button>
    </div>
  );
};

export default Notification;
