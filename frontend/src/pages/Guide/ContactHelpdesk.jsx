import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './Guide.module.css';
import { FiMail, FiPhone, FiClock, FiMapPin } from 'react-icons/fi';

export default function ContactHelpdesk() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <span className={styles.badge}>Helpdesk Contact</span>
          <h1 className={styles.title}>
            Contact <span className={styles.highlight}>EduPay Helpdesk</span>
          </h1>
          <p className={styles.lead}>
            The EduPay Helpdesk is committed to providing fast and reliable assistance for all payment and account-related concerns. Whether you need help with fee payments, transaction verification, receipt downloads, login issues, or technical problems, our support team is ready to assist you with accurate and timely solutions.
          </p>

          <div className={styles.contactDetailsCard}>
            <div className={styles.detailRow}>
              <FiMail className={styles.icon} />
              <div>
                <strong>Email Support</strong>
                <p>
                  <a href="mailto:support@college.edu" className={styles.link}>
                    support@college.edu
                  </a>
                </p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <FiPhone className={styles.icon} />
              <div>
                <strong>Helpline Number</strong>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <FiClock className={styles.icon} />
              <div>
                <strong>Office Hours</strong>
                <p>Monday – Saturday, 9:00 AM – 5:00 PM</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <FiMapPin className={styles.icon} />
              <div>
                <strong>Campus Address</strong>
                <p>Mother Teresa Institute of Technology</p>
              </div>
            </div>
          </div>

          <p className={styles.lead} style={{ marginTop: '1.5rem' }}>
            You can reach us through email or phone during working hours, and our team will respond promptly to ensure a smooth and hassle-free experience with the EduPay portal.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
