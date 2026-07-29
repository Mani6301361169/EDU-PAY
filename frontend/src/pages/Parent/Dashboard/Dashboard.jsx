import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import styles from './Dashboard.module.css';
import { FiAlertTriangle, FiUser } from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, payments, fees, students } = useAuth();

  // Dynamically resolve linked student record
  const parentEmail = user?.email?.toLowerCase();
  const parentName = user?.name?.toLowerCase();
  const parentFatherName = user?.fatherName?.toLowerCase();

  const student = students.find((item) => {
    if (!item) return false;
    if (user?.childRollNo && item.rollNo === user.childRollNo) return true;
    if (
      item.fatherName &&
      (item.fatherName.toLowerCase() === parentName ||
        item.fatherName.toLowerCase() === parentFatherName ||
        parentName?.includes(item.fatherName.toLowerCase()))
    ) {
      return true;
    }
    if (item.email && parentEmail && item.email.split('@')[0] === parentEmail.split('@')[0]) return true;
    return false;
  }) || students[0];

  const studentPayments = payments.filter(
    (payment) => payment.student?._id === student?._id || payment.student === student?._id
  );
  const summary = calculateFeeSummary(student, fees, studentPayments);

  const childName = student?.name || 'Aarav Sharma';
  const childRollNo = student?.rollNo || student?.studentId || 'CS202601';
  const childFatherName = student?.fatherName || user?.fatherName || user?.name || 'Ramesh Kumar';
  const childDept = student?.department || 'Computer Science Engineering';

  const totalFees = summary.totalFees > 0 ? summary.totalFees : (student?.totalFees || 125000);
  const paidAmount = summary.paidAmount > 0 ? summary.paidAmount : (student?.paidAmount || 0);
  const pendingAmount = summary.outstandingBalance >= 0 ? summary.outstandingBalance : (student?.pendingAmount || 0);
  const completionPercentage = totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0;

  const handlePayPending = () => {
    navigate('/parent/payments', {
      state: {
        amount: pendingAmount,
        feeType: 'College Fees',
      },
    });
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.portalCard}>
        {/* Top Header Row */}
        <div className={styles.headerRow}>
          <div className={styles.childInfo}>
            <span className={styles.portalBadge}>PARENT FINANCIAL PORTAL</span>
            <h1 className={styles.childTitle}>
              Child: {childName} (Roll No: {childRollNo})
            </h1>
            <p className={styles.institutionSubtitle}>
              <FiUser style={{ verticalAlign: '-2px', color: '#D4A017' }} /> Registered Parent/Guardian: {childFatherName} • {childDept}
            </p>
          </div>

          <button type="button" onClick={handlePayPending} className={styles.payPendingBtn}>
            Pay Pending ₹{pendingAmount.toLocaleString()}
          </button>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className={styles.metricsRow}>
          {/* Card 1: Attendance */}
          <div className={styles.metricCard}>
            <div className={`${styles.badgeSquare} ${styles.badgeGreen}`}>92%</div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Academic Attendance</span>
              <span className={styles.metricValueText}>Regular • Eligible for Exams</span>
            </div>
          </div>

          {/* Card 2: Fee Payment Completed */}
          <div className={styles.metricCard}>
            <div className={`${styles.badgeSquare} ${styles.badgeBlue}`}>
              {completionPercentage}%
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Fee Payment Completed</span>
              <span className={styles.metricValueText}>
                ₹{paidAmount.toLocaleString()} Paid / ₹{totalFees.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 3: Next Installment Due */}
          <div className={styles.metricCard}>
            <div className={`${styles.badgeSquare} ${styles.badgeWarning}`}>
              <FiAlertTriangle />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Next Installment Due</span>
              <span className={`${styles.metricValueText} ${styles.textOrange}`}>
                ₹{pendingAmount.toLocaleString()} Outstanding Balance
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
