import React, { useState } from 'react';
import styles from './Settings.module.css';
import { FiSave, FiShield, FiSliders } from 'react-icons/fi';

export default function Settings() {
  const [config, setConfig] = useState({
    institutionName: 'Mother Teresa Institute of Tech',
    contactEmail: 'support@college.edu',
    currency: '₹ (INR)',
    razorpayKeyId: 'rzp_test_992019481923',
    cronPingInterval: '14 Minutes (24/7 Keep-Alive Active)',
  });

  const [permissions, setPermissions] = useState({
    viewDashboard: { student: true, parent: true, accountant: true, admin: true },
    payFees: { student: true, parent: true, accountant: false, admin: true },
    downloadReceipts: { student: true, parent: true, accountant: true, admin: true },
    manageUsers: { student: false, parent: false, accountant: false, admin: true },
    configureFees: { student: false, parent: false, accountant: false, admin: true },
    exportReports: { student: false, parent: false, accountant: true, admin: true },
    sendReminders: { student: false, parent: false, accountant: true, admin: true },
  });

  const handleTogglePerm = (feature, role) => {
    setPermissions((prev) => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [role]: !prev[feature][role],
      },
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('Application configuration and RBAC Permission Matrix saved successfully!');
  };

  return (
    <div className={styles.page}>
      <div className={styles.topHeader}>
        <div>
          <h1 className={styles.mainTitle}>System Settings & Security RBAC</h1>
          <p className={styles.subtitle}>
            Manage global portal configuration, payment gateway keys & role-based permissions matrix
          </p>
        </div>

        <button type="button" onClick={handleSaveSettings} className={styles.saveBtn}>
          <FiSave /> Save Configuration
        </button>
      </div>

      {/* Global Configuration */}
      <div className={styles.settingsCard}>
        <h3 className={styles.cardTitle}>
          <FiSliders style={{ marginRight: '0.4rem', color: '#60a5fa' }} /> Institution & Payment Config
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Institution Name</label>
            <input
              type="text"
              value={config.institutionName}
              onChange={(e) => setConfig({ ...config, institutionName: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Support Contact Email</label>
            <input
              type="email"
              value={config.contactEmail}
              onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>System Currency Symbol</label>
            <input
              type="text"
              value={config.currency}
              onChange={(e) => setConfig({ ...config, currency: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Razorpay Gateway Key ID</label>
            <input
              type="text"
              value={config.razorpayKeyId}
              onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>24/7 Render Keep-Alive Auto-Ping</label>
            <input
              type="text"
              readOnly
              value={config.cronPingInterval}
              className={styles.input}
              style={{ color: '#10b981', fontWeight: 600 }}
            />
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className={styles.settingsCard}>
        <h3 className={styles.cardTitle}>
          <FiShield style={{ marginRight: '0.4rem', color: '#10b981' }} /> Role-Based Access Control (RBAC) Matrix
        </h3>
        <table className={styles.rbacTable}>
          <thead>
            <tr>
              <th>System Module / Feature</th>
              <th style={{ textAlign: 'center' }}>Student</th>
              <th style={{ textAlign: 'center' }}>Parent</th>
              <th style={{ textAlign: 'center' }}>Accountant</th>
              <th style={{ textAlign: 'center' }}>Administrator</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(permissions).map((featureKey) => (
              <tr key={featureKey}>
                <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {featureKey.replace(/([A-Z])/g, ' $1')}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={permissions[featureKey].student}
                    onChange={() => handleTogglePerm(featureKey, 'student')}
                    className={styles.checkbox}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={permissions[featureKey].parent}
                    onChange={() => handleTogglePerm(featureKey, 'parent')}
                    className={styles.checkbox}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={permissions[featureKey].accountant}
                    onChange={() => handleTogglePerm(featureKey, 'accountant')}
                    className={styles.checkbox}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={permissions[featureKey].admin}
                    onChange={() => handleTogglePerm(featureKey, 'admin')}
                    className={styles.checkbox}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
