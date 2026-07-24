import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Receipts.module.css';

export default function Receipts() {
  const { payments, loading, students } = useAuth();
  const student = students.find((entry) => entry.email === 'aarav.sharma@college.edu') || students[0] || null;
  const studentPayments = payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id);

  return (
    <section>
      <h1>Receipts</h1>
      <p>View your child’s payment receipts.</p>

      {loading ? (
        <p>Loading receipts...</p>
      ) : studentPayments.length === 0 ? (
        <p className={styles.emptyMessage}>No receipts available yet.</p>
      ) : (
        <div className={styles.receiptsGrid}>
          {studentPayments.map((payment) => (
            <div key={payment._id || payment.id} className={styles.receiptItem}>
              <div className={styles.receiptHeader}>
                <span className={styles.receiptId}>Receipt #{payment._id || payment.id}</span>
                <span className={styles.receiptDate}>{new Date(payment.paidAt || payment.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className={styles.receiptAmount}>₹{Number(payment.amount || 0).toLocaleString()}</div>
              <div>Fee Type: {payment.feeType || 'Tuition Fee'}</div>
              <div>Status: {payment.status || 'Success'}</div>
              <div>Method: {payment.method || 'Online'}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
