import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './Explore.module.css';
import {
  FiCompass,
  FiShield,
  FiBell,
  FiHelpCircle,
  FiCreditCard,
  FiFileText,
  FiLock,
} from 'react-icons/fi';

export default function Explore() {
  const guides = [
    {
      step: 1,
      title: 'Sign In to Portal',
      desc: 'Log in with your registered college email and assigned role (Student, Parent, Accountant, Admin).',
    },
    {
      step: 2,
      title: 'Review Due Breakdown',
      desc: 'Inspect semester-wise fee structures including Tuition, Examination, Library, and Transport fees.',
    },
    {
      step: 3,
      title: 'Instant Online Checkout',
      desc: 'Pay using UPI, Net Banking, or Credit/Debit cards with PCI-DSS encrypted payment gateways.',
    },
    {
      step: 4,
      title: 'Download Digital Receipt',
      desc: 'Receive instant transaction confirmation and download officially signed PDF receipts.',
    },
  ];

  const announcements = [
    {
      title: 'Semester VI Fee Submission Notice',
      date: '28-Jul-2026',
      desc: 'Online fee payment window for Semester VI is now live. Avoid late submission charges by submitting before the due date.',
    },
    {
      title: 'Instant UPI Payment Integration Active',
      date: '20-Jul-2026',
      desc: 'Students and parents can now use Google Pay, PhonePe, and Paytm for zero-convenience fee payments.',
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        {/* Header Banner */}
        <div className={`${styles.heroHeader} glass-panel`}>
          <span className={styles.badge}>EduPay Knowledge Hub</span>
          <h1 className={styles.title}>
            Explore <span className={styles.highlight}>EduPay</span> Resources
          </h1>
          <p className={styles.subtitle}>
            Discover platform capabilities, payment workflow guides, official announcements, and technical documentation.
          </p>
        </div>

        {/* Official Announcements */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiBell style={{ color: '#D4A017' }} /> Latest Announcements & Notices
          </h2>
          <div className={styles.grid}>
            {announcements.map((item, idx) => (
              <div key={idx} className={`${styles.card} glass-panel`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#D4A017', fontWeight: 700 }}>
                    {item.date}
                  </span>
                  <FiBell style={{ color: '#D4A017' }} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Payment Guide */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiCreditCard style={{ color: '#D4A017' }} /> Payment Process Workflow
          </h2>
          <div className={styles.processList}>
            {guides.map((item) => (
              <div key={item.step} className={styles.stepCard}>
                <div className={styles.stepBadge}>{item.step}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Platform Highlights */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiCompass style={{ color: '#D4A017' }} /> Core System Features
          </h2>
          <div className={styles.grid}>
            <div className={`${styles.card} glass-panel`}>
              <FiShield className={styles.cardIcon} />
              <h3>PCI-DSS Bank Gateways</h3>
              <p>Bank-grade encryption protecting every online transaction with zero data leakage.</p>
            </div>
            <div className={`${styles.card} glass-panel`}>
              <FiFileText className={styles.cardIcon} />
              <h3>Instant Digital Ledger</h3>
              <p>Automated database reconciliation ensuring receipts are generated in real-time.</p>
            </div>
            <div className={`${styles.card} glass-panel`}>
              <FiLock className={styles.cardIcon} />
              <h3>Role-Based Access Control</h3>
              <p>Strict RBAC data isolation for Students, Parents, Accountants, and Administrators.</p>
            </div>
          </div>
        </div>

        {/* Quick FAQs & Official Guides */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiHelpCircle style={{ color: '#D4A017' }} /> Official Guides & Documentation
          </h2>
          <div className={styles.grid}>
            <div className={`${styles.card} glass-panel`} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/payment-guide'}>
              <h3>Payment Guide</h3>
              <p>Learn step-by-step payment instructions, fee category options, and receipt downloads.</p>
              <span style={{ color: '#D4A017', fontWeight: 700, fontSize: '0.85rem' }}>Read Guide →</span>
            </div>
            <div className={`${styles.card} glass-panel`} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/student-support'}>
              <h3>Student Support</h3>
              <p>Get instant technical assistance for login, payment verification, and receipts.</p>
              <span style={{ color: '#D4A017', fontWeight: 700, fontSize: '0.85rem' }}>View Support →</span>
            </div>
            <div className={`${styles.card} glass-panel`} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/fee-policies'}>
              <h3>Fee Policies</h3>
              <p>Review institution fee guidelines, audit trails, and refund policy procedures.</p>
              <span style={{ color: '#D4A017', fontWeight: 700, fontSize: '0.85rem' }}>Read Policies →</span>
            </div>
            <div className={`${styles.card} glass-panel`} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/helpdesk'}>
              <h3>Contact Helpdesk</h3>
              <p>Direct contact helpline, email support desk, office hours, and campus address.</p>
              <span style={{ color: '#D4A017', fontWeight: 700, fontSize: '0.85rem' }}>Contact Us →</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
