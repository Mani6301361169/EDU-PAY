import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import styles from './Dashboard.module.css';
import {
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiPieChart,
  FiClock,
  FiEye,
} from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, payments, fees } = useAuth();
  const student = user?.studentData;
  const studentPayments = payments.filter(
    (payment) => payment.student?._id === student?._id || payment.student === student?._id
  );
  const summary = calculateFeeSummary(student, fees, studentPayments);

  const handlePayNow = () => {
    navigate('/student/payments', {
      state: {
        amount: summary.outstandingBalance || 40000,
        feeType: 'Tuition Fee - Semester VI',
      },
    });
  };

  const handleViewReceipts = () => {
    navigate('/student/receipts');
  };

  // Content matching user request
  const feeBreakdownItems = [
    {
      name: 'Semester 6 Tuition Fee',
      description: 'Academic Instruction & Faculty',
      total: 75000,
      paidText: '₹45,000 Paid',
      isPaid: false,
    },
    {
      name: 'Hostel & Mess Boarding',
      description: 'AC Accommodation & Dining',
      total: 30000,
      paidText: '₹30,000 Paid',
      isPaid: true,
    },
    {
      name: 'University Exam & Lab',
      description: 'JNTUA Exam & Practical Sessions',
      total: 12000,
      paidText: '₹10,000 Due',
      isPaid: false,
      isDue: true,
    },
    {
      name: 'Library & Tech Skill Resources',
      description: 'IEEE Access & Cloud Labs',
      total: 8000,
      paidText: 'Fully Paid',
      isPaid: true,
    },
  ];

  const transactionLedger = [
    {
      receiptNo: 'RCP-2026-8891',
      date: '27-Jul-2026',
      particulars: 'Sem VI Tuition & Exam Fee',
      amount: 40000,
      method: 'Razorpay UPI',
    },
    {
      receiptNo: 'RCP-2026-4310',
      date: '10-Jan-2026',
      particulars: 'Sem V Hostel & Mess Fee',
      amount: 30000,
      method: 'Credit Card',
    },
    {
      receiptNo: 'RCP-2026-1120',
      date: '05-Aug-2025',
      particulars: 'Sem V Tuition Fee',
      amount: 15000,
      method: 'Net Banking',
    },
  ];

  // Effective display values
  const displayName = student?.name || user?.name || '';
  const displayFatherName = student?.fatherName || user?.fatherName || '';
  const displayDept = student?.department || '';
  const displayRollNo = student?.rollNo || student?.studentId || '';
  const displayAttendance = student?.attendance !== undefined ? student.attendance : 0;

  const totalScheduledFee = summary.totalFees > 0 ? summary.totalFees : (student?.totalFees || 0);
  const totalPaid = summary.paidAmount > 0 ? summary.paidAmount : (student?.paidAmount || 0);
  const outstandingDue = summary.outstandingBalance > 0 ? summary.outstandingBalance : (student?.pendingAmount || 0);
  const scholarshipGrant = student?.scholarship ? student.scholarship : 0;
  const percentageCleared = totalScheduledFee > 0 ? Math.round((totalPaid / totalScheduledFee) * 100) : 0;

  return (
    <div className={styles.dashboardPage}>
      {/* Top Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.bannerInfo}>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeYear}`}>ACADEMIC YEAR 2025-26</span>
            <span className={`${styles.badge} ${styles.badgeActive}`}>SEM VI ACTIVE</span>
          </div>
          <h1 className={styles.welcomeTitle}>Welcome back, {displayName}!</h1>
          <p className={styles.subDetails}>
            Department of {displayDept} • Roll No: {displayRollNo} • Father's Name: {displayFatherName}
          </p>
        </div>
        <div className={styles.bannerActions}>
          <button type="button" onClick={handlePayNow} className={styles.payNowBtn}>
            <FiCreditCard /> Pay Outstanding Fee (₹{outstandingDue.toLocaleString()})
          </button>
          <button type="button" onClick={handleViewReceipts} className={styles.downloadReceiptBtn}>
            <FiDownload /> Download Receipt
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Total Scheduled Fee</span>
            <FiFileText className={`${styles.metricIcon} ${styles.valueNeutral}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valueNeutral}`}>
            ₹{totalScheduledFee.toLocaleString()}
          </div>
          <p className={styles.metricSubtext}>Tuition, Hostel, Lab & Library</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Total Fee Paid</span>
            <FiCheckCircle className={`${styles.metricIcon} ${styles.valueSuccess}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valueSuccess}`}>
            ₹{totalPaid.toLocaleString()}
          </div>
          <p className={styles.metricSubtext}>{percentageCleared}% Fees Cleared</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Outstanding Due</span>
            <FiAlertCircle className={`${styles.metricIcon} ${styles.valueWarning}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valueWarning}`}>
            ₹{outstandingDue.toLocaleString()}
          </div>
          <p className={styles.metricSubtext}>Due by Next Semester</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Academic Attendance</span>
            <FiAward className={`${styles.metricIcon} ${styles.valueSuccess}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valueSuccess}`}>
            {displayAttendance}%
          </div>
          <p className={styles.metricSubtext}>Regular • Exam Eligible</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Scholarship / Grant</span>
            <FiAward className={`${styles.metricIcon} ${styles.valueInfo}`} />
          </div>
          <div className={`${styles.metricValue} ${styles.valueInfo}`}>
            ₹{scholarshipGrant.toLocaleString()}
          </div>
          <p className={styles.metricSubtext}>Merit Concession Applied</p>
        </div>
      </div>

      {/* 2-Column Split: Fee Breakdown & Transaction Ledger */}
      <div className={styles.contentSplit}>
        {/* Left Column: Fee Breakdown */}
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <FiPieChart /> Fee Breakdown (Sem VI)
            </h3>
          </div>
          <div className={styles.feeList}>
            {feeBreakdownItems.map((fee, index) => (
              <div key={index} className={styles.feeItem}>
                <div className={styles.feeMain}>
                  <span className={styles.feeName}>{fee.name}</span>
                  <span className={styles.feeDescription}>{fee.description}</span>
                </div>
                <div className={styles.feeAmounts}>
                  <span className={styles.feeTotal}>₹{fee.total.toLocaleString()}</span>
                  <span
                    className={`${styles.feeStatusTag} ${
                      fee.isDue ? styles.tagDue : styles.tagPaid
                    }`}
                  >
                    {fee.paidText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Transaction History & Ledger */}
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <FiClock /> Transaction History & Ledger
            </h3>
            <span className={styles.sectionSubtitle}>
              Showing {transactionLedger.length} verified payments
            </span>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.ledgerTable}>
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Date</th>
                  <th>Particulars</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactionLedger.map((row, index) => (
                  <tr key={index}>
                    <td className={styles.receiptNo}>{row.receiptNo}</td>
                    <td>{row.date}</td>
                    <td>{row.particulars}</td>
                    <td className={styles.amountGreen}>₹{row.amount.toLocaleString()}</td>
                    <td>
                      <span className={styles.methodBadge}>{row.method}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={handleViewReceipts}
                        className={styles.viewBtn}
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
