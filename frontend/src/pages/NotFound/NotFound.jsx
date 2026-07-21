import React from 'react';
import styles from './NotFound.module.css';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass-panel`}>
        <FiAlertTriangle className={styles.icon} />
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist, has been removed, or is temporarily unavailable.</p>
        <Link to="/">
          <Button variant="primary" icon={FiHome}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
