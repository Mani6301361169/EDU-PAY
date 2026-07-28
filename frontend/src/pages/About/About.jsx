import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './About.module.css';

export default function About() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.heroCard}>
          <h1 className={styles.title}>
            About <span className={styles.highlight}>EduPay</span> Portal
          </h1>
          <p className={styles.text}>
            EduPay is an institutional financial management platform designed to streamline fee collection, payment verification, student scholarship tracking, and automated receipt generation.
          </p>
          <p className={styles.text}>
            With real-time security logs, instant Razorpay payment integration, and multi-role dashboards for Students, Parents, Accountants, and Administrators, EduPay provides an efficient and transparent financial ecosystem.
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statVal}>100%</div>
              <div className={styles.statLabel}>Transparent Ledger</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>24/7</div>
              <div className={styles.statLabel}>Instant Online Payments</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>5+</div>
              <div className={styles.statLabel}>Active Departments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
