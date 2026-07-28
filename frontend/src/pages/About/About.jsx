import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './About.module.css';
import { FiShield, FiCpu, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function About() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        {/* Main Hero Overview Card */}
        <div className={`${styles.heroCard} glass-panel`}>
          <span className={styles.badge}>Institutional Ecosystem</span>
          <h1 className={styles.title}>
            About <span className={styles.highlight}>EduPay</span> Platform
          </h1>
          <p className={styles.text}>
            EduPay is an integrated institutional financial management platform designed to eliminate lines at fee counters, automate administrative ledger reconciliations, and provide transparent payment workflows for modern educational institutions.
          </p>
          <p className={styles.text}>
            With real-time security logs, PCI-DSS compliant online payment integrations, and multi-role access for Students, Parents, Accountants, and Administrators, EduPay delivers a seamless digital fee experience.
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

        {/* Benefits & Features Grid */}
        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Platform Architecture & Core Benefits</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} glass-panel`}>
              <FiShield className={styles.featureIcon} />
              <h3>Bank-Grade Security</h3>
              <p>PCI-DSS certified gateway integrations ensure all fee transactions are encrypted and audited.</p>
            </div>
            <div className={`${styles.featureCard} glass-panel`}>
              <FiCpu className={styles.featureIcon} />
              <h3>Automated Receipts</h3>
              <p>Digital receipts are generated instantly upon payment confirmation and saved in student history.</p>
            </div>
            <div className={`${styles.featureCard} glass-panel`}>
              <FiTrendingUp className={styles.featureIcon} />
              <h3>Institutional Reporting</h3>
              <p>Real-time financial analytics, monthly audit trails, and department-wise recovery reports for admins.</p>
            </div>
          </div>
        </div>

        {/* Key Values List */}
        <div className={`${styles.valuesCard} glass-panel`}>
          <h3>Why Educational Institutions Choose EduPay</h3>
          <ul className={styles.valuesList}>
            <li><FiCheckCircle className={styles.checkIcon} /> Complete elimination of manual fee queues & cash handling errors</li>
            <li><FiCheckCircle className={styles.checkIcon} /> Direct SMS/Email notification dispatches for upcoming installment dues</li>
            <li><FiCheckCircle className={styles.checkIcon} /> Dedicated parent portal for hassle-free remote payments</li>
            <li><FiCheckCircle className={styles.checkIcon} /> Role-Based Access Control (RBAC) protecting sensitive academic financial records</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
