import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, students, fees, payments, loading } = useAuth();
  const student = students.find((entry) => entry.email === 'aarav.sharma@college.edu') || students[0] || null;
  const studentPayments = payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id);
  const totalFees = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const totalPaid = studentPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const remaining = Math.max(totalFees - totalPaid, 0);

  return (
    <section className={styles.profileSection}>
      <h1>Parent Profile</h1>
      <p>View your account details and linked student information.</p>

      {loading ? (
        <p>Loading profile details...</p>
      ) : (
        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>Guardian account</div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Parent Name</span><span className={styles.profileValue}>{user?.name || 'Not available'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Email</span><span className={styles.profileValue}>{user?.email || 'Not available'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Linked Student</span><span className={styles.profileValue}>{student?.name || 'No linked student found'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Department</span><span className={styles.profileValue}>{student?.department || 'Not provided'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Academic Year</span><span className={styles.profileValue}>{student?.year || 'Not provided'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Payable Balance</span><span className={styles.profileValue}>₹{remaining.toLocaleString()}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Amount Paid</span><span className={styles.profileValue}>₹{totalPaid.toLocaleString()}</span></div>
        </div>
      )}
    </section>
  );
}
