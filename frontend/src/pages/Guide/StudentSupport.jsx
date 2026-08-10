import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './Guide.module.css';
import { FiHeadphones, FiMail, FiPhone } from 'react-icons/fi';

export default function StudentSupport() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <span className={styles.badge}>Student Services</span>
          <h1 className={styles.title}>
            Student <span className={styles.highlight}>Support & Helpdesk</span>
          </h1>
          <p className={styles.lead}>
            EduPay is designed to provide reliable support for students and parents throughout their payment journey. If you experience issues with account access, fee payments, transaction failures, receipt generation, or dashboard navigation, our dedicated support team is available to assist you promptly. Our goal is to ensure every user can complete their academic payments without unnecessary delays or confusion.
          </p>
          <p className={styles.lead}>
            Students can contact the support team through email, phone, or the online helpdesk for technical assistance and payment-related inquiries. Common issues such as login problems, pending payment verification, incorrect fee details, or receipt requests are handled efficiently. Our support services are available during working hours, with responses provided as quickly as possible to ensure uninterrupted access to EduPay services.
          </p>

          <div className={styles.highlightsGrid}>
            <div className={styles.highlightBox}>
              <FiMail className={styles.icon} />
              <h4>Email Support</h4>
              <p>support@college.edu</p>
            </div>
            <div className={styles.highlightBox}>
              <FiPhone className={styles.icon} />
              <h4>Helpline Number</h4>
              <p>+91 98765 43210</p>
            </div>
            <div className={styles.highlightBox}>
              <FiHeadphones className={styles.icon} />
              <h4>Working Hours</h4>
              <p>Mon – Sat: 9:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
