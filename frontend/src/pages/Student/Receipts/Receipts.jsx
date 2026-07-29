import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { downloadReceiptPDF } from '../../../utils/pdfGenerator';
import styles from './Receipts.module.css';
import { FiFileText, FiDownload, FiCheckCircle } from 'react-icons/fi';

export default function Receipts() {
  const { user, payments, loading, students } = useAuth();
  const student =
    students.find(
      (entry) => entry._id === user?.uid || entry.email === user?.email
    ) ||
    user?.studentData ||
    null;
  const studentPayments = payments.filter(
    (payment) =>
      payment.student?._id === student?._id || payment.student === student?._id
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Payment Receipts</h1>
          <p className={styles.pageSubtitle}>
            Download and print official fee payment receipts for your records.
          </p>
        </div>
      </div>

      {loading ? (
        <div className={`${styles.emptyCard} glass-panel`}>
          <p>Loading receipts...</p>
        </div>
      ) : studentPayments.length === 0 ? (
        <div className={`${styles.emptyCard} glass-panel`}>
          <FiFileText className={styles.emptyIcon} />
          <h3>No Receipts Available</h3>
          <p>No transaction receipts found. Once you complete a fee payment, your official digital receipt will appear here.</p>
        </div>
      ) : (
        <div className={styles.receiptsGrid}>
          {studentPayments.map((payment) => (
            <div key={payment._id || payment.id} className={`${styles.receiptCard} glass-panel`}>
              <div className={styles.cardHeader}>
                <div className={styles.receiptIdRow}>
                  <FiFileText className={styles.iconGold} />
                  <strong>REC-{String(payment._id || payment.id).slice(-8).toUpperCase()}</strong>
                </div>
                <span className={styles.statusBadge}>
                  <FiCheckCircle /> {payment.status || 'Success'}
                </span>
              </div>

              <div className={styles.amountLarge}>
                ₹{Number(payment.amount || 0).toLocaleString('en-IN')}
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <span>Fee Category</span>
                  <strong>{payment.feeType || 'College Fees'}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Payment Date</span>
                  <strong>
                    {new Date(payment.paidAt || Date.now()).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Transaction ID</span>
                  <strong>{payment.transactionId || `TXN-${payment._id}`}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Method</span>
                  <strong>{payment.method || 'UPI / Online'}</strong>
                </div>
              </div>

              <button
                type="button"
                className={styles.downloadBtn}
                onClick={() => downloadReceiptPDF(payment, student || user)}
              >
                <FiDownload /> Download Receipt (PDF)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
