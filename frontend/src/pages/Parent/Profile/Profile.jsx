import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, students, fees, payments, loading } = useAuth();

  const parentEmail = user?.email?.toLowerCase();
  const parentName = user?.name?.toLowerCase();

  const student = students.find((item) => {
    if (!item) return false;
    if (user?.childRollNo && item.rollNo === user.childRollNo) return true;
    if (
      item.fatherName &&
      (item.fatherName.toLowerCase() === parentName || parentName?.includes(item.fatherName.toLowerCase()))
    ) {
      return true;
    }
    if (item.email && parentEmail && item.email.split('@')[0] === parentEmail.split('@')[0]) return true;
    return false;
  }) || students[0] || null;

  const studentPayments = payments.filter(
    (payment) => payment.student?._id === student?._id || payment.student === student?._id
  );
  const totalFees = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const totalPaid = studentPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const remaining = Math.max(totalFees - totalPaid, 0);

  const fatherNameDisplay = student?.fatherName || user?.fatherName || user?.name || '';

  return (
    <section className={styles.profileSection}>
      <h1>Parent Profile</h1>
      <p>View your account details and automatically linked student information.</p>

      {loading ? (
        <p>Loading profile details...</p>
      ) : (
        <div className={styles.profileCard}>
          <div className={styles.profileCardTitle}>Parent & Student Guardian Profile</div>
          {fatherNameDisplay && (
            <div className={styles.profileField}>
              <span className={styles.profileLabel}>Registered Father's Name</span>
              <span className={styles.profileValue}>{fatherNameDisplay}</span>
            </div>
          )}
          <div className={styles.profileField}>
            <span className={styles.profileLabel}>Email Address</span>
            <span className={styles.profileValue}>{user?.email || student?.email || 'N/A'}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.profileLabel}>Linked Student Name</span>
            <span className={styles.profileValue}>{student?.name || 'N/A'}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.profileLabel}>Student Roll Number</span>
            <span className={styles.profileValue}>{student?.rollNo || student?.studentId || 'N/A'}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.profileLabel}>Department</span>
            <span className={styles.profileValue}>{student?.department || 'Computer Science'}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.profileLabel}>Academic Year</span>
            <span className={styles.profileValue}>{student?.year || '1st Year'}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.profileLabel}>Payable Balance</span>
            <span className={styles.profileValue}>₹{remaining.toLocaleString()}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.profileLabel}>Amount Paid</span>
            <span className={styles.profileValue}>₹{totalPaid.toLocaleString()}</span>
          </div>
        </div>
      )}
    </section>
  );
}
