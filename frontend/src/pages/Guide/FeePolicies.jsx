import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './Guide.module.css';
import { FiFileText, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function FeePolicies() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.card} glass-panel`}>
          <span className={styles.badge}>Institutional Governance</span>
          <h1 className={styles.title}>
            Fee <span className={styles.highlight}>Policies & Guidelines</span>
          </h1>
          <p className={styles.lead}>
            EduPay follows transparent and institution-approved fee policies to ensure fairness and accountability in every transaction. Students are encouraged to verify their selected fee category and payment amount before confirming any payment. Once a transaction is successfully processed, a digital receipt is generated automatically and recorded in the system for future reference.
          </p>
          <p className={styles.lead}>
            Refunds, if applicable, are processed according to the institution's official refund guidelines and approval procedures. Any duplicate payments, failed transactions, or payment disputes will be reviewed by the accounts department before necessary action is taken. Students are advised to retain their digital receipts until the payment has been successfully verified by the institution. All payment records remain securely available within the EduPay portal for future reference and auditing.
          </p>

          <div className={styles.highlightsGrid}>
            <div className={styles.highlightBox}>
              <FiShield className={styles.icon} />
              <h4>Verification First</h4>
              <p>Verify fee categories prior to payment checkout.</p>
            </div>
            <div className={styles.highlightBox}>
              <FiAlertTriangle className={styles.icon} />
              <h4>Refund Audit</h4>
              <p>Reviewed by central accounts as per college rules.</p>
            </div>
            <div className={styles.highlightBox}>
              <FiFileText className={styles.icon} />
              <h4>Audit Record Retention</h4>
              <p>Digital receipts stored permanently for audit trails.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
