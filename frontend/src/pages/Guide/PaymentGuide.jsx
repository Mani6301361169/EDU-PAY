import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './Guide.module.css';
import { FiCreditCard, FiShield, FiFileText } from 'react-icons/fi';

export default function PaymentGuide() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <span className={styles.badge}>Official Guide</span>
          <h1 className={styles.title}>
            EduPay <span className={styles.highlight}>Payment Guide</span>
          </h1>
          <p className={styles.lead}>
            EduPay offers a secure and convenient platform for paying educational fees online. Students and parents can choose from multiple fee categories, including <strong>College Fees, Tuition Fees, Hostel Fees, Exam Fees, and Bus Fees</strong>, then enter the desired payment amount and complete the transaction through the integrated payment gateway. Every payment is processed using encrypted technology to ensure the highest level of security and protect sensitive financial information.
          </p>
          <p className={styles.lead}>
            After a successful payment, the system instantly generates a <strong>digital receipt</strong> with a unique transaction ID, payment date, fee category, and payment status. All receipts are securely stored in the user's account, allowing them to download or print them whenever required. Users can also view their complete payment history, monitor pending dues, and receive real-time payment confirmations, making fee management simple, transparent, and hassle-free.
          </p>

          <div className={styles.highlightsGrid}>
            <div className={styles.highlightBox}>
              <FiCreditCard className={styles.icon} />
              <h4>Multiple Categories</h4>
              <p>College, Tuition, Hostel, Exam, and Bus fee payment options.</p>
            </div>
            <div className={styles.highlightBox}>
              <FiShield className={styles.icon} />
              <h4>256-Bit Security</h4>
              <p>Bank-grade encrypted gateway integrations.</p>
            </div>
            <div className={styles.highlightBox}>
              <FiFileText className={styles.icon} />
              <h4>Instant PDF Receipts</h4>
              <p>Instant digital confirmation with permanent cloud storage.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
