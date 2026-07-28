import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Contact.module.css';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.contactCard}>
          <h1 className={styles.title}>
            Contact <span className={styles.highlight}>EduPay</span> Support
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Have questions regarding fee structures, online payments, or account access? Reach out to our accounts helpdesk.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <FiMail className={styles.icon} />
              <div>
                <p className={styles.infoTitle}>Email Support</p>
                <p className={styles.infoText}>support@college.edu</p>
              </div>
            </div>

            <div className={styles.infoBox}>
              <FiPhone className={styles.icon} />
              <div>
                <p className={styles.infoTitle}>Helpline Number</p>
                <p className={styles.infoText}>+91 98765 43210</p>
              </div>
            </div>

            <div className={styles.infoBox}>
              <FiMapPin className={styles.icon} />
              <div>
                <p className={styles.infoTitle}>Campus Address</p>
                <p className={styles.infoText}>Mother Teresa Institute of Tech</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
