import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calculateFeeSummary } from '../../../utils/feeSummary';
import styles from './FeeDetails.module.css';
import {
  FiLayers,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiCreditCard,
  FiBookOpen,
  FiHome,
  FiTruck,
  FiFileText,
  FiTag,
} from 'react-icons/fi';

const CATEGORY_ICONS = {
  'College Fees': FiLayers,
  'Tuition Fees': FiBookOpen,
  'Hostel Fees': FiHome,
  'Bus Fees': FiTruck,
  'Exam Fees': FiFileText,
  'Other Fees': FiTag,
};

export default function FeeDetails() {
  const navigate = useNavigate();
  const { user, fees, payments, loading } = useAuth();
  const student = user?.studentData || user;
  const studentPayments = payments.filter(
    (payment) => payment.student?._id === student?._id || payment.student === student?._id
  );
  const summary = calculateFeeSummary(student, fees, studentPayments);

  // 6 Prescribed Categories
  const categoriesList = [
    { name: 'College Fees', total: 25000, desc: 'Institutional Infrastructure & Campus Dues' },
    { name: 'Tuition Fees', total: 45000, desc: 'Academic Instruction & Laboratory Dues' },
    { name: 'Hostel Fees', total: 15000, desc: 'Accommodation & Mess Facilities' },
    { name: 'Bus Fees', total: 10000, desc: 'Campus Transportation Service' },
    { name: 'Exam Fees', total: 5000, desc: 'Semester Evaluation & Examination Dues' },
    { name: 'Other Fees', total: 3000, desc: 'Library, Sports & Contingency Charges' },
  ];

  const handlePayNow = (feeType, amount) => {
    navigate('/student/payments', {
      state: {
        amount: amount || 5000,
        feeType: feeType || 'College Fees',
      },
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBanner}>
        <div>
          <h1 className={styles.pageTitle}>Fee Structure Breakdown</h1>
          <p className={styles.pageSubtitle}>
            Department: {student?.department || 'Computer Science'} • Academic Year: {student?.year || '2026'}
          </p>
        </div>
        {summary.outstandingBalance > 0 && (
          <button
            type="button"
            className={styles.proceedPayBtnHeader}
            onClick={() => handlePayNow('College Fees', summary.outstandingBalance)}
          >
            Pay All Remaining Dues <FiArrowRight />
          </button>
        )}
      </div>

      {loading ? (
        <div className={`${styles.card} glass-panel`}>Loading fee structure...</div>
      ) : (
        <>
          {/* Summary Overview Glass Banner */}
          <div className={`${styles.summaryOverviewCard} glass-panel`}>
            <div className={styles.summaryCol}>
              <span className={styles.summaryLabel}>Total Prescribed Fee</span>
              <span className={styles.summaryVal}>₹{summary.totalFees.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.summaryCol}>
              <span className={styles.summaryLabel}>Total Amount Paid</span>
              <span className={styles.summaryValSuccess}>₹{summary.paidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.summaryCol}>
              <span className={styles.summaryLabel}>Outstanding Dues</span>
              <span className={styles.summaryValWarning}>₹{summary.outstandingBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* 6 Category Responsive Cards */}
          <div className={styles.sectionHeader}>
            <h2>
              <FiLayers style={{ color: '#D4A017' }} /> Prescribed Fee Categories
            </h2>
          </div>

          <div className={styles.categoryGrid}>
            {categoriesList.map((cat) => {
              const categoryPayments = studentPayments.filter(
                (p) => (p.feeType || '').toLowerCase() === cat.name.toLowerCase()
              );
              const paidAmount = categoryPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
              const remaining = Math.max(0, cat.total - paidAmount);
              const isPaidOff = remaining <= 0;
              const isPartiallyPaid = paidAmount > 0 && remaining > 0;
              const IconComp = CATEGORY_ICONS[cat.name] || FiTag;

              return (
                <div key={cat.name} className={`${styles.categoryCard} glass-panel`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconTitleRow}>
                      <IconComp className={styles.catIcon} />
                      <div>
                        <h3 className={styles.catTitle}>{cat.name}</h3>
                        <p className={styles.catSub}>{cat.desc}</p>
                      </div>
                    </div>
                    <span
                      className={
                        isPaidOff
                          ? styles.statusPaid
                          : isPartiallyPaid
                          ? styles.statusPartial
                          : styles.statusPending
                      }
                    >
                      {isPaidOff ? (
                        <>
                          <FiCheckCircle /> Fully Paid
                        </>
                      ) : isPartiallyPaid ? (
                        <>
                          <FiClock /> Partial
                        </>
                      ) : (
                        <>
                          <FiClock /> Due
                        </>
                      )}
                    </span>
                  </div>

                  <div className={styles.metricsBox}>
                    <div className={styles.metricRow}>
                      <span>Total Fee</span>
                      <strong>₹{cat.total.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className={styles.metricRow}>
                      <span>Amount Paid</span>
                      <strong style={{ color: '#22c55e' }}>₹{paidAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className={styles.metricRow}>
                      <span>Remaining Dues</span>
                      <strong style={{ color: isPaidOff ? '#22c55e' : '#ef4444' }}>
                        ₹{remaining.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className={styles.metricRow}>
                      <span>Due Date</span>
                      <span className={styles.dueDateVal}>30 Aug 2026</span>
                    </div>
                  </div>

                  {!isPaidOff && (
                    <button
                      type="button"
                      className={styles.payNowBtn}
                      onClick={() => handlePayNow(cat.name, remaining)}
                    >
                      Pay Now (₹{remaining.toLocaleString('en-IN')}) <FiCreditCard />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
