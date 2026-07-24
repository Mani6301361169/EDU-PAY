import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Notifications.module.css';

export default function Notifications() {
  const { notifications, loading } = useAuth();

  return (
    <section className={styles.page}>
      <h1>Notifications</h1>
      <p>Stay updated on fee-related activity, due dates, and payment status.</p>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className={styles.emptyMessage}>No notifications right now.</p>
      ) : (
        <ul className={styles.notificationsList}>
          {notifications.map((notification, index) => (
            <li key={notification.id || index} className={styles.notificationItem}>
              <strong>{notification.title}</strong>
              <div>{notification.message}</div>
              {notification.dueDate && <div className={styles.notificationTime}>Deadline: {new Date(notification.dueDate).toLocaleDateString()}</div>}
              {notification.amount !== undefined && <div className={styles.notificationTime}>Pending amount: ₹{Number(notification.amount || 0).toLocaleString()}</div>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
