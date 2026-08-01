import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Dashboard.module.css';
import { FiUser, FiAlertTriangle } from 'react-icons/fi';
import { calculateFeeSummary } from '../../../utils/feeSummary';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user, students, payments, fees } = useAuth();

  const parentEmail = user?.email?.toLowerCase();
  const parentName = user?.name?.toLowerCase();
  const parentFatherName = user?.fatherName?.toLowerCase();

  const student = students.find((item) => {
    if (!item) return false;
    if (user?.childRollNo && (item.rollNo === user.childRollNo || item.studentId === user.childRollNo)) return true;
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

  const childName = student?.name || user?.name || '';
  const childRollNo = student?.rollNo || student?.studentId || '';
  const childFatherName = student?.fatherName || user?.fatherName || user?.name || '';
  const childDept = student?.department || '';

  const totalFees = summary.totalFees > 0 ? summary.totalFees : (student?.totalFees || 0);
  const paidAmount = summary.paidAmount > 0 ? summary.paidAmount : (student?.paidAmount || 0);
  const pendingAmount = summary.outstandingBalance >= 0 ? summary.outstandingBalance : (student?.pendingAmount || 0);
  const completionPercentage = totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0;
  const attendance = student?.attendance !== undefined ? student.attendance : 0;

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
      {!student && students.length === 0 ? (
        <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(20, 20, 20, 0.6)', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.35)', marginTop: '1.5rem' }}>
          <h2 style={{ color: '#D4A017', margin: '0 0 0.5rem 0' }}>No Student Data Available</h2>
          <p style={{ margin: 0, color: '#f7f1d0' }}>0 Registered Students • 0 Active Students. No linked student record found until new students register.</p>
        </div>
      ) : (
        <>
          {/* Top Parent Overview Header */}
          <div className={styles.parentOverviewHeader}>
            <span className={styles.parentBadge}>PARENT</span>
            <h2 className={styles.parentFatherName}>{childFatherName || 'Registered Parent/Guardian'}</h2>
            <p className={styles.parentEmailText}>{parentEmail || student?.email || ''}</p>
          </div>

          <div className={styles.portalCard}>
            {/* Top Header Row */}
            <div className={styles.headerRow}>
              <div className={styles.childInfo}>
                <span className={styles.portalBadge}>PARENT FINANCIAL PORTAL</span>
                <h1 className={styles.childTitle}>
                  Child: {childName} (Roll No: {childRollNo})
                </h1>
                <p className={styles.institutionSubtitle}>
                  <FiUser style={{ verticalAlign: '-2px', color: '#D4A017' }} /> Father's Name: {childFatherName} • {childDept}
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
                <div className={`${styles.badgeSquare} ${styles.badgeGreen}`}>{attendance}%</div>
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
        </>
      )}
    </div>
  );
}
