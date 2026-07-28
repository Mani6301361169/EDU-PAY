import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import styles from './Dashboard.module.css';
import { FiAlertTriangle } from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();
  const { payments, fees, students } = useAuth();
  
  // Selected child / student data
  const student = students.find((item) => item.email === 'aarav.sharma@college.edu') || students[0];
  const studentPayments = payments.filter(
    (payment) => payment.student?._id === student?._id || payment.student === student?._id
  );
  const summary = calculateFeeSummary(student, fees, studentPayments);

  const childName = student?.name || 'Mani Kanta';
  const childRollNo = student?.rollNo || '21631A0501';
  const childDept = student?.department || 'Computer Science Engineering';

  const totalFees = summary.totalFees > 0 ? summary.totalFees : 125000;
  const paidAmount = summary.paidAmount > 0 ? summary.paidAmount : 85000;
  const pendingAmount = summary.outstandingBalance > 0 ? summary.outstandingBalance : 40000;
  const completionPercentage = Math.round((paidAmount / totalFees) * 100) || 68;

  const handlePayPending = () => {
    navigate('/parent/payments', {
      state: {
        amount: pendingAmount,
        feeType: 'Tuition Fee - Semester VI',
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
              Mother Teresa Institute of Tech • {childDept}
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
                ₹{pendingAmount.toLocaleString()} by 15-Aug-2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
