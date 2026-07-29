import React, { useState, useEffect } from 'react';
import styles from './Forms.module.css';
import {
  FiCheckCircle,
  FiXCircle,
  FiToggleLeft,
  FiToggleRight,
  FiCopy,
  FiEye,
  FiShield,
  FiLayers,
} from 'react-icons/fi';

export default function Forms() {
  const [formState, setFormState] = useState(() => {
    const saved = localStorage.getItem('edupay_single_form');
    return saved ? JSON.parse(saved) : { active: true };
  });

  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    localStorage.setItem('edupay_single_form', JSON.stringify(formState));
  }, [formState]);

  const toggleActive = () => {
    setFormState((prev) => ({ ...prev, active: !prev.active }));
  };

  const copyUrl = (path, key) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Single Registration Form Control</h1>
          <p className={styles.pageSubtitle}>
            Manage the permanent institutional registration form and public access settings.
          </p>
        </div>
      </div>

      {/* Main Single Registration Form Card */}
      <div className={`${styles.card} glass-panel`}>
        <div className={styles.cardHeader}>
          <div className={styles.titleGroup}>
            <FiShield style={{ color: '#D4A017', fontSize: '1.8rem' }} />
            <div>
              <h2 className={styles.formTitle}>Official Institutional Registration Form</h2>
              <p className={styles.formDesc}>
                Fixed structure user credential creation form with 8 mandatory fields.
              </p>
            </div>
          </div>

          <div className={styles.statusGroup}>
            <span className={formState.active ? styles.badgeActive : styles.badgeInactive}>
              {formState.active ? <FiCheckCircle /> : <FiXCircle />}{' '}
              {formState.active ? 'ACTIVE & PUBLISHED' : 'DEACTIVATED'}
            </span>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={toggleActive}
              title="Toggle Form Access"
            >
              {formState.active ? (
                <FiToggleRight style={{ color: '#22c55e', fontSize: '2rem' }} />
              ) : (
                <FiToggleLeft style={{ color: '#6b7280', fontSize: '2rem' }} />
              )}
            </button>
          </div>
        </div>

        {/* Permanent Public Shareable Links */}
        <div className={styles.linksSection}>
          <h3>Permanent Public Registration Links</h3>
          <div className={styles.linkRow}>
            <code>{`${window.location.origin}/register`}</code>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => copyUrl('/register', 'register')}
            >
              <FiCopy /> {copiedKey === 'register' ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <div className={styles.linkRow}>
            <code>{`${window.location.origin}/forms/details`}</code>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => copyUrl('/forms/details', 'details')}
            >
              <FiCopy /> {copiedKey === 'details' ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Fixed 8 Required Fields Summary */}
        <div className={styles.fieldsSummary}>
          <h3>
            <FiLayers style={{ color: '#D4A017' }} /> Fixed Registration Structure (8 Mandatory Fields)
          </h3>
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldBadge}>1. ID / Roll Number</div>
            <div className={styles.fieldBadge}>2. Full Name</div>
            <div className={styles.fieldBadge}>3. Email Address</div>
            <div className={styles.fieldBadge}>4. Role Selection</div>
            <div className={styles.fieldBadge}>5. Department / Year</div>
            <div className={styles.fieldBadge}>6. Contact Number</div>
            <div className={styles.fieldBadge}>7. Password</div>
            <div className={styles.fieldBadge}>8. Confirm Password</div>
          </div>
        </div>

        {/* Preview Action Button */}
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.previewBtn}
            onClick={() => window.open('/forms/details', '_blank')}
          >
            <FiEye /> Open Registration Form Page
          </button>
        </div>
      </div>
    </div>
  );
}
