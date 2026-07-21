import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function Notifications() {
  const { notifications, loading } = useAuth();

  return (
    <section>
      <h1>Notifications</h1>
      <p>Stay updated on fee-related activity.</p>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications right now.</p>
      ) : (
        <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
          {notifications.map((notification, index) => (
            <li key={notification.id || index} style={{ marginBottom: '0.75rem' }}>
              <strong>{notification.title}</strong>
              <div>{notification.message}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
