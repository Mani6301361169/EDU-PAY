import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './About.module.css';
import { FiShield, FiCpu, FiTrendingUp, FiUsers } from 'react-icons/fi';

export default function About() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        {/* Concise Hero Section */}
        <div className={`${styles.heroCard} glass-panel`}>
          <span className={styles.badge}>About EduPay</span>
          <h1 className={styles.title}>
            Simplifying <span className={styles.highlight}>Academic Finance</span>
          </h1>
          <p className={styles.text}>
            EduPay is a modern institutional fee management platform designed to eliminate counter queues and simplify fee workflows. We empower colleges with seamless digital fee collection, instant digital receipts, and transparent real-time ledger tracking.
          </p>

          {/* Key Statistics */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statVal}>99.9%</div>
              <div className={styles.statLabel}>Success Rate</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>15K+</div>
              <div className={styles.statLabel}>Active Students</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>100%</div>
              <div className={styles.statLabel}>Digital Transparency</div>
            </div>
          </div>
        </div>

        {/* 4 Core Features */}
        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Core Platform Features</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} glass-panel`}>
              <FiShield className={styles.featureIcon} />
              <h3>Bank-Grade Security</h3>
              <p>256-bit encrypted gateway transactions with complete data privacy compliance.</p>
            </div>
            <div className={`${styles.featureCard} glass-panel`}>
              <FiCpu className={styles.featureIcon} />
              <h3>Instant PDF Receipts</h3>
              <p>Automated payment verification and instant digital receipt generation.</p>
            </div>
            <div className={`${styles.featureCard} glass-panel`}>
              <FiTrendingUp className={styles.featureIcon} />
              <h3>Real-Time Analytics</h3>
              <p>Comprehensive ledger reports and recovery metrics for accountants and admins.</p>
            </div>
            <div className={`${styles.featureCard} glass-panel`}>
              <FiUsers className={styles.featureIcon} />
              <h3>Multi-Role Access</h3>
              <p>Dedicated access control for Students, Parents, Accountants, and Administrators.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
