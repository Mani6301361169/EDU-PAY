import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, students, fees, payments, loading } = useAuth();
  const student = students.find((entry) => entry._id === user?.uid || entry.email === user?.email) || user?.studentData || null;
  const studentPayments = payments.filter((payment) => payment.student?._id === student?._id || payment.student === student?._id);
  const totalFees = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const totalPaid = studentPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const remaining = Math.max(totalFees - totalPaid, 0);

  return (
    <section className={styles.profileSection}>
      <h1>Student Profile</h1>
      <p>Manage your personal details and keep track of your fee account.</p>

      {loading ? (
        <p>Loading profile details...</p>
      ) : student ? (
        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>Student account</div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Name</span><span className={styles.profileValue}>{student.name}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Email</span><span className={styles.profileValue}>{student.email}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Roll No.</span><span className={styles.profileValue}>{student.rollNo || 'Not provided'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Department</span><span className={styles.profileValue}>{student.department || 'Not provided'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Academic Year</span><span className={styles.profileValue}>{student.year || 'Not provided'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Fee Status</span><span className={styles.profileValue}>{student.feeStatus || 'Pending'}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Paid Amount</span><span className={styles.profileValue}>₹{totalPaid.toLocaleString()}</span></div>
          <div className={styles.profileField}><span className={styles.profileLabel}>Pending Amount</span><span className={styles.profileValue}>₹{remaining.toLocaleString()}</span></div>
        </div>
      ) : (
        <p>No student profile found.</p>
      )}
    </section>
  );
}
