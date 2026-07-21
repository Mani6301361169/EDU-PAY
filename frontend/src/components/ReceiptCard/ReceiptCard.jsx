import React, { useRef } from 'react';
import styles from './ReceiptCard.module.css';
import { FiDownload, FiPrinter, FiCheckCircle, FiBookOpen } from 'react-icons/fi';
import Button from '../Button/Button';

const ReceiptCard = ({ receipt }) => {
  const receiptRef = useRef();

  if (!receipt) return <p className={styles.error}>No receipt selected.</p>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`${styles.container} glass-panel`} ref={receiptRef}>
      <div className={styles.header}>
        <div className={styles.college}>
          <FiBookOpen className={styles.logoIcon} />
          <div>
            <h3 className={styles.collegeName}>EduPay International College</h3>
            <p className={styles.subText}>Affiliated to Central University | ISO 9001:2015</p>
          </div>
        </div>
        <div className={styles.statusBadge}>
          <FiCheckCircle /> SUCCESS
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <div>
            <span className={styles.label}>Receipt Number</span>
            <span className={styles.val}>{receipt.id}</span>
          </div>
          <div>
            <span className={styles.label}>Payment Date</span>
            <span className={styles.val}>{receipt.date}</span>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.row}>
          <div>
            <span className={styles.label}>Student Name</span>
            <span className={styles.val}>{receipt.studentName}</span>
          </div>
          <div>
            <span className={styles.label}>Student ID</span>
            <span className={styles.val}>{receipt.studentId}</span>
          </div>
        </div>

        <div className={styles.row} style={{ marginTop: '16px' }}>
          <div>
            <span className={styles.label}>Fee Category</span>
            <span className={styles.val}>{receipt.feeType || 'Tuition Fee'}</span>
          </div>
          <div>
            <span className={styles.label}>Payment Method</span>
            <span className={styles.val}>{receipt.method}</span>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.amountSection}>
          <span className={styles.totalLabel}>Total Paid Amount</span>
          <h2 className={styles.totalVal}>₹{receipt.amount?.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="outline" size="small" onClick={handlePrint} icon={FiPrinter}>
          Print Receipt
        </Button>
        <Button variant="primary" size="small" onClick={() => alert('PDF download simulated successfully!')} icon={FiDownload}>
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ReceiptCard;
