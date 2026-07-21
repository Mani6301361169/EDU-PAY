import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Loader;
